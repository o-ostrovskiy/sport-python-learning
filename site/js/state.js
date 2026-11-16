// What every part of the game page shares: small helpers and the state of the season and of the lab being played.
// ES modules cannot change each other's variables, so the changing state lives in one object, S.

export const $ = selector => document.querySelector(selector);

// localStorage can be missing or full (a private window, a locked-down tablet): the page must work without it.
export const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
  },
};

// Escapes text a child typed (or code) before it goes into HTML.
export const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

// Lab files (labs/<sport>-<NN>.js) register themselves here.
export const LABS = { nfl: {}, mlb: {} };

const params = new URLSearchParams(location.search);
export const S = {
  // the season on the map
  sport: params.get('sport') === 'mlb' ? 'mlb' : 'nfl',
  won: loadWins(),        // { nfl: [week indexes], mlb: [...] }, from season.js
  picked: -1,             // the stadium tapped once on the map
  // the lab being played
  week: undefined, gameSport: undefined,
  LAB: undefined, REVIEW: undefined, SKILL_NAMES: undefined,
  cells: undefined,       // the plays: each lab cell plus its element, done flag and hint level
  misses: undefined,      // skill -> how often the child missed it (a hint counts half)
  doneCount: 0,
  rvWrong: {},            // skills missed in the film review
  rvAt: -1,               // the film review question reached
  myVote: undefined,      // the answer of a quiz with vote: true
};
export const wantWeek = (parseInt(params.get('week')) || 0) - 1;   // play.html?week=3 opens week 3's stadium

// Lab files are classic scripts: they find these by their global names.
window.registerLab = (sport, n, lab) => { LABS[sport][n - 1] = lab; };
window.esc = esc;
Object.defineProperty(window, 'myVote', { get: () => S.myVote });
window.seasonState = S;   // read by the browser tests in tools/
