# Sport Python Learning: curriculum

The plan for every lab after Lab 2. Each lab teaches **one or two new Python ideas**, reuses one old one,
and stays sporty. Read this before building a lab, and update the "Already covered" table after each one.

## Who it's for
A 10-year-old who loves the NFL and is new to Python. He knows players and stats very well,
but no programming words and no math/statistics words. The same plan now has a baseball track (see the end).

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
10. **Explain whatever shows up, even if it's taught later** (his feedback on Lab 2, 2026-11-05). If a box contains something from
    a future lab (a list, `True`), say in plain words what it's doing there and why it's needed, and name the lab that covers it.
    Long lines get taken apart step by step, with a small box for each step.

## Already covered (don't re-teach, just reuse)

| Lab | New Python ideas | Data skills |
|---|---|---|
| **1. Football Lab** (guided; he did it 2026-10-22; plain-words explanations added 2026-10-24 and 2026-11-05, same code) | variables, numbers, `print` with commas, math (`*`, `+`), a function to use (`speed_mph`) | load a table, find a player, sort, `head`/`tail`, a scatter chart |
| **2. Stat Detective** | `print( )` and brackets, quotes = text, variable vs `"variable"`, `NameError`, numbers vs text (`"100" + "50"`), `=` vs `==`, `True`/`False` as answers (first look), `len( )`, `import ... as`, square brackets to pick columns (`[ ]` one, `[[ ]]` = a list inside brackets, first look), `KeyError`, `SyntaxError`, `=` as a setting (`ascending=False`), the dot | reading a row filter from the inside out, one player's games, `.max()`, `.mean()`, `.sum()`, `round( )`, `sort_values(ascending=False)`, using a ready-made machine `compare( )` |
| **3. Referee Bot** | `True` / `False`, `>` `<` `>=` `<=` `==`, `if` / `elif` / `else`, colon + indent (`SyntaxError: expected ':'`, `IndentationError`), rules checked top to bottom, reading `def` line by line, reading the `total1` line from the inside out, finding and fixing a bug (tie in `compare`) | rate a player's best game with `if` |

Seen but **not yet explained**: writing a `def` from scratch, `return` (Lab 6),
`&` with two conditions (Lab 1).

## The plan

| Lab | Working title | New Python ideas | Sports task (idea) | Reuses |
|---|---|---|---|---|
| **3** ✅ | Referee Bot | `if` / `elif` / `else`, comparisons `>` `<` `>=` `==`, `True` / `False`, indentation | "First down or not?" (yards gained vs yards to go) · touchdown / field goal / punt decision · then open up `compare` from Lab 2 and see its `if` / `else` | variables, `print` |
| **4** | Build Your Roster | lists `[ ]`, counting from 0, `len( )`, `.append( )`, `in` | make his dream team as a list · "is Mahomes on my team?" · top 5 passers from the data as a list | `if`, `len` |
| **5** | Game Day Loop | `for` loops, `range( )`, a running total | add up a season game by game · print a scoreboard for each week · count his player's 100-yard games | lists, `if` |
| **6** | Build Your Own Machine | `def`, inputs (parameters), `return` | rebuild `compare` himself · a "fantasy points" calculator for any player and season | loops, `if` |
| **7** | Player Cards | dictionaries `{ }`: key → value | a player card (name, team, number, best season) · team code → team name (`"KC"` → `"Chiefs"`) | functions, loops |
| **8** | Guess the Player | `input( )`, `while` loop, `random` | a quiz game: Python picks a player, gives clues from the data, he guesses | everything so far |
| **9** | Chart Room | bar and line charts with clear labels | his team's yards season by season · two players' careers side by side | dictionaries, loops |
| **10** | My Own Investigation | putting it all together (the "Make" step) | he picks his own question, answers it with data, and shows mom the chart | everything |

After Lab 10: harder NFL labs
(two Steve Smiths and `player_id`, grouping by season, the mystery-player filters from the first draft of Lab 2).

## Baseball (MLB) track

Started 2026-10-29. **Same Python ideas, same order, same rules** as the NFL labs above: lab N in baseball teaches
exactly what lab N in football teaches, so a kid can do either sport, or switch between them.
Only the sports task changes. Build scripts: `_build/build_baseball_labN.py` (local, not in git).

**Data.** One table `stats`: one row = one batter in one season (a player traded mid-season is added up into one row,
with his last team). Columns: `name`, `season`, `team` (full name), `G`, `AB`, `H`, `HR`, `RBI`, `SB`, `BB`, `SO`, `playerID`.
History is the Lahman database (1871 to last year); newer seasons come live from statsapi.mlb.com, matched to
Lahman players by birth date and last name, so careers add up across both. Active players carry MLB's spelling
(`"Vladimir Guerrero Jr."`), and every name is stripped of accent marks so kids can type it (`"Julio Rodriguez"`,
`"Ronald Acuna Jr."`). Stats are whole numbers (`Int64`); a stat nobody recorded is `<NA>`, not 0.
The loader is a folded Colab box (`#@title`) at the top of every lab; reading it is a good Lab 7–10 challenge.
If MLB's API is down, the loader prints a short note and carries on with history only.

Watch out when building the next baseball labs:
- **Missing strikeouts and steals.** `SO` is empty for many seasons before 1949 (and in the Negro Leagues), `SB` before 1923.
  Adding up careers over empty seasons makes old stars look like they never struck out. Drop those seasons first
  (`stats.dropna(subset=["SO"])`), as Lab 1 does, and say why in kid words.
- **A misspelled name** gives `<NA>`, then `TypeError` in `round( )` or `if`. Each lab tells the kid what that means.
- **Same-name players** (Ken Griffey dad and son) are joined in `compare`, which matches by name. Fine for now;
  `playerID` is the fix for a later lab.

| Lab | Title | Baseball task | Status |
|---|---|---|---|
| **1** | Baseball Lab | total bases with `*` · records with `sort_values` · `.dropna()` before adding up careers · `time_to_plate(mph)` machine · career HR vs SO chart, then SB vs HR / HR vs BB | ✅ |
| **2** | Stat Detective | best season (`.max()`), average season, biggest seasons ever, `compare` career totals | ✅ |
| **3** | Umpire Bot | `>=` with a walk (4 balls) · safe or out (runner vs throw time, bonus: tie goes to the runner with `<=`) · home run / extra bases / caught by distance (450 ft: order matters) · rate best season · tie bug in `compare` | ✅ |
| **4** | Build Your Roster | a 9-player lineup as a list (batting order counts from 0!) · "is Judge in my lineup?" · this season's top 5 home run hitters as a list | |
| **5** | Game Day Loop | add up a career season by season · count 30-homer seasons · a box score for each inning | |
| **6** | Build Your Own Machine | rebuild `compare` · `batting_average(hits, at_bats)` | |
| **7** | Player Cards | a player card dictionary · position number → name (`6` → `"shortstop"`) | |
| **8** | Guess the Player | quiz with clues from the data | |
| **9** | Chart Room | home runs season by season · two careers side by side | |
| **10** | My Own Investigation | the kid's own question | |

## Mistakes kids commonly make (plan a short "what went wrong?" moment for each)
- Forgetting quotes around text (`NameError`) — done in Lab 2.
- `=` (put in a box) vs `==` (ask "same?") — introduced in Lab 2, practised in Lab 3.
- Missing `:` after `if` — done in Lab 3; indentation again with `for` (Lab 5) and `def` (Lab 6).
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
