# Python Season: where it lives and how to update it

The public site is **https://python.mystoryland.ai**, live since 2026-11-16. This file says how it is built, where it is
hosted, how to update it, and what was settled before launch.

## How the site is built

| Part | Files | On the public site? |
|---|---|---|
| Pages: home + calendar, About, the game | `site/index.html`, `site/about.html`, `site/play.html`, `site/season.js`, `site/pages.css` | Yes, static files |
| Lessons | `site/labs/<sport>-<NN>.js` (a week becomes playable when its file exists) | Yes |
| Data, pictures, recorded voice, fonts, map code | `site/data/*.csv`, `site/assets/` (`voice/`, `vendor/`) | Yes |
| Python | Runs in the child's browser (Pyodide, loaded from jsDelivr) | Yes, nothing on our side |
| Map pictures | Mapbox, with the public key in `site/keys.local.js` (not in git) | Yes |
| Visit counting | `site/analytics.js` (Google Analytics, public address only) | Yes |
| Answer keys and the lesson checker | `site/labs/answers/`, `site/tools/` | **No**, never uploaded |
| Coach questions and live voice | `server/handler.mjs` (the API), `server/local.mjs` (runs pages + API on this computer) | **No**, home use only |

The public site is static: there is no server code, no database and no key on it. The pages ask `/api/status` once;
the host answers "Not found", so the question box stays hidden and the coach speaks from his recorded lines.
The Gemini key lives only in `server/.env` on this computer, and is used by the home server and by `site/tools/record-voice.mjs`.

Run it on this computer: `node server/local.mjs`, then open http://localhost:8765.

## Where it is hosted

On the Storyland Lightsail box (decided 2026-11-15, live 2026-11-16), as a second site in its Caddy web server:

