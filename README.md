# Sport Python Learning

Python notebooks for kids who love sports. Each lab asks a question a sports fan already cares about
and answers it with open data, so kids learn Python and how to look at data on the players they follow.

Made for my 10-year-old, an NFL fan. There are **10 labs for football and 10 for baseball**, in two forms:

- **Colab notebooks** (below): everything runs in Google Colab in the browser, nothing to install, the data downloads itself.
- **A website, Python Season**: play it at **https://python.mystoryland.ai** (code in [`site/`](site/)). The same labs as game days in real stadiums. Python runs inside the page,
  and a coach checks every answer and gives hints. See [The website](#the-website-python-season).

## Football (NFL)

| Lab | The question | Python they learn | Open |
|---|---|---|---|
| **1. Football Lab** | Do the fastest players at the Combine become the best receivers? | variables, loading data with pandas, filtering, sorting, a first function, joining tables, a scatter chart | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/football/Football_Lab_1.ipynb) |
| **2. Stat Detective** | His favorite player's best game, the biggest games in history, and who's better | `print`, quotes, variables, `=` vs `==`, `len`, `.max()`, `.mean()`, square brackets, a first look at lists | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/football/Football_Lab_2.ipynb) |
| **3. Referee Bot** | First down or not? Go for it, kick or punt? Rate a player's best game, and fix a bug in `compare` | `True`/`False`, `>` `<` `>=` `<=` `==`, `if` / `elif` / `else`, colons and indents | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/football/Football_Lab_3.ipynb) |
| **4. My Draft Board** | Build your own draft board, add players on draft day, and start it from last season's real top 5 receivers | lists, counting from 0, `.append( )`, `in`, `list( )` | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/football/Football_Lab_4.ipynb) |
| **5. Game Day Loop** | Add up a season game by game, and count a player's big games | `for` loops, `range( )`, a running total, `if` inside a loop | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/football/Football_Lab_5.ipynb) |
| **6. Build Your Own Machine** | A fantasy points calculator for any player, and `compare` rebuilt by hand | `def`, inputs (parameters), `return`, functions calling functions | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/football/Football_Lab_6.ipynb) |
| **7. Player Cards** | A card for any player, team codes turned into team names, a whole deck from real stats | dictionaries `{ }`: look up, add, change, loop over | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/football/Football_Lab_7.ipynb) |
| **8. Guess the Player** | A quiz game: Python picks a mystery player and gives clues from the data | `input( )`, `int( )`, `while` with a counted number of tries, `random.choice` | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/football/Football_Lab_8.ipynb) |
| **9. Chart Room** | One player season by season, and two careers side by side | bar and line charts, titles and axis labels, a legend | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/football/Football_Lab_9.ipynb) |
| **10. My Own Investigation** | The kid's own question, answered with numbers, a chart and a sentence | everything so far, put together | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/football/Football_Lab_10.ipynb) |

- Lab 1 is guided: the code is written, the kid runs it, changes names and numbers, and guesses results first. Every new thing has a plain-words explanation, and the harder analyst boxes are marked "watch the pros".
- Labs 2–9 start slow and explain every new symbol. They have a couple of `___` blanks to fill in, with a hint and a "Google it" phrase for each one. Labs 2 and 3 take under an hour; from Lab 4 on, about 40 minutes, easy to split over two days.
- Lab 10 has no new Python: a worked example, then the kid's own question.

## Baseball (MLB)

Same Python, same order as the football labs, with baseball questions. The data runs from 1871 to the current season.

