// Plays every lab from start to finish in Chromium, through the real page and its Python worker, using the answer keys.
//   cd site/tools && node playthrough.mjs            (or: node playthrough.mjs nfl-08 mlb-09; add --headed to watch)
// check-lab.mjs tests the lessons in Python alone; this one also tests the page: running, checks, input( ), charts, the film review.
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '..', '..'), LABS = path.join(HERE, '..', 'labs');
const PORT = 8800 + Math.floor(Math.random() * 100), BASE = `http://localhost:${PORT}`;
const LONG = 240000;
const wanted = process.argv.slice(2).filter(a => !a.startsWith('--'));
const names = wanted.length ? wanted : fs.readdirSync(LABS).filter(f => /^(nfl|mlb)-\d\d\.js$/.test(f)).map(f => f.slice(0, -3)).sort();

const server = spawn('node', ['server/local.mjs'], { cwd: ROOT, env: { ...process.env, PORT: String(PORT), GEMINI_API_KEY: '' }, stdio: 'ignore' });
let browser, bad = 0;
try {
  for (let t = 0; t < 50; t++) { try { if ((await fetch(BASE + '/play.html')).ok) break; } catch {} await new Promise(r => setTimeout(r, 100)); }
  browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 } });
  for (const name of names) {
    const [sp, nn] = name.split('-'), week = +nn, ans = JSON.parse(fs.readFileSync(path.join(LABS, 'answers', name + '.json'), 'utf8'));
    const page = await ctx.newPage(), errors = [];
    page.on('pageerror', e => errors.push(e.message)); page.on('dialog', d => { errors.push('pop-up: ' + d.message()); d.dismiss(); });
    try {
      await page.goto(`${BASE}/play.html?sport=${sp}&week=${week}`);
      await page.evaluate(() => localStorage.clear());
      await page.locator('#say .go').first().click(); await page.locator('#game.on').waitFor();
      const n = await page.locator('#nb .cell').count();
      for (let k = 1; k <= n; k++) {
        const cell = page.locator('#nb .cell').nth(k - 1), a = ans[k] || {};
        if (await cell.locator('.opts').count()) {   // a quiz: the right option, or any one for a vote
          const right = await page.evaluate(k => { const c = seasonState.cells[k - 1]; return c.vote ? 0 : c.a; }, k);
          await cell.locator(`.opt[data-i="${right}"]`).click();
        } else {
          if (a.solution) await cell.locator('textarea').fill(a.solution);
          if (a.answer !== undefined) await cell.locator('.guess').fill(String(a.answer));
          const inputs = [...(a.inputs || [])];
          await cell.locator('.run').click();
          for (;;) {   // answer every input( ) question, until the play is done or shows an error
            const state = await page.waitForFunction(k => { const c = document.querySelectorAll('#nb .cell')[k - 1];
              return c.classList.contains('done') ? 'done' : c.querySelector('.asks') ? 'ask' : c.querySelector('.out.err') && !seasonState.cells[k - 1].running ? 'err' : ''; }, k, { timeout: LONG }).then(h => h.jsonValue()).catch(async e => { throw new Error(`play ${k} stuck: ${await cell.locator(".out").innerText().catch(() => "")} / coach: ${await page.locator("#say").innerText()}`); });
            if (state !== 'ask') break;
            await cell.locator('.asks input').fill(String(inputs.length ? inputs.shift() : '1')); await cell.locator('.asks input').press('Enter');
            await page.waitForFunction(k => !document.querySelectorAll('#nb .cell')[k - 1].querySelector('.asks'), k);
          }
        }
        await page.waitForFunction(k => document.querySelectorAll('#nb .cell')[k - 1].classList.contains('done'), k, { timeout: 15000 })
          .catch(async () => { throw new Error(`play ${k} not done: ${await cell.locator('.out').innerText().catch(() => '')} / coach: ${await page.locator('#say').innerText()}`); });
      }
      // The film review: answer every question right, then the trophy.
      await page.locator('#say .go').click();
      const rv = await page.evaluate(() => seasonState.REVIEW.map(r => r.a));
      for (const a of rv) { await page.locator(`#film .opt[data-i="${a}"]:not([disabled])`).click(); await page.waitForTimeout(1500); }
      await page.waitForFunction(() => /SCOUTING REPORT/.test(document.querySelector('#film')?.textContent || ''), null, { timeout: 10000 });
      const charts = await page.locator('#nb .out img').count();
      if (errors.length) throw new Error('page errors: ' + errors.join(' | '));
      console.log(`✓ ${name}  (${n} plays${charts ? `, ${charts} charts` : ''})`);
    } catch (e) { bad++; console.log(`✗ ${name}  ${e.message.split('\n')[0]}`); }
    await page.close();
  }
} finally { await browser?.close(); server.kill(); }
process.exit(bad ? 1 : 0);
