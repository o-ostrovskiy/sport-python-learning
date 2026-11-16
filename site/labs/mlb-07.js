// Baseball Lab 7: Player Cards (dictionaries). See labs/README.md for the format.
// Twin of baseball/Baseball_Lab_7.ipynb: same ideas, same code.
(() => {
const SKILLS = { dict: 'A dictionary: key and value', change: 'Adding and changing facts', lookup: 'Looking things up', build: 'Cards from real stats' };
const CARD = `card = {
    "name": "Aaron Judge",
    "team": "New York Yankees",
    "number": 99,
    "position": "right field",
}
`;
const POSITIONS = `positions = {
    1: "pitcher",
    2: "catcher",
    3: "first baseman",
    4: "second baseman",
    5: "third baseman",
    6: "shortstop",
    7: "left fielder",
    8: "center fielder",
    9: "right fielder",
}
`;
const MAKE_CARD = `def make_card(player):
    seasons = stats[stats["name"] == player]
    card = {}
    card["name"] = player
    card["seasons"] = len(seasons)
    card["home runs"] = seasons["HR"].sum()
    card["best season"] = seasons["HR"].max()
`;
const CELLS = [
  { md: '<h2>Part 1. Your first player card 🃏</h2>A baseball card tells you things about one player: his <b>name</b>, his <b>team</b>, his <b>number</b>, his <b>position</b>. Each fact has a <b>label</b>. In Python, a box that holds labelled facts is called a <b>dictionary</b>.' },
  { skill: 'dict', kind: 'run', task: '<b>Guess first:</b> what will this box show? Say it out loud, then run it.',
    code: CARD + `
print(card)`,
    ok: 'That is a <b>dictionary</b>: curly brackets <code>{ }</code> with <b>pairs</b> inside. Each pair is a label, a colon, and a fact. Python calls the label a <b>key</b> and the fact a <b>value</b>. A comma comes after each pair.' },
  { skill: 'dict', kind: 'quiz', task: 'To get one fact, put its key in square brackets. <b>Guess first:</b> what will this show?',
    code: 'print(card["number"])',
    opts: ['number', '99', 'Aaron Judge'], a: 1,
    tips: ['<code>"number"</code> is the label you ask with. Python hands back the fact next to that label.', '', 'That is the fact next to <code>"name"</code>. Which fact sits next to <code>"number"</code>?'],
    ok: 'Yes, 99! <code>card["number"]</code> means: "from <code>card</code>, give me the value with the label <code>number</code>". A list wants a spot number in the brackets. A dictionary wants a key.' },
  { skill: 'dict', kind: 'boom', expectError: 'KeyError', task: 'What if you ask for a label that is not on the card? Run it. It shows a red error <b>on purpose</b>.',
    code: 'print(card["age"])',
    ok: 'A red error, just as planned! <code>KeyError: \'age\'</code>. You met it in Lab 2, when you asked the table for a column it did not have. There is no key called <code>"age"</code> on this card.' },
  { skill: 'change', kind: 'predict', task: 'A card can grow. The first new line uses a key that is <b>not</b> on the card yet. The second uses a key that is <b>already</b> there. <b>Guess first:</b> how many facts will the card have? Type a number, then run it.',
    code: CARD + `
card["best season HR"] = 62
card["position"] = "center field"

print(card)
print("Facts on the card:", len(card))`,
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 5, msg: (+guess === 5 ? 'Yes, 5! ' : `You guessed ${esc(guess)}, but the card has 5 facts. `) + '<code>"best season HR"</code> was a new key, so Python <b>added</b> a pair. <code>"position"</code> was already there, so Python <b>changed</b> its value. A key can be on the card only once.' }) },
  { skill: 'change', kind: 'turn', task: 'Make a card for <b>your own</b> favorite player. Change the four values, on the right side of each colon. Keep the keys and the commas.',
    code: CARD.trimEnd() + `   # change the four values to your player

print(card["name"], "wears number", card["number"])`,
    hints: ['Change only what comes after each colon. Text keeps its quotes, the number has none.', 'For example: <code>"name": "Shohei Ohtani",</code> then <code>"team": "Los Angeles Dodgers",</code> then <code>"number": 17,</code>'],
    check: async ({ q }) => {
      if (!(await q('isinstance(card, dict)'))) return { msg: 'The card must be a dictionary. Keep the curly brackets <code>{ }</code> around the pairs.' };
      const lost = (await q('next((k for k in ["name", "team", "number", "position"] if k not in card), "")'));
      if (lost) return { msg: `The key <code>"${esc(lost)}"</code> is gone from your card. Keep all four keys and change only the values after the colons.` };
      if ((await q('card["name"] == "Aaron Judge"'))) return { msg: 'That is still Aaron Judge\'s card. Put your own player after <code>"name":</code> and change the other three values too.' };
      if ((await q('card["number"] == 99 and card["team"] == "New York Yankees"'))) return { msg: 'New name, but still the Yankees and number 99. Change the team and the number to your player\'s.' };
      return { ok: true, msg: `A card for ${esc(String((await q('str(card["name"])'))))}, number ${esc(String((await q('str(card["number"])'))))}. Four keys, four values, one dictionary.` }; } },

  { md: '<h2>Part 2. The scorekeeper\'s secret code 🔢</h2>Baseball scorekeepers do not write "shortstop". They write a <b>number</b>. Every position on the field has one, 1 to 9. A dictionary is perfect for a code like that: the key is the number, the value is the position.' },
  { skill: 'lookup', kind: 'quiz', task: '<b>Guess first.</b> Here the keys are numbers, so they have no quotes. What will this show?',
    code: POSITIONS + `
print(positions[6])`,
    opts: ['shortstop', 'left fielder', 'third baseman'], a: 0,
    tips: ['', 'You counted from 0, like in a list! But this is a dictionary: <code>6</code> is a <b>label</b>, not a spot. What is written next to <code>6</code>?', 'That is the value next to <code>5</code>. Look for the key <code>6</code>.'],
    ok: 'Shortstop! In a list, <code>[6]</code> means "spot 6, counting from 0". In a dictionary, <code>6</code> is just a label we chose. No counting from 0, and no key <code>0</code> at all.' },
  { skill: 'lookup', kind: 'run', task: 'When you hear "a <b>6-4-3 double play</b>", that is this code: the ball went from player 6, to player 4, to player 3. A loop from Lab 5 can read it out.',
    code: POSITIONS + `
play = [6, 4, 3]

for number in play:
    print(number, positions[number])`,
    ok: 'Shortstop to second baseman to first baseman: two outs on one ball. <code>play</code> is a <b>list</b> of numbers, and <code>positions[number]</code> looks each one up in the <b>dictionary</b>.' },
  { skill: 'lookup', kind: 'turn', task: 'Another famous double play is the <b>5-4-3</b>, called "around the horn". Change the numbers in the list to show it.',
    code: `play = [6, 4, 3]   # change to 5, 4, 3

for number in play:
    print(number, positions[number])`,
    hints: ['Only the first number in the list changes.', 'The first line should be <code>play = [5, 4, 3]</code>.'],
    check: async ({ q, out }) => {
      if (!(await q('play == [5, 4, 3]'))) return { msg: 'The list should be <code>[5, 4, 3]</code>: three numbers with commas between them.' };
      if (!out.includes('5 third baseman')) return { msg: 'Keep the two loop lines as they were, so each number gets looked up and shown.' };
      return { ok: true, msg: 'Third baseman to second baseman to first baseman: around the horn! You read the scorekeeper\'s code.' }; } },
  { skill: 'lookup', kind: 'run', task: 'You know <code>in</code> from Lab 4. With a dictionary it asks: "is this <b>key</b> in there?" Here it is inside a machine, like in Lab 6. <b>Guess first:</b> what will the two lines show?',
    code: `def position_name(number):
    if number in positions:
        return positions[number]
    else:
        return "no such position"

print(position_name(2))
print(position_name(12))`,
    ok: '<code>catcher</code>, then <code>no such position</code>. Without the <code>if</code>, <code>positions[12]</code> would stop everything with a <code>KeyError</code>. Asking <code>in</code> first keeps your machine safe.' },

  { md: '<h2>Part 3. Reading a whole card 📖</h2><code>print(card)</code> squeezes everything onto one line. A loop can show a card nicely, one fact per line.' },
  { skill: 'dict', kind: 'run', task: '<b>Guess first:</b> when a loop walks through a dictionary, what goes into the box each time: the key or the value? Run it on <b>your</b> card from Part 1.',
    code: `for key in card:
    print(key, ":", card[key])`,
    ok: 'A loop over a dictionary gives you the <b>keys</b>, one at a time. With the key in hand, <code>card[key]</code> gets its value. No quotes around <code>key</code> here: it is a box, not the word "key".' },
  { skill: 'lookup', kind: 'run', task: 'One card is one dictionary. A <b>team</b> is a <b>list of dictionaries</b>. <b>Guess first:</b> whose card is <code>cards[1]</code>?',
    code: `cards = [
    {"name": "Aaron Judge", "team": "New York Yankees", "number": 99},
    {"name": "Shohei Ohtani", "team": "Los Angeles Dodgers", "number": 17},
    {"name": "Cal Raleigh", "team": "Seattle Mariners", "number": 29},
]

print(cards[1])
print(cards[1]["name"])`,
    ok: '<code>cards[1]</code> is the card at spot 1, counting from 0: Ohtani\'s. <code>cards[1]["name"]</code> goes one step further: from <code>cards</code> take spot 1, then from that card take <code>"name"</code>.' },
  { skill: 'lookup', kind: 'turn', task: 'This loop walks through the cards. Each time around, the box <code>card</code> holds one whole card. Fill in the <b>two keys</b> so it says who plays for which team. Keys are text, so they need quotes.',
    code: `for card in cards:
    print(card[___], "plays for the", card[___])`,
    hints: ['Look at the cards above: which label holds the player? Which one holds his club?', 'Keys are text, so they need quotes: <code>card["name"]</code>.', 'The line is <code>print(card["name"], "plays for the", card["team"])</code>.'],
    check: async ({ out }) => {
      if (out.includes('New York Yankees plays for the Aaron Judge')) return { msg: 'So close: the two keys are the wrong way round. The player comes first, then his team.' };
      if (!out.includes('Aaron Judge plays for the New York Yankees') || !out.includes('Cal Raleigh plays for the Seattle Mariners')) return { msg: 'The first line should say "Aaron Judge plays for the New York Yankees". Use the keys <code>"name"</code> and <code>"team"</code>.' };
      return { ok: true, msg: 'Three cards, one loop, two keys. A list keeps the cards in order, and each dictionary keeps one player\'s facts by label.' }; } },

  { md: '<h2>Part 4. Cards made from real stats 📊</h2>Card companies do not type every number by hand. Let\'s build a machine that makes a card from the real data.' },
  { skill: 'build', kind: 'run', data: true, task: 'First run this to load every MLB season. One row is one player\'s whole season.',
    code: `import pandas as pd

stats = pd.read_csv("mlb_batting.csv")
print("Ready!", len(stats), "rows, seasons", stats["season"].min(), "to", stats["season"].max())`,
    ok: 'Loaded! Every big-league season since 1871.' },
  { skill: 'build', kind: 'run', data: true, task: 'This machine starts with an <b>empty</b> card, <code>{}</code>, and adds the facts one by one. The right sides you know from Lab 2: <code>len( )</code>, <code>.sum()</code> and <code>.max()</code>.',
    code: MAKE_CARD + `    return card

judge = make_card("Aaron Judge")
print(judge["home runs"])`,
    ok: 'Judge\'s card says <b>386</b> home runs (through 2026). A machine can <code>return</code> a whole dictionary: four answers in one box.' },
  { skill: 'build', kind: 'run', data: true, task: 'A second machine that <b>shows</b> any card nicely. It is your loop from Part 3 with a <code>def</code> around it.',
    code: `def show_card(card):
    print("🃏")
    for key in card:
        print(key, ":", card[key])

show_card(judge)`,
    ok: 'Eleven seasons, 386 home runs, and 62 in his best season. One machine makes the card, another one shows it.' },
  { skill: 'build', kind: 'run', data: true, task: 'Both machines together, in a loop over a team. <b>Guess first:</b> who has the most home runs on his card?',
    code: `my_team = ["Aaron Judge", "Shohei Ohtani", "Hank Aaron"]

for player in my_team:
    show_card(make_card(player))`,
    ok: 'Hank Aaron: <b>755</b> home runs in 23 seasons. Read <code>show_card(make_card(player))</code> from the inside out, like in Lab 2: first make the card, then show it.' },
  { skill: 'build', kind: 'turn', data: true, task: '<b>Your own card design.</b> The card has a new line for <b>hits</b>. Add one more line of your own under it, for another stat: <code>"BB"</code> (walks), <code>"G"</code> (games) or <code>"AB"</code> (at-bats). Pick your own key name. You can change <code>my_team</code> too.',
    code: MAKE_CARD + `    card["hits"] = seasons["H"].sum()
    # add your own line here
    return card

my_team = ["Aaron Judge", "Shohei Ohtani", "Hank Aaron"]   # put your own players here

for player in my_team:
    show_card(make_card(player))`,
    hints: ['Copy the <code>hits</code> line onto the next line, pushed in the same way. Then change the key and the stat.', 'For walks: <code>card["walks"] = seasons["BB"].sum()</code>. It must come before <code>return card</code>.'],
    check: async ({ q }) => {
      const n = (await q('len(make_card("Aaron Judge"))'));
      if (n < 5) return { msg: 'Some facts went missing from the card. Keep the lines that were there and add one new line.' };
      if (n === 5) return { msg: 'The card still has 5 facts. Add a line like <code>card["walks"] = seasons["BB"].sum()</code> above <code>return card</code>, pushed in like the others.' };
      const lost = (await q('next((str(p) for p in my_team if len(stats[stats["name"] == p]) == 0), "")'));
      if (lost) return { msg: `Your new line works! But the card for ${esc(lost)} says 0 seasons: Python did not find him. Check the spelling and the capital letters.` };
      return { ok: true, msg: `Your own card design, with ${n} facts on every card and a machine that prints them. Nice collection!` }; } }
];
const REVIEW = [
  { skill: 'dict', q: 'Which one is a dictionary?', opts: ['["name", "Aaron Judge"]', '{"name": "Aaron Judge"}', '("name", "Aaron Judge")'], a: 1 },
  { skill: 'dict', q: 'What prints?', code: 'card = {"name": "Juan Soto", "number": 22}\nprint(card["name"])', opts: ['name', 'Juan Soto', '22'], a: 1 },
  { skill: 'change', q: 'The card has no key "hits". What does this line do?', code: 'card["hits"] = 150', opts: ['adds a new pair to the card', 'shows a red error', 'nothing'], a: 0 },
  { skill: 'lookup', q: 'What prints?', code: 'positions = {1: "pitcher", 2: "catcher"}\nprint(3 in positions)', opts: ['True', 'False', 'a red error'], a: 1 },
  { skill: 'lookup', q: 'What prints?', code: 'spots = {5: "third baseman", 6: "shortstop"}\nprint(spots[5])', opts: ['shortstop', 'third baseman', 'a red error'], a: 1 },
  { skill: 'build', q: 'How do you make an empty card to fill in later?', opts: ['card = []', 'card = {}', 'card = ""'], a: 1 }
];

registerLab('mlb', 7, {
  title: 'Player Cards',
  skills: SKILLS, cells: CELLS, review: REVIEW,
  data: ['mlb_batting.csv']
});
})();
