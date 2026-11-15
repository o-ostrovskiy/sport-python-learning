// One lab = one file. See labs/README.md for the format.
// Lab 8: Guess the Player. New ideas: input( ), while, random. Notebook: football/Football_Lab_8.ipynb
(() => {
const SKILLS8 = { input: 'Asking with input( )', random: 'Random picks', loops: 'while loops', game: 'Building the quiz' };

// The game box of Part 4. `head` is the top of the box (the lines the child changes).
const GAME_LOOP = `secret = random.choice(cards)
answer = secret["player_display_name"]
tries = 0
guess = ""

while guess != answer and tries < max_tries:
    if tries == 0:
        clue = "Clue 1: he had " + str(secret[stat]) + " " + stat + "."
    elif tries == 1:
        clue = "Clue 2: he plays for " + secret["recent_team"] + "."
    else:
        clue = "Clue 3: his name starts with " + answer[0] + "."
    guess = input(clue + " Who is it? ")
    tries = tries + 1

if guess == answer:
    print("TOUCHDOWN! It was", answer, "- you got it in", tries, "tries.")
else:
    print("Out of tries. It was", answer)`;
const STATS = ['passing_yards', 'passing_tds', 'rushing_yards', 'rushing_tds', 'receptions', 'receiving_yards', 'receiving_tds'];

const LAB8 = [
  { md: '<h2>Part 1. Python asks YOU ⌨️</h2>Until today, you typed everything into the code before pressing Run. <code>input( )</code> is new: Python <b>stops and asks you a question</b> while the program is running. That is how every game works.' },
  { skill: 'input', kind: 'run', data: true, task: 'Run it. A small box pops up with a question. Type a player\'s name and press <b>OK</b>.',
    code: 'name = input("Who is your favorite player? ")\nprint("Great pick:", name)',
    ok: '<code>input( )</code> shows the words in its brackets, waits for you to type, and hands your answer back. The <code>=</code> puts your answer into the locker <code>name</code>.' },
  { skill: 'input', kind: 'predict', data: true, task: 'Python will ask for a number. Type <b>4</b> in the pop-up box. <b>Guess first:</b> what will <code>tds + tds</code> show? Type your guess, then run it.',
    code: 'tds = input("How many touchdowns? Type 4: ")\nprint(tds + tds)',
    check: ({ guess, out }) => { const got = out.trim(), right = String(guess).trim() === got;
      return { ok: true, missed: !right, msg: (right ? 'You remembered Lab 2! ' : `You guessed ${esc(String(guess))}, but Python shows ${esc(got)}. `) + '<code>input( )</code> always hands back <b>text</b>, even when you type digits. And <code>+</code> glues text together, so "4" + "4" is "44".' }; } },
  { skill: 'input', kind: 'turn', data: true, task: 'A touchdown is 6 points. Run this box and type <b>4</b>: the answer is silly, because text times 6 means "repeat it 6 times". <b>Fix it:</b> put <code>int( )</code> around the whole <code>input( )</code>, like this: <code>int(input("..."))</code>. <code>int</code> turns text into a whole number. Type digits in the pop-up, not words.',
    code: 'tds = input("How many touchdowns? ")\npoints = tds * 6\nprint(tds, "touchdowns are", points, "points")',
    hints: ['Only line 1 changes. <code>int(</code> goes before <code>input</code>, and one more <code>)</code> goes at the very end of the line.', 'Line 1 should be: <code>tds = int(input("How many touchdowns? "))</code>'],
    check: ({ q }) => {
      if (!q('isinstance(points, int)')) return { msg: `Python says ${esc(String(q('str(points)')))} points! <code>tds</code> is still text, so <code>* 6</code> repeated it 6 times. Wrap the input: <code>int(input("..."))</code>.` };
      return { ok: true, msg: `${q('int(tds)')} touchdowns are ${q('points')} points. Real math! <code>int( )</code> turned your typed text into a number.` }; } },

  { md: '<h2>Part 2. Python picks 🎲</h2>A quiz is no fun if you already know the answer. Python has a toolbox called <code>random</code> for surprises. <code>random.choice(a_list)</code> picks <b>one thing from a list</b>, like pulling a name out of a hat.' },
  { skill: 'random', kind: 'run', task: 'Run it <b>three times</b> and watch the name. <code>import random</code> opens the toolbox, just like <code>import pandas</code> in Lab 2.',
    code: 'import random\n\nplayers = ["Patrick Mahomes", "Josh Allen", "Lamar Jackson", "Joe Burrow", "Jalen Hurts"]\npick = random.choice(players)\nprint("Python picked:", pick)',
    ok: 'A surprise every time! The dot means "from that toolbox": <code>random.choice(players)</code> = "from <code>random</code>, use <code>choice</code> on my list".' },
  { skill: 'random', kind: 'quiz', task: 'You run that box two more times. What will Python pick?',
    opts: ['The same player both times', 'Two new players, never a repeat', 'Nobody can know: every run is a fresh pick'], a: 2,
    tips: ['Not for sure. <code>random.choice</code> pulls a new name out of the hat on every run.', 'It can repeat! The hat always has all 5 names in it, so the same one can come out twice.', ''],
    ok: 'Right: nobody can know, not even Python. Each run is a fresh pick from all 5 names, so repeats can happen.' },
  { skill: 'random', kind: 'turn', data: true, task: 'The <b>coin toss</b>. Python flips, you call it. One word is missing: the 6-letter word that picks one thing from a list. Fill it in and run. Type <b>heads</b> or <b>tails</b> in small letters.',
    code: 'import random\n\ncoin = ["heads", "tails"]\ntoss = random.___(coin)\ncall = input("The coin is in the air! heads or tails? ")\n\nif call == toss:\n    print("It is", toss, "- you won the toss!")\nelse:\n    print("It is", toss, "- the other team gets the ball.")',
    hints: ['You ran this word in the first box of Part 2: <code>random.______(players)</code>.', 'The line should be: <code>toss = random.choice(coin)</code>'],
    check: ({ code, q }) => {
      if (!/random\.choice\(\s*coin\s*\)/.test(code)) return { msg: 'Look at the <code>toss</code> line. The missing word picks one thing from the list, and it has 6 letters.' };
      const call = String(q('call')), toss = String(q('toss'));
      if (call !== 'heads' && call !== 'tails') return { ok: true, msg: `The coin works: it landed on ${toss}. You typed "${esc(call)}", which is not exactly heads or tails, so Python could not match it. Run it again if you like!` };
      return { ok: true, msg: `It landed on ${toss} and you called ${call}. ${call === toss ? 'You won the toss!' : 'Not this time.'} Run it again: Python flips a new coin every time.` }; } },

  { md: '<h2>Part 3. Again, and again: <code>while</code> 🔁</h2>A <code>for</code> loop (Lab 5) walks through a list and then stops. A <code>while</code> loop is different: it keeps going <b>as long as</b> its question is True. In English: "<b>while</b> I still have tries left, keep asking".' },
  { skill: 'loops', kind: 'run', task: '<b>Guess first:</b> which numbers will this print? Say them out loud, then run it.',
    code: 'tries = 0\n\nwhile tries < 3:\n    print("Try number", tries)\n    tries = tries + 1\n\nprint("The loop is over. tries is now", tries)',
    ok: '0, 1, 2. Before every lap Python asks "is <code>tries &lt; 3</code>?" True means one more lap. When <code>tries</code> reached 3 the answer was False, so the loop stopped.' },
  { skill: 'loops', kind: 'predict', task: 'Your team gains 3 yards on every play and needs 10 for a first down. <b>Guess first:</b> how many plays will the loop run? Type a number, then run it.',
    code: 'yards = 0\nplays = 0\n\nwhile yards < 10:\n    yards = yards + 3\n    plays = plays + 1\n\nprint("First down after", plays, "plays, with", yards, "yards")',
    check: ({ guess }) => ({ ok: true, missed: +guess !== 4, msg: (+guess === 4 ? 'Exactly! ' : `You guessed ${esc(String(guess))}, but it takes 4. `) + 'After 3 plays there are only 9 yards, and 9 is still less than 10, so the loop goes one more lap: 12 yards.' }) },
  { skill: 'loops', kind: 'quiz', task: 'Someone forgot the line <code>tries = tries + 1</code>. What happens now?',
    code: 'tries = 0\n\nwhile tries < 3:\n    print("Try number", tries)',
    opts: ['It prints once and stops', 'It never stops: tries stays 0 forever', 'A red error'], a: 1,
    tips: ['Python goes back to the question after every lap. Is <code>tries &lt; 3</code> ever going to be False here?', '', 'No error. Python is happy to keep going. Look: does <code>tries</code> ever change?'],
    ok: 'Yes: an <b>endless loop</b>. 0 is always less than 3, so it prints forever. Every <code>while</code> needs a line inside it that changes the thing in its question. Do not try it here: the page would freeze!' },
  { skill: 'loops', kind: 'run', task: 'Two small new things for our game. <code>!=</code> asks "are these <b>not</b> the same?": the opposite of <code>==</code>. And <code>and</code> between two questions says True only when <b>both</b> are True. <b>Guess first:</b> five answers, True or False?',
    code: 'print("Josh Allen" == "Josh Allen")\nprint("Josh Allen" != "Josh Allen")\nprint("Josh Allen" != "Joe Burrow")\n\nprint(2 < 3 and 5 < 9)\nprint(2 < 3 and 5 < 1)',
    ok: 'True, False, True, then True, False. The last one is False because <code>5 &lt; 1</code> is not true, and <code>and</code> needs <b>both</b> sides to be True.' },
  { skill: 'loops', kind: 'turn', data: true, task: 'A real guessing loop: "<b>while</b> the guess is not the secret <b>and</b> there are tries left, ask again". One symbol is missing: the one that means "less than", so you get 3 tries. Fill it in, run it, and answer. Capital letters matter!',
    code: 'secret = "Saquon Barkley"\ntries = 0\nguess = ""\n\nwhile guess != secret and tries ___ 3:\n    guess = input("Who ran for 2,005 yards in 2024? ")\n    tries = tries + 1\n\nif guess == secret:\n    print("Correct! You needed", tries, "tries.")\nelse:\n    print("Out of tries. It was", secret)',
    hints: ['You used this symbol in the first box of Part 3: <code>while tries ___ 3:</code>', 'The line should be: <code>while guess != secret and tries &lt; 3:</code>'],
    check: ({ code, q }) => {
      const t = q('tries');
      if (/tries\s*<=\s*3/.test(code)) return { msg: '<code>&lt;=</code> lets the loop run when <code>tries</code> is 0, 1, 2 <b>and</b> 3: that is 4 tries. Use the symbol for "less than" only.' };
      if (t === 0) return { msg: 'The loop never started: Python did not ask you anything. At the start <code>tries</code> is 0, so the question must be True for 0. Which symbol means "less than"?' };
      if (t > 3) return { msg: `That was ${t} tries. We want the loop to stop after 3.` };
      if (!/tries\s*<\s*3/.test(code)) return { msg: 'It ran, but use the "less than" symbol <code>&lt;</code> between <code>tries</code> and <code>3</code>, so the count always stops the loop.' };
      return q('guess == secret') ? { ok: true, msg: `Correct in ${t} ${t === 1 ? 'try' : 'tries'}! The loop stopped early, because <code>guess != secret</code> turned False.` }
        : { ok: true, msg: 'Out of tries, so the loop stopped by itself: <code>tries &lt; 3</code> turned False. That count is what keeps a <code>while</code> from running forever.' }; } },

  { md: '<h2>Part 4. Guess the Player 🏈</h2>Time to build the real quiz. Python will pick a <b>secret player</b> from the real stats and give you clues. First we need the players.' },
  { skill: 'game', kind: 'run', data: true, task: 'Run it. Everything here you know from Lab 4: load the seasons, keep the newest one, sort by receiving yards, take the top 10.',
    code: 'import pandas as pd\n\nseasons = pd.read_csv("player_stats_season.csv", low_memory=False)\nseasons = seasons[seasons["season_type"] == "REG"]\nnewest = seasons["season"].max()\nlast = seasons[seasons["season"] == newest]\n\ntop = last.sort_values("receiving_yards", ascending=False).head(10)\ntop = top[["player_display_name", "position", "recent_team", "receiving_yards"]]\ntop',
    ok: 'The top 10 receivers of the newest season. Python will hide one of them. Keep this table in sight: you will need the spelling of the names.' },
  { skill: 'game', kind: 'run', data: true, task: 'One new command: <code>.to_dict("records")</code> turns every row of the table into a <b>player card</b>: a dictionary, like in Lab 7. <b>Guess first:</b> how many cards will there be?',
    code: 'cards = top.to_dict("records")\n\nprint("Cards:", len(cards))\nprint(cards[0])\nprint(cards[0]["player_display_name"], "plays for", cards[0]["recent_team"])',
    ok: '<code>cards</code> is a <b>list of dictionaries</b>: 10 player cards. <code>cards[0]</code> is the first card, and <code>cards[0]["recent_team"]</code> reads the team from it.' },
  { skill: 'game', kind: 'turn', data: true, task: '<b>The game!</b> Python picks a secret card and gives a clue inside the pop-up box. <code>str( )</code> is the twin of <code>int( )</code>: it turns a number into text, so <code>+</code> can glue it into the clue. Right now you get only <b>1</b> try. Change <code>max_tries</code> to <b>3</b>, then play.',
    code: 'import random\n\nstat = "receiving_yards"\nmax_tries = 1      # how many guesses you get: change it to 3\n\n' + GAME_LOOP,
    hints: ['Only one number changes: the <code>1</code> in the <code>max_tries</code> line near the top.', 'Line 4 should be: <code>max_tries = 3</code>'],
    check: ({ q }) => {
      const mt = q('max_tries'), t = q('tries'), ans = esc(String(q('answer')));
      if (!(mt >= 3)) return { msg: `It was ${ans}. With <code>max_tries = ${esc(String(mt))}</code> you never see clues 2 and 3. Change it to 3 and play again: Python will pick a new secret player.` };
      if (!(t >= 1)) return { msg: 'The loop never asked you anything. Keep the <code>while</code> line as it was.' };
      return q('guess == answer') ? { ok: true, msg: `TOUCHDOWN! ${ans} in ${t} ${t === 1 ? 'try' : 'tries'}. Random pick, while loop, input: you built a real game. Run it again for a new player!` }
        : { ok: true, msg: `It was ${ans}. Tough one! The loop stopped because the tries ran out. Run it again: Python picks a new secret player every time.` }; } },
  { skill: 'game', kind: 'turn', data: true, task: '<b>Make it yours.</b> Turn it into a quiz about runners or quarterbacks: change <code>stat</code> to <code>"rushing_yards"</code> or <code>"passing_yards"</code>. The box makes a new top 10 for your stat, and shows all ten names at the end.',
    code: 'import random\n\nstat = "receiving_yards"    # change to "rushing_yards" or "passing_yards"\nmax_tries = 3\n\ntop = last.sort_values(stat, ascending=False).head(10)\ncards = top.to_dict("records")\n' + GAME_LOOP + '\n\nprint("The ten players were:", list(top["player_display_name"]))',
    hints: ['Change only the words inside the quotes on the <code>stat</code> line. Keep the quotes.', 'Like this: <code>stat = "rushing_yards"</code>'],
    check: ({ q }) => {
      const stat = String(q('stat')), t = q('tries'), ans = esc(String(q('answer')));
      if (stat === 'receiving_yards') return { msg: `It was ${ans}. That was still the receivers quiz. Change <code>stat</code> to <code>"rushing_yards"</code> or <code>"passing_yards"</code>.` };
      if (!STATS.includes(stat)) return { msg: `<code>"${esc(stat)}"</code> is not a stat we can quiz on. Try <code>"rushing_yards"</code> or <code>"passing_yards"</code>.` };
      if (!(t >= 1)) return { msg: 'The loop never asked you anything. Keep <code>max_tries = 3</code>.' };
      return { ok: true, msg: (q('guess == answer') ? `TOUCHDOWN! ${ans} it is. ` : `It was ${ans}. `) + 'Your own quiz, built from real stats. Challenge mom or dad: can they beat you?' }; } }
];

const REVIEW8 = [
  { skill: 'input', q: 'What does input( ) always hand back?', opts: ['a number', 'text', 'True or False'], a: 1 },
  { skill: 'input', q: 'You type 5 in the pop-up box. What prints?', code: 'n = input("Number? ")\nprint(n + n)', opts: ['10', '55', 'a red error'], a: 1 },
  { skill: 'random', q: 'Which line lets Python pick one player from the list team?', opts: ['random.choice(team)', 'team.random()', 'pick(team)'], a: 0 },
  { skill: 'loops', q: 'How many numbers does this print?', code: 'downs = 1\nwhile downs <= 4:\n    print(downs)\n    downs = downs + 1', opts: ['3', '4', 'it never stops'], a: 1 },
  { skill: 'loops', q: 'What does != ask?', opts: ['are these the same?', 'are these NOT the same?', 'is the left one bigger?'], a: 1 },
  { skill: 'game', q: 'Why does the quiz count the tries?', opts: ['so the loop always stops', 'to make Python faster', 'because input( ) needs a number'], a: 0 }
];

registerLab('nfl', 8, {
  title: 'Guess the Player',
  skills: SKILLS8, cells: LAB8, review: REVIEW8,
  data: ['player_stats_season.csv'],
  // Python's own input( ) opens the browser's pop-up with no question in it. This shows the question,
  // and treats Cancel as an empty answer. It only runs in a browser (the checker has its own input).
  setup: `
import builtins as _b
try:
    from js import window as _w
    def _ask(text=""):
        a = _w.prompt(str(text))
        return "" if a is None else str(a)
    _b.input = _ask
except ImportError:
    pass
`
});
})();
