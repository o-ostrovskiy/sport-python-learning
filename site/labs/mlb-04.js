// Baseball Lab 4: My Lineup Card. Same ideas and code as baseball/Baseball_Lab_4.ipynb. See labs/README.md for the format.
(() => {
const SKILLS = { lists: 'Making a list', index: 'Counting from 0', methods: 'append and in', tables: 'A list from real stats' };
const TEAM3 = '["Aaron Judge", "Shohei Ohtani", "Cal Raleigh"]';
const LINEUP = 'lineup = [\n    "Shohei Ohtani",\n    "Aaron Judge",\n    "Juan Soto",\n    "Cal Raleigh",\n    "Bobby Witt Jr.",\n    "Jose Ramirez",\n    "Kyle Schwarber",\n    "Julio Rodriguez",\n    "Pete Alonso",\n]\n';
const CELLS = [
  { md: '<h2>Part 1. Your first list 📋</h2>Before every game, the manager writes a <b>lineup card</b>: the batters, in the order they will hit. In Python, a card like that is called a <b>list</b>.' },
  { skill: 'lists', kind: 'run', task: '<b>Guess first:</b> what will this box show? Say it out loud, then run it.',
    code: 'my_team = ["Aaron Judge", "Shohei Ohtani", "Cal Raleigh"]\nprint(my_team)',
    ok: 'That is a <b>list</b>: one box that holds many things, in order. Square brackets <code>[ ]</code> start and end it, and a <b>comma</b> sits between the players.' },
  { skill: 'lists', kind: 'predict', task: 'Why the commas? Look: this team has <b>no comma</b>. <b>Guess first:</b> how many players will Python count? Type a number, then run it.',
    code: 'no_comma = ["Aaron Judge" "Shohei Ohtani"]\nprint(no_comma)\nprint(len(no_comma))',
    check: ({ guess }) => ({ ok: true, missed: +guess !== 1, msg: (+guess === 1 ? 'You saw it coming! ' : `You guessed ${esc(String(guess))}, but Python says 1. `) + 'No red error, but it is <b>wrong</b>: Python glued the two names into one player. The comma is what keeps players apart.' }) },
  { skill: 'lists', kind: 'turn', task: 'Put <b>your own</b> 3 favorite hitters on the team. Change only the names inside the quotes, and keep the commas.',
    code: 'my_team = ["Aaron Judge", "Shohei Ohtani", "Cal Raleigh"]   # put your own 3 players here\nprint(my_team)\nprint("Players on my team:", len(my_team))',
    hints: ['Each name needs its own quotes, and there must be a comma between players.', 'It should look like this: <code>["Name One", "Name Two", "Name Three"]</code>.'],
    check: ({ q }) => {
      if (!q('isinstance(my_team, list)')) return { msg: 'The team must be a list. Keep the square brackets <code>[ ]</code> around the names.' };
      const n = q('len(my_team)');
      if (n < 3) return { msg: `Python counts only ${n} player${n === 1 ? '' : 's'} on your team. A comma is missing between two names, so they got glued together.` };
      if (n > 3) return { msg: `That is ${n} players. For now we want exactly 3.` };
      if (q('my_team == ' + TEAM3)) return { msg: 'Those are still my three players. Put your own favorites inside the quotes.' };
      return { ok: true, msg: `${esc(String(q('str(my_team[0])')))} at the top. Nice team! Three players, two commas, one list.` }; } },

  { md: '<h2>Part 2. Batting… 0th?! 🤯</h2>Now a real lineup: 9 batters. A list this long does not fit on one line, so we write <b>one player per line</b>. Python keeps reading until it finds the closing bracket <code>]</code>. The first batter is the <b>leadoff</b> hitter.' },
  { skill: 'index', kind: 'quiz', task: '<b>Guess first.</b> <code>lineup[1]</code> asks for one batter from the lineup. Which one will it show?',
    code: LINEUP + 'print(lineup[1])',
    opts: ['Shohei Ohtani', 'Aaron Judge', 'Juan Soto'], a: 1,
    tips: ['Almost everyone says that! But <b>Python counts from 0, not 1</b>. Ohtani is at spot 0. So who is at spot 1?', '', 'Not that far down. Python starts counting at 0, so spot 1 is the second batter.'],
    ok: 'Yes! <b>Python counts from 0.</b> The number means "how many steps from the top". Ohtani is 0 steps, Judge is 1 step down.' },
  { skill: 'index', kind: 'run', task: 'Run it to see the top of the order. Look at the numbers in the square brackets.',
    code: LINEUP + 'print("Leadoff:", lineup[0])\nprint("Batting 2nd:", lineup[1])\nprint("Batting 3rd:", lineup[2])',
    ok: 'The leadoff hitter is spot 0, the 2nd batter is spot 1, the 3rd is spot 2. The spot is always one less than the batting order.' },
  { skill: 'index', kind: 'boom', expectError: 'IndexError', task: 'There are 9 batters, so the spots are 0 to 8. What if we ask for spot <b>9</b>? Run it. It shows a red error <b>on purpose</b>.',
    code: 'print(lineup[9])',
    ok: 'A red error, just as planned! <code>IndexError: list index out of range</code>. <b>Index</b> is Python\'s word for the spot number. There is no spot 9: the last spot is always one less than <code>len( )</code>.' },
  { skill: 'index', kind: 'turn', task: 'Who hits <b>cleanup</b> (4th)? Change the <code>0</code> to the right number. Careful, it is not 4!',
    code: 'print("Cleanup hitter:", lineup[0])   # change the 0',
    hints: ['Count the spots from the top, starting at 0: Ohtani is 0, Judge is 1…', 'The spot is one less than the batting order. 4th batter, so spot…?'],
    check: ({ out }) => out.includes('Cal Raleigh') ? { ok: true, msg: 'Cal Raleigh! The 4th batter lives at spot 3. You are counting like Python now.' }
      : { msg: `That shows ${esc(out.replace('Cleanup hitter: ', ''))}. We want the 4th batter. Count from 0 at the top.` } },

  { md: '<h2>Part 3. Trade deadline 📞</h2>Your team just traded for a new player. <code>.append( )</code> means <b>"add to the end"</b>. The dot means "do this to that": <code>my_team.append("Juan Soto")</code> = "to <code>my_team</code>, add Juan Soto at the end".' },
  { skill: 'methods', kind: 'run', task: '<b>Guess first:</b> where on the list will Soto go? Then run it.',
    code: 'my_team = ["Aaron Judge", "Shohei Ohtani", "Cal Raleigh"]\nmy_team.append("Juan Soto")\nprint(my_team)\nprint("Players on my team:", len(my_team))',
    ok: 'Soto went to the bottom, and the team grew from 3 to 4. The <code>append</code> line changes the list quietly; <code>print</code> shows it.' },
  { skill: 'methods', kind: 'run', task: '<code>in</code> asks a yes-or-no question: "is he <b>in</b> the list?" <b>Guess first:</b> what will each of the three lines say?',
    code: 'my_team = ["Aaron Judge", "Shohei Ohtani", "Cal Raleigh"]\n\nprint("Aaron Judge" in my_team)\nprint("Mookie Betts" in my_team)\nprint("aaron judge" in my_team)',
    ok: 'True, False… and False! To Python a small <code>a</code> and a big <code>A</code> are different letters. <code>in</code> only says True when the name is spelled <b>exactly</b> the same.' },
  { skill: 'methods', kind: 'quiz', task: 'Quick one. What does this print?', code: 'my_team = ["Aaron Judge", "Shohei Ohtani", "Cal Raleigh"]\nprint("Ohtani" in my_team)',
    opts: ['True', 'False', 'Shohei Ohtani'], a: 1,
    tips: ['Look closely: the team has <code>"Shohei Ohtani"</code>, not just <code>"Ohtani"</code>. The whole name must match.', '', '<code>in</code> never gives back a name. It only answers True or False.'],
    ok: 'Right. <code>"Ohtani"</code> is not the same as <code>"Shohei Ohtani"</code>, so the answer is False.' },
  { skill: 'methods', kind: 'turn', task: 'The <b>trade machine</b>: if the player is already on the team, say so; otherwise, trade for him. Two words are missing. In the <code>if</code> line: the 2-letter word that asks "is it inside the list?". Under <code>else</code>: the 6-letter word that adds a player to the end.<br>🔎 <b>Google it:</b> <code>python check if item in list</code>',
    code: 'my_team = ["Aaron Judge", "Shohei Ohtani", "Cal Raleigh"]\nplayer = "Mookie Betts"   # change to any player\n\nif player ___ my_team:\n    print(player, "is already on my team ✅")\nelse:\n    my_team.___(player)\n    print("Traded for", player, "📞")\n\nprint(my_team)',
    hints: ['You used both words in the last few plays. One asks a True or False question, one adds to the end.', 'The <code>if</code> line should read: <code>if player in my_team:</code>', 'Under else: <code>my_team.append(player)</code>'],
    check: ({ code, q }) => {
      if (!/if\s+player\s+in\s+my_team\s*:/.test(code)) return { msg: 'Check the <code>if</code> line. The missing word asks "is it inside the list?" and has 2 letters.' };
      if (!/my_team\.append\(\s*player\s*\)/.test(code)) return { msg: 'Check the line under <code>else</code>. The missing word adds a player to the end of a list and has 6 letters.' };
      if (!q('player in my_team')) return { msg: 'The player is still not on the team. Check the line under <code>else</code>.' };
      return { ok: true, msg: 'The machine works! Now change <code>player</code> to <code>"Aaron Judge"</code> and run it again: nobody gets added, because he is already there. No team needs two Aaron Judges!' }; } },

  { md: '<h2>Part 4. The real top 5 📊</h2>Real teams build their rosters from stats. This is the table from Lab 2: one row is one player\'s <b>whole season</b>, and <code>HR</code> is home runs.' },
  { skill: 'tables', kind: 'run', data: true, task: 'Run it to load the seasons. <code>.max()</code> finds the biggest number in the <code>season</code> column, so <code>newest</code> is the newest season in the data.',
    code: 'import pandas as pd\n\nstats = pd.read_csv("mlb_batting.csv").convert_dtypes()\nnewest = stats["season"].max()\nprint("Ready!", len(stats), "seasons loaded. The newest season is", newest)',
    ok: 'Loaded! Thousands of player seasons, ready for your front office.' },
  { skill: 'tables', kind: 'run', data: true, task: 'Three steps you know from Lab 2: keep only the newest season, sort by home runs with the <b>most</b> first, then take the top 5 names.',
    code: 'last = stats[stats["season"] == newest]\nbest = last.sort_values("HR", ascending=False)\nnames = best["name"].head(5)\nprint(names)',
    ok: 'There are the top 5 home run hitters. The numbers on the left and the last line are the table\'s own notes: ignore them. <code>names</code> is still a piece of the table, not a list yet.' },
  { skill: 'tables', kind: 'run', data: true, task: 'One new command turns it into a real list: <code>list( )</code>. <b>Guess first:</b> is Aaron Judge in the top 5? The answer may surprise you.',
    code: 'top5 = list(names)\nprint(top5)\n\nprint("Number 1:", top5[0])\nprint("Is Aaron Judge in the top 5?", "Aaron Judge" in top5)',
    ok: 'Square brackets, commas, quotes: it is a list now, so <code>[0]</code> and <code>in</code> work on it. No Judge this time! And in 2026 Kyle Schwarber and Pete Crow-Armstrong both hit 45: a tie, so Python just puts one of them first.' },
  { skill: 'tables', kind: 'turn', data: true, task: '<b>Your final team.</b> It starts with the real top 5. Add <b>two</b> players of your own: change only the two names in the <code>append</code> lines.',
    code: 'my_team = list(names)               # start with the real top 5\nmy_team.append("Aaron Judge")       # change to your pick\nmy_team.append("Shohei Ohtani")     # change to your pick\n\nprint(my_team)\nprint("Players on my team:", len(my_team))\nprint("First on my list:", my_team[0])\nprint("Last on my list:", my_team[len(my_team) - 1])',
    hints: ['Change the names inside the quotes on lines 2 and 3. Keep <code>.append( )</code> and the quotes.'],
    check: ({ q }) => {
      const n = q('len(my_team)');
      if (n !== 7) return { msg: `Your team has ${n} players. We want 7: the top 5 plus your 2. Keep both <code>append</code> lines.` };
      if (q('my_team[5] == "Aaron Judge" and my_team[6] == "Shohei Ohtani"')) return { msg: 'Those two are still my picks. Put your own two players in the <code>append</code> lines.' };
      return { ok: true, msg: `Seven players, and your last one is ${esc(String(q('str(my_team[6])')))}, at spot 6: one less than <code>len( )</code>. Great lineup, Manager!` }; } }
];
const REVIEW = [
  { skill: 'lists', q: 'Which one is a correct list of two players?', opts: ['["Juan Soto" "Pete Alonso"]', '["Juan Soto", "Pete Alonso"]', '"Juan Soto", "Pete Alonso"'], a: 1 },
  { skill: 'index', q: 'What prints?', code: 'lineup = ["Ohtani", "Judge", "Soto"]\nprint(lineup[2])', opts: ['Judge', 'Soto', 'a red error'], a: 1 },
  { skill: 'index', q: 'A lineup has 9 batters. What is the number of the LAST spot?', opts: ['9', '8', '0'], a: 1 },
  { skill: 'methods', q: 'Which line adds Juan Soto to the end of the team?', opts: ['team.append("Juan Soto")', 'team + "Juan Soto"', 'team["Juan Soto"]'], a: 0 },
  { skill: 'methods', q: 'What prints?', code: 'team = ["Aaron Judge"]\nprint("aaron judge" in team)', opts: ['True', 'False', 'Aaron Judge'], a: 1 },
  { skill: 'tables', q: 'names is a column from the table. What does list(names) do?', opts: ['counts the names', 'sorts the names', 'turns them into a real list'], a: 2 }
];

registerLab('mlb', 4, {
  title: 'My Lineup Card',
  skills: SKILLS, cells: CELLS, review: REVIEW,
  data: ['mlb_batting.csv']
});
})();
