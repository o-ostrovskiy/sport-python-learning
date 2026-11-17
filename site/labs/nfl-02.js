// One lab = one file. See labs/README.md for the format.
// Site version of football/Football_Lab_2.ipynb (Stat Detective). Data: data/nfl_games.csv (built by _build/build_site_nfl_games.py).
(() => {
const SKILLS2 = { text: 'print, quotes and lockers', tables: 'Picking from a table', filter: '= and ==: find your player', stats: 'Biggest, average, compare' };
const COMPARE = `def compare(player1, player2, stat):
    total1 = stats[stats["player_display_name"] == player1][stat].sum()
    total2 = stats[stats["player_display_name"] == player2][stat].sum()
    print(player1, ":", total1)
    print(player2, ":", total2)
    if total1 > total2:
        print("Winner:", player1, "🏆")
    else:
        print("Winner:", player2, "🏆")`;
const LAB2 = [
  { md: '<h2>Part 1. Python warm-up 🔥</h2>Today you are a detective. Your evidence: <b>every game the NFL\'s top players have played since 1999</b>. First a short warm-up, so you know what every symbol does.<br><br><code>print</code> is a <b>command</b>: it shows something on the screen. The <b>round brackets</b> <code>( )</code> hold what you hand to the command. The <b>quotes</b> <code>" "</code> mean: this is text, show it exactly as it is.' },
  { skill: 'text', kind: 'run', task: 'Press <b>Run</b> and watch what Python shows.',
    code: 'print("Touchdown!")',
    ok: 'Python showed the word, but not the quotes. Quotes only tell Python "this is text".' },
  { skill: 'text', kind: 'boom', expectError: 'NameError', task: 'What if we forget the quotes? Run it. It shows a red error <b>on purpose</b>.',
    code: 'print(Touchdown)',
    ok: 'A red error, just as planned! Without quotes, Python thinks <code>Touchdown</code> is the <b>name</b> of something it should already know. It knows nothing called that. So: text you want to show goes in quotes.' },
  { md: 'A <b>variable</b> is like a locker with a name tag. You put something inside, and later you ask for it by its name. The <code>=</code> sign means <b>"put this into the locker"</b>.' },
  { skill: 'text', kind: 'quiz', task: '<b>Guess first.</b> The first <code>print</code> shows <b>Travis Kelce</b>. What does the <b>second</b> one show?',
    code: 'player = "Travis Kelce"\n\nprint(player)\nprint("player")',
    opts: ['Travis Kelce', 'player', 'a red error'], a: 1,
    tips: ['Look at the quotes: <code>"player"</code>. With quotes, Python does not open the locker.', '', 'No error here. Text in quotes is always fine. Python just shows it.'],
    ok: 'Right. No quotes: Python opens the locker and shows Travis Kelce. With quotes: it shows the word itself.' },
  { skill: 'text', kind: 'predict', task: 'Numbers need <b>no quotes</b>, and Python can do math with them. But text in quotes is just letters, even if the letters look like numbers. <b>Guess first:</b> what will the <b>second</b> line print? Type a number, then run it.',
    code: 'print(100 + 50)\nprint("100" + "50")',
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 10050, msg: (+guess === 10050 ? 'You saw the trick! ' : `You guessed ${esc(guess)}, but Python says 10050. `) + 'The first line does math: 150. The second line just glues two pieces of text together: 100 and 50 make 10050.' }) },
  { skill: 'text', kind: 'turn', task: 'Change the name and the number to <b>your</b> favorite player. The name goes in quotes, the number does not. (The words after <code>#</code> are a note for people. Python skips them.)',
    code: 'player = "Travis Kelce"   # change to your favorite player\nnumber = 87               # change to his number\n\nprint("My favorite player is", player, "and he wears number", number)',
    hints: ['Change only what is between the quotes on line 1, and the number on line 2.', 'Like this: <code>player = "Josh Allen"</code> and <code>number = 17</code>.'],
    check: async ({ g, out }) => {
      const p = (await g('player')), n = (await g('number'));
      if (typeof p !== 'string') return { msg: 'The name is text, so it needs quotes: <code>player = "Josh Allen"</code>.' };
      if (p === 'Travis Kelce') return { msg: 'It still says Travis Kelce. Type your own favorite player between the quotes.' };
      if (typeof n !== 'number') return { msg: 'The jersey number is a number, so take the quotes off: <code>number = 17</code>.' };
      if (!out.includes(p)) return { msg: 'Keep the <code>print</code> line so we can see your player.' };
      return { ok: true, msg: `${esc(p)}, number ${n}. The commas in <code>print</code> let you show text and lockers together.` }; } },

  { md: '<h2>Part 2. Open the evidence box 📦</h2><code>import pandas as pd</code> brings in a helper called <b>pandas</b>. It lets Python work with tables, like a spreadsheet. <code>as pd</code> gives it a short nickname. <code>pd.read_csv( )</code> reads the table from a file.<br><br>The line after it keeps only regular season games, no playoffs. It looks strange, so we will take it apart in Part 3.' },
  { skill: 'tables', kind: 'run', data: true, task: 'Run it to open the box. The last line shows the first 5 rows, with only the 4 columns we care about.',
    code: 'import pandas as pd\n\nstats = pd.read_csv("nfl_games.csv", low_memory=False)\nstats = stats[stats["season_type"] == "REG"]\n\nstats[["player_display_name", "season", "opponent_team", "receiving_yards"]].head()',
    ok: 'That is the top of the table. A <b>row</b> is one line across: one player in one game. A <b>column</b> is one kind of number going down, like <code>receiving_yards</code>. Troy Aikman was a quarterback, so his catching yards are 0.' },
  { md: 'Square brackets <b>pick what you want</b> from the table. One column: <code>stats["receiving_yards"]</code>. Several columns: <code>stats[["season", "receiving_yards"]]</code>.<br><br>Double brackets are <b>two things</b>, one inside the other. The <b>outside</b> <code>[ ]</code> means "pick from the table". The <b>inside</b> <code>[ ]</code> is a <b>list</b>: a few things in a row with commas between them, like a roster on paper. You build your own lists in Lab 4.' },
  { skill: 'tables', kind: 'run', data: true, task: 'To see it, we put a list into a locker of its own. Run it.',
    code: 'my_columns = ["season", "opponent_team", "receiving_yards"]\n\nprint(my_columns)\nstats[my_columns].head(3)',
    ok: '<code>print</code> shows the list itself: three names. <code>stats[my_columns]</code> shows the table with only those three columns, and <code>.head(3)</code> keeps the first 3 rows. That is where double brackets come from: a list inside the brackets.' },
  { skill: 'tables', kind: 'boom', data: true, expectError: 'KeyError', task: 'What if we leave out the inside brackets? Run it. It shows a red error <b>on purpose</b>.',
    code: 'stats["season", "receiving_yards"]',
    ok: '<code>KeyError</code> means "I cannot find that name in the table". Without the list, Python looks for <b>one</b> column with that strange double name. So: one column, single brackets. Several columns, a list inside the brackets.' },
  { skill: 'tables', kind: 'turn', data: true, task: 'How many rows are in the box? Python has a command that <b>counts</b> things. It is 3 letters long and short for "length". Type it in place of <code>___</code>.',
    code: 'print("Rows in the box:", ___(stats))',
    hints: ['It is short for "length": the first 3 letters of that word.', 'The answer: <code>print("Rows in the box:", len(stats))</code>'],
    check: async ({ code, out, q }) => {
      if (!/\blen\s*\(/.test(code)) return { msg: 'That ran, but we want the counting command. It is 3 letters, short for "length".' };
      if (!out.includes(String((await q('len(stats)'))))) return { msg: 'Count the whole table: <code>len(stats)</code>, with <code>stats</code> inside the round brackets.' };
      return { ok: true, msg: `${(await q('len(stats)')).toLocaleString('en-US')} rows! Every row is one player in one game. That is a lot of games.` }; } },

  { md: '<h2>Part 3. Track down your player 🎯</h2>Right now <code>stats</code> has <b>every</b> player in it. We need a smaller table with only your player\'s rows. For that you need two symbols that look almost the same:<br><br><code>=</code> <b>puts</b> something into a locker.<br><code>==</code> <b>asks a question</b>: "are these the same?"' },
  { skill: 'filter', kind: 'run', task: '<b>Guess first:</b> what will the two <code>print</code> lines say? Then run it.',
    code: 'team = "Chiefs"           # one =  puts Chiefs into the locker\n\nprint(team == "Chiefs")   # two == asks: is it the same as "Chiefs"?\nprint(team == "Bills")    # two == asks: is it the same as "Bills"?',
    ok: '<code>True</code> means yes, <code>False</code> means no. They are Python\'s two answers. Asking a question does not change the locker: <code>team</code> still holds Chiefs.' },
  { md: 'Here is the cool part. When you ask a question about a <b>column</b>, Python asks it about <b>every row, all at once</b>. Then you hand those answers to the table in square brackets. It works like cutting a roster: rows that say <code>True</code> make the team, rows that say <code>False</code> are cut.' },
  { skill: 'filter', kind: 'run', data: true, task: 'Run it. Step 1 asks every row "is this Travis Kelce?". Step 2 keeps the rows that said <code>True</code>.',
    code: 'name = "Travis Kelce"\n\nanswers = stats["player_display_name"] == name   # step 1: ask every row\nprint("Rows asked:", len(answers))\n\ngames = stats[answers]                           # step 2: keep the True rows\nprint("Rows that said True:", len(games))\ngames[["player_display_name", "season", "opponent_team"]].head()',
    ok: 'Thousands of rows asked, and only 174 said True: Kelce\'s games. The <code>answers</code> line has both symbols. Python does the right side first (ask every row), then <code>=</code> puts the answers into the locker.' },
  { md: 'Programmers skip the <code>answers</code> locker and put the question straight inside the brackets:<br><br><code>games = stats[stats["player_display_name"] == name]</code><br><br>Read it <b>from the inside out</b>: take the column of names, ask every row "is this my player?", keep the rows that said <code>True</code>, and put that smaller table into <code>games</code>. The line in Part 2 with <code>"REG"</code> works the same way: it keeps only regular season rows.' },
  { skill: 'filter', kind: 'boom', data: true, expectError: 'SyntaxError', task: 'What if we use one <code>=</code> by mistake? Run it. It shows a red error <b>on purpose</b>.',
    code: 'games = stats[stats["player_display_name"] = name]',
    ok: 'A <code>SyntaxError</code> means Python cannot understand how the line is written. Inside those brackets it needs a <b>question</b>, so two <code>==</code>. One <code>=</code> is an order to fill a locker. Even grown-up programmers make this mistake.' },
  { skill: 'filter', kind: 'turn', data: true, task: 'Now <b>your</b> player. Change only the name: in quotes, spelled exactly right, with capital letters.',
    code: 'name = "Travis Kelce"   # change to your favorite player\n\ngames = stats[stats["player_display_name"] == name]\n\nprint(name, "played", len(games), "regular season games")\ngames[["season", "opponent_team", "receiving_yards", "rushing_yards", "passing_yards"]].head(10)',
    hints: ['Change only the name between the quotes on line 1.', 'Try a star like <code>"Justin Jefferson"</code>, <code>"Josh Allen"</code> or <code>"Saquon Barkley"</code>.'],
    check: async ({ g, q }) => {
      const n = (await g('name'));
      if (typeof n !== 'string') return { msg: 'The name is text, so it needs quotes: <code>name = "Josh Allen"</code>.' };
      if (n === 'Travis Kelce') return { msg: 'That is still Travis Kelce. Put your own player between the quotes.' };
      if (!(await q('len(games)'))) return { msg: `0 games for "${esc(n)}". Check the spelling: <code>"Travis Kelce"</code> works, <code>"travis kelce"</code> does not. Capital letters matter. (This box only has players with lots of yards, so try a star.)` };
      return { ok: true, msg: `Found him: ${esc(n)} played ${(await q('len(games)'))} regular season games through 2024. Every row in <code>games</code> is his.` }; } },
  { md: 'Two new things in the next box. <code>stat = "receiving_yards"</code> puts a column name into a locker, so <code>games[stat]</code> means the same as <code>games["receiving_yards"]</code>. To look at another stat, you change one line. And the <b>dot</b> means "do this to that": take this column and run a command on it.' },
  { skill: 'stats', kind: 'turn', data: true, task: 'His <b>best game ever</b>. Every column has a command that finds its <b>biggest</b> number. It is 3 letters, the opposite of "min". Type it in place of <code>___</code>. (Quarterback? Change <code>"receiving_yards"</code> to <code>"passing_yards"</code>. Running back? <code>"rushing_yards"</code>.)',
    code: 'stat = "receiving_yards"\n\nprint("Best game:", games[stat].___())\nprint("Average game:", round(games[stat].mean()), "yards")',
    hints: ['The opposite of "min" is…', 'The line should read: <code>print("Best game:", games[stat].max())</code>'],
    check: async ({ code, q }) => {
      if (/\.min\s*\(\s*\)/.test(code)) return { msg: '<code>.min()</code> finds the <b>smallest</b> number: his worst game. We want the opposite.' };
      if (/\]\s*\.sum\s*\(\s*\)/.test(code)) return { msg: '<code>.sum()</code> adds up <b>all</b> his games. We want only the biggest one. 3 letters, the opposite of "min".' };
      if (!/\.max\s*\(\s*\)/.test(code)) return { msg: 'We want the command for the biggest number: 3 letters, the opposite of "min". Keep the dot before it and the <code>()</code> after it.' };
      if (!(await q('len(games)'))) return { msg: 'The <code>games</code> table is empty. Go back one box and find your player first.' };
      if ((await q('int(games[stat].max())')) === 0) return { msg: 'His best is 0 yards in that column, so that is not his job. Quarterback? Change line 1 to <code>"passing_yards"</code>. Running back? <code>"rushing_yards"</code>.' };
      return { ok: true, msg: `His best game: ${(await q('int(games[stat].max())'))} yards. A normal game: about ${(await q('int(round(games[stat].mean()))'))}. <code>.mean()</code> is the <b>average</b>: add up all his games and share them out equally. <code>round( )</code> cuts off the decimals.` }; } },

  { md: '<h2>Part 4. Record games and big arguments 💥</h2><code>sort_values</code> puts all the rows in order. <code>ascending=False</code> means <b>biggest first</b>. Inside a command\'s round brackets, one <code>=</code> chooses a <b>setting</b>, like flipping a switch. <i>Ascending</i> means "going up", so <code>ascending=False</code> says: switch "going up" <b>off</b>.' },
  { skill: 'stats', kind: 'turn', data: true, task: 'Run it first: these are the 5 biggest receiving games since 1999. Then change <b>only the first line</b>: replace <code>"receiving_yards"</code> with <code>"passing_yards"</code> (keep the quotes) and run it again.',
    code: 'stat = "receiving_yards"   # change this word\n\nbiggest = stats.sort_values(stat, ascending=False)\nbiggest[["player_display_name", "season", "opponent_team", stat]].head(5)',
    hints: ['Only the word between the quotes on line 1 changes.', 'Line 1 should be: <code>stat = "passing_yards"</code>'],
    check: async ({ g, q }) => {
      const s = (await g('stat'));
      if (s === 'receiving_yards') return { msg: 'Number 1 is Calvin Johnson with 329 yards. His nickname is Megatron 🤖. Now change <code>"receiving_yards"</code> to <code>"passing_yards"</code> on line 1.' };
      if (s !== 'passing_yards') return { msg: `That shows the biggest games for ${esc(String(s))}. Cool! For this play, set line 1 to <code>stat = "passing_yards"</code>.` };
      return { ok: true, msg: `${(await q('biggest.iloc[0]["player_display_name"]'))} threw for ${(await q('int(biggest.iloc[0][stat])'))} yards in one game! You changed one word and got a whole new record book. Later, try <code>"rushing_yards"</code> and <code>"passing_tds"</code> too.` }; } },
  { md: 'Last case: <b>who is better?</b> We built you a machine called <code>compare</code>. You give it two players and a stat. It adds up every game since 1999 for each of them and says who wins.<br><br><code>def</code> teaches Python a new command. <code>player1</code>, <code>player2</code> and <code>stat</code> are empty lockers that get filled when you use the machine. <code>.sum()</code> adds up a column. <code>if</code> and <code>else</code> decide who wins. You will take this machine apart in Lab 3.' },
  { skill: 'stats', kind: 'run', data: true, task: 'Run it. The top part builds the machine. The last line <b>uses</b> it: first player, second player, the stat, each in quotes with commas between.',
    code: COMPARE + '\n\ncompare("Tom Brady", "Peyton Manning", "passing_tds")',
    ok: 'Brady wins, about 650 touchdown passes to 513. (The box starts in 1999, so Manning\'s first season, 1998, is not counted.) You wrote the long lines once, and now one short line does the work.' },
  { skill: 'stats', kind: 'turn', data: true, task: '<b>Settle an argument.</b> Change the two names, and the stat if you like: <code>"receiving_yards"</code>, <code>"rushing_yards"</code>, <code>"passing_yards"</code>, <code>"passing_tds"</code> or <code>"receiving_tds"</code>. Keep the quotes and the commas.',
    code: 'compare("Justin Jefferson", "Ja\'Marr Chase", "receiving_yards")   # change the names and the stat',
    hints: ['Change the names inside the quotes. Each name keeps its own quotes, with a comma after it.', 'For example: <code>compare("Josh Allen", "Patrick Mahomes", "passing_yards")</code>'],
    check: async ({ code, out }) => {
      if (!/compare\s*\(/.test(code)) return { msg: 'Use the machine: <code>compare("Name One", "Name Two", "stat")</code>.' };
      if (!out.includes('Winner')) return { msg: 'The machine did not finish. Give it three things in quotes with commas between: player, player, stat.' };
      if (out.includes('Justin Jefferson') && out.includes("Ja'Marr Chase")) return { msg: 'Jefferson wins that one, 7,432 yards to 5,425. Now put in two players <b>you</b> would argue about.' };
      const zero = out.split('\n').find(l => /:\s*0$/.test(l.trim()));
      if (zero) return { msg: `"${esc(zero.split(' :')[0])}" has a total of 0. Either the name is spelled wrong (capital letters matter), or he never had that stat. A 0 makes the other player "win" with no warning, so fix it.` };
      return { ok: true, msg: 'Argument settled, with evidence! Case closed, Detective. 🕵️' }; } }
];
const REVIEW2 = [
  { skill: 'text', q: 'What prints?', code: 'team = "Bills"\nprint("team")', opts: ['Bills', 'team', 'a red error'], a: 1 },
  { skill: 'text', q: 'What prints?', code: 'print("20" + "5")', opts: ['25', '205', 'a red error'], a: 1 },
  { skill: 'tables', q: 'Which line shows two columns of the table?', opts: ['stats["season", "week"]', 'stats[["season", "week"]]', 'stats("season", "week")'], a: 1 },
  { skill: 'filter', q: 'Which symbol ASKS "are these the same?"', opts: ['=', '==', '"'], a: 1 },
  { skill: 'filter', q: 'What does this line put into games?', code: 'games = stats[stats["player_display_name"] == name]', opts: ['only the rows of one player', 'only the column of names', 'True or False'], a: 0 },
  { skill: 'stats', q: 'Which one finds a player\'s best game?', opts: ['games[stat].mean()', 'len(games)', 'games[stat].max()'], a: 2 }
];

registerLab('nfl', 2, {
  title: 'Stat Detective',
  skills: SKILLS2, cells: LAB2, review: REVIEW2,
  data: ['nfl_games.csv']
});
})();
