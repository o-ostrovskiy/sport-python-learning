// Coach Andrew: his speech bubble, his voice and his face (mouth, blinking, reactions).
import { $, S } from './state.js';

let voiceOn = false;   // the voice is off until the child turns it on; the choice is remembered
let typer;

// Pick the most natural English voice this computer has; the default one often sounds robotic.
const VOICE_PICKS = [/Andrew.*Natural/i, /Guy.*Natural/i, /Natural/i, /Evan.*(Enhanced|Premium)/i, /Nathan.*(Enhanced|Premium)/i,
  /(Enhanced|Premium)/i, /Google US English/i, /Aaron/i, /Samantha/i, /Daniel/i];
function bestVoice() {
  const en = speechSynthesis.getVoices().filter(v => /^en[-_]/i.test(v.lang));
  for (const pick of VOICE_PICKS) {
    const v = en.find(v => pick.test(v.name));
    if (v) return v;
  }
  return en.find(v => /en[-_]US/i.test(v.lang)) || en[0];
}
if ('speechSynthesis' in window) speechSynthesis.getVoices();

// The coach's voice comes from the site's server (/api/speak); without it, the computer's own voice is used.
const ttsCache = new Map();
let audio, speakN = 0;
export function hush() {
  audio?.pause();
  window.speechSynthesis?.cancel();
}
function localSpeak(text) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text), v = bestVoice();
  if (v) u.voice = v;
  u.lang = 'en-US'; u.rate = 0.96; u.pitch = 1;
  speechSynthesis.speak(u);
}

// What the server offers (coach questions, coach voice). Stays off when the site runs without its server.
export const API = { ask: false, voice: false };
fetch('/api/status')
  .then(r => r.ok ? r.json() : {})
  .then(j => { Object.assign(API, j); document.body.classList.toggle('ask-on', !!API.ask); })
  .catch(() => {});
