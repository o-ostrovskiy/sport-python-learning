# Python Season: improvement list (review of 2026-11-16)

A technical review of the site in `site/`, written for whoever picks this up next. The owner will decide the order.
Every item says what is wrong today, what to do, and how to know it worked. Run `cd site/tools && node check-lab.mjs all`
after every change that touches a lesson.

## Where the site stands

For a site built fast, it is in good shape:
- **The simple approach is right.** Plain static files, no framework and no build step. It is cheap to host
  (it runs as static files on the Storyland box), and there is no server to keep alive.
- **Privacy was thought through.** There are no accounts. Python runs on the child's device. The answer keys are never served,
  and the About page tells parents exactly what leaves the browser.
- **It handles failure well.** Slow and broken downloads are watched and retried, the Run button shows loading progress,
  and curly quotes from a tablet are turned back into straight ones.
- **The lessons are tested.** `check-lab.mjs` plays every lab in real Python, hint paths included. That is the strongest
  part of the codebase.

The weak spots, all fixed below:
- A lesson in progress is lost when the child leaves.
- Python runs on the page's main thread, so an endless loop freezes the whole page.
- All the game logic is one 676-line `play.html` written in dense one-liners, which makes it hard to change safely.
- No browser test and no CI.
- Updating the live site is a manual job.
- The map costs a key and a third-party service for little benefit.

---

## Must do

### 1. Save the lesson in progress (the owner's own complaint) — DONE 2026-11-16
**Today:** only finished weeks are saved (`localStorage` key `wins`). Leave a lab half way, come back, and every box
is back to its starting code, the ball is at the start, and the hints and the review are reset.

**Do:**
- Keep one record per lab in `localStorage`, for example `progress:nfl-03`. It holds the code in every box, which boxes
  are done, the hint level per box, `misses`, `doneCount`, the review answers, the predict guesses and the scroll position.
  Save on every Run, and on typing with a short debounce (about 500 ms).
- Put a version on each record: a short hash of the lab's cells. If the lab file changes, a saved record whose boxes no
  longer match is dropped, so it can never put the wrong code into a box.
- When a child opens a lab that has saved progress, the coach asks **"Continue where you stopped"** or **"Start over"**.
  Start over clears the record.
- **Python's memory does not survive a reload.** Later boxes use variables made in earlier ones, such as `combine` and
  `speed_mph`. So on Continue, quietly re-run the code of every finished box, in order and with no output and no coach
  lines, before the child presses Run. Show "Getting your playbook back…" on the Run button while that happens.
  This is the part that is easy to forget. Without it the first Run after a return fails with `NameError`.
- When a week is won, the in-progress record for it can go. The trophy stays in `wins`.
- Show a "Saved" line, or a small ✓ next to the score, so the child trusts it.
- Privacy is unchanged: the progress stays in that browser. Update the About page's Privacy table row
  ("Progress … Saved only in this browser") to name the code as well.

**Done when:** a Playwright test does the following and passes: open Week 1, finish Plays 1–3, type in Play 4, reload,
choose Continue, find Plays 1–3 done and Play 4's text kept, and run Play 8 (it needs `combine` from Play 8's setup and
earlier variables) with no `NameError`.

### 2. New voice recordings never reach git or the live site — DONE 2026-11-16 (option a)
**Decided and done:** the owner chose (a). The 314 clips recorded so far are committed (feb97b4) and live, the task now commits, pushes and uploads after every run, and `DEPLOY.md` says so. Nothing left to do here.

**Today:** the scheduled task "Запись голоса тренера" (`~/.claude/scheduled-tasks/record-coach-voice/SKILL.md`) records
about 100 lines a day into `site/assets/voice/`. It also rewrites the per-lab `site/assets/voice/<lab>.js` index files.
By design it does not commit and does not push. So recordings pile up uncommitted: 7 index files and new mp3s on 11-16.
They are also never uploaded to `~/python-season` on the box, so children hear none of the new lines.

**Do one of:**
- **(a) Recommended.** After each recording run, commit only `site/assets/voice/` with a fixed message, such as
  `Voice: record <n> more coach lines (<total> of <all>)`, and push. Then upload only that folder to the box: open SSH,
  run `rsync -az` with **no `--delete`** on `assets/voice/`, close SSH. The commands are in the
  infrastructure repo's `deploy/README.md`, "Python Season". This changes the task's prompt ("do not commit, do not push")
  and lets an unattended task write to the live site, so **the owner has to approve it in a live chat first**.
