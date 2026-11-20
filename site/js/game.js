// The lab notebook: the plays (boxes), running and checking them, the film review and the final card.
import { $, S, LABS, store, esc } from './state.js';
import { say, rest } from './voice.js';
import { py, pyCall, stopPy, closeAsk, g, q, ready, loadData, loadCharts, CHART, friendly } from './python.js';
import { progKey, labVersion, startSaving, saveNow, saveSoon, stopSaving, dropProgress, restoreBoxes, bringBack, waitForRestore } from './progress.js';
import { codeEditor } from './editor.js';
import { draw } from './map.js';
import { resetAsk } from './ask.js';

// The coach's words follow the sport being played.
const WORDS = {
  nfl: { cheers: ['Boom!', 'What a play!', 'Nice hands!', 'First down!', 'You are on fire!'], win: 'TOUCHDOWN!', flag: 'Flag on the play!', oops: 'Flag!', goal: 'TD' },
  mlb: { cheers: ['Boom!', 'What a play!', 'Nice catch!', 'Base hit!', 'You are on fire!'], win: 'HOME RUN!', flag: 'Foul ball!', oops: 'Foul ball!', goal: 'HR' },
};
const words = () => WORDS[S.sport];

// The ball on the field strip moves one step for every finished play.
export function moveBall() {
  const b = $('#ball'), n = S.cells.length;
  b.style.left = (9 + S.doneCount / n * 82) + '%';
  b.classList.remove('spin');
  void b.offsetWidth;   // restart the spin
  b.classList.add('spin');
  $('#down').textContent = `Play ${Math.min(S.doneCount + 1, n)} of ${n}`;
}
function miss(c) {
  S.misses[c.skill]++;
  c.el.classList.remove('bad');
  void c.el.offsetWidth;   // restart the shake
  c.el.classList.add('bad');
}

// Loads a lab file and its recorded coach lines.
function loadLab(sport, i) {
  const voice = document.createElement('script');
  voice.src = labFile(sport, i).replace('labs/', 'assets/voice/');
  document.head.appendChild(voice);
  return new Promise((res, rej) => {
    const t = document.createElement('script');
    t.src = labFile(sport, i);
    t.onload = () => LABS[sport][i] ? res() : rej(new Error('lab file did not register'));
    t.onerror = rej;
    document.head.appendChild(t);
  });
}

// One play's HTML: a quiz (options to tap) or a code box with Run, Hint and maybe a guess.
function cellHtml(c, n) {
  const label = { run: 'RUN IT', turn: SEASON[S.sport].ball + ' YOUR TURN', boom: 'ERROR ON PURPOSE',
    quiz: c.vote ? 'YOUR GUESS' : 'QUICK QUESTION', predict: 'GUESS FIRST' }[c.kind];
  let h = `<span class="tag ${c.kind === 'turn' ? 'turn' : ''}">PLAY ${n} · ${label}</span><div class="task">${c.task}</div>`;
  if (c.kind === 'quiz') {
    h += `${c.code ? `<pre class="show">${esc(c.code)}</pre>` : ''}`;
    h += `<div class="opts">${c.opts.map((o, i) => `<button class="opt" data-i="${i}">${esc(o)}</button>`).join('')}</div>`;
  } else {
    h += `<div class="code"></div>
      <div class="row">${c.kind === 'predict' ? '<input class="guess" inputmode="numeric" placeholder="guess">' : ''}<button class="run">▶ Run</button>
      ${c.hints ? '<button class="hint">💡 Hint</button>' : ''}<span class="key">or Shift + Enter</span><span class="msg"></span></div><div class="out"></div>`;
  }
  return h;
}
function wireQuiz(cell) {
  cell.el.querySelectorAll('.opt').forEach(o => o.onclick = () => {
    const i = +o.dataset.i;
    if (cell.vote) {
      if (cell.done) return;
      S.myVote = i;
      o.classList.add('right');
      finish(cell, cell.ok);
    } else if (i === cell.a) {
      o.classList.add('right');
      finish(cell, cell.ok);
    } else {
      o.classList.add('wrong');
      o.disabled = true;
      miss(cell);
      say(`<b>🚩 ${words().oops}</b> ${cell.tips[i]} Try again.`, 'flag');
    }
    saveNow();
  });
}
function wireCode(cell, n) {
  const el = cell.el, msg = el.querySelector('.msg');
  // The code box (js/editor.js). Typing clears the box's message, calms the coach and saves the lab half a second later.
  cell.ed = codeEditor(el.querySelector('.code'), cell.code, {
    label: `Python code for play ${n}`,
    onRun: () => run(cell),
    onChange: () => { msg.textContent = ''; rest(); saveSoon(); },
  });
  el.querySelector('.run').onclick = () => run(cell);
  const guess = el.querySelector('.guess');
  if (guess) guess.oninput = () => { msg.textContent = ''; };
  const hint = el.querySelector('.hint');
  if (hint) hint.onclick = () => {
    S.misses[cell.skill] += .5;
    const hints = cell.hints;
    say(`<b>💡 Hint ${Math.min(cell.hintN + 1, hints.length)}:</b> ${hints[Math.min(cell.hintN++, hints.length - 1)]}`, 'hint');
    saveNow();
  };
}

