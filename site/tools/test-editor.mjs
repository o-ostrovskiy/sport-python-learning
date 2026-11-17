// Browser test for the code editor (IMPROVEMENTS.md item 5), with real key presses.
//   cd site/tools && node test-editor.mjs            (add --headed to watch)
// In Week 1, Play 1: Enter after "if …:" indents 4 spaces, "(" gets its ")", curly quotes become straight,
// Shift + Enter runs the box, Tab inserts 4 spaces, Escape then Tab leaves the box, and >= is shown as two characters.
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
  browser = await chromium.launch({ headless: !process.argv.includes('--headed') });
  const page = await (await browser.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(BASE + '/play.html?week=1');
  await page.locator('#say .go').first().click(); await page.locator('#game.on').waitFor();
  await page.waitForFunction(() => /Python is ready/.test(document.querySelector('#say').textContent), null, { timeout: LONG });
  const box = page.locator('#nb .cell').first(), content = box.locator('.cm-content');
  const code = () => page.evaluate(() => seasonState.cells[0].ed.value);

  step('Enter after a colon indents 4 spaces; ( gets its )');
  await content.click(); await page.keyboard.press('ControlOrMeta+a'); await page.keyboard.press('Delete');
  await page.keyboard.type('if 3 >= 2:'); await page.keyboard.press('Enter');
  must(await code() === 'if 3 >= 2:\n    ', `no 4-space indent after the colon: ${JSON.stringify(await code())}`);
  await page.keyboard.type('print(');
  must(await code() === 'if 3 >= 2:\n    print()', `the bracket was not closed: ${JSON.stringify(await code())}`);

  step('curly quotes from a tablet become straight ones');
  await page.keyboard.insertText('“Long field goal!”');
  must(await code() === 'if 3 >= 2:\n    print("Long field goal!")', `curly quotes stayed: ${JSON.stringify(await code())}`);

  step('>= shows as two characters (no ligatures)');
  const lig = await box.locator('.cm-scroller').evaluate(e => getComputedStyle(e).fontVariantLigatures);
  must(lig === 'none', `ligatures are "${lig}"`);

  step('Shift + Enter runs the box');
  await page.keyboard.press('Shift+Enter');
  await page.waitForFunction(() => document.querySelector('#nb .cell').classList.contains('done'), null, { timeout: LONG });
  must(/Long field goal!/.test(await box.locator('.out').innerText()), 'the output is missing');

  step('Tab puts 4 spaces; Escape then Tab leaves the box');
  await content.click(); await page.keyboard.press('ControlOrMeta+End'); await page.keyboard.press('Enter');
  const before = await code();   // still inside the if, so the new line already starts 4 spaces in
  await page.keyboard.press('Tab');
  must(await code() === before + '    ', `Tab did not add 4 spaces: ${JSON.stringify(await code())}`);
  await page.keyboard.press('Escape'); await page.keyboard.press('Tab');
  must(!(await page.evaluate(() => !!document.activeElement.closest('.cm-editor'))), 'Escape then Tab did not leave the box');

  must(!errors.length, 'page errors: ' + errors.join(' | '));
  console.log('PASS  code editor: indent, brackets, straight quotes, Shift+Enter, Tab and a way out');
} catch (e) { failed = true; console.error('FAIL ', e.message); }
finally { await browser?.close(); server.kill(); process.exit(failed ? 1 : 0); }
