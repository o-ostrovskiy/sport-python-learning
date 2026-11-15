// One lab = one file. See labs/README.md for the format.
// Lab 9: Chart Room. New ideas: bar charts, line charts, titles and labels. Notebook: football/Football_Lab_9.ipynb
(() => {
const SKILLS9 = { bars: 'Bar charts', labels: 'Titles and labels', lines: 'Line charts', compare: 'Two players, one chart' };
const STATS = ['passing_yards', 'passing_tds', 'rushing_yards', 'rushing_tds', 'receptions', 'receiving_yards', 'receiving_tds'];
const TEAMS = 'ARI ATL BAL BUF CAR CHI CIN CLE DAL DEN DET GB HOU IND JAX KC LA LAC LV MIA MIN NE NO NYG NYJ PHI PIT SEA SF TB TEN WAS';
// True when the code has a line like plt.title("some words"): the command is there and its brackets are not empty.
const hasWords = (code, cmd) => new RegExp(`^\\s*plt\\.${cmd}\\(\\s*(?!["']\\s*["']\\s*\\))[^\\s)]`, 'm').test(code);

const TOP3 = 'players = ["Ja\'Marr Chase", "Justin Jefferson", "Brian Thomas"]\nyards = [1708, 1533, 1282]\n';
const TDS_LOOP = '\nnames = []\nnumbers = []\nfor name in tds:\n    names.append(name)\n    numbers.append(tds[name])\n';
const TD_CHART = 'plt.bar(names, numbers, color="orange")\nplt.title("Touchdown passes in 2024")\nplt.ylabel("Touchdown passes")\nplt.show()';
const TWO = 'one = seasons[seasons["player_display_name"] == "Patrick Mahomes"]\ntwo = seasons[seasons["player_display_name"] == "Josh Allen"]\n\n';
const TWO_END = 'plt.title("Mahomes and Allen: passing yards")\nplt.xlabel("Season")\nplt.ylabel("Passing yards")\nplt.show()';

const LAB9 = [
  { md: '<h2>Part 1. Your first bar chart 📊</h2>Every NFL team has a room full of screens where coaches look at <b>charts</b>. A chart turns a pile of numbers into a picture. A <b>bar chart</b> needs two lists: the <b>names</b> along the bottom, and the <b>numbers</b> that say how tall each bar is.' },
  { skill: 'bars', kind: 'run', data: true, task: 'The top 3 receivers of 2024 and their receiving yards. <b>Guess first:</b> whose bar will be the tallest? Then run it.',
    code: 'import matplotlib.pyplot as plt\n\n' + TOP3 + '\nplt.bar(players, yards)\nplt.show()',
    ok: '<code>plt</code> is Python\'s drawing toolbox (you saw it in Lab 1). <code>plt.bar(players, yards)</code> draws one bar per player: first list = names, second list = how tall. <code>plt.show()</code> says "done, show the picture".' },
  { skill: 'labels', kind: 'quiz', task: 'Look at your chart again. What do the numbers on the left side count?',
    opts: ['Receiving yards', 'Touchdowns', 'Nobody can tell from the chart'], a: 2,
    tips: ['<b>You</b> know that, because you read the code. But would a friend who only sees the picture know?', 'Could be! Could also be yards, or dollars. Does the picture itself say?', ''],
    ok: 'Exactly. A chart without words is a riddle. Every chart needs a <b>title</b> and a <b>label</b> for its numbers.' },
  { skill: 'labels', kind: 'turn', data: true, task: 'Give the chart words. Write a <b>title</b> (what is this chart about?) and a <b>label</b> for the left side (what do the numbers count?) between the empty quotes <code>""</code>.',
    code: TOP3 + '\nplt.bar(players, yards)\nplt.title("")      # what is this chart about? write it between the quotes\nplt.ylabel("")     # what do the numbers on the left count?\nplt.show()',
    hints: ['Type your words between the two quote marks, like <code>plt.title("My chart")</code>.', 'For example: <code>plt.title("Top 3 receivers of 2024")</code> and <code>plt.ylabel("Receiving yards")</code>.'],
    check: ({ code }) => {
      if (!hasWords(code, 'title')) return { msg: 'The chart still has no title. Write a few words between the quotes in <code>plt.title("")</code>.' };
      if (!hasWords(code, 'ylabel')) return { msg: 'Good title! Now the left side: write what the numbers count between the quotes in <code>plt.ylabel("")</code>.' };
      return { ok: true, msg: 'Now anyone can read it. <code>plt.title</code> writes on top, <code>plt.ylabel</code> writes along the left side (the <b>y</b> side). The bottom is the <b>x</b> side.' }; } },
  { skill: 'bars', kind: 'boom', data: true, expectError: 'ValueError', task: 'This time there are <b>4</b> names but only <b>3</b> numbers. Run it. It shows a red error <b>on purpose</b>.',
    code: 'players = ["Ja\'Marr Chase", "Justin Jefferson", "Brian Thomas", "Drake London"]\nyards = [1708, 1533, 1282]\n\nplt.bar(players, yards)\nplt.show()',
    ok: 'Just as planned: <code>ValueError: shape mismatch</code>. <b>Mismatch</b> means "these two do not fit together". Four names, three numbers: Python does not know how tall to make Drake London\'s bar. The two lists must be the same length.' },

  { md: '<h2>Part 2. From a dictionary to a chart 🃏</h2>In Lab 7 you kept stats in a <b>dictionary</b>: name → number. A chart wants two lists, so a <code>for</code> loop (Lab 5) walks through the dictionary and fills them with <code>.append( )</code> (Lab 4).' },
  { skill: 'bars', kind: 'run', data: true, task: 'Touchdown passes of three quarterbacks in 2024. The loop takes one name at a time, and looks up his number with <code>tds[name]</code>. <b>Guess first:</b> what will the two lists look like?',
    code: 'tds = {\n    "Joe Burrow": 43,\n    "Lamar Jackson": 41,\n    "Baker Mayfield": 41,\n}\n' + TDS_LOOP + '\nprint(names)\nprint(numbers)',
    ok: 'Two lists, same order, same length: just what <code>plt.bar</code> wants. <code>names = []</code> is an empty list, and the loop filled it one name at a time.' },
  { skill: 'bars', kind: 'run', data: true, task: 'Now draw them. <code>color="orange"</code> is a setting, like <code>ascending=False</code> in Lab 2.',
    code: TD_CHART,
    ok: 'A full chart: bars, a title and a label. Later, try <code>"green"</code>, <code>"red"</code> or <code>"purple"</code>.' },
  { skill: 'bars', kind: 'turn', data: true, task: 'Jared Goff threw <b>37</b> touchdown passes in 2024. Add him to the dictionary as a new line under Baker Mayfield: <code>"Jared Goff": 37,</code> Then run it. The loop and the chart do not need to change at all.',
    code: 'tds = {\n    "Joe Burrow": 43,\n    "Lamar Jackson": 41,\n    "Baker Mayfield": 41,\n}\n' + TDS_LOOP + '\n' + TD_CHART,
    hints: ['Put the new line inside the curly brackets <code>{ }</code>, with 4 spaces in front, like the other three.', 'The new line is: <code>    "Jared Goff": 37,</code>'],
    check: ({ q }) => {
      const n = q('len(tds)');
      if (n < 4) return { msg: `The dictionary still has ${n} quarterbacks, so the chart has ${n} bars. Add the line <code>"Jared Goff": 37,</code> inside the curly brackets.` };
      if (!q('all(isinstance(v, (int, float)) for v in tds.values())')) return { msg: 'One of the numbers is in quotes, so Python thinks it is text and cannot draw its height. Numbers do not need quotes.' };
      if (!q('len(names) == len(tds) and len(numbers) == len(tds)')) return { msg: 'The lists and the dictionary do not match. Keep the <code>for</code> loop just as it was.' };
      return { ok: true, msg: `${n} bars now! You only changed the dictionary: the loop did the rest. That is the nice thing about a loop.` }; } },
  { skill: 'bars', kind: 'quiz', task: 'In <code>plt.bar(names, numbers)</code>, which list decides how <b>tall</b> the bars are?',
    opts: ['names', 'numbers', 'both together'], a: 1,
    tips: ['The names go along the bottom, one under each bar. What makes a bar tall?', '', 'Each list has its own job. One goes along the bottom, one sets the height.'],
    ok: 'Right: the second list. First list = names along the bottom, second list = how tall.' },

  { md: '<h2>Part 3. A line chart: season by season 📈</h2>A bar chart answers "<b>who has more?</b>" A <b>line chart</b> answers a different question: "<b>how did it change over time?</b>"' },
  { skill: 'lines', kind: 'run', data: true, task: 'Load the season totals from Lab 4 (one row = one whole season of one player) and pull out Patrick Mahomes. <b>Guess first:</b> which season was his best?',
    code: 'import pandas as pd\n\nseasons = pd.read_csv("player_stats_season.csv", low_memory=False)\nseasons = seasons[seasons["season_type"] == "REG"]\n\nmahomes = seasons[seasons["player_display_name"] == "Patrick Mahomes"]\nmahomes[["season", "recent_team", "passing_yards"]]',
    ok: 'Eight seasons, eight numbers. In 2017 he was the backup and played one game, so that number is tiny. Now let\'s see it as a picture.' },
  { skill: 'lines', kind: 'run', data: true, task: '<code>plt.plot</code> draws a <b>line</b>: first the column for the bottom (seasons), then the column for the height (yards). <code>marker="o"</code> puts a dot on every season.',
    code: 'plt.plot(mahomes["season"], mahomes["passing_yards"], marker="o")\nplt.title("Patrick Mahomes: passing yards, season by season")\nplt.xlabel("Season")\nplt.ylabel("Passing yards")\nplt.show()',
    ok: 'Read it from left to right: older seasons on the left, newer on the right. When the line goes <b>up</b>, he threw for more yards than the year before. <code>plt.xlabel</code> writes along the bottom.' },
  { skill: 'lines', kind: 'quiz', task: 'Look at the line chart. In which season is the <b>highest</b> dot?',
    opts: ['2019', '2022', '2024'], a: 1,
    tips: ['Find 2019 along the bottom and go up to its dot. The line dips there: it is one of the lower ones.', '', '2024 is the last dot on the right, and the line is going down there.'],
    ok: 'Yes, 2022: 5,250 passing yards, his best season. One look at the chart, and no table needed.' },
  { skill: 'lines', kind: 'turn', data: true, task: '<b>Your team, season by season.</b> For every year the loop keeps that year\'s rows and adds up the passing yards with <code>.sum()</code>. It is set to the Chiefs. Change <code>"KC"</code> to <b>your team</b>:<br><code>' + TEAMS + '</code>',
    code: 'team = "KC"      # change to your team\'s short name\n\nrows = seasons[seasons["recent_team"] == team]\n\nyears = []\ntotals = []\nfor year in range(2015, 2025):\n    one_year = rows[rows["season"] == year]\n    years.append(year)\n    totals.append(one_year["passing_yards"].sum())\n\nplt.bar(years, totals)\nplt.title(team + ": passing yards, season by season")\nplt.xlabel("Season")\nplt.ylabel("Passing yards by the whole team")\nplt.show()',
    hints: ['Change only the letters inside the quotes on line 1. Use capital letters, like in the list.', 'For the Bills: <code>team = "BUF"</code>. For the Eagles: <code>team = "PHI"</code>.'],
    check: ({ q }) => {
      const team = String(q('team'));
      if (team === 'KC') return { msg: 'That is still the Chiefs. Change <code>"KC"</code> on line 1 to another team from the list.' };
      if (!(q('int(sum(totals))') > 0)) return { msg: `Python found no team called <code>"${esc(team)}"</code>, so every bar is 0 and the chart is empty. Use a short name from the list, in capital letters.` };
      return { ok: true, msg: `${esc(team)}, ten seasons in one picture! <code>range(2015, 2025)</code> stops one before 2025, so the last bar is 2024. Can you spot the year a new quarterback arrived?` }; } },

  { md: '<h2>Part 4. Two careers, side by side ⚔️</h2>The best thing about a line chart: you can draw <b>two lines</b> on the same picture and compare them. Two <code>plt.plot</code> lines = two lines on the chart.' },
  { skill: 'compare', kind: 'run', data: true, task: 'Patrick Mahomes and Josh Allen on one chart. Run it, then try to answer: <b>which line is Mahomes?</b>',
    code: TWO + 'plt.plot(one["season"], one["passing_yards"], marker="o")\nplt.plot(two["season"], two["passing_yards"], marker="o")\n' + TWO_END,
    ok: 'Two lines, two colors… but the chart does not say who is who. It is a riddle again! The next play fixes it.' },
  { skill: 'compare', kind: 'turn', data: true, task: 'Each <code>plt.plot</code> now has a setting <code>label="..."</code> with the player\'s name. One more command draws the little box that says which color is who. The word is missing: 6 letters, the same word a map uses for the box that explains its colors.',
    code: TWO + 'plt.plot(one["season"], one["passing_yards"], marker="o", label="Patrick Mahomes")\nplt.plot(two["season"], two["passing_yards"], marker="o", label="Josh Allen")\nplt.___()\n' + TWO_END,
    hints: ['On a map, the box that explains the colors and symbols is called the map\'s l _ _ _ _ d.', 'The line should be: <code>plt.legend()</code>'],
    check: ({ code }) => /^\s*plt\.legend\(\s*\)/m.test(code)
      ? { ok: true, msg: 'There is the <b>legend</b>! Mahomes started a year earlier and his line is on top almost every season. Look closely at 2023: that year Allen\'s dot is a tiny bit higher.' }
      : { msg: 'The missing word is the name of the box that explains a chart\'s colors. It starts with <code>l</code> and has 6 letters.' } },
  { skill: 'compare', kind: 'turn', data: true, task: '<b>Make it yours: your own matchup.</b> Change the two players, pick a stat that fits them, and write the left-side label in plain words. Stats: <code>passing_yards</code>, <code>passing_tds</code>, <code>rushing_yards</code>, <code>rushing_tds</code>, <code>receiving_yards</code>, <code>receiving_tds</code>, <code>receptions</code>. The new <code>plt.xticks</code> line puts a mark on the bottom for every season they played.',
    code: 'player_1 = "Patrick Mahomes"    # change to your first player\nplayer_2 = "Josh Allen"         # change to your second player\nstat = "passing_yards"          # change the stat if you like\nwords = "Passing yards"         # the label for the left side, in plain words\n\none = seasons[seasons["player_display_name"] == player_1]\ntwo = seasons[seasons["player_display_name"] == player_2]\n\nplt.plot(one["season"], one[stat], marker="o", label=player_1)\nplt.plot(two["season"], two[stat], marker="o", label=player_2)\nplt.xticks(list(one["season"]) + list(two["season"]), rotation=90)\nplt.legend()\nplt.title(player_1 + " and " + player_2)\nplt.xlabel("Season")\nplt.ylabel(words)\nplt.show()',
    hints: ['Change the names inside the quotes on lines 1 and 2. Spell them like on TV, with capital letters: <code>"Saquon Barkley"</code>.', 'For two runners: <code>player_1 = "Saquon Barkley"</code>, <code>player_2 = "Derrick Henry"</code>, <code>stat = "rushing_yards"</code>, <code>words = "Rushing yards"</code>.'],
    check: ({ q }) => {
      const p1 = String(q('player_1')), p2 = String(q('player_2')), stat = String(q('stat'));
      if (p1 === 'Patrick Mahomes' && p2 === 'Josh Allen') return { msg: 'That is still my matchup. Put your own players in <code>player_1</code> and <code>player_2</code>.' };
      for (const [name, tbl] of [[p1, 'one'], [p2, 'two']]) {
        if (q(`len(${tbl})`) === 0) return { msg: `Python found no seasons for <code>"${esc(name)}"</code>, so his line is missing. Check the spelling and the capital letters. The data goes from 1999 to 2024.` };
        if (q(`${tbl}["player_id"].nunique()`) > 1) return { msg: `Surprise: two different NFL players are called ${esc(name)}, and their seasons got mixed into one line. That puzzle is for a later lab. Pick another player for now.` };
      }
      if (p1 === p2) return { msg: 'Both lines are the same player. Pick two different players to compare.' };
      if (!STATS.includes(stat)) return { msg: `<code>"${esc(stat)}"</code> is not one of the stats in the list. Copy one exactly, like <code>"rushing_yards"</code>.` };
      if (q(`int(one[stat].sum()) == 0 or int(two[stat].sum()) == 0`)) return { msg: `One of your players has 0 in <code>${esc(stat)}</code> for his whole career, so his line is flat on the floor. Pick a stat that fits both players.` };
      const few = q('len(one) < 2 or len(two) < 2') ? ' (A player with one season is just one dot: next year his line will start to grow.)' : '';
      return { ok: true, msg: `${esc(p1)} and ${esc(p2)}, side by side.${few} Show it to someone and ask "what do you see?" If they can answer without your help, your labels are doing their job.` }; } }
];

const REVIEW9 = [
  { skill: 'bars', q: 'Which line draws a bar chart?', opts: ['plt.bar(names, numbers)', 'plt.plot(names, numbers)', 'print(names, numbers)'], a: 0 },
  { skill: 'bars', q: 'The names list has 4 players and the numbers list has 3 numbers. What happens?', opts: ['3 bars are drawn', 'a red ValueError', 'the last bar is 0'], a: 1 },
  { skill: 'labels', q: 'Which line writes words along the LEFT side of a chart?', opts: ['plt.title("Yards")', 'plt.xlabel("Yards")', 'plt.ylabel("Yards")'], a: 2 },
  { skill: 'lines', q: 'You want to show how one player changed over 8 seasons. Which chart fits best?', opts: ['a line chart', 'a bar chart of 3 players', 'no chart, just print'], a: 0 },
  { skill: 'lines', q: 'On a season-by-season line chart, the line goes UP from 2021 to 2022. What does that mean?', opts: ['2022 was a worse season', '2022 was a better season', 'he changed teams'], a: 1 },
  { skill: 'compare', q: 'Two lines on one chart. What makes the little box that says who is who?', opts: ['plt.show()', 'plt.legend()', 'plt.title()'], a: 1 }
];

registerLab('nfl', 9, {
  title: 'Chart Room',
  skills: SKILLS9, cells: LAB9, review: REVIEW9,
  data: ['player_stats_season.csv']
});
})();
