// Real Python, in its own Web Worker (py-worker.js): an endless loop freezes only the worker,
// and ⏹ Stop ends it and starts a fresh one. This module is the page's side of that conversation.
import { S, LABS, esc } from './state.js';
import { say } from './voice.js';

// Progress for the child: the worker counts the bytes of the big Python files as they arrive. Sizes are the unpacked sizes, in bytes.
const SIZES = { 'pyodide.asm.wasm': 10088051, 'python_stdlib.zip': 2341872, pandas: 23759073, numpy: 11959269,
  matplotlib: 15742868, fonttools: 4266602, pillow: 3042026 };
const PARTS = { py: ['pyodide.asm.wasm', 'python_stdlib.zip'], tables: ['pandas', 'numpy'], charts: ['matplotlib', 'fonttools', 'pillow'] };
const got = {};                                   // bytes so far, per file
const part = { py: 0, tables: 0, charts: 0 };     // 0 = not loaded, 1 = loading, 2 = ready
let lastFile = 0;                                 // when the last piece arrived
function pct(p) {
  if (part[p] === 2) return 100;
  const have = PARTS[p].reduce((n, k) => n + Math.min(got[k] || 0, SIZES[k]), 0);
  const all = PARTS[p].reduce((n, k) => n + SIZES[k], 0);
  return Math.min(99, Math.round(100 * have / all));
}
// A broken download must not be remembered: forget it, so the next try starts again.
function forget(p) {
  part[p] = 0;
  PARTS[p].forEach(k => delete got[k]);
}

// The box that is running now, the input( ) question on screen, and when it was last answered.
export const py = { runningCell: null, asking: null, answeredAt: 0 };

let worker, msgN = 0;
const waiting = new Map();   // message id -> the promise waiting for its answer
export function pyCall(cmd, args = {}) {
  if (!worker) {
    worker = new Worker('py-worker.js');
    worker.onmessage = ({ data: m }) => {
      if (m.type === 'bytes') { got[m.file] = m.n; lastFile = Date.now(); return; }
      if (m.type === 'ask') return askBox(m.prompt);
      const w = waiting.get(m.id);
      if (!w) return;
      waiting.delete(m.id);
      if (m.ok) w.res(m.value); else w.rej(new Error(m.error));
    };
    worker.onerror = e => {
      e.preventDefault();
      for (const w of waiting.values()) w.rej(new Error('Python stopped working: ' + (e.message || 'worker error')));
      waiting.clear();
    };
  }
  const id = ++msgN;
  return new Promise((res, rej) => {
    waiting.set(id, { res, rej });
    worker.postMessage({ id, cmd, ...args });
  });
}
// ⏹ Stop: end the worker and everything it was doing. The next command starts a fresh one,
// which loads Python again (from the browser's cache, so it is quicker the second time).
export function stopPy() {
  worker?.terminate();
  worker = null;
  for (const w of waiting.values()) w.rej(Object.assign(new Error('stopped'), { stopped: true }));
  waiting.clear();
  pyReady = baseReady = chartsReady = undefined;
  dataFiles.clear();
  forget('py'); forget('tables'); forget('charts');
  closeAsk();
}
// What a lab's check( ) asks Python.
export const g = name => pyCall('get', { name });
export const q = expr => pyCall('eval', { expr });

