# Sport Python Learning: curriculum

The plan for every lab after Lab 2. Each lab teaches **one or two new Python ideas**, reuses one old one,
and stays sporty. Read this before building a lab, and update the "Already covered" table after each one.

## Who it's for
A 10-year-old who loves the NFL and is new to Python. He knows players and stats very well,
but no programming words and no math/statistics words.

## How kids learn Python best (what the research and courses agree on)
- **Order:** variables → decisions (`if`) → lists → loops → functions → dictionaries. Courses for ages 10–12
  all start with variables and put decisions before loops; functions usually come late
  (e.g. the University of Michigan class for 10–12-year-olds: variables, if/else, lists, loops, functions,
  files, dictionaries). Our order follows this.
- **Read before writing (PRIMM).** A UK method tested in schools with 11–14-year-olds:
  **P**redict what a program will show → **R**un it → **I**nvestigate how it works →
  **M**odify it → **M**ake something new with the same idea. Every lab section follows these steps.
- **One project per idea.** Every course pairs each new idea with something fun to build. For us: a sports task.

## Rules for every lab (from his first test run, 2026-10-22)
1. **Under 1 hour.** About 4–5 short parts. Lab 1 took 1.5 hours, which was too long.
2. **No analytics or math words** (no "correlation", "hypothesis", "variance"...). If a word is needed, explain it
   in kid language the first time ("average = add up all games and share them out equally").
3. **Explain every new symbol slowly:** what it does and why it's needed. Show what goes wrong without it
   (a planned error is a good teacher, like `print(Touchdown)`).
4. **Never "copy the code from part X".** Give the full code and say exactly which word to change, and to what.
5. **At most 2–3 blanks `___` per lab**, each with a hint ("3 letters, short for length") and a 🔎 Google it phrase.
6. **Guess first.** Before a box runs, ask him to guess the result.
7. **Real players, real numbers.** Check every number by running the notebook. Render every chart and
   look at it: axes labelled in plain words ("left = faster"), and the text must match the picture.
8. End with a short "Today you learned" list and one line teasing the next lab.
9. Answer key for the parent, kept out of the public repo.

## Already covered (don't re-teach, just reuse)

| Lab | New Python ideas | Data skills |
|---|---|---|
| **1. Football Lab** (guided, done 2026-10-22) | variables, numbers, `print` with commas, math (`*`, `+`), a function to use (`speed_mph`) | load a table, find a player, sort, `head`/`tail`, a scatter chart |
| **2. Stat Detective** | `print( )` and brackets, quotes = text, variable vs `"variable"`, `NameError`, numbers vs text (`"100" + "50"`), `=` vs `==`, `len( )` | one player's games, `.max()`, `.mean()`, `round( )`, `sort_values(ascending=False)`, using a ready-made machine `compare( )` |

Seen but **not yet explained** (Lab 3+ should explain them properly): `if` / `else` (inside `compare`),
`def` (inside `compare`), `&` with two conditions (Lab 1).

## The plan

| Lab | Working title | New Python ideas | Sports task (idea) | Reuses |
|---|---|---|---|---|
| **3** | Referee Bot | `if` / `elif` / `else`, comparisons `>` `<` `>=` `==`, `True` / `False`, indentation | "First down or not?" (yards gained vs yards to go) · touchdown / field goal / punt decision · then open up `compare` from Lab 2 and see its `if` / `else` | variables, `print` |
| **4** | Build Your Roster | lists `[ ]`, counting from 0, `len( )`, `.append( )`, `in` | make his dream team as a list · "is Mahomes on my team?" · top 5 passers from the data as a list | `if`, `len` |
| **5** | Game Day Loop | `for` loops, `range( )`, a running total | add up a season game by game · print a scoreboard for each week · count his player's 100-yard games | lists, `if` |
| **6** | Build Your Own Machine | `def`, inputs (parameters), `return` | rebuild `compare` himself · a "fantasy points" calculator for any player and season | loops, `if` |
| **7** | Player Cards | dictionaries `{ }`: key → value | a player card (name, team, number, best season) · team code → team name (`"KC"` → `"Chiefs"`) | functions, loops |
| **8** | Guess the Player | `input( )`, `while` loop, `random` | a quiz game: Python picks a player, gives clues from the data, he guesses | everything so far |
| **9** | Chart Room | bar and line charts with clear labels | his team's yards season by season · two players' careers side by side | dictionaries, loops |
| **10** | My Own Investigation | putting it all together (the "Make" step) | he picks his own question, answers it with data, and shows mom the chart | everything |

After Lab 10: start a second sport with the same order but faster, or harder NFL labs
(two Steve Smiths and `player_id`, grouping by season, the mystery-player filters from the first draft of Lab 2).

## Mistakes kids commonly make (plan a short "what went wrong?" moment for each)
- Forgetting quotes around text (`NameError`) — done in Lab 2.
- `=` (put in a box) vs `==` (ask "same?") — introduced in Lab 2, practise in Lab 3.
- Missing `:` or wrong indentation after `if`, `for`, `def` — Lab 3.
- Lists start counting at 0, not 1 — Lab 4.
- Capital letters matter (`"travis kelce"` finds nothing) — Lab 2.
- Text vs number (`"100" + "50"`) — Lab 2; `input( )` always gives text — Lab 8.

## Lab template (each part)
1. **Predict:** "What do you think this will show?"
2. **Run:** Shift + Enter.
3. **Investigate:** explain each new symbol in one or two plain sentences.
4. **Modify:** "Change only `X` to `Y`."
5. **Make** (once per lab, near the end): a small task of his own, with an example to start from.

## Sources
- [PRIMM, Teach Computing quick read](https://static.teachcomputing.org/pedagogy/QR11-PRIMM.pdf) (Sentance & Waite)
- [Fun Python, a class for ages 10–12 (Univ. of Michigan, Rada Mihalcea)](https://web.eecs.umich.edu/~mihalcea/urls/FunPython.pdf)
- [Python for Kids, Jason Briggs (chapter order)](https://oreilly.com/library/view/python-for-kids/9781457172397)
- [Raspberry Pi Foundation: Introduction to Python path](https://www.i-programmer.info/news/150-training-a-education/15311-kids-learn-to-code-in-python-with-the-raspberry-pi-foundation.html)
