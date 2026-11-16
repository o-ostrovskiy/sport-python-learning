// The season map: one drawing of the 48 states (assets/usa-map.js, made once by tools/build-map.mjs),
// with a numbered tile for every stadium (its xy in season.js), the route between them, and the week strip above.
import { $, S, store } from './state.js';
import { say, calm } from './voice.js';
import { loadBase } from './python.js';
import { progKey, dropProgress } from './progress.js';
import { startGame } from './game.js';

// A gentle arc between two spots, for the route and for the ball's flight.
function arc(a, b) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
  return `M${a[0]},${a[1]} Q${Math.round(mx - dy * .18)},${Math.round(my + dx * .18)} ${b[0]},${b[1]}`;
}

// won: a trophy; next: the first playable week not won yet, glowing; later: playable, waiting its turn; locked: coming soon.
function status(i) {
  const weeks = SEASON[S.sport].weeks, won = S.won[S.sport];
  if (won.includes(i)) return 'won';
  if (!weeks[i].ready) return 'locked';
  return i === weeks.findIndex((w, k) => w.ready && !won.includes(k)) ? 'next' : 'later';
}
const pinFace = (st, i) => st === 'won' ? '🏆' : st === 'locked' ? '🔒' : String(i + 1);

let ballAt = 0;            // the stadium the ball stands next to
const BALL = [32, 16];     // the ball sits at the bottom right of a stadium's tile, clear of the name flag

function pinSvg(w, i, st, show) {
  const label = `Week ${i + 1}: ${w.city}, ${w.stadium}${st === 'won' ? ', won' : st === 'locked' ? ', coming soon' : ''}`;
  const f = pinFace(st, i), flagW = 28 + w.city.length * 9.2;
  return `<g class="pin ${st}${show ? ' show' : ''}" data-i="${i}" transform="translate(${w.xy})" tabindex="0" role="button" aria-label="${label}">
    ${st === 'next' ? '<circle class="glow" r="30"/>' : ''}
    <rect x="-23" y="-23" width="46" height="46" rx="12" transform="rotate(-6)" class="tile"/>
    <text y="${st === 'won' ? 8 : 9}" class="${/\d/.test(f) ? 'num' : 'emo'}">${f}</text>
    <g class="flag" transform="translate(0,-42)"><rect x="${-flagW / 2}" y="-16" width="${flagW}" height="28" rx="8"/><text y="4">${w.city}</text></g>
  </g>`;
}

export function draw() {
  const season = SEASON[S.sport], M = window.USA_MAP, won = S.won[S.sport];
  const xy = season.weeks.map(w => w.xy), st = season.weeks.map((w, i) => status(i));
  const show = S.picked >= 0 ? S.picked : st.indexOf('next');
  ballAt = S.picked >= 0 ? S.picked : won.length ? won[won.length - 1] : 0;
  const legs = xy.slice(1).map((p, i) => `<path class="route${won.includes(i) ? ' done' : ''}" d="${arc(xy[i], p)}"/>`).join('');
  const pins = season.weeks.map((w, i) => pinSvg(w, i, st[i], i === show)).join('');
  const sportName = S.sport === 'mlb' ? 'baseball' : 'football';
  $('#map').innerHTML = `<svg viewBox="0 0 ${M.W} ${M.H}" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Map of the ${sportName} season">
    <path class="shadow" d="${M.land}" transform="translate(6,7)"/><path class="land" d="${M.land}"/><path class="borders" d="${M.borders}"/>
    ${legs}${pins}<text class="mball" aria-hidden="true">${season.ball}</text>
    <g class="compass" aria-hidden="true" transform="translate(${M.W - 70},${M.H - 70})"><circle r="26" fill="#fff" stroke="#10203a" stroke-width="3"/>
      <path d="M0,-18 L6,0 L0,18 L-6,0Z" fill="#ff5a4f" stroke="#10203a" stroke-width="2"/><text y="-32">N</text></g>
    <text class="title" x="40" y="${M.H - 52}">${S.sport === 'mlb' ? 'Baseball' : 'Football'} road trip</text>
    <text class="sub" x="40" y="${M.H - 30}">${season.weeks.length} stadiums · ${won.length} won</text></svg>`;
  $('#map').querySelectorAll('.pin').forEach(pin => {
    const i = +pin.dataset.i;
    pin.onclick = () => tap(i);
    pin.onkeydown = e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tap(i); }
    };
  });
  setBall(xy[ballAt]);

  // The week strip: the same weeks as buttons, for the keyboard and for screen readers.
  $('#sched').innerHTML = '';
  season.weeks.forEach((w, i) => {
    const b = document.createElement('button');
    b.className = 'wk ' + st[i];
    const icon = st[i] === 'won' || st[i] === 'locked' ? pinFace(st[i], i) : season.ball;
    b.innerHTML = `<span class="n">${icon}</span><span>Week ${i + 1} · ${w.city}<small>${w.stadium}</small></span>`;
    b.onclick = () => tap(i);
    $('#sched').appendChild(b);
  });
  $('#rec').textContent = `${won.length}–0`;
}