export async function startGame(w, i) {
  if (!LABS[S.sport][i]) {
    try { await loadLab(S.sport, i); }
    catch { return say('I could not open this game. Check the internet connection and try again.', 'flag'); }
  }
  const lab = LABS[S.sport][i];
  S.week = i; S.gameSport = S.sport;
  S.LAB = lab.cells; S.REVIEW = lab.review; S.SKILL_NAMES = lab.skills;
  S.misses = Object.fromEntries(Object.keys(S.SKILL_NAMES).map(k => [k, 0]));
  S.doneCount = 0; S.rvWrong = {}; S.rvAt = -1; S.myVote = undefined;
  resetAsk();
  $('#qtr').textContent = w.stadium.toUpperCase();
  $('#film')?.remove();
  $('#saved').classList.remove('on');
  $('#game').classList.add('on');
  $('#coach').classList.add('lab');
  $('#you').textContent = 0;
  $('#ball').textContent = SEASON[S.sport].ball;
  $('#goal').textContent = words().goal;
  const nb = $('#nb');
  nb.innerHTML = '';
  nb.scrollTop = 0;

  S.cells = [];
  for (const c of S.LAB) {
    if (c.md) {
      const d = document.createElement('div');
      d.className = 'md';
      d.innerHTML = c.md;
      nb.appendChild(d);
      continue;
    }
    const cell = { ...c, done: false, hintN: 0 };
    const el = cell.el = document.createElement('div');
    el.className = 'cell wait';
    el.innerHTML = cellHtml(c, S.cells.length + 1);
    nb.appendChild(el);
    S.cells.push(cell);
    if (c.kind === 'quiz') wireQuiz(cell); else wireCode(cell, S.cells.length);
  }
  S.cells[0].el.classList.remove('wait');
  moveBall();

  // A saved game of this lab? Only if its boxes still match the lab file.
  const rec = store.get(progKey(S.sport, i), null);
  const fits = rec?.v === labVersion(lab) && rec.plays?.length === S.cells.length;
  if (rec && !fits) dropProgress(S.sport, i);   // the lab changed since: its old boxes no longer match
  startSaving();
  // Load the rest of this lab in the background: tables, stats, chart tools.
  const preload = () => loadData()
    .then(() => lab.cells.some(c => c.code && CHART.test(c.code)) && loadCharts())
    .catch(() => {});
  if (fits) {
    restoreBoxes(rec);
    if (S.doneCount === S.cells.length) {   // the game was won; the film review was under way
      $('#you').textContent = 7;
      if (S.rvAt > 0) say('Welcome back to the film room!');
      return review(Math.max(0, S.rvAt));
    }
    say(S.doneCount ? `Welcome back! I am putting your first ${S.doneCount} plays back into Python. One moment…`
                    : 'Welcome back! Your code is still here. I am warming up Python…');
    return bringBack(i, () => {
      say(`All set! You are on <b>Play ${S.doneCount + 1}</b>. Press <b>▶ Run</b> when you are ready.`, 'jump');
      preload();
    });
  }
  say('Welcome to the locker room! This is our playbook. Run the first box. I am warming up Python…');
  // Say "ready" only when Play 1 can really run.
  const here = () => S.week === i && $('#game').classList.contains('on') && S.doneCount === 0;
  const warm = () => ready(S.cells[0]).then(
    () => {
      if (here() && !S.cells[0].running) say('Python is ready. Press <b>▶ Run</b> on Play 1!', 'jump');
      preload();
    },
    () => here() && say('I could not load Python. Check the internet connection, then press <b>Try again</b>.', 'flag',
      { label: 'Try again', go: () => { say('Trying again. I am warming up Python…'); warm(); } }));
  warm();
}

async function run(c) {
  if (c.running) return;
  if (py.runningCell && py.runningCell !== c) {
    c.el.querySelector('.msg').textContent = 'One play at a time: wait for the other box to finish.';
    return;
  }
  c.running = true;
  try {
    await waitForRestore();   // the finished boxes go back into Python first
    await runBox(c);
  } finally {
    c.running = false;
    saveNow();
  }
}