| Lab | The question | Python they learn | Open |
|---|---|---|---|
| **1. Baseball Lab** | Do the biggest home run hitters strike out the most? | variables, a table with pandas, filtering, sorting, a first function (how long a fastball takes to reach the plate), a scatter chart | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/baseball/Baseball_Lab_1.ipynb) |
| **2. Stat Detective** | A favorite player's best season, the biggest seasons in history, and who's better | `print`, quotes, variables, `=` vs `==`, `len`, `.max()`, `.mean()`, square brackets, a first look at lists | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/baseball/Baseball_Lab_2.ipynb) |
| **3. Umpire Bot** | Safe or out? Home run, extra bases or caught? Rate a player's best season, and fix a bug in `compare` | `True`/`False`, `>` `<` `>=` `<=` `==`, `if` / `elif` / `else`, colons and indents | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/baseball/Baseball_Lab_3.ipynb) |
| **4. My Lineup Card** | A 9-batter lineup (who bats cleanup?), a trade machine, and a team built from this season's top 5 home run hitters | lists, counting from 0, `.append( )`, `in`, `list( )` | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/baseball/Baseball_Lab_4.ipynb) |
| **5. Game Day Loop** | Add up a career season by season, count the 30-homer seasons, a box score inning by inning | `for` loops, `range( )`, a running total, `if` inside a loop | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/baseball/Baseball_Lab_5.ipynb) |
| **6. Build Your Own Machine** | A batting average machine, and `compare` rebuilt by hand | `def`, inputs (parameters), `return`, functions calling functions | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/baseball/Baseball_Lab_6.ipynb) |
| **7. Player Cards** | A card for any player, the scorekeeper's position numbers (6 = shortstop), cards from real stats | dictionaries `{ }`: look up, add, change, loop over | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/baseball/Baseball_Lab_7.ipynb) |
| **8. Guess the Player** | A quiz game: Python picks a mystery player and gives clues from the data | `input( )`, `int( )`, `while` with a counted number of tries, `random.choice` | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/baseball/Baseball_Lab_8.ipynb) |
| **9. Chart Room** | Home runs season by season, and two careers side by side | bar and line charts, titles and axis labels, a legend | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/baseball/Baseball_Lab_9.ipynb) |
| **10. My Own Investigation** | The kid's own question, answered with numbers, a chart and a sentence | everything so far, put together | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/baseball/Baseball_Lab_10.ipynb) |

Each baseball lab starts with one folded box, "Load the MLB data": it joins the history book with this season's live stats,
so the kid clicks ▶ and gets one table. The code is there to read with a double-click.

The teaching plan and the rules every lab follows: [CURRICULUM.md](CURRICULUM.md). More sports coming.

## The website: Python Season

The folder [`site/`](site/) holds the same 20 labs as an interactive website for kids.

