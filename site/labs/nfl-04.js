// One lab = one file. See labs/README.md for the format.
(() => {
const SKILLS4 = { lists: 'Making a list', index: 'Counting from 0', methods: 'append and in', tables: 'A list from the stats' };
const BOARD3 = '["Justin Jefferson", "Saquon Barkley", "Josh Allen"]';
const LAB4 = [
  { md: '<h2>Part 1. Your first list 📋</h2>On draft day, every team has a <b>draft board</b>: the players it wants, in order. Pick 1 at the top, then pick 2, and so on. In Python, a board like that is called a <b>list</b>.' },
  { skill: 'lists', kind: 'run', task: '<b>Guess first:</b> what will this box show? Say it out loud, then run it.',
    code: 'my_board = ["Justin Jefferson", "Saquon Barkley", "Josh Allen"]\nprint(my_board)',
    ok: 'That is a <b>list</b>: one box that holds many things, in order. Square brackets <code>[ ]</code> start and end it, and a <b>comma</b> sits between the players.' },
  { skill: 'lists', kind: 'predict', task: 'Why the commas? Look: this board has <b>no comma</b>. <b>Guess first:</b> how many players will Python count? Type a number, then run it.',
    code: 'no_comma = ["Justin Jefferson" "Saquon Barkley"]\nprint(no_comma)\nprint(len(no_comma))',
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 1, msg: (+guess === 1 ? 'You saw it coming! ' : `You guessed ${guess}, but Python says 1. `) + 'No red error, but it is <b>wrong</b>: Python glued the two names into one player. The comma is what keeps players apart.' }) },
  { skill: 'lists', kind: 'turn', task: 'Put <b>your own</b> top 3 players on the board. Change only the names inside the quotes, and keep the commas.',
    code: 'my_board = ["Justin Jefferson", "Saquon Barkley", "Josh Allen"]   # put your own 3 players here\nprint(my_board)\nprint("Players on my board:", len(my_board))',
    hints: ['Each name needs its own quotes, and there must be a comma between players.', 'It should look like this: <code>["Name One", "Name Two", "Name Three"]</code>.'],
    check: async ({ q }) => {
      if (!(await q('isinstance(my_board, list)'))) return { msg: 'The board must be a list. Keep the square brackets <code>[ ]</code> around the names.' };
      const n = (await q('len(my_board)'));
      if (n < 3) return { msg: `Python counts only ${n} player${n === 1 ? '' : 's'} on your board. A comma is missing between two names, so they got glued together.` };
      if (n > 3) return { msg: `That is ${n} players. For now we want exactly 3.` };
      if ((await q('my_board == ' + BOARD3))) return { msg: 'Those are still my three players. Put your own favorites inside the quotes.' };
      return { ok: true, msg: `${(await q('my_board[0]'))} at the top. Nice board! Three players, two commas, one list.` }; } },
  { md: '<h2>Part 2. Pick number... 0?! 🤯</h2>A bigger board. A list this long does not fit on one line, so we write <b>one player per line</b>. Python keeps reading until it finds the closing bracket <code>]</code>.' },
  { skill: 'index', kind: 'quiz', task: '<b>Guess first.</b> <code>my_board[1]</code> asks for one player from the board. Which one will it show?',
    code: 'my_board = [\n    "Justin Jefferson",\n    "Saquon Barkley",\n    "Josh Allen",\n    "Ja\'Marr Chase",\n    "Bijan Robinson",\n]\nprint(my_board[1])',
    opts: ['Justin Jefferson', 'Saquon Barkley', 'Josh Allen'], a: 1,
    tips: ['Almost everyone says that! But <b>Python counts from 0, not 1</b>. Justin is at spot 0. So who is at spot 1?', '', 'Not that far down. Python starts counting at 0, so spot 1 is the second player.'],
    ok: 'Yes! <b>Python counts from 0.</b> The number means "how many steps from the top". Justin is 0 steps, Saquon is 1 step down.' },
  { skill: 'index', kind: 'run', task: 'Run it to see your first three picks. Look at the numbers in the square brackets.',
    code: 'my_board = [\n    "Justin Jefferson",\n    "Saquon Barkley",\n    "Josh Allen",\n    "Ja\'Marr Chase",\n    "Bijan Robinson",\n]\nprint("Pick 1:", my_board[0])\nprint("Pick 2:", my_board[1])\nprint("Pick 3:", my_board[2])',
    ok: 'Pick 1 is spot 0, pick 2 is spot 1, pick 3 is spot 2. The spot is always one less than the pick.' },
  { skill: 'index', kind: 'boom', expectError: 'IndexError', task: 'There are 5 players, so the spots are 0, 1, 2, 3, 4. What if we ask for spot <b>5</b>? Run it. It shows a red error <b>on purpose</b>.',
    code: 'print(my_board[5])',
    ok: 'A red error, just as planned! <code>IndexError: list index out of range</code>. <b>Index</b> is Python\'s word for the spot number. There is no spot 5: the last spot is always one less than <code>len( )</code>.' },
  { skill: 'index', kind: 'turn', task: 'Show your <b>5th</b> pick: change the <code>0</code> to the right number. Careful, it is not 5!',
    code: 'print("Pick 5:", my_board[0])   # change the 0',
    hints: ['Count the spots from the top, starting at 0: Justin is 0, Saquon is 1…', 'The last spot is one less than the number of players. 5 players, so spot…?'],
    check: async ({ out }) => out.includes('Bijan Robinson') ? { ok: true, msg: 'Bijan Robinson! The 5th pick lives at spot 4. You are counting like Python now.' }
      : { msg: `That shows ${esc(out.replace('Pick 5: ', ''))}. We want the last player on the board. Count from 0 at the top.` } },
  { md: '<h2>Part 3. Draft day 📞</h2>You found a new player you like. <code>.append( )</code> means <b>"add to the end"</b>. The dot means "do this to that": <code>my_board.append("Lamar Jackson")</code> = "to <code>my_board</code>, add Lamar Jackson at the end".' },
  { skill: 'methods', kind: 'run', task: '<b>Guess first:</b> where on the board will Lamar go? Then run it.',
    code: 'my_board = ["Justin Jefferson", "Saquon Barkley", "Josh Allen"]\nmy_board.append("Lamar Jackson")\nprint(my_board)\nprint("Players on my board:", len(my_board))',
    ok: 'Lamar went to the bottom, and the board grew from 3 to 4. The <code>append</code> line changes the list quietly; <code>print</code> shows it.' },
  { skill: 'methods', kind: 'run', task: '<code>in</code> asks a yes-or-no question: "is he <b>in</b> the list?" <b>Guess first:</b> what will each of the three lines say?',
    code: 'my_board = ["Justin Jefferson", "Saquon Barkley", "Josh Allen"]\n\nprint("Josh Allen" in my_board)\nprint("Patrick Mahomes" in my_board)\nprint("josh allen" in my_board)',
    ok: 'True, False… and False! To Python a small <code>j</code> and a big <code>J</code> are different letters. <code>in</code> only says True when the name is spelled <b>exactly</b> the same.' },
  { skill: 'methods', kind: 'quiz', task: 'Quick one. What does this print?', code: 'my_board = ["Justin Jefferson", "Saquon Barkley", "Josh Allen"]\nprint("Saquon" in my_board)',
    opts: ['True', 'False', 'Saquon Barkley'], a: 1,
    tips: ['Look closely: the board has <code>"Saquon Barkley"</code>, not just <code>"Saquon"</code>. The whole name must match.', '', '<code>in</code> never gives back a name. It only answers True or False.'],
    ok: 'Right. <code>"Saquon"</code> is not the same as <code>"Saquon Barkley"</code>, so the answer is False.' },
  { skill: 'methods', kind: 'turn', task: 'The <b>draft-day machine</b>: if the player is already on the board, say so; otherwise, add him. Two words are missing. In the <code>if</code> line: the 2-letter word that asks "is it inside the list?". Under <code>else</code>: the 6-letter word that adds a player to the end.',
    code: 'my_board = ["Justin Jefferson", "Saquon Barkley", "Josh Allen"]\nplayer = "Patrick Mahomes"   # change to any player\n\nif player ___ my_board:\n    print(player, "is already on my board ✅")\nelse:\n    my_board.___(player)\n    print("Added", player, "to the end of my board 📋")\n\nprint(my_board)',
    hints: ['You used both words in the last few plays. One asks a True or False question, one adds to the end.', 'The <code>if</code> line should read: <code>if player in my_board:</code>', 'Under else: <code>my_board.append(player)</code>'],
    check: async ({ code, q }) => {
      if (!/if\s+player\s+in\s+my_board\s*:/.test(code)) return { msg: 'Check the <code>if</code> line. The missing word asks "is it inside the list?" and has 2 letters.' };
      if (!/my_board\.append\(\s*player\s*\)/.test(code)) return { msg: 'Check the line under <code>else</code>. The missing word adds a player to the end of a list and has 6 letters.' };
      if (!(await q('player in my_board'))) return { msg: 'The player is still not on the board. Check the line under <code>else</code>.' };
      return { ok: true, msg: 'The machine works! Now change <code>player</code> to <code>"Josh Allen"</code> and run it again: nobody gets added, because he is already there. That is how NFL teams avoid picking the same player twice.' }; } },
  { md: '<h2>Part 4. Last season\'s top 5 📊</h2>NFL teams build their boards from stats. This is a <b>new file</b>: one row is <b>one whole season</b> of one player, already added up for you.' },
  { skill: 'tables', kind: 'run', data: true, task: 'Run it to load the seasons. <code>.max()</code> finds the biggest number in the <code>season</code> column, so <code>newest</code> is the newest season in the data.',
    code: 'import pandas as pd\n\nseasons = pd.read_csv("player_stats_season.csv", low_memory=False)\nseasons = seasons[seasons["season_type"] == "REG"]\nnewest = seasons["season"].max()\nprint("Ready!", len(seasons), "seasons loaded. The newest season is", newest)',
    ok: 'Loaded! Thousands of player seasons, ready for scouting.' },
  { skill: 'tables', kind: 'run', data: true, task: 'Three steps you know from Lab 2: keep only the newest season, sort by receiving yards with the <b>most</b> first, then take the top 5 names.',
    code: 'last = seasons[seasons["season"] == newest]\nbest = last.sort_values("receiving_yards", ascending=False)\nnames = best["player_display_name"].head(5)\nprint(names)',
    ok: 'There are the top 5 receivers. The numbers on the left and the last line are the table\'s own notes: ignore them. <code>names</code> is still a piece of the table, not a list yet.' },
  { skill: 'tables', kind: 'run', data: true, task: 'One new command turns it into a proper list: <code>list( )</code>. <b>Guess first:</b> who is number 1? And is Justin Jefferson in the top 5?',
    code: 'top5 = list(names)\nprint(top5)\n\nprint("Number 1:", top5[0])\nprint("Is Justin Jefferson in the top 5?", "Justin Jefferson" in top5)',
    ok: 'Square brackets, commas, quotes: it is a list now! So <code>[0]</code> and <code>in</code> work on it, just like on your own board.' },
  { skill: 'tables', kind: 'turn', data: true, task: '<b>Your final draft board.</b> It starts with last season\'s top 5. Add <b>two</b> players of your own: change only the two names in the <code>append</code> lines.',
    code: 'my_board = list(names)              # start with last season\'s top 5\nmy_board.append("Travis Kelce")     # change to your pick\nmy_board.append("Bijan Robinson")   # change to your pick\n\nprint(my_board)\nprint("Players on my board:", len(my_board))\nprint("My first pick:", my_board[0])\nprint("My last pick:", my_board[len(my_board) - 1])',
    hints: ['Change the names inside the quotes on lines 2 and 3. Keep <code>.append( )</code> and the quotes.'],
    check: async ({ q }) => {
      const n = (await q('len(my_board)'));
      if (n !== 7) return { msg: `Your board has ${n} players. We want 7: the top 5 plus your 2. Keep both <code>append</code> lines.` };
      if ((await q('my_board[5] == "Travis Kelce" and my_board[6] == "Bijan Robinson"'))) return { msg: 'Those two are still my picks. Put your own two players in the <code>append</code> lines.' };
      return { ok: true, msg: `Seven players, and your last pick is ${esc(String((await q('my_board[6]'))))}, at spot 6: one less than <code>len( )</code>. Great draft, GM!` }; } }
];
const REVIEW4 = [
  { skill: 'lists', q: 'Which one is a correct list of two players?', opts: ['["Josh Allen" "Saquon Barkley"]', '["Josh Allen", "Saquon Barkley"]', '"Josh Allen", "Saquon Barkley"'], a: 1 },
  { skill: 'index', q: 'What prints?', code: 'board = ["Chase", "Jefferson", "London"]\nprint(board[2])', opts: ['Jefferson', 'London', 'a red error'], a: 1 },
  { skill: 'index', q: 'A board has 4 players. What is the number of the LAST spot?', opts: ['4', '3', '0'], a: 1 },
  { skill: 'methods', q: 'Which line adds Lamar Jackson to the end of the board?', opts: ['board.append("Lamar Jackson")', 'board + "Lamar Jackson"', 'board["Lamar Jackson"]'], a: 0 },
  { skill: 'methods', q: 'What prints?', code: 'board = ["Josh Allen"]\nprint("josh allen" in board)', opts: ['True', 'False', 'Josh Allen'], a: 1 },
  { skill: 'tables', q: 'names is a column from the table. What does list(names) do?', opts: ['counts the names', 'sorts the names', 'turns them into a proper list'], a: 2 }
];

registerLab('nfl', 4, {
  title: 'My Draft Board',
  skills: SKILLS4, cells: LAB4, review: REVIEW4,
  data: ['player_stats_season.csv']
});
})();