async function runBox(c) {
  const el = c.el, msg = el.querySelector('.msg'), out = el.querySelector('.out'), btn = el.querySelector('.run');
  const code = c.ed.value;
  let guess;
  msg.textContent = '';
  if (c.kind === 'predict' && !c.done) {
    guess = el.querySelector('.guess').value.trim();
    if (!guess || isNaN(+guess)) { msg.textContent = 'Type your guess as a number first.'; return; }
  }
  if (!code.replace(/#.*/g, '').trim()) { msg.textContent = 'Write some code first.'; return; }
  if (code.includes('___')) { msg.textContent = 'Fill in every ___ first.'; return; }

  btn.classList.add('busy');
  const wait = setTimeout(() => say('I am still loading what this box needs. The button shows how far I am. Your box will run by itself when it is ready.'), 2500);
  try {
    await ready(c, btn, code);
  } catch {
    btn.textContent = '▶ Run';
    btn.classList.remove('busy');
    return say('I could not load what this box needs. Check the internet connection, then press <b>▶ Run</b> again.', 'flag');
  } finally {
    clearTimeout(wait);
  }

  // After about 3 seconds of running, ⏹ Stop appears (time spent answering an input( ) question does not count).
  btn.textContent = '⏳ Running';
  py.runningCell = c;
  const stop = document.createElement('button');
  stop.className = 'stop'; stop.textContent = '⏹ Stop'; stop.hidden = true;
  btn.after(stop);
  stop.onclick = stopPy;
  const loopy = /\bwhile\b/.test(code);
  let slow;
  const tick = () => {
    if (py.asking || Date.now() - py.answeredAt < 3000) { slow = setTimeout(tick, 1000); return; }
    stop.hidden = false;
    say(loopy ? '<b>🚩 That loop may never end!</b> Press <b>⏹ Stop</b>, then look at your <code>while</code> line. What makes it stop?'
              : 'This is taking a long time. If it never ends, press <b>⏹ Stop</b>.', loopy ? 'flag' : '');
  };
  slow = setTimeout(tick, 3000);

  let res;
  try {
    res = await pyCall('run', { code, data: !!c.data });
  } catch (e) {
    res = { error: e.message, stopped: e.stopped };
  } finally {
    clearTimeout(slow);
    stop.remove();
    py.runningCell = null;
    closeAsk();
    btn.classList.remove('busy');
    btn.textContent = '▶ Run';
  }

  if (res.stopped) {
    out.className = 'out on err';
    out.textContent = 'Stopped.';
    say('Stopped! I am starting a fresh Python and getting your playbook back…', 'flag');
    return bringBack(S.week, () => say(loopy
      ? 'Ready again! Look at your <code>while</code> line: what makes the loop stop? Fix it, then press <b>▶ Run</b>.'
      : 'Ready again! Press <b>▶ Run</b> when you are ready.', 'hint'));
  }
  if (res.error) {
    out.className = 'out on err';
    const lastLine = res.error.trim().split('\n').filter(l => !/^See https?:/.test(l)).pop() || '';
    out.textContent = lastLine.replace(/https?:\/\/\S+/g, '');
    if (c.expectError && res.error.includes(c.expectError)) {
      if (!c.done) { c.passedCode = code; finish(c, c.ok); }
      return;
    }
    if (!c.done) miss(c);
    return say(`<b>🚩 ${words().flag}</b> ${friendly({ message: res.error })}`, 'flag');
  }

  const text = res.out;
  out.className = 'out on';
  out.innerHTML = (text ? `<div>${esc(text)}</div>` : '') + res.rich || '(nothing printed)';
  // A chart is tall: bring all of it into view, or its bottom axis stays hidden under the fold (the child's feedback, 2026-11-19).
  out.querySelectorAll('img').forEach(img => img.addEventListener('load', () => img.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), { once: true }));
  if (c.done) return;
  let r;
  try {
    r = c.check ? await c.check({ code, out: text, guess, g, q }) : { ok: true, msg: c.ok };
  } catch (e) {
    console.warn('check failed', e);
    return say('I could not check this box. Press <b>▶ Run</b> again.', 'flag');
  }
  if (r.missed) S.misses[c.skill]++;
  // The code that passed is what Python remembers from this play; progress.js runs it again after a reload or a Stop,
  // even if the child changes the box later (into an endless loop, say).
  if (r.ok) { c.passedCode = code; finish(c, r.msg); }
  else { miss(c); say(`<b>🚩 Not yet.</b> ${r.msg}`, 'flag'); }
}

function finish(c, text) {
  c.done = true;
  c.el.classList.add('done');
  S.doneCount++;
  moveBall();
  const next = S.cells[S.cells.indexOf(c) + 1];
  if (next) {
    next.el.classList.remove('wait');
    const goNext = () => {
      const before = next.el.previousElementSibling;   // a mission title above the next play scrolls into view with it
      (before.classList.contains('md') ? before : next.el).scrollIntoView({ block: 'start' });
      next.ed?.focus();
    };
    say(`<b>${words().cheers[S.doneCount % 5]}</b> ${text}`, 'jump', { label: 'Next play ↓', go: goNext });
  } else {
    $('#you').textContent = 7;
    confetti();
    say(`<b>${words().win}</b> ${text} You win 7–0! Now a quick film review, just for fun.`, 'win', { label: '🎬 Film review', go: () => review(0) });
  }
}
function confetti() {
  const colors = ['#ffc83d', '#ff5a4f', '#31c46b', '#4aa3ff', '#fff'];
  for (let i = 0; i < 70; i++) {
    const d = document.createElement('div');
    d.className = 'confetti';
    d.style.cssText = `left:${Math.random() * 100}%;background:${colors[i % 5]};animation-duration:${1.6 + Math.random() * 1.8}s;animation-delay:${Math.random() * .5}s`;
    $('main').appendChild(d);
    setTimeout(() => d.remove(), 4200);
  }
}

/* ---------- film review ---------- */
function card(html) {
  let el = $('#film');
  if (!el) {
    el = document.createElement('div');
    el.id = 'film'; el.className = 'cell';
    $('#nb').appendChild(el);
  }
  el.innerHTML = html;
  el.scrollIntoView({ block: 'center' });
  return el;
}
function review(i) {
  const r = S.REVIEW[i];
  $('#qtr').textContent = 'FILM';
  $('#down').textContent = `Question ${i + 1} of ${S.REVIEW.length}`;
  const el = card(`<span class="tag">🎬 FILM REVIEW · ONE TRY, NO HINTS</span><div class="task">${r.q}</div>${r.code ? `<pre class="show">${esc(r.code)}</pre>` : ''}
    <div class="opts">${r.opts.map((o, k) => `<button class="opt" data-i="${k}">${esc(o)}</button>`).join('')}</div>`);
  if (i === 0) say('Film room time! A few quick questions about today, just for fun. One try each.');
  el.querySelectorAll('.opt').forEach(o => o.onclick = () => {
    const ok = +o.dataset.i === r.a;
    el.querySelectorAll('.opt').forEach(b => b.disabled = true);
    o.classList.add(ok ? 'right' : 'wrong');
    if (!ok) {
      S.rvWrong[r.skill] = true;
      el.querySelector(`[data-i="${r.a}"]`).classList.add('right');
    }
    S.rvAt = i + 1;
    saveNow();
    say(ok ? 'Yes! Locked in.' : 'Good try! The green one is the answer. Now you know it.', ok ? 'jump' : '');
    setTimeout(() => i + 1 < S.REVIEW.length ? review(i + 1) : report(), 1400);
  });
}
function report() {
  // Only what was learned, never a grade: the child asked not to see "Not yet" or "Practice more" at the end.
  const names = S.SKILL_NAMES;
  const rows = Object.keys(names).map(k => `<div class="rep">${names[k]}<span class="g">✅</span></div>`).join('');
  card(`<span class="tag">🏆 TODAY YOU LEARNED</span><div class="big">🏆</div><div class="task" style="text-align:center"><b>Week ${S.week + 1} final: You 7, Bugs 0</b></div>${rows}`);
  $('#down').textContent = 'Final';
  const won = S.won[S.sport];
  if (!won.includes(S.week)) { won.push(S.week); store.set('wins', S.won); }
  dropProgress(S.gameSport, S.week);   // the week is won: the trophy stays, the half-way record goes
  draw();
  say('Great game! Look at everything you learned today. See you next week!',
    'win', { label: 'Back to the map', go: leave });
}

function closeLab() {
  stopSaving();
  $('#game').classList.remove('on');
  $('#coach').classList.remove('lab');
}
function leave() {
  closeLab();
  S.picked = -1;
  draw();
  say('Here is the whole season. Tap a stadium to fly there!');
}
$('#quit').onclick = () => {
  closeLab();
  say('Back on the map. Tap a stadium to play.');
};

// On narrow screens the playbook ends where the coach's strip begins.
function dock() {
  const c = $('#coach');
  $('#game').style.bottom = c.classList.contains('lab') && innerWidth <= 820 ? c.offsetHeight + 'px' : '';
}
new ResizeObserver(dock).observe($('#coach'));
addEventListener('resize', dock);
