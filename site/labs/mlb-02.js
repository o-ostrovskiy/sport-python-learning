// Baseball Lab 2: Stat Detective. Same ideas and code as baseball/Baseball_Lab_2.ipynb. See labs/README.md for the format.
(() => {
const SKILLS = { print: 'print, quotes and variables', brackets: 'Square brackets and len( )', ask: '= and ==: finding a player', stats: 'max, mean, sorting and compare' };
const STAT_WORDS = { HR: 'home runs', SB: 'stolen bases', H: 'hits', SO: 'strikeouts', RBI: 'runs batted in', BB: 'walks', G: 'games', AB: 'at bats' };
const COMPARE = 'def compare(player1, player2, stat):\n    total1 = stats[stats["name"] == player1][stat].sum()\n    total2 = stats[stats["name"] == player2][stat].sum()\n    print(player1, ":", total1)\n    print(player2, ":", total2)\n    if total1 > total2:\n        print("Winner:", player1, "🏆")\n    else:\n        print("Winner:", player2, "🏆")';
const py = s => JSON.stringify(String(s));   // a safe Python text for a name the child typed
const CELLS = [
  { md: '<h2>Part 1. Python warm-up 🔥</h2>Today you are a detective. First, three things you must know. <code>print</code> is a <b>command</b>: it shows something on the screen. The <b>round brackets</b> <code>( )</code> hold what you hand to the command. And <b>quotes</b> <code>" "</code> mean: this is text, show it exactly as it is. A <b>variable</b> is a box with a name on it, and <code>=</code> means "put this into the box".' },
  { skill: 'print', kind: 'run', task: '<b>Guess first:</b> this box prints three lines. What will the last two say? Then run it.',
    code: 'print("Home run!")\n\nplayer = "Aaron Judge"\n\nprint(player)\nprint("player")',
    ok: '<code>print(player)</code> has no quotes, so Python opened the box: Aaron Judge. <code>print("player")</code> has quotes, so Python showed the word itself.' },
  { skill: 'print', kind: 'boom', expectError: 'NameError', task: 'What if we forget the quotes around a word? Run it. It shows a red error <b>on purpose</b>.',
    code: 'print(Homerun)',
    ok: 'A red error, just as planned! <code>NameError: name \'Homerun\' is not defined</code>. Without quotes, Python thinks <code>Homerun</code> is the name of a box, and there is no box called that. Text you want to show goes in quotes.' },
  { skill: 'print', kind: 'predict', task: 'Numbers need no quotes, and Python can do math with them. Text in quotes is just letters, even if the letters look like numbers. <b>Guess first:</b> the first line prints 150. What will the <b>second</b> line print? Type your guess, then run it.',
    code: 'print(100 + 50)\nprint("100" + "50")',
    check: ({ guess }) => ({ ok: true, missed: +guess !== 10050, msg: (+guess === 10050 ? 'You saw the trick! ' : `You guessed ${esc(String(guess))}, but Python says 10050. `) + 'The first line does math: 150. The second line just glues two pieces of text together: 10050. 😄' }) },
  { skill: 'print', kind: 'turn', task: 'A <b>comma</b> lets you show text and a variable together. Change the name and the number to <b>your</b> favorite player. The name goes in quotes, the number does not.',
    code: 'player = "Aaron Judge"   # change to your favorite player\nnumber = 99              # change to his number\n\nprint("My favorite player is", player, "and he wears number", number)',
    hints: ['Change only what is between the quotes on line 1, and the number on line 2.', 'Like this: <code>player = "Mookie Betts"</code> and <code>number = 50</code>.'],
    check: ({ g, out }) => {
      const p = g('player'), n = g('number');
      if (typeof p !== 'string') return { msg: 'The name is text, so it needs quotes: <code>player = "Mookie Betts"</code>.' };
      if (p === 'Aaron Judge') return { msg: 'It still says Aaron Judge. Type your own favorite player between the quotes.' };
      if (typeof n !== 'number') return { msg: 'The jersey number is a number, so no quotes: <code>number = 50</code>. In quotes it would be just letters, like <code>"100" + "50"</code>.' };
      if (!out.includes(p)) return { msg: 'Keep the <code>print</code> line so we can see your player.' };
      return { ok: true, msg: `${esc(p)}, number ${n}. Text in quotes, a number without. Warm-up done, Detective!` }; } },

  { md: '<h2>Part 2. Open the evidence box 📦</h2>Your evidence: <b>batters\' seasons from 1871 to 2026</b>. The first line, <code>import pandas as pd</code>, brings in a helper called <b>pandas</b> that works with tables. <code>as pd</code> gives it a short nickname. A <b>row</b> is one line across: one player in one season. A <b>column</b> is one kind of number going down, like <code>HR</code> (home runs).' },
  { skill: 'brackets', kind: 'run', data: true, task: 'Run it to load the table <code>stats</code> and see its first 5 rows. Python shows the last line of a box by itself, so a table needs no <code>print</code>.',
    code: 'import pandas as pd\n\nstats = pd.read_csv("mlb_batting.csv").convert_dtypes()\n\nstats[["name", "season", "team", "HR"]].head()',
    ok: 'The table has 12 columns, and the square brackets picked the 4 we care about. Why <b>double</b> brackets? The next play takes them apart.' },
  { skill: 'brackets', kind: 'run', data: true, task: 'Double brackets are <b>two different things</b>. The inside <code>[ ]</code> is a <b>list</b>: a few things in a row, with commas between them, like a lineup card. The outside <code>[ ]</code> means "pick from the table". Let\'s put the list in a box of its own.',
    code: 'my_columns = ["season", "team", "HR"]\n\nprint(my_columns)\nstats[my_columns].head(3)',
    ok: '<code>stats[my_columns]</code> does exactly the same as <code>stats[["season", "team", "HR"]]</code>: a list, sitting inside the "pick from the table" brackets. You will build your own lists in Lab 4.' },
  { skill: 'brackets', kind: 'boom', expectError: 'KeyError', data: true, task: 'What if we leave out the inside brackets? Run it. It shows a red error <b>on purpose</b>.',
    code: 'stats["season", "HR"]',
    ok: '<code>KeyError</code> means "I cannot find that name in the table". Without the list, Python looks for <b>one</b> column with a strange double name. So: one column, single brackets. Several columns, a list inside the brackets.' },
  { skill: 'brackets', kind: 'turn', data: true, task: 'How many rows are in the box? Python has a command that <b>counts</b> things. It is 3 letters long and short for "length". Write it in place of <code>___</code>.<br>🔎 <b>Google it:</b> <code>python how to count items in a list</code>',
    code: 'print("Rows in the box:", ___(stats))',
    hints: ['It is short for "length": three letters, starting with <code>l</code>.', 'The answer: <code>print("Rows in the box:", len(stats))</code>'],
    check: ({ code, out, q }) => {
      if (/\blen\s*\(\s*stats\s*\)/.test(code) && out.includes(String(q('len(stats)')))) return { ok: true, msg: `${q('len(stats)').toLocaleString('en-US')} rows! Every row is one player in one season. <code>len( )</code> counts anything: rows, letters, players in a list.` };
      if (!/\blen\b/.test(code)) return { msg: `That printed "${esc(out.replace('Rows in the box: ', '').slice(0, 40))}", not the number of rows. The counting command is 3 letters, short for "length".` };
      return { msg: 'Almost. The line should be <code>print("Rows in the box:", len(stats))</code>.' }; } },

  { md: '<h2>Part 3. Track down your player 🎯</h2><code>stats</code> has <b>every</b> player in it. To study one player, we need a smaller table with only his rows. For that you need two symbols that look almost the same: <code>=</code> <b>puts</b> something into a box, and <code>==</code> <b>asks a question</b>: "are these the same?"' },
  { skill: 'ask', kind: 'run', task: '<b>Guess first:</b> what will the two <code>print</code> lines show? Then run it.',
    code: 'team = "Yankees"           # one =  puts Yankees into the box\n\nprint(team == "Yankees")   # two == asks: is it the same as "Yankees"?\nprint(team == "Dodgers")   # two == asks: is it the same as "Dodgers"?',
    ok: '<code>True</code> means yes and <code>False</code> means no: Python\'s two answers, with capital letters and no quotes. Asking a question does not change the box: <code>team</code> still holds Yankees.' },
  { skill: 'ask', kind: 'run', data: true, task: 'Ask a question about a <b>column</b>, and Python asks it about <b>every row at once</b>. Step 1: <code>answers</code> gets a True or False for each row. Step 2: <code>stats[answers]</code> keeps only the rows that said True.',
    code: 'name = "Aaron Judge"\n\nanswers = stats["name"] == name\nprint(answers.head(3))\n\nseasons = stats[answers]\nprint("Rows asked:", len(answers))\nprint("Rows that said True:", len(seasons))\nseasons[["name", "season", "team"]].head()',
    ok: 'The first three rows are Hank Aaron, so they said False. Only 11 rows said True: Aaron Judge\'s 11 seasons. It works like cutting a roster: True makes the team, False is cut. (The <code>Name: ... dtype</code> line is a label from pandas. Skip it.)' },
  { skill: 'ask', kind: 'boom', expectError: 'SyntaxError', data: true, task: 'Programmers do both steps on one line: <code>stats[stats["name"] == name]</code>. Read it from the inside out: take the name column, ask every row "is this my player?", keep the rows that said True. What if we use one <code>=</code> by mistake? Run it: an error <b>on purpose</b>.',
    code: 'seasons = stats[stats["name"] = name]',
    ok: 'A <code>SyntaxError</code> means Python cannot understand how the line is written. It even asks: maybe you meant <code>==</code>? Inside those brackets Python needs a <b>question</b>, and one <code>=</code> is an order. Even grown-up programmers make this mistake.' },
  { skill: 'ask', kind: 'turn', data: true, task: 'Now your player, the short way. Change the name to <b>your favorite player</b>, in quotes, spelled exactly right. The last line uses a list to pick 7 of the 12 columns.',
    code: 'name = "Aaron Judge"   # change to your favorite player\n\nseasons = stats[stats["name"] == name]\n\nprint(name, "has", len(seasons), "rows: one for each season")\nseasons[["season", "team", "G", "H", "HR", "RBI", "SB"]]',
    hints: ['Change only the name between the quotes on line 1. Capital letters matter: <code>"Aaron Judge"</code> works, <code>"aaron judge"</code> does not.', 'Names have no accent marks, and sons are written the way MLB writes them: <code>"Julio Rodriguez"</code>, <code>"Bobby Witt Jr."</code>, <code>"Vladimir Guerrero Jr."</code>.'],
    check: ({ g, q }) => {
      const n = g('name');
      if (typeof n !== 'string') return { msg: 'The name is text, so it needs quotes: <code>name = "Juan Soto"</code>.' };
      if (n === 'Aaron Judge') return { msg: 'That is still Aaron Judge. Put your own player between the quotes on line 1.' };
      if (!q('len(seasons)')) { const near = q('_near(stats, name)');
        return { msg: `0 rows: no row said True for "${esc(n)}". ` + (near ? `Did you mean <code>"${esc(near)}"</code>? To Python, every letter and capital must match.`
          : 'Check the spelling and the capital letters. The box has hitters only, so a pitcher will not be there.') }; }
      return { ok: true, msg: `Case file opened: ${esc(n)}, ${q('len(seasons)')} season${q('len(seasons)') === 1 ? '' : 's'}. Now <code>seasons</code> is a small table, and every row in it is your player.` }; } },
  { skill: 'stats', kind: 'turn', data: true, task: '<b>His best season ever.</b> <code>seasons[stat]</code> is one column of your player\'s table. Every column has a command that finds its <b>biggest</b> number. It is 3 letters, the opposite of "min". Write it in place of <code>___</code>. The dot means "do this to that".<br>🔎 <b>Google it:</b> <code>pandas biggest value in a column</code>',
    code: 'stat = "HR"\n\nprint("Best season:", seasons[stat].___())',
    hints: ['The opposite of "min" (the smallest) is…?', 'The answer: <code>print("Best season:", seasons[stat].max())</code>'],
    check: ({ code, out, g, q }) => {
      const c = code.replace(/#.*/g, '');
      if (out.includes('<NA>') || out.includes('nan')) return { msg: '<code>&lt;NA&gt;</code> means <b>empty</b>: Python found no numbers to look at. The name in the play above is spelled differently from the table, or this stat was not counted in his day. Fix the name there, run that box again, then come back.' };
      if (/\.min\s*\(/.test(c)) return { msg: 'That is his <b>smallest</b> season. We want the biggest: the opposite of <code>min</code>.' };
      if (/\.sum\s*\(/.test(c)) return { msg: 'That adds up his whole career. We want only his one best season: 3 letters, the opposite of <code>min</code>.' };
      if (/\.mean\s*\(/.test(c)) return { msg: 'That is his average season. We want his best one: 3 letters, the opposite of <code>min</code>.' };
      if (!/seasons\[\s*stat\s*\]\.max\s*\(\s*\)/.test(c)) return { msg: 'The missing word has 3 letters and finds the biggest number in a column. Keep the dot before it and the <code>()</code> after it.' };
      const s = g('stat');
      return { ok: true, msg: `${esc(q('str(name)'))}'s best season: ${q('int(seasons[stat].max())')} ${STAT_WORDS[s] || esc(String(s))}. If your player is fast rather than strong, change <code>"HR"</code> to <code>"SB"</code> and run it again.` }; } },
  { skill: 'stats', kind: 'run', data: true, task: 'And a <b>normal</b> season? <code>.mean()</code> means "average": add up all his seasons and share them out equally. <code>round( )</code> cuts off the decimals. (A red <code>TypeError</code> here means <code>seasons</code> is empty: fix the name two plays up and run that box again.)',
    code: 'print("Average season:", round(seasons[stat].mean()))',
    ok: 'That is what he does in a normal year. A best season next to an average season tells you how special his big year was.' },

  { md: '<h2>Part 4. The biggest seasons in history 💥</h2><code>sort_values</code> puts all the rows in order, and <code>.head(5)</code> shows the top 5. <b>Wait, one <code>=</code> again?</b> Inside a command\'s round brackets, <code>=</code> chooses a <b>setting</b>, like flipping a switch. <i>Ascending</i> means "going up", from small to big. So <code>ascending=False</code> says: switch going up <b>off</b>. Biggest first!' },
  { skill: 'stats', kind: 'run', data: true, task: 'Run it. The list on the last line has <code>stat</code> with <b>no quotes</b>, so Python opens the box and uses the column name inside.',
    code: 'stat = "HR"\n\nbiggest = stats.sort_values(stat, ascending=False)\nbiggest[["name", "season", "team", stat]].head(5)',
    ok: 'Number 1 is Barry Bonds with 73 home runs in 2001. He also has the most home runs in a whole career. 👑' },
  { skill: 'stats', kind: 'turn', data: true, task: 'Change <b>only the first line</b>: replace <code>"HR"</code> with <code>"H"</code> (hits). Keep the quotes. <b>Guess first:</b> will the record be more or less than 250 hits?',
    code: 'stat = "HR"   # change this word\n\nbiggest = stats.sort_values(stat, ascending=False)\nbiggest[["name", "season", "team", stat]].head(5)',
    hints: ['Change only the letters between the quotes on line 1.', 'Line 1 should say <code>stat = "H"</code>. A capital H, in quotes.'],
    check: ({ g, q }) => {
      const s = g('stat');
      if (s === 'HR') return { msg: 'That is still the home run list. On line 1, change <code>"HR"</code> to <code>"H"</code>.' };
      if (!STAT_WORDS[s]) return { msg: `<code>"${esc(String(s))}"</code> is not a stat we can rank. Use capital letters, in quotes: <code>"H"</code>, <code>"RBI"</code>, <code>"SO"</code> or <code>"SB"</code>.` };
      if (!q('biggest.iloc[0][stat] == stats[stat].max()')) return { msg: 'Keep the two lines under the first one just as they were. They do the sorting.' };
      return { ok: true, msg: `The most ${STAT_WORDS[s]} in one season: ${esc(q('str(biggest.iloc[0]["name"])'))}, ${q('int(biggest.iloc[0][stat])')} in ${q('int(biggest.iloc[0]["season"])')}. One word changed, and you have a whole new record book. Try <code>"RBI"</code> and <code>"SO"</code> too.` }; } },

  { md: '<h2>Part 5. Who is better? ⚔️</h2>We built you a machine called <code>compare</code>. You give it two players and a stat. It adds up their <b>whole careers</b> and tells you who wins. <code>def</code> teaches Python the new command. The <code>total1</code> line is your trick from Part 3 plus <code>.sum()</code>, which adds up a column. <code>if</code> and <code>else</code> decide who wins. You will take it apart yourself in Lab 3.' },
  { skill: 'stats', kind: 'run', data: true, task: 'Run it to build the machine and use it. Inside the brackets of <code>compare( )</code>: first player, second player, the stat. Each one in quotes, with commas between them.',
    code: COMPARE + '\n\ncompare("Aaron Judge", "Shohei Ohtani", "HR")',
    ok: 'Aaron Judge 386, Shohei Ohtani 310. Why a machine? You write the long lines once, and after that one short line settles any argument.' },
  { skill: 'stats', kind: 'turn', data: true, task: '<b>Settle an argument.</b> Pick two players you would argue about, and a stat: <code>"HR"</code>, <code>"H"</code>, <code>"RBI"</code>, <code>"SB"</code>, <code>"BB"</code> or <code>"SO"</code>. Replace the names and the stat, keeping the quotes and the commas.',
    code: 'compare("Mookie Betts", "Juan Soto", "H")   # change the names and the stat',
    hints: ['Three things go inside the brackets, each in quotes, with commas between them.', 'Like this: <code>compare("Bryce Harper", "Mike Trout", "HR")</code>. Spell the names exactly, with capital letters.'],
    check: ({ code, q }) => {
      const m = code.replace(/#.*/g, '').match(/compare\(\s*(["'])(.*?)\1\s*,\s*(["'])(.*?)\3\s*,\s*(["'])(.*?)\5\s*\)/);
      if (!m) return { msg: 'Use the machine like this: <code>compare("Name One", "Name Two", "HR")</code>. Three things in quotes, with commas between them.' };
      const [p1, p2, s] = [m[2], m[4], m[6]];
      if (p1 === 'Mookie Betts' && p2 === 'Juan Soto') return { msg: 'That is still my matchup. Put your own two players inside the quotes.' };
      if (!STAT_WORDS[s]) return { msg: `<code>"${esc(s)}"</code> is not a stat the machine can add up. Use one of these: <code>"HR"</code>, <code>"H"</code>, <code>"RBI"</code>, <code>"SB"</code>, <code>"BB"</code>, <code>"SO"</code>.` };
      for (const p of [p1, p2]) if (!q(`int((stats["name"] == ${py(p)}).sum())`)) { const near = q(`_near(stats, ${py(p)})`);
        return { msg: `Careful! The machine found no rows for "${esc(p)}", so his total is 0 and the other player "wins" with no warning. ` + (near ? `Did you mean <code>"${esc(near)}"</code>?` : 'Check the spelling and the capital letters.') }; }
      if (p1 === p2) return { msg: 'That is the same player twice. Pick two different players to compare.' };
      const t1 = q(`int(stats[stats["name"] == ${py(p1)}][${py(s)}].sum())`), t2 = q(`int(stats[stats["name"] == ${py(p2)}][${py(s)}].sum())`);
      return { ok: true, msg: t1 === t2 ? `${t1} against ${t2}: a tie! But the machine still named a winner. That is a bug, and you will fix it in Lab 3.`
        : `Argument settled: ${esc(t1 > t2 ? p1 : p2)} wins, ${Math.max(t1, t2).toLocaleString('en-US')} ${STAT_WORDS[s]} to ${Math.min(t1, t2).toLocaleString('en-US')}. Case closed, Detective!` }; } }
];
const REVIEW = [
  { skill: 'print', q: 'What prints?', code: 'player = "Juan Soto"\nprint("player")', opts: ['Juan Soto', 'player', 'a red error'], a: 1 },
  { skill: 'print', q: 'What prints?', code: 'print("20" + "5")', opts: ['25', '205', 'a red error'], a: 1 },
  { skill: 'brackets', q: 'Which line shows two columns of the table?', opts: ['stats["season", "HR"]', 'stats[["season", "HR"]]', 'stats("season", "HR")'], a: 1 },
  { skill: 'ask', q: 'Which line ASKS a question?', opts: ['team = "Cubs"', 'team == "Cubs"', 'print("Cubs")'], a: 1 },
  { skill: 'ask', q: 'What does this keep?', code: 'stats[stats["name"] == "Mookie Betts"]', opts: ['only the name column', 'only the rows where the name is Mookie Betts', 'the first 5 rows'], a: 1 },
  { skill: 'stats', q: 'Which one finds a player\'s biggest home run season?', opts: ['seasons["HR"].max()', 'seasons["HR"].mean()', 'len(seasons)'], a: 0 }
];

registerLab('mlb', 2, {
  title: 'Stat Detective',
  skills: SKILLS, cells: CELLS, review: REVIEW,
  data: ['mlb_batting.csv'],
  setup: `
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
