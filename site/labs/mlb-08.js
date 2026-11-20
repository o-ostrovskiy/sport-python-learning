// One lab = one file. See labs/README.md for the format.
// Lab 8: Guess the Player. New ideas: input( ), while, random. Notebook: baseball/Baseball_Lab_8.ipynb
(() => {
const SKILLS = { input: 'Asking with input( )', loops: 'while loops', random: 'Random picks', game: 'Building the quiz' };
const HITTERS = 'hitters = ["Shohei Ohtani", "Aaron Judge", "Juan Soto", "Cal Raleigh", "Bobby Witt Jr."]';
const QUIZ_STATS = ['SB', 'H', 'BB', 'RBI', 'SO', 'G', 'AB'];

// The game loop of Part 4. The lines above it (the ones the child changes) are added in each play.
const GAME = `
tries = 0
guess = ""

while guess != secret and tries < chances:
    guess = input(clues[tries] + " Who is it? ")
    tries = tries + 1

if guess == secret:
    print("YES! You got it! Tries used:", tries)
else:
    print("Out of tries. The mystery player was", secret)`;

const CELLS = [
  { md: '<h2>Part 1. Python asks YOU 🎤</h2>Today you build a <b>game</b>: Python secretly picks an MLB hitter, gives you clues, and you guess. First trick: Python must <b>ask you</b> something and wait for your answer. That is <code>input( )</code>.' },
  { skill: 'input', kind: 'run', data: true, task: 'Run it. Python asks its question in a box under the code. Type a player\'s name and press <b>Enter</b>.',
    code: 'name = input("Who is your favorite player? ")\nprint("Great pick:", name)',
    ok: '<code>input( )</code> shows the question in its brackets, waits for you to type, and hands your answer back. The <code>=</code> puts it into the box <code>name</code>.' },
  { skill: 'input', kind: 'boom', expectError: 'TypeError', data: true, task: 'This box asks for a number and then adds 1 to it. Type <b>62</b> in the answer box. <b>Guess first:</b> will it show 63? Run it. It shows a red error <b>on purpose</b>.',
    code: 'homers = input("How many home runs did Aaron Judge hit in 2022? ")\nprint(homers + 1)',
    ok: 'A red error, just as planned! Python says: "I can\'t add a number to text." The secret: <code>input( )</code> <b>always</b> hands back text. You typed 62, but Python got <code>"62"</code>, with quotes.' },
  { skill: 'input', kind: 'run', task: 'Two small helpers fix this. <code>int( )</code> turns text into a whole <b>number</b>. <code>str( )</code> is its twin: it turns a number into <b>text</b>, so <code>+</code> can glue it to other text. <b>Guess first:</b> what will each line show?',
    code: 'print(int("62") + 1)\nprint("Aaron Judge hit " + str(62) + " home runs")',
    ok: '63, and a full sentence. <code>int("62")</code> is the number 62, so the math works. <code>str(62)</code> is the text "62", so the gluing works.' },
  { skill: 'input', kind: 'turn', data: true, task: 'A tiny quiz. It needs your answer as a <b>number</b>, to compare it with 62. Fill in the blank with the 3-letter helper that turns text into a number. Then run it and type your guess.',
    code: 'guess = ___(input("How many home runs did Aaron Judge hit in 2022? "))\n\nif guess == 62:\n    print("Yes! 62, the American League record")\nelif guess < 62:\n    print("More than that!")\nelse:\n    print("Fewer than that!")',
    hints: ['You saw it in the last box: it turned <code>"62"</code> into 62.', 'Line 1 should be: <code>guess = int(input("How many home runs did Aaron Judge hit in 2022? "))</code>'],
    check: async ({ code, q }) => {
      if (!/int\(\s*input\(/.test(code)) return { msg: 'Use the 3-letter helper that turns text into a whole number: put it right before <code>(input(</code>.' };
      if (!(await q('isinstance(guess, int)'))) return { msg: '<code>guess</code> is not a whole number yet. Line 1 should start with <code>guess = int(input(</code>.' };
      const g = (await q('guess'));
      return { ok: true, msg: (g === 62 ? 'Yes, 62! ' : `You typed ${g}, and Python could compare it with 62. `) + 'Read line 1 from the inside out: <code>input</code> gets text, <code>int</code> makes it a number, <code>=</code> stores it.' }; } },

  { md: '<h2>Part 2. <code>while</code>: keep going ⚾</h2>A <code>for</code> loop (Lab 5) goes once <b>for each</b> thing in a list. In a guessing game nobody knows how many tries it will take. For that there is a second loop: <code>while</code>. It means <b>"as long as this is true, keep going"</b>.' },
  { skill: 'loops', kind: 'predict', task: '<b>Guess first:</b> how many <b>lines</b> will this box print? Type a number, then run it.',
    code: 'strikes = 0\n\nwhile strikes < 3:\n    strikes = strikes + 1\n    print("Strike", strikes)\n\nprint("You\'re out!")',
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 4, msg: (+guess === 4 ? 'Exactly, 4! ' : `You guessed ${esc(String(guess))}, but it is 4. `) + 'Three strikes, then "You\'re out!". Before every lap Python asks "is <code>strikes &lt; 3</code>?" When strikes reached 3, the answer was False and the loop stopped.' }) },
  { skill: 'loops', kind: 'quiz', task: 'Someone forgot the line <code>strikes = strikes + 1</code>. What happens now?',
    code: 'strikes = 0\n\nwhile strikes < 3:\n    print("Strike", strikes)',
    opts: ['It prints once and stops', 'It never stops: strikes stays 0 forever', 'A red error'], a: 1,
    tips: ['Python goes back to the question after every lap. Will <code>strikes &lt; 3</code> ever be False here?', '', 'No error. Python is happy to keep going. Look: does <code>strikes</code> ever change?'],
    ok: 'Yes: a loop that <b>never stops</b>. 0 is always less than 3. Something inside a <code>while</code> must change, or it never ends. Do not try it here: it would keep going until you press ⏹ Stop!' },
  { skill: 'loops', kind: 'turn', task: 'A walk takes <b>4 balls</b> (Lab 3). This loop stops too early. Change only the <code>3</code>, so the umpire counts all 4.',
    code: 'balls = 0\n\nwhile balls < 3:   # change the 3\n    balls = balls + 1\n    print("Ball", balls)\n\nprint("Take your base!")',
    hints: ['The loop runs as long as <code>balls</code> is less than the number. Which number lets it reach 4?', 'The line should be: <code>while balls &lt; 4:</code>'],
    check: async ({ code, q, out }) => {
      if (!/while\s+balls\s*<=?\s*\d+\s*:/.test(code)) return { msg: 'Keep the <code>while balls &lt; …:</code> line, and change only its number.' };
      const b = (await q('balls'));
      if (b < 4) return { msg: `The umpire only counted to ${b}. A walk needs 4 balls. Make the number in the <code>while</code> line bigger.` };
      if (b > 4) return { msg: `The umpire counted ${b} balls! A walk is 4. Make the number smaller.` };
      if (!out.includes('Ball 4')) return { msg: 'Keep the <code>print("Ball", balls)</code> line inside the loop.' };
      return { ok: true, msg: 'Ball 4, take your base! When <code>balls</code> reached 4, "is 4 less than 4?" was False, so the loop stopped.' }; } },
  { skill: 'loops', kind: 'run', task: 'Two small helpers for our game. <code>!=</code> asks "are these <b>not</b> the same?": the opposite of <code>==</code>. And <code>and</code> between two questions says True only when <b>both</b> are True. <b>Guess first:</b> five answers, True or False?',
    code: 'print("Babe Ruth" == "Babe Ruth")\nprint("Babe Ruth" != "Babe Ruth")\nprint("Babe Ruth" != "Hank Aaron")\n\nprint(2 < 3 and 5 < 9)\nprint(2 < 3 and 5 < 1)',
    ok: 'True, False, True, then True, False. The last one is False because <code>5 &lt; 1</code> is not true, and <code>and</code> needs <b>both</b> sides.' },
  { skill: 'loops', kind: 'turn', data: true, task: 'The quiz with <b>3 tries</b>: "<b>while</b> the guess is not right <b>and</b> there are tries left, ask again". The first word of the loop is missing: 5 letters, it means "as long as". Fill it in and play. Type numbers only.',
    code: 'tries = 0\nguess = 0\n\n___ guess != 60 and tries < 3:\n    guess = int(input("How many home runs did Babe Ruth hit in 1927? "))\n    tries = tries + 1\n    if guess < 60:\n        print("More than that!")\n    elif guess > 60:\n        print("Fewer than that!")\n\nif guess == 60:\n    print("Yes! 60 home runs. Tries used:", tries)\nelse:\n    print("Out of tries. It was 60.")',
    hints: ['It is the word this whole part is about.', 'The line should be: <code>while guess != 60 and tries &lt; 3:</code>'],
    check: async ({ code, q }) => {
      if (!/while\s+guess\s*!=\s*60\s+and\s+tries\s*<\s*3\s*:/.test(code)) return { msg: 'The missing word starts the loop. It has 5 letters and means "as long as". Keep the rest of that line as it was.' };
      const t = (await q('tries'));
      if (!(t >= 1)) return { msg: 'The loop never asked you anything. Keep <code>tries = 0</code> and <code>guess = 0</code> at the top.' };
      return (await q('guess == 60')) ? { ok: true, msg: `60 it is, in ${t} ${t === 1 ? 'try' : 'tries'}! The loop stopped early, because <code>guess != 60</code> turned False.` }
        : { ok: true, msg: 'Out of tries: it was 60, a record that stood for 34 years. The loop stopped by itself because <code>tries &lt; 3</code> turned False. That count keeps a <code>while</code> from running forever.' }; } },

  { md: '<h2>Part 3. <code>random</code>: Python picks 🎲</h2>A guessing game is no fun if you already know the answer. Python has to pick <b>by surprise</b>. Its toolbox for that is called <code>random</code>.' },
  { skill: 'random', kind: 'run', task: 'Run it <b>three times</b> and watch the name. <code>import random</code> opens the toolbox, like <code>import pandas</code> in Lab 2. <code>random.choice( )</code> picks <b>one thing from a list</b>, like pulling a name out of a hat.',
    code: 'import random\n\n' + HITTERS + '\n\nprint(random.choice(hitters))',
    ok: 'A surprise every time! The dot means "from that toolbox": <code>random.choice(hitters)</code> = "from <code>random</code>, use <code>choice</code> on my list".' },
  { skill: 'random', kind: 'quiz', task: 'You run that box two more times. Which name comes out?',
    opts: ['The same name as last time', 'The next name on the list', 'Nobody can know ahead of time'], a: 2,
    tips: ['Not for sure. <code>random.choice</code> pulls a new name out of the hat on every run.', 'It does not go in order. All 5 names are in the hat every time.', ''],
    ok: 'Right! <b>Random</b> means nobody can know what comes out. Not even you, the programmer. The same name can even come out twice in a row.' },
  { skill: 'random', kind: 'turn', data: true, task: 'Now Python keeps its pick a <b>secret</b>: it goes into a variable and is not printed until the end. One word is missing: the 6-letter word that picks one thing from a list. Fill it in, run it, and guess. Spell the name exactly as in the list.',
    code: 'import random\n\n' + HITTERS + '\nsecret = random.___(hitters)\n\nguess = input("I picked one of the 5 hitters. Who is it? ")\n\nif guess == secret:\n    print("YES! It was", secret)\nelse:\n    print("No, it was", secret)',
    hints: ['You ran this word two boxes ago: <code>random.______(hitters)</code>.', 'The line should be: <code>secret = random.choice(hitters)</code>'],
    check: async ({ code, q }) => {
      if (!/random\.choice\(\s*hitters\s*\)/.test(code)) return { msg: 'Look at the <code>secret</code> line. The missing word picks one thing from the list, and it has 6 letters.' };
      if (!(await q('secret in hitters'))) return { msg: 'The secret must come from the list <code>hitters</code>. Keep the list as it was.' };
      const s = esc(String((await q('secret'))));
      return { ok: true, msg: ((await q('guess == secret')) ? `You got it: ${s}! That was luck, 1 chance in 5. ` : `It was ${s}. With 5 players you will be right about 1 time in 5. `) + 'A good game gives <b>clues</b>. For those we need the stats.' }; } },

  { md: '<h2>Part 4. The whole game 🕵️</h2>Python will pick a <b>mystery player</b> from the stats and give you clues. First we need the players it may pick from.' },
  { skill: 'game', kind: 'run', data: true, task: 'Run it. You wrote these lines in Lab 4: open the stats, keep the newest season, sort by home runs, and make a <b>list</b> of the top 10 names.',
    code: 'import pandas as pd\n\nstats = pd.read_csv("mlb_batting.csv").convert_dtypes()\nnewest = stats["season"].max()\nlast = stats[stats["season"] == newest]\nbest = last.sort_values("HR", ascending=False)\nplayers = list(best["name"].head(10))\n\nprint(newest)\nprint(players)',
    ok: 'The top 10 home run hitters of the newest season. Python will hide one of them. Remember how the names are spelled!' },
  { skill: 'game', kind: 'run', data: true, task: 'A small machine (Lab 6) that looks up <b>one fact</b> about one player in the newest season. There is only one row for him, so <code>.max()</code> just hands back that one value. It tries the machine on <code>players[0]</code>, the first player on the list.',
    code: 'def clue(name, column):\n    row = last[last["name"] == name]\n    return row[column].max()\n\n\nprint(players[0])\nprint(clue(players[0], "team"))\nprint(clue(players[0], "HR"))',
    ok: 'His name, his team, his home runs. <code>clue(name, column)</code> can now make a clue about <b>any</b> player.' },
  { skill: 'game', kind: 'turn', data: true, task: '<b>The game!</b> Python picks a secret player and shows a clue in the answer box. The clues are a <b>list</b>: try 0 shows <code>clues[0]</code>, try 1 shows <code>clues[1]</code>… Right now you get only <b>1</b> try. Change <code>chances</code> to <b>3</b>, then play. Type the full name with capital letters. (Clue 3 uses <code>secret[0]</code>: counting from 0 works on text too, so spot 0 of a name is its first letter.)',
    code: 'import random\n\nchances = 1      # how many guesses you get: change it to 3\n\nsecret = random.choice(players)\n\nclues = [\n    "Clue 1: he plays for the " + clue(secret, "team") + ".",\n    "Clue 2: he hit " + str(clue(secret, "HR")) + " home runs in " + str(newest) + ".",\n    "Clue 3: his name starts with " + secret[0] + ".",\n]\n' + GAME,
    hints: ['Only one number changes: the <code>1</code> in the <code>chances</code> line near the top.', 'Line 3 should be: <code>chances = 3</code>'],
    check: async ({ q }) => {
      const ch = (await q('chances')), t = (await q('tries')), s = esc(String((await q('secret'))));
      if (ch > 3) return { msg: `There are only 3 clues, so 3 tries is the most. Set <code>chances = 3</code> and play again.` };
      if (!(ch >= 3)) return { msg: `It was ${s}. With <code>chances = ${esc(String(ch))}</code> you never see clues 2 and 3. Change it to 3 and play again: Python will pick a new mystery player.` };
      if (!(t >= 1)) return { msg: 'The loop never asked you anything. Keep the <code>while</code> line as it was.' };
      return (await q('guess == secret')) ? { ok: true, msg: `YES! ${s} in ${t} ${t === 1 ? 'try' : 'tries'}. Random pick, while loop, input: you built a whole game. Run it again for a new player!` }
        : { ok: true, msg: `It was ${s}. Tough one! The loop stopped because the tries ran out. Run it again: Python picks a new mystery player every time.` }; } },
  { skill: 'game', kind: 'turn', data: true, task: '<b>Make it yours.</b> Turn it into a quiz about base stealers or hit machines: change <code>stat</code> to <code>"SB"</code> (stolen bases), <code>"H"</code> (hits) or <code>"BB"</code> (walks). The box makes a new top 10 for your stat, and shows all the names at the end.',
    code: 'import random\n\nstat = "HR"      # change to "SB", "H" or "BB"\nhow_many = 10    # how many top players Python picks from\nchances = 3\n\nbest = last.sort_values(stat, ascending=False)\nplayers = list(best["name"].head(how_many))\nsecret = random.choice(players)\n\nclues = [\n    "Clue 1: he plays for the " + clue(secret, "team") + ".",\n    "Clue 2: his " + stat + " in " + str(newest) + ": " + str(clue(secret, stat)) + ".",\n    "Clue 3: his name starts with " + secret[0] + ".",\n]\n' + GAME + '\n\nprint("The players were:", players)',
    hints: ['Change only the letters inside the quotes on the <code>stat</code> line. Keep the quotes.', 'Like this: <code>stat = "SB"</code>'],
    check: async ({ q }) => {
      const stat = String((await q('stat'))), t = (await q('tries')), s = esc(String((await q('secret'))));
      if (stat === 'HR') return { msg: `It was ${s}. That was still the home run quiz. Change <code>stat</code> to <code>"SB"</code>, <code>"H"</code> or <code>"BB"</code>.` };
      if (!QUIZ_STATS.includes(stat)) return { msg: `<code>"${esc(stat)}"</code> is not a stat we can quiz on. Try <code>"SB"</code>, <code>"H"</code> or <code>"BB"</code>.` };
      if (!(t >= 1)) return { msg: 'The loop never asked you anything. Keep <code>chances = 3</code>.' };
      return { ok: true, msg: ((await q('guess == secret')) ? `YES! ${s} it is. ` : `It was ${s}. `) + 'Your own quiz, built from MLB stats. Now let mom, dad or a friend play it: you wrote a program other people can use!' }; } }
];

const REVIEW = [
  { skill: 'input', q: 'What does input( ) always hand back?', opts: ['a number', 'text', 'True or False'], a: 1 },
  { skill: 'input', q: 'You type 5 in the answer box. What prints?', code: 'runs = int(input("Runs? "))\nprint(runs + 1)', opts: ['51', '6', 'a red error'], a: 1 },
  { skill: 'loops', q: 'How many times does this print "Pitch"?', code: 'pitches = 0\nwhile pitches < 2:\n    print("Pitch")\n    pitches = pitches + 1', opts: ['1', '2', '3'], a: 1 },
  { skill: 'loops', q: 'What makes a while loop run forever?', opts: ['Nothing inside it changes the thing in its question', 'It has too many lines', 'It uses input( )'], a: 0 },
  { skill: 'random', q: 'What does random.choice(lineup) do?', opts: ['sorts the lineup', 'picks one player from the lineup by surprise', 'counts the players'], a: 1 },
  { skill: 'game', q: 'Why do we write str(45) before gluing it into a clue with + ?', opts: ['to make the number bigger', 'because + can only glue text to text', 'to round the number'], a: 1 }
];

registerLab('mlb', 8, {
  title: 'Guess the Player',
  skills: SKILLS, cells: CELLS, review: REVIEW,
  data: ['mlb_batting.csv'],
});
})();
