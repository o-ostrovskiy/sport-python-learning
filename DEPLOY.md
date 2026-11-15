# Opening Python Season to other children

What has to be true before the site is public, where it can live, and how to put it there.
Hosting prices and free allowances below are from memory: check each provider's current page before choosing.

## How the site is built

| Part | Files | Needs a server? |
|---|---|---|
| Pages: home + calendar, About, the game | `site/index.html`, `site/about.html`, `site/play.html`, `site/season.js`, `site/pages.css` | No |
| Lessons | `site/labs/<sport>-<NN>.js` (a week becomes playable when its file exists) | No |
| Data and pictures | `site/data/*.csv`, `site/assets/*.png` | No |
| Python | Runs in the child's browser (Pyodide, loaded from jsDelivr) | No |
| Coach questions and coach voice | `site/functions/_handler.mjs` (the API), `server/local.mjs` (runs pages + API together) | **Yes** |

The Gemini key lives only on the server (`server/.env` on this computer, a secret setting on the host).
It is never in a page. Without a server the lessons still work; the question box says it is not connected and
the voice falls back to the browser's own.

Run it on this computer: `node server/local.mjs`, then open http://localhost:8765.

## What the server does to protect children and the bill

- Only the site's own pages can call it (`ALLOWED_ORIGINS`); other sites and scripts get "403".
- The coach's rules are on the server, so a child cannot edit them in the page.
- Messages that look like a phone number, email, address or link are refused before they reach Gemini.
- Off-topic and unsafe questions come back as a fixed sentence, never as model text.
- Every answer is read by a second, cheaper model (ALLOW or BLOCK) before it is shown; links are stripped; length is capped.
- Limits: 20 questions and 150 spoken lines per visitor per hour, and daily totals for the whole site (2,000 and 8,000).
  All are settings (`server/.env.example`).
- Switches: `ASK=off` and `VOICE=off` turn either feature off without touching the pages.
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
4. Open the public address and check: a lesson runs, the question box answers a Python question and refuses another topic,
   the voice plays, and `https://your-address/labs/answers/nfl-01.json` gives "Not found".
5. Point your own domain at it, then update `ALLOWED_ORIGINS` to that domain.

## Before the public launch: checklist

Must do
- [ ] **Children's privacy.** In the US, a site for children under 13 falls under COPPA; typed questions to an AI are the sensitive part.
      Get a qualified opinion, or launch with `ASK=off` (lessons, hints and checks all still work) and add the question box later.
- [ ] **Map pictures.** The map uses OpenStreetMap's and Esri's public picture servers, which are meant for light use and testing.
      For a public site, sign up with a map provider (MapTiler, Stadia, Esri with a key, or Google Maps) and put its address in `play.html`
      (search for `tile.openstreetmap.org` and `World_Imagery`).
- [ ] **A separate Gemini key with a spending cap** (step 1 above).
- [ ] **Facts check.** Stadium facts and seat numbers in `site/season.js` were written from memory. Check each once.
- [x] **All 20 labs pass** `cd site/tools && node check-lab.mjs all` and a full play-through in a browser (2026-11-15). Run both again after any change.
- [x] **Commit and push** the `site/` and `server/` folders (done 2026-11-15). `server/.env` and `site/labs/answers/` stay out of git.

Should do
- [ ] Mascot pictures are small (200 px). Download the originals from Canva into `site/assets/` for sharp screens.
- [ ] Try the site in Safari and Firefox and on an iPad; so far it was tested only in a Chromium browser on a laptop.
- [ ] The first lesson with tables downloads about 15 MB of Python tools; try it on a slow connection.
- [ ] Decide whether the About page should link to the GitHub repository (it does now).
- [ ] **Finish recording the coach's voice.** The coach speaks from files in `site/assets/voice/` (made by `node site/tools/record-voice.mjs`,
      safe to run again and again). About 100 of roughly 900 lines are recorded. The Gemini speech model allows this key only
      **100 requests a day**, so either raise the key's tier in Google AI Studio and record everything in one go, or run the tool once a day
      for about nine days. Lines without a recording stay silent; the bubble still shows them.
- [ ] Keep `VOICE=off` on the server (live speech). With a 100-a-day limit it cannot serve visitors; recorded lines do not need it.

## Adding or changing a lesson

See `site/labs/README.md`. A lesson is one file plus an answer key; `node check-lab.mjs <name>` plays it from start to
finish in real Python and fails if any box, hint path or answer misbehaves.
