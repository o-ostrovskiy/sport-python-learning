// The game page (play.html) starts here. Plain ES modules, no build step:
//   state.js     what the parts share: helpers and the state of the season and the lab
//   voice.js     Coach Andrew: bubble, voice and face
//   map.js       the drawn season map and the week strip
//   editor.js    the code box of a play (CodeMirror, from assets/vendor/codemirror)
//   python.js    Python in a Web Worker (py-worker.js): loading, input( ), Stop, errors in plain words
//   game.js      the lab notebook: plays, checks, film review, scouting report
//   progress.js  a lab in progress, saved in this browser
//   ask.js       questions to the coach (only when the home server offers them)
// season.js, assets/voice/index.js and assets/usa-map.js load before this as classic scripts.
import { S, wantWeek } from './state.js';
import { say } from './voice.js';
import { draw, pick } from './map.js';
import './game.js';
import './progress.js';
import './ask.js';

draw();
// A week is playable once its lab file exists in labs/.
let want = wantWeek;
findLabs((sport, i) => {
  draw();
  if (sport === S.sport && i === want) { want = -1; pick(i); }
});
document.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x.dataset.sport === S.sport));
say("Hi, I'm Coach Andrew! This map is our season. Tap the glowing stadium and let's win some games with Python.");
