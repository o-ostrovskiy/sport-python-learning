// Browser test for Python in a Web Worker (IMPROVEMENTS.md item 3).
//   cd site/tools && node test-stop.mjs            (add --headed to watch)
// Starts server/local.mjs on its own port and, in Chromium with real Python:
//  1. Week 1: an endless `while True: pass` in Play 1, ⏹ Stop pressed within 5 seconds, then Play 1 and Play 2 run fine;
//  2. Week 8: input( ) asks in the box under the code, the answer goes back to Python and the play is done.
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
  page.on('dialog', d => { errors.push('a browser pop-up opened: ' + d.message()); d.dismiss(); });

  const cell = k => page.locator('#nb .cell').nth(k - 1);   // k = play number
  const isDone = k => cell(k).evaluate(e => e.classList.contains('done'));
  const run = async k => {   // stops at the first error message instead of waiting for a box that will never be done
    await cell(k).locator('.run').click();
    await page.waitForFunction(k => { const c = document.querySelectorAll('#nb .cell')[k - 1]; const e = c.querySelector('.out.err'); return c.classList.contains('done') || (e && e.textContent !== 'Stopped.'); }, k, { timeout: LONG });
    const err = await cell(k).locator('.out.err').count() ? await cell(k).locator('.out.err').innerText() : '';   // "Stopped." is the run before
    must(!err, `Play ${k} failed: ${err}`);
  };
  const open = async week => {
    await page.goto(`${BASE}/play.html?week=${week}`); await page.locator('#say .go').first().click(); await page.locator('#game.on').waitFor();
    await page.waitForFunction(() => /Python is ready/.test(document.querySelector('#say').textContent), null, { timeout: LONG });
  };

  step('Week 1: while True: pass in Play 1, then ⏹ Stop within 5 seconds');
  await open(1);
  const start = await cell(1).locator('textarea').inputValue();
  await cell(1).locator('textarea').fill('while True:\n    pass');
  const t0 = Date.now(); await cell(1).locator('.run').click();
  await cell(1).locator('.stop').waitFor({ state: 'visible', timeout: 5000 });
  must(/never end/.test(await page.locator('#say').innerText()), 'the coach did not point at the while line');
  await cell(1).locator('.stop').click();
  must(Date.now() - t0 < 5000, `Stop was pressed after ${Date.now() - t0} ms`);
  await page.waitForFunction(() => /Ready again/.test(document.querySelector('#say').textContent), null, { timeout: LONG });
  must(await cell(1).locator('.stop').count() === 0, 'the Stop button stayed');

  step('then Play 1 and Play 2 run in the fresh Python');
  await cell(1).locator('textarea').fill(start); await run(1); must(await isDone(1), 'Play 1 not done after Stop');
  await cell(2).locator('textarea').fill(ANS[2].solution); await run(2); must(await isDone(2), 'Play 2 not done after Stop');

  step('Week 8: input( ) asks in the box under the code');
  await page.evaluate(() => localStorage.clear());
  await open(8);
  await cell(1).locator('.run').click();
  const box = cell(1).locator('.asks'); await box.waitFor({ timeout: LONG });
  must(/favorite player/.test(await box.innerText()), 'the question box does not show Python\'s question');
  await box.locator('input').fill('Josh Allen'); await box.locator('input').press('Enter');
  await page.waitForFunction(() => document.querySelector('#nb .cell')?.classList.contains('done'), null, { timeout: LONG });
  must(/Great pick: Josh Allen/.test(await cell(1).locator('.out').innerText()), 'the answer did not reach Python');
  must(await cell(1).locator('.asks').count() === 0, 'the question box stayed');

  must(!errors.length, 'page errors: ' + errors.join(' | '));
  console.log('PASS  Stop on an endless loop, input( ) in the page');
} catch (e) { failed = true; console.error('FAIL ', e.message); }
finally { await browser?.close(); server.kill(); process.exit(failed ? 1 : 0); }
