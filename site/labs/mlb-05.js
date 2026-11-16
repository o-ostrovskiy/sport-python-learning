// Baseball Lab 5: Game Day Loop (for loops, range, a running total). See labs/README.md for the format.
// Twin of baseball/Baseball_Lab_5.ipynb: same ideas, same code.
(() => {
const SKILLS = { loops: 'for loops', range: 'Counting with range( )', totals: 'A running total', counting: 'Counting with if' };
const LINEUP = `lineup = [
    "Shohei Ohtani",
    "Aaron Judge",
    "Juan Soto",
    "Cal Raleigh",
    "Bobby Witt Jr.",
    "Jose Ramirez",
    "Kyle Schwarber",
    "Julio Rodriguez",
    "Pete Alonso",
]
`;
const TEAM3 = '["Aaron Judge", "Shohei Ohtani", "Cal Raleigh"]';
const CELLS = [
  { md: '<h2>Part 1. One batter at a time 🔁</h2>A baseball game repeats itself: 9 innings, 9 batters, again and again. Today you teach Python to <b>repeat</b> things, so you never have to write the same line 9 times. In Python that is called a <b>loop</b>.' },
  { skill: 'loops', kind: 'run', task: 'In Lab 4, <code>print(lineup)</code> squeezed the whole lineup onto one line. <b>Guess first:</b> what will these two new lines at the bottom show? Then run it.',
    code: LINEUP + `
for batter in lineup:
    print(batter)`,
    ok: 'Nine batters, and you wrote <code>print</code> only <b>once</b>. That is a <b>loop</b>. <code>for batter in lineup:</code> means "do this for each one". <code>batter</code> is a box: the loop puts the <b>next</b> player into it each time, and then runs the pushed-in line.' },
  { skill: 'loops', kind: 'predict', task: 'Only the <b>pushed-in</b> lines repeat. Look at the last line: it is <b>not</b> pushed in. <b>Guess first:</b> how many times will this say <code>Play ball!</code>? Type a number, then run it.',
    code: `for batter in lineup:
    print("Now batting:", batter)
print("Play ball!")`,
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 1, msg: (+guess === 1 ? 'You read it right! ' : `You guessed ${esc(guess)}, but it shows up only once. `) + '<code>print("Play ball!")</code> is not pushed in, so it is <b>not inside</b> the loop. Python finishes all 9 trips around the loop first, then moves on.' }) },
  { skill: 'loops', kind: 'boom', expectError: 'IndentationError', task: 'What if you forget to push the line in? Run it. It shows a red error <b>on purpose</b>.',
    code: `for batter in lineup:
print(batter)`,
    ok: 'A red error, just as planned! <code>IndentationError</code>: you saw it with <code>if</code> in Lab 3. After the <code>for</code> line and its colon, Python needs at least one pushed-in line. Otherwise it does not know <b>what</b> to repeat.' },
  { skill: 'loops', kind: 'turn', task: 'Put <b>your own</b> 3 players into the list. Change only the names inside the quotes. Python will cheer for each one.',
    code: `my_team = ["Aaron Judge", "Shohei Ohtani", "Cal Raleigh"]   # put your own 3 players here

for player in my_team:
    print("Let's go,", player, "!")`,
    hints: ['Change the three names on the first line. Each name keeps its quotes, with a comma between players.', 'Leave the two loop lines alone. The first line should look like <code>my_team = ["Name One", "Name Two", "Name Three"]</code>.'],
    check: async ({ q, out }) => {
      if (!(await q('isinstance(my_team, list)'))) return { msg: 'The team must be a list. Keep the square brackets <code>[ ]</code> around the names.' };
      const n = (await q('len(my_team)'));
      if (n !== 3) return { msg: `Python counts ${n} player${n === 1 ? '' : 's'} on your team. We want 3, with a comma between them.` };
      if ((await q('my_team == ' + TEAM3))) return { msg: 'Those are still my three players. Put your own favorites inside the quotes.' };
      if ((out.match(/Let's go,/g) || []).length !== 3) return { msg: 'I should see three cheers. Keep the two loop lines just as they were: <code>for player in my_team:</code> and the pushed-in <code>print</code>.' };
      return { ok: true, msg: 'Three players, three cheers, one <code>print</code> line. Here the box is called <code>player</code>, not <code>batter</code>: it is your box, you name it.' }; } },

  { md: '<h2>Part 2. Counting innings with range( ) 🔢</h2>Sometimes you have no list. You just want to count: inning 1, inning 2, inning 3… Python has a counting machine for that: <code>range( )</code>.' },
  { skill: 'range', kind: 'quiz', task: '<b>Guess first.</b> <code>range(9)</code> gives 9 numbers. What will the <b>first</b> line say? (Remember how Python counts, from Lab 4.)',
    code: `for inning in range(9):
    print("Inning", inning)`,
    opts: ['Inning 1', 'Inning 0', 'Inning 9'], a: 1,
    tips: ['That is how people count. How does Python count the spots in a list?', '', '9 is how many numbers you get, not where it starts. Python starts counting at…?'],
    ok: 'Yes! <code>range(9)</code> counts like the spots in a list: 0, 1, 2 … up to 8. Nine numbers, starting at 0. But there is no "inning 0" in baseball!' },
  { skill: 'range', kind: 'run', task: 'Give <code>range</code> <b>two</b> numbers and it starts where you say. Run it and look at the first and the last line.',
    code: `for inning in range(1, 10):
    print("Inning", inning)`,
    ok: '<code>range(1, 10)</code> means: start at 1, and stop <b>before</b> 10. So the last number is 9. The second number is always one more than where you want to end.' },
  { skill: 'range', kind: 'run', task: 'Now the lineup card with batting order numbers. <b>Guess first:</b> why does it say <code>spot + 1</code>?',
    code: `for spot in range(9):
    print(spot + 1, lineup[spot])`,
    ok: '<code>range(9)</code> counts 0 to 8: exactly the spot numbers of a 9-player list, so <code>lineup[spot]</code> is each batter in turn. A lineup card says 1 to 9, so we show <code>spot + 1</code>.' },
  { skill: 'range', kind: 'turn', task: 'The <b>box score</b>. These are the real runs the Dodgers scored in each inning of Game 5 of the 2024 World Series. The loop shows only 3 innings. Change the <code>3</code> so it shows <b>all 9</b>.',
    code: `dodgers = [0, 0, 0, 0, 5, 0, 0, 2, 0]

for inning in range(3):     # change the 3
    print("Inning", inning + 1, ":", dodgers[inning], "runs")`,
    hints: ['How many innings are in the list? That is the number <code>range( )</code> needs.', 'Change <code>range(3)</code> to <code>range(9)</code>.'],
    check: async ({ out }) => {
      const n = out.split('\n').filter(l => l.startsWith('Inning')).length;
      if (n < 9) return { msg: `That shows ${n} inning${n === 1 ? '' : 's'}. A game has 9. Make the number in <code>range( )</code> bigger.` };
      if (n > 9 || !out.includes('Inning 9 : 0 runs')) return { msg: 'We want exactly innings 1 to 9. Keep the loop as it was and change only the 3.' };
      return { ok: true, msg: 'All 9 innings! See inning 5? The Yankees were ahead 5 to 0, and the Dodgers scored 5 runs in one inning.' }; } },

  { md: '<h2>Part 3. Keeping score: a running total ➕</h2>A scoreboard does not only show each inning. It also keeps the <b>score so far</b>. A loop can do that too: start with <code>total = 0</code>, an empty scoreboard, and add each inning to it.' },
  { skill: 'totals', kind: 'predict', task: '<b>Guess first:</b> what is the Dodgers\' <b>final score</b>? Type a number, then run it and watch the score grow.',
    code: `dodgers = [0, 0, 0, 0, 5, 0, 0, 2, 0]

total = 0
for runs in dodgers:
    total = total + runs
    print("Score so far:", total)

print("Final score:", total)`,
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 7, msg: (+guess === 7 ? 'Yes, 7! ' : `You guessed ${esc(guess)}. The Dodgers scored 7. `) + '<code>total = total + runs</code> looks strange, but one <code>=</code> means "put into the box". Python does the <b>right side first</b>: take what is in <code>total</code>, add <code>runs</code>, then put the answer back into <code>total</code>. That is a <b>running total</b>.' }) },
  { skill: 'totals', kind: 'turn', task: 'Now the Yankees, same game. Two things are missing: what the scoreboard shows <b>before</b> the game starts (a number), and what to add each time around (which box holds the runs of one inning?).',
    code: `yankees = [3, 1, 1, 0, 0, 1, 0, 0, 0]

total = ___
for runs in yankees:
    total = total + ___

print("Yankees:", total)`,
    hints: ['Before the first inning, a scoreboard shows zero.', 'Look at the <code>for</code> line: the box after <code>for</code> holds one inning\'s runs. Add that box.', 'The two lines are <code>total = 0</code> and <code>total = total + runs</code>.'],
    check: async ({ code, q }) => {
      if (!/total\s*=\s*0\s*(#.*)?\n/.test(code)) return { msg: 'Check the first blank. Before the game starts, the scoreboard shows zero.' };
      if (!/total\s*=\s*total\s*\+\s*runs\b/.test(code)) return { msg: 'Check the second blank. Each time around, add the box from the <code>for</code> line: the one that holds this inning\'s runs.' };
      if ((await q('int(total)')) !== 6) return { msg: 'The total should come out as 6. Keep the list of innings as it was.' };
      return { ok: true, msg: 'Yankees 6! Your scoreboard works. Dodgers 7, Yankees 6: the Dodgers won the World Series by one run.' }; } },
  { skill: 'totals', kind: 'run', data: true, task: 'A game has 9 innings. A <b>career</b> has many seasons. Same loop! First run this to load every MLB season. One row is one player\'s whole season.',
    code: `import pandas as pd

stats = pd.read_csv("mlb_batting.csv")
print("Ready!", len(stats), "rows, seasons", stats["season"].min(), "to", stats["season"].max())`,
    ok: 'Loaded! Every big-league season since 1871.' },
  { skill: 'totals', kind: 'run', data: true, task: 'Keep only Aaron Judge\'s rows (your trick from Lab 2) and look at his home runs, season by season.',
    code: `judge = stats[stats["name"] == "Aaron Judge"]
judge[["season", "HR"]]`,
    ok: 'Eleven seasons. The <code>HR</code> column works like a list: a loop can walk <b>down</b> it, one season at a time.' },
  { skill: 'totals', kind: 'predict', data: true, task: '<b>Guess first:</b> about how many home runs has Judge hit in his <b>whole career</b>? Type your guess, then run it.',
    code: `total = 0
for hr in judge["HR"]:
    total = total + hr
    print(hr, "home runs. Career so far:", total)

print("Career home runs:", total)`,
    check: async ({ guess }) => { const off = Math.abs(+guess - 386);
      return { ok: true, missed: !(off <= 40), msg: (off === 0 ? 'Exactly right, wow! ' : off <= 40 ? `You guessed ${esc(guess)}: very close! ` : `You guessed ${esc(guess)}. `) + 'Through 2026, Judge has hit <b>386</b>. It is the scoreboard loop again: only the names changed. <code>runs</code> became <code>hr</code>, and the list became the column <code>judge["HR"]</code>.' }; } },
  { skill: 'totals', kind: 'run', data: true, task: 'In Lab 2 you added up a column with <code>.sum()</code>. Check that it gives the same answer as your loop.',
    code: 'print(judge["HR"].sum())',
    ok: 'The same number! Now you know what <code>.sum()</code> does inside: a loop with a running total, just like yours.' },

  { md: '<h2>Part 4. Count the big seasons 💪</h2>Hitting <b>30 home runs</b> in one season is a big deal. Now we do not add up home runs. We <b>count seasons</b>: add <b>1</b> each time a season is big enough. For "big enough" you need <code>if</code> from Lab 3.' },
  { skill: 'counting', kind: 'predict', data: true, task: '<b>Guess first:</b> how many of Judge\'s seasons have 30 or more home runs? (Scroll up to his table if you like.) Type a number, then run it.',
    code: `count = 0
for hr in judge["HR"]:
    if hr >= 30:
        count = count + 1

print("Seasons with 30 or more home runs:", count)`,
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 6, msg: (+guess === 6 ? 'Yes, 6! ' : `You guessed ${esc(guess)}, and Python counted 6. `) + 'The <code>if</code> is inside the loop, so it is pushed in once. <code>count = count + 1</code> is inside the <code>if</code>, so it is pushed in <b>twice</b>. It runs only for the big seasons.' }) },
  { skill: 'counting', kind: 'turn', data: true, task: '<b>50</b> home runs in a season is super rare. Change <b>one number</b> to count Judge\'s 50-homer seasons.',
    code: `count = 0
for hr in judge["HR"]:
    if hr >= 30:        # change the 30
        count = count + 1

print("Big seasons:", count)`,
    hints: ['The number that decides "big enough" is on the <code>if</code> line.', 'Change <code>if hr >= 30:</code> to <code>if hr >= 50:</code>.'],
    check: async ({ code, q }) => {
      if (!/if\s+hr\s*>=\s*50\s*:/.test(code)) return { msg: 'Change the 30 on the <code>if</code> line to 50, and keep the <code>>=</code>.' };
      if ((await q('int(count)')) !== 4) return { msg: 'I expected 4 big seasons. Keep the other lines as they were, and start with <code>count = 0</code>.' };
      return { ok: true, msg: 'Four! 52, 62, 58 and 53 home runs. Only Babe Ruth, Mark McGwire and Sammy Sosa have four seasons like that too.' }; } },
  { skill: 'counting', kind: 'turn', data: true, task: '<b>Your player\'s career report.</b> One loop does both jobs: it adds up the career <b>and</b> counts the big seasons. Change the name to any player you like. You can change <code>big</code> too.',
    code: `player = "Shohei Ohtani"   # change to any player
big = 30                   # change to any number

seasons = stats[stats["name"] == player]

total = 0
count = 0
for hr in seasons["HR"]:
    total = total + hr
    if hr >= big:
        count = count + 1

print(player, "played", len(seasons), "seasons")
print("Career home runs:", total)
print("Seasons with", big, "or more:", count)`,
    hints: ['Change the name inside the quotes on the first line. Try <code>"Hank Aaron"</code> or <code>"Babe Ruth"</code>.', 'Spell the name exactly, with capital letters: <code>player = "Hank Aaron"</code>.'],
    check: async ({ q }) => {
      if ((await q('player == "Shohei Ohtani"'))) return { msg: 'That is still my player. Put another name inside the quotes on the first line.' };
      if ((await q('len(seasons)')) === 0) return { msg: `Python found 0 seasons for ${esc(String((await q('str(player)'))))}, so the loop had nothing to walk through. Check the spelling and the capital letters.` };
      return { ok: true, msg: `${esc(String((await q('str(player)'))))}: ${(await q('len(seasons)'))} seasons and ${(await q('int(total)'))} home runs. The loop does not care if it is 9 seasons or 23: it is the same few lines. That's the ballgame!` }; } }
];
const REVIEW = [
  { skill: 'loops', q: 'How many times does this print "Go!"?', code: 'team = ["Judge", "Soto", "Ohtani"]\nfor player in team:\n    print("Go!")', opts: ['1', '3', '0'], a: 1 },
  { skill: 'loops', q: 'Which lines does a for loop repeat?', opts: ['every line below it', 'only the pushed-in lines', 'only the first line'], a: 1 },
  { skill: 'range', q: 'Which one counts 1, 2, 3 … 9?', opts: ['range(9)', 'range(1, 9)', 'range(1, 10)'], a: 2 },
  { skill: 'totals', q: 'What prints?', code: 'total = 0\nfor runs in [2, 0, 3]:\n    total = total + runs\nprint(total)', opts: ['3', '5', '203'], a: 1 },
  { skill: 'totals', q: 'What must come BEFORE the loop for a running total?', opts: ['total = 0', 'print(total)', 'total = total + runs'], a: 0 },
  { skill: 'counting', q: 'What prints?', code: 'count = 0\nfor hr in [52, 27, 39]:\n    if hr >= 30:\n        count = count + 1\nprint(count)', opts: ['3', '118', '2'], a: 2 }
];

registerLab('mlb', 5, {
  title: 'Game Day Loop',
  skills: SKILLS, cells: CELLS, review: REVIEW,
  data: ['mlb_batting.csv']
});
})();
