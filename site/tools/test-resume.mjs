// Browser test for saving a lab in progress (IMPROVEMENTS.md item 1).
//   cd site/tools && node test-resume.mjs            (add --headed to watch)
// Starts server/local.mjs on its own port, plays Week 1 in Chromium with real Python, reloads half way and checks
// that "Continue" brings back the boxes and Python's memory (no NameError), and that "Start over" clears them.
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '..', '..');
const PORT = 8800 + Math.floor(Math.random() * 100), BASE = `http://localhost:${PORT}`;
const ANS = JSON.parse(fs.readFileSync(path.join(HERE, '..', 'labs', 'answers', 'nfl-01.json'), 'utf8'));
const LONG = 240000;   // the first load of Python and pandas can be slow

const server = spawn('node', ['server/local.mjs'], { cwd: ROOT, env: { ...process.env, PORT: String(PORT), GEMINI_API_KEY: '' }, stdio: 'ignore' });
let browser, failed = false;
const step = m => console.log('  ·', m);
const must = (ok, m) => { if (!ok) throw new Error(m); };

try {
  for (let t = 0; t < 50; t++) { try { if ((await fetch(BASE + '/play.html')).ok) break; } catch {} await new Promise(r => setTimeout(r, 100)); }
  browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));

  // The code boxes are CodeMirror editors (js/editor.js): set and read their text through the page.
  const setCode = (k, code) => page.evaluate(([k, code]) => seasonState.cells[k - 1].ed.setValue(code), [k, code]);
  const getCode = k => page.evaluate(k => seasonState.cells[k - 1].ed.value, k);
  const cell = k => page.locator('#nb .cell').nth(k - 1);   // k = play number
  const coach = () => page.locator('#say').innerText();
  const waitDone = k => page.waitForFunction(k => document.querySelectorAll('#nb .cell')[k - 1]?.classList.contains('done'), k, { timeout: LONG });
  const typeIn = (k, code) => setCode(k, code);
  const run = async k => {   // stops at the first error message instead of waiting for a box that will never be done
    await cell(k).locator('.run').click();
    await page.waitForFunction(k => { const c = document.querySelectorAll('#nb .cell')[k - 1]; return c.classList.contains('done') || c.querySelector('.out.err'); }, k, { timeout: LONG });
    const err = await cell(k).locator('.out.err').count() ? await cell(k).locator('.out.err').innerText() : '';
    must(!err, `Play ${k} failed: ${err}`); await waitDone(k);
  };
  const noNameError = async () => { for (const t of await page.locator('#nb .out.err').allInnerTexts()) must(!/NameError/.test(t), 'NameError after Continue: ' + t); };
  const open = async () => { await page.goto(BASE + '/play.html?week=1'); await page.locator('#say .go').first().waitFor(); };
  const cont = async () => {
    await open(); must(/Welcome back/.test(await coach()), 'the coach did not offer to continue');
    await page.getByRole('button', { name: /Continue where I stopped/ }).click();
    await page.waitForFunction(() => /All set|film/i.test(document.querySelector('#say').textContent), null, { timeout: LONG });
  };

  step('Week 1: finish Plays 1–3, type in Play 4');
  await open(); await page.locator('#say .go').first().click(); await page.locator('#game.on').waitFor();
  await run(1);
  await typeIn(2, ANS[2].solution); await run(2);
  await cell(3).locator('.opt[data-i="1"]').click(); await waitDone(3);
  const mine = (await getCode(4)) + '\n# my own note';
  await typeIn(4, mine); await page.waitForTimeout(900);   // the save after typing waits half a second
  must(await page.locator('#saved.on').count() === 1, 'no ✓ Saved after typing');

  step('reload, Continue: Plays 1–3 done, Play 4 text kept');
  await cont();
  for (const k of [1, 2, 3]) must(await cell(k).evaluate(e => e.classList.contains('done')), `Play ${k} is not done after Continue`);
  must(await getCode(4) === mine, 'Play 4 lost the typed code');
  must(await cell(5).evaluate(e => e.classList.contains('wait')), 'Play 5 should still be locked');

  step('finish Plays 4–7, reload, Continue, then Plays 8–10 need speed_mph and combine from before the reload');
  await cell(4).locator('.guess').fill(String(ANS[4].answer)); await run(4);
  await typeIn(5, ANS[5].solution); await run(5);
  await run(6);
  await cell(7).locator('.opt[data-i="1"]').click(); await waitDone(7);
  await cont();
  for (const k of [1, 2, 3, 4, 5, 6, 7]) must(await cell(k).evaluate(e => e.classList.contains('done')), `Play ${k} is not done after the second Continue`);
  await typeIn(8, ANS[8].solution); await run(8); await noNameError();
  await run(9);
  await typeIn(10, ANS[10].solution); await run(10); await noNameError();

  step('reload, Start over: every box back to its starting code');
  await open(); await page.getByRole('button', { name: /Start over/ }).click(); await page.locator('#game.on').waitFor();
  must(await page.locator('#nb .cell.done').count() === 0, 'Start over kept finished boxes');
  must(await page.evaluate(() => localStorage.getItem('progress:nfl-01')) === null, 'Start over kept the saved record');
  must(!errors.length, 'page errors: ' + errors.join(' | '));
  console.log('PASS  resume after reload');
} catch (e) { failed = true; console.error('FAIL ', e.message); }
finally { await browser?.close(); server.kill(); process.exit(failed ? 1 : 0); }
