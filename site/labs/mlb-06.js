// Baseball Lab 6: Build Your Own Machine (def, inputs, return). See labs/README.md for the format.
// Twin of baseball/Baseball_Lab_6.ipynb: same ideas, same code.
(() => {
const SKILLS = { def: 'Building a machine with def', inputs: 'Inputs', ret: 'return hands back an answer', combo: 'Machines working together' };
const TEAM3 = '["Aaron Judge", "Shohei Ohtani", "Cal Raleigh"]';
const CELLS = [
  { md: '<h2>Part 1. Your first machine 🔧</h2>You have used machines that someone else built: <code>time_to_plate</code> in Lab 1, <code>compare</code> in Labs 2 and 3. Today you build your own. Python\'s real word for a machine is a <b>function</b>.' },
  { skill: 'def', kind: 'run', task: '<b>Guess first:</b> what will this box show? Say it out loud, then run it.',
    code: `def cheer():
    print("Let's go, Yankees!")
    print("👏 👏 👏")`,
    ok: '<b>Nothing!</b> That is not a mistake. <code>def</code> is short for <b>define</b>: it <b>teaches</b> Python a new command called <code>cheer</code>. Building a machine and switching it on are two different things.' },
  { skill: 'def', kind: 'predict', task: 'To switch the machine on, write its name with round brackets: <code>cheer()</code>. <b>Guess first:</b> how many lines will show up? Type a number, then run it.',
    code: `cheer()
cheer()`,
    check: ({ guess }) => ({ ok: true, missed: +guess !== 4, msg: (+guess === 4 ? 'Yes, 4! ' : `You guessed ${esc(guess)}, but there are 4. `) + 'The machine ran <b>twice</b>, and each run does both <code>print</code> lines. Using a machine is called <b>calling</b> it.' }) },
  { skill: 'def', kind: 'boom', expectError: 'IndentationError', task: 'The lines inside a machine are <b>pushed in</b> 4 spaces, like under <code>if</code> and <code>for</code>. What if you forget? Run it. It shows a red error <b>on purpose</b>.',
    code: `def cheer():
print("Let's go, Yankees!")`,
    ok: 'A red error, just as planned! <code>IndentationError</code>, the same one as with <code>if</code> (Lab 3) and <code>for</code> (Lab 5). The pushed-in lines are how Python knows what is <b>inside</b> the machine.' },
  { skill: 'inputs', kind: 'run', task: 'That machine only cheers for the Yankees. This one cheers for <b>any</b> team. <b>Guess first:</b> what will the two lines at the bottom show?',
    code: `def cheer(team):
    print("Let's go,", team, "!")

cheer("Dodgers")
cheer("Mariners")`,
    ok: '<code>team</code> in the round brackets is an <b>input</b>: an empty box that gets filled each time you use the machine. <code>cheer("Dodgers")</code> puts <code>"Dodgers"</code> into it, then runs the inside. One machine, any team.' },
  { skill: 'inputs', kind: 'turn', task: 'This machine has <b>two</b> inputs, with a comma between them. Change the <b>last line</b>: announce your own favorite player and his number. The name needs quotes, the number does not.',
    code: `def announce(player, number):
    print("Now batting, number", number, ":", player, "!")

announce("Aaron Judge", 99)   # change to your player and his number`,
    hints: ['Only the last line changes. Put another name in the quotes and another number after the comma.', 'It should look like this: <code>announce("Shohei Ohtani", 17)</code>.'],
    check: ({ code, out }) => {
      if (!/def\s+announce\s*\(\s*player\s*,\s*number\s*\)\s*:/.test(code)) return { msg: 'Keep the first two lines, the machine itself, just as they were. Change only the last line.' };
      if (!out.includes('Now batting, number')) return { msg: 'Nothing was announced. The last line must call the machine: <code>announce("Name", 17)</code>.' };
      if (out.includes(': Aaron Judge !')) return { msg: 'That is still Aaron Judge. Put your own player and his number on the last line.' };
      return { ok: true, msg: 'What an announcement! The order matters: the first thing you give goes into the first box (<code>player</code>), the second into the second box (<code>number</code>).' }; } },

  { md: '<h2>Part 2. return: a machine that hands back an answer 🎁</h2><code>cheer</code> and <code>announce</code> only <b>show</b> something. Most machines work out an answer and <b>hand it back</b>. A <b>batting average</b> tells how often a batter gets a hit: his <b>hits</b> shared out over his <b>at-bats</b> (his turns at bat). That is division, <code>/</code>.' },
  { skill: 'ret', kind: 'run', task: 'In 1941, Ted Williams got <b>185</b> hits in <b>456</b> at-bats, one of the most famous seasons ever. Run the machine on his numbers.',
    code: `def batting_average(hits, at_bats):
    return hits / at_bats

print(batting_average(185, 456))`,
    ok: '<code>return</code> means: "the machine is done, and <b>this</b> is the answer it hands back". Then <code>print</code> shows it. But what a long number! Baseball people use only 3 digits after the dot.' },
  { skill: 'ret', kind: 'run', task: 'A machine can have more than one line inside. This one uses <code>round( )</code> from Lab 2 to keep 3 digits.',
    code: `def batting_average(hits, at_bats):
    average = hits / at_bats
    return round(average, 3)

print(batting_average(185, 456))`,
    ok: '<b>0.406</b>. Baseball people say "four-oh-six". Nobody has hit over .400 for a whole season since Ted Williams did it.' },
  { skill: 'ret', kind: 'run', task: '<code>print</code> or <code>return</code>: what is the difference? This machine uses <code>print</code> instead of <code>return</code>, and we try to save its answer in a box. <b>Guess first:</b> what is in the box?',
    code: `def average_shown(hits, at_bats):
    print(round(hits / at_bats, 3))

answer = average_shown(185, 456)
print("In the answer box:", answer)`,
    ok: 'The box holds <code>None</code>, Python\'s word for "nothing". <code>print</code> only shows something on the screen for <b>you</b>. <code>return</code> hands the answer back to <b>Python</b>, so you can save it, compare it or do math with it.' },
  { skill: 'ret', kind: 'turn', task: 'Because <code>batting_average</code> uses <code>return</code>, we can save two answers and compare them. Change the other player\'s two numbers to <b>Cal Raleigh\'s</b> 2025 season: <b>147</b> hits in <b>596</b> at-bats.',
    code: `judge = batting_average(179, 541)    # Aaron Judge in 2025
other = batting_average(172, 611)    # Shohei Ohtani in 2025: change these two numbers

print("Judge:", judge)
print("The other player:", other)

if judge > other:
    print("Judge had the better batting average")
else:
    print("The other player had the better batting average")`,
    hints: ['Change only the two numbers on the second line: hits first, then at-bats.', 'The second line should be <code>other = batting_average(147, 596)</code>.'],
    check: ({ q }) => {
      const other = q('float(other)');
      if (other === 0.282) return { msg: 'Those are still Ohtani\'s numbers. Put Raleigh\'s in: 147 hits, 596 at-bats.' };
      if (other === 4.054) return { msg: 'The order matters! Hits go first, then at-bats: <code>batting_average(147, 596)</code>.' };
      if (other !== 0.247) return { msg: `That gives ${other}. Raleigh had 147 hits in 596 at-bats, so I expect 0.247. Check both numbers.` };
      if (q('float(judge)') !== 0.331) return { msg: 'Keep Judge\'s line as it was: <code>judge = batting_average(179, 541)</code>.' };
      return { ok: true, msg: 'Judge 0.331, Raleigh 0.247. Judge had the best average in baseball in 2025. But Raleigh hit 60 home runs that year: a batting average does not tell you everything!' }; } },

  { md: '<h2>Part 3. Rebuild compare 🏗️</h2>Time to rebuild the <code>compare</code> machine from Lab 2, and make it better: this one will <b>hand back</b> the winner.' },
  { skill: 'combo', kind: 'run', data: true, task: 'First run this to load every MLB season. One row is one player\'s whole season.',
    code: `import pandas as pd

stats = pd.read_csv("mlb_batting.csv")
print("Ready!", len(stats), "rows, seasons", stats["season"].min(), "to", stats["season"].max())`,
    ok: 'Loaded! Every big-league season since 1871.' },
  { skill: 'ret', kind: 'run', data: true, task: 'Start with a small machine: one player\'s <b>career total</b> in any stat. You know both inside lines from Lab 2: keep only his rows, then add up one column.',
    code: `def career_total(player, stat):
    seasons = stats[stats["name"] == player]
    return seasons[stat].sum()

print(career_total("Aaron Judge", "HR"))
print(career_total("Hank Aaron", "HR"))`,
    ok: '386 for Judge (through 2026) and 755 for Hank Aaron. One machine, any player, any stat. If you spell a name wrong, it finds no rows and hands back 0.' },
  { skill: 'combo', kind: 'turn', data: true, task: '<b>Build compare.</b> A machine can <b>use another machine</b>: this one uses <code>career_total</code> twice. Two things are missing: which player to add up for <code>total2</code>, and the 6-letter word that hands back an answer.',
    code: `def compare(player1, player2, stat):
    total1 = career_total(player1, stat)
    total2 = career_total(___, stat)
    print(player1, ":", total1)
    print(player2, ":", total2)
    if total1 > total2:
        ___ player1
    elif total1 == total2:
        return "Nobody, it's a tie"
    else:
        return player2

winner = compare("Aaron Judge", "Kyle Schwarber", "HR")
print("Winner:", winner, "🏆")`,
    hints: ['Look at the <code>total1</code> line: it adds up <code>player1</code>. So the <code>total2</code> line adds up…?', 'The word that hands back an answer is the one you learned in Part 2. It is already on two other lines of this machine.', 'The two lines are <code>total2 = career_total(player2, stat)</code> and <code>return player1</code>.'],
    check: ({ code, q }) => {
      if (!/total2\s*=\s*career_total\(\s*player2\s*,\s*stat\s*\)/.test(code)) return { msg: 'Check the <code>total2</code> line. It should add up the <b>second</b> player\'s career. Which input box holds him?' };
      if (!/if\s+total1\s*>\s*total2\s*:\s*\n\s+return\s+player1\b/.test(code)) return { msg: 'Check the line under <code>if</code>. The missing word hands the answer back, and it has 6 letters.' };
      if (q('str(winner)') !== 'Aaron Judge') return { msg: 'The winner should be Aaron Judge, 386 to 385. Keep the last two lines as they were.' };
      return { ok: true, msg: 'Judge 386, Schwarber 385: one home run apart! Your machine <b>prints</b> the totals and <b>returns</b> the winner. Only one <code>return</code> line ever runs: the one under the rule that is true.' }; } },
  { skill: 'combo', kind: 'run', data: true, task: 'Try your machine on other players. <b>Guess first:</b> who wins each one? The second line is the tie test from Lab 3.',
    code: `print("Winner:", compare("Hank Aaron", "Babe Ruth", "HR"))
print("Winner:", compare("Aaron Judge", "Aaron Judge", "HR"))
print("Winner:", compare("Juan Soto", "Shohei Ohtani", "H"))`,
    ok: 'Hank Aaron beats Babe Ruth, 755 to 714. Judge against Judge is a tie, as it should be. And in career hits, Soto is ahead of Ohtani by just two: 1196 to 1194.' },

  { md: '<h2>Part 4. Machines + loops = a scouting report 📋</h2>Now put your machines together. A <b>career</b> batting average is all of a player\'s hits shared out over all of his at-bats. You already have a machine for each piece!' },
  { skill: 'combo', kind: 'quiz', task: '<b>Guess first.</b> Judge hit 0.331 in 2025. What do you think his <b>career</b> average is, all 11 seasons together?',
    code: `def career_average(player):
    hits = career_total(player, "H")
    at_bats = career_total(player, "AB")
    return batting_average(hits, at_bats)`,
    opts: ['higher than 0.331', 'exactly 0.331', 'lower than 0.331'], a: 2,
    tips: ['Then most of his other seasons would have to be even better than 2025, his best one.', 'Only if he hit exactly the same every single year. Players have good and bad years.', ''],
    ok: 'Right: 2025 was one of his best years, so the whole career comes out lower. Run the next box to see the real number.' },
  { skill: 'combo', kind: 'run', data: true, task: 'Run it. Look how short <code>career_average</code> is: it just asks your other two machines.',
    code: `def career_average(player):
    hits = career_total(player, "H")
    at_bats = career_total(player, "AB")
    return batting_average(hits, at_bats)

print(career_average("Aaron Judge"))`,
    ok: '<b>0.291</b>. This machine knows nothing about tables or division. <code>career_total</code> does the adding, <code>batting_average</code> does the dividing.' },
  { skill: 'combo', kind: 'run', data: true, task: 'With a loop from Lab 5, one machine can work through a whole team. <b>Guess first:</b> who has the best career average of these three?',
    code: `my_team = ["Aaron Judge", "Shohei Ohtani", "Cal Raleigh"]

for player in my_team:
    print(player, career_average(player))`,
    ok: 'Each time around the loop, <code>player</code> is the next name, and the machine gets called with it. Three players, three answers.' },
  { skill: 'combo', kind: 'turn', data: true, task: '<b>Make it yours.</b> One more machine: a player\'s <b>best season</b> in any stat. Put <b>your own</b> players in <code>my_team</code>. You can also change <code>"HR"</code> to <code>"H"</code> (hits) or <code>"BB"</code> (walks).',
    code: `def best_season(player, stat):
    seasons = stats[stats["name"] == player]
    return seasons[stat].max()

my_team = ["Aaron Judge", "Shohei Ohtani", "Cal Raleigh"]   # put your own players here

for player in my_team:
    print(player, "best season:", best_season(player, "HR"), "| career average:", career_average(player))`,
    hints: ['Change the names inside the quotes on the <code>my_team</code> line. Any number of players is fine.', 'Spell each name exactly, with capital letters, like <code>["Juan Soto", "Mookie Betts", "Mike Trout"]</code>.'],
    check: ({ q }) => {
      if (!q('isinstance(my_team, list) and len(my_team) > 0')) return { msg: 'Keep <code>my_team</code> a list with at least one player in square brackets.' };
      if (q('my_team == ' + TEAM3)) return { msg: 'Those are still my three players. Put your own inside the quotes.' };
      const lost = q('next((str(p) for p in my_team if len(stats[stats["name"] == p]) == 0), "")');
      if (lost) return { msg: `Python found no seasons for ${esc(lost)}, so his numbers came out empty. Check the spelling and the capital letters.` };
      return { ok: true, msg: `A scouting report for ${q('len(my_team)')} players, built from four machines you made yourself. Machine built, Engineer!` }; } }
];
const REVIEW = [
  { skill: 'def', q: 'What does this box show when you run it?', code: 'def cheer():\n    print("Go!")', opts: ['Go!', 'nothing yet', 'a red error'], a: 1 },
  { skill: 'def', q: 'Which line USES (calls) the machine cheer?', opts: ['def cheer():', 'cheer', 'cheer()'], a: 2 },
  { skill: 'inputs', q: 'What prints?', code: 'def double(runs):\n    return runs * 2\n\nprint(double(4))', opts: ['8', '4', 'runs'], a: 0 },
  { skill: 'ret', q: 'Which word hands an answer back from a machine?', opts: ['print', 'return', 'def'], a: 1 },
  { skill: 'ret', q: 'What is in the box x?', code: 'def show(hits):\n    print(hits)\n\nx = show(3)', opts: ['3', 'hits', 'None'], a: 2 },
  { skill: 'combo', q: 'Can one machine use another machine inside it?', opts: ['yes, like compare uses career_total', 'no, never', 'only inside a loop'], a: 0 }
];

registerLab('mlb', 6, {
  title: 'Build Your Own Machine',
  skills: SKILLS, cells: CELLS, review: REVIEW,
  data: ['mlb_batting.csv']
});
})();