let pyReady, baseReady, chartsReady;
const dataFiles = new Map();   // lab -> its data download
export function loadPy() {
  if (!pyReady) {
    part.py = 1;
    pyReady = pyCall('py').then(
      () => { part.py = 2; return true; },
      e => { pyReady = undefined; forget('py'); throw e; });
  }
  return pyReady;
}
export function loadBase() {
  return baseReady ??= (async () => {
    await loadPy();
    part.tables = 1;
    await pyCall('base');
    part.tables = 2;
    return true;
  })().catch(e => { baseReady = undefined; forget('tables'); throw e; });
}
// The drawing tools are big (about 7 MB), so they load only for a lab that draws charts.
export const CHART = /matplotlib|\bplt\b|\.plot\b|\.hist\(/;
export function loadCharts() {
  return chartsReady ??= (async () => {
    await loadBase();
    part.charts = 1;
    await pyCall('charts');
    part.charts = 2;
    return true;
  })().catch(e => { chartsReady = undefined; forget('charts'); throw e; });
}
// Loads pandas, then this lab's own data files and helper code (each only once per worker).
export async function loadData() {
  await loadBase();
  const lab = LABS[S.sport][S.week], key = `${S.sport}-${S.week}`;
  if (CHART.test(lab.setup || '')) await loadCharts();   // a lab whose own helper code draws needs the drawing tools first
  if (!dataFiles.has(key)) {
    const load = pyCall('data', { names: lab.data || [], lab: key, setup: lab.setup || '' });
    dataFiles.set(key, load.catch(e => { dataFiles.delete(key); throw e; }));
  }
  return dataFiles.get(key);
}

// input( ): Python asks its question in a box under the running play, instead of the browser's own pop-up.
function askBox(prompt) {
  closeAsk();
  const c = py.runningCell;
  if (!c) return worker?.postMessage({ cmd: 'answer', text: '' });
  const box = py.asking = document.createElement('form');
  box.className = 'asks';
  box.autocomplete = 'off';
  box.innerHTML = `<div class="qq">🐍 Python asks: ${esc(String(prompt).trim()) || 'type your answer'}</div>
    <input aria-label="Your answer to Python" placeholder="type your answer" autocapitalize="off" autocorrect="off" spellcheck="false"><button>Enter ↵</button>`;
  c.el.querySelector('.row').after(box);
  const inp = box.querySelector('input');
  inp.focus({ preventScroll: true });
  box.scrollIntoView({ block: 'nearest' });
  box.onsubmit = e => {
    e.preventDefault();
    const text = inp.value.replace(/[“”„]/g, '"').replace(/[‘’]/g, "'");   // tablets like curly quotes; Python wants straight ones
    closeAsk();
    py.answeredAt = Date.now();
    worker?.postMessage({ cmd: 'answer', text });
  };
}
export function closeAsk() {
  py.asking?.remove();
  py.asking = null;
}

// Waits for everything one box needs. While it waits, the Run button says what is loading and how far it is.
export async function ready(c, btn, code = c.code || '') {
  const steps = [[loadPy, () => `Loading Python ${pct('py')}%`]];
  if (c.data) steps.push([loadData, () => part.tables < 2 ? `Loading table tools ${pct('tables')}%` : 'Opening the stats']);
  if (c.data && CHART.test(code)) steps.push([loadCharts, () => `Loading chart tools ${pct('charts')}%`]);
  const since = Date.now();
  let told = false;
  for (const [load, text] of steps) {
    const show = () => {
      if (btn) btn.textContent = '⏳ ' + text();
      if (!told && Date.now() - Math.max(since, lastFile) > 45000) {
        told = true;
        say('The internet is slow right now. I am still loading. Keep this page open!');
      }
    };
    show();
    const timer = setInterval(show, 400);
    try { await load(); } finally { clearInterval(timer); }
  }
}

// Python's error, in plain words for a child.
export function friendly(e) {
  const t = String(e.message || e).trim(), last = t.split('\n').pop();
  const ln = [...t.matchAll(/File "<exec>", line (\d+)/g)].pop()?.[1], at = ln ? ` on line ${ln}` : '';
  let m;
  if (/input\( \) works only/.test(last)) return `On this site <code>input( )</code> works only in the main code, not inside a <code>def</code> machine${at}. Move it out of the machine.`;
  if ((m = last.match(/NameError: name '(.+?)' is not defined/))) return `Python looked for a locker called <code>${m[1]}</code>${at} and found nothing. If it is a word you want to show, put quotes around it. If it is a locker, check the spelling.`;
  if ((m = last.match(/KeyError: ['"]?(.+?)['"]?$/))) return `The table has no column called <code>${m[1]}</code>${at}. Check the spelling, and keep the quotes.`;
  if (/AttributeError/.test(last)) return `Python does not know that command${at}. Check the spelling of the word after the dot.`;
  if (/unterminated string/.test(last)) return `A quote is missing${at}. Text needs a quote at the start <b>and</b> at the end.`;
  if (/was never closed/.test(last)) return `A bracket is still open${at}. Every <code>(</code> needs a <code>)</code>.`;
  if (/IndexError/.test(last)) return `There is no spot with that number${at}. Remember: Python counts from 0, so a list of 5 things has spots 0, 1, 2, 3 and 4.`;
  if (/IndentationError/.test(last)) return `The spaces at the start of a line look off${at}. Lines inside a machine need 4 spaces; other lines need none.`;
  if (/SyntaxError/.test(last)) return `Python could not read the code${at}. Words and names need quotes around them. Also look for a missing comma or bracket.`;
  if (/ModuleNotFoundError|No module named/.test(t)) return `That helper is not ready in this box${at}. Use only the helpers this lab has shown you.`;
  if (/NAType|NA is ambiguous|boolean value of NA/.test(last)) return `Python found an empty spot where it expected a number${at}. That usually means a name is not in the table: check the spelling and the capital letters.`;
  if (/TypeError/.test(last)) return `Python got mixed up${at}: it looks like text and numbers got mixed. Numbers do not need quotes.`;
  if (/ZeroDivisionError/.test(last)) return `Nobody can divide by zero, not even Python. Try a bigger number.`;
  return `Something tripped Python up${at}: ${last.replace(/https?:\/\/\S+/g, '').replace(/</g, '&lt;').slice(0, 200)}`;
}
