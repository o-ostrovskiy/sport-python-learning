# Opening Python Season to other children

What has to be true before the site is public, where it can live, and how to put it there.
Hosting prices and free allowances below are from memory: check each provider's current page before choosing.

## How the site is built

| Part | Files | Needs a server? |
|---|---|---|
| Pages: home + calendar, About, the game | `site/index.html`, `site/about.html`, `site/play.html`, `site/season.js`, `site/pages.css` | No |
| Lessons | `site/labs/<sport>-<NN>.js` (a week becomes playable when its file exists) | No |
| Data and pictures | `site/data/*.csv`, `site/assets/*.webp` | No |
| Python | Runs in the child's browser (Pyodide, loaded from jsDelivr) | No |
| Coach questions and coach voice | `site/functions/_handler.mjs` (the API), `server/local.mjs` (runs pages + API together) | **Yes** |

The Gemini key lives only on the server (`server/.env` on this computer, a secret setting on the host).
It is never in a page. Without a server the lessons still work; the question box is hidden and
the coach speaks from his recorded lines.

Run it on this computer: `node server/local.mjs`, then open http://localhost:8765.

## What the server does to protect children and the bill

- Only the site's own pages can call it (`ALLOWED_ORIGINS`); other sites and scripts get "403".
- The coach's rules are on the server, so a child cannot edit them in the page.
- Messages that look like a phone number, email, address or link are refused before they reach Gemini.
- Off-topic and unsafe questions come back as a fixed sentence, never as model text.
- Every answer is read by a second, cheaper model (ALLOW or BLOCK) before it is shown; links are stripped; length is capped.
- Limits: 20 questions and 150 spoken lines per visitor per hour, and daily totals for the whole site (2,000 and 8,000).
  All are settings (`server/.env.example`).
- Switches: the question box and live voice are **off unless** `ASK=on` / `VOICE=on` is set. Keep both off on the public site (see the checklist).
- Answer keys, tools, notes and server code are never served.

Known limits of this protection: the visitor limits are kept in memory, so they reset on restart and are only exact
when one copy of the server runs. A language model can still be talked into a wrong or odd answer now and then.

## Where to host it

| Option | Fits when | Coach questions + voice | Notes |
|---|---|---|---|
| **Google Cloud Run** (uses the `Dockerfile`) | You already use Google Cloud (the Gemini key is there) | Yes | Set "maximum instances = 1" so the limits are exact. Sleeps when idle; first visit after a pause takes a few seconds. Key goes in Secret Manager. |
| **Cloudflare Pages** (uses `site/functions/`) | You want the fastest, cheapest delivery of the big data files | Yes | Deploy the `site` folder. Set `GEMINI_API_KEY`, `ALLOWED_ORIGINS` as encrypted variables. The in-memory limits are only a soft brake there: add a Cloudflare rate-limiting rule for `/api/*`. Exclude `labs/answers`, `tools`, `*.md` from the upload. |
| **Render / Fly.io** (uses the `Dockerfile` or `node server/local.mjs`) | You want the simplest "one small server" | Yes | One always-on instance keeps the limits exact. |
| **GitHub Pages or any static host** | You want to launch lessons only, today | No | Upload `site/` without `functions`, `tools`, `labs/answers`. |

Recommendation: Cloud Run with one instance if Google Cloud is already set up; otherwise Cloudflare Pages.

### Steps (same idea on every host)

1. Make a **new Gemini key just for this site** (do not reuse another project's key) and put a monthly spending cap on its Google Cloud project.
2. Create the service from this repository (Dockerfile, or the `site` folder on Cloudflare).
3. Set the secrets: `GEMINI_API_KEY`, and `ALLOWED_ORIGINS=https://your-address` (exactly the public address, no slash at the end).
4. Open the public address and check: a lesson runs, there is no question box under the coach,
   the recorded voice plays, and `https://your-address/labs/answers/nfl-01.json` gives "Not found".
5. Point your own domain at it, then update `ALLOWED_ORIGINS` to that domain.

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
- [ ] **Map pictures.** The map now uses Mapbox for both the street map and the satellite view (2026-11-15; the key is in `site/keys.local.js`,
      which is not in git: GitHub refuses pushes that contain it. Copy that file to the host with the site. Read by `play.html`, free for 200,000 map pictures a month). Still to do before launch:
      add the site's real address to the key's "URL restrictions" at account.mapbox.com (it is limited to `localhost` for now, so the
      map will be blank on the live site until then);
      check in the Mapbox billing page whether a bank card is attached.
- [ ] **A separate Gemini key with a spending cap** (step 1 above).
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
      progress, and after a broken download pressing Run again works. Still open: compress the data files on the host
      (Cloudflare does it by itself; the Node server does not).
- [x] Decide whether the About page should link to the GitHub repository. Decided 2026-11-15: keep the link as it is.
- [ ] **Finish recording the coach's voice.** The coach speaks from files in `site/assets/voice/` (made by `node site/tools/record-voice.mjs`,
      safe to run again and again). About 100 of roughly 900 lines are recorded. The Gemini speech model allows this key only
      **100 requests a day**, so either raise the key's tier in Google AI Studio and record everything in one go, or run the tool once a day
      for about nine days. Lines without a recording stay silent; the bubble still shows them.
- [x] Live speech stays off on the public site (it is off unless `VOICE=on`; see "Children's privacy"). Recorded lines do not need it.

## Adding or changing a lesson

See `site/labs/README.md`. A lesson is one file plus an answer key; `node check-lab.mjs <name>` plays it from start to
finish in real Python and fails if any box, hint path or answer misbehaves.