- **(b)** Leave the task as it is, and add a `tools/publish-voice.sh` that the owner runs by hand when she wants. It
  commits the voice folder, pushes and uploads.

Either way, add a line to `DEPLOY.md` saying which route was chosen. Also expect the repo to grow: about 9.8 MB of mp3 now,
roughly 25–30 MB when all ~900 lines are recorded. That is fine for git. Git LFS is only worth it if more sports and
voices come.

### 3. Run Python off the main thread, with a Stop button — DONE 2026-11-16 (the simple way: Stop restarts the worker)
**Today:** `py.runPythonAsync(code)` runs on the page's main thread (`runBox` in `play.html`). A child who writes
`while True:` in the loops lab (Week 5) or the guessing game (Week 8) freezes the whole page. There is no way out but
closing the tab, and the lesson is lost with it, until item 1 is done.

**Do:**
- Move Pyodide into a **Web Worker** (`site/py-worker.js`). The page sends the code and gets back stdout, an HTML table,
  a chart PNG, the error, and the values `check()` asks for. `g(name)` and `q(expr)` become async messages, so lab
  `check` functions need `await`. The lab format changes, so update `site/labs/README.md` and `check-lab.mjs` in the same change.
- Add a **⏹ Stop** button that appears after about 3 seconds of running. The coach says something like "That loop never
  ends. Look at your `while` line."
  - The simple way: terminate the worker and start a fresh one, then re-run the finished boxes as in item 1.
  - The clean way: `pyodide.setInterruptBuffer`. It needs `SharedArrayBuffer`, which means the
    `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers from Caddy.
    That in turn means Pyodide and the map must be served from our own site (see items 4 and 6).
- `input()` (Week 8) uses the browser's `prompt()` today. In a worker, use a small in-page question box instead, which is
  also nicer for children.

**Done when:** a test runs `while True: pass` in a box, presses Stop within 5 seconds, then runs the next box successfully.

### 4. Replace the map with a drawn one (the owner's idea, and it is the better choice) — DONE 2026-11-16
**Today:** Leaflet plus Mapbox street and satellite pictures. That means:
- a key in `keys.local.js` that must be kept out of git and copied to the host by hand;
- a third party that sees every child's internet address;
- an open billing question;
- pan and zoom that children get lost in on an iPad;
- tiles that load slowly or not at all on a weak connection.

It also looks like a grown-up map app, not part of a game.

**Do:** an **illustrated map**, one SVG of the USA in the site's cartoon style (thick ink outlines, the same palette as the
coach). On it go the season's stadium pins, numbered, with a dashed route between weeks; won weeks get a trophy, the
next week glows. Tap a pin to get the existing stadium card ("Opened in 1972, about 76,000 seats…") and the Kick off
button. Keep the "flying to the stadium" moment as a short animation of the ball along the route.
- Work out the pin positions once, from the `at: [lat, lon]` already in `season.js`, with an Albers USA projection
  (for example a small Node script using `d3-geo`, run only at build time). Store x and y in `season.js`. The page needs
  no map library at all.
- Remove Leaflet (`assets/vendor/leaflet`), the Mapbox code, `keys.local.js` and its handling, the satellite toggle and the
  map credits. Then update About (Privacy and "Where the numbers come from"), `DEPLOY.md` (the Map pictures checklist
  item goes away) and the README file table.
- The week strip along the top already works as a plain list. Keep it as the keyboard and screen-reader way to pick a week.
- **Show the owner a mockup before writing the code.** It is a visual redesign, and she approves the look first.

**Done when:** the play page makes no request to any map service. A test can win Week 1 and see its pin turn into a
trophy. It fits on an upright iPad with no scrolling and no zoom.

---

## Should do

### 5. A real code editor instead of a plain text box
`<textarea>` has no colours and no line numbers. Pressing Enter after `if …:` does not indent the next line, which is
exactly the thing children get wrong. Use **CodeMirror 6**, self-hosted as an ES module build in `assets/vendor/`, with:
- Python highlighting and auto-indent after a colon;
- bracket and quote matching, and the existing Shift+Enter to run;
- big font, with autocorrect and curly quotes off as today.

Keep Tab as 4 spaces, but let Esc then Tab move focus out of the editor, so keyboard users are not trapped.
Check that it works on an iPad.

### 6. Serve Python from our own site, and cache it for the next visit
- Serve Pyodide and the packages it uses (pandas, matplotlib, about 21 MB) from `site/assets/vendor/pyodide/`
  instead of jsDelivr. One fewer third party for children (update About's Privacy section). It is also needed for the
  headers in item 3.
- Add a small **service worker** that keeps Python, the packages, the data files and the voice files after the first
  visit. Coming back then opens in seconds instead of downloading 14–21 MB again, and a lab already loaded keeps working
  on a shaky connection. Give the cache a version number so that an update replaces it.
- In Caddy, cache versioned vendor files for a long time (`immutable`).

### 7. Split `play.html` into readable modules
676 lines of HTML, CSS and JavaScript in one file, much of it written as chains of one-liners. Split it into plain ES modules
with no build step: `play.css`, `js/voice.js` (the coach's voice and face), `js/map.js` (or the new drawn map),
`js/python.js` (the worker client), `js/game.js` (boxes, checks, review), `js/progress.js` (item 1). Write normal multi-line
functions, and keep the comments that explain why. Move nothing else and change no behaviour in the same step, so the
lesson checker and a browser play-through can prove nothing broke.

Optional later step: **Vite + TypeScript** if the site keeps growing. Types would catch lab format mistakes early.
React, Next.js or another framework is not worth it for this site: it would add a build and a lot of weight for no gain.

### 8. Browser tests and CI
- **Playwright** tests:
  - home page loads;
  - a week opens;
  - Play 1 runs and prints;
  - a wrong answer gets a flag;
  - a hint shows;
  - resume after reload (item 1);
  - Stop on an endless loop (item 3);
  - `/labs/answers/…` gives 404 from `server/local.mjs`.
- **GitHub Actions** on every push: `node --check` on the scripts, `check-lab.mjs all`, the Playwright tests, and a link and
  HTML check. The repository is public, so Actions minutes are free.

### 9. A one-command update of the live site
Add `tools/publish.sh`:
1. Make a clean export of the committed `site/` (`git archive`), leaving out `tools/`, `labs/answers/` and `*.md`.
2. Run the lesson checker.
3. Open SSH, `rsync --delete` to `~/python-season/`, close SSH.
4. Check the live site with curl: home page 200, an answer key 404, `/api/status` 404.

Today this is done by hand from the notes in the infrastructure repo. Never run it while voice files are uncommitted,
because `--delete` would remove recordings that exist only on the box. Item 2 solves this.

---

## Nice to have

10. **Which lessons work.** Send Google Analytics events with no personal content (never the code a child types):
    `lab_start`, `play_done` (lab and play number), `lab_won`, `hint_used`, and where children stop. That shows which play
    is too hard. Add a line about it to About's Privacy section.
11. **Move progress to another device.** No accounts, on purpose. Instead, "Save my season" downloads a small file, or
    shows a short code that "Load my season" reads back.
12. **Security headers.** Add a `Content-Security-Policy` in Caddy: scripts only from our own site plus Google Analytics,
    and no `eval` beyond what Pyodide needs (WebAssembly needs `'wasm-unsafe-eval'`). Raise HSTS from 300 s once the
    site is stable.
13. **Accessibility pass.** Check:
    - every button has a name;
    - the coach bubble is announced politely (`aria-live`);
    - colour contrast is enough;
    - the reduced-motion setting also stops the confetti and the ball flight.
14. **Smaller data.** The CSV files (8.7 MB) are compressed by Caddy already. If the first load still feels slow, cut the
    columns each lab never uses. Do not switch to Parquet: pandas needs pyarrow for it, and pyarrow is heavier still.

## Suggested order
**1 → 3 → 4 (mockup first) → 7 → 5 → 6 → 8 → 9** (2 is done), then the nice-to-haves.
Item 7 can come earlier if items 3 and 4 turn out to be painful inside one big file.
