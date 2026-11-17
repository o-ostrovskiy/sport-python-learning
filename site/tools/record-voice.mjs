// Records the coach's fixed lines once, so the page can play them with no wait.
//   node site/tools/record-voice.mjs            record every line that has no file yet (safe to run again and again)
//   node site/tools/record-voice.mjs --list     only count the lines; records nothing, needs no key
//   node site/tools/record-voice.mjs --lists    only rewrite the lists from the recordings on disk; records nothing
//   node site/tools/record-voice.mjs --check    only report lines from voice-lines.json that no longer match the game page (play.html, js/)
//   node site/tools/record-voice.mjs --redo "Boom!"   record one line again (a new take)
// Where the lines come from:
//   tools/voice-lines.json   the coach's own fixed lines and openers in the game page (js/*.js)
//   season.js                one line per stadium (stadiumLine, playbookLine)
//   labs/<sport>-<NN>.js     every play's ok line, hints, quiz tips, and fixed text used as msg: in check()
// Reads the key from server/.env (GEMINI_API_KEY). Needs ffmpeg.
// Writes site/assets/voice/*.mp3, plus the lists the page loads: index.js (always) and <lab>.js (with each lab).
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)), SITE = path.resolve(HERE, '..'), OUT = path.join(SITE, 'assets', 'voice');
const env = { ...process.env };
try { for (const line of fs.readFileSync(path.resolve(SITE, '..', 'server', '.env'), 'utf8').split('\n')) { const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/); if (m && !(m[1] in process.env)) env[m[1]] = m[2]; } } catch {}
// One model, so every clip sounds the same. A clip's file name does not say which model made it, so a second model would
// mix voices without a trace. Only when TTS_MODEL_2 is set on purpose does the tool carry on with it after the first
// model's daily allowance is used up (2026-11-17: the lite model used to be the default here, against the voice task's rule).
const MODELS = [...new Set([env.TTS_MODEL || 'gemini-3.8-flash-tts', env.TTS_MODEL_2].filter(Boolean))]; let model = 0;
const VOICE = env.TTS_VOICE || 'Achird', BITRATE = '32k';
const flag = f => process.argv.includes(f);

