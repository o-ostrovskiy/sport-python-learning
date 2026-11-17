// Python for the play page, in a Web Worker: an endless loop freezes only this worker, and the page's ⏹ Stop
// button can end it (the page terminates the worker and starts a fresh one).
// Messages in:  { id, cmd: 'py' | 'base' | 'charts' | 'data' | 'run' | 'get' | 'eval', ... }   and   { cmd: 'answer', text }
// Messages out: { id, ok, value | error }, { type: 'bytes', file, n } while big files download, { type: 'ask', prompt } for input( ).
// Python comes from our own site (tools/vendor-pyodide.mjs copies it there). The version is in the path,
// so sw.js can keep these files for good.
const PY = new URL('assets/vendor/pyodide/0.26.4/', self.location).href;
const SIZES = ['pyodide.asm.wasm', 'python_stdlib.zip', 'pandas', 'numpy', 'matplotlib', 'fonttools', 'pillow'];

// Count the bytes of the big Python files as they arrive, so the page can show how far loading is.
const realFetch = self.fetch;
self.fetch = async (...a) => {
  const r = await realFetch(...a);
  try {   // read a copy on the side; the real download goes to Python untouched
    const u = String(a[0]?.url || a[0]), f = u.startsWith(PY) ? u.slice(PY.length) : '', k = f && SIZES.find(k => f === k || f.startsWith(k + '-'));
    if (k && r.ok && r.body) { let n = 0; const rd = r.clone().body.getReader();
      (async () => { for (;;) { const { done, value } = await rd.read(); if (done) break; n += value.length; postMessage({ type: 'bytes', file: k, n }); } })().catch(() => {}); }
  } catch {}
  return r;
};

let py, pyReady, baseReady, chartsReady;
function loadPy() {
  return pyReady ??= new Promise((res, rej) => {
    let dead = false; const stream = WebAssembly.instantiateStreaming;
    const fail = e => { if (dead) return; dead = true; pyReady = undefined; WebAssembly.instantiateStreaming = stream; rej(e); };
    // If the biggest Python file breaks half way, Pyodide waits forever and says nothing. So we watch that one download ourselves.
    if (stream) WebAssembly.instantiateStreaming = (...a) => { const p = stream.apply(WebAssembly, a); p.catch(fail); return p; };
    try { if (!self.loadPyodide) importScripts(PY + 'pyodide.js'); } catch (e) { return fail(new Error('pyodide.js did not load')); }
    loadPyodide({ indexURL: PY }).then(p => { if (dead) return; WebAssembly.instantiateStreaming = stream; py = p; setup(); res(true); }, fail);
  });
}
// Our own helpers. input( ) in the child's main code becomes a question box on the page (see _run);
// inside a def it cannot wait for the page, so it says so in plain words.
function setup() {
  py.runPython(`
import ast, builtins, sys, js
from pyodide.code import CodeRunner
class _AskInput(ast.NodeTransformer):
    def __init__(self): self.inner = 0
    def _scope(self, n):
        self.inner += 1; self.generic_visit(n); self.inner -= 1; return n
    visit_FunctionDef = visit_AsyncFunctionDef = visit_Lambda = visit_ClassDef = _scope
    def visit_Call(self, n):
        self.generic_visit(n)
        if not self.inner and isinstance(n.func, ast.Name) and n.func.id == "input":
            return ast.copy_location(ast.Await(ast.Call(ast.Name("_ask", ast.Load()), n.args, n.keywords)), n)
        return n
async def _ask(prompt=""):
    a = str(await js._ask(str(prompt))); print(str(prompt) + a); return a
def _no_input(prompt=""):
    raise RuntimeError("input( ) works only in the main code here, not inside a def")
builtins.input = _no_input
async def _run(code):
    r = CodeRunner(code, flags=ast.PyCF_ALLOW_TOP_LEVEL_AWAIT)
    if "input" in code: r.ast = ast.fix_missing_locations(_AskInput().visit(r.ast))
    return await r.compile().run_async(globals())
def _plain(x):   # numpy numbers and yes/no answers become plain Python ones, so a check gets a real number or True/False
    return x.item() if type(x).__module__ == "numpy" and hasattr(x, "item") else x
def _q(expr): return _plain(eval(expr, globals()))
def _g(name): return _plain(globals().get(name))
`);
}
// Pyodide only logs a package that failed to download; the import right after it is what tells us.
const QUIET = { messageCallback() {}, errorCallback() {} };
function loadBase() {
  return baseReady ??= (async () => {
    await loadPy(); await py.loadPackage('pandas', QUIET);
    py.runPython(`
import warnings; warnings.filterwarnings("ignore")
import io, base64, pandas as _pd
def _show(x):
    if isinstance(x, _pd.Series): x = x.to_frame()
    if isinstance(x, _pd.DataFrame): return x.to_html(max_rows=12, max_cols=10, border=0, na_rep="NaN")
    return None
def _fig():
    plt = sys.modules.get("matplotlib.pyplot")
    if plt is None or not plt.get_fignums(): return None
    b = io.BytesIO(); plt.savefig(b, format="png", dpi=110, bbox_inches="tight"); plt.close("all")
    return base64.b64encode(b.getvalue()).decode()
`);
    return true;
  })().catch(e => { baseReady = undefined; throw e; });
}
function loadCharts() {
  return chartsReady ??= (async () => { await loadBase(); await py.loadPackage('matplotlib', QUIET); py.runPython('import matplotlib; matplotlib.use("Agg")'); return true; })()
    .catch(e => { chartsReady = undefined; throw e; });
}
const files = new Map(), setups = new Set();
async function loadData({ names = [], lab, setup }) {
  await loadBase();
  await Promise.all(names.map(f => { if (!files.has(f)) files.set(f, fetch('data/' + f).then(async r => {
    if (!r.ok) throw new Error('missing data file ' + f); py.FS.writeFile(f, new Uint8Array(await r.arrayBuffer())); }).catch(e => { files.delete(f); throw e; }));
    return files.get(f); }));
  if (setup && !setups.has(lab)) { py.runPython(setup); setups.add(lab); }
  return true;
}

