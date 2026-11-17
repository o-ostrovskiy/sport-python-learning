// Runs every browser test, one after another, and says which passed (IMPROVEMENTS.md item 8). Used by CI too.
//   cd site/tools && node run-tests.mjs              (all of them: about 15 minutes, most of it the 20-lab play-through)
//   cd site/tools && node run-tests.mjs --quick      (everything but the 20-lab play-through)
// Tests that need the answer keys (site/labs/answers, not in git) are skipped, and named, when the keys are missing.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const haveAnswers = fs.existsSync(path.join(HERE, '..', 'labs', 'answers', 'nfl-01.json'));
const TESTS = [
  ['test-smoke.mjs', 'pages, a week, Play 1, hint, flag, no answer keys served', false],
  ['test-editor.mjs', 'the code editor, with real key presses', false],
  ['test-resume.mjs', 'a lab in progress comes back after a reload', true],
  ['test-stop.mjs', 'Stop on an endless loop, input( ) in the page', true],
  ['test-map.mjs', 'the drawn map on an upright iPad, a trophy after a win', true],
  ['test-cache.mjs', 'Python from our own site, kept offline by sw.js', true],
  ['playthrough.mjs', 'all 20 labs through the real page', true],
];
const quick = process.argv.includes('--quick');
let bad = 0;
const t0 = Date.now();
for (const [file, what, needsAnswers] of TESTS) {
  if (quick && file === 'playthrough.mjs') { console.log(`–  ${file}  skipped (--quick)`); continue; }
  if (needsAnswers && !haveAnswers) { console.log(`–  ${file}  skipped: needs site/labs/answers`); continue; }
  const start = Date.now();
  const r = spawnSync(process.execPath, [path.join(HERE, file)], { cwd: HERE, encoding: 'utf8', timeout: 30 * 60 * 1000 });
  const ok = r.status === 0, secs = ((Date.now() - start) / 1000).toFixed(0);
  console.log(`${ok ? '✓' : '✗'}  ${file}  ${what}  (${secs} s)`);
  if (!ok) { bad++; process.stdout.write((r.stdout + r.stderr).split('\n').map(l => '     ' + l).join('\n') + '\n'); }
}
console.log(`${bad ? `${bad} failed` : 'all passed'} in ${((Date.now() - t0) / 60000).toFixed(1)} min`);
process.exit(bad ? 1 : 0);