async function synth(text) {
  const r = await fetch('/api/speak', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
  if (!r.ok) throw new Error('speak ' + r.status);
  return URL.createObjectURL(await r.blob());
}

// Lines recorded ahead of time (assets/voice, made by tools/record-voice.mjs) play at once, with no wait.
const RECORDED = window.COACH_VOICE ||= {};

// Sound goes through one meter, so the coach can bounce with his own voice.
let actx, meter, amp;
function wire(el) {
  try {
    actx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (!meter) {
      meter = actx.createAnalyser(); meter.fftSize = 512; amp = new Uint8Array(512);
      meter.connect(actx.destination);
    }
    actx.createMediaElementSource(el).connect(meter);
    if (actx.state === 'suspended') actx.resume();
  } catch (e) { console.warn('No sound meter', e); }
  return el;
}
addEventListener('pointerdown', () => { if (actx?.state === 'suspended') actx.resume(); });
function loadClip(url) {
  const el = new Audio(url);
  el.preload = 'auto';
  return wire(el);
}
function playClip(el) {
  return new Promise((done, fail) => {
    audio = el;
    el.onended = done;
    el.onerror = () => fail(new Error('clip did not load'));
    el.play().catch(fail);
  });
}

// Mouth and eyes. Next to each coach picture sit three more: -talk (the other mouth), -blink and -talkblink.
// The mouth follows the loudness of his voice, and he blinks every few seconds.
let level = 0;
let pose = 'assets/coach-wave', frame = '', mouthOpen = false, blinkAt = performance.now() + 3000;
export const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const frames = {};
function setPose(p) {
  pose = p; frame = '';
  $('#coachSvg').src = p + '.webp';
  if (!calm) for (const f of ['-talk', '-blink', '-talkblink']) (frames[p + f] ??= new Image()).src = p + f + '.webp';
}

// A reaction (cheer, flag, hint) is brief: once the line has been read or spoken he goes back to his resting picture.
// He also goes back at once when the child presses the bubble's button or starts typing. The trophy stays until the next line.
let restStem = 'assets/coach-wave', restAt = 0;   // say() keeps restStem in step with the sport
export function rest() {
  restAt = 0;
  const c = $('#coach');
  if (c.classList.contains('win') || pose === restStem) return;
  c.classList.remove('jump', 'flag', 'hint', 'talk');
  setPose(restStem);
}
function face(t) {
  const sounding = window.speechSynthesis?.speaking || (audio && !audio.paused && !audio.ended);
  if (restAt && t > restAt && level < .02 && !sounding) rest();
  if (calm) return;
  // With the computer's own voice, or with the voice off, there is no sound to measure: the mouth keeps a steady rhythm.
  const steady = window.speechSynthesis?.speaking || (!voiceOn && $('#coach').classList.contains('talk'));
  const speaking = level > .02 || steady;
  mouthOpen = level > .02 ? level > (mouthOpen ? .12 : .2) : steady && t % 280 < 150;
  const restsOpen = !/flag|watch/.test(pose);   // the flag and watching pictures rest with a closed mouth
  if (t > blinkAt + 140) blinkAt = t + 2500 + Math.random() * 3500;
  const mouth = speaking && mouthOpen !== restsOpen, blink = t > blinkAt;
  const f = mouth && blink ? '-talkblink' : mouth ? '-talk' : blink ? '-blink' : '';
  const loaded = frames[pose + f]?.complete && frames[pose + f].naturalWidth;
  if (f === frame || (f && !loaded)) return;   // a picture still loading: keep the current one
  frame = f;
  $('#coachSvg').src = pose + f + '.webp';
}
(function bounce() {
  requestAnimationFrame(bounce);
  let now = 0;
  if (meter && audio && !audio.paused && !audio.ended) {
    meter.getByteTimeDomainData(amp);
    let sum = 0;
    for (const v of amp) sum += ((v - 128) / 128) ** 2;
    now = Math.min(1, 4.5 * Math.sqrt(sum / amp.length));
  }
  level += (now - level) * (now > level ? .55 : .18);
  face(performance.now());
  const img = $('#coachSvg').style;
  if (level < .01) {
    if (img.scale) img.scale = img.translate = '';
    return;
  }
  img.scale = `${1 - .04 * level} ${1 + .09 * level}`;
  img.translate = `0 ${-7 * level}px`;
})();

// Cut a bubble into recorded pieces, longest first: "Boom!" + the lab's line, or "Flag!" + the tip + "Try again."
// Words with no recording come back as { live }, to be spoken by the server when it offers a voice.
function pieces(text) {
  if (!text) return [];
  const k = Object.keys(RECORDED).filter(k => ` ${text} `.includes(` ${k} `)).sort((a, b) => b.length - a.length)[0];
  if (!k) return [{ live: text }];
  const i = ` ${text} `.indexOf(` ${k} `);
  return [...pieces(text.slice(0, i).trim()), { clip: RECORDED[k] }, ...pieces(text.slice(i + k.length).trim())];
}
async function speak(text) {
  hush();
  const n = ++speakN;
  text = text.replace(/\s+/g, ' ').trim();
  if (!text) return;
  const plan = pieces(text);
  // One voice only: once recorded lines exist, a line with no recording stays silent (the bubble still shows it)
  // instead of switching to the computer's robotic voice.
  const robotOk = !Object.keys(RECORDED).length;
  if (!API.voice && !plan.some(p => p.clip)) {
    if (robotOk) localSpeak(text);
    return;
  }
  // Get every piece moving at once, so each is ready when the one before it ends.
  const ready = plan.map(p => {
    if (p.clip) return loadClip('assets/voice/' + p.clip);
    if (!API.voice) return null;
    if (!ttsCache.has(p.live)) ttsCache.set(p.live, synth(p.live));
    return ttsCache.get(p.live).then(loadClip);
  });
  ready.forEach(r => r?.catch?.(() => {}));
  let started = false;
  try {
    for (const r of ready) {
      if (!r) continue;
      const el = await r;
      if (n !== speakN) return;
      started = true;
      await playClip(el);
      if (n !== speakN) return;
    }
  } catch (e) {
    if (e?.name === 'NotAllowedError') return;   // the browser wants one tap on the page before any sound
    console.warn('Coach voice failed', e);
    plan.forEach(p => p.live && ttsCache.delete(p.live));
    if (n === speakN && !started && robotOk) localSpeak(text);
  }
}

// Shows a line in the bubble (and speaks it when the voice is on).
// mood: '' | 'jump' | 'flag' | 'hint' | 'win'. btn: one { label, go, alt } or a list of them.
export function say(html, mood = '', btn) {
  const c = $('#coach'), box = $('#say');
  const lab = c.classList.contains('lab');
  c.className = mood;
  void c.offsetWidth;   // restart the reaction animation
  c.classList.add('talk');
  c.classList.toggle('lab', lab);
  // Resting picture: waving hello on the map, hands on hips and watching inside a lab.
  const mlb = S.sport === 'mlb';
  restStem = 'assets/coach-' + (mlb ? (lab ? 'baseball-watch' : 'baseball') : (lab ? 'watch' : 'wave'));
  const react = { jump: 'cheer', flag: 'flag', hint: 'hint', win: 'trophy' }[mood];
  setPose(react ? 'assets/coach-' + (mlb ? 'baseball-' : '') + react : restStem);
  box.innerHTML = html;
  for (const x of [].concat(btn || [])) {
    const b = document.createElement('button');
    b.className = 'go' + (x.alt ? ' alt' : '');
    b.textContent = x.label;
    b.onclick = () => { rest(); x.go(); };
    box.appendChild(b);
  }
  const length = box.textContent.length;
  restAt = ['jump', 'flag', 'hint'].includes(mood) ? performance.now() + Math.min(8000, 2000 + length * 50) : 0;
  clearTimeout(typer);
  typer = setTimeout(() => c.classList.remove('talk'), Math.min(4000, 600 + length * 45));
  if (voiceOn) {
    const t = document.createElement('div');
    t.innerHTML = html.replace(/<br\s*\/?>/gi, ' ');
    speak(t.textContent.replace(/[^\p{L}\p{N}\p{P}\p{Zs}+=<>*\/]/gu, ' '));
  }
}

function setVoice(on) {
  voiceOn = on;
  const b = $('#voice');
  b.classList.toggle('on', on);
  b.textContent = on ? '🔊' : '🔈';
  try { localStorage.setItem('voice', on ? '1' : '0'); } catch {}
}
$('#voice').onclick = () => {
  setVoice(!voiceOn);
  if (voiceOn) say('Voice is on! I will talk you through the plays.', 'jump');
  else hush();
};
try { if (localStorage.getItem('voice') === '1') setVoice(true); } catch {}
$('#nb').addEventListener('input', rest);   // typing in a play: the coach stops celebrating and watches
let pokes = 0;
$('#coachSvg').onclick = () => say(['Hey, that tickles!', 'I am a ball. I do not have a belly button.', 'Less poking, more coding!'][pokes++ % 3], 'jump');
