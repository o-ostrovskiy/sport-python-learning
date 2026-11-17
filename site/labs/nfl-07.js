// One lab = one file. See labs/README.md for the format.
// Site version of football/Football_Lab_7.ipynb (Player Cards).
(() => {
const SKILLS7 = { cards: 'Making a dictionary', keys: 'Keys: look up, add, change', lookup: 'Team codes and loops', deck: 'Cards from the stats' };
const CARD = `card = {
    "name": "Saquon Barkley",
    "team": "Giants",
    "number": 26,
    "position": "RB",
}`;
const TEAMS5 = 'teams = {"KC": "Chiefs", "MIN": "Vikings", "PHI": "Eagles", "BUF": "Bills", "SF": "49ers"}';
const TEAMS32 = `teams = {
    "ARI": "Cardinals", "ATL": "Falcons", "BAL": "Ravens", "BUF": "Bills",
    "CAR": "Panthers", "CHI": "Bears", "CIN": "Bengals", "CLE": "Browns",
    "DAL": "Cowboys", "DEN": "Broncos", "DET": "Lions", "GB": "Packers",
    "HOU": "Texans", "IND": "Colts", "JAX": "Jaguars", "KC": "Chiefs",
    "LA": "Rams", "LAC": "Chargers", "LV": "Raiders", "MIA": "Dolphins",
    "MIN": "Vikings", "NE": "Patriots", "NO": "Saints", "NYG": "Giants",
    "NYJ": "Jets", "PHI": "Eagles", "PIT": "Steelers", "SEA": "Seahawks",
    "SF": "49ers", "TB": "Buccaneers", "TEN": "Titans", "WAS": "Commanders",
}`;
const MACHINE = `def make_card(name, stat):
    player = seasons[seasons["player_display_name"] == name]
    best = player.sort_values(stat, ascending=False).head(1)
    code = list(best["recent_team"])[0]
    card = {
        "name": name,
        "team": teams[code],
        "position": list(best["position"])[0],
        "best season": int(best["season"].max()),
        "yards": int(best[stat].max()),
    }
    ___ card

print(make_card("Ja'Marr Chase", "receiving_yards"))
print(make_card("Saquon Barkley", "rushing_yards"))`;
const NAMES3 = '["Justin Jefferson", "Ja\'Marr Chase", "CeeDee Lamb"]';
const LAB7 = [
  { md: '<h2>Part 1. Your first player card 🃏</h2>A football card has a player\'s name, his team, his number, his position: lots of facts about <b>one</b> player, each with a label. A list (Lab 4) is great for things <b>in order</b>. For facts with <b>labels</b>, Python has a better box: a <b>dictionary</b>.' },
  { skill: 'cards', kind: 'run', task: 'Here is a card for Saquon Barkley, the way it looked when he played for the Giants. Run it.',
    code: CARD + '\nprint(card)',
    ok: 'That is a <b>dictionary</b>. Curly brackets <code>{ }</code> start and end it. Each pair is a label, a colon, and a value: <code>"team": "Giants"</code>. The label is called a <b>key</b>, because it unlocks the value. A comma comes after each pair.' },
  { skill: 'keys', kind: 'run', task: 'In a list you ask for a <b>spot number</b>. In a dictionary you ask with the <b>key</b>. <b>Guess first:</b> what will these two lines show? Then run it.',
    code: CARD + '\n\nprint(card["team"])\nprint(card["name"], "wears number", card["number"])',
    ok: '<code>card["team"]</code> means "from <code>card</code>, give me the value that goes with the key <code>"team"</code>". You never have to remember which spot the team is at. You just ask for it by its label.' },
  { skill: 'keys', kind: 'boom', expectError: 'KeyError', task: 'What if we ask for a key that is not on the card? Run it. It shows a red error <b>on purpose</b>.',
    code: 'print(card["college"])',
    ok: '<code>KeyError</code>, like in Lab 2 when a column name was not in the table. It means the same here: "I cannot find that key". There is no <code>"college"</code> on this card… yet.' },
  { skill: 'keys', kind: 'predict', task: 'Adding a fact and changing a fact use the same kind of line: the key in square brackets, then <code>=</code> and the value. In 2024 Saquon moved to the Eagles. <b>Guess first:</b> how many facts will be on the card after this box? Type a number, then run it.',
    code: CARD + '\n\ncard["college"] = "Penn State"   # a new key: Python adds it\ncard["team"] = "Eagles"          # a key that is already there: Python changes its value\n\nprint(card)\nprint("Facts on the card:", len(card))',
    check: async ({ guess }) => ({ ok: true, missed: +guess !== 5, msg: (+guess === 5 ? 'Five, exactly! ' : `You guessed ${esc(guess)}, Python counts 5. `) + '<code>"college"</code> was new, so Python <b>added</b> it. <code>"team"</code> was already there, so Python <b>replaced</b> Giants with Eagles. A key can only be on the card once.' }) },
  { skill: 'cards', kind: 'turn', task: '<b>Your favorite player\'s card.</b> <b>1.</b> Change the four values (what comes <b>after</b> the colons; the keys stay). <b>2.</b> In the last line, one thing is missing: the <b>key</b> that unlocks his jersey number. Type it in place of <code>___</code>, <b>with its quotes</b>.',
    code: 'my_card = {\n    "name": "Justin Jefferson",   # change to your player\n    "team": "Vikings",            # his team\n    "number": 18,                 # his number\n    "position": "WR",             # his position\n}\n\nprint(my_card["name"], "plays for the", my_card["team"])\nprint("He wears number", my_card[___])',
    hints: ['Look at the card: which label sits in front of the 18? Type that label, in quotes.', 'The last line should read: <code>print("He wears number", my_card["number"])</code>', 'Then change the values: <code>"name": "Josh Allen",</code> <code>"team": "Bills",</code> <code>"number": 17,</code> <code>"position": "QB",</code>'],
    check: async ({ code, q }) => {
      if (!(await q('isinstance(my_card, dict)'))) return { msg: 'The card must be a dictionary. Keep the curly brackets <code>{ }</code> and the <code>"key": value</code> pairs.' };
      if (!/my_card\[\s*["']number["']\s*\]/.test(code)) return { msg: 'That key works, but it is not the jersey number. Which label sits in front of the number on the card? Type it in quotes.' };
      if ((await q('len(my_card)')) !== 4 || !(await q('all(k in my_card for k in ["name", "team", "number", "position"])'))) return { msg: 'The card needs its four keys: <code>"name"</code>, <code>"team"</code>, <code>"number"</code> and <code>"position"</code>. Change only what comes after the colons.' };
      if ((await q('my_card["name"] == "Justin Jefferson"'))) return { msg: 'The key is right: he wears number 18. Now make a card for another player: change the four values after the colons. (Is Jefferson your favorite? Then use your second favorite, so you practice changing the values.)' };
      if (!(await q('isinstance(my_card["number"], int)'))) return { msg: 'The jersey number is a number, so no quotes around it: <code>"number": 17,</code>' };
      return { ok: true, msg: `${esc(String((await q('my_card["name"]'))))}, number ${(await q('my_card["number"]'))}. Your first dictionary: four keys, four values.` }; } },

  { md: '<h2>Part 2. Team codes 🗺️</h2>In our stats tables, teams are short codes: <code>KC</code>, <code>MIN</code>, <code>PHI</code>. A dictionary is perfect for turning a code into a name: the <b>code is the key</b>, the <b>name is the value</b>. Short dictionaries fit on one line, like short lists.' },
  { skill: 'lookup', kind: 'run', task: '<b>Guess first:</b> what will the two lines show? Then run it.',
    code: TEAMS5 + '\n\nprint(teams["KC"])\nprint(teams["SF"])',
    ok: 'A dictionary is a <b>lookup table</b>: you hand it a key, it hands you the value.' },
  { skill: 'lookup', kind: 'quiz', task: 'A missing key gives a <code>KeyError</code>. To check first, use <code>in</code> from Lab 4: with a dictionary it asks "is this <b>key</b> in it?" The Cowboys are not in our dictionary. What will this show?',
    code: TEAMS5 + '\ncode = "DAL"\n\nif code in teams:\n    print(code, "is the", teams[code])\nelse:\n    print("I don\'t know", code, "yet")',
    opts: ['DAL is the Cowboys', 'I don\'t know DAL yet', 'a red KeyError'], a: 1,
    tips: ['Python has never heard of the Cowboys: <code>"DAL"</code> is not a key in <code>teams</code>.', '', 'No error this time! The <code>if</code> checks first, so Python never asks for the missing key.'],
    ok: 'Right. <code>"DAL" in teams</code> is False, so Python goes to <code>else</code>. No red error.' },
  { skill: 'lookup', kind: 'run', task: 'A <code>for</code> loop (Lab 5) walks through a dictionary <b>key by key</b>. Inside the loop, <code>teams[code]</code> looks up the value for that key. Run it.',
    code: TEAMS5 + '\n\nfor code in teams:\n    print(code, "=", teams[code])\n\nprint("Teams I know:", len(teams))',
    ok: 'Five rounds, one for each key. <code>len( )</code> counts the pairs.' },
  { skill: 'lookup', kind: 'turn', task: 'Teach the dictionary two more teams. Line 2 adds the Cowboys. On line 3, add <b>one more team of your own</b>: change both <code>"???"</code>. (Some codes: <code>"DET"</code> Lions, <code>"BAL"</code> Ravens, <code>"GB"</code> Packers, <code>"CIN"</code> Bengals.)',
    code: TEAMS5 + '\nteams["DAL"] = "Cowboys"\nteams["???"] = "???"        # change both: a team code, and its name\n\nfor code in teams:\n    print(code, "=", teams[code])\n\nprint("Teams I know:", len(teams))',
    hints: ['The code goes in the square brackets, the name after the <code>=</code>. Both in quotes.', 'For example: <code>teams["DET"] = "Lions"</code>'],
    check: async ({ q }) => {
      if ((await q('"???" in teams'))) return { msg: 'The key is still <code>"???"</code>. Put a team code in the square brackets, like <code>"DET"</code>.' };
      if ((await q('"???" in teams.values()'))) return { msg: 'The code is in, but its name is still <code>"???"</code>. Put the team\'s name after the <code>=</code>.' };
      if (!(await q('"DAL" in teams'))) return { msg: 'The Cowboys are gone! Keep the line <code>teams["DAL"] = "Cowboys"</code>.' };
      const n = (await q('len(teams)'));
      if (n === 6) return { msg: 'Only 6 teams. Your code is one the dictionary already had, so Python <b>changed</b> that team and did not add a new one. Pick a code that is not there yet.' };
      if (n !== 7) return { msg: `The dictionary has ${n} teams, we want 7: the first five, the Cowboys, and yours.` };
      return { ok: true, msg: `Seven teams! The last one you added: ${esc(String((await q('list(teams)[-1]'))))} = ${esc(String((await q('teams[list(teams)[-1]]'))))}.` }; } },

  { md: '<h2>Part 3. Cards from the stats 📊</h2>Typing 32 teams is slow, so here is the whole league, ready-made. (The data uses today\'s codes and names even for old seasons.)' },
  { skill: 'lookup', kind: 'run', task: 'Run it to load all 32 teams.',
    code: TEAMS32 + '\n\nprint("Teams:", len(teams))\nprint("LAC is the", teams["LAC"])',
    ok: '32 teams, each code with its name.' },
  { skill: 'deck', kind: 'run', data: true, task: 'Now load the season file from Labs 4 and 6 and find a player\'s <b>best season</b>: keep only his rows, sort with the most yards first (Lab 2), keep the top one.',
    code: 'import pandas as pd\n\nseasons = pd.read_csv("player_stats_season.csv", low_memory=False)\nseasons = seasons[seasons["season_type"] == "REG"]\n\nname = "Justin Jefferson"\n\nplayer = seasons[seasons["player_display_name"] == name]\nbest = player.sort_values("receiving_yards", ascending=False).head(1)\n\nbest[["player_display_name", "recent_team", "position", "season", "receiving_yards"]]',
    ok: '<code>best</code> is a tiny table with <b>one row</b>: 2022, 1,809 yards. Next we copy the facts from that row onto a card.' },
  { skill: 'deck', kind: 'run', data: true, task: 'Run it. <code>list(…)[0]</code> turns a column into a list and takes spot 0 (Lab 4). <code>teams[code]</code> turns <code>"MIN"</code> into a name. <code>int( )</code> is new: it makes a <b>plain whole number</b>.',
    code: 'code = list(best["recent_team"])[0]\n\ncard = {\n    "name": name,\n    "team": teams[code],\n    "position": list(best["position"])[0],\n    "best season": int(best["season"].max()),\n    "yards": int(best["receiving_yards"].max()),\n}\nprint(card)\nprint(card["name"], "had his best season in", card["best season"], "with the", card["team"])',
    ok: 'A card straight from the data! <code>"MIN"</code> became Vikings: one dictionary used inside another. And a key can have a space in it, like <code>"best season"</code>. It is just text.' },
  { skill: 'deck', kind: 'turn', data: true, task: 'We do not want to write all that for every player, so we put it in a <b>machine</b> (Lab 6). It takes a name and a stat and <b>hands back</b> a finished card. One word is missing: the 6-letter word that hands the card back.',
    code: MACHINE,
    hints: ['You used this word in Lab 6. It means "hand this back".', 'The line should read: <code>return card</code> (with 4 spaces in front).'],
    check: async ({ code, out, q }) => {
      if (/^\s+print\s*\(?\s*card\s*\)?\s*$/m.test(code)) return { msg: '<code>print</code> only shows the card inside the machine. Then the machine hands back <code>None</code>! Use the 6-letter word that <b>hands the card back</b>.' };
      if (!/^\s+return\s+card\s*$/m.test(code)) return { msg: 'Check the line that had the <code>___</code>. The word that hands an answer back has 6 letters.' };
      if (!(await q('isinstance(make_card("Ja\'Marr Chase", "receiving_yards"), dict)'))) return { msg: 'The machine does not hand back a card. Keep the other lines the way they were.' };
      if (!out.includes('Bengals') || !out.includes('2005')) return { msg: 'Keep the two <code>print(make_card(…))</code> lines at the bottom so we can see the cards.' };
      return { ok: true, msg: 'Two cards from two short lines: Chase, Bengals, 1,708 yards in 2024, and Barkley, Eagles, 2,005 in 2024. Your machine builds a dictionary and hands it back.' }; } },

  { md: '<h2>Part 4. A deck of cards 🗂️</h2>One card is a dictionary. A <b>deck</b> is a list of cards: a list with dictionaries inside. We start with an empty list <code>[]</code>, and a loop adds one card for each name with <code>.append( )</code> (Lab 4).' },
  { skill: 'deck', kind: 'run', data: true, task: 'Run it. The first loop builds the deck. The second loop walks through it: each round, <code>card</code> is one dictionary. <b>Guess first:</b> whose best season had the most yards?',
    code: 'deck = []\n\nfor name in ["Justin Jefferson", "Ja\'Marr Chase", "CeeDee Lamb"]:\n    deck.append(make_card(name, "receiving_yards"))\n\nprint("Cards in the deck:", len(deck))\n\nfor card in deck:\n    print(card["name"], "|", card["team"], "|", card["best season"], "|", card["yards"], "yards")',
    ok: 'Jefferson, with 1,809 yards in 2022. Each card sits at one spot of the list, and we pick out its values by key.' },
  { skill: 'deck', kind: 'turn', data: true, task: '<b>Your own deck.</b> Put your own players in <code>my_names</code>, three or more, all the same kind: receivers and tight ends use <code>"receiving_yards"</code>, running backs <code>"rushing_yards"</code>, quarterbacks <code>"passing_yards"</code>. (A red <code>IndexError</code> means a name is spelled wrong: the machine found no rows for it.)',
    code: 'my_names = ["Justin Jefferson", "Ja\'Marr Chase", "CeeDee Lamb"]   # put your own players here\nstat = "receiving_yards"                                          # or "rushing_yards" or "passing_yards"\n\ndeck = []\nfor name in my_names:\n    deck.append(make_card(name, stat))\n\nfor card in deck:\n    print(card["name"], "|", card["team"], "|", card["position"], "|", card["best season"], "|", card["yards"], "yards")',
    hints: ['Change the names inside the quotes on line 1. Keep the commas between them.', 'For running backs: <code>my_names = ["Saquon Barkley", "Derrick Henry", "Bijan Robinson"]</code> and <code>stat = "rushing_yards"</code>'],
    check: async ({ q, out }) => {
      if (!(await q('isinstance(my_names, list)'))) return { msg: 'Keep <code>my_names</code> a list: square brackets, names in quotes, commas between.' };
      if ((await q('my_names == ' + NAMES3))) return { msg: 'Those are still my three receivers. Put your own players inside the quotes.' };
      const n = (await q('len(my_names)'));
      if (n < 3) return { msg: `That is ${n} player${n === 1 ? '' : 's'}. A deck needs three or more. Is a comma missing between two names?` };
      if ((await q('len(deck)')) !== n) return { msg: 'The deck does not have one card for each name. Keep the loop with <code>deck.append(make_card(name, stat))</code>.' };
      if (!out.includes('|')) return { msg: 'Keep the second loop so we can see your cards.' };
      const zero = (await q('", ".join(c["name"] for c in deck if c["yards"] == 0)'));
      if (zero) return { msg: `${esc(zero)} has 0 yards in ${esc(String((await q('stat'))))}. Pick the stat that fits your players: receivers catch, running backs rush, quarterbacks pass.` };
      return { ok: true, msg: `${n} cards! The biggest season in your deck: ${esc(String((await q('max(deck, key=lambda c: c["yards"])["name"]'))))}, ${(await q('max(c["yards"] for c in deck)')).toLocaleString('en-US')} yards. A list, a loop, a machine and dictionaries, all working together. Full deck, Collector! 🏆` }; } }
];
const REVIEW7 = [
  { skill: 'cards', q: 'Which one is a correct dictionary?', opts: ['{"name": "Josh Allen", "number": 17}', '["name": "Josh Allen", "number": 17]', '{"name" = "Josh Allen", "number" = 17}'], a: 0 },
  { skill: 'keys', q: 'What prints?', code: 'card = {"name": "Lamar Jackson", "team": "Ravens"}\nprint(card["team"])', opts: ['team', 'Ravens', 'Lamar Jackson'], a: 1 },
  { skill: 'keys', q: 'What happens?', code: 'card = {"name": "Lamar Jackson"}\nprint(card["number"])', opts: ['it prints 0', 'it prints nothing', 'a red KeyError'], a: 2 },
  { skill: 'keys', q: 'The card already has a "team". What does this line do?', code: 'card["team"] = "Eagles"', opts: ['changes the team to Eagles', 'adds a second team', 'gives a red error'], a: 0 },
  { skill: 'lookup', q: 'What prints?', code: 'teams = {"KC": "Chiefs", "GB": "Packers"}\nprint("DAL" in teams)', opts: ['True', 'False', 'Cowboys'], a: 1 },
  { skill: 'deck', q: 'deck is a list of cards. What is deck[0]?', opts: ['the first key', 'the first card: a whole dictionary', 'the number of cards'], a: 1 }
];

registerLab('nfl', 7, {
  title: 'Player Cards',
  skills: SKILLS7, cells: LAB7, review: REVIEW7,
  data: ['player_stats_season.csv']
});
})();
