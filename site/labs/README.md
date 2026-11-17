# Lab files

One lab = one file: `labs/<sport>-<NN>.js` (`nfl-01.js` … `nfl-10.js`, `mlb-01.js` … `mlb-10.js`).
The site finds a lab by its file name: when the file exists, that week on the map becomes playable.
Nothing else needs editing. `nfl-01.js` and `nfl-04.js` are the reference examples: read both first.

The matching Colab notebook lives in `football/Football_Lab_N.ipynb` or `baseball/Baseball_Lab_N.ipynb`.
The site lab must teach the same ideas with the same code, following `CURRICULUM.md` (about 40 minutes,
4 parts, about 15 plays).

## Shape

```js
(() => {                       // keep everything inside this wrapper: files must not share names
  const CELLS = [ ... ];
  const REVIEW = [ ... ];
  registerLab('nfl', 5, {
    title: 'Game Day Loop',
    skills: { loops: 'for loops', totals: 'A running total' },   // 3–4 skills; keys are used by cells and review
    cells: CELLS,
    review: REVIEW,
    data: ['player_stats_season.csv'],   // files in site/data/ this lab reads (optional)
    setup: `def _helper(): ...`          // Python run once after the data loads (optional; names start with _)
  });
})();
```

## Cells

A cell is either text or a play.

- **Text:** `{ md: '<h2>Part 1. Title 📋</h2>Short explanation with <code>code</code> and <b>bold</b>.' }`
- **Play:** `{ skill, kind, task, code, ... }`. `skill` is a key from `skills`. `task` is HTML shown above the box.

| kind | What the child does | Extra fields |
|---|---|---|
| `run` | Runs the code as it is | `ok` (coach's line after it runs), or a `check(ctx)` that returns `{ ok: true, msg }` when the line should mention the child's own result |
| `turn` | Changes or writes code | `check(ctx)`, `hints: [..]` (1–3, from gentle to the answer) |
| `predict` | Types a number guess, then runs | `check({ guess })` returning `{ ok: true, missed, msg }` |
| `boom` | Runs code that errors on purpose | `expectError: 'IndexError'`, `ok` |
| `quiz` | Taps one of 3 options | `code` (optional, shown), `opts`, `a` (index), `tips` (one per option, `''` for the right one), `ok` |
| `quiz` + `vote: true` | Taps any option, no wrong answer | `opts`, `ok`; the choice is in the global `myVote` |

Add `data: true` to every play that needs pandas, the lab's data files, a table output or a chart.
A table (the last line of the box is a DataFrame or Series) and any matplotlib chart are shown automatically.

### `check(ctx)`

`check` is **async**, because Python runs in a Web Worker (`site/py-worker.js`) and every question to it is a message:

```js
check: async ({ g, q, out }) => {
  const n = await g('number');                       // await before every g( ) and q( )
  if (!(await q('isinstance(my_board, list)'))) return { msg: '…' };
  return { ok: true, msg: `Number ${n}!` }; }
```

Write `(await q('…'))` with brackets when you use the result right away (`(await q('…')).length`). A helper that calls
`g` or `q` must be `async` too and be awaited (see `chart` in `mlb-09.js`). `check-lab.mjs` fails a lab whose `check` is not async.

Runs after the child's code ran without an error. Return `{ ok: true, msg }` to finish the play, or `{ msg }` to
send them back with a tip. Make tips specific: say what is wrong and what to try, never just "wrong".

- `ctx.code`: the text in the box. `ctx.out`: everything it printed.
- `await ctx.g('name')`: a Python variable as a JS value. Numbers, strings and True/False come back as they are
  (numpy numbers too); lists and dicts as JS arrays and objects; a missing name as `undefined`; anything else (a table)
  as its text.
- `await ctx.q('python expression')`: evaluate one Python **expression** and get the result, converted the same way.
  Use this for lists, tables and anything not simple, e.g. `q('len(my_board)')`, `q('isinstance(my_board, list)')`.
- `ctx.guess`: the typed guess (`predict` only).
- `esc(text)`: escape anything the child typed before putting it in `msg`.

Check the **result**, not the exact typing, whenever you can. Use a regex on `ctx.code` only to tell which
mistake was made.

### Rules of the engine

- All boxes share one Python session, top to bottom, like a notebook. A later box may use earlier variables,
  but a `turn` box should define what it needs, because the child may re-run boxes.
- A game in progress is saved in the browser. On "Continue" after a reload, every finished box runs again, quietly
  and in order, to rebuild Python's memory; an `input( )` there gets the answer `"1"`. So a finished box must run
  again without asking anything else and without side effects. When a lab's boxes change (code, kind or options),
  saved progress for that lab is dropped.
- A box containing `___` will not run: the child is told to fill in the blanks. At most 2–3 blanks per lab.
- Python errors are translated to plain words for the child (NameError, SyntaxError, IndexError, KeyError,
  TypeError, IndentationError, AttributeError, ZeroDivisionError). Others show the last line of the error.
- `input( )` shows Python's question in a box under the code, and the child answers there. The question and the answer
  are printed in the output, like in a terminal. It works only in the main code, not inside a `def` (the child gets
  a plain-words error). Do not override `input` in `setup`.
- Python runs in a Web Worker, so an endless `while` loop no longer freezes the page: after about 3 seconds a
  ⏹ Stop button appears, Stop starts a fresh Python, and the finished boxes run again. Still keep every loop a child
  can edit bounded (count the tries).
- `setup` names must not clash with the engine's own helpers: `_run`, `_ask`, `_q`, `_g`, `_plain`, `_show`, `_fig`.
- No internet from Python. Data comes from `site/data/` only, read with `pd.read_csv("file.csv")`.
  Keep each data file under about 3 MB: trim columns and rows in a build step.

## Review

Five or six one-try questions, at least one per skill:
`{ skill, q, code (optional), opts: [three], a: index }`.

## Voice and wording

The coach speaks every `ok`, `msg`, `hint` and `tip`. Keep each to one or two short sentences a 9-year-old
can read. No math or analytics words. Real players and real numbers: run every box and check every number.

## Answer key and automatic check (required)

Every lab has an answer key `labs/answers/<sport>-<NN>.json` (kept out of git; it is also the parent's key). CI reads the keys from
the `ANSWER_KEYS` secret: after adding or changing one, set the secret again (the command is in `DEPLOY.md`, "Checks").
Keys are play numbers (text cells do not count):

```json
{
  "2": { "answer": 1 },
  "3": { "solution": "my_board = [\"A\", \"B\", \"C\"]\nprint(my_board)", "wrong": ["my_board = [\"A\" \"B\", \"C\"]\nprint(my_board)"] },
  "9": { "inputs": ["Josh Allen", "quit"] }
}
```

- `turn` plays need `solution` (full code that should pass) and, where useful, `wrong` (codes that must NOT pass).
- `predict` plays need `answer` (the right number).
- Any play whose code calls `input( )` needs `inputs`: what gets typed, in order.

Then run the checker, which plays the whole lab in real Python (the same Pyodide the site uses):

```bash
cd site/tools && node check-lab.mjs nfl-05     # or: node check-lab.mjs all
```

It fails if any box errors, a starting box already passes, a solution is rejected, a wrong answer is accepted,
a planned error does not happen, or a data file is missing. A lab is done only when it prints ✓ with no FAIL lines.