- the files sit in `~/python-season` on the box, mounted read-only into Caddy (repo `o-ostrovskiy/storyland-infrastructure`,
  `deploy/Caddyfile` and `deploy/docker-compose.prod.yml`, PR #142; its `deploy/README.md` has a "Python Season" section);
- Caddy gets the HTTPS certificate itself, compresses the files (gzip/zstd), keeps **no access log**,
  and refuses `/api/*`, `labs/answers`, `tools`, `*.md` and dotfiles even if they were ever uploaded;
- DNS: an A record for `python.mystoryland.ai` pointing at the box.

## Updating the site

A content change (a lesson, a page, new voice files) needs no restart. From a clean copy of `site/` without
`tools/`, `labs/answers/` and `*.md`, with `keys.local.js` next to `play.html`, sync it to the box. The commands are in
the infrastructure repo's `deploy/README.md` ("Python Season"): open SSH for this computer, `rsync --delete` to
`~/python-season/`, close SSH. Then open the site and check that a lesson runs and the answer keys give "Not found".

Run `cd site/tools && node check-lab.mjs all` before every update that touches a lesson.

## The home server (not on the public site)

`node server/local.mjs` serves the pages plus `/api/*`. With `ASK=on` / `VOICE=on` in `server/.env` it offers typed
questions to the coach and live voice, for trying at home with an adult. What it does to protect children and the bill:

- Only the site's own pages can call it (`ALLOWED_ORIGINS`); other sites and scripts get "403".
- The coach's rules are on the server, so a child cannot edit them in the page.
- Messages that look like a phone number, email, address or link are refused before they reach Gemini.
- Off-topic and unsafe questions come back as a fixed sentence, never as model text.
- Every answer is read by a second, cheaper model (ALLOW or BLOCK) before it is shown; links are stripped; length is capped.
- Limits: 20 questions and 150 spoken lines per visitor per hour, and daily totals (2,000 and 8,000). All are settings (`server/.env.example`).
- Answer keys, tools, notes and server code are never served.

Known limits: the visitor limits are kept in memory, so they reset on restart. A language model can still be talked
into a wrong or odd answer now and then. Bringing the question box to the public site needs the steps under "Children's privacy" below.

## Before the public launch: checklist

Must do
- [x] **Children's privacy.** Decided 2026-11-15: the public site runs **without the question box and without live voice**.
      Both are now off unless `ASK=on` / `VOICE=on` is set on the server; the box is hidden when off; recorded voice still plays.
      Why: (1) Google's Gemini API terms forbid using it in a site "directed towards or likely to be accessed by" people under 18
      (https://aistudio.google.com/docs/terms); (2) under COPPA (amended rule, in force since 2026-04-22) free text typed by a
      child under 13 and passed to another company needs a parent's verifiable consent. Fonts and the map code are now served
      from `site/assets/vendor/` so pages no longer call Google Fonts or unpkg. Still outside our site: map pictures and jsDelivr
      (Python engine); both are named in the Privacy section of `about.html`. This is not a lawyer's opinion.
      To bring the question box back later: another AI provider whose terms allow children's products, parental consent, and a lawyer.
- [x] **Visit counting.** Decided by the owner 2026-11-15: Google Analytics (property "Python Season", `G-KVVSBG2CE6`, loaded by
      `site/analytics.js` on the public address only). In the property: Google signals off, ads personalization off in all regions,
      data kept 2 months. FTC's COPPA FAQ (J.5 to J.8) treats site analytics as "support for internal operations" when nothing else
      personal is collected and there is no behavioural advertising; the Privacy section of `about.html` now says this plainly.
      Never link this property to Google Ads. This is not a lawyer's opinion.
- [x] **Privacy contact.** Decided 2026-11-15: the About page sends parents to the project's GitHub page; no email address.
- [ ] **Map pictures.** The map uses Mapbox for both the street map and the satellite view (2026-11-15; the key is in `site/keys.local.js`,
      which is not in git: GitHub refuses pushes that contain it. Copy that file to the host with the site. Read by `play.html`, free for 200,000 map pictures a month).
      The map shows on the live site (checked 2026-11-16), so the key accepts the public address. Still open:
      check in the Mapbox account that the key's "URL restrictions" list only `python.mystoryland.ai` and `localhost`,
      and in the billing page whether a bank card is attached.
- [ ] **A separate Gemini key with a spending cap.** The public site uses no key; the key in `server/.env` is used at home
      (the home server and `record-voice.mjs`). Give it its own Google Cloud project with a monthly spending cap, and never reuse another project's key.
- [x] **Facts check.** Stadium facts and seat numbers in `site/season.js` checked against sources on 2026-11-15; 7 lines corrected. Check Camden Yards seats again after Opening Day 2027.
- [x] **All 20 labs pass** `cd site/tools && node check-lab.mjs all` and a full play-through in a browser (2026-11-15). Run both again after any change.
- [x] **Commit and push** the `site/` and `server/` folders (done 2026-11-15). `server/.env` and `site/labs/answers/` stay out of git.

Should do
- [x] Mascot pictures replaced with sharp ones (2026-11-15): 720 px WebP with a transparent background, made from the Canva originals.
- [x] Baseball coach has his own cheer, flag, hint and trophy poses (2026-11-15), `site/assets/coach-baseball-*.webp`.
- [x] The coach talks and blinks (2026-11-15). Each of the 12 coach pictures has three more next to it: `-talk` (the other mouth), `-blink`, `-talkblink`.
      They were made with the Gemini image model from the same pictures; `face()` in `site/play.html` picks the picture from the loudness of the voice.
      A new pose needs all four pictures, or its mouth and eyes will not move.
- [x] Reactions are brief (2026-11-16): after a cheer, flag or hint the coach goes back to a resting picture, at once when the child presses the bubble's button or types.
      He rests waving on the map (`coach-wave`, `coach-baseball`) and with hands on hips inside a lab (`coach-watch`, `coach-baseball-watch`).
- [x] Try the site in Safari and Firefox and on an iPad. Done in Firefox, in Safari on the Mac and in the iPad simulator;
      iPad fixes are in `site/play.html` (no autocorrect in code boxes, coach strip and question box when the iPad is upright,
      week buttons hidden during a game) and `site/index.html` (side padding on narrow screens).
- [ ] Try on a real iPad (same Wi-Fi as the Mac, open `http://Olgas-Mac-mini.local:8765` in Safari), about 5 minutes:
      the coach's sound, the first table (Week 1, Play 8), a chart (Week 9, Play 1), typing quotes in a code box,
      and two quick taps on a week button. In the simulator two quick taps sometimes zoom the whole page; this is not fixed yet.
- [x] The first lesson with tables downloads about 14 MB of Python tools (21 MB in the labs with charts: 1, 9, 10). Tried on a slow
      connection (2026-11-15): first table ready in about 26 s on slow wifi, 79 s on a weak mobile connection; the Run button shows
      progress, and after a broken download pressing Run again works. The host compresses the files (Caddy gzip/zstd, since 2026-11-16).
- [x] Decide whether the About page should link to the GitHub repository. Decided 2026-11-15: keep the link as it is.
- [ ] **Finish recording the coach's voice.** The coach speaks from files in `site/assets/voice/` (made by `node site/tools/record-voice.mjs`,
      safe to run again and again). About 100 of roughly 900 lines are recorded. The Gemini speech model allows this key only
      **100 requests a day**, so either raise the key's tier in Google AI Studio and record everything in one go, or run the tool once a day
      for about nine days. Lines without a recording stay silent; the bubble still shows them.
- [x] Live speech stays off on the public site (it is off unless `VOICE=on`; see "Children's privacy"). Recorded lines do not need it.

## Adding or changing a lesson

See `site/labs/README.md`. A lesson is one file plus an answer key; `node check-lab.mjs <name>` plays it from start to
finish in real Python and fails if any box, hint path or answer misbehaves.
