// One lab = one file. See labs/README.md for the format.
// Lab 10: My Own Investigation. No new Python: the child picks a question and answers it with data.
// Notebook: baseball/Baseball_Lab_10.ipynb
(() => {
const SKILLS = { question: 'Asking a clear question', numbers: 'Getting the numbers', deeper: 'Digging deeper', answer: 'Picture and answer' };
const STAT_WORDS = { HR: 'home runs', SB: 'stolen bases', H: 'hits', BB: 'walks', SO: 'strikeouts', G: 'games' };
const Q0 = 'Who was the bigger home run hitter: Babe Ruth or Hank Aaron?';
const A0 = 'write your answer here';

const FIND = `for name in [player1, player2]:
    rows = stats[stats["name"] == name]
    if len(rows) == 0:
        print("I can't find", name, "- check the spelling and the capital letters")
    else:
        print("Found", name, ":", len(rows), "seasons, from", rows["season"].min(), "to", rows["season"].max())`;
const LINE_UP = `for key in ["seasons", "total", "best", "average"]:
    print(key, "->", player1, card1[key], "|", player2, card2[key])

if card1["total"] > card2["total"]:
    print("Bigger total:", player1)
elif card1["total"] == card2["total"]:
    print("The totals are a tie!")
else:
    print("Bigger total:", player2)`;
const COUNT = `count1 = big_seasons(player1, stat, big)
count2 = big_seasons(player2, stat, big)

print(player1, "- seasons with", big, "or more:", count1)
print(player2, "- seasons with", big, "or more:", count2)`;
const CHART = `import matplotlib.pyplot as plt

words = {"HR": "Home runs", "SB": "Stolen bases", "H": "Hits", "BB": "Walks", "SO": "Strikeouts", "G": "Games"}

for name in [player1, player2]:
    rows = stats[stats["name"] == name].dropna(subset=[stat])
    number = range(1, len(rows) + 1)
    plt.plot(number, rows[stat], marker="o", label=name)

plt.legend()
plt.title(player1 + " and " + player2 + ": " + words[stat])
plt.xlabel("Season of his career   (1 = his first season)")
plt.ylabel(words[stat] + "   (higher = more)")
plt.show()`;
const REPORT = `
print("QUESTION:", question)
print()
print(player1, card1, "- big seasons:", count1)
print(player2, card2, "- big seasons:", count2)
print()
print("MY ANSWER:", answer)`;

const rowsOf = async (q, name, extra = '') => (await q(`len(stats[stats["name"] == ${JSON.stringify(name)}]${extra})`));

const CELLS = [
  { md: '<h2>Part 1. The question ❓</h2>This is the last lab, and <b>you are the boss today</b>. Baseball fans argue all the time: "Ruth was the greatest!" "No way, Aaron hit more!" You can now argue with <b>proof</b>. Every investigation has 4 steps: a <b>question</b>, the <b>numbers</b>, a <b>closer look</b>, then a <b>picture and an answer</b>. First we do one together. Then it becomes yours.' },
  { skill: 'question', kind: 'quiz', task: 'A good question has <b>two players</b> and <b>one thing to count</b>. Which of these can data answer?',
    opts: ['Who is the coolest player ever?', 'Who hit more home runs: Babe Ruth or Hank Aaron?', 'Who is the best?'], a: 1,
    tips: ['"Coolest" is an opinion. There is no column for cool in the stats!', '', 'Best at what? Home runs? Stolen bases? It is too fuzzy. Pick the one that says what to count.'],
    ok: 'Yes! Two players and one thing to count: home runs. That is a question Python can answer.' },
  { skill: 'question', kind: 'run', data: true, task: 'This box is the <b>control room</b>: it opens the stats and sets five variables that every box below will use. Run it.',
    code: 'import pandas as pd\n\nstats = pd.read_csv("mlb_batting.csv").convert_dtypes()\n\nquestion = "' + Q0 + '"\nplayer1 = "Babe Ruth"\nplayer2 = "Hank Aaron"\nstat = "HR"   # what we count\nbig = 40      # how many in one season counts as a BIG season\n\nprint("My question:", question)',
    ok: 'The question, two players, the <code>stat</code> to count, and <code>big</code>: what counts as a big season. For home runs, 40 is a great one.' },
  { skill: 'question', kind: 'run', data: true, task: 'A careful investigator first checks that Python can <b>find</b> both players. One wrong letter and it finds nothing. A <code>for</code> loop (Lab 5) goes through the two names, and an <code>if</code> (Lab 3) decides what to say.',
    code: FIND,
    ok: 'Both found. Ruth played from 1914 to 1935, Aaron from 1954 to 1976. They never played each other: only data can compare them!' },
  { skill: 'question', kind: 'quiz', task: 'In that box, what does it mean when <code>len(rows) == 0</code> is True?',
    opts: ['The player hit 0 home runs', 'Python found no seasons: the name is probably misspelled', 'The player is still playing'], a: 1,
    tips: ['<code>len(rows)</code> counts <b>rows</b>, and one row is one season. It does not look at home runs.', '', '<code>len(rows)</code> counts his seasons in the table. What does it mean if there are none at all?'],
    ok: 'Right. Zero rows means nobody by that name is in the table. Capital letters matter: <code>"babe ruth"</code> finds nothing.' },

  { md: '<h2>Part 2. The numbers 🔢</h2>Now the facts. We build a machine (Lab 6) that makes a <b>player card</b> (Lab 7): a dictionary with four facts about one player.' },
  { skill: 'numbers', kind: 'run', data: true, task: 'Run it. <code>.dropna( )</code> throws out seasons where nobody wrote the stat down (Lab 1). <code>.sum()</code> adds up all his seasons, <code>.max()</code> is his best one, and <code>.mean()</code> is a normal season for him: all seasons added up and shared out equally.',
    code: 'def card(name, stat):\n    rows = stats[stats["name"] == name].dropna(subset=[stat])\n    return {\n        "seasons": len(rows),\n        "total": int(rows[stat].sum()),\n        "best": int(rows[stat].max()),\n        "average": round(rows[stat].mean()),\n    }\n\n\ncard1 = card(player1, stat)\ncard2 = card(player2, stat)\n\nprint(player1, card1)\nprint(player2, card2)',
    ok: 'Two player cards, each with four keys. <code>int( )</code> (Lab 8) just makes each number a plain whole number, so it prints nicely.' },
  { skill: 'numbers', kind: 'run', data: true, task: 'Line the two cards up, fact by fact. The loop walks through the four keys, and <code>card1[key]</code> looks each one up (Lab 7). Then an <code>if</code> names the leader. <b>Guess first:</b> who has the bigger total?',
    code: LINE_UP,
    ok: 'Hank Aaron: 755 home runs to Ruth\'s 714. But look at the other lines before you decide…' },
  { skill: 'numbers', kind: 'quiz', task: 'Aaron has the bigger total. Is the case closed?',
    opts: ['Yes: 755 is more than 714, done', 'Not yet: Aaron played one more season, and Ruth\'s best season was much bigger', 'No, the data must be wrong'], a: 1,
    tips: ['The total is true, but it is only <b>one</b> number. Look at the <code>seasons</code> and <code>best</code> lines too.', '', 'The data is fine! The numbers just tell more than one story. Look at <code>seasons</code> and <code>best</code>.'],
    ok: 'Exactly. Ruth\'s best season was 60, Aaron\'s was 47. A good investigator never stops at one number.' },

  { md: '<h2>Part 3. Dig deeper 🔍</h2>A sharper question: <b>how many BIG seasons did each one have?</b> We said <code>big = 40</code>. This machine counts them with a loop and a counter, just like the 30-homer seasons in Lab 5.' },
  { skill: 'deeper', kind: 'predict', data: true, task: 'Aaron had <b>8</b> seasons with 40 or more home runs. <b>Guess first:</b> how many did Babe Ruth have? Type a number, then run it.',
    code: 'def big_seasons(name, stat, big):\n    rows = stats[stats["name"] == name].dropna(subset=[stat])\n    count = 0\n    for number in list(rows[stat]):\n        if number >= big:\n            count = count + 1\n    return count\n\n\n' + COUNT,
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 11, msg: (+guess === 11 ? 'Spot on: 11! ' : `You guessed ${esc(String(guess))}, but Ruth had 11. `) + 'Now the story changes: Aaron has the bigger total, but Ruth had more monster seasons, 11 to 8.' }) },
  { skill: 'deeper', kind: 'quiz', task: 'Inside the machine, what does the line <code>count = count + 1</code> do?',
    opts: ['It adds one to the counter each time a season was big', 'It adds up all the home runs', 'It stops the loop'], a: 0,
    tips: ['', 'It adds just <b>1</b>, not the home runs. It runs only when <code>number &gt;= big</code> is True.', 'The loop stops by itself when the list of seasons ends. This line sits under the <code>if</code>.'],
    ok: 'Yes. The counter starts at 0, and goes up by one for every season where <code>number &gt;= big</code>.' },
  { skill: 'deeper', kind: 'run', data: true, task: 'Which seasons were their very best? Sorting (Lab 2) shows each player\'s <b>top 3</b>. Run it and compare.',
    code: 'for name in [player1, player2]:\n    rows = stats[stats["name"] == name].dropna(subset=[stat])\n    top3 = rows.sort_values(stat, ascending=False).head(3)\n    print(top3[["name", "season", "team", stat]])\n    print()',
    ok: 'Ruth: 60, 59 and 54. Aaron: 47, 45 and 44. Ruth\'s <b>third-best</b> season beats Aaron\'s <b>best</b>!' },

  { md: '<h2>Part 4. The picture and the answer 📈</h2>Numbers are the proof. A chart lets everybody <b>see</b> it. Then comes the step Python can\'t do for you: saying what you found, <b>in your own words</b>.' },
  { skill: 'answer', kind: 'run', data: true, task: 'The side-by-side chart from Lab 9: each player\'s career, counted from his 1st season. Run it and look at the two shapes.',
    code: CHART,
    ok: 'Ruth starts at the bottom (he was a pitcher first), then climbs two huge mountains. Aaron hits right away and stays high for almost twenty seasons: no mountain, but a long, high road.' },
  { skill: 'answer', kind: 'run', data: true, task: 'The final report. A good answer says <b>who</b>, and gives the <b>numbers that prove it</b>. Run it and read our answer.',
    code: 'answer = "Hank Aaron hit more home runs in total (755 to 714). But Babe Ruth had more big seasons (11 to 8) and the best season (60)."\n' + REPORT,
    ok: 'A question, the numbers, a closer look, a picture, an answer. Notice the answer is not just one name. Good answers often say "it depends what you mean by bigger". That is being honest.' },

  { md: '<h2>Now it is YOUR investigation 🔎</h2>Pick <b>your own</b> question: two players and one thing to count. Need an idea? <b>Stolen bases</b> (<code>"SB"</code>, big = 50): Rickey Henderson and Lou Brock. <b>Hits</b> (<code>"H"</code>, big = 200): Ichiro Suzuki and Derek Jeter. <b>Home runs today</b> (<code>"HR"</code>, big = 40): Aaron Judge and Shohei Ohtani. Or even better: your own two favorite players.' },
  { skill: 'question', kind: 'turn', data: true, task: '<b>Your control room.</b> Change the five lines: your question, your two players, your stat (<code>"HR"</code>, <code>"SB"</code>, <code>"H"</code>, <code>"BB"</code>, <code>"SO"</code> or <code>"G"</code>) and what counts as a big season. Then run it: Python checks that it can find both players.',
    code: 'question = "' + Q0 + '"   # your question\nplayer1 = "Babe Ruth"     # your first player\nplayer2 = "Hank Aaron"    # your second player\nstat = "HR"               # what you count\nbig = 40                  # how many in one season is a BIG season\n\nprint("My question:", question)\n' + FIND,
    hints: ['Change what is inside the quotes on the first four lines, and the number on the fifth. Names need capital letters.', 'For example: <code>player1 = "Rickey Henderson"</code>, <code>player2 = "Lou Brock"</code>, <code>stat = "SB"</code>, <code>big = 50</code>, and a question about who stole more bases.'],
    check: async ({ g, q }) => {
      const p1 = (await g('player1')), p2 = (await g('player2')), stat = (await g('stat')), big = (await g('big')), question = (await g('question'));
      if (typeof p1 !== 'string' || typeof p2 !== 'string') return { msg: 'Both players must be text, in quotes: <code>player1 = "Mike Trout"</code>.' };
      if (p1 === 'Babe Ruth' && p2 === 'Hank Aaron') return { msg: 'Those are still our two players. This investigation is yours: put your own players in the quotes.' };
      if (p1 === p2) return { msg: 'Those are the same player twice. Pick two different players to compare.' };
      if (typeof stat !== 'string' || !STAT_WORDS[stat]) return { msg: `<code>stat</code> must be one of <code>"HR"</code>, <code>"SB"</code>, <code>"H"</code>, <code>"BB"</code>, <code>"SO"</code> or <code>"G"</code>, in capital letters and in quotes.` };
      for (const p of [p1, p2]) {
        if (!await rowsOf(q, p)) return { msg: `I can't find "${esc(p)}" in the stats. Check the spelling and the capital letters. If it is right, he may not be in our archive: it keeps the better-known hitters, so try a star. (Pitchers are not in this table.)` };
        if ((await q(`stats[stats["name"] == ${JSON.stringify(p)}]["playerID"].nunique()`)) > 1) return { msg: `Two different players are called ${esc(p)} (often a dad and his son), so their numbers would get mixed up. Pick another player.` };
        if (!await rowsOf(q, p, `.dropna(subset=["${stat}"])`)) return { msg: `Nobody counted ${STAT_WORDS[stat]} when ${esc(p)} played, so there is nothing to compare. Pick another stat or another player.` };
      }
      if (typeof big !== 'number' || !(big > 0)) return { msg: '<code>big</code> must be a number bigger than 0, without quotes: for example <code>big = 50</code>.' };
      if (typeof question !== 'string' || question.trim().length < 10) return { msg: 'Write your question in words between the quotes on line 1, so everybody knows what you are investigating.' };
      if (question === Q0) return { msg: 'The players are yours now, but line 1 still asks about Ruth and Aaron. Write your own question between the quotes.' };
      return { ok: true, msg: `Case opened: ${esc(p1)} and ${esc(p2)}, counting ${STAT_WORDS[stat]}. Both found. On to the numbers!` }; } },
  { skill: 'numbers', kind: 'run', data: true, task: '<b>Your numbers.</b> The same machines, now working on <b>your</b> players: the two cards, lined up, and the count of big seasons. Run it and read every line.',
    code: 'card1 = card(player1, stat)\ncard2 = card(player2, stat)\n\n' + LINE_UP + '\n\n' + COUNT,
    check: async ({ q }) => {
      const p1 = esc(String((await q('player1')))), p2 = esc(String((await q('player2')))), w = STAT_WORDS[(await q('stat'))] || 'of them';
      const t1 = (await q('card1["total"]')), t2 = (await q('card2["total"]')), c1 = (await q('count1')), c2 = (await q('count2')), big = (await q('big'));
      const total = t1 === t2 ? `Both have ${t1} ${w}: a tie!` : `${t1 > t2 ? p1 : p2} leads the total, ${Math.max(t1, t2)} to ${Math.min(t1, t2)}.`;
      const deep = c1 + c2 === 0 ? ` Neither had a season of ${big} or more, so <code>big</code> is set too high: go back to your control room, lower it, and run both boxes again.`
        : c1 === c2 ? ` Big seasons are even, ${c1} each.` : ` Big seasons: ${c1 > c2 ? p1 : p2} leads, ${Math.max(c1, c2)} to ${Math.min(c1, c2)}.`;
      return { ok: true, msg: total + deep + ' Do the two numbers tell the same story?' }; } },
  { skill: 'answer', kind: 'run', data: true, task: '<b>Your picture.</b> Run it to draw both careers side by side. Look for the highest dot, and for who stayed high the longest.',
    code: CHART,
    check: async ({ q }) => {
      const p1 = esc(String((await q('player1')))), p2 = esc(String((await q('player2')))), b1 = (await q('card1["best"]')), b2 = (await q('card2["best"]'));
      return { ok: true, msg: (b1 === b2 ? `Their best seasons are the same height: ${b1}.` : `The highest dot belongs to ${b1 > b2 ? p1 : p2}: ${Math.max(b1, b2)}.`) + ' Now you have everything you need for your answer.' }; } },
  { skill: 'answer', kind: 'turn', data: true, task: '<b>Your answer.</b> The most important step. Between the quotes, write what you found: <b>who</b>, and the <b>numbers that prove it</b>. Use your own words. Then run it for your final report.',
    code: 'answer = "' + A0 + '"\n' + REPORT,
    hints: ['Look at your numbers above: who leads the total? Who had more big seasons? Say it in one or two sentences.', 'For example: <code>answer = "Rickey Henderson stole more bases in total, 1406 to 938, and had more big seasons too."</code>'],
    check: async ({ g, q }) => {
      const answer = (await g('answer'));
      if (typeof answer !== 'string') return { msg: 'Your answer must be text, inside the quotes on line 1.' };
      const a = answer.trim().toLowerCase();
      if (a === A0 || a.length === 0) return { msg: 'Line 1 is still empty. Delete <code>write your answer here</code> and type what you found.' };
      const parts = [String((await q('player1'))), String((await q('player2')))].join(' ').toLowerCase().split(/\s+/).filter(w => w.length > 2 && !/^(jr|sr|ii|iii)\.?$/.test(w));
      if (!parts.some(w => a.includes(w))) return { msg: 'A good answer says <b>who</b>. Use the name of at least one of your players in it.' };
      if (a.length < 25) return { msg: 'That is a start! Now add <b>how you know</b>: a number from your boxes above that proves it.' };
      return { ok: true, msg: (/\d/.test(a) ? 'A good answer, with numbers as proof. ' : 'A good answer! Next time, put a number in it as proof. ') + 'You asked your own question and answered it with data: that is what sports analysts do for a living. Show the chart and the report to mom or dad. You finished all 10 labs, Investigator!' }; } }
];

