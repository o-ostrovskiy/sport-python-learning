// One lab = one file. See labs/README.md for the format.
(() => {
const SKILLS1 = { variables: 'Variables and quotes', math: 'Math with variables', functions: 'Using a function', tables: 'Working with a table' };
const LAB1 = [
  { md: '<h2>Mission 1. Warm-up 🔥</h2>Python remembers things in <b>variables</b>. A variable is like a locker with a name tag: you put something inside, and later you ask for it by name. The <code>=</code> sign means <b>"put this into the locker"</b>.' },
  { skill: 'variables', kind: 'run', task: 'Press <b>Run</b> and watch what Python shows.',
    code: 'player = "Justin Jefferson"\nteam = "Vikings"\nnumber = 18\n\nprint(player, "plays for the", team, "and wears number", number)',
    ok: 'See that? <code>player</code> has no quotes, so Python opened the locker. <code>"plays for the"</code> has quotes, so Python showed those exact words.' },
  { skill: 'variables', kind: 'turn', task: 'Change the three values to <b>your</b> favorite player. Keep the quotes around the name and the team.',
    code: 'player = "Patrick Mahomes"   # change to your favorite player\nteam = "Chiefs"              # his team\nnumber = 15                  # his number\n\nprint(player, "plays for the", team, "and wears number", number)',
    hints: ['Only change what is between the quotes, and the number.', 'Like this: <code>player = "Josh Allen"</code>. Then fix the team and the number.'],
    check: async ({ g, out }) => {
      const p = (await g('player')), n = (await g('number'));
      if (typeof p !== 'string') return { msg: 'The name must be text, so it needs quotes: <code>player = "Josh Allen"</code>.' };
      if (p === 'Patrick Mahomes') return { msg: 'It still says Patrick Mahomes. Type your own favorite player between the quotes.' };
      if (typeof n !== 'number') return { msg: 'The jersey number is a number, so no quotes: <code>number = 17</code>.' };
      if (!out.includes(p)) return { msg: 'Keep the <code>print</code> line so we can see your player.' };
      return { ok: true, msg: `${p}, number ${n}. Great pick! You just changed three lockers.` }; } },
  { skill: 'variables', kind: 'quiz', task: 'Quick one. What does this print?', code: 'team = "Vikings"\nprint("team")',
    opts: ['Vikings', 'team', '"team"'], a: 1,
    tips: ['Look closely: <code>"team"</code> has quotes here. With quotes Python does not open the locker.', '', 'Close! Python shows the word, but the quotes themselves never get printed.'],
    ok: 'Right. Quotes mean "these exact letters". No quotes means "open the locker".' },
  { md: '<h2>Mission 2. Scoreboard math 🧮</h2>Python is also a calculator. A touchdown is 6 points, an extra point is 1, a field goal is 3. In Python, <code>*</code> means <b>times</b>.' },
  { skill: 'math', kind: 'predict', task: '<b>Guess first!</b> What final score will Python print? Type your guess, then run it.',
    code: 'touchdowns = 3\nextra_points = 3\nfield_goals = 2\n\nscore = touchdowns * 6 + extra_points * 1 + field_goals * 3\nprint("Final score:", score)',
    check: async ({ guess }) => ({ ok: true, msg: +guess === 27 ? 'You called it: 27! 3×6 + 3×1 + 2×3. Python did the math, then put the answer in <code>score</code>.'
      : `You guessed ${guess}, Python says 27. Here is how: 3×6 = 18, plus 3×1 = 3, plus 2×3 = 6. That is 27.`, missed: +guess !== 27 }) },
  { skill: 'math', kind: 'turn', task: 'The defense got a <b>safety</b> (2 points)! Make a new locker <code>safeties = 1</code>, then add it to the score line. The scoreboard should say <b>29</b>.',
    code: 'touchdowns = 3\nextra_points = 3\nfield_goals = 2\n\nscore = touchdowns * 6 + extra_points * 1 + field_goals * 3\nprint("Final score:", score)',
    hints: ['Step 1: add a new line under <code>field_goals = 2</code> that says <code>safeties = 1</code>.', 'Step 2: at the end of the score line add <code>+ safeties * 2</code>.'],
    check: async ({ g, code }) => {
      if (!/^\s*safeties\s*=/m.test(code)) return { msg: 'First make the locker. Add a line: <code>safeties = 1</code>.' };
      const sc = (await g('score'));
      if (sc === 27) return { msg: 'The locker is there, but the score line is not using it yet. Add <code>+ safeties * 2</code> at the end of that line.' };
      if (sc !== 29) return { msg: `The scoreboard says ${sc}, we need 29. A safety is 2 points, so it is <code>safeties * 2</code>.` };
      return { ok: true, msg: '29! You wrote a new variable and used it in math. That is real programming.' }; } },
  { md: '<h2>Mission 3. Speedometer 🏎️</h2>Let\'s build a <b>machine</b> (programmers call it a <b>function</b>): you put a 40-yard time in, and a speed in miles per hour comes out. The lines inside the machine are pushed to the right. That is how Python knows they belong to it.' },
  { skill: 'functions', kind: 'run', task: 'Run it to build the machine and test it on Xavier Worthy, the fastest ever.',
    code: 'def speed_mph(seconds):\n    yards_per_second = 40 / seconds\n    return round(yards_per_second * 3600 / 1760, 2)\n\nprint("Xavier Worthy (4.21 sec):", speed_mph(4.21), "mph")',
    ok: '19.43 miles per hour! <code>speed_mph(4.21)</code> fed 4.21 into the machine, and the answer came back out.' },
  { skill: 'functions', kind: 'turn', task: 'Your turn to use the machine. Tyreek Hill ran the 40 in <b>4.29</b> seconds. Print his speed.',
    code: '# Tyreek Hill ran 4.29 seconds. Print his speed in mph:\n',
    hints: ['Look at the Worthy line above. The machine is used like this: <code>speed_mph(4.21)</code>.', 'Put the machine inside print: <code>print(speed_mph(____))</code>. Which number goes in?', 'The answer: <code>print(speed_mph(4.29))</code>'],
    check: async ({ out, code }) => {
      if (out.includes('19.07')) return { ok: true, msg: '19.07 mph! You used a function all by yourself. Tyreek would be proud.' };
      if (!/speed_mph\s*\(/.test(code)) return { msg: 'Use our machine. Its name is <code>speed_mph</code>, and the time goes in the round brackets.' };
      if (!/print/.test(code)) return { msg: 'The machine made the answer, but nobody showed it! Wrap it in <code>print( )</code>.' };
      if (!/4\.29/.test(code)) return { msg: 'Check the time you fed the machine. Tyreek ran <code>4.29</code>.' };
      return { msg: 'Almost. Try exactly <code>print(speed_mph(4.29))</code>.' }; } }
  ,{ md: '<h2>Mission 4. The secret NFL archive 📂</h2>Every spring the NFL holds the <b>Scouting Combine</b>: future players run the 40-yard dash, jump and lift. We are going to open <b>every Combine result since 2000</b>. A helper called <b>pandas</b> lets Python work with tables, like a spreadsheet. We call it <code>pd</code> for short.' },
  { skill: 'tables', kind: 'run', data: true, task: 'Run it to open the archive. <code>len( )</code> <b>counts</b> the rows, and <code>.head()</code> shows the <b>first 5</b>. One row is one player.',
    code: 'import pandas as pd\n\ncombine = pd.read_csv("combine.csv")\n\nprint("Players in the archive:", len(combine))\ncombine.head()',
    ok: 'Almost 9,000 players! <code>forty</code> is the 40-yard dash time in seconds: lower is faster. <code>NaN</code> means empty: that player skipped the drill.' },
  { skill: 'tables', kind: 'turn', data: true, task: 'Find <b>your</b> player. Read it like a sentence: "from <code>combine</code>, keep the rows where <code>player_name</code> equals <code>name</code>". Two equals signs <code>==</code> mean <b>"is it the same?"</b>',
    code: 'name = "Justin Jefferson"   # change this\n\ncombine[combine["player_name"] == name]',
    hints: ['Change only the name between the quotes. Use the full name, with capital letters.', 'Try someone who went to the Combine after 2000, like <code>"Saquon Barkley"</code> or <code>"Patrick Mahomes"</code>.'],
    check: async ({ g, q }) => {
      const n = (await g('name'));
      if (typeof n !== 'string') return { msg: 'The name is text, so it needs quotes: <code>name = "Josh Allen"</code>.' };
      if (n === 'Justin Jefferson') return { msg: 'That is still Justin Jefferson. Put your own player between the quotes.' };
      if (!(await q('len(combine[combine["player_name"] == name])'))) return { msg: `Nobody in the archive is called "${esc(n)}". Check the spelling and the capital letters. Or maybe he skipped the Combine: try another player.` };
      return { ok: true, msg: `Found him! ${esc(n)}: ${(await q('_who(combine, name)'))}.` }; } },
  { skill: 'tables', kind: 'quiz', task: 'Quick one. What does this count?', code: 'len(combine)',
    opts: ['the columns in the table', 'the rows: one for each player', 'the letters in the word combine'], a: 1,
    tips: ['Not the columns. <code>len</code> of a table counts how many rows it has.', '', '<code>combine</code> has no quotes, so it is the locker with our table inside, not a word.'],
    ok: 'Right: one row per player, so <code>len(combine)</code> is how many players we have.' },
  { md: '<h2>Mission 5. Who is the fastest ever? ⚡</h2>Now we put every player in order by 40-yard time. Read the chain from left to right: <code>.dropna</code> throws away players with an empty time, <code>.sort_values("forty")</code> sorts them with the smallest time first, and <code>.head(10)</code> keeps the top 10.' },
  { skill: 'tables', kind: 'run', data: true, task: 'Run it to see the 10 fastest players since 2000.',
    code: 'fastest = combine.dropna(subset=["forty"]).sort_values("forty")\nfastest[["player_name", "pos", "forty", "season"]].head(10)',
    ok: 'There he is: Xavier Worthy, 4.21 seconds. Look at the <code>pos</code> column. Which positions are the speedsters?' },
  { skill: 'tables', kind: 'turn', data: true, task: 'Who is the <b>slowest</b>? Guess the position first! Then change <code>head</code> to <code>tail</code> (keep the <code>(10)</code>). <code>.tail(10)</code> shows the <b>last</b> 10 rows.',
    code: 'fastest[["player_name", "pos", "forty", "season"]].head(10)   # change head to tail',
    hints: ['Find the word <code>head</code> near the end of the line and type <code>tail</code> instead.'],
    check: async ({ code, q }) => /\.tail\s*\(/.test(code.replace(/#.*/g, ''))
      ? { ok: true, msg: `The slowest is ${(await q('fastest.iloc[-1]["player_name"]'))}, position ${(await q('fastest.iloc[-1]["pos"]'))}, with ${(await q('fastest.iloc[-1]["forty"]'))} seconds. Big linemen are built for power, not speed. Did you guess right?` }
      : { msg: 'That is still the fastest 10. Change the word <code>head</code> to <code>tail</code>.' } },
  { skill: 'tables', kind: 'turn', data: true, task: 'Now just one position. It starts with wide receivers, <code>"WR"</code>. Change it to <code>"RB"</code>, <code>"CB"</code>, <code>"TE"</code> or <code>"QB"</code>. Keep the quotes.',
    code: 'position = "WR"   # try RB, CB, QB, TE\n\none_position = combine[combine["pos"] == position]\none_position.sort_values("forty")[["player_name", "forty", "season"]].head(10)',
    hints: ['Only change the two letters between the quotes on line 1.'],
    check: async ({ g, q }) => {
      const p = (await g('position'));
      if (p === 'WR') return { msg: 'Still wide receivers. Change <code>"WR"</code> to another position, like <code>"RB"</code>.' };
      if (!(await q('len(one_position)'))) return { msg: `No players have the position "${esc(String(p))}". Use capital letters: <code>"RB"</code>, <code>"CB"</code>, <code>"QB"</code> or <code>"TE"</code>.` };
      return { ok: true, msg: `The fastest ${esc(p)} since 2000 is ${(await q('one_position.sort_values("forty").iloc[0]["player_name"]'))}. You just filtered a table of 9,000 players with one line.` }; } },
  { md: '<h2>Mission 6. THE BIG QUESTION 🔍</h2>NFL teams spend millions picking players by their Combine numbers. But <b>do the fastest receivers really become the best ones?</b> Scientists guess <b>before</b> they look, so nobody can say "I knew it all along".' },
  { skill: 'tables', kind: 'quiz', vote: true, task: 'What do you think? There is no wrong answer here.',
    opts: ['Yes, the fastest ones get the most yards', 'No, speed does not matter at all', 'It is mixed: speed helps a little'],
    ok: 'Locked in! Now let us check it with real data.' },
  { skill: 'tables', kind: 'run', data: true, task: '👀 <b>Watch the pros.</b> This box glues each receiver\'s 40 time to the yards he gained in his whole career, then draws a chart. Every dot is one receiver. <b>Left = faster. Up = more yards.</b>',
    code: 'import matplotlib.pyplot as plt\n\nyards = pd.read_csv("career_yards.csv")\nwr = combine[(combine["pos"] == "WR") & combine["forty"].notna()]\nwr = wr.drop_duplicates("player_name", keep=False)\ndata = wr.merge(yards, on="player_name")\nprint("Receivers with both numbers:", len(data))\n\nplt.figure(figsize=(9, 5))\nplt.scatter(data["forty"], data["yards"], alpha=0.5)\nplt.xlabel("40-yard dash in seconds   (left = faster)")\nplt.ylabel("Career receiving yards")\nplt.title("Does speed make a great receiver?")\nplt.show()',
    check: async () => ({ ok: true, msg: (myVote === 2 ? 'Good call! ' : 'Surprise! ') + 'If speed decided everything, the highest dots would all be on the left. But they are all mixed up: fast and slow receivers both became stars, and both flopped.' }) },
  { skill: 'tables', kind: 'turn', data: true, task: 'Be the scout. This finds <b>slow stars</b>: 4.55 seconds or slower, but more than 8,000 career yards. Now find the <b>superstars</b>: change <code>8000</code> to <code>10000</code>. (<code>&gt;=</code> means "at least", <code>&gt;</code> means "more than".)',
    code: 'data[(data["forty"] >= 4.55) & (data["yards"] > 8000)][["player_name", "forty", "yards"]]',
    hints: ['Find the number <code>8000</code> in the line and type <code>10000</code> instead. No comma inside the number.'],
    check: async ({ code, q }) => /10000/.test(code)
      ? { ok: true, msg: `${(await q('len(data[(data["forty"] >= 4.55) & (data["yards"] > 10000)])'))} receivers were "slow" at the Combine and still gained over 10,000 yards. Catching, routes and smarts matter too. That is why teams hire analysts like you.` }
      : { msg: 'It still says 8000. Change it to <code>10000</code> to keep only the superstars.' } }
];
const REVIEW1 = [
  { skill: 'variables', q: 'Which line puts 18 into a locker called number?', opts: ['18 = number', 'number = 18', 'number == 18'], a: 1 },
  { skill: 'variables', q: 'What prints?', code: 'city = "Dallas"\nprint(city)', opts: ['city', '"Dallas"', 'Dallas'], a: 2 },
  { skill: 'math', q: 'What prints?', code: 'points = 2 * 6 + 3\nprint(points)', opts: ['15', '18', '263'], a: 0 },
  { skill: 'functions', q: 'Which line uses the machine and shows the answer?', opts: ['speed_mph = 4.5', 'print(speed_mph(4.5))', 'print("speed_mph(4.5)")'], a: 1 },
  { skill: 'tables', q: 'Which line shows the 5 slowest players?', code: 'fastest = combine.sort_values("forty")', opts: ['fastest.head(5)', 'len(fastest)', 'fastest.tail(5)'], a: 2 }
];

registerLab('nfl', 1, {
  title: 'Football Lab',
  skills: SKILLS1, cells: LAB1, review: REVIEW1,
  data: ['combine.csv', 'career_yards.csv'],
  setup: `
def _who(df, name):
    r = df[df["player_name"] == name].iloc[0]
    t = "he did not run the 40" if _pd.isna(r["forty"]) else f"he ran the 40 in {r['forty']} seconds"
    return f"{r['pos']} from {r['school']}, {int(r['season'])} Combine, {t}"
`
});
})();