- **A season of game days.** Each lab is a week in a real stadium on a map; a home page shows the season calendar.
- **Real Python in the page.** Code runs in the browser with [Pyodide](https://pyodide.org); there is nothing to install and no account.
- **A coach who checks every box.** He says what went wrong in plain words, gives hints step by step, and ends each lab with a short review.
- **Stop any time.** A game in progress is saved in the browser; coming back, the coach offers to continue where the child stopped or start over.
- **Nothing is asked of a child.** No accounts, no ads, nowhere to type a message; the code a child types never leaves the browser.
  Visits are counted with Google Analytics, with its advertising features off (the About page's Privacy section says exactly what it sees).
- **Static files, no server.** The public site is the `site/` folder as plain files, served from a small cloud server; nothing runs there but the file server.
- **For home experiments only, off by default:** typed questions to the coach, answered by Google's Gemini through a small local server (`server/`).
  It is not part of the public children's site (see `DEPLOY.md`, "Children's privacy").

Try it on your computer (needs [Node.js](https://nodejs.org) 20 or newer):

```bash
node server/local.mjs
```

Then open http://localhost:8765. The lessons work straight away. To try coach questions at home with an adult,
copy `server/.env.example` to `server/.env`, add your own Gemini key and set `ASK=on`.

| Where | What |
|---|---|
| `site/index.html`, `about.html`, `play.html` | home page with the calendar, About, the game |
| `site/play.css`, `site/js/` | the game page's style and its plain ES modules (no build step): `main.js` lists what each one does |
| `site/py-worker.js` | Python (Pyodide) in a Web Worker for the game page, so an endless loop can be stopped with ⏹ Stop |
| `site/labs/` | one file per lab; [`site/labs/README.md`](site/labs/README.md) explains the format |
| `site/data/` | trimmed copies of the open data, small enough for a browser |
| `site/season.js` | the two seasons: weeks, stadiums, map positions (`at` and the drawn map's `xy`), stadium facts |
| `site/assets/` | coach pictures, recorded coach voice (`voice/`), fonts (`vendor/`), the drawn map of the 48 states (`usa-map.js`) |
| `site/analytics.js` | Google Analytics visit counting, on the public address only |
| `site/tools/build-map.mjs` | draws the map once (US Census outlines, Albers projection) and writes each stadium's `xy` into `season.js` |
| `site/tools/check-lab.mjs` | plays a lab from start to finish in real Python and fails if any box, hint path or answer misbehaves |
| `site/tools/test-resume.mjs` | browser test (Playwright): half-play Week 1, reload, Continue, and the boxes and Python's memory are back |
| `site/tools/test-stop.mjs` | browser test: ⏹ Stop ends `while True: pass` and the next boxes run; `input( )` asks in the page |
| `site/tools/test-map.mjs` | browser test on an upright iPad: no map service, the map fits, winning Week 1 puts a trophy on its stadium |
| `site/tools/playthrough.mjs` | plays every lab through the real page in Chromium with the answer keys, film review included |
| `server/` | for home use only: `local.mjs` runs the site on this computer, `handler.mjs` is the coach-question API that keeps the Gemini key private |
| [`DEPLOY.md`](DEPLOY.md) | where the public site lives, how to update it, and the launch checklist |

## How to use the notebooks

1. Click **Open in Colab** next to a lab (you need a Google account; for a kid under 13, use a parent's).
2. **File → Save a copy in Drive**, so the kid's changes are saved.
3. Click the first gray code box and press **Shift + Enter**. Keep going box by box.

One or two missions per sitting is plenty.

## Data

Open NFL data from [nflverse](https://github.com/nflverse/nflverse-data): Combine results since 2000 and player stats
from every regular season game, 1999–2024. The notebooks load it straight from nflverse.

Baseball history comes from the [Lahman Baseball Database](https://sabr.org/lahman-database/) (SABR, CC BY-SA 3.0),
1871–2025, through the CSV copy in [pylahman](https://github.com/daviddalpiaz/pylahman). Seasons newer than that come live from
MLB's public Stats API (statsapi.mlb.com, © MLB Advanced Media, for personal, non-commercial use). The notebooks load both live.

The website cannot download large files, so `site/data/` holds trimmed copies of the same sources: fewer columns, and for baseball
only the 4,360 batters with long careers, current players and every season's leaders. The baseball file is built from the
Lahman database and keeps its CC BY-SA 3.0 terms; the newest seasons in it come from MLB's Stats API under MLB's terms above.

This project is not connected to, sponsored by or endorsed by the NFL, MLB or any team.

Inspired by the [NFL Big Data Bowl](https://www.kaggle.com/competitions/nfl-big-data-bowl-2027), which asks the grown-up
version of Lab 1's question.

## Contributing

Ideas and new labs are welcome, for the NFL or any other sport.

- **Have an idea?** Open an [issue](https://github.com/o-ostrovskiy/sport-python-learning/issues) with the question a young fan would want answered.
- **Made a lab?** Send a pull request. Put it in a folder for its sport (`football/`, `basketball/`, …) and keep it kid-friendly
  (for a site lab, see [`site/labs/README.md`](site/labs/README.md)):
  - one question a sports fan cares about, answered with open data;
  - short missions, each with something to run, change, or guess;
  - data loaded from a public URL, so it runs in Colab with nothing to install;
  - run it top to bottom before sending, and clear the outputs.
- Found a bug or a wrong number? An issue or a fix is great too.

## License

[MIT](LICENSE)
