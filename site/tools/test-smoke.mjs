// Basic browser test of the site (IMPROVEMENTS.md item 8). Needs no answer keys.
//   cd site/tools && node test-smoke.mjs            (add --headed to watch)
// Starts server/local.mjs on its own port and checks: the home page and About load; a week opens; Play 1 runs and
// prints; a wrong quiz answer gets a flag; a hint shows; answer keys, tools and notes are never served.
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const HERE = path.dirname(fileURLToPath(import.meta.url)), ROOT = path.resolve(HERE, '..', '..');
const PORT = 8800 + Math.floor(Math.random() * 100), BASE = `http://localhost:${PORT}`;
const LONG = 240000;

const server = spawn('node', ['server/local.mjs'], { cwd: ROOT, env: { ...process.env, PORT: String(PORT), GEMINI_API_KEY: '' }, stdio: 'ignore' });
let browser, failed = false;
const step = m => console.log('  ·', m);
const must = (ok, m) => { if (!ok) throw new Error(m); };

try {
  for (let t = 0; t < 50; t++) { try { if ((await fetch(BASE + '/play.html')).ok) break; } catch {} await new Promise(r => setTimeout(r, 100)); }

  step('answer keys, tools, notes and dot files are never served');
  for (const u of ['/labs/answers/nfl-01.json', '/tools/check-lab.mjs', '/labs/README.md', '/.gitignore', '/../server/.env'])
    must((await fetch(BASE + u)).status === 404, `${u} is served`);

  browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  const coach = () => page.locator('#say').innerText();

  step('the home page and About load');
  await page.goto(BASE + '/');
  must(/Python Season/.test(await page.title()), 'home page title');
  must(await page.locator('a[href*="play.html"]').count() > 0, 'no link to the game on the home page');
  await page.goto(BASE + '/about.html');
  must(await page.locator('#privacy').count() === 1, 'About has no Privacy section');

  step('a week opens');
  await page.goto(BASE + '/play.html');
  await page.waitForFunction(() => document.querySelectorAll('#map .pin').length === 10 && !document.querySelector('#map .pin.locked'), null, { timeout: 15000 });
  await page.locator('#sched .wk').first().click();   // the week strip, as a keyboard user would
  await page.locator('#say .go').first().click();
  await page.locator('#game.on').waitFor();
  must(await page.locator('#nb .cell').count() > 10, 'the playbook has no plays');

  step('Play 1 runs and prints');
  await page.waitForFunction(() => /Python is ready/.test(document.querySelector('#say').textContent), null, { timeout: LONG });
  const cell = k => page.locator('#nb .cell').nth(k - 1);
  await cell(1).locator('.run').click();
  await page.waitForFunction(() => document.querySelector('#nb .cell').classList.contains('done'), null, { timeout: LONG });
  must((await cell(1).locator('.out').innerText()).trim().length > 0, 'Play 1 printed nothing');

  step('a hint shows');
  await cell(2).locator('.hint').click();
  must(/Hint 1/.test(await coach()), 'no hint in the bubble');

  step('a wrong quiz answer gets a flag');
  const quiz = await page.evaluate(() => { const k = seasonState.cells.findIndex(c => c.kind === 'quiz' && !c.vote); return { k: k + 1, wrong: (seasonState.cells[k].a + 1) % 3 }; });
  await page.evaluate(k => seasonState.cells[k - 1].el.classList.remove('wait'), quiz.k);
  await cell(quiz.k).locator(`.opt[data-i="${quiz.wrong}"]`).click();
  must(/Flag/.test(await coach()), 'no flag after a wrong answer');
  must(await page.locator('#coach.flag').count() === 1, 'the coach does not show the flag');

  must(!errors.length, 'page errors: ' + errors.join(' | '));
  console.log('PASS  smoke: pages load, a week opens, Play 1 prints, hints and flags, no answer keys served');
} catch (e) { failed = true; console.error('FAIL ', e.message); }
finally { await browser?.close(); server.kill(); process.exit(failed ? 1 : 0); }
