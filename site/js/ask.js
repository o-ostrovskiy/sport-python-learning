// Ask the coach: Python questions only. The box shows only when the site's own server offers it
// (it is off on the public site). The rules for the coach's answers live on the server (server/handler.mjs),
// where a child cannot change them.
import { $, S, esc } from './state.js';
import { say, API } from './voice.js';

const ASK_OFF = 'Good question for another day! In the film room I can only talk about <b>Python and this lab</b>. Ask me about your code, an error, or what a word like <code>append</code> means.';
const ASK_ADULT = 'That sounds important. Please talk to your mom, dad or another grown-up you trust right now. I am only a coding coach, but they can help.';
const ASK_PRIVATE = 'Careful! Never type private things like your address, phone, email or passwords here. Ask me a Python question instead.';
const ASK_LIMIT = 'We have talked a lot! Try the next play, and use 💡 Hint if you get stuck.';
const PRIVATE = [/[\w.+-]+@[\w-]+\.[\w.]+/, /(\d[\s().-]?){7,}/, /https?:\/\/|www\./i, /\b(my (address|password|phone|school) is|i live (at|in|on))\b/i];

let askLog = [], askCount = 0, askBusy = false, askLast = 0;
export function resetAsk() {   // a new lab starts a new conversation
  askLog = [];
  askCount = 0;
}

// What the coach needs to know about the play the child is on.
function labContext() {
  const cells = S.cells;
  const c = cells?.find(x => !x.done) || cells?.[cells.length - 1];
  if (!c) return {};
  const strip = h => { const d = document.createElement('div'); d.innerHTML = h; return d.textContent; };
  return {
    sport: S.sport, week: S.week + 1, topic: SEASON[S.sport].weeks[S.week].topic, skills: Object.values(S.SKILL_NAMES).join(', '),
    play: cells.indexOf(c) + 1, plays: cells.length, task: strip(c.task),
    code: (c.ed?.value ?? c.code ?? '').slice(0, 1200),
    output: (c.el.querySelector('.out')?.textContent ?? '').slice(0, 300),
  };
}
async function askCoach(question) {
  const r = await fetch('/api/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, lab: labContext(), history: askLog.slice(-3) }) });
  if (r.status === 429) return { kind: 'limit' };
  if (!r.ok) throw new Error('ask ' + r.status);
  return r.json();
}

$('#ask').onsubmit = async e => {
  e.preventDefault();
  const inp = $('#askIn'), note = $('#askMsg'), question = inp.value.trim().slice(0, 200);
  note.textContent = '';
  if (!question) { note.textContent = 'Type your question first.'; return; }
  if (askBusy) return;
  if (!API.ask) return say('My question line is not connected yet. Press 💡 Hint on your play if you are stuck.');
  if (PRIVATE.some(p => p.test(question))) return say(ASK_PRIVATE, 'flag');
  if (++askCount > 25) return say(ASK_LIMIT);
  if (Date.now() - askLast < 3000) { note.textContent = 'One question at a time. Wait a moment.'; return; }
  askBusy = true;
  askLast = Date.now();
  inp.value = '';
  inp.blur();   // closes the iPad keyboard, which would cover the answer
  say('Hmm, good question. Let me think…');
  try {
    const res = await askCoach(question);
    if (res.kind === 'answer') {
      const a = String(res.text).slice(0, 600);
      askLog.push({ q: question, a });
      const html = esc(a).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\s*\n+\s*/g, '<br>');
      return say(html, 'hint');
    }
    say({ adult: ASK_ADULT, private: ASK_PRIVATE, limit: ASK_LIMIT }[res.kind] || ASK_OFF, res.kind === 'private' ? 'flag' : '');
  } catch (err) {
    console.warn(err);
    say('I could not hear that. Check the internet and ask again, or press 💡 Hint on your play.', 'flag');
  } finally {
    askBusy = false;
  }
};
