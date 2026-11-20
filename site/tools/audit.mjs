// Walks every lab the way a child might, pressing every button, and writes down everything the coach says.
//   cd site/tools && node audit.mjs                                  (the live site, all 20 labs)
//   cd site/tools && node audit.mjs --base http://localhost:8765 nfl-03 mlb-08
// In every play: every hint, every wrong quiz option, the starting code (a "your turn" box should not pass as it is),
// every wrong answer from the answer key, then the right answer. Then the film review (first question answered wrong
// on purpose), the final card of what was learned, and the trophy on the map. Google Analytics is blocked, and the browser's
// storage is cleared afterwards, so a run leaves nothing behind.
// Writes audit/<lab>.json (every coach line, output and problem) and audit/<lab>-*.png next to this file,
// and prints the problems: a play that does not finish, an empty or odd coach line (undefined, NaN, [object…),
// a Python error where none is expected, a page error, a slow run.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url)), LABS = path.join(HERE, '..', 'labs'), OUT = path.join(HERE, 'audit');
const args = process.argv.slice(2), bi = args.indexOf('--base');
const BASE = bi >= 0 ? args.splice(bi, 2)[1] : 'https://python.mystoryland.ai';
const names = args.length ? args : fs.readdirSync(LABS).filter(f => /^(nfl|mlb)-\d\d\.js$/.test(f)).map(f => f.slice(0, -3)).sort();
const LONG = 90000;
fs.mkdirSync(OUT, { recursive: true });
const ODD = /undefined|NaN(?! means)|\[object|\$\{|null\b/;   // "NaN means empty" is a lesson, not a bug

const browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
await ctx.route(/google-analytics|googletagmanager/, r => r.abort());
let total = 0;
for (const name of names) {
  const [sport, nn] = name.split('-'), week = +nn;
  const key = JSON.parse(fs.readFileSync(path.join(LABS, 'answers', name + '.json'), 'utf8'));
  const page = await ctx.newPage(), log = { lab: name, plays: [], review: [], problems: [] };
  const problem = (play, m) => log.problems.push(play ? `play ${play}: ${m}` : m);
  page.on('pageerror', e => problem(0, 'page error: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) problem(0, 'console: ' + m.text()); });
  page.on('dialog', d => { problem(0, 'a browser pop-up opened: ' + d.message()); d.dismiss(); });
  const coach = () => page.locator('#say').innerText();
  const cell = k => page.locator('#nb .cell').nth(k - 1);
  const isDone = k => cell(k).evaluate(e => e.classList.contains('done'));
  const setCode = (k, code) => page.evaluate(([k, code]) => seasonState.cells[k - 1].ed.setValue(code), [k, code]);
  // Presses Run and answers any input( ) question, until the box is done, shows an error, or says something.
  async function runBox(k, inputs = []) {
    inputs = [...inputs];
    // A mark in the bubble: any new coach line replaces it, even one word for word the same as the last.
    const before = '…audit…', t0 = Date.now();
    await page.evaluate(m => { document.querySelector('#say').textContent = m; }, before);
    await cell(k).locator('.run').click();
    for (;;) {
      const state = await page.waitForFunction(([k, before]) => {
        const c = document.querySelectorAll('#nb .cell')[k - 1], s = seasonState.cells[k - 1];
        if (c.querySelector('.asks')) return 'ask';
        if (s.running) return '';
        return c.querySelector('.msg').textContent || document.querySelector('#say').textContent !== before || c.classList.contains('done') ? 'end' : '';
      }, [k, before], { timeout: LONG }).then(h => h.jsonValue())
        .catch(async e => { throw new Error(`play ${k} hung: ${JSON.stringify(await page.evaluate(k => ({ running: seasonState.cells[k - 1].running, say: document.querySelector('#say').textContent.slice(0, 80) }), k))}`); });
      if (state !== 'ask') break;
      await cell(k).locator('.asks input').fill(String(inputs.length ? inputs.shift() : '1'));
      await cell(k).locator('.asks input').press('Enter');
      await page.waitForTimeout(300);   // the next question may open a new box at once: the loop above waits for it
    }
    const out = await cell(k).locator('.out').innerText().catch(() => '');
    return { secs: (Date.now() - t0) / 1000, coach: await coach(), msg: await cell(k).locator('.msg').innerText(), out: out.slice(0, 300),
      err: await cell(k).locator('.out.err').count() > 0, charts: await cell(k).locator('.out img').count() };
  }
  try {
    await page.goto(`${BASE}/play.html?sport=${sport}&week=${week}`);
    await page.evaluate(() => localStorage.clear());
    await page.goto(`${BASE}/play.html?sport=${sport}&week=${week}`);
    await page.locator('#say .go').first().click(); await page.locator('#game.on').waitFor();
    await page.waitForFunction(() => /Python is ready/.test(document.querySelector('#say').textContent), null, { timeout: LONG });
    const n = await page.locator('#nb .cell').count();
    for (let k = 1; k <= n; k++) {
      const c = await page.evaluate(k => { const c = seasonState.cells[k - 1]; return { kind: c.kind, vote: !!c.vote, a: c.a, opts: c.opts?.length, hints: c.hints?.length || 0, code: c.code, task: c.task }; }, k);
      const a = key[k] || {}, rec = { play: k, kind: c.kind, task: c.task.replace(/<[^>]+>/g, ''), steps: [] };
      log.plays.push(rec);
      if (ODD.test(rec.task)) problem(k, 'odd text in the task: ' + rec.task.slice(0, 80));
      if (await cell(k).evaluate(e => e.classList.contains('wait'))) problem(k, 'still locked when its turn came');
      if (c.kind === 'quiz') {
        if (!c.vote) for (let i = 0; i < c.opts; i++) {
          if (i === c.a) continue;
          await cell(k).locator(`.opt[data-i="${i}"]`).click();
          const said = await coach(); rec.steps.push({ wrongOption: i, coach: said });
          if (!/Flag|Foul/.test(said) || said.replace(/[^a-z]/gi, '').length < 25) problem(k, `wrong option ${i}: no real tip: "${said}"`);
        }
        await cell(k).locator(`.opt[data-i="${c.vote ? 0 : c.a}"]`).click();
      } else {
        for (let h = 0; h < c.hints; h++) {
          await cell(k).locator('.hint').click();
          const said = await coach(); rec.steps.push({ hint: h + 1, coach: said });
          if (!new RegExp(`Hint ${h + 1}`).test(said) || ODD.test(said)) problem(k, `hint ${h + 1} looks wrong: "${said}"`);
        }
        if (c.kind === 'turn') {
          const r = await runBox(k, a.inputs); rec.steps.push({ startingCode: r });
          if (await isDone(k)) problem(k, 'the starting code already passes');
          else if (!r.msg && !/Not yet|Flag|Foul/.test(r.coach)) problem(k, `starting code: no tip: "${r.coach}"`);
          for (const w of a.wrong || []) {
            await setCode(k, w); const rw = await runBox(k, a.inputs); rec.steps.push({ wrong: w.slice(0, 80), ...rw });
            if (await isDone(k)) problem(k, 'a wrong answer from the key passes: ' + w.slice(0, 60));
          }
          if (a.solution) await setCode(k, a.solution);
        }
        if (c.kind === 'predict') {
          const r0 = await runBox(k); rec.steps.push({ noGuess: r0.msg });
          if (!/guess/i.test(r0.msg)) problem(k, 'running with no guess did not ask for one');
          await cell(k).locator('.guess').fill(String(a.answer));
        }
        const r = await runBox(k, a.inputs); rec.steps.push({ final: r });
        if (r.secs > 20) problem(k, `slow: ${r.secs.toFixed(0)} s`);
        if (r.err && c.kind !== 'boom') problem(k, 'Python error: ' + r.out);
        if (r.charts) await cell(k).screenshot({ path: path.join(OUT, `${name}-play${k}-chart.png`) });
      }
      if (!await isDone(k)) { problem(k, `not done. Coach: "${await coach()}"`); break; }
      const ok = await coach(); rec.coach = ok;
      if (ODD.test(ok) || ok.replace(/[^a-z]/gi, '').length < 15) problem(k, `odd coach line: "${ok}"`);
    }
    if (log.problems.some(p => /not done/.test(p))) throw new Error('stopped at a play that did not finish');
    // Film review: the first question wrong on purpose, the rest right.
    await page.locator('#say .go').click();
    const rv = await page.evaluate(() => seasonState.REVIEW.map(r => ({ a: r.a, q: r.q.replace(/<[^>]+>/g, '') })));
    for (const [i, r] of rv.entries()) {
      const pick = i === 0 ? (r.a + 1) % 3 : r.a;
      await page.locator(`#film .opt[data-i="${pick}"]:not([disabled])`).click();
      log.review.push({ q: r.q, coach: await coach() });
      await page.waitForTimeout(1500);
    }
    await page.waitForFunction(() => /TODAY YOU LEARNED/.test(document.querySelector('#film')?.textContent || ''), null, { timeout: 15000 });
    log.report = await page.locator('#film').innerText();
    // The final card lists what was learned and never grades (the child's wish, 2026-11-19), even after a missed question.
    if (/Not yet|Practice more/.test(log.report)) problem(0, 'the final card shows a grade');
    await page.locator('#film').screenshot({ path: path.join(OUT, `${name}-report.png`) });
    await page.getByRole('button', { name: 'Back to the map' }).click();
    const pin = await page.locator(`#map .pin[data-i="${week - 1}"]`).getAttribute('class');
    if (!/\bwon\b/.test(pin)) problem(0, 'no trophy on the map after the win');
  } catch (e) { problem(0, 'stopped: ' + e.message.split('\n')[0]); }
  await page.evaluate(async () => { localStorage.clear(); for (const k of await caches.keys()) await caches.delete(k); }).catch(() => {});
  await page.close();
  fs.writeFileSync(path.join(OUT, name + '.json'), JSON.stringify(log, null, 1));
  total += log.problems.length;
  console.log(`${log.problems.length ? '✗' : '✓'} ${name}  ${log.plays.length} plays, ${log.review.length} review questions`);
  log.problems.forEach(p => console.log('    ' + p));
}
await browser.close();
console.log(`${total} problems. Details: site/tools/audit/`);
process.exit(total ? 1 : 0);
