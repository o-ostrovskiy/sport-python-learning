// Browser test for the drawn map (IMPROVEMENTS.md item 4).
//   cd site/tools && node test-map.mjs            (add --headed to watch)
// Starts server/local.mjs on its own port and, in Chromium on an upright iPad screen (768 × 1024):
//  1. the page asks no map service for anything (everything, Python included, comes from our own site);
//  2. the whole map fits with no scrolling, and the coach covers no stadium;
//  3. Week 1 is won through the real lab (answer keys), and back on the map its stadium shows a trophy.
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '..', '..');
const PORT = 8800 + Math.floor(Math.random() * 100), BASE = `http://localhost:${PORT}`;
const ANS = JSON.parse(fs.readFileSync(path.join(HERE, '..', 'labs', 'answers', 'nfl-01.json'), 'utf8'));
const LONG = 240000;
const ALLOWED = [BASE];   // everything, Python included, comes from our own site

const server = spawn('node', ['server/local.mjs'], { cwd: ROOT, env: { ...process.env, PORT: String(PORT), GEMINI_API_KEY: '' }, stdio: 'ignore' });
let browser, failed = false;
const step = m => console.log('  ·', m);
const must = (ok, m) => { if (!ok) throw new Error(m); };

try {
  for (let t = 0; t < 50; t++) { try { if ((await fetch(BASE + '/play.html')).ok) break; } catch {} await new Promise(r => setTimeout(r, 100)); }
  browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  const page = await (await browser.newContext({ viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true })).newPage();
  const errors = [], outside = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { const u = r.url(); if (!u.startsWith('data:') && !ALLOWED.some(a => u.startsWith(a))) outside.push(u); });

  step('upright iPad: the map loads, fits, and the coach covers no stadium');
  await page.goto(BASE + '/play.html');
  await page.waitForFunction(() => document.querySelectorAll('#map .pin').length === 10 && !document.querySelector('#map .pin.locked'), null, { timeout: 10000 });
  const fit = await page.evaluate(() => {
    const vw = innerWidth, vh = innerHeight, coach = document.querySelector('#coach').getBoundingClientRect();
    const pins = [...document.querySelectorAll('#map .pin .tile')].map(t => t.getBoundingClientRect());
    const hit = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
    return { scroll: document.documentElement.scrollHeight > vh || document.documentElement.scrollWidth > vw,
      off: pins.filter(p => p.left < 0 || p.top < 0 || p.right > vw || p.bottom > vh).length,
      covered: pins.filter(p => hit(p, coach)).length, small: pins.filter(p => p.width < 28).length };
  });
  must(!fit.scroll, 'the page scrolls on an upright iPad');
  must(!fit.off, `${fit.off} stadiums are off the screen`);
  must(!fit.covered, `the coach covers ${fit.covered} stadiums`);
  must(!fit.small, `${fit.small} stadiums are smaller than 28 px to tap`);

  step('Week 1 is won through the real lab');
  await page.locator('#map .pin[data-i="0"] .tile').click({ force: true });   // first tap (on the tile: the glow around it keeps moving): the stadium card and Kick off
  await page.locator('#say .go').first().click(); await page.locator('#game.on').waitFor();
  const n = await page.locator('#nb .cell').count();
  for (let k = 1; k <= n; k++) {
    const cell = page.locator('#nb .cell').nth(k - 1), a = ANS[k] || {};
    if (await cell.locator('.opts').count()) {
      await cell.locator(`.opt[data-i="${await page.evaluate(k => seasonState.cells[k - 1].vote ? 0 : seasonState.cells[k - 1].a, k)}"]`).click();
    } else {
      if (a.solution) await page.evaluate(([k, code]) => seasonState.cells[k - 1].ed.setValue(code), [k, a.solution]);   // the code box is a CodeMirror editor
      if (a.answer !== undefined) await cell.locator('.guess').fill(String(a.answer));
      await cell.locator('.run').click();
    }
    await page.waitForFunction(k => document.querySelectorAll('#nb .cell')[k - 1].classList.contains('done'), k, { timeout: LONG });
  }
  await page.locator('#say .go').click();   // film review
  for (const a of await page.evaluate(() => seasonState.REVIEW.map(r => r.a))) { await page.locator(`#film .opt[data-i="${a}"]:not([disabled])`).click(); await page.waitForTimeout(1500); }
  await page.getByRole('button', { name: 'Back to the map' }).click();

  step('back on the map: Week 1 has a trophy, Week 2 glows');
  const pin = i => page.locator(`#map .pin[data-i="${i}"]`);
  must(/\bwon\b/.test(await pin(0).getAttribute('class')) && (await pin(0).textContent()).includes('🏆'), 'Week 1 has no trophy');
  must(/\bnext\b/.test(await pin(1).getAttribute('class')), 'Week 2 is not the glowing next stadium');
  must(!outside.length, 'requests outside our site: ' + [...new Set(outside)].slice(0, 5).join(' '));
  must(!errors.length, 'page errors: ' + errors.join(' | '));
  console.log('PASS  drawn map: no map service, fits an upright iPad, the trophy after a win');
} catch (e) { failed = true; console.error('FAIL ', e.message); }
finally { await browser?.close(); server.kill(); process.exit(failed ? 1 : 0); }
