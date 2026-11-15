# Coach Andrew: how to make him feel alive

Research date: 2026-11-15. Read-only study; no site code was changed.

## Recommendation

Keep the voice, but stop generating it live. Almost everything the coach says is fixed text, so record those lines once (with the same Gemini voice), save them as small audio files, and play them instantly. That removes the 3-6 second wait, costs well under a dollar, and needs no API key in the browser. Then make him speak less: short lines at key moments (hello, a new mission, a hint, a win) and a quick sound effect for everything else. Finally, make his mouth and body move with the actual sound, which is exactly how the savorlm.com raccoon does it, with two or three extra pictures and no new animation tool. Voice should be off until the child turns it on, and the choice should be remembered.

## Ranked improvements

| # | Improvement | Effort | What it fixes |
|---|---|---|---|
| 1 | **Pre-generate audio for every fixed line** at build time; play the file, preload the next one | Small to medium | The 3-6 s delay (becomes about 0). Also removes the key from the browser for these lines, and lets you listen to each take and redo bad ones |
| 2 | **Speak less, and add instant sounds**: voice only on key moments, lines under about 12 words; a short "blip / chime / giggle" on every other reaction; voice off by default, remembered | Small | "Robotic narrator" feeling, fatigue, noise in classrooms. Sounds give instant feedback even when no voice plays |
| 3 | **Mouth, blink and bounce driven by the real audio** (open/closed mouth picture swapped by loudness, random blink, small squash) | Medium (needs 2-3 extra pictures per talking pose) | "Static picture with a voice-over" feeling. Today the mouth does not move at all (see "How it works today") |
| 4 | **Dynamic lines (chat answers, lines with the child's values): stream, or stay silent** | Small to medium, after the server proxy exists | Remaining delay on the few lines that cannot be pre-recorded |
| 5 | **Full Rive character rig** (Duolingo-style) | Large; needs the character redrawn as layers by an animator | Only worth it later if the mascot becomes the product's main feature. Not recommended now |

Do 1 and 2 first. Together they answer the owner's complaint without redrawing anything.

## How it works today (`site/index.html`)

- `say(html, mood, btn)` (line 262) puts text in the bubble, swaps the PNG by mood (`coach-wave/cheer/flag/hint/trophy/baseball.png`), adds a CSS class for a jump or shake, and, if voice is on, calls `speak()` with the **whole bubble text**.
- `speak()` / `synth()` (lines 231-261) send the text to the Gemini Interactions API as one non-streaming request, wait for the **complete WAV** as base64 JSON, then play it. Nothing plays until the whole clip has been generated and downloaded. That is the 3-6 seconds. The cache (`ttsCache`) is in memory only, so every page load pays again.
- The mouth does not move. The CSS rules `.mouth` and `.lid` (lines 62-66) belong to an earlier SVG coach; with the PNG they match nothing. The `talk` class is timed from text length (line 268), not from the audio, so even if it did something it would start seconds before the voice.
- When voice is switched on, he announces "I will read everything out loud!" (line 272). Reading everything is the opposite of what the products below do.
- If Gemini fails, the code falls back to the computer's `speechSynthesis` voice, so the character can suddenly change voice mid-lesson.
- Rough size of the job: `index.html` has about 23 literal `say(...)` lines (about 1,650 characters), 8 of them with inserted values, plus the coach/hint/win lines inside the lab cells.

## 1. How products do it

**savorlm.com (Savvy the raccoon), verified by reading the site's own page code today.** This is the closest model for Coach Andrew, and it is simple:

- **Art:** 17 still pictures (640 px WebP): `wave`, `wave2`, `listen`, `talk`, `talk2`, `think`, `point`, `wow`, `cheer`, `taste`, `laugh`, `clap`, `dance`, `dance2`, `look`, `talk-blink`, `listen-blink`. All are preloaded in a hidden block so swaps are instant. No Rive, no Lottie, no 3D.
- **Mouth:** two frames, `talk` and `talk2`. The page measures the loudness of the voice it is playing (Web Audio `AnalyserNode`, RMS) about 60 times a second and shows one frame when loud and the other when quiet.
- **Body:** the same loudness number, smoothed (fast up, slow down), drives a small bounce, tilt and squash-and-stretch via CSS `transform`. Blinks are a third frame shown briefly at random intervals. Two-frame loops (`wave`/`wave2` every 260 ms, `dance`/`dance2` every 300 ms) make gestures.
- **Voice:** the page posts `{text, mood, voice}` to its **own server** (`/api/tts`); the key is never in the browser. The server streams back raw audio (16-bit PCM, 24 kHz) and the page starts playing after roughly the first 0.12 s of audio has arrived, scheduling each chunk right after the previous one. Finished clips are cached and replayed instantly.
- **Sound effects:** `blip`, `giggle`, `chime` are generated in the browser from simple tones, so they have zero delay. Poking him plays the giggle and a wobble.
- **Without voice** he simply waits a time based on text length. Voice is optional there too.
- Not verified: which TTS provider sits behind `/api/tts`. The audio format matches what Gemini TTS streaming returns, and a search snippet of the project's GitHub README says the art was made with Gemini image generation and animated with a "frame rig (gestures, lip flap, blinks, two-frame cycles)" reacting to voice loudness. The repository itself returned 404 when I tried to open it, so treat the README wording as second-hand.

**Duolingo (lesson characters).** [Duolingo's own post](https://blog.duolingo.com/world-character-visemes): speech is **generated ahead of time**, run through their speech models to get timing for every sound, and each sound maps to one of "20+" mouth shapes (visemes). The app downloads the audio plus a small timing file and drives a [Rive](https://rive.app) state machine, with mouth states running in parallel with body states; idle behaviour is head nods, blinks, eyebrow moves. Nothing is synthesised while the learner waits. The live "video call with Lily" feature also runs on a Rive state machine ([Rive's write-up](https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life)); how its lip-sync is driven is not stated there.

