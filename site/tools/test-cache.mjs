// Browser test for Python from our own site and the service worker (IMPROVEMENTS.md item 6).
//   cd site/tools && node test-cache.mjs            (add --headed to watch)
// Starts server/local.mjs on its own port and, in Chromium:
//  1. nothing is asked of any other site: Python, its packages and everything else come from ours;
//  2. after the first visit, Python comes from the browser's cache (sw.js), so a lab is ready much sooner;
//  3. with the internet off, a lab already open keeps working: ⏹ Stop starts a fresh Python from the cache,
//     and the next play runs and passes.
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '..', '..');
const PORT = 8800 + Math.floor(Math.random() * 100), BASE = `http://localhost:${PORT}`;
const ANS = JSON.parse(fs.readFileSync(path.join(HERE, '..', 'labs', 'answers', 'nfl-01.json'), 'utf8'));
const LONG = 240000;

const server = spawn('node', ['server/local.mjs'], { cwd: ROOT, env: { ...process.env, PORT: String(PORT), GEMINI_API_KEY: '' }, stdio: 'ignore' });
let browser, failed = false;
const step = m => console.log('  ·', m);
const must = (ok, m) => { if (!ok) throw new Error(m); };

try {
  for (let t = 0; t < 50; t++) { try { if ((await fetch(BASE + '/play.html')).ok) break; } catch {} await new Promise(r => setTimeout(r, 100)); }
  browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, serviceWorkers: 'allow' });
  const outside = [], errors = [];
  ctx.on('request', r => { const u = r.url(); if (!u.startsWith(BASE) && !u.startsWith('data:') && !u.startsWith('blob:')) outside.push(u); });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(e.message));
  const cell = k => page.locator('#nb .cell').nth(k - 1);
  const setCode = (k, code) => page.evaluate(([k, code]) => seasonState.cells[k - 1].ed.setValue(code), [k, code]);
  const openWeek1 = async () => {
    await page.goto(BASE + '/play.html?week=1');
    await page.locator('#say .go').first().click(); await page.locator('#game.on').waitFor();
    const t0 = Date.now();
    await page.waitForFunction(() => /Python is ready|All set/.test(document.querySelector('#say').textContent), null, { timeout: 60000 })   // a new game, or Continue
      .catch(async () => { throw new Error('Python never got ready. Coach: ' + await page.locator('#say').innerText()); });
    return Date.now() - t0;
  };
  const waitDone = k => page.waitForFunction(k => document.querySelectorAll('#nb .cell')[k - 1].classList.contains('done'), k, { timeout: 60000 })
    .catch(async () => { throw new Error(`Play ${k} not done. Output: ${await cell(k).locator('.out').innerText()} Coach: ${await page.locator('#say').innerText()}`); });

  step('first visit: Python from our own site');
  const first = await openWeek1();
  await page.evaluate(() => navigator.serviceWorker.ready);
  await cell(1).locator('.run').click(); await waitDone(1);
  // The service worker took over during the first visit; the second visit goes through it from the start.
  await page.evaluate(() => localStorage.clear());
  const second = await openWeek1();
  const cached = await page.evaluate(async () => (await (await caches.open((await caches.keys())[0])).keys()).map(r => r.url.split('/').pop()));
  must(cached.includes('pyodide.asm.wasm') && cached.some(f => f.startsWith('pandas-')), 'Python is not in the cache: ' + cached.join(' '));
  step(`second visit: Python ready in ${(second / 1000).toFixed(1)} s (first visit: ${(first / 1000).toFixed(1)} s)`);

  step('internet off: Stop starts a fresh Python from the cache, and Plays 1 and 2 still pass');
  await ctx.setOffline(true);
  await setCode(1, 'while True:\n    pass');
  await cell(1).locator('.run').click();
  await cell(1).locator('.stop').waitFor({ state: 'visible', timeout: 6000 }); await cell(1).locator('.stop').click();
  await page.waitForFunction(() => /Ready again/.test(document.querySelector('#say').textContent), null, { timeout: 60000 })
    .catch(async () => { throw new Error('no fresh Python offline. Coach: ' + await page.locator('#say').innerText()); });
  await setCode(1, 'print("offline and still playing")'); await cell(1).locator('.run').click(); await waitDone(1);
  await setCode(2, ANS[2].solution); await cell(2).locator('.run').click(); await waitDone(2);
  must(/offline and still playing/.test(await cell(1).locator('.out').innerText()), 'Play 1 printed nothing offline');
  await ctx.setOffline(false);

  must(!outside.length, 'requests to other sites: ' + [...new Set(outside)].slice(0, 5).join(' '));
  must(!errors.length, 'page errors: ' + errors.join(' | '));
  console.log('PASS  Python from our own site, kept by sw.js, and a lab keeps working offline');
} catch (e) { failed = true; console.error('FAIL ', e.message); }
finally { await browser?.close(); server.kill(); process.exit(failed ? 1 : 0); }
