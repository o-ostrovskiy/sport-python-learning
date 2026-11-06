# Sport Python Learning

Python notebooks for kids who love sports. Each lab asks a question a sports fan already cares about
and answers it with open data, so kids learn Python and how to look at data on the players they follow.

Made for my 10-year-old, an NFL fan. Everything runs in Google Colab in the browser: nothing to install,
the data downloads itself.

## Football (NFL)

| Lab | The question | Python they learn | Open |
|---|---|---|---|
| **1. Football Lab** | Do the fastest players at the Combine become the best receivers? | variables, loading data with pandas, filtering, sorting, a first function, joining tables, a scatter chart | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/football/Football_Lab_1.ipynb) |
| **2. Stat Detective** | His favorite player's best game, the biggest games in history, and who's better | `print`, quotes, variables, `=` vs `==`, `len`, `.max()`, `.mean()`, square brackets, a first look at lists | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/football/Football_Lab_2.ipynb) |
| **3. Referee Bot** | First down or not? Go for it, kick or punt? Rate a player's best game, and fix a bug in `compare` | `True`/`False`, `>` `<` `>=` `<=` `==`, `if` / `elif` / `else`, colons and indents | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/football/Football_Lab_3.ipynb) |

- Lab 1 is guided: the code is written, the kid runs it, changes names and numbers, and guesses results first. Every new thing has a plain-words explanation, and the harder analyst boxes are marked "watch the pros".
- Labs 2 and 3 start slow and explain every new symbol. They have a couple of `___` blanks to fill in, with a hint and a "Google it" phrase for each one. Each takes under an hour.

## Baseball (MLB)

Same Python, same order as the football labs, with baseball questions. The data runs from 1871 to the current season.

| Lab | The question | Python they learn | Open |
|---|---|---|---|
| **1. Baseball Lab** | Do the biggest home run hitters strike out the most? | variables, a table with pandas, filtering, sorting, a first function (how long a fastball takes to reach the plate), a scatter chart | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/baseball/Baseball_Lab_1.ipynb) |
| **2. Stat Detective** | A favorite player's best season, the biggest seasons in history, and who's better | `print`, quotes, variables, `=` vs `==`, `len`, `.max()`, `.mean()`, square brackets, a first look at lists | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/baseball/Baseball_Lab_2.ipynb) |
| **3. Umpire Bot** | Safe or out? Home run, extra bases or caught? Rate a player's best season, and fix a bug in `compare` | `True`/`False`, `>` `<` `>=` `<=` `==`, `if` / `elif` / `else`, colons and indents | [![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/o-ostrovskiy/sport-python-learning/blob/main/baseball/Baseball_Lab_3.ipynb) |

Each baseball lab starts with one folded box, "Load the MLB data": it joins the history book with this season's live stats,
so the kid clicks ▶ and gets one table. The code is there to read with a double-click.

What comes next, and in what order: [CURRICULUM.md](CURRICULUM.md). More sports coming.

## How to use

1. Click **Open in Colab** next to a lab (you need a Google account; for a kid under 13, use a parent's).
2. **File → Save a copy in Drive**, so the kid's changes are saved.
3. Click the first gray code box and press **Shift + Enter**. Keep going box by box.

One or two missions per sitting is plenty.

## Data

Open NFL data from [nflverse](https://github.com/nflverse/nflverse-data): Combine results since 2000 and player stats
from every regular season game, 1999–2024. The notebooks load it straight from nflverse; nothing is copied here.

Baseball history comes from the [Lahman Baseball Database](https://sabr.org/lahman-database/) (SABR, CC BY-SA 3.0),
1871–2025, through the CSV copy in [pylahman](https://github.com/daviddalpiaz/pylahman). Seasons newer than that come live from
MLB's public Stats API (statsapi.mlb.com, © MLB Advanced Media, for personal, non-commercial use). Nothing is copied here either.

Inspired by the [NFL Big Data Bowl](https://www.kaggle.com/competitions/nfl-big-data-bowl-2027), which asks the grown-up
version of Lab 1's question.

## Contributing

Ideas and new labs are welcome, for the NFL or any other sport.

- **Have an idea?** Open an [issue](https://github.com/o-ostrovskiy/sport-python-learning/issues) with the question a young fan would want answered.
- **Made a lab?** Send a pull request. Put it in a folder for its sport (`football/`, `basketball/`, …) and keep it kid-friendly:
  - one question a sports fan cares about, answered with open data;
  - short missions, each with something to run, change, or guess;
  - data loaded from a public URL, so it runs in Colab with nothing to install;
  - run it top to bottom before sending, and clear the outputs.
- Found a bug or a wrong number? An issue or a fix is great too.

## License

[MIT](LICENSE)