**Khanmigo (Khan Academy).** No animated character. Text-to-speech is an **opt-in** button (headphones icon) that reads only Khanmigo's own replies; built with the provider LMNT; added because "one of the challenges of generative AI is all the reading", especially for the youngest learners ([launch post](https://blog.khanacademy.org/text-to-speech-is-live-on-khanmigo), [help article](https://support.khanacademy.org/hc/en-us/articles/23772334788365)).

**Code.org.** Has a text-to-speech read-aloud of lesson instructions that a teacher can switch on for a class, or a student can trigger per level ([help article](https://support.code.org/hc/en-us/articles/360058843692)). Again optional, not always-on.

**Khan Academy Kids, Prodigy, ABCmouse.** I could not find primary sources on how their characters are voiced or animated. My understanding is that apps for pre-readers such as Khan Academy Kids and ABCmouse use pre-recorded human voice actors and pre-made animation, but this is not confirmed by anything I found today. Prodigy is a game with mostly text dialogue; not confirmed either.

**The pattern across all of them:** fixed lines are prepared in advance; live generation is used only where the text cannot be known beforehand; and the picture reacts to the audio, never to a timer.

## 2. Voice latency options

Latency and price figures are from one independent test dated 2026-11-12 ([stork.ai](https://www.stork.ai/blog/text-to-speech-api-phone-calls-test-2026); the author discloses a commission from one vendor, Inworld). They were measured from a server in California with streaming; a child's browser going through your proxy will add a little.

| Option | Time until sound | Cost for this site | Voice quality | Key on a server? |
|---|---|---|---|---|
| **(a) Pre-generated files** for fixed lines | About 0 (a local/CDN file; preload it) | One-off. At about $0.0135 per minute of audio for Gemini 3.8 Flash TTS, a few hundred 5-second lines is well under $1 | The same voice he has now; you can pick the best take | No key at runtime. Key is used once on your own computer |
| **(b) Gemini 3.8 Flash TTS, streaming** | about 0.8-1.0 s | about $0.0135/min | Most expressive Gemini option | Yes |
| **(b) Gemini 3.8 Flash-Lite TTS, streaming** | about 0.5-0.7 s | about $0.009/min | Slightly less expressive, same voices | Yes |
| **(b) Google Cloud Chirp 3 HD, streaming** | about 0.2 s to first data, about 0.5 s to audible | about $0.023/min; 1M characters free per month | Natural, less "directable" | Yes; streaming is over gRPC, which a browser cannot call directly |
| **(b) ElevenLabs Flash v2.5** | about 0.22 s | about $0.036/min; free tier does not allow commercial use | Very natural, large voice library | Yes |
| **(b) OpenAI gpt-4o-mini-tts** | about 0.6-0.8 s | about $0.015/min | Good, steerable; dropped words in that test | Yes |
| **(b) Gemini Live API** | Designed for two-way voice conversation; forum reports of multi-second delays exist | Higher, per session | It improvises its own wording, a poor fit for reading a fixed script | Short-lived "ephemeral tokens" exist for browsers, but a server must still issue them ([docs](https://ai.google.dev/gemini-api/docs/ephemeral-tokens)) |
| **(c) Browser `speechSynthesis`** | Instant | Free | Varies by computer; often robotic; differs between school Chromebooks, iPads, Macs | No key |
| **(c) In-browser model (Kokoro via kokoro-js)** | Several seconds to load the first time, then roughly real-time on a recent laptop, slower than real-time on weak ones | Free | Decent adult voices | No key, but an 80-300 MB download (sources disagree on size) |

Notes:

- **Why it is slow today.** The page uses a non-streaming request and waits for the whole clip. Gemini's docs say streaming is enabled with `stream: true` and arrives as raw 24 kHz PCM chunks ([speech generation docs](https://aistudio.google.com/docs/speech-generation)). One developer reported the Interactions API being slower than the older stream method for the 3.1 preview model and saw long waits followed by a burst ([forum thread](https://discuss.ai.google.dev/t/3-1-flash-tts-preview-streaming-latency/176050)); that report is anecdotal and about an older model.
- **Price change.** Several third-party pages say Gemini 3.8 TTS audio prices ($9 and $6 per million audio tokens) double on 2027-01-01. I could not open Google's own pricing page to confirm. At this site's volume it does not matter.
- **Pre-generation mechanics.** A small script reads every fixed line, calls the TTS once, and saves `audio/<hash-of-text>.mp3` plus a list. `say()` looks the text up; if a file exists it plays immediately, and the next likely line is preloaded. Changing a line's text just means re-running the script for that line.
- **On-device models** are not a fit: big download, slow on school hardware.
- **Recommendation on the fallback:** if a recorded file is missing, show the bubble silently instead of switching to the computer's voice. A second, different voice breaks the character more than silence does.

## 3. Voice character

- **Pick one voice and never change it.** The config already lists candidates; Google describes them as Achird "friendly", Puck "upbeat", Sulafat "warm", Fenrir "excitable", Leda "youthful". Record the same five lines (a hello, an explanation, a hint, a "not quite", a win) in three voices and let the child choose. Pre-generating also fixes consistency: a generative voice can sound a little different on each request, and a recorded file cannot.
- **Direct it per kind of line, not once for everything.** Gemini takes delivery instructions in `speech_metadata.style` and short inline cues such as `<short pause>` or `<laugh>`; capitals add emphasis; the text itself should stay a plain transcript (same docs page). Use three or four styles: calm and slow for explanations, quiet and encouraging for hints and mistakes, big for wins. Savvy does the same with a `mood` field ("warm", "excited").
- **Short lines.** One idea, under about 12 words, about 3-4 seconds. Long bubbles should be read, not spoken. Write for the ear: contractions, the child's name or team where possible, no code read aloud ("print open parenthesis quote" is painful to hear).
- **Sound effects carry most of the "alive" feeling.** A chime on a correct answer, a soft boop on a wrong one, a whistle on a new mission, a giggle when poked. They are instant and never get tiring the way a repeated sentence does.
- **When not to speak:** while the child is typing or reading code; on the same hint shown a second time; on error messages; on anything longer than two sentences; on repeated praise (rotate a handful of recorded variants or use only the sound). Any click or new action should cut the current line off at once (the code already does this with `hush()`).

## 4. Making the picture feel alive cheaply

In order of value for effort:

1. **Tie motion to the real audio.** Start and stop the "talking" state on the audio's own play and end events, not on a text-length timer.
2. **Loudness-driven mouth flap.** Two pictures of the same pose, mouth open and mouth closed, stacked on top of each other; show "open" when the sound is loud. This is what Savvy does and it reads as speech surprisingly well for a cartoon. It works with pre-recorded files and with streamed audio alike.
3. **Blink.** One extra picture with eyes closed, shown for about 120 ms every 3-6 seconds at random.
4. **Squash and bounce from loudness.** A few pixels of lift and 2-6% stretch on the existing image via CSS `transform`. No new art needed.
5. **Two-frame gestures.** A second wave or cheer frame alternated every 260-300 ms.
6. **A "thinking" pose** shown the instant a chat question is sent, so waiting looks like thinking instead of a freeze.

**Getting the extra pictures consistently.** The coach is a 3D render, so the reliable route is to edit the existing image rather than generate a new one: ask an image-editing model to change only the mouth (or only the eyelids) on the existing PNG, keep the same canvas size, and check that the frames line up exactly when flipped back and forth. If the outline shifts even slightly the flap will jitter; crop the change to the face area and paste it onto the original if needed. I did not test this on Coach Andrew's files.

**True visemes** (a dozen or more mouth shapes timed to each sound, as at Duolingo) need timing data that Gemini TTS does not return according to the docs page I read, plus a rigged character. **Rive** is the standard tool for that; its docs say every plan can export for the web, the free plan showing a Rive splash screen, with paid plans from about $9 a month (third-party pricing pages, not checked on rive.app). It would mean rebuilding the coach as vector layers. **Lottie** plays fixed animations and is not suited to reacting to live audio. **Live2D** and real-time 3D are heavier still. None of these is needed to get from "static" to "alive".

## 5. Should there be voice at all?

What the evidence says, with its limits:

- **A human-sounding voice helps; a machine-sounding one does not.** Mayer's "voice principle" found better learning from a human voice than a machine voice (3 of 3 experiments, median effect d = 0.78), described as preliminary and done with older, clearly robotic TTS ([summary](https://u.osu.edu/multimedialearning/multimedia-learning-principles/11-the-voice-principle)). Modern voices are much closer to human; whether they fully close the gap for children is not something I found measured.
- **Reading the same text aloud that is on screen can hurt** (the "redundancy principle"), except when the text is short or the learner controls the pace ([Cambridge chapter](https://www.cambridge.org/core/books/multimedia-learning/redundancy-principle/FFE9A3E5F3BE03B59410577705B9C7BC)). Coach lines are short and click-paced, which is the favourable case, but "read everything out loud" is the unfavourable one.
- **Studies of voice versus text with school-age children are mixed.** Some find speech helps, some find no difference; I found none specific to children learning to code.
- **Conversational, friendly wording helps beginners** (the "personalization principle"), independent of whether it is spoken.
- **Practice in real products:** Khanmigo and Code.org both ship voice as an option, mainly to reduce reading load for weaker readers. Neither makes it always-on.

Practical points for ages 8-12 and coding:

- These children can read, and they must read code anyway. Voice is for warmth and for struggling readers, not for delivering the lesson.
- Schools: many devices are muted or shared without headphones. The site must work fully in silence. It already does, since every line is in the bubble.
- Browsers block sound until the child clicks something, so the first greeting cannot auto-play anyway.
- Accessibility: the bubble text is the caption. Keep the voice toggle visible and remember the setting.

**Sensible default:** voice **off** on first visit, with an obvious "Hear Coach Andrew" button on the coach himself; once on, remembered. When on, he speaks only key moments, with sound effects for the rest. Sound effects could have their own switch and can reasonably default to on.

**Verdict:** do not drop the voice. The complaint is about delay and stiffness, and both come from generating speech live and from a picture that ignores the sound. A warm recorded voice at the right moments is a real asset for this age group; a slow one reading everything is worse than silence.

## What I could not verify

- savorlm.com's TTS provider and its GitHub README (repository returned 404; behaviour above was read from the live site's code).
- How Khan Academy Kids, Prodigy and ABCmouse voice and animate their characters.
- Google's official pricing page and any official latency figure for Gemini TTS; numbers are from one third-party test and third-party pricing pages.
- Whether `gemini-3.8-flash-tts` streaming through the Interactions API starts in under a second for this project's key; this needs a ten-minute test once the proxy exists.
- Rive pricing details (third-party pages only) and ElevenLabs' exact plan prices and its terms for services aimed at children.
- Any study of voice narration specifically for 8-12 year olds learning programming; I found none.
- I did not try generating open/closed-mouth frames for Coach Andrew.