function setBall(p) {
  const b = $('#map .mball');
  if (!b) return;
  b.setAttribute('x', p[0] + BALL[0] - 15);
  b.setAttribute('y', p[1] + BALL[1] + 10);
}
// The trip to a stadium: the ball flies along an arc from where it stands, in about a second.
let flight = 0;
function flyBall(to) {
  const xy = SEASON[S.sport].weeks.map(w => w.xy), from = ballAt;
  ballAt = to;
  const n = ++flight;
  if (calm || from === to) return setBall(xy[to]);
  const off = p => [p[0] + BALL[0], p[1] + BALL[1]];
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', arc(off(xy[from]), off(xy[to])));
  const len = path.getTotalLength(), t0 = performance.now(), ms = 1100;
  (function step(t) {
    if (n !== flight) return;   // a newer flight took over
    const k = Math.min(1, (t - t0) / ms);
    const eased = k < .5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
    const pt = path.getPointAtLength(eased * len);
    setBall([pt.x - BALL[0], pt.y - BALL[1]]);
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}

// First tap flies to the stadium; a second tap on the same one starts its lab.
function tap(i) {
  const w = SEASON[S.sport].weeks[i];
  if (S.picked === i && w.ready) startGame(w, i);
  else pick(i);
}
export function pick(i) {
  S.picked = i;
  const w = SEASON[S.sport].weeks[i], st = status(i);
  $('#map').querySelectorAll('.pin').forEach(pin => pin.classList.toggle('show', +pin.dataset.i === i));
  flyBall(i);
  const card = stadiumLine(w);
  if (!w.ready) return say(`${card}<br><br>${playbookLine(w, i)} This game is coming soon!`);
  loadBase().catch(() => {});   // start loading Python now, while the child looks at the stadium
  const saved = store.get(progKey(S.sport, i), null);
  if (saved?.plays?.length) {
    const n = saved.plays.length, at = saved.doneCount >= n ? 'the film review' : `<b>Play ${saved.doneCount + 1} of ${n}</b>`;
    return say(`${card}<br><br><b>Welcome back!</b> You stopped at ${at} in this game. Pick up where you left off?`, 'jump', [
      { label: '▶ Continue where I stopped', go: () => startGame(w, i) },
      { label: '↺ Start over', alt: true, go: () => { dropProgress(S.sport, i); startGame(w, i); } },
    ]);
  }
  say(`${card}<br><br>${playbookLine(w, i)} Tap the ball again or press Kick off!`, 'jump',
    { label: st === 'won' ? 'Play again' : 'Kick off!', go: () => startGame(w, i) });
}

document.querySelectorAll('.tab').forEach(t => t.onclick = () => {
  document.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x === t));
  S.sport = t.dataset.sport;
  S.picked = -1;
  draw();
  say(S.sport === 'mlb' ? 'Baseball season! Same Python, different ballpark. These games are coming soon.'
                        : 'Back to the gridiron! Tap a stadium on the map.');
});
