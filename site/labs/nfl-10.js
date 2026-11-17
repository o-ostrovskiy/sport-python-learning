// One lab = one file. See labs/README.md for the format.
// Lab 10: My Own Investigation. Nothing new: the child picks a question and answers it with data.
// Notebook: football/Football_Lab_10.ipynb
(() => {
const SKILLS10 = { plan: 'Asking a question', numbers: 'Finding the numbers', compare: 'A fair comparison', report: 'Chart and answer' };
const STATS = ['passing_yards', 'passing_tds', 'rushing_yards', 'rushing_tds', 'receptions', 'receiving_yards', 'receiving_tds', 'games'];
const STAT_LIST = '<code>passing_yards</code>, <code>passing_tds</code>, <code>rushing_yards</code>, <code>rushing_tds</code>, <code>receiving_yards</code>, <code>receiving_tds</code>, <code>receptions</code>, <code>games</code>';
const MY_QUESTION = "Was 2024 the best season of Saquon Barkley's career?";
// True when the code has a line like plt.title("some words"): the command is there and its brackets are not empty.
const hasWords = (code, cmd) => new RegExp(`^\\s*plt\\.${cmd}\\(\\s*(?!["']\\s*["']\\s*\\))[^\\s)]`, 'm').test(code);
const CASE_END = '\nmine = seasons[seasons["player_display_name"] == player]\nprint("My question:", question)\nprint("Seasons found:", len(mine))\nmine[["season", "recent_team", "games", stat]]';

const LAB10 = [
  { md: '<h2>Part 1. Open a case file 📁</h2>This is the last game of the season, and it is different. Until now, I picked the questions. Today <b>you</b> are the investigator: you pick a question about a player, find the numbers, draw the chart and write the answer. You already know every tool you need.' },
  { skill: 'plan', kind: 'run', data: true, task: 'Every investigation starts the same way: get the evidence. Run it to load the season totals (one row = one whole season of one player) and the drawing toolbox from Lab 9.',
    code: 'import pandas as pd\nimport matplotlib.pyplot as plt\n\nseasons = pd.read_csv("player_stats_season.csv", low_memory=False)\nseasons = seasons[seasons["season_type"] == "REG"]\nprint("Ready!", len(seasons), "player seasons, from", seasons["season"].min(), "to", seasons["season"].max())',
    ok: 'The evidence room is open. <code>.min()</code> is the twin of <code>.max()</code>: the smallest number in the column, so the oldest season.' },
  { skill: 'plan', kind: 'run', data: true, task: 'A case file is three things: a <b>question</b>, a <b>player</b>, and the <b>stat</b> that can answer it. Here is mine, as an example. Read it, then run it.',
    code: 'question = "' + MY_QUESTION + '"\nplayer = "Saquon Barkley"\nstat = "rushing_yards"\n' + CASE_END,
    ok: 'Seven seasons of evidence. In the last line, <code>stat</code> has no quotes because it is a variable: Python opens the locker and finds <code>"rushing_yards"</code> inside.' },
  { skill: 'plan', kind: 'predict', data: true, task: 'A good investigator checks the evidence first. Look closely at the name in this box. <b>Guess first:</b> how many seasons will Python find? Type a number, then run it.',
    code: 'rows = seasons[seasons["player_display_name"] == "saquon barkley"]\nprint("Seasons found:", len(rows))',
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 0, msg: (+guess === 0 ? 'Sharp eyes! ' : `You guessed ${esc(String(guess))}, but Python found 0. `) + 'Small letters, so nothing matches. No red error, just an empty table, and every number after that would be wrong. That is why a case file prints <code>Seasons found</code>: if it says 0, fix the spelling first.' }) },
  { skill: 'plan', kind: 'turn', data: true, task: '<b>Your own case.</b> Change the three lines at the top: your question, your player, and a stat that fits him. Stats: ' + STAT_LIST + ' (tds = touchdowns, receptions = catches). Question ideas: "Was 2024 the best season of …?" or "Is … getting better every year?"',
    code: 'question = "' + MY_QUESTION + '"   # change: your question\nplayer = "Saquon Barkley"                                            # change: your player\nstat = "rushing_yards"                                               # change: your stat\n' + CASE_END,
    hints: ['Change only what is between the quotes on the first three lines. Spell the name like on TV, with capital letters.', 'For example: <code>question = "Is Josh Allen throwing more touchdowns every year?"</code>, <code>player = "Josh Allen"</code>, <code>stat = "passing_tds"</code>.'],
    check: async ({ q }) => {
      const player = String((await q('player'))), stat = String((await q('stat'))), question = String((await q('str(question)'))).trim();
      if ((await q('len(mine)')) === 0) return { msg: `Seasons found: 0. Python has nobody called <code>"${esc(player)}"</code>. Check the spelling and the capital letters. The data goes from 1999 to 2024.` };
      if ((await q('mine["player_id"].nunique()')) > 1) return { msg: `Surprise: two different NFL players are called ${esc(player)}, and their seasons are mixed in your table. That puzzle is for a later lab. Pick another player for now.` };
      if (!STATS.includes(stat)) return { msg: `<code>"${esc(stat)}"</code> is not one of the stats in the list. Copy one exactly, like <code>"receiving_yards"</code>.` };
      if ((await q('int(mine[stat].sum())')) === 0) return { msg: `${esc(player)} has 0 in <code>${esc(stat)}</code> in every season, so there is nothing to investigate. Pick a stat that fits his position.` };
      if (question === MY_QUESTION) return { msg: 'The evidence looks good, but that is still <b>my</b> question. Write your own between the quotes on line 1.' };
      if (question.length < 10) return { msg: 'Write your question as a full sentence, so your report makes sense to someone else.' };
      return { ok: true, msg: `Case opened: ${esc(player)}, ${(await q('len(mine)'))} seasons of evidence. From here on every box uses <b>your</b> player and <b>your</b> stat.` }; } },

  { md: '<h2>Part 2. Dig into the numbers ⛏️</h2>Three questions every investigator asks, with three tools from Lab 2. The boxes use your variables <code>mine</code> and <code>stat</code>, so they work on <b>your</b> case.' },
  { skill: 'numbers', kind: 'run', data: true, task: '<b>Guess first:</b> what was your player\'s best season number? Then run it.',
    code: 'print("Best season:", mine[stat].max())\nprint("All seasons added up:", mine[stat].sum())\nprint("Average season:", round(mine[stat].mean()))',
    ok: '<code>.max()</code> is his best single season, <code>.sum()</code> is the whole career, and <code>.mean()</code> is the average: all seasons added up and shared out equally.' },
  { skill: 'numbers', kind: 'run', data: true, task: '<b>When</b> was the best season? Sort with the biggest on top and look at the first three rows.',
    code: 'best = mine.sort_values(stat, ascending=False)\nbest[["season", "recent_team", stat]].head(3)',
    ok: 'The top row is his best season, with the year and the team. Write that year down: you may need it for your answer.' },
  { skill: 'numbers', kind: 'turn', data: true, task: '<b>How many BIG seasons?</b> You decide what "big" means for your stat: 1,000 yards for a runner or receiver, maybe 4,000 yards or 30 touchdowns for a quarterback. The loop is the counter from Lab 5. Change the <code>0</code> to your bar.',
    code: 'bar = 0     # change: how many makes a BIG season for your stat?\n\nbig = 0\nfor number in list(mine[stat]):\n    if number >= bar:\n        big = big + 1\n\nprint(player, "had", big, "seasons with", bar, "or more", stat, "- out of", len(mine))',
    hints: ['Change only the <code>0</code> on line 1 to a number. No quotes: it is a number, not text.', 'Look at the best seasons in the table above, and pick a bar a little below the best one.'],
    check: async ({ q }) => {
      if (!(await q('isinstance(bar, (int, float))'))) return { msg: 'The bar must be a number, without quotes.' };
      const big = (await q('big')), n = (await q('len(mine)'));
      if (!((await q('bar')) > 0)) return { msg: `With a bar of 0, almost every one of his ${n} seasons counts, so the number tells you nothing. Set a higher bar on line 1.` };
      if (big === 0) return { ok: true, msg: 'No season clears your bar. That is an answer too: the bar is higher than his best season. Lower it and run again if you want to see some count.' };
      if (big === n && n > 1) return { ok: true, msg: `All ${n} seasons clear your bar, so it is an easy one. Raise it and run again if you want to find his biggest seasons.` };
      return { ok: true, msg: `${big} out of ${n}. A bar means something when some seasons clear it and some do not. The loop checked every season for you.` }; } },
  { skill: 'numbers', kind: 'quiz', task: 'Which tool tells you about <b>one great year</b>, not the whole career?',
    opts: ['.max()', '.sum()', 'len( )'], a: 0,
    tips: ['', '<code>.sum()</code> adds up every season: that is the whole career.', '<code>len( )</code> counts how many seasons there are. It does not look at the numbers inside.'],
    ok: 'Right. <code>.max()</code> finds the single biggest number. Pick the tool that fits the question.' },

  { md: '<h2>Part 3. Bring in a rival ⚔️</h2>One player\'s numbers are hard to judge alone. Is his career total a lot? Compared to <b>whom</b>? Time to bring in a second player.' },
  { skill: 'compare', kind: 'run', data: true, task: 'A machine like the ones you built in Lab 6: it takes a name and a stat, and gives back the career total. Run it to build the machine and test it on your player.',
    code: 'def career_total(name, stat):\n    rows = seasons[seasons["player_display_name"] == name]\n    return rows[stat].sum()\n\nprint(player, "-", career_total(player, stat))',
    ok: 'The machine works. Now it can add up a career for <b>any</b> name you give it.' },
  { skill: 'compare', kind: 'turn', data: true, task: '<b>Pick the rival.</b> Change <code>"?"</code> to a player worth comparing with yours: someone who plays the <b>same position</b>, so the same stat fits both.',
    code: 'rival = "?"     # change: the player you compare with\n\nmine_total = career_total(player, stat)\nrival_total = career_total(rival, stat)\nprint(player, "-", mine_total)\nprint(rival, "-", rival_total)\n\nif mine_total > rival_total:\n    print(player, "leads by", mine_total - rival_total)\nelif rival_total > mine_total:\n    print(rival, "leads by", rival_total - mine_total)\nelse:\n    print("It is a tie!")',
    hints: ['Change only the <code>?</code> between the quotes on line 1 to a full name, with capital letters.', 'Like this: <code>rival = "Derrick Henry"</code>. Pick someone at the same position as your player.'],
    check: async ({ q }) => {
      const rival = String((await q('rival'))), player = String((await q('player')));
      const n = (await q('len(seasons[seasons["player_display_name"] == rival])'));
      if (n === 0) return { msg: (rival === '?' ? 'There is no rival yet. ' : `Python has nobody called <code>"${esc(rival)}"</code>. Check the spelling and the capital letters. `) + 'Put a player\'s name between the quotes on line 1.' };
      if (rival === player) return { msg: 'That is your own player! A rival must be somebody else.' };
      if ((await q('seasons[seasons["player_display_name"] == rival]["player_id"].nunique()')) > 1) return { msg: `Two different NFL players are called ${esc(rival)}, so their seasons got added together. Pick another rival for now.` };
      if ((await q('int(rival_total)')) === 0) return { msg: `${esc(rival)} has 0 in <code>${esc(String((await q('stat'))))}</code> for his whole career. Pick a rival who plays the same position as ${esc(player)}.` };
      const a = (await q('int(mine_total)')), b = (await q('int(rival_total)'));
      return { ok: true, msg: `${esc(a > b ? player : b > a ? rival : 'Nobody')} leads on career totals. The <code>if</code> / <code>elif</code> / <code>else</code> from Lab 3 picked the right sentence. But is it a fair fight?` }; } },
  { skill: 'compare', kind: 'run', data: true, task: 'A player with many seasons has had more chances to pile up numbers. A fairer number is the <b>average season</b>: the total divided (<code>/</code>) by the number of seasons. The loop runs the same lines for both players.',
    code: 'for name in [player, rival]:\n    rows = seasons[seasons["player_display_name"] == name]\n    total = career_total(name, stat)\n    if len(rows) == 0:\n        print(name, "- no seasons found. Check the spelling!")\n    else:\n        print(name, "-", len(rows), "seasons,", total, "in all,", round(total / len(rows)), "in an average season")',
    ok: 'Did the leader change? Sometimes the player with the smaller total has the better average season: he just has not played as long. A good investigator says which number the answer is based on.' },
  { skill: 'compare', kind: 'quiz', task: 'Player A: 12,000 yards in 12 seasons. Player B: 6,000 yards in 4 seasons. Who gains more in an <b>average season</b>?',
    opts: ['Player A', 'Player B', 'They are the same'], a: 1,
    tips: ['A has the bigger total, but he needed 12 seasons for it. Share 12,000 between 12 seasons, and 6,000 between 4.', '', 'Share 12,000 between 12 seasons, and 6,000 between 4. Are the two answers the same?'],
    ok: 'Player B: 1,500 a season against 1,000. The bigger total does not always mean the better player.' },

  { md: '<h2>Part 4. Show it and tell it 📈</h2>A report needs a picture and an answer. This is the two-line chart from Lab 9, with your player and your rival already filled in.' },
  { skill: 'report', kind: 'turn', data: true, task: '<b>Give the chart its words.</b> Write a <b>title</b> and a <b>label for the left side</b> between the empty quotes. Remember: a chart without words is a riddle.',
    code: 'one = seasons[seasons["player_display_name"] == player]\ntwo = seasons[seasons["player_display_name"] == rival]\n\nplt.plot(one["season"], one[stat], marker="o", label=player)\nplt.plot(two["season"], two[stat], marker="o", label=rival)\nplt.xticks(list(one["season"]) + list(two["season"]), rotation=90)\nplt.legend()\nplt.title("")      # change: a title for your chart\nplt.xlabel("Season")\nplt.ylabel("")     # change: what do the numbers on the left count?\nplt.show()',
    hints: ['Type your words between the two quote marks in <code>plt.title("")</code> and <code>plt.ylabel("")</code>.', 'For example: <code>plt.title("Barkley and Henry: rushing yards")</code> and <code>plt.ylabel("Rushing yards")</code>.'],
    check: async ({ code }) => {
      if (!hasWords(code, 'title')) return { msg: 'The chart has no title yet. Write a few words between the quotes in <code>plt.title("")</code>.' };
      if (!hasWords(code, 'ylabel')) return { msg: 'Good title! Now write what the numbers on the left count, between the quotes in <code>plt.ylabel("")</code>.' };
      return { ok: true, msg: 'That is a chart anyone can read. Look at it for a moment: whose line is higher? Is your player going up or down? Does one season stick out?' }; } },
  { skill: 'report', kind: 'turn', data: true, task: '<b>The verdict.</b> Answer your own question, in your own words, between the quotes. One or two sentences. A good answer has a <b>number</b> in it: not "he is great" but "2024 was his best season, with 2,005 yards".',
    code: 'answer = ""     # change: your answer to your question, in your own words\n\nprint("MY INVESTIGATION")\nprint("Question:", question)\nprint("Player:", player, "| Stat:", stat)\nprint("Best season:", mine[stat].max(), "| Career:", career_total(player, stat))\nprint("Rival:", rival, "| Career:", career_total(rival, stat))\nprint("My answer:", answer)',
    hints: ['Write a full sentence between the quotes on line 1. Start with "Yes" or "No" if your question allows it.', 'Use what you found: the best season from Part 2, the leader from Part 3, and what the chart shows.'],
    check: async ({ q }) => {
      const a = String((await q('str(answer)'))).trim();
      if (!a) return { msg: 'The report is ready, but <code>My answer:</code> is empty. Write your answer between the quotes on line 1.' };
      if (a.length < 10 || !a.includes(' ')) return { msg: 'Make it a full sentence, so someone who reads your report understands what you found.' };
      return { ok: true, msg: 'A question, the evidence, a picture and an answer: that is a full investigation, and it is all yours. Go show the report and the chart to mom or dad!' }; } }
];

