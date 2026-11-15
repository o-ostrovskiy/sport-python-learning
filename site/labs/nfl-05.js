// One lab = one file. See labs/README.md for the format.
// Site version of football/Football_Lab_5.ipynb (Game Day Loop). Data: data/nfl_games.csv (built by _build/build_site_nfl_games.py).
(() => {
const SKILLS5 = { loops: 'for loops', range: 'range( ) counts for you', totals: 'A running total', count: 'Counting with if' };
const BOARD3 = 'my_board = ["Justin Jefferson", "Saquon Barkley", "Josh Allen"]';
const TEAM3 = '["Justin Jefferson", "Saquon Barkley", "Josh Allen"]';
const LAB5 = [
  { md: '<h2>Part 1. One line, many players 🔁</h2>A season is the same thing again and again: play a game, add up the yards, play the next game. Computers love doing the same thing again and again. Today you teach Python to <b>repeat</b>. That is called a <b>loop</b>.<br><br>In Lab 4 your draft board printed all on one line. To show one player per line you would need one <code>print</code> for every player. A loop does it in two lines, however long the board is.' },
  { skill: 'loops', kind: 'run', task: '<b>Guess first:</b> what will this box show? Say it out loud, then run it.',
    code: BOARD3 + '\n\nfor player in my_board:\n    print(player)',
    ok: 'Read it like a sentence: "<b>for</b> each player <b>in</b> my board, print the player." <code>player</code> is a locker Python fills for you: Justin in round 1, Saquon in round 2, Josh in round 3. The colon means "here is what to do each round", and the indented line is the part that <b>repeats</b>.' },
  { skill: 'loops', kind: 'predict', task: 'Only the <b>indented</b> lines belong to the loop. <b>Guess first:</b> how many times will <code>Draft is over!</code> show up? Type a number, then run it.',
    code: BOARD3 + '\n\nfor player in my_board:\n    print("The pick is in:", player)\n\nprint("Draft is over!")',
    check: ({ guess }) => ({ ok: true, missed: +guess !== 1, msg: (+guess === 1 ? 'You got it: once! ' : `You guessed ${esc(guess)}, but it shows up only once. `) + 'The last <code>print</code> is not indented, so it is <b>outside</b> the loop. Python runs it one time, after all three rounds are done.' }) },
  { skill: 'loops', kind: 'boom', expectError: 'IndentationError', task: 'What if we forget the indent? Run it. It shows a red error <b>on purpose</b>.',
    code: BOARD3 + '\n\nfor player in my_board:\nprint("The pick is in:", player)',
    ok: '<code>IndentationError</code>, the same error as with <code>if</code> in Lab 3. Python saw the colon, so it expected a line pushed to the right. Without the push, it cannot tell what to repeat.' },
  { skill: 'loops', kind: 'turn', task: 'Put <b>your own</b> players in the list, as many as you like. Change only the names inside the quotes, and keep the commas.',
    code: 'my_team = ["Justin Jefferson", "Saquon Barkley", "Josh Allen"]   # put your own players here\n\nfor player in my_team:\n    print(player, "is on my team!")\n\nprint("That\'s", len(my_team), "players.")',
    hints: ['Each name needs its own quotes, with a comma between players.', 'Like this: <code>my_team = ["Lamar Jackson", "Derrick Henry", "CeeDee Lamb", "Travis Kelce"]</code>'],
    check: ({ q, out }) => {
      if (!q('isinstance(my_team, list)')) return { msg: 'The team must be a list. Keep the square brackets <code>[ ]</code> around the names.' };
      if (q('my_team == ' + TEAM3)) return { msg: 'Those are still my three players. Put your own favorites inside the quotes.' };
      const n = q('len(my_team)');
      if (n < 2) return { msg: `Python counts only ${n} player. Put at least two on the team, with a comma between them.` };
      const lines = out.split('\n').filter(l => l.includes('is on my team!')).length;
      if (lines !== n) return { msg: `You have ${n} players, but the loop printed ${lines} line${lines === 1 ? '' : 's'}. Keep the <code>for</code> line and the indented <code>print</code> under it.` };
      return { ok: true, msg: `${n} players, ${n} rounds of the loop, and you still wrote only two lines for it. The loop does not care how long the list is.` }; } },

  { md: '<h2>Part 2. <code>range( )</code>: Python counts for you 🔢</h2>Sometimes you do not have a list. You just want to do something a number of times, like once for every week. <code>range( )</code> hands the loop numbers, one at a time.' },
  { skill: 'range', kind: 'run', task: '<b>Guess first:</b> which numbers will this show? Then run it.',
    code: 'for week in range(5):\n    print("Week", week)',
    ok: 'Five rounds, but it started at <b>0</b> and stopped at <b>4</b>! Remember Lab 4: Python counts from 0. <code>range(5)</code> means "5 numbers, starting at 0".' },
  { skill: 'range', kind: 'predict', task: 'There is no "Week 0" in the NFL. So we give <code>range</code> two numbers: where to <b>start</b> and where to <b>stop</b>. <b>Guess first:</b> what is the <b>last</b> week this box shows? Type a number, then run it.',
    code: 'for week in range(1, 6):\n    print("Week", week)',
    check: ({ guess }) => ({ ok: true, missed: +guess !== 5, msg: (+guess === 5 ? 'Yes, Week 5! ' : `You guessed ${esc(guess)}, but the last one is Week 5. `) + '<code>range(1, 6)</code> means: start at 1 and stop <b>before</b> 6. The stop number is never included.' }) },
  { skill: 'range', kind: 'turn', task: 'The NFL regular season has <b>18 weeks</b>. Make this box print Week 1, Week 2… all the way to <b>Week 18</b>. One number is missing: where <code>range</code> should stop. Careful, it is not 18!',
    code: 'for week in range(1, ___):\n    print("Week", week)',
    hints: ['<code>range</code> stops <b>before</b> the stop number. So the stop number is one more than the last week you want.', 'The line should read: <code>for week in range(1, 19):</code>'],
    check: ({ out }) => {
      const lines = out.trim().split('\n'), last = lines[lines.length - 1] || '', n = +last.replace('Week ', '');
      if (lines[0] !== 'Week 1') return { msg: `It starts at "${esc(lines[0] || 'nothing')}". Keep the 1 as the start number: <code>range(1, …)</code>.` };
      if (n === 17) return { msg: 'It stopped at Week 17. <code>range</code> stops <b>before</b> the stop number, so 18 is left out. Go one higher.' };
      if (n < 18) return { msg: `It stopped at Week ${n}. We need Week 18, so the stop number must be bigger.` };
      if (n > 18) return { msg: `That went all the way to Week ${n}. The season has 18 weeks, so stop one after 18.` };
      return { ok: true, msg: 'Week 18! To count up to 18, you stop at 19: one more than the last number you want.' }; } },
  { skill: 'range', kind: 'run', task: 'Now we can print the board the way Lab 4 promised. <code>len(my_board)</code> is 5, so <code>range(5)</code> hands out 0, 1, 2, 3, 4: exactly the spots on the board. Run it.',
    code: 'my_board = ["Justin Jefferson", "Saquon Barkley", "Josh Allen", "Ja\'Marr Chase", "Bijan Robinson"]\n\nfor spot in range(len(my_board)):\n    print("Pick", spot + 1, ":", my_board[spot])',
    ok: 'Each round, <code>spot</code> holds the next number, and <code>my_board[spot]</code> is the player at that spot. <code>spot + 1</code> turns Python\'s counting (0, 1, 2) into people\'s counting (1, 2, 3).' },

  { md: '<h2>Part 3. A running total ➕</h2>In 2024, Saquon Barkley had one of the best seasons a running back has ever had. Here are his rushing yards in his <b>first 5 games</b>. Let\'s add them up the way a scoreboard does: game by game.' },
  { skill: 'totals', kind: 'run', task: '<b>Guess first:</b> about how many yards after 5 games? Then run it and watch the total grow.',
    code: 'games = [109, 95, 147, 84, 47]\n\ntotal = 0\n\nfor yards in games:\n    total = total + yards\n    print("This game:", yards, "  Total so far:", total)\n\nprint("After 5 games:", total)',
    ok: '482 yards. That is a <b>running total</b>: a locker that grows every round. <code>total = 0</code> comes before the loop, so the locker starts empty. Both indented lines repeat; the last <code>print</code> runs once.' },
  { skill: 'totals', kind: 'quiz', task: '<code>total = total + yards</code> has <code>total</code> on both sides! Python does the <b>right side first</b>. If <code>total</code> holds 109 and <code>yards</code> is 95, what is in <code>total</code> after this line?',
    code: 'total = total + yards',
    opts: ['109, it does not change', '95', '204'], a: 2,
    tips: ['It does change. Python adds 109 + 95 first, then puts the answer back into the locker.', 'Not just the new yards. Python opens the locker (109), <b>adds</b> 95, and puts the answer back.', ''],
    ok: 'Right: open the locker (109), add this game (95), and put 204 back into the same locker. The old 109 is gone.' },
  { skill: 'totals', kind: 'run', data: true, task: 'Typing a whole season by hand is no fun. Run this to load the games table from Labs 2 and 3.',
    code: 'import pandas as pd\n\nstats = pd.read_csv("nfl_games.csv", low_memory=False)\nstats = stats[stats["season_type"] == "REG"]\nprint("Ready!", len(stats), "rows loaded")',
    ok: 'Loaded! One row is one player in one game.' },
  { skill: 'totals', kind: 'run', data: true, task: 'Three small steps you know: only his games, only 2024, then <code>list( )</code> from Lab 4 turns the column into a real list. Run it.',
    code: 'name = "Saquon Barkley"\n\ngames = stats[stats["player_display_name"] == name]    # only his games (Lab 2)\nseason = games[games["season"] == 2024]                # only the ones in 2024\nyards_list = list(season["rushing_yards"])             # that column, as a real list (Lab 4)\n\nprint(yards_list)\nprint("Games played:", len(yards_list))',
    ok: 'His 16 games, in order. The first five are the numbers you just added up.' },
  { skill: 'totals', kind: 'run', data: true, task: 'The same loop walks through the <b>whole</b> season. <code>game = game + 1</code> is a running total too: it adds 1 each round. <b>Guess first:</b> did he reach 2,000 yards?',
    code: 'total = 0\ngame = 0\n\nfor yards in yards_list:\n    game = game + 1\n    total = total + yards\n    print("Game", game, ":", yards, "yards.  Season total:", total)\n\nprint(name, "finished with", total, "yards")',
    ok: '<b>2,005 yards!</b> He was only the ninth player in NFL history to run for 2,000 in a season. And the loop did not change at all: 5 games or 16, the same lines do the job.' },

  { md: '<h2>Part 4. Count the big games 💯</h2>For a running back, <b>100 yards</b> in a game is a big day. To count the big days we need a loop <b>and</b> a decision: an <code>if</code> (Lab 3) inside the <code>for</code>.<br><br>"For each game: if the yards are at least 100, add 1 to the counter." The counter line is inside the loop <b>and</b> inside the <code>if</code>, so it is pushed in twice: 8 spaces.' },
  { skill: 'count', kind: 'predict', data: true, task: 'Here are Saquon\'s 16 games again. <b>Guess first:</b> how many had <b>at least 100</b> yards? Count them in the list, type your number, then run it.',
    code: 'print(yards_list)\n\nbig_games = 0\n\nfor yards in yards_list:\n    if yards >= 100:\n        big_games = big_games + 1\n\nprint("100-yard games:", big_games)',
    check: ({ guess }) => ({ ok: true, missed: +guess !== 11, msg: (+guess === 11 ? 'Exactly 11! You counted like the loop does. ' : `You guessed ${esc(guess)}, Python counted 11. `) + 'The <code>if</code> asks its question again for every game. The counter only grows in the rounds where the answer is True.' }) },
  { skill: 'count', kind: 'turn', data: true, task: 'In 2024 <b>Ja\'Marr Chase</b> led the whole NFL in catches, receiving yards and touchdown catches. This box counts his 100-yard games. One word is missing: the 3-letter word that starts a loop.',
    code: 'name = "Ja\'Marr Chase"\n\ngames = stats[stats["player_display_name"] == name]\nseason = games[games["season"] == 2024]\nyards_list = list(season["receiving_yards"])\n\nbig_games = 0\n\n___ yards in yards_list:\n    if yards >= 100:\n        big_games = big_games + 1\n\nprint(name, "had", big_games, "games with 100 yards or more")',
    hints: ['Look at any loop above. Which little word comes first?', 'The line should read: <code>for yards in yards_list:</code>'],
    check: ({ code, g }) => {
      if (!/^for\s+yards\s+in\s+yards_list\s*:/m.test(code)) return { msg: 'Check the line that had the <code>___</code>. A loop starts with a 3-letter word, and the line reads "… each yards in yards_list".' };
      if (g('big_games') !== 5) return { msg: `The counter says ${esc(String(g('big_games')))}, but Chase had 5 big games. Keep the <code>if</code> and the counter line the way they were.` };
      return { ok: true, msg: 'Five games with 100 yards or more, and one of them was 264 yards! Your loop works.' }; } },
  { skill: 'count', kind: 'turn', data: true, task: '<b>Your player\'s season report.</b> Change the lines at the top: <code>name</code>, <code>stat</code> and <code>year</code> (1999 to 2024). For a quarterback use <code>"passing_yards"</code> and <code>big = 300</code>.',
    code: 'name = "Justin Jefferson"   # change to your player\nstat = "receiving_yards"    # or "rushing_yards" or "passing_yards"\nyear = 2022                 # change to a season he played\nbig = 100                   # a "big game" is this many yards or more\n\ngames = stats[stats["player_display_name"] == name]\nseason = games[games["season"] == year]\nyards_list = list(season[stat])\n\ntotal = 0\nbig_games = 0\n\nfor yards in yards_list:\n    total = total + yards\n    if yards >= big:\n        big_games = big_games + 1\n\nprint(name, "in", year)\nprint("Games:", len(yards_list))\nprint("Total:", total, "yards")\nprint("Big games:", big_games)',
    hints: ['Change the name between the quotes on line 1. You can also change the stat and the year.', 'For example: <code>name = "Josh Allen"</code>, <code>stat = "passing_yards"</code>, <code>year = 2024</code>, <code>big = 300</code>.'],
    check: ({ g, q }) => {
      const n = g('name'), y = g('year'), s = g('stat');
      if (typeof n !== 'string') return { msg: 'The name is text, so it needs quotes: <code>name = "Josh Allen"</code>.' };
      if (n === 'Justin Jefferson' && y === 2022 && s === 'receiving_yards') return { msg: 'That is Justin Jefferson in 2022: 1,809 yards and 10 big games. Now change the top lines to your own player.' };
      if (!q('len(yards_list)')) return { msg: `Games: 0. The list is empty, so the loop had nothing to walk through. Check the spelling of "${esc(n)}" (capital letters matter), and that he played in ${esc(String(y))}. This box only has players with lots of yards.` };
      if (!q('total == sum(yards_list)')) return { msg: 'The total does not match his games. Keep the line <code>total = total + yards</code> inside the loop.' };
      return { ok: true, msg: `${esc(n)} in ${esc(String(y))}: ${q('len(yards_list)')} games, ${q('int(total)').toLocaleString('en-US')} yards, ${q('int(big_games)')} big games. A list, a loop, a running total and a counter: that is a real program. Final whistle! 🏆` }; } }
];
const REVIEW5 = [
  { skill: 'loops', q: 'How many lines does this print?', code: 'team = ["Allen", "Cook", "Kincaid"]\nfor player in team:\n    print(player)\nprint("Go Bills!")', opts: ['3', '4', '6'], a: 1 },
  { skill: 'loops', q: 'What is wrong here?', code: 'for player in team:\nprint(player)', opts: ['the print line is not indented', 'player needs quotes', 'nothing, it is fine'], a: 0 },
  { skill: 'range', q: 'Which numbers does range(1, 4) count?', opts: ['1, 2, 3, 4', '0, 1, 2, 3', '1, 2, 3'], a: 2 },
  { skill: 'range', q: 'Which numbers does range(3) count?', opts: ['1, 2, 3', '0, 1, 2', '0, 1, 2, 3'], a: 1 },
  { skill: 'totals', q: 'What prints?', code: 'total = 0\nfor yards in [50, 30, 20]:\n    total = total + yards\nprint(total)', opts: ['20', '100', '50 30 20'], a: 1 },
  { skill: 'count', q: 'What prints?', code: 'big = 0\nfor yards in [120, 80, 100]:\n    if yards >= 100:\n        big = big + 1\nprint(big)', opts: ['1', '2', '3'], a: 1 }
];

registerLab('nfl', 5, {
  title: 'Game Day Loop',
  skills: SKILLS5, cells: LAB5, review: REVIEW5,
  data: ['nfl_games.csv']
});
})();