// The same clean-up the page does before speaking: HTML to plain text, drop emoji and symbols, squeeze spaces.
const clean = s => s.replace(/[^\p{L}\p{N}\p{P}\p{Zs}+=<>*\/]/gu, ' ').replace(/\s+/g, ' ').trim();
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', nbsp: ' ', '#39': "'", '#x27': "'" };
const norm = s => clean(String(s).replace(/<br\s*\/?>/gi, ' ').replace(/<\/?[a-zA-Z][^>]*>/g, '').replace(/&(amp|lt|gt|quot|nbsp|#39|#x27);/g, (m, e) => ENT[e]));

const cfg = JSON.parse(fs.readFileSync(path.join(HERE, 'voice-lines.json'), 'utf8'));
const lines = [];   // { group, text, style, file }
const seen = new Set();
function add(group, raw, styleName) {
  const text = norm(raw); if (!text || !/\p{L}/u.test(text) || seen.has(group + '|' + text)) return;
  seen.add(group + '|' + text);
  const style = cfg.styles[styleName] || cfg.styles.warm;
  const slug = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40).replace(/-$/, '');
  lines.push({ group, text, style, file: `${slug}-${crypto.createHash('sha1').update(`${VOICE}|${style}|${text}`).digest('hex').slice(0, 8)}.mp3` });
}

// 1. The coach's own lines.
for (const l of [...cfg.lines, ...cfg.starts]) add('index', l.text, l.style);
const own = lines.length;

// 2. Stadium lines, built by the same functions the page uses.
const season = vm.runInNewContext(fs.readFileSync(path.join(SITE, 'season.js'), 'utf8') + '\n;({ SEASON, stadiumLine, playbookLine })', { fetch: () => Promise.reject(), localStorage: {} });
for (const sp of ['nfl', 'mlb']) season.SEASON[sp].weeks.forEach((w, i) => { add('index', season.stadiumLine(w), 'warm'); add('index', season.playbookLine(w, i), 'warm'); });
const stadium = lines.length - own;

// 3. Lab lines.
const endOfString = (src, i) => { const q = src[i]; let j = i + 1; while (j < src.length && src[j] !== q) j += src[j] === '\\' ? 2 : 1; return j; };
function endOfTemplate(src, i) {
  let j = i + 1, has = false;
  for (; j < src.length && src[j] !== '`'; j++) {
    if (src[j] === '\\') j++;
    else if (src[j] === '$' && src[j + 1] === '{') { has = true; let d = 1; j += 2;
      for (; j < src.length && d; j++) { const c = src[j]; if (c === "'" || c === '"') j = endOfString(src, j); else if (c === '`') j = endOfTemplate(src, j).end; else if (c === '{') d++; else if (c === '}') d--; }
      j--; }
  }
  return { end: j, has };
}
// Fixed text inside each `msg:` expression of a lab file. Text built with ${...} cannot be recorded and is counted as live.
function msgText(src) {
  const out = []; let whole = 0, partly = 0, live = 0;
  for (const m of src.matchAll(/\bmsg:\s*/g)) {
    const found = []; let dyn = false, other = false; const stack = [];
    for (let i = m.index + m[0].length; i < src.length; i++) {
      const ch = src[i];
      if (ch === "'" || ch === '"' || ch === '`') {
        const t = ch === '`' ? endOfTemplate(src, i) : { end: endOfString(src, i), has: false };
        const before = src.slice(Math.max(0, i - 6), i).trimEnd(), after = src.slice(t.end + 1, t.end + 6).trimStart();
        if (t.has) dyn = true;
        else if (!stack.some(s => s !== 'g') && !/[=!]=$/.test(before) && !/^[=!]=/.test(after)) {
          try { found.push(vm.runInNewContext(src.slice(i, t.end + 1))); } catch {} }
        i = t.end; continue;
      }
      if (ch === '(') { const prev = src.slice(Math.max(0, i - 12), i).match(/([\w$]+|[\])])\s*$/)?.[1]; stack.push(prev && !/^(return|typeof|in|of)$/.test(prev) ? 'c' : 'g'); continue; }
      if (ch === '[' || ch === '{') { stack.push('b'); continue; }
      if (')]}'.includes(ch)) { if (!stack.length) break; stack.pop(); continue; }
      if ((ch === ',' || ch === ';') && !stack.length) break;
      if (/[\w$]/.test(ch) && !stack.length && !/\w/.test(src[i - 1] || '') && !/^(true|false|null)\b/.test(src.slice(i, i + 6))) other = true;
    }
    // Pieces must be whole sentences: a half sentence recorded alone sounds cut off.
    const good = found.filter(t => /[.!?…:]["')\s]*$/.test(norm(t)) && norm(t).length > 3);
    const success = /ok:\s*true/.test(src.slice(Math.max(src.lastIndexOf('{', m.index), m.index - 200), m.index));
    for (const t of good) out.push({ text: t, style: success ? 'warm' : 'gentle' });
    if (dyn || (other && good.length)) good.length ? partly++ : live++; else if (good.length && good.length === found.length) whole++; else live++;
  }
  return { out, whole, partly, live };
}

const labs = fs.readdirSync(path.join(SITE, 'labs')).filter(f => /^(nfl|mlb)-\d\d\.js$/.test(f)).map(f => f.slice(0, -3))
  .sort((a, b) => a.slice(4).localeCompare(b.slice(4)) || b.localeCompare(a));   // first labs first: nfl-01, mlb-01, nfl-02, mlb-02 ...
const report = [], broken = [];
globalThis.esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); globalThis.myVote = 0;
for (const name of labs) {
  const src = fs.readFileSync(path.join(SITE, 'labs', name + '.js'), 'utf8'); let lab = null;
  globalThis.registerLab = (sp, n, l) => { lab = l; };
  try { vm.runInThisContext(src, { filename: name + '.js' }); } catch (e) { lab = null; }
  if (!lab?.cells) { broken.push(name); continue; }   // half-written file: keep whatever was recorded for it before
  const before = lines.length;
  for (const c of lab.cells.filter(c => !c.md)) {
    if (typeof c.ok === 'string') add(name, c.ok, 'warm');
    for (const h of c.hints || []) add(name, h, 'warm');
    for (const t of c.tips || []) if (t) add(name, t, 'gentle');
  }
  const m = msgText(src); for (const t of m.out) add(name, t.text, t.style);
  report.push({ name, lines: lines.length - before, whole: m.whole, partly: m.partly, live: m.live });
}

if (flag("--dump")) { for (const l of lines.filter(l => l.group === process.argv[process.argv.indexOf("--dump") + 1])) console.log(l.style.slice(2, 8), "|", l.text); process.exit(0); }
const have = l => fs.existsSync(path.join(OUT, l.file));
console.log(`Lines: ${own} coach, ${stadium} stadium, ${lines.length - own - stadium} in ${report.length} labs. ${lines.filter(l => !have(l)).length} still to record.`);
for (const r of report) console.log(`  ${r.name}: ${r.lines} lines; check messages: ${r.whole} fixed, ${r.partly} partly live, ${r.live} live`);
if (broken.length) console.log(`  could not read (left as they were): ${broken.join(', ')}`);
if (flag('--list')) process.exit(0);

// Does every hand-written line still appear in the page? A line that was reworded there silently loses its recording.
// The coach's lines live in the game page's modules (site/js/*.js) and in play.html itself.
const pageFiles = [path.join(SITE, 'play.html'), ...fs.readdirSync(path.join(SITE, 'js')).filter(f => f.endsWith('.js')).map(f => path.join(SITE, 'js', f))];
const page = clean(pageFiles.map(f => fs.readFileSync(f, 'utf8')).join('\n').replace(/<\/?(b|code|i|br)>/g, ''));
const stale = lines.slice(0, own).filter(l => !page.includes(l.text) && !/^Hint \d:$/.test(l.text));
for (const l of stale) console.warn(`NOT ON THE GAME PAGE (reworded?): ${l.text}`);
if (flag('--check')) process.exit(stale.length ? 1 : 0);

if (!env.GEMINI_API_KEY) { console.error('No GEMINI_API_KEY in server/.env'); process.exit(1); }
fs.mkdirSync(OUT, { recursive: true });
const redo = flag('--redo') ? norm(process.argv[process.argv.indexOf('--redo') + 1] || '') : null;

async function record(l) {
  const r = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', { method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
    body: JSON.stringify({ model: MODELS[model],
      input: [{ type: 'user_input', content: [{ type: 'text', text: l.text, annotations: [{ type: 'speech_metadata', style: l.style }] }] }],
      response_format: { type: 'audio' }, generation_config: { speech_config: [{ voice: VOICE }] } }) });
  if (!r.ok) throw new Error(`gemini ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const part = ((await r.json()).steps || []).flatMap(s => s.content || []).find(c => c.data);
  if (!part) throw new Error('gemini sent no audio');
  // Cut the silence before the first word, then save as a small mp3.
  const ff = spawnSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', 'pipe:0', '-af', 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', BITRATE, path.join(OUT, l.file)],
    { input: Buffer.from(part.data, 'base64') });
  if (ff.status !== 0) throw new Error('ffmpeg: ' + String(ff.stderr).slice(0, 200));
}

// The lists the page loads. A tidy folder: recordings of lines that are gone are removed.
function writeLists() {
  const keep = new Set();
  for (const group of ['index', ...labs]) {
    const file = path.join(OUT, group + '.js');
    if (broken.includes(group)) {   // keep the old list and its recordings
      try { for (const f of Object.values(JSON.parse(fs.readFileSync(file, 'utf8').match(/\{\n[\s\S]*\}/)[0]))) keep.add(f); } catch {}
      continue; }
    const mine = lines.filter(l => l.group === group && have(l)); mine.forEach(l => keep.add(l.file));
    fs.writeFileSync(file, '// Made by tools/record-voice.mjs. Do not edit by hand.\nwindow.COACH_VOICE = Object.assign(window.COACH_VOICE || {}, ' + JSON.stringify(Object.fromEntries(mine.map(l => [l.text, l.file])), null, 1) + ');\n');
  }
  for (const f of fs.readdirSync(OUT)) {
    if (f.endsWith('.mp3') && !keep.has(f)) fs.unlinkSync(path.join(OUT, f));
    if (/^(nfl|mlb)-\d\d\.js$/.test(f) && !labs.includes(f.slice(0, -3))) fs.unlinkSync(path.join(OUT, f));
  }
}

if (flag('--lists')) { writeLists(); console.log('Lists rewritten.'); process.exit(0); }
let made = 0, failed = 0, inRow = 0, spent = false;
const todo = lines.filter((l, i) => (l.text === redo || !have(l)) && lines.findIndex(x => x.file === l.file) === i);
const wait = ms => new Promise(res => setTimeout(res, ms));
// One at a time and unhurried: the speech model allows only about 10 requests a minute.
for (const l of todo) {
  const began = Date.now();
  for (let attempt = 1; ; attempt++) {
    try { await record(l); made++; inRow = 0; console.log(`recorded ${made}/${todo.length}  ${l.group}  ${l.file}`); break; }
    catch (e) {
      if (/ 429/.test(e.message) && /per day/.test(e.message)) {
        if (model < MODELS.length - 1) { console.log(`${MODELS[model]} is used up for today; carrying on with ${MODELS[++model]}`); attempt = 0; continue; }
        console.error('The daily limit is used up on every model. Stopping; run again tomorrow to continue.'); spent = true; break; }
      if (attempt === 4) { failed++; inRow++; console.error(`FAILED    ${l.text}: ${e.message}`); break; } await wait(/ 429/.test(e.message) ? 61000 : 3000 * attempt); }
  }
  if (spent) break;
  if (inRow >= 3) { console.error('Three lines in a row failed (daily limit?). Stopping; run again later to continue.'); break; }
  if (made % 20 === 0) writeLists();
  await wait(Math.max(0, (Number(env.TTS_PAUSE_MS) || 6300) - (Date.now() - began)));
}
writeLists();
const bytes = fs.readdirSync(OUT).filter(f => f.endsWith('.mp3')).reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
console.log(`${made} recorded, ${lines.filter(have).length} of ${lines.length} lines have a recording${failed ? `, ${failed} FAILED` : ''}. assets/voice is ${(bytes / 1e6).toFixed(1)} MB.`);
process.exit(failed ? 1 : 0);
