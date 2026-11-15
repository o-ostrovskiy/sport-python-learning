// One lab = one file. See labs/README.md for the format.
// Site version of football/Football_Lab_3.ipynb (Referee Bot). Data: data/nfl_games.csv (built by _build/build_site_nfl_games.py).
(() => {
const SKILLS3 = { compare: 'Yes-or-no questions', ifelse: 'if and else', elif: 'elif: three choices', debug: 'Reading and fixing a machine' };
const REF = `if yards_gained >= yards_to_go:
    print("First down! 🏈")
else:
    print("Not yet. Next down!")`;
const COACH = `if yards_to_go <= 1:
    print("Go for it! 💪")
elif yards_to_end_zone <= 35:
    print("Kick a field goal! 🥅")
else:
    print("Punt it away. 🦵")`;
const TOP = `def compare(player1, player2, stat):
    total1 = stats[stats["player_display_name"] == player1][stat].sum()
    total2 = stats[stats["player_display_name"] == player2][stat].sum()
    print(player1, ":", total1)
    print(player2, ":", total2)
    if total1 > total2:
        print("Winner:", player1, "🏆")
`;
const BOTTOM = `    else:
        print("Winner:", player2, "🏆")
`;
const LAB3 = [
  { md: '<h2>Part 1. Yes or no? 🤔</h2>Referees and coaches make decisions all game long: <i>Is it a first down? Should we punt?</i> Today you teach Python to make decisions too.<br><br>Remember from Lab 2: Python answers yes-or-no questions with <code>True</code> (yes) or <code>False</code> (no). They start with a capital letter and have <b>no quotes</b>.' },
  { skill: 'compare', kind: 'run', task: '<code>&gt;</code> asks "is it <b>bigger than</b>?" <b>Guess first:</b> what will these two lines show? Then run it.',
    code: 'print(10 > 7)\nprint(3 > 7)',
    ok: 'Is 10 bigger than 7? Yes: <code>True</code>. Is 3 bigger than 7? No: <code>False</code>.' },
  { md: 'The question symbols:<br><code>&gt;</code> is it bigger than?<br><code>&lt;</code> is it smaller than?<br><code>&gt;=</code> is it <b>at least</b>? (bigger, or the same)<br><code>&lt;=</code> is it <b>at most</b>? (smaller, or the same)<br><code>==</code> is it the same? (two <code>=</code>, from Lab 2)' },
  { skill: 'compare', kind: 'quiz', task: 'A first down needs <b>at least</b> 10 yards. The team gained <b>exactly</b> 10. Which line says <code>True</code>?',
    code: 'yards_to_go = 10\nyards_gained = 10\n\nprint(yards_gained > yards_to_go)\nprint(yards_gained >= yards_to_go)',
    opts: ['the first one, with >', 'the second one, with >=', 'both of them'], a: 1,
    tips: ['<code>10 &gt; 10</code> asks: is 10 <b>bigger</b> than 10? No. They are the same.', '', 'Not both. <code>10 &gt; 10</code> is False: 10 is not bigger than itself.'],
    ok: 'Right. <code>10 &gt; 10</code> is False, but <code>10 &gt;= 10</code> is True: 10 is <b>at least</b> 10. That is why referees say "at least", and so will we.' },
  { skill: 'compare', kind: 'turn', task: 'Patrick Mahomes threw <b>50</b> touchdown passes in 2018. Is that <b>at least</b> 50? Put the right symbol in place of <code>___</code>. It is two symbols: "bigger than" and "the same".',
    code: 'mahomes_tds = 50\n\nprint(mahomes_tds ___ 50)',
    hints: ['Look at the list of question symbols above. Which one means "at least"?', 'The line should read: <code>print(mahomes_tds &gt;= 50)</code>'],
    check: ({ code, out }) => {
      if (/mahomes_tds\s*>=\s*50/.test(code) && out.includes('True')) return { ok: true, msg: 'True! 50 is at least 50. Mahomes hit it exactly.' };
      if (/mahomes_tds\s*=>\s*50/.test(code)) return { msg: 'So close: the symbols are in the wrong order. "Bigger than" comes first, then "the same": <code>&gt;=</code>.' };
      if (/mahomes_tds\s*==\s*50/.test(code)) return { msg: '<code>==</code> asks "is it exactly the same?". That says True here, but it would say False for 51. We want "at least": bigger, <b>or</b> the same.' };
      if (/mahomes_tds\s*<=\s*50/.test(code)) return { msg: '<code>&lt;=</code> means "at most": smaller, or the same. We want "at least": <b>bigger</b>, or the same.' };
      if (/mahomes_tds\s*>\s*50/.test(code)) return { msg: 'That says False: 50 is not <b>bigger</b> than 50. Add the "or the same" part right after the <code>&gt;</code>.' };
      return { msg: 'We want the symbol for "at least". It is two symbols typed together: bigger than, then the same.' }; } },

  { md: '<h2>Part 2. <code>if</code>: the first-down referee 🏈</h2>Now Python makes a decision. Read the code like a sentence: <b>"if the yards gained are at least the yards to go, say First down!"</b><br><br><code>if</code> starts a question. If the answer is <code>True</code>, Python does what is underneath. If it is <code>False</code>, Python skips it. The <b>colon</b> <code>:</code> at the end means "here is what to do". The line underneath is pushed to the right with <b>4 spaces</b>. That push is called an <b>indent</b>: it shows Python which lines belong to the <code>if</code>.' },
  { skill: 'ifelse', kind: 'run', task: '<b>Guess first:</b> 12 yards gained, 10 to go. What will the referee say? Then run it.',
    code: 'yards_to_go = 10\nyards_gained = 12\n\nif yards_gained >= yards_to_go:\n    print("First down! 🏈")',
    ok: '12 is at least 10, so the answer is True and Python ran the line under the <code>if</code>.' },
  { skill: 'ifelse', kind: 'boom', expectError: 'SyntaxError', task: 'What if we forget the colon? Run it. It shows a red error <b>on purpose</b>.',
    code: 'yards_to_go = 10\nyards_gained = 12\n\nif yards_gained >= yards_to_go\n    print("First down! 🏈")',
    ok: '<code>SyntaxError: expected \':\'</code>. Python tells you exactly what is missing: the colon at the end of the <code>if</code> line.' },
  { skill: 'ifelse', kind: 'boom', expectError: 'IndentationError', task: 'And what if we forget the indent? Run it. Another red error <b>on purpose</b>.',
    code: 'yards_to_go = 10\nyards_gained = 12\n\nif yards_gained >= yards_to_go:\nprint("First down! 🏈")',
    ok: '<code>IndentationError</code>. Python saw the colon, so it expected a line pushed to the right underneath. Without the push it cannot tell which lines belong to the <code>if</code>.' },
  { skill: 'ifelse', kind: 'run', task: '<code>else</code> means <b>"otherwise"</b>. It runs only when the <code>if</code> question was <code>False</code>. It has a colon too, and its line is indented too. <b>Guess first:</b> 7 yards gained, 10 to go.',
    code: 'yards_to_go = 10\nyards_gained = 7\n\n' + REF,
    ok: '7 is not at least 10, so Python skipped the <code>if</code> part and did the <code>else</code> part.' },
  { skill: 'ifelse', kind: 'turn', task: '<b>Be the referee.</b> It is 3rd and 2, and the runner gains 3 yards. Change <b>only the two numbers</b>: <code>yards_to_go = 2</code> and <code>yards_gained = 3</code>. Guess the call before you run it!',
    code: 'yards_to_go = 10    # change this number\nyards_gained = 7    # change this number\n\n' + REF,
    hints: ['Change the 10 on line 1 to 2, and the 7 on line 2 to 3. Leave everything else.'],
    check: ({ g, out }) => {
      const tg = g('yards_to_go'), yg = g('yards_gained');
      if (tg === 10 && yg === 7) return { msg: 'Those are still the old numbers. Make line 1 <code>yards_to_go = 2</code> and line 2 <code>yards_gained = 3</code>.' };
      if (tg !== 2) return { msg: `<code>yards_to_go</code> is ${esc(String(tg))}. It is 3rd and 2, so it should be 2.` };
      if (yg !== 3) return { msg: `<code>yards_gained</code> is ${esc(String(yg))}. The runner gained 3 yards.` };
      if (!out.includes('First down')) return { msg: 'The numbers are right, but the referee is silent. Keep the <code>if</code> and <code>else</code> lines the way they were.' };
      return { ok: true, msg: 'First down, with only 3 yards! The referee does not care about 10. He only asks: is the gain at least the yards to go? Try 10 and 9 too, for fun.' }; } },

  { md: '<h2>Part 3. <code>elif</code>: the 4th-down coach 🧢</h2>It is 4th down. The coach has <b>three</b> choices: go for it, kick a field goal, or punt. For more than two choices we use <code>elif</code>, short for "else if": <i>otherwise, if…</i><br><br>Our coach bot\'s rules: 1 yard or less to go, <b>go for it</b>. Otherwise, 35 yards or less from the end zone, <b>kick a field goal</b>. Otherwise, <b>punt</b>.' },
  { skill: 'elif', kind: 'run', task: '<b>Guess first:</b> 1 yard to go, 60 yards from the end zone. What does the coach say?',
    code: 'yards_to_go = 1\nyards_to_end_zone = 60\n\n' + COACH,
    ok: 'Python asks the questions <b>from top to bottom</b>. The <b>first</b> True wins, and Python skips everything below it. If nothing is True, it does the <code>else</code>.' },
  { skill: 'elif', kind: 'quiz', task: '<b>Tricky one.</b> 1 yard to go, and only 20 yards from the end zone. <b>Both</b> of the first two rules are True! What does the coach say?',
    code: 'yards_to_go = 1\nyards_to_end_zone = 20\n\n' + COACH,
    opts: ['Go for it! 💪', 'Kick a field goal! 🥅', 'both lines, one after the other'], a: 0,
    tips: ['', 'The field goal rule is True, but Python never gets to it. It checks from the top, and an earlier rule is already True.', 'Only one part of an if / elif / else ever runs: the first one that is True.'],
    ok: 'Go for it! The first rule is True, so Python never even looks at the field goal rule. <b>The order of the rules matters.</b>' },
  { skill: 'elif', kind: 'turn', task: '<b>Coach a play.</b> Change <b>only the two numbers</b> so the bot says <b>Kick a field goal!</b>',
    code: 'yards_to_go = 1          # change this number\nyards_to_end_zone = 60   # change this number\n\n' + COACH,
    hints: ['The field goal rule needs <code>yards_to_end_zone</code> to be 35 or less. But the first rule must be False, or it wins.', 'Try <code>yards_to_go = 8</code> and <code>yards_to_end_zone = 20</code>.'],
    check: ({ g, out }) => {
      if (out.includes('field goal')) return { ok: true, msg: `Field goal! With ${esc(String(g('yards_to_go')))} yards to go the first rule was False, so Python moved on, and ${esc(String(g('yards_to_end_zone')))} is at most 35. (Real coaches also think about the score and the clock.)` };
      if (out.includes('Go for it')) return { msg: `The bot says "Go for it", because <code>yards_to_go</code> is ${esc(String(g('yards_to_go')))}: that is 1 or less, and the first rule wins. Make <code>yards_to_go</code> bigger than 1.` };
      if (out.includes('Punt')) return { msg: `The bot punts: ${esc(String(g('yards_to_end_zone')))} yards is too far for a kick. Make <code>yards_to_end_zone</code> 35 or less.` };
      return { msg: 'The bot said nothing. Keep the <code>if</code>, <code>elif</code> and <code>else</code> lines and change only the two numbers.' }; } },
  { md: 'Now let\'s use <code>if</code> on real stats: we find a player\'s best game, like in Lab 2, and then <b>rate</b> it. 200 yards or more is a monster game, 100 or more is a big game.' },
  { skill: 'elif', kind: 'run', data: true, task: 'First load the table, the same way as in Lab 2. Run it.',
    code: 'import pandas as pd\n\nstats = pd.read_csv("nfl_games.csv", low_memory=False)\nstats = stats[stats["season_type"] == "REG"]\nprint("Ready!", len(stats), "rows loaded")',
    ok: 'Loaded! One row is one player in one game.' },
  { skill: 'elif', kind: 'turn', data: true, task: 'Two jobs. <b>1.</b> Change the name to your favorite <b>receiver or tight end</b>. <b>2.</b> One word is missing: the one that means "else if". It is 4 letters. Type it in place of <code>___</code>. (Running back? Also change <code>"receiving_yards"</code> to <code>"rushing_yards"</code>.)',
    code: 'name = "Travis Kelce"   # change to your favorite receiver or tight end\n\ngames = stats[stats["player_display_name"] == name]\nbest = games["receiving_yards"].max()\nprint(name, "best game:", best, "yards")\n\nif best >= 200:\n    print("MONSTER GAME! 🔥")\n___ best >= 100:\n    print("Big game! 💥")\nelse:\n    print("Solid, but no 100-yard game yet.")',
    hints: ['The missing word is short for "else if": the first 2 letters of "else", then "if".', 'That line should read: <code>elif best &gt;= 100:</code>', 'Then change the name on line 1, like <code>name = "Justin Jefferson"</code>.'],
    check: ({ code, g, q, out }) => {
      const n = g('name');
      if (!/^elif\s+best\s*>=\s*100\s*:/m.test(code)) return { msg: 'Check the line that had the <code>___</code>. The word that means "else if" has 4 letters, and the line still ends with a colon.' };
      if (!q('len(games)')) return { msg: `It says "nan yards". <code>nan</code> means <b>empty</b>: Python found no games for "${esc(String(n))}", so the rating is wrong. Check the spelling. Capital letters matter.` };
      if (n === 'Travis Kelce') return { msg: 'The <code>elif</code> is right: Kelce\'s best is 191 yards, a big game. Now change the name on line 1 to your own player.' };
      const b = q('int(best)');
      return { ok: true, msg: `${esc(String(n))}'s best game: ${b} yards. ${out.includes('MONSTER') ? 'A monster game!' : out.includes('Big game') ? 'A big game!' : 'No 100-yard game yet.'} Python checked 200 first, then 100, top to bottom.` }; } },

  { md: '<h2>Part 4. Inside the <code>compare</code> machine 🔧</h2>Remember <code>compare</code> from Lab 2? Now you can read it.<br><br><code>def compare(player1, player2, stat):</code> teaches Python a new command that needs two players and a stat.<br>The <code>total1</code> line, from the inside out: ask every row "is this player 1?", keep the True rows, take the <code>stat</code> column, <code>.sum()</code> adds it up, and <code>=</code> puts the answer in <code>total1</code>.<br>Then <code>if</code> and <code>else</code> pick the winner. Their <code>print</code> lines are inside the machine <b>and</b> inside the decision, so they are pushed in twice: 8 spaces.' },
  { skill: 'debug', kind: 'run', data: true, task: '<b>The test:</b> compare Tom Brady with… Tom Brady. The numbers are exactly the same. What <b>should</b> the machine say? Run it and see what it <b>does</b> say.',
    code: TOP + BOTTOM + '\ncompare("Tom Brady", "Tom Brady", "passing_tds")',
    ok: '🐞 You found a <b>bug</b>! When the totals are the same, <code>total1 &gt; total2</code> is False, so the machine goes to <code>else</code> and picks player 2 as the winner. But it is a tie!' },
  { skill: 'debug', kind: 'turn', data: true, task: '<b>Fix the machine.</b> Replace the line <code># add your two lines here</code> with these two lines. The first has 4 spaces in front, the second has 8:<br><code>&nbsp;&nbsp;&nbsp;&nbsp;elif total1 == total2:</code><br><code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;print("It\'s a tie! 🤝")</code>',
    code: TOP + '    # add your two lines here\n' + BOTTOM + '\ncompare("Tom Brady", "Tom Brady", "passing_tds")',
    hints: ['<code>elif</code> has to come after the <code>if</code> part and before <code>else</code>. That is exactly where the note is.', 'The <code>elif</code> line starts under the <code>i</code> of <code>if</code> (4 spaces). Its <code>print</code> starts under the other <code>print</code> lines (8 spaces).', 'Two equals signs: <code>elif total1 == total2:</code> asks "are they the same?"'],
    check: ({ code, out }) => {
      if (/tie/i.test(out) && !out.includes('Winner')) return { ok: true, msg: 'It\'s a tie! You found a bug and fixed it, like a real programmer. The <code>elif</code> sits between <code>if</code> and <code>else</code>, so Python checks it before giving up and picking player 2. 🎉' };
      if (!/elif/.test(code)) return { msg: 'The machine still picks Tom Brady over Tom Brady. Replace the <code># add your two lines here</code> line with the <code>elif</code> line and its <code>print</code> line.' };
      if (/elif\s+total1\s*>=?\s*total2/.test(code)) return { msg: 'Your <code>elif</code> asks "is it bigger?". For a tie we ask "are they the same?": <code>elif total1 == total2:</code>' };
      if (/tie/i.test(out)) return { msg: 'It says tie <b>and</b> a winner. The tie <code>print</code> must be under the <code>elif</code>, pushed in 8 spaces, and the old <code>print</code> lines stay where they were.' };
      return { msg: 'The <code>elif</code> is there, but the machine still does not say tie. Check that it reads <code>elif total1 == total2:</code> and that the <code>print("It\'s a tie! 🤝")</code> line is right under it.' }; } },
  { skill: 'debug', kind: 'run', data: true, task: 'One real matchup to finish, with your fixed machine. <b>Guess first:</b> who has more rushing yards?',
    code: 'compare("Derrick Henry", "Adrian Peterson", "rushing_yards")',
    ok: 'Adrian Peterson, 14,921 yards to 11,423 (through the 2024 season). But Henry is still playing! If a total ever says 0, check the spelling of the name.' }
];
const REVIEW3 = [
  { skill: 'compare', q: 'What prints?', code: 'print(7 >= 7)', opts: ['True', 'False', '7'], a: 0 },
  { skill: 'compare', q: 'Which symbol means "at most" (smaller, or the same)?', opts: ['<', '>=', '<='], a: 2 },
  { skill: 'ifelse', q: 'What prints?', code: 'yards = 4\nif yards >= 10:\n    print("First down!")\nelse:\n    print("Not yet.")', opts: ['First down!', 'Not yet.', 'nothing at all'], a: 1 },
  { skill: 'ifelse', q: 'What is missing from this line?', code: 'if yards >= 10\n    print("First down!")', opts: ['quotes around yards', 'a colon at the end of the if line', 'nothing, it is fine'], a: 1 },
  { skill: 'elif', q: 'What prints?', code: 'best = 250\nif best >= 100:\n    print("Big game!")\nelif best >= 200:\n    print("MONSTER GAME!")', opts: ['Big game!', 'MONSTER GAME!', 'both lines'], a: 0 },
  { skill: 'debug', q: 'The totals are the same. Which line catches the tie?', opts: ['elif total1 = total2:', 'elif total1 == total2:', 'else total1 == total2:'], a: 1 }
];

registerLab('nfl', 3, {
  title: 'Referee Bot',
  skills: SKILLS3, cells: LAB3, review: REVIEW3,
  data: ['nfl_games.csv']
});
})();
