// A lab in progress, saved only in this browser.
// One record per lab ("progress:nfl-03"): the code in every box, which boxes are done, hint levels, misses,
// guesses, the film review and the scroll position. It is saved on every Run and half a second after typing.
// Its version is a hash of the lab's boxes: when the lab file changes, an old record is dropped,
// so it can never put the wrong code into a box. A won week keeps only its trophy (in "wins").
import { $, S, LABS, store } from './state.js';
import { say } from './voice.js';
import { ready, pyCall } from './python.js';
import { moveBall } from './game.js';

export const progKey = (sport, i) => `progress:${sport}-${String(i + 1).padStart(2, '0')}`;

export function labVersion(lab) {
  const s = JSON.stringify(lab.cells.map(c => c.md ? 0 : [c.kind, c.code || '', c.opts || 0]));
  let h = 5381;
  for (let k = 0; k < s.length; k++) h = (h * 33 + s.charCodeAt(k)) >>> 0;
  return h.toString(36);
}

let keepSaving = false, saveT;
let restoring = null;   // while the finished boxes go back into Python, a Run waits for this
export const startSaving = () => { keepSaving = true; };

export function saveNow() {
  clearTimeout(saveT);
  if (!keepSaving || !S.cells) return;
  const plays = S.cells.map(c => ({
    code: c.ed?.value,
    guess: c.el.querySelector('.guess')?.value || '',
    done: c.done,
    hintN: c.hintN,
  }));
  const ok = store.set(progKey(S.gameSport, S.week), {
    v: labVersion(LABS[S.gameSport][S.week]), plays,
    misses: S.misses, doneCount: S.doneCount, myVote: S.myVote, rvWrong: S.rvWrong, rvAt: S.rvAt,
    scroll: Math.round($('#nb').scrollTop),
  });
  $('#saved').classList.toggle('on', ok);   // the ✓ shows only when the browser really kept it
}
export function saveSoon() {
  clearTimeout(saveT);
  if (keepSaving) saveT = setTimeout(saveNow, 500);
}
// Stops saving and forgets the record: on "Start over", on a won week, or when the lab file changed.
export function dropProgress(sport, i) {
  keepSaving = false;
  clearTimeout(saveT);
  try { localStorage.removeItem(progKey(sport, i)); } catch {}
}
// Leaving a lab: save what is there, then stop until the next lab starts.
export function stopSaving() {
  saveNow();
  keepSaving = false;
}
$('#nb').addEventListener('input', saveSoon);
$('#nb').addEventListener('scroll', saveSoon, { passive: true });
addEventListener('pagehide', saveNow);

// Puts a saved record back into the boxes that startGame just built.
export function restoreBoxes(rec) {
  Object.assign(S.misses, rec.misses);
  S.rvWrong = rec.rvWrong || {};
  S.myVote = rec.myVote;
  S.rvAt = rec.rvAt ?? -1;
  S.doneCount = 0;
  rec.plays.forEach((p, k) => {
    const c = S.cells[k], guess = c.el.querySelector('.guess');
    if (c.ed && typeof p.code === 'string' && p.code !== c.ed.value) c.ed.setValue(p.code);
    if (guess) guess.value = p.guess || '';
    c.hintN = p.hintN || 0;
    if (p.done) {
      c.done = true;
      S.doneCount++;
      c.el.classList.add('done');
      if (c.kind === 'quiz') c.el.querySelector(`.opt[data-i="${c.vote ? rec.myVote : c.a}"]`)?.classList.add('right');
    }
  });
  S.cells.forEach((c, k) => { if (k === 0 || c.done || S.cells[k - 1].done) c.el.classList.remove('wait'); });
  moveBall();
  $('#saved').classList.add('on');
  const nb = $('#nb');
  requestAnimationFrame(() => {
    nb.style.scrollBehavior = 'auto';
    nb.scrollTop = rec.scroll || 0;
    nb.style.scrollBehavior = '';
  });
}

// Python's memory does not survive a reload, and later boxes use what earlier ones made (combine, speed_mph…).
// So every finished box runs again, in order, with no output and no coach lines, before the child presses Run.
async function replay(i) {
  const gone = () => S.week !== i || !$('#game').classList.contains('on');
  const btn = S.cells.find(c => !c.done)?.el.querySelector('.run');
  const show = on => {
    if (!btn) return;
    btn.classList.toggle('busy', on);
    btn.textContent = on ? '⏳ Getting your playbook back…' : '▶ Run';
  };
  show(true);
  try {
    for (const c of S.cells.filter(c => c.done && c.kind !== 'quiz')) {
      const code = c.ed.value;
      await ready(c, null, code);
      if (gone()) return false;
      // quiet: no output, and an input( ) gets the answer "1" instead of a question. An error is fine here
      // (an error on purpose, or a box changed after it was done) and must not stop the rest.
      await pyCall('run', { code, data: !!c.data, quiet: true });
    }
    return !gone();
  } finally {
    show(false);
  }
}
// Runs replay( ) and then onDone; while it works, a Run waits for it (see waitForRestore).
export function bringBack(i, onDone) {
  const failed = () => S.week === i && say('I could not load Python. Check the internet connection, then press <b>Try again</b>.', 'flag',
    { label: 'Try again', go: () => { say('Trying again. Getting your playbook back…'); bringBack(i, onDone); } });
  const p = restoring = replay(i)
    .then(ok => { if (ok) onDone(); }, failed)
    .finally(() => { if (restoring === p) restoring = null; });
  return p;
}
export async function waitForRestore() {
  while (restoring) await restoring.catch(() => {});
}
