// One lab = one file. See labs/README.md for the format.
// Lab 9: Chart Room. New ideas: bar charts, line charts, clear labels, two lines with a legend.
// Notebook: baseball/Baseball_Lab_9.ipynb
(() => {
const SKILLS = { bars: 'Bar charts and labels', data: 'Charts from the stats', lines: 'Line charts', compare: 'Two careers side by side' };
const WORDS = 'words = {"HR": "Home runs", "SB": "Stolen bases", "H": "Hits", "BB": "Walks", "SO": "Strikeouts", "G": "Games"}';
const LABELS = 'plt.xlabel("Season")\nplt.ylabel("Home runs   (taller = more)")\nplt.show()';
const LINE_LABELS = 'plt.xlabel("Season")\nplt.ylabel("Home runs   (higher = more)")\nplt.show()';

// What the last chart looked like (written down by the lab's setup code each time a chart is shown).
const chart = async q => JSON.parse((await q('_json.dumps(_chart)')));
const has = (text, part) => String(text).toLowerCase().includes(String(part).toLowerCase());

const CELLS = [
  { md: '<h2>Part 1. A picture from two lists 📊</h2>A table full of numbers is hard to read. A <b>picture</b> shows the same thing in one look. Python\'s toolbox for pictures is called <code>matplotlib</code>, and we give it the short name <code>plt</code>. You saw it in Lab 1.' },
  { skill: 'bars', kind: 'run', data: true, task: 'Here are Aaron Judge\'s home runs in his last five seasons, as two lists. <b>Guess first:</b> which bar will be the tallest? Then run it.',
    code: 'import matplotlib.pyplot as plt\n\nseasons = [2022, 2023, 2024, 2025, 2026]\nhomers = [62, 37, 58, 53, 18]\n\nplt.bar(seasons, homers)\nplt.show()',
    ok: 'A <b>bar chart</b>! <code>plt.bar(seasons, homers)</code>: the <b>first</b> list says where each bar stands, the <b>second</b> says how tall it is. 2022 goes with 62, 2023 with 37, and so on.' },
  { skill: 'bars', kind: 'run', data: true, task: 'Show that picture to a friend. Whose numbers are these? Home runs? Hot dogs? Nobody can tell: <b>a chart without words is a mystery.</b> Three more lines fix it. Run it.',
    code: 'plt.bar(seasons, homers)\nplt.title("Aaron Judge: home runs each season")\nplt.xlabel("Season")\nplt.ylabel("Home runs   (taller = more)")\nplt.show()',
    ok: '<code>plt.title</code> is the headline. <code>plt.xlabel</code> writes under the bottom line (x goes a<b>cross</b>). <code>plt.ylabel</code> writes along the left side, the line that goes up.' },
  { skill: 'bars', kind: 'quiz', task: 'Which line writes the words <b>under the bottom line</b> of a chart?',
    opts: ['plt.title("Season")', 'plt.xlabel("Season")', 'plt.ylabel("Season")'], a: 1,
    tips: ['The title is the headline at the very top.', '', 'That one writes along the left side, the line that goes up. Remember: x goes a<b>cross</b>.'],
    ok: 'Yes! <code>xlabel</code> is for the line that goes across, <code>ylabel</code> for the line that goes up.' },
  { skill: 'bars', kind: 'turn', data: true, task: '<b>The lying chart.</b> These are <b>Shohei Ohtani\'s</b> home runs, but the title still says Aaron Judge! A chart with the wrong words is worse than no words. Fix the title.',
    code: 'seasons = [2022, 2023, 2024, 2025, 2026]\nhomers = [34, 44, 54, 55, 30]   # Shohei Ohtani\'s home runs\n\nplt.bar(seasons, homers, color="dodgerblue")\nplt.title("Aaron Judge: home runs each season")   # fix this line\n' + LABELS,
    hints: ['Change only the name inside the quotes on the <code>plt.title</code> line.', 'Like this: <code>plt.title("Shohei Ohtani: home runs each season")</code>'],
    check: async ({ code, q }) => {
      if (!/plt\.bar\(/.test(code)) return { msg: 'Keep the <code>plt.bar</code> line, so there is a chart to look at.' };
      const c = await chart(q);
      if (has(c.title, 'judge')) return { msg: 'The title still says Aaron Judge, but these are Ohtani\'s numbers. Change the name in the <code>plt.title</code> line.' };
      if (!has(c.title, 'ohtani')) return { msg: c.title ? `The title says "${esc(c.title)}". It should say whose home runs these are: Shohei Ohtani.` : 'The chart has no title now. Keep the <code>plt.title("...")</code> line and put Shohei Ohtani in it.' };
      if (!c.xlabel || !c.ylabel) return { msg: 'Keep the <code>plt.xlabel</code> and <code>plt.ylabel</code> lines too. Every chart needs all three.' };
      return { ok: true, msg: 'Now the words tell the truth. Did you spot <code>color="dodgerblue"</code>? That is a setting, like <code>ascending=False</code> in Lab 2. Try <code>"navy"</code> or <code>"orange"</code> if you like.' }; } },

  { md: '<h2>Part 2. Straight from the data 🗂️</h2>Typing numbers into lists by hand is slow. The table <code>stats</code> already has every season of every player. A <b>column</b> of the table works just like a list, so we can give columns straight to <code>plt.bar</code>.' },
  { skill: 'data', kind: 'predict', data: true, task: 'This opens the stats and draws <b>all 11</b> of Aaron Judge\'s seasons. <b>Guess first:</b> which season has the tallest bar? Type the year, then run it.',
    code: 'import pandas as pd\nimport matplotlib.pyplot as plt\n\nstats = pd.read_csv("mlb_batting.csv").convert_dtypes()\n\nname = "Aaron Judge"\ncareer = stats[stats["name"] == name]\n\nplt.bar(career["season"], career["HR"])\nplt.title(name + ": home runs each season")\n' + LABELS,
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 2022, msg: (+guess === 2022 ? 'You called it: 2022! ' : `You guessed ${esc(String(guess))}, but the tallest bar is 2022. `) + 'That is his 62 home runs. And <code>name + ": home runs each season"</code> glues the name into the title, so this title can <b>never lie</b>.' }) },
  { skill: 'data', kind: 'turn', data: true, task: 'Draw <b>your</b> favorite player\'s home runs. Change only the name. (If the chart comes out <b>empty</b>, the name is misspelled: it needs capital letters, exactly like in the data.)',
    code: 'name = "Aaron Judge"   # change to your favorite player\ncareer = stats[stats["name"] == name]\n\nplt.bar(career["season"], career["HR"])\nplt.title(name + ": home runs each season")\n' + LABELS,
    hints: ['Change only what is between the quotes on line 1.', 'Like this: <code>name = "Mike Trout"</code>. Capital letters matter.'],
    check: async ({ code, g, q }) => {
      const name = (await g('name'));
      if (typeof name !== 'string') return { msg: 'The name must be text, in quotes: <code>name = "Mike Trout"</code>.' };
      if (name === 'Aaron Judge') return { msg: 'That is still Aaron Judge. Type your own favorite player between the quotes on line 1.' };
      const n = (await q('len(career)'));
      if (n === 0) return { msg: `The chart is empty: I can't find "${esc(name)}" in the stats. Check the spelling and the capital letters, like <code>"Mike Trout"</code>. (Pitchers are not in this table.)` };
      if (!/plt\.bar\(/.test(code)) return { msg: 'Keep the <code>plt.bar</code> line, so we get a bar chart.' };
      const c = await chart(q);
      if (!has(c.title, name)) return { msg: 'Keep the <code>plt.title(name + ...)</code> line, so the chart says whose home runs these are.' };
      return { ok: true, msg: `${esc(name)}: ${n} ${n === 1 ? 'season' : 'seasons'}, ${n === 1 ? 'one bar' : 'one bar for each'}. His best was ${(await q('int(career["HR"].max())'))} home runs. And the title changed all by itself!` }; } },
  { skill: 'data', kind: 'turn', data: true, task: 'Any stat, with the right words. The table uses short codes like <code>"SB"</code>. A <b>dictionary</b> (Lab 7) turns each code into plain words for the chart. One piece is missing: the 6-letter command that writes words along the <b>left side</b>. Fill it in.',
    code: WORDS + '\n\nname = "Shohei Ohtani"\nstat = "SB"\ncareer = stats[stats["name"] == name]\n\nplt.bar(career["season"], career[stat], color="dodgerblue")\nplt.title(name + ": " + words[stat] + " each season")\nplt.xlabel("Season")\nplt.___(words[stat] + "   (taller = more)")\nplt.show()',
    hints: ['You ran it in Part 1. It is the twin of <code>xlabel</code>, for the line that goes <b>up</b>.', 'The line should start with: <code>plt.ylabel(</code>'],
    check: async ({ code, q }) => {
      if (/plt\.xlabel\(\s*words/.test(code)) return { msg: 'Almost! <code>xlabel</code> writes under the bottom line, and that line is already there. We need the one for the <b>left side</b>: y, not x.' };
      if (!/plt\.ylabel\(/.test(code)) return { msg: 'The missing command writes words along the left side of the chart. It has 6 letters and starts with <code>y</code>.' };
      const c = await chart(q);
      if (!c.ylabel) return { msg: 'The left side of the chart has no words yet. The line should be <code>plt.ylabel(words[stat] + "   (taller = more)")</code>.' };
      return { ok: true, msg: `The side now says "${esc(c.ylabel)}", not "SB". <code>words[stat]</code> looked the code up in the dictionary. Change <code>stat</code> to <code>"H"</code> later: the bars <b>and</b> the words change together.` }; } },
  { skill: 'data', kind: 'quiz', task: '<b>Read your chart.</b> Ohtani is famous for home runs. But in which season did he steal the most bases?',
    opts: ['2021', '2024', '2025'], a: 1,
    tips: ['2021 is a tall bar (26), but one bar is more than twice as tall. Look again.', '', '2025 is a normal bar (20). Find the one that towers over all the others.'],
    ok: '2024: he stole 59 bases, and hit 54 home runs in the same season! You found it in one look. That is what a chart is for.' },

  { md: '<h2>Part 3. The line chart 📈</h2>Bars are great for comparing sizes. To see how something <b>changes over time</b>, there is a second kind of chart: a <b>line chart</b>. It puts a dot for each season and connects the dots, so your eye can follow the ups and downs.' },
  { skill: 'lines', kind: 'run', data: true, task: 'Babe Ruth played from 1914 to 1935. <b>Guess first:</b> will his line go up all the time? Up and then down? Run it. <code>plt.plot</code> draws a line, and <code>marker="o"</code> puts a round dot at every season.',
    code: 'name = "Babe Ruth"\ncareer = stats[stats["name"] == name]\n\nplt.plot(career["season"], career["HR"], marker="o")\nplt.title(name + ": home runs each season")\n' + LINE_LABELS,
    ok: 'Read it like a story. Flat at the bottom at first: Ruth was a <b>pitcher</b> then! Then the line shoots up, and after 1930 it slides down as he got older. The label says <code>(higher = more)</code> now: words must fit the picture.' },
  { skill: 'lines', kind: 'quiz', task: '<b>Read your chart.</b> Which season is the very top of Babe Ruth\'s line?',
    opts: ['1921', '1927', '1930'], a: 1,
    tips: ['Close! 1921 is the first peak, with 59. One dot is a tiny bit higher.', '', '1930 is high (49), but look further left for the highest dot of all.'],
    ok: '1927: 60 home runs, a record that stood for 34 years.' },
  { skill: 'lines', kind: 'turn', data: true, task: 'Draw <b>Hank Aaron\'s</b> career as a line. The command is missing: it has 4 letters, and it draws a line.',
    code: 'name = "Hank Aaron"\ncareer = stats[stats["name"] == name]\n\nplt.___(career["season"], career["HR"], marker="o")\nplt.title(name + ": home runs each season")\n' + LINE_LABELS,
    hints: ['You ran it in the Babe Ruth box. <code>plt.bar</code> draws bars; which one draws a line?', 'The line should start with: <code>plt.plot(</code>'],
    check: async ({ code, q }) => {
      if (/plt\.bar\(/.test(code)) return { msg: 'That draws bars. We want a <b>line</b> this time: the 4-letter command from the Babe Ruth box.' };
      if (!/plt\.plot\(/.test(code)) return { msg: 'The missing command draws a line chart. It has 4 letters and starts with <code>p</code>.' };
      const c = await chart(q);
      if (c.lines !== 1) return { msg: 'I expected exactly one line on the chart. Keep the rest of the box as it was.' };
      return { ok: true, msg: 'Compare the shapes. Ruth\'s line has giant mountains. Aaron\'s never goes above 47, but it stays high for almost <b>20 seasons</b> in a row. Two different ways to become a home run king!' }; } },
  { skill: 'lines', kind: 'quiz', task: 'You want to show how a player\'s hits went <b>up and down over his career</b>. Which chart fits best?',
    opts: ['A line chart: plt.plot', 'No chart, just the table', 'A chart without labels'], a: 0,
    tips: ['', 'A table has the numbers, but your eye can\'t follow ups and downs in it.', 'A chart without words is a mystery! And which kind of chart would it be?'],
    ok: 'Right. A line connects the seasons, so the ups and downs jump out. Bars are best for comparing sizes.' },

  { md: '<h2>Part 4. Two careers side by side 🤝</h2>To compare two players fairly, put both lines on <b>one</b> chart. A <code>for</code> loop (Lab 5) draws one line for each name in a list.' },
  { skill: 'compare', kind: 'run', data: true, task: '<b>Guess first:</b> Aaron Judge or Shohei Ohtani: who hit more home runs in 2022? And in 2025? Run it. <code>label=name</code> sticks a name tag on each line, and <code>plt.legend()</code> draws the little box that says who is who.',
    code: 'for name in ["Aaron Judge", "Shohei Ohtani"]:\n    career = stats[stats["name"] == name]\n    plt.plot(career["season"], career["HR"], marker="o", label=name)\n\nplt.legend()\nplt.title("Home runs each season")\n' + LINE_LABELS,
    ok: 'The loop ran twice, so two lines, each in its own color. In 2022 Judge is far on top (62 to 34). In 2025 Ohtani is just ahead (55 to 53). They keep trading places!' },
  { skill: 'compare', kind: 'run', data: true, task: 'Now Babe Ruth and Aaron Judge. <b>Guess first:</b> what will be wrong with this chart? Run it and look.',
    code: 'for name in ["Babe Ruth", "Aaron Judge"]:\n    career = stats[stats["name"] == name]\n    plt.plot(career["season"], career["HR"], marker="o", label=name)\n\nplt.legend()\nplt.title("Home runs each season")\n' + LINE_LABELS,
    ok: 'Ruth is far on the left, Judge far on the right, with about 80 empty years between them. They are not <b>side by side</b> at all. We need a different line across the bottom.' },
  { skill: 'compare', kind: 'run', data: true, task: 'The fix: count by <b>the season of his career</b> (his 1st, his 2nd…), not by the year. <code>range(1, len(career) + 1)</code> makes those numbers: 1, 2, 3… up to how many seasons he played (Lab 5: <code>range</code> stops one before the end, so we add 1).',
    code: 'for name in ["Babe Ruth", "Aaron Judge"]:\n    career = stats[stats["name"] == name]\n    number = range(1, len(career) + 1)\n    plt.plot(number, career["HR"], marker="o", label=name)\n\nplt.legend()\nplt.title("Home runs, season by season of a career")\nplt.xlabel("Season of his career   (1 = his first season)")\nplt.ylabel("Home runs   (higher = more)")\nplt.show()',
    ok: 'Now both start at 1. Judge started faster: 52 home runs in his 2nd season, when Ruth was still a pitcher. We changed the words under the chart too: <b>when the chart changes, the words must change.</b>' },
  { skill: 'compare', kind: 'turn', data: true, task: '<b>Make it yours: your own match-up.</b> Pick <b>two players</b> and <b>one stat</b>. Change only the three lines at the top. The dictionary <code>words</code> writes the right words for you.',
    code: 'player1 = "Babe Ruth"     # change to any player\nplayer2 = "Aaron Judge"   # change to any player\nstat = "HR"               # change to "SB", "H", "BB", "SO" or "G"\n\n' + WORDS + '\n\nfor name in [player1, player2]:\n    career = stats[stats["name"] == name]\n    number = range(1, len(career) + 1)\n    plt.plot(number, career[stat], marker="o", label=name)\n\nplt.legend()\nplt.title(player1 + " and " + player2 + ": " + words[stat])\nplt.xlabel("Season of his career   (1 = his first season)")\nplt.ylabel(words[stat] + "   (higher = more)")\nplt.show()',
    hints: ['Change the names inside the quotes on lines 1 and 2. You may keep <code>"HR"</code> or pick another stat.', 'Like this: <code>player1 = "Rickey Henderson"</code>, <code>player2 = "Shohei Ohtani"</code>, <code>stat = "SB"</code>'],
    check: async ({ code, g, q }) => {
      const p1 = (await g('player1')), p2 = (await g('player2'));
      if (typeof p1 !== 'string' || typeof p2 !== 'string') return { msg: 'Both players must be text, in quotes: <code>player1 = "Mike Trout"</code>.' };
      if (p1 === 'Babe Ruth' && p2 === 'Aaron Judge') return { msg: 'That is still my match-up. Put your own players in the quotes on lines 1 and 2.' };
      if (p1 === p2) return { msg: 'Those are the same player twice. Pick two different players to compare.' };
      for (const p of [p1, p2]) if (!(await q(`len(stats[stats["name"] == ${JSON.stringify(p)}])`))) return { msg: `I can't find "${esc(p)}" in the stats, so his line is missing. Check the spelling and the capital letters. (Pitchers are not in this table.)` };
      if (!/plt\.plot\(/.test(code)) return { msg: 'Keep the <code>plt.plot</code> line inside the loop.' };
      const c = await chart(q);
      if (c.lines !== 2) return { msg: 'I expected two lines on the chart, one for each player. Keep the loop as it was.' };
      if (c.legend.length !== 2) return { msg: 'Keep <code>label=name</code> and <code>plt.legend()</code>, or nobody can tell who is who.' };
      if (!c.title || !c.xlabel || !c.ylabel) return { msg: 'A chart without words is a mystery! Keep the title and both label lines.' };
      return { ok: true, msg: `${esc(p1)} and ${esc(p2)}, side by side, with words anybody can read. Show it to someone and ask: "What does this picture tell you?" Great work, Chart Maker!` }; } }
];

const REVIEW = [
  { skill: 'bars', q: 'In plt.bar(seasons, homers), what does the SECOND list do?', opts: ['says where each bar stands', 'says how tall each bar is', 'writes the title'], a: 1 },
  { skill: 'bars', q: 'A chart shows bars but no words at all. What is wrong?', opts: ['Nothing, bars are enough', 'Nobody can tell what the bars count', 'Python will show a red error'], a: 1 },
  { skill: 'data', q: 'The chart comes out empty: no bars. What most likely happened?', opts: ['The player\'s name is misspelled', 'The player hit too many home runs', 'plt.show() ran twice'], a: 0 },
  { skill: 'lines', q: 'Which command draws a line chart?', opts: ['plt.bar( )', 'plt.plot( )', 'plt.title( )'], a: 1 },
  { skill: 'compare', q: 'Two lines are on one chart. What tells you which line is which player?', opts: ['plt.xlabel( )', 'label=name and plt.legend( )', 'marker="o"'], a: 1 },
  { skill: 'compare', q: 'Why did we count "season of his career" (1, 2, 3…) for Ruth and Judge?', opts: ['Because they played about 80 years apart', 'Because years can\'t go on a chart', 'To make the lines shorter'], a: 0 }
];

registerLab('mlb', 9, {
  title: 'Chart Room',
  skills: SKILLS, cells: CELLS, review: REVIEW,
  data: ['mlb_batting.csv'],
  // The engine saves and closes a chart before check() runs. This writes down what the chart looked like
  // (title, labels, how many bars and lines) at that moment, so check() can look at the result, not the typing.
  setup: `
import json as _json
import matplotlib.pyplot as _plt
_chart = {}
_real_savefig = _plt.savefig
def _savefig(*args, **kwargs):
    ax = _plt.gca()
    leg = ax.get_legend()
    _chart.clear()
    _chart.update({
        "title": ax.get_title(), "xlabel": ax.get_xlabel(), "ylabel": ax.get_ylabel(),
        "bars": len(ax.patches), "lines": len(ax.lines),
        "legend": [t.get_text() for t in leg.get_texts()] if leg else [],
    })
    return _real_savefig(*args, **kwargs)
_plt.savefig = _savefig
`
});
})();