// Turns a Python answer into something the page can receive: numbers, text, True/False, lists and dicts.
function plain(v) {
  if (!v || typeof v !== 'object' || typeof v.toJs !== 'function') return v;
  try { return v.toJs({ dict_converter: Object.fromEntries, create_pyproxies: false }); }
  catch { return String(v); }
  finally { v.destroy(); }
}

let answer = null, quietAnswer = null;   // quietAnswer: re-running finished boxes gives input( ) this instead of asking
self._ask = prompt => quietAnswer !== null ? Promise.resolve(quietAnswer)
  : new Promise(res => { answer = res; postMessage({ type: 'ask', prompt }); });

async function run({ code, data, quiet }) {
  const lines = []; py.setStdout({ batched: s => lines.push(s) }); py.setStderr({ batched: () => {} });
  quietAnswer = quiet ? '1' : null;
  let rich = '';
  try {
    const res = await py.globals.get('_run')(code);
    if (data && !quiet) { const t = py.globals.get('_show')(res); if (t) rich += `<div class="tbl">${t}</div>`;
      const f = py.globals.get('_fig')(); if (f) rich += `<img alt="chart" src="data:image/png;base64,${f}">`; }
    res?.destroy?.();
    return { out: lines.join('\n'), rich };
  } catch (e) {
    return { out: lines.join('\n'), error: String(e.message || e) };
  } finally {
    quietAnswer = null;
    // no half-drawn chart may leak into the next box
    if (data) { try { py.runPython('_p = sys.modules.get("matplotlib.pyplot"); _p and _p.close("all")'); } catch {} }
  }
}

const CMDS = {
  py: loadPy, base: loadBase, charts: loadCharts, data: loadData, run,
  get: ({ name }) => plain(py.globals.get('_g')(name)),
  eval: ({ expr }) => plain(py.globals.get('_q')(expr)),
};
onmessage = async ({ data: m }) => {
  if (m.cmd === 'answer') { const a = answer; answer = null; a?.(String(m.text)); return; }
  try { postMessage({ id: m.id, ok: true, value: await CMDS[m.cmd](m) }); }
  catch (e) { postMessage({ id: m.id, ok: false, error: String(e?.message || e) }); }
};
