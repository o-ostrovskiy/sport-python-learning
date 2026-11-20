// Baseball Lab 1. Same ideas and code as baseball/Baseball_Lab_1.ipynb. See labs/README.md for the format.
(() => {
const SKILLS = { variables: 'Variables and quotes', math: 'Math with variables', functions: 'Using a function', tables: 'Working with a table' };
const STAT_WORDS = { SB: 'stolen bases', H: 'hits', SO: 'strikeouts', RBI: 'runs batted in', BB: 'walks', G: 'games', AB: 'at bats' };
const BASES = 'singles = 2\ndoubles = 1\ntriples = 0\nhome_runs = 1\n\ntotal_bases = singles * 1 + doubles * 2 + triples * 3 + home_runs * 4\nprint("Total bases:", total_bases)';
const CELLS = [
  { md: '<h2>Mission 1. Warm-up 🔥</h2>Python remembers things in <b>variables</b>. A variable is like a locker with a name tag: you put something inside, and later you ask for it by name. The <code>=</code> sign means <b>"put this into the locker"</b>.' },
  { skill: 'variables', kind: 'run', task: 'Press <b>Run</b> and watch what Python shows.',
    code: 'player = "Aaron Judge"\nteam = "Yankees"\nnumber = 99\n\nprint(player, "plays for the", team, "and wears number", number)',
    ok: 'See that? <code>player</code> has no quotes, so Python opened the locker. <code>"plays for the"</code> has quotes, so Python showed those exact words.' },
  { skill: 'variables', kind: 'turn', task: 'Change the three values to <b>your</b> favorite player. Keep the quotes around the name and the team. (The text after <code>#</code> is a note for people. Python skips it.)',
    code: 'player = "Shohei Ohtani"   # change to your favorite player\nteam = "Dodgers"           # his team\nnumber = 17                # his number\n\nprint(player, "plays for the", team, "and wears number", number)',
    hints: ['Only change what is between the quotes, and the number.', 'Like this: <code>player = "Bobby Witt Jr."</code>. Then fix the team and the number.'],
    check: async ({ g, out }) => {
      const p = (await g('player')), n = (await g('number'));
      if (typeof p !== 'string') return { msg: 'The name must be text, so it needs quotes: <code>player = "Juan Soto"</code>.' };
      if (p === 'Shohei Ohtani') return { msg: 'It still says Shohei Ohtani. Type your own favorite player between the quotes.' };
      if (typeof n !== 'number') return { msg: 'The jersey number is a number, so no quotes: <code>number = 22</code>.' };
      if (!out.includes(p)) return { msg: 'Keep the <code>print</code> line so we can see your player.' };
      return { ok: true, msg: `${esc(p)}, number ${n}. Great pick! You just changed three lockers.` }; } },
  { skill: 'variables', kind: 'quiz', task: 'Quick one. What does this print?', code: 'team = "Yankees"\nprint("team")',
    opts: ['Yankees', 'team', '"team"'], a: 1,
    tips: ['Look closely: <code>"team"</code> has quotes here. With quotes Python does not open the locker.', '', 'Close! Python shows the word, but the quotes themselves never get printed.'],
    ok: 'Right. Quotes mean "these exact letters". No quotes means "open the locker".' },

  { md: '<h2>Mission 2. Total bases 🧮</h2>Python is also a calculator. Baseball has a stat called <b>total bases</b>: a single counts 1, a double 2, a triple 3 and a home run 4. In Python, <code>*</code> means <b>times</b>.' },
  { skill: 'math', kind: 'predict', task: '<b>Guess first!</b> This batter hit 2 singles, 1 double and 1 home run. How many total bases will Python print? Type your guess, then run it.',
    code: BASES,
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 8, msg: +guess === 8 ? 'You called it: 8! 2×1 + 1×2 + 0×3 + 1×4. Python did the math, then put the answer in <code>total_bases</code>.'
      : `You guessed ${esc(String(guess))}, Python says 8. Here is how: 2×1 = 2, plus 1×2 = 2, plus 0×3 = 0, plus 1×4 = 4. That is 8.` }) },
  { skill: 'math', kind: 'turn', task: 'A great day at the plate is <b>10 total bases or more</b>. Change the four numbers to give your batter a great day. Leave the <code>total_bases</code> line alone.',
    code: 'singles = 2     # change these numbers\ndoubles = 1\ntriples = 0\nhome_runs = 1\n\ntotal_bases = singles * 1 + doubles * 2 + triples * 3 + home_runs * 4\nprint("Total bases:", total_bases)',
    hints: ['Change only the numbers after the <code>=</code> signs in the first four lines.', 'A home run is worth the most: 4 bases. Try <code>home_runs = 2</code>.'],
    check: async ({ g, q, out }) => {
      const t = (await g('total_bases'));
      if (typeof t !== 'number') return { msg: 'Hits are numbers, so they need no quotes: <code>home_runs = 2</code>.' };
      if (!(await q('total_bases == singles * 1 + doubles * 2 + triples * 3 + home_runs * 4'))) return { msg: 'The math line changed. It should still say <code>total_bases = singles * 1 + doubles * 2 + triples * 3 + home_runs * 4</code>. Change only the four numbers above it.' };
      if (t === 8) return { msg: 'That is 8 total bases, the same as my batter. A great day is 10 or more: give your batter more hits.' };
      if (t < 10) return { msg: `That is ${t} total bases. A great day is 10 or more. Add another home run: each one is worth 4.` };
      if (!out.includes(String(t))) return { msg: 'Keep the <code>print</code> line so we can see the total.' };
      return { ok: true, msg: `${t} total bases! You changed the numbers, and the same math line gave a new answer. That is why we use variables.` }; } },

  { md: '<h2>Mission 3. Fastball timer ⏱️</h2>It is <b>60 feet 6 inches</b> (60.5 feet) from the pitcher\'s mound to home plate. Let\'s build a <b>machine</b> (programmers call it a <b>function</b>): you put a pitch speed in, and the time the ball needs comes out. <br><br>How to read it, line by line:<br>• <code>def time_to_plate(mph):</code> means "build a machine called <code>time_to_plate</code>". The speed goes into the slot called <code>mph</code>.<br>• The lines under it are pushed to the right. That is how Python knows they are the machine\'s insides.<br>• <code>return</code> sends the answer out of the machine.<br><br>You build a machine <b>once</b>. After that you just call it by its name, as many times as you like.' },
  { skill: 'functions', kind: 'run', task: 'Run it to build the machine and test it on a 100 mph fastball. (<code>/</code> means divide. A mile is 5,280 feet and an hour is 3,600 seconds. <code>round(..., 2)</code> keeps only 2 digits after the dot, like a scoreboard: 0.4125 becomes 0.41.)',
    code: 'def time_to_plate(mph):\n    feet_per_second = mph * 5280 / 3600\n    return round(60.5 / feet_per_second, 2)\n\nprint("A 100 mph fastball reaches home plate in", time_to_plate(100), "seconds")',
    ok: '0.41 seconds! A blink takes about a third of a second, so the batter has about one blink to decide. <code>time_to_plate(100)</code> fed 100 into the machine, and the answer came back out.' },
  { skill: 'functions', kind: 'turn', task: 'Your turn to use the machine. Aroldis Chapman threw a pitch at <b>105.8</b> mph in 2010.<br>The machine is <b>already built</b> in the box above, and Python remembers it. So you do <b>not</b> write <code>def</code> again. Just change the speed in the line below.',
    code: '# time_to_plate is already built above. Just use it by its name.\nprint("Aroldis Chapman:", time_to_plate(100), "seconds")   # change 100 to 105.8',
    hints: ['Find <code>100</code> inside the round brackets and type <code>105.8</code> instead.', 'The line should be: <code>print("Aroldis Chapman:", time_to_plate(105.8), "seconds")</code>'],
    check: async ({ out, code }) => {
      const c = code.replace(/#.*/g, '');
      if (/time_to_plate\s*\(/.test(c) && out.includes('0.39')) return { ok: true, msg: (/def\s/.test(c) ? 'Tip: you did not need to build the machine again, Python remembered it. ' : '') + '0.39 seconds! You used a function all by yourself. Try <code>80</code> (a curveball) or <code>45</code> (a 10-year-old\'s pitch) to see how much more time the batter gets.' };
      if (!/time_to_plate\s*\(/.test(c)) return { msg: 'Use our machine. Its name is <code>time_to_plate</code>, and the speed goes in the round brackets.' };
      if (!/print/.test(c)) return { msg: 'The machine made the answer, but nobody showed it! Wrap it in <code>print( )</code>.' };
      if (!/105\.8/.test(c)) return { msg: 'It still uses 100. Change <code>100</code> to Chapman\'s speed, <code>105.8</code>.' };
      return { msg: 'Almost. Try exactly <code>print("Aroldis Chapman:", time_to_plate(105.8), "seconds")</code>.' }; } },

  { md: '<h2>Mission 4. The secret MLB archive 📂</h2>Now we open the archive: <b>batters\' seasons from 1871 to 2026</b>. A helper called <b>pandas</b> lets Python work with tables, like a spreadsheet. We call it <code>pd</code> for short. The table is called <code>stats</code>. Its columns: <code>G</code> games, <code>AB</code> at bats (times he came up to hit), <code>H</code> hits, <code>HR</code> home runs, <code>RBI</code> runs batted in, <code>SB</code> stolen bases, <code>BB</code> walks, <code>SO</code> strikeouts.' },
  { skill: 'tables', kind: 'run', data: true, task: 'Run it to open the archive. <code>len( )</code> <b>counts</b> the rows, and <code>.head()</code> shows the <b>first 5</b>. One row is one player in one season. (<code>.convert_dtypes()</code> just keeps the numbers whole: 13, not 13.0.)',
    code: 'import pandas as pd\n\nstats = pd.read_csv("mlb_batting.csv").convert_dtypes()\n\nprint("Rows in the archive:", len(stats))\nstats.head()',
    ok: 'More than 44,000 seasons! The first rows are Hank Aaron, one row for each year he played. The <code>...</code> in the middle means some columns are hidden to fit the screen.' },
  { skill: 'tables', kind: 'turn', data: true, task: 'Find <b>your</b> player. Read it like a sentence: "from <code>stats</code>, keep the rows where <code>name</code> is the same as the name I picked". Two equals signs <code>==</code> ask <b>"is it the same?"</b> The double brackets at the end pick which columns to show.',
    code: 'name = "Aaron Judge"   # change this\n\nstats[stats["name"] == name][["name", "season", "team", "G", "H", "HR", "RBI", "SB", "SO"]]',
    hints: ['Change only the name between the quotes. Use the full name, with capital letters.', 'Names have no accent marks, and sons are written like MLB writes them: <code>"Julio Rodriguez"</code>, <code>"Vladimir Guerrero Jr."</code>, <code>"Ronald Acuna Jr."</code>.'],
    check: async ({ g, q }) => {
      const n = (await g('name'));
      if (typeof n !== 'string') return { msg: 'The name is text, so it needs quotes: <code>name = "Juan Soto"</code>.' };
      if (n === 'Aaron Judge') return { msg: 'That is still Aaron Judge. Put your own player between the quotes.' };
      if (!(await q('len(stats[stats["name"] == name])'))) { const near = (await q('_near(stats, name)'));
        return { msg: near ? `Nobody in the archive is called "${esc(n)}". Did you mean <code>"${esc(near)}"</code>? Every letter and capital must match.`
          : `Nobody in the archive is called "${esc(n)}". Check the spelling and the capital letters. If it is right, he may not be in our archive: it keeps the better-known hitters, so try a star. The archive has hitters only, so a pitcher will not be there: try another player.` }; }
      return { ok: true, msg: `Found him! ${esc(n)}: ${esc((await q('_who(stats, name)')))}` }; } },
  { skill: 'tables', kind: 'quiz', task: 'Quick one. What does this count?', code: 'len(stats)',
    opts: ['the columns in the table', 'the rows: one for each player season', 'the letters in the word stats'], a: 1,
    tips: ['Not the columns. <code>len</code> of a table counts how many rows it has.', '', '<code>stats</code> has no quotes, so it is the locker with our table inside, not a word.'],
    ok: 'Right: one row per player per season, so <code>len(stats)</code> is how many seasons we have.' },

  { md: '<h2>Mission 5. The biggest seasons ever ⚾💥</h2>Now we put every season in order. <code>stat = "HR"</code> puts a column name into a locker. <code>.sort_values(stat, ascending=False)</code> sorts the rows, and <code>ascending=False</code> means <b>biggest first</b>. <code>.head(10)</code> keeps the top 10.' },
  { skill: 'tables', kind: 'run', data: true, task: 'Run it to see the 10 biggest home run seasons of all time.',
    code: 'stat = "HR"\n\ntop = stats.sort_values(stat, ascending=False)\ntop[["name", "season", "team", stat]].head(10)',
    ok: 'Barry Bonds, 73 home runs in 2001: the record. Look at 1998: Mark McGwire and Sammy Sosa are both in the top 3, in the same summer!' },
  { skill: 'tables', kind: 'turn', data: true, task: 'Other records. <b>Guess first:</b> who stole the most bases in one season? Then change <b>only the first line</b>: <code>"HR"</code> to <code>"SB"</code>. Keep the quotes.',
    code: 'stat = "HR"   # try "SB", "H", "SO", "RBI"\n\ntop = stats.sort_values(stat, ascending=False)\ntop[["name", "season", "team", stat]].head(10)',
    hints: ['Change only the two letters between the quotes on line 1.', 'Line 1 should say <code>stat = "SB"</code>, with capital letters.'],
    check: async ({ g, q }) => {
      const s = (await g('stat'));
      if (s === 'HR') return { msg: 'That is still the home run list. Change <code>"HR"</code> on line 1 to <code>"SB"</code>.' };
      if (!STAT_WORDS[s]) return { msg: `<code>"${esc(String(s))}"</code> is not a stat we can rank. Use one of these, in capital letters: <code>"SB"</code>, <code>"H"</code>, <code>"SO"</code>, <code>"RBI"</code>.` };
      if (!(await q('top.iloc[0][stat] == stats[stat].max()'))) return { msg: 'Keep the two lines under the first one just as they were. They do the sorting.' };
      return { ok: true, msg: `The most ${STAT_WORDS[s]} in one season: ${esc((await q('str(top.iloc[0]["name"])')))}, ${(await q('int(top.iloc[0][stat])'))} in ${(await q('int(top.iloc[0]["season"])'))}.`
        + (s === 'SB' ? ' Four of the top ten are from 1887, when the rules were different. Baseball is old!' : ' You changed one locker, and the whole table changed.') }; } },
  { skill: 'tables', kind: 'turn', data: true, task: 'Now just one season. It starts with <b>2026</b>. Change the year to <b>1998</b>, or to the year you were born. Numbers do not need quotes.',
    code: 'year = 2026   # change the year\n\none_year = stats[stats["season"] == year]\none_year.sort_values("HR", ascending=False)[["name", "team", "HR"]].head(10)',
    hints: ['Change only the number on line 1.', 'Line 1 should look like this: <code>year = 1998</code>'],
    check: async ({ g, q }) => {
      const y = (await g('year'));
      if (typeof y !== 'number') return { msg: 'A year is a number, so it needs no quotes: <code>year = 1998</code>.' };
      if (y === 2026) return { msg: 'Still 2026. Change the number on line 1 to another year, like <code>1998</code>.' };
      if (!(await q('len(one_year)'))) return { msg: `The archive has no season ${y}. It goes from 1871 to 2026.` };
      const who = `${esc((await q('str(one_year.sort_values("HR", ascending=False).iloc[0]["name"])')))} with ${(await q('int(one_year["HR"].max())'))}`;
      return { ok: true, msg: y === 1998 ? `1998: Mark McGwire hit 70 and Sammy Sosa hit 66. Both beat the old record of 61 in the same summer!`
        : `In ${y} the home run leader was ${who}. One number changed, and you travelled through time.` }; } },

  { md: '<h2>Mission 6. THE BIG QUESTION 🔬</h2>Home run hitters swing hard. When you swing hard, you miss more. So <b>do the players who hit the most home runs also strike out the most?</b> Scientists guess <b>before</b> they look, so nobody can say "I knew it all along".' },
  { skill: 'tables', kind: 'quiz', vote: true, task: 'What do you think? There is no wrong answer here.',
    opts: ['Yes: more home runs, more strikeouts', 'No: great hitters almost never miss', 'Mostly yes, but the very best are different'],
    ok: 'Locked in! Now let us check it with the data.' },
  { skill: 'tables', kind: 'run', data: true, task: '👀 <b>Watch the pros.</b> One row is one season, but we need one row for a <b>whole career</b>. This box throws away seasons where strikeouts are empty, adds up each player\'s seasons, and keeps players with at least 7,000 at bats (long careers) (<code>&gt;=</code> means "at least").',
    code: 'counted = stats.dropna(subset=["SO"])\ncareers = counted.groupby(["playerID", "name"], as_index=False)[["AB", "HR", "SO"]].sum()\ncareers = careers[careers["AB"] >= 7000]\n\nprint("Players with at least 7,000 at bats:", len(careers))\ncareers.sort_values("HR", ascending=False)[["name", "HR", "SO"]].head(10)',
    ok: 'Barry Bonds on top with 762. Why <code>.dropna</code>? Long ago nobody wrote strikeouts down, so those boxes are empty. If we kept those seasons, a great old hitter would look like he never struck out!' },
  { skill: 'tables', kind: 'run', data: true, task: '👀 <b>The chart.</b> Every dot is one player. <b>Right = more home runs. Up = more strikeouts.</b> If home run hitters strike out the most, the dots should climb like a hill. <br><code>alpha=0.5</code> makes the dots see-through, so where many dots pile up it looks darker. The two <code>for</code> lines write the names of the top 8 home run hitters next to their dots (you will learn <code>for</code> in Lab 5).',
    code: 'import matplotlib.pyplot as plt\n\nplt.figure(figsize=(8, 4.5))\nplt.scatter(careers["HR"], careers["SO"], alpha=0.5)\n\nfor _, row in careers.sort_values("HR", ascending=False).head(8).iterrows():\n    plt.annotate(row["name"], (row["HR"], row["SO"]), fontsize=8)\n\nplt.xlabel("Career home runs   (right = more home runs)")\nplt.ylabel("Career strikeouts   (up = more strikeouts)")\nplt.title("Do home run hitters strike out more?")\nplt.show()',
    check: async () => ({ ok: true, msg: (myVote === 2 ? 'Good call! ' : myVote === 0 ? 'Mostly right! ' : 'Surprise! ') + 'The dots do climb like a hill: more home runs, more strikeouts. But look at the far right. Barry Bonds, Hank Aaron and Babe Ruth are <b>not</b> the highest dots: Jim Thome and Alex Rodriguez are higher.' }) },
  { skill: 'tables', kind: 'turn', data: true, task: 'Be the scout. This finds home run kings who did <b>not</b> strike out much: 500 home runs or more, but fewer than 1,450 strikeouts. Now find the rarest of all: change <code>1450</code> to <code>1000</code>. (<code>&lt;</code> means "less than", and <code>&amp;</code> means both must be true.)',
    code: 'careers[(careers["HR"] >= 500) & (careers["SO"] < 1450)][["name", "HR", "SO"]]',
    hints: ['Find the number <code>1450</code> in the line and type <code>1000</code> instead. No comma inside the number.'],
    check: async ({ code, q }) => {
      const c = code.replace(/#.*/g, '');
      if (/1450/.test(c)) return { msg: 'It still says 1450. Change it to <code>1000</code> to keep only the hitters who almost never missed.' };
      if (!/<\s*1000\b/.test(c) || !/>=\s*500\b/.test(c)) return { msg: 'Keep the line as it was and change only one number: <code>1450</code> becomes <code>1000</code>.' };
      return { ok: true, msg: `Only ${(await q('len(careers[(careers["HR"] >= 500) & (careers["SO"] < 1000)])'))} players ever did it: Mel Ott and Ted Williams. Hitting the ball far <b>without</b> missing much is super rare. That is what makes a legend, and you found them with one line.` }; } }
];
const REVIEW = [
  { skill: 'variables', q: 'Which line puts 99 into a locker called number?', opts: ['99 = number', 'number = 99', 'number == 99'], a: 1 },
  { skill: 'variables', q: 'What prints?', code: 'city = "Seattle"\nprint(city)', opts: ['city', '"Seattle"', 'Seattle'], a: 2 },
  { skill: 'math', q: 'What prints?', code: 'bases = 2 * 4 + 3\nprint(bases)', opts: ['11', '14', '243'], a: 0 },
  { skill: 'functions', q: 'Which line uses the machine and shows the answer?', opts: ['time_to_plate = 90', 'print(time_to_plate(90))', 'print("time_to_plate(90)")'], a: 1 },
  { skill: 'tables', q: 'Which line shows the biggest home run seasons first?', opts: ['stats.sort_values("HR", ascending=False)', 'stats.head("HR")', 'len(stats)'], a: 0 },
  { skill: 'tables', q: 'Why did we use .dropna(subset=["SO"]) before adding up careers?', opts: ['to sort the players', 'to skip seasons where nobody counted strikeouts', 'to make the chart bigger'], a: 1 }
];

registerLab('mlb', 1, {
  title: 'Baseball Lab',
  skills: SKILLS, cells: CELLS, review: REVIEW,
  data: ['mlb_batting.csv'],
  setup: `
def _who(df, name):
    r = df[df["name"] == name]
    seasons = "1 season" if len(r) == 1 else f"{len(r)} seasons"
    both = "Two players share this name! Together: " if r["playerID"].nunique() > 1 else ""
    return f"{both}{seasons}, from {int(r['season'].min())} to {int(r['season'].max())}, and {int(r['HR'].sum())} home runs in all."

def _near(df, name):
    import difflib
    names = df["name"].drop_duplicates()
    low = str(name).strip().lower()
    for want in (low, low + " jr."):
        same = names[names.str.lower() == want]
        if len(same):
            return str(same.iloc[0])
    close = difflib.get_close_matches(str(name), list(names), n=1, cutoff=0.8)
    return close[0] if close else ""
`
});
})();
