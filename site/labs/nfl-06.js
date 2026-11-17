// One lab = one file. See labs/README.md for the format.
// Site version of football/Football_Lab_6.ipynb (Build Your Own Machine).
(() => {
const SKILLS6 = { build: 'def: build a machine', inputs: 'Inputs (parameters)', ret: 'return hands back', team: 'Machines working together' };
const CHEER = 'def cheer(team):\n    print("Go,", team, "!")\n    print(team, "fans go wild!")\n';
const PLAYERS3 = '["Saquon Barkley", "Derrick Henry", "Ja\'Marr Chase"]';
const COMPARE_BODY = `    total1 = career_total(player1, stat)
    total2 = career_total(player2, stat)
    print(player1, ":", total1)
    print(player2, ":", total2)
    if total1 > total2:
        ___ player1
    elif total1 == total2:
        return "Nobody! It's a tie"
    else:
        return player2

winner = compare("Tom Brady", "Peyton Manning", "passing_tds")
print("Winner:", winner, "🏆")`;
const LAB6 = [
  { md: '<h2>Part 1. Your first machine 📣</h2>You have been using machines other people built: <code>print( )</code>, <code>len( )</code>, <code>speed_mph( )</code>, <code>compare( )</code>. Today you build <b>your own</b>. Programmers call a machine a <b>function</b>.<br><br>Why? So you write the hard lines <b>once</b>, give them a name, and then use them again and again with one short line.' },
  { skill: 'build', kind: 'run', task: '<b>Guess first:</b> what will this box show when you run it?',
    code: 'def cheer():\n    print("TOUCHDOWN!")\n    print("The crowd goes wild!")',
    ok: 'Nothing! That is not a mistake. This box only <b>builds</b> the machine. <code>def</code> is short for "define": "Python, learn a new command". <code>cheer</code> is the name you gave it. The indented lines are what is <b>inside</b> the machine.' },
  { skill: 'build', kind: 'predict', task: 'To switch the machine on, write its name with round brackets. Programmers say "<b>call</b> the machine". <b>Guess first:</b> how many lines will this show? Type a number, then run it.',
    code: 'cheer()\ncheer()',
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 4, msg: (+guess === 4 ? 'Four lines, you got it! ' : `You guessed ${esc(guess)}, but it shows 4 lines. `) + 'Each <code>cheer()</code> runs <b>both</b> lines inside the machine. You wrote the cheer once, and you can use it as often as you like.' }) },
  { skill: 'build', kind: 'boom', expectError: 'NameError', task: '<b>Build first, then use.</b> What if we call a machine Python has never learned? Run it. It shows a red error <b>on purpose</b>.',
    code: 'celebrate()',
    ok: 'A <code>NameError</code>, your old friend from Lab 2: Python found a name it does not know. Nobody has built a machine called <code>celebrate</code> yet.' },
  { md: 'Our cheer is always the same. Let\'s make it cheer for <b>any</b> team. We put an empty locker in the round brackets. It is called a <b>parameter</b>, and it gets filled each time you use the machine.' },
  { skill: 'inputs', kind: 'run', task: 'Run it. The machine is built once and called twice.',
    code: CHEER + '\ncheer("Vikings")\ncheer("Chiefs")',
    ok: '<code>cheer("Vikings")</code> puts "Vikings" into <code>team</code>, then runs the lines inside. <code>cheer("Chiefs")</code> does it again with "Chiefs". Like the locker in a <code>for</code> loop, Python fills it for you.' },
  { skill: 'inputs', kind: 'turn', task: 'Call the machine for <b>your</b> team. Change only the name inside the quotes on the last line.',
    code: CHEER + '\ncheer("Vikings")   # change to your team',
    hints: ['Only the last line changes. Keep the quotes: <code>cheer("Bills")</code>.'],
    check: async ({ code, out }) => {
      if (!/^cheer\s*\(/m.test(code)) return { msg: 'Keep the last line that calls the machine: <code>cheer("Your Team")</code>.' };
      if (!out.includes('Go,')) return { msg: 'The machine did not cheer. Keep the <code>def</code> lines at the top the way they were.' };
      if (/^Go, Vikings !$/m.test(out)) return { msg: 'It still cheers for the Vikings. Type your own team between the quotes on the last line.' };
      const t = (out.match(/^Go, (.*) !$/m) || [])[1] || 'your team';
      return { ok: true, msg: `Go, ${esc(t)}! Same machine, new input. You did not touch the lines inside it.` }; } },

  { md: '<h2>Part 2. <code>return</code>: the machine hands back an answer 🎁</h2>The <code>cheer</code> machine <b>shows</b> something. Most machines do a different job: they <b>work something out and hand the answer back</b>, like <code>len( )</code> hands back a number. The new word for that is <code>return</code>: "hand this back".' },
  { skill: 'ret', kind: 'run', task: 'A touchdown is 6 points. <b>Guess first:</b> what will the two lines show? Then run it.',
    code: 'def touchdown_points(touchdowns):\n    return touchdowns * 6\n\npoints = touchdown_points(3)\nprint("3 touchdowns:", points, "points")\nprint("5 touchdowns:", touchdown_points(5), "points")',
    ok: '<code>touchdown_points(3)</code> puts 3 in the locker, the machine makes 18, and <code>return</code> hands the 18 back to where the machine was called. Then <code>points =</code> stores it. You can keep the answer, print it, or do more math with it.' },
  { skill: 'ret', kind: 'quiz', task: 'This machine uses <code>print</code> <b>instead of</b> <code>return</code>. It shows 18 on the screen. But what does the <b>last line</b> show?',
    code: 'def show_points(touchdowns):\n    print(touchdowns * 6)\n\nanswer = show_points(3)\nprint("The machine handed back:", answer)',
    opts: ['The machine handed back: 18', 'The machine handed back: None', 'a red error'], a: 1,
    tips: ['The 18 was only <b>shown</b> on the screen. Nothing was handed back, so <code>answer</code> did not get it.', '', 'No error. The machine runs fine, it just hands back… nothing.'],
    ok: '<code>None</code> is Python\'s word for "nothing". <code>print</code> only shows; <code>return</code> hands the answer back. If you ever see <code>None</code> where you wanted a number, look for a missing <code>return</code>.' },
  { skill: 'inputs', kind: 'predict', task: 'A machine can have two inputs, with a comma between them. A field goal is 3 points. The first line shows 24. <b>Guess first:</b> what will the <b>second</b> line show? Type a number, then run it.',
    code: 'def score(touchdowns, field_goals):\n    return touchdowns * 6 + field_goals * 3\n\nprint(score(3, 2))\nprint(score(2, 3))',
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 21, msg: (+guess === 21 ? '21, exactly! ' : `You guessed ${esc(guess)}, Python says 21. `) + '<b>The order matters.</b> The first number goes into the first locker, the second into the second. <code>score(2, 3)</code> is 2 touchdowns and 3 field goals: 12 + 9.' }) },
  { skill: 'inputs', kind: 'turn', task: '<b>Upgrade the machine.</b> After a touchdown the kicker can add an <b>extra point</b> (1 point). Change two places: <b>1.</b> in the <code>def</code> line add a third locker, <code>extra_points</code>. <b>2.</b> at the end of the <code>return</code> line add <code>+ extra_points * 1</code>. The scoreboard should say <b>27</b>.',
    code: 'def score(touchdowns, field_goals):\n    return touchdowns * 6 + field_goals * 3\n\nprint(score(3, 2, 3))',
    hints: ['Right now the machine has 2 lockers but the last line hands it 3 things. That is the red error.', 'The <code>def</code> line becomes: <code>def score(touchdowns, field_goals, extra_points):</code>', 'The <code>return</code> line becomes: <code>return touchdowns * 6 + field_goals * 3 + extra_points * 1</code>'],
    check: async ({ code, out, q }) => {
      if (!/def\s+score\s*\([^)]*extra_points[^)]*\)\s*:/.test(code)) return { msg: 'Add the third locker in the <code>def</code> line: a comma, then <code>extra_points</code>, inside the round brackets.' };
      if (out.trim() === '24') return { msg: 'The locker is there, but the <code>return</code> line is not using it yet. Add <code>+ extra_points * 1</code> at the end of that line.' };
      if ((await q('score(1, 1, 1)')) !== 10 || (await q('score(3, 2, 3)')) !== 27) return { msg: `The scoreboard says ${esc(out.trim())}, we need 27. An extra point is worth 1, so add <code>+ extra_points * 1</code> to the <code>return</code> line.` };
      if (!out.includes('27')) return { msg: 'Keep the last line <code>print(score(3, 2, 3))</code> so we can see the score.' };
      return { ok: true, msg: '27, the same score as in Lab 1! Back then you typed the math by hand. Now a machine does it for any game.' }; } },

  { md: '<h2>Part 3. A fantasy points machine 🏆</h2>In fantasy football, players score points for you with their stats. Our rules for runners and receivers: <b>1 point for every 10 yards</b> (yards divided by 10: in Python <code>/</code> means "divided by") and <b>6 points for every touchdown</b>.' },
  { skill: 'ret', kind: 'run', task: 'In 2024 Saquon Barkley ran for <b>2,005</b> yards and <b>13</b> rushing touchdowns. <b>Guess first:</b> about how many points? Then run it.',
    code: 'def fantasy_points(yards, touchdowns):\n    return round(yards / 10 + touchdowns * 6, 1)\n\nprint(fantasy_points(2005, 13))',
    ok: '278.5 points: 200.5 for the yards plus 78 for the touchdowns. <code>round( …, 1)</code> keeps 1 number after the dot.' },
  { skill: 'team', kind: 'run', data: true, task: 'Typing stats by hand is slow. Run this to load the season file from Lab 4: one row is <b>one whole season</b> of one player.',
    code: 'import pandas as pd\n\nseasons = pd.read_csv("player_stats_season.csv", low_memory=False)\nseasons = seasons[seasons["season_type"] == "REG"]\nprint("Ready!", len(seasons), "seasons loaded")',
    ok: 'Loaded! Now the machine can look stats up by itself.' },
  { skill: 'team', kind: 'run', data: true, task: 'A bigger machine: give it a <b>name</b> and a <b>year</b>. It finds that season, adds running and catching together, then hands them to our first machine. <b>A machine can use another machine!</b>',
    code: 'def fantasy_season(name, year):\n    player = seasons[seasons["player_display_name"] == name]    # only this player (Lab 2)\n    row = player[player["season"] == year]                      # only this season\n    yards = row["rushing_yards"].sum() + row["receiving_yards"].sum()\n    touchdowns = row["rushing_tds"].sum() + row["receiving_tds"].sum()\n    return fantasy_points(yards, touchdowns)\n\nprint(fantasy_season("Saquon Barkley", 2024))',
    ok: '318.3, more than before: now it also counts the 278 yards and 2 touchdowns he got <b>catching</b> passes. The lockers <code>player</code>, <code>row</code>, <code>yards</code> and <code>touchdowns</code> live inside the machine. Only what comes after <code>return</code> gets out.' },
  { skill: 'team', kind: 'turn', data: true, task: 'A loop (Lab 5) can call the machine once for every player in a list. Put <b>your own</b> players in the list. Running backs, receivers and tight ends work best.',
    code: 'my_players = ["Saquon Barkley", "Derrick Henry", "Ja\'Marr Chase"]   # put your own players here\n\nfor name in my_players:\n    print(name, "scored", fantasy_season(name, 2024), "fantasy points in 2024")',
    hints: ['Change the names inside the quotes on line 1. Keep the commas between them.', 'Like this: <code>my_players = ["Bijan Robinson", "Jahmyr Gibbs", "Justin Jefferson"]</code>'],
    check: async ({ q, out }) => {
      if (!(await q('isinstance(my_players, list)'))) return { msg: 'Keep <code>my_players</code> a list: square brackets, names in quotes, commas between.' };
      if ((await q('my_players == ' + PLAYERS3))) return { msg: 'Henry beat Barkley by about one point! Those are still my three players, though. Put your own inside the quotes.' };
      if ((await q('len(my_players)')) < 2) return { msg: 'Put at least two players in the list, with a comma between them.' };
      const zero = (await q('", ".join(str(n) for n in my_players if fantasy_season(n, 2024) == 0)'));
      if (zero) return { msg: `0.0 points for ${esc(zero)}: the machine found no rows. Check the spelling (capital letters matter), or maybe he did not play in 2024.` };
      if (!out.includes('fantasy points')) return { msg: 'Keep the <code>for</code> loop and its <code>print</code> line under the list.' };
      return { ok: true, msg: `Your best scorer: ${esc(String((await q('max(my_players, key=lambda n: fantasy_season(n, 2024))'))))}. One loop, one machine, any list of players. (Quarterbacks score low here: our machine does not count passing.)` }; } },

  { md: '<h2>Part 4. Rebuild <code>compare</code> yourself ⚔️</h2>In Lab 3 you opened the <code>compare</code> machine and fixed its tie bug. Now you build it from scratch, your own way, out of two small machines.' },
  { skill: 'team', kind: 'run', data: true, task: '<b>Machine 1</b> adds up one player\'s whole career (every season since 1999) in one stat. Run it.',
    code: 'def career_total(name, stat):\n    player = seasons[seasons["player_display_name"] == name]\n    return player[stat].sum()\n\nprint(career_total("Tom Brady", "passing_tds"))\nprint(career_total("Peyton Manning", "passing_tds"))',
    ok: 'About 650 and 513 touchdown passes. (The file starts in 1999, so Manning\'s first season, 1998, is not counted.)' },
  { skill: 'ret', kind: 'turn', data: true, task: '<b>Machine 2</b> uses machine 1 twice, then decides. The old <code>compare</code> printed the winner. Yours will <b>hand back</b> the winner\'s name. Two words are missing: the 3-letter word that starts building a machine, and the 6-letter word that hands an answer back.',
    code: '___ compare(player1, player2, stat):\n' + COMPARE_BODY,
    hints: ['The first word is short for "define". The second one means "hand this back".', 'Line 1 should start with <code>def compare(</code>', 'Under the <code>if</code>: <code>return player1</code>'],
    check: async ({ code, g }) => {
      if (!/^def\s+compare\s*\(/m.test(code)) return { msg: 'Check line 1. The word that starts building a machine has 3 letters and is short for "define".' };
      if (/^\s+print\s*\(?\s*player1\s*\)?\s*$/m.test(code)) return { msg: '<code>print</code> only shows the name. Then <code>winner</code> gets <code>None</code>! Use the 6-letter word that <b>hands the name back</b>.' };
      if (!/^\s+return\s+player1\s*$/m.test(code)) return { msg: 'Check the line under <code>if</code>. The word that hands an answer back has 6 letters.' };
      if ((await g('winner')) !== 'Tom Brady') return { msg: 'The machine did not hand back Tom Brady. Keep the other lines the way they were.' };
      return { ok: true, msg: 'Winner: Tom Brady! Your <code>compare</code> is shorter than the old one: the long line with all the brackets lives inside <code>career_total</code>, written once. A machine stops as soon as it reaches a <code>return</code>.' }; } },
  { skill: 'team', kind: 'turn', data: true, task: '<b>Settle an argument</b> with your own machine. Change the two names and the stat: <code>"passing_yards"</code>, <code>"passing_tds"</code>, <code>"rushing_yards"</code>, <code>"rushing_tds"</code>, <code>"receptions"</code>, <code>"receiving_yards"</code> or <code>"receiving_tds"</code>.',
    code: 'winner = compare("Justin Jefferson", "Ja\'Marr Chase", "receiving_yards")   # change the names and the stat\nprint("Winner:", winner, "🏆")',
    hints: ['Change the names inside the quotes. Each keeps its own quotes, with commas between.', 'For example: <code>winner = compare("Derrick Henry", "Saquon Barkley", "rushing_tds")</code>'],
    check: async ({ code, out, g }) => {
      if (!/compare\s*\(/.test(code)) return { msg: 'Use your machine: <code>winner = compare("Name One", "Name Two", "stat")</code>.' };
      if (out.includes('Justin Jefferson') && out.includes("Ja'Marr Chase")) return { msg: /receiving_yards/.test(code) ? 'Jefferson wins that one, 7,432 yards to 5,425. Now put in two players <b>you</b> would argue about.' : 'Good stat! Now change the two players too: put in two players <b>you</b> would argue about.' };
      const zero = out.split('\n').find(l => /:\s*0$/.test(l.trim()));
      if (zero) return { msg: `"${esc(zero.split(' :')[0])}" has a total of 0. The name is spelled wrong (capital letters matter), or he never had that stat. Fix it so the fight is fair.` };
      if (typeof (await g('winner')) !== 'string') return { msg: 'Keep <code>winner =</code> in front, so the machine\'s answer lands in a locker.' };
      return { ok: true, msg: `The winner is ${esc((await g('winner')))}, and the answer is saved in <code>winner</code>, because your machine <b>returns</b> it. Machine built, Engineer! 🏆` }; } }
];
const REVIEW6 = [
  { skill: 'build', q: 'What does this box show when you run it?', code: 'def cheer():\n    print("Go team!")', opts: ['Go team!', 'nothing: it only builds the machine', 'a red error'], a: 1 },
  { skill: 'build', q: 'Which line USES a machine called cheer?', opts: ['def cheer():', 'cheer()', 'print("cheer")'], a: 1 },
  { skill: 'inputs', q: 'What prints?', code: 'def score(touchdowns, field_goals):\n    return touchdowns * 6 + field_goals * 3\n\nprint(score(1, 2))', opts: ['12', '15', '9'], a: 0 },
  { skill: 'ret', q: 'What prints?', code: 'def double(yards):\n    print(yards * 2)\n\nanswer = double(10)\nprint(answer)', opts: ['20 and then 20', '20 and then None', 'None and then 20'], a: 1 },
  { skill: 'ret', q: 'Which word hands the answer back out of a machine?', opts: ['print', 'def', 'return'], a: 2 },
  { skill: 'team', q: 'fantasy_season uses fantasy_points inside it. Is that allowed?', opts: ['Yes, a machine can use another machine', 'No, a machine must work alone', 'Only inside a loop'], a: 0 }
];

registerLab('nfl', 6, {
  title: 'Build Your Own Machine',
  skills: SKILLS6, cells: LAB6, review: REVIEW6,
  data: ['player_stats_season.csv']
});
})();