const REVIEW = [
  { skill: 'question', q: 'Which question can the stats answer?', opts: ['Who is the nicest player?', 'Who stole more bases: Rickey Henderson or Lou Brock?', 'Who is the best?'], a: 1 },
  { skill: 'question', q: 'Python finds 0 rows for "aaron judge". Why?', opts: ['He never played', 'The capital letters are missing', 'The table is empty'], a: 1 },
  { skill: 'numbers', q: 'On a player card, what does "best" hold?', opts: ['all his seasons added up', 'his biggest single season', 'how many seasons he played'], a: 1 },
  { skill: 'deeper', q: 'Player A has the bigger total. Player B had more big seasons. Who was better?', opts: ['A, the total is all that counts', 'B, big seasons are all that counts', 'It depends what you mean, so say both'], a: 2 },
  { skill: 'deeper', q: 'What prints?', code: 'count = 0\nfor hr in [45, 12, 40]:\n    if hr >= 40:\n        count = count + 1\nprint(count)', opts: ['1', '2', '97'], a: 1 },
  { skill: 'answer', q: 'What does a good answer need?', opts: ['Only a name', 'Who, and the numbers that prove it', 'As many words as possible'], a: 1 }
];

registerLab('mlb', 10, {
  title: 'My Own Investigation',
  skills: SKILLS, cells: CELLS, review: REVIEW,
  data: ['mlb_batting.csv']
});
})();
