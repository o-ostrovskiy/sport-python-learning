// Baseball Lab 3: Umpire Bot. Same ideas and code as baseball/Baseball_Lab_3.ipynb. See labs/README.md for the format.
(() => {
const SKILLS = { yesno: 'True, False and > < >= <=', ifelse: 'if and else', elif: 'elif: more than two choices', machine: 'Reading and fixing a machine' };
const FLY = 'if distance >= 400:\n    print("Home run! 💣")\nelif distance >= 300:\n    print("Over their heads! Extra bases 🏃")\nelse:\n    print("Caught! The batter is out 🧤")';
const RATE = 'seasons = stats[stats["name"] == name]\nbest = seasons["HR"].max()\nprint(name, "best season:", best, "home runs")\n\nif best >= 50:\n    print("MONSTER SEASON! 🔥")\n';
const RATE_END = ' best >= 30:\n    print("Big power season! 💥")\nelse:\n    print("Solid, but no 30-homer season yet.")';
const DEF = 'def compare(player1, player2, stat):\n    total1 = stats[stats["name"] == player1][stat].sum()\n    total2 = stats[stats["name"] == player2][stat].sum()\n    print(player1, ":", total1)\n    print(player2, ":", total2)\n    if total1 > total2:\n        print("Winner:", player1, "🏆")\n';
const DEF_END = '    else:\n        print("Winner:", player2, "🏆")';
const CELLS = [
  { md: '<h2>Part 1. Yes or no? 🤔</h2>Umpires make decisions all game long: <i>Safe or out? Is it a home run?</i> Today you teach Python to decide. Remember from Lab 2: Python answers yes-or-no questions with <code>True</code> (yes) or <code>False</code> (no). The question symbols: <code>&gt;</code> is it bigger? <code>&lt;</code> is it smaller? <code>&gt;=</code> is it <b>at least</b> (bigger, or the same)? <code>&lt;=</code> is it <b>at most</b> (smaller, or the same)? <code>==</code> is it the same?' },
  { skill: 'yesno', kind: 'run', task: '<b>Guess first:</b> what will these two lines show? Say it out loud, then run it.',
    code: 'print(10 > 7)\nprint(3 > 7)',
    ok: '<code>10 &gt; 7</code> asks "is 10 bigger than 7?" Yes: True. <code>3 &gt; 7</code>? No: False. Both words start with a capital letter and have no quotes.' },
  { skill: 'yesno', kind: 'quiz', task: 'A batter gets a walk after <b>4 balls</b>. The pitcher just threw ball number 4. Which line says <code>True</code>?',
    code: 'balls_for_a_walk = 4\nballs = 4\n\nprint(balls > balls_for_a_walk)\nprint(balls >= balls_for_a_walk)',
    opts: ['the first one, with >', 'the second one, with >=', 'both of them'], a: 1,
    tips: ['<code>4 &gt; 4</code> asks "is 4 <b>bigger</b> than 4?" It is not bigger, it is the same.', '', 'Only one. <code>4 &gt; 4</code> is False: 4 is not bigger than 4.'],
    ok: 'Right. <code>4 &gt;= 4</code> is True: 4 is <b>at least</b> 4. That is the question the umpire asks.' },
  { skill: 'yesno', kind: 'turn', task: 'Cal Raleigh hit <b>60</b> home runs in 2025. Is that <b>at least</b> 60? Put the right symbol in place of <code>___</code>. It is two symbols together: "bigger than" and "the same".<br>🔎 <b>Google it:</b> <code>python greater than or equal</code>',
    code: 'raleigh_hr = 60\n\nprint(raleigh_hr ___ 60)',
    hints: ['Look at the list of symbols above. Which one means "at least"?', 'The answer: <code>print(raleigh_hr &gt;= 60)</code>'],
    check: async ({ code, out }) => {
      const c = code.replace(/#.*/g, '');
      if (/raleigh_hr\s*>=\s*60/.test(c) && out.includes('True')) return { ok: true, msg: 'True! 60 is at least 60. <code>&gt;=</code> says yes when the number is bigger <b>or</b> the same.' };
      if (/raleigh_hr\s*==\s*60/.test(c)) return { msg: '<code>==</code> says True here, but it only asks "exactly 60?". With 61 home runs it would say False. Use the symbol for "at least".' };
      if (/raleigh_hr\s*>\s*60/.test(c)) return { msg: 'False! <code>&gt;</code> asks "is 60 <b>bigger</b> than 60?" and it is not. Add one more symbol so that "the same" counts too.' };
      if (/raleigh_hr\s*<=\s*60/.test(c)) return { msg: '<code>&lt;=</code> means "at most". We are asking "at least": bigger, or the same.' };
      if (/raleigh_hr\s*<\s*60/.test(c)) return { msg: '<code>&lt;</code> asks "is it smaller?" We are asking "is it at least 60?"' };
      return { msg: 'Put only the symbol in place of the blank, so the line reads <code>print(raleigh_hr &gt;= 60)</code>.' }; } },

  { md: '<h2>Part 2. <code>if</code>: the first-base umpire ⚾</h2>A runner races to first base, and the fielder throws the ball there. Whoever gets there first wins. Read the code like a sentence: <b>"if the runner\'s time is smaller than the throw\'s time, say Safe!"</b>' },
  { skill: 'ifelse', kind: 'run', task: 'Run it. Three new things: <code>if</code> starts a question. The <b>colon</b> <code>:</code> at the end means "here is what to do". And the line underneath is pushed right with <b>4 spaces</b> (an <b>indent</b>), which shows it belongs to the <code>if</code>.',
    code: 'runner_time = 4.1   # seconds from home plate to first base\nthrow_time = 4.3    # seconds until the ball is in the first baseman\'s glove\n\nif runner_time < throw_time:\n    print("Safe! 🙌")',
    ok: 'Safe! 4.1 is smaller than 4.3, so the answer is True and Python did the line underneath. If the answer were False, Python would skip it.' },
  { skill: 'ifelse', kind: 'boom', expectError: 'SyntaxError', task: 'What if we forget the colon? Run it. It shows a red error <b>on purpose</b>.',
    code: 'if runner_time < throw_time\n    print("Safe! 🙌")',
    ok: '<code>SyntaxError: expected \':\'</code>. Python tells you exactly what is missing: the colon.' },
  { skill: 'ifelse', kind: 'boom', expectError: 'IndentationError', task: 'And what if we forget the indent? Run it. Another error <b>on purpose</b>.',
    code: 'if runner_time < throw_time:\nprint("Safe! 🙌")',
    ok: '<code>IndentationError</code>: Python saw the colon, so it expected a line pushed to the right underneath. Without the push, it cannot tell which lines belong to the <code>if</code>.' },
  { skill: 'ifelse', kind: 'run', task: '<code>else</code> means <b>"otherwise"</b>. It runs only when the <code>if</code> question was False. It has a colon too, and its line is indented too. <b>Guess the call</b>, then run it.',
    code: 'runner_time = 4.5\nthrow_time = 4.3\n\nif runner_time < throw_time:\n    print("Safe! 🙌")\nelse:\n    print("Out! ✊")',
    ok: 'Out! 4.5 is not smaller than 4.3, so Python skipped the <code>if</code> line and did the <code>else</code> line.' },
  { skill: 'ifelse', kind: 'turn', task: '<b>Be the umpire.</b> Both times are 4.3: a tie! Fans say "tie goes to the runner", but our bot says Out. Fix it by changing <b>one symbol</b> in the <code>if</code> line. Do not change the numbers.',
    code: 'runner_time = 4.3\nthrow_time = 4.3\n\nif runner_time < throw_time:\n    print("Safe! 🙌")\nelse:\n    print("Out! ✊")',
    hints: ['Right now the bot asks "is the runner\'s time <b>smaller</b>?" On a tie it is not smaller.', 'Which symbol means "at most": smaller, <b>or the same</b>?', 'The <code>if</code> line should read: <code>if runner_time &lt;= throw_time:</code>'],
    check: async ({ code, out, g }) => {
      const c = code.replace(/#.*/g, '');
      if ((await g('runner_time')) !== (await g('throw_time'))) return { msg: 'Keep both times the same, <code>4.3</code> and <code>4.3</code>. A tie is the whole point! Change only the symbol in the <code>if</code> line.' };
      if (/if\s+throw_time\s*>=\s*runner_time\s*:/.test(c) && out.includes('Safe')) return { ok: true, msg: 'Safe! You turned the question around, and it works: the throw was not faster. Most umpires say it the other way: <code>runner_time &lt;= throw_time</code>.' };
      if (/if\s+runner_time\s*==\s*throw_time/.test(c)) return { msg: 'With <code>==</code> the runner is safe <b>only</b> on an exact tie. A faster runner would be called out! Use the symbol that means "smaller, or the same".' };
      if (/if\s+runner_time\s*>=\s*throw_time/.test(c)) return { msg: 'Careful: <code>&gt;=</code> makes the <b>slower</b> runner safe. We want "smaller, or the same".' };
      if (!/if\s+runner_time\s*<=\s*throw_time\s*:/.test(c)) return { msg: out.includes('Out') ? 'The bot still says Out. In the <code>if</code> line, change <code>&lt;</code> to the symbol that means "at most".' : 'Change only one thing: the <code>&lt;</code> in the <code>if</code> line becomes the symbol for "at most".' };
      if (!out.includes('Safe')) return { msg: 'The <code>if</code> line is right, but the bot did not say Safe. Keep the <code>print</code> lines as they were.' };
      return { ok: true, msg: 'Safe! Tie goes to the runner. One symbol, <code>&lt;=</code>, changed the call. That is how careful umpires and programmers have to be.' }; } },

  { md: '<h2>Part 3. <code>elif</code>: how far did it go? 🏟️</h2>The batter hits a fly ball. Our ballpark has <b>three</b> possible calls, and two choices are not enough. For more we use <b><code>elif</code></b>, short for "else if": <i>otherwise, if…</i> The rules (our wall is 400 feet away): 400 feet or more is a <b>home run</b>. Otherwise, 300 feet or more is a deep hit into the outfield: <b>extra bases</b>. Otherwise an outfielder <b>catches it</b>.' },
  { skill: 'elif', kind: 'run', task: '<b>Guess the call</b> for a 250-foot fly ball, then run it.',
    code: 'distance = 250   # feet\n\n' + FLY,
    ok: 'Caught! Python asks the questions <b>from top to bottom</b>. 250 is not at least 400, and not at least 300, so nothing was True and it did the <code>else</code>.' },
  { skill: 'elif', kind: 'quiz', task: '<b>Tricky.</b> The ball flies 450 feet. Both of the first two rules are True: 450 is at least 400 <b>and</b> at least 300. What does Python print?',
    code: 'distance = 450\n\n' + FLY,
    opts: ['Home run! 💣', 'Over their heads! Extra bases 🏃', 'both lines'], a: 0,
    tips: ['', 'That rule is True too, but Python never gets to it. It reads from the top, and an earlier rule is already True.', 'Only one line prints. After the first True, Python skips everything below it.'],
    ok: 'Home run! The <b>first</b> True wins, and Python skips the rest. So the order of the rules matters: if the 300-foot rule came first, a 450-foot blast would be called "extra bases"!' },
  { skill: 'elif', kind: 'turn', task: 'Your turn: hit one <b>over the outfielders\' heads</b>, but not out of the park. Change <b>only the number</b> so the bot calls extra bases.',
    code: 'distance = 250   # change this number\n\n' + FLY,
    hints: ['Home runs start at 400 feet. Extra bases start at 300 feet.', 'Any number from 300 to 399 works. Try <code>distance = 350</code>.'],
    check: async ({ g, out }) => {
      const d = (await g('distance'));
      if (typeof d !== 'number') return { msg: 'The distance is a number, so it needs no quotes: <code>distance = 350</code>.' };
      if (d === 250) return { msg: 'Still 250 feet, and the outfielder caught it. Hit it farther: change the number on line 1.' };
      if (d >= 400) return { msg: `${d} feet is a home run: the first rule, <code>distance &gt;= 400</code>, is True, so Python stops there. Pick a number below 400.` };
      if (d < 300) return { msg: `${d} feet is not at least 300, so both rules are False and the outfielder catches it. Hit it a little farther.` };
      if (!out.includes('Extra bases')) return { msg: 'The rules under line 1 changed. Keep them as they were and change only the number.' };
      return { ok: true, msg: `${d} feet: over their heads! The first rule was False, the second was True, so Python stopped at <code>elif</code>.` }; } },

  { md: '<h2>Part 4. Rate a player\'s best season ⭐</h2>Let\'s use <code>if</code> on MLB stats: batters\' seasons from 1871 to 2026, the same table as in Lab 2. One row is one player in one season, and <code>HR</code> is home runs.' },
  { skill: 'elif', kind: 'run', data: true, task: 'Run it to load the table <code>stats</code>.',
    code: 'import pandas as pd\n\nstats = pd.read_csv("mlb_batting.csv").convert_dtypes()\nprint("Ready!", len(stats), "rows: one player in one season")',
    ok: 'Loaded! Now the umpire bot can look at MLB seasons.' },
  { skill: 'elif', kind: 'run', data: true, task: 'This box finds a player\'s best home run season, like in Lab 2, and then <b>rates</b> it: 50 or more is a monster season, 30 or more is a big power season. <b>Guess the rating</b>, then run it.',
    code: 'name = "Aaron Judge"\n\n' + RATE + 'elif' + RATE_END,
    ok: 'Aaron Judge\'s best season is 62 home runs. 62 is at least 50, so the first rule was True and Python stopped there: MONSTER SEASON!' },
  { skill: 'elif', kind: 'turn', data: true, task: 'Two jobs. <b>1.</b> Change the name to your favorite <b>hitter</b>, spelled exactly right. <b>2.</b> One word is missing: the one that means "else if". It is 4 letters. Write it in place of <code>___</code>.<br>🔎 <b>Google it:</b> <code>python else if</code><br>See a red <code>TypeError</code>? Then <code>best</code> is empty (<code>&lt;NA&gt;</code>): Python found no seasons for that name. Check the spelling.',
    code: 'name = "Aaron Judge"   # change to your favorite hitter\n\n' + RATE + '___' + RATE_END,
    hints: ['The missing word is short for "else if": 4 letters, starting with <code>el</code>.', 'That line should read <code>elif best &gt;= 30:</code>', 'A red TypeError means the name was not found. Capital letters matter, there are no accent marks, and sons end in Jr.: <code>"Vladimir Guerrero Jr."</code>'],
    check: async ({ code, g, q }) => {
      const c = code.replace(/#.*/g, '');
      if (/^if\s+best\s*>=\s*30/m.test(c)) return { msg: 'With a second <code>if</code>, Python asks <b>both</b> questions, so a 62-homer season would get two ratings. Use the 4-letter word that means "else if".' };
      if (!/^elif\s+best\s*>=\s*30\s*:/m.test(c)) return { msg: 'The line in the middle should start with the 4-letter word for "else if", and nothing else should change: <code>elif best &gt;= 30:</code>' };
      const n = (await g('name'));
      if (n === 'Aaron Judge') return { msg: 'The missing word is right! Now job 1: change the name on line 1 to your own favorite hitter.' };
      const b = (await q('int(best)'));
      return { ok: true, msg: `${esc(String(n))}: best season ${b} home runs. ` + (b >= 50 ? 'The first rule was True, so Python stopped at the top.' : b >= 30 ? 'The first rule was False and the <code>elif</code> rule was True.' : 'Both rules were False, so Python went all the way down to <code>else</code>.') + ' Your bot rates any hitter in history now.' }; } },

  { md: '<h2>Part 5. Inside the <code>compare</code> machine 🔧</h2>Remember <code>compare</code> from Lab 2? Now you can read it. <code>def</code> teaches Python a new command that needs two players and a stat. Read the <code>total1</code> line from the inside out: ask every row "is this player 1?", keep the rows that said True, take the <code>stat</code> column, and <code>.sum()</code> adds it up. Then <code>if</code> and <code>else</code> pick the winner. Lines inside the machine are pushed in once (4 spaces). The <code>print</code> lines under <code>if</code> and <code>else</code> are inside the machine <b>and</b> inside the decision, so they are pushed in twice (8 spaces).' },
  { skill: 'machine', kind: 'run', data: true, task: '<b>The test:</b> compare Aaron Judge with… Aaron Judge. The numbers are exactly the same. What <b>should</b> the machine say? Run it and see what it <b>does</b> say.',
    code: DEF + DEF_END + '\n\ncompare("Aaron Judge", "Aaron Judge", "HR")',
    ok: '🐞 You found a bug! 386 against 386, and it still names a winner. When the totals are the same, <code>total1 &gt; total2</code> is False, so the machine jumps to <code>else</code>. But it is a tie!' },
  { skill: 'machine', kind: 'turn', data: true, task: '<b>Fix the machine.</b> Replace the line <code># add your two lines here</code> with these two lines. The first has 4 spaces in front, the second has 8:<pre>    elif total1 == total2:\n        print("It\'s a tie! 🤝")</pre>The <code>elif</code> must sit after the <code>if</code> and before the <code>else</code>.',
    code: DEF + '    # add your two lines here\n' + DEF_END + '\n\ncompare("Aaron Judge", "Aaron Judge", "HR")\ncompare("Pete Alonso", "Kyle Schwarber", "HR")',
    hints: ['Type the two lines exactly where the <code>#</code> line is. The word <code>elif</code> should line up under the word <code>if</code>.', 'A red IndentationError? Count the spaces: 4 before <code>elif</code>, 8 before <code>print</code>.', 'The middle of the machine should read:<br><code>&nbsp;&nbsp;&nbsp;&nbsp;elif total1 == total2:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print("It\'s a tie! 🤝")</code>'],
    check: async ({ code, q }) => {
      const c = code.replace(/#.*/g, '');
      const tie = (await q('_says(compare, "Aaron Judge", "Aaron Judge", "HR")')), real = (await q('_says(compare, "Kyle Schwarber", "Pete Alonso", "HR")')), back = (await q('_says(compare, "Pete Alonso", "Kyle Schwarber", "HR")'));
      if (!/elif/.test(c) && tie.includes('Winner')) return { msg: 'The machine still names a winner when the totals are the same. Replace the <code>#</code> line with the two new lines: <code>elif total1 == total2:</code> and its <code>print</code>.' };
      if (tie.includes('Winner')) return { msg: 'Still a winner on a tie. The question must be <code>total1 == total2</code>, with two equals signs, and the line must end with a colon.' };
      if (real.includes('Winner: Pete Alonso') || !real.includes('Winner: Kyle Schwarber') || !back.includes('Winner: Kyle Schwarber')) return { msg: 'The tie works, but now a normal matchup goes wrong. Use <code>elif</code>, not a second <code>if</code>, and keep the <code>if</code> and <code>else</code> lines as they were.' };
      if (tie.split('\n').length < 3) return { msg: 'On a tie the machine now says nothing. Under your <code>elif</code> line add: <code>print("It\'s a tie! 🤝")</code> with 8 spaces in front.' };
      return { ok: true, msg: 'It\'s a tie! You found a bug in a machine and fixed it. And the matchup from the stats still works: Kyle Schwarber 385, Pete Alonso 307. Great call, Umpire!' }; } }
];
const REVIEW = [
  { skill: 'yesno', q: 'What prints?', code: 'print(7 >= 7)', opts: ['True', 'False', '7'], a: 0 },
  { skill: 'yesno', q: 'Which symbol asks "is it smaller, or the same"?', opts: ['<', '<=', '=='], a: 1 },
  { skill: 'ifelse', q: 'What is wrong here?', code: 'if runner_time < throw_time\n    print("Safe!")', opts: ['the colon is missing after the if line', 'the quotes are wrong', 'nothing is wrong'], a: 0 },
  { skill: 'ifelse', q: 'What prints?', code: 'strikes = 2\nif strikes >= 3:\n    print("Out")\nelse:\n    print("Still batting")', opts: ['Out', 'Still batting', 'both lines'], a: 1 },
  { skill: 'elif', q: 'What prints?', code: 'hr = 55\nif hr >= 30:\n    print("Big")\nelif hr >= 50:\n    print("Monster")\nelse:\n    print("Solid")', opts: ['Big', 'Monster', 'Big and Monster'], a: 0 },
  { skill: 'machine', q: 'In compare, the totals are the same. Why did the old machine pick player 2?', opts: ['player 2 is always better', 'total1 > total2 is False, so Python went to else', 'Python picks a winner by chance'], a: 1 }
];

registerLab('mlb', 3, {
  title: 'Umpire Bot',
  skills: SKILLS, cells: CELLS, review: REVIEW,
  data: ['mlb_batting.csv'],
  setup: `
def _says(machine, *args):
    import io, contextlib
    box = io.StringIO()
    with contextlib.redirect_stdout(box):
        machine(*args)
    return box.getvalue().strip()
`
});
})();
