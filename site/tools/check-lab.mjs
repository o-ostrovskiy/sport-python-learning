// Plays one lab from start to finish in real Python and checks that every play behaves.
//   cd site/tools && node check-lab.mjs nfl-04      (or: node check-lab.mjs all)
// Needs labs/answers/<lab>.json: { "<play number>": { "solution": "code" } | { "answer": 27 } | { "inputs": ["a"] } }
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { loadPyodide } from 'pyodide';

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Same helper code as loadBase() in play.html.
const BASE = `
import warnings; warnings.filterwarnings("ignore")
import matplotlib; matplotlib.use("Agg")
import io, base64, pandas as _pd
def _show(x):
    if isinstance(x, _pd.Series): x = x.to_frame()
    if isinstance(x, _pd.DataFrame): return x.to_html(max_rows=12, max_cols=10, border=0, na_rep="NaN")
    return None
def _fig():
    import matplotlib.pyplot as plt
    if not plt.get_fignums(): return None
    b = io.BytesIO(); plt.savefig(b, format="png", dpi=110, bbox_inches="tight"); plt.close("all")
    return base64.b64encode(b.getvalue()).decode()
`;
const words = h => String(h || '').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;

async function checkLab(name) {
  const file = path.join(SITE, 'labs', name + '.js'), ansFile = path.join(SITE, 'labs', 'answers', name + '.json');
  const fails = [], warns = [], fail = m => fails.push(m), warn = m => warns.push(m);
  let lab; globalThis.registerLab = (sp, n, l) => { lab = { sp, n, ...l }; };
  globalThis.esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); globalThis.myVote = 0;
  vm.runInThisContext(fs.readFileSync(file, 'utf8'), { filename: file });
  if (!lab) return { fails: ['the file never called registerLab'], warns };
  if (`${lab.sp}-${String(lab.n).padStart(2, '0')}` !== name) fail(`registerLab says ${lab.sp} ${lab.n} but the file is ${name}`);
  const answers = fs.existsSync(ansFile) ? JSON.parse(fs.readFileSync(ansFile, 'utf8')) : {};
  const plays = lab.cells.filter(c => !c.md), skills = Object.keys(lab.skills || {});
  if (plays.length < 11 || plays.length > 18) warn(`${plays.length} plays (aim for about 15)`);
  if (skills.length < 3 || skills.length > 4) warn(`${skills.length} skills (aim for 3–4)`);

  const py = await loadPyodide(); let out = [], inputs = [];
  py.setStdout({ batched: s => out.push(s) }); py.setStderr({ batched: () => {} });
  globalThis._nextInput = () => { if (!inputs.length) throw new Error('the code asked for input() but the answers file gives no more "inputs"'); return inputs.shift(); };
  py.runPython('import builtins, js\nbuiltins.input = lambda prompt="": js._nextInput()');
  const needData = plays.some(c => c.data);
  if (needData) {
    await py.loadPackage(['pandas', 'matplotlib'], { messageCallback: () => {} }); py.runPython(BASE);
    for (const f of lab.data || []) {
      const p = path.join(SITE, 'data', f); if (!fs.existsSync(p)) { fail(`data file missing: data/${f}`); continue; }
      const mb = fs.statSync(p).size / 1e6; if (mb > 3.5) warn(`data/${f} is ${mb.toFixed(1)} MB (keep under about 3)`);
      py.FS.writeFile(f, fs.readFileSync(p));
    }
    if (lab.setup) py.runPython(lab.setup);
  }
  const run = async (code, typed = []) => {
    out = []; inputs = [...typed];
    try { const res = await py.runPythonAsync(code); let rich = false;
      if (needData) { rich = !!py.globals.get('_show')(res); rich = !!py.globals.get('_fig')() || rich; }
      return { out: out.join('\n'), rich };
    } catch (e) { return { out: out.join('\n'), err: String(e.message).trim().split('\n').pop() }; }
  };
  const ctx = (code, r, guess) => ({ code, out: r.out, guess, g: n => py.globals.get(n), q: x => py.runPython(x) });
  const safe = (label, fn) => { try { return fn(); } catch (e) { fail(`${label}: check() crashed: ${e.message}`); return {}; } };

  for (const [i, c] of plays.entries()) {
    const n = i + 1, tag = `play ${n} (${c.kind})`, a = answers[n] || {};
    if (!skills.includes(c.skill)) fail(`${tag}: skill "${c.skill}" is not in skills`);
    if (!c.task) fail(`${tag}: no task text`);
    for (const k of ['ok']) if (words(c[k]) > 60) warn(`${tag}: "${k}" is ${words(c[k])} words (coach lines should be short)`);
    if (c.kind === 'quiz') {
      if (!Array.isArray(c.opts) || c.opts.length !== 3) fail(`${tag}: needs exactly 3 opts`);
      if (!c.ok) fail(`${tag}: no ok line`);
      if (!c.vote) { if (!(c.a >= 0 && c.a < 3)) fail(`${tag}: a must be 0, 1 or 2`);
        if (!Array.isArray(c.tips) || c.tips.length !== 3) fail(`${tag}: needs 3 tips ('' for the right option)`);
        else c.tips.forEach((t, k) => { if (k !== c.a && !t) fail(`${tag}: no tip for wrong option ${k}`); }); }
      continue;
    }
    if (typeof c.code !== 'string') { fail(`${tag}: no code`); continue; }
    if (c.kind === 'run') { const r = await run(c.code, a.inputs); if (r.err) fail(`${tag}: starting code errors: ${r.err}`); if (!c.ok && !c.check) fail(`${tag}: no ok line`);
      if (c.check && !r.err) { const v = safe(tag, () => c.check(ctx(c.code, r))); if (!v.ok) fail(`${tag}: check() rejects the given code: ${v.msg}`); } }
    else if (c.kind === 'boom') { const r = await run(c.code, a.inputs);
      if (!r.err) fail(`${tag}: expected ${c.expectError} but the code ran fine`); else if (!r.err.includes(c.expectError)) fail(`${tag}: expected ${c.expectError}, got ${r.err}`); }
    else if (c.kind === 'predict') { const r = await run(c.code, a.inputs); if (r.err) { fail(`${tag}: code errors: ${r.err}`); continue; }
      if (a.answer === undefined) { fail(`${tag}: answers file needs { "answer": number }`); continue; }
      const good = safe(tag, () => c.check(ctx(c.code, r, String(a.answer)))), bad = safe(tag, () => c.check(ctx(c.code, r, String(Number(a.answer) + 7919))));
      if (!good.ok || good.missed) fail(`${tag}: the right guess ${a.answer} is not accepted as right`);
      if (!bad.ok || !bad.missed) fail(`${tag}: a wrong guess must still finish the play, with missed: true`); }
    else if (c.kind === 'turn') {
      if (!c.check) { fail(`${tag}: no check()`); continue; }
      if (!c.hints?.length) warn(`${tag}: no hints`);
      if (!c.code.includes('___')) { const r = await run(c.code, a.inputs);
        if (!r.err) { const v = safe(tag, () => c.check(ctx(c.code, r))); if (v.ok) fail(`${tag}: the starting code already passes, so there is nothing to do`); else if (!v.msg) fail(`${tag}: check() gave no tip for the starting code`); } }
      if (!a.solution) { fail(`${tag}: answers file needs { "solution": "code" }`); continue; }
      const r = await run(a.solution, a.inputs); if (r.err) { fail(`${tag}: the solution errors: ${r.err}`); continue; }
      const v = safe(tag, () => c.check(ctx(a.solution, r))); if (!v.ok) fail(`${tag}: the solution is rejected: ${v.msg}`); else if (!v.msg) fail(`${tag}: no message on success`);
      for (const w of a.wrong || []) { const rw = await run(w, a.inputs); if (rw.err) continue; const vw = safe(tag, () => c.check(ctx(w, rw))); if (vw.ok) fail(`${tag}: a wrong answer is accepted: ${w.slice(0, 60)}`); }
      await run(a.solution, a.inputs);   // leave Python in the solved state for the next play
    } else fail(`${tag}: unknown kind`);
  }
  const rv = lab.review || []; if (rv.length < 5 || rv.length > 6) warn(`${rv.length} review questions (aim for 5–6)`);
  rv.forEach((r, k) => { if (!skills.includes(r.skill)) fail(`review ${k + 1}: unknown skill`); if (r.opts?.length !== 3 || !(r.a >= 0 && r.a < 3)) fail(`review ${k + 1}: needs 3 opts and a`); });
  for (const s of skills) if (!rv.some(r => r.skill === s)) warn(`no review question for skill "${s}"`);
  return { fails, warns, plays: plays.length };
}

const arg = process.argv[2];
if (!arg) { console.log('usage: node check-lab.mjs <nfl-04 | all>'); process.exit(2); }
const names = arg === 'all' ? fs.readdirSync(path.join(SITE, 'labs')).filter(f => /^(nfl|mlb)-\d\d\.js$/.test(f)).map(f => f.slice(0, -3)).sort() : [arg];
let bad = 0;
for (const name of names) {
  const { fails, warns, plays } = await checkLab(name);
  console.log(`${fails.length ? '✗' : '✓'} ${name}${plays ? `  (${plays} plays)` : ''}`);
  fails.forEach(f => console.log('   FAIL  ' + f)); warns.forEach(w => console.log('   warn  ' + w));
  bad += fails.length;
}
process.exit(bad ? 1 : 0);