const REVIEW10 = [
  { skill: 'plan', q: 'Your case file says "Seasons found: 0". What should you do?', opts: ['keep going, it is fine', 'check the spelling of the name', 'pick a different stat'], a: 1 },
  { skill: 'plan', q: 'Which stat fits a question about a quarterback\'s passes?', opts: ['"receiving_yards"', '"passing_yards"', '"rushing_tds"'], a: 1 },
  { skill: 'numbers', q: 'Which tool adds up a whole career?', opts: ['.max()', '.sum()', '.mean()'], a: 1 },
  { skill: 'numbers', q: 'A counting loop uses "if number >= bar". With bar = 0, how many seasons count?', opts: ['none of them', 'all of them', 'only the best one'], a: 1 },
  { skill: 'compare', q: 'A veteran has 15 seasons, a young star has 3. Which number compares them most fairly?', opts: ['the career total', 'the average season', 'the number of seasons'], a: 1 },
  { skill: 'report', q: 'What makes an answer in a report strong?', opts: ['it has a number from the data in it', 'it is very long', 'it is in capital letters'], a: 0 }
];

registerLab('nfl', 10, {
  title: 'My Own Investigation',
  skills: SKILLS10, cells: LAB10, review: REVIEW10,
  data: ['player_stats_season.csv']
});
})();
