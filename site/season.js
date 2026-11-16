// The season schedule: one stadium per week, shared by the home page and the game page.
const SEASON = {
  nfl: { ball: '🏈', weeks: [
    { city: 'Kansas City', stadium: 'Arrowhead Stadium', team: 'Chiefs', opened: 1972, seats: '76,000', at: [39.0489, -94.4839], xy: [535, 308], topic: 'Football Lab: variables, print and tables',
      fact: 'Fans here set a world record for the loudest stadium roar: louder than a jet engine!' },
    { city: 'Dallas', stadium: 'AT&T Stadium', team: 'Cowboys', opened: 2009, seats: '80,000', at: [32.7473, -97.0945], xy: [490, 444], topic: 'Stat Detective: text, numbers and questions',
      fact: 'A giant video screen hangs over the field. It is more than 50 yards long!' },
    { city: 'Green Bay', stadium: 'Lambeau Field', team: 'Packers', opened: 1957, seats: '81,000', at: [44.5013, -88.0622], xy: [630, 186], topic: 'Referee Bot: if, elif and else',
      fact: 'It gets so cold that people call it the Frozen Tundra. After a touchdown, players jump into the crowd: the Lambeau Leap.' },
    { city: 'Philadelphia', stadium: 'Lincoln Financial Field', team: 'Eagles', opened: 2003, seats: '68,000', at: [39.9008, -75.1675], xy: [846, 253], topic: 'My Draft Board: lists',
      fact: 'More than 10,000 solar panels help power the stadium.' },
    { city: 'Miami', stadium: 'Hard Rock Stadium', team: 'Dolphins', opened: 1987, seats: '65,000', at: [25.9580, -80.2389], xy: [815, 564], topic: 'Game Day Loop: for loops',
      fact: 'A huge roof canopy keeps fans in the shade, and race cars zoom around the stadium once a year.' },
    { city: 'Denver', stadium: 'Empower Field at Mile High', team: 'Broncos', opened: 2001, seats: '76,000', at: [39.7439, -105.0201], xy: [363, 286], topic: 'Build Your Own Machine: functions',
      fact: 'It sits one mile above the sea. The air is thinner up here, so kicks fly farther!' },
    { city: 'Seattle', stadium: 'Lumen Field', team: 'Seahawks', opened: 2002, seats: '69,000', at: [47.5952, -122.3316], xy: [132, 72], topic: 'Player Cards: dictionaries',
      fact: 'Fans once cheered so hard that an earthquake sensor nearby picked up the shaking.' },
    { city: 'Las Vegas', stadium: 'Allegiant Stadium', team: 'Raiders', opened: 2020, seats: '65,000', at: [36.0909, -115.1833], xy: [183, 339], topic: 'Guess the Player: input, while and random',
      fact: 'The real grass field sits on a giant tray that rolls outside to soak up the sun.' },
    { city: 'Los Angeles', stadium: 'SoFi Stadium', team: 'Rams and Chargers', opened: 2020, seats: '70,000', at: [33.9535, -118.3392], xy: [119, 372], topic: 'Chart Room: bar and line charts',
      fact: 'An oval video board hangs over the field, and it is longer than the field itself.' },
    { city: 'New Orleans', stadium: 'Caesars Superdome', team: 'Saints', opened: 1975, seats: '73,000', at: [29.9511, -90.0812], xy: [619, 501], topic: 'My Own Investigation: the big final',
      fact: 'This giant dome has hosted the Super Bowl eight times.' } ] },
  mlb: { ball: '⚾', weeks: [
    { city: 'Boston', stadium: 'Fenway Park', team: 'Red Sox', opened: 1912, seats: '37,000', at: [42.3467, -71.0972], xy: [897, 186], topic: 'Baseball Lab: variables, print and tables',
      fact: 'The oldest ballpark in the big leagues. Its left-field wall, the Green Monster, is 37 feet tall.' },
    { city: 'New York', stadium: 'Yankee Stadium', team: 'Yankees', opened: 2009, seats: '47,000', at: [40.8296, -73.9262], xy: [861, 229], topic: 'Stat Detective: text, numbers and questions',
      fact: 'Behind center field is Monument Park, an outdoor museum of Yankees legends.' },
    { city: 'Chicago', stadium: 'Wrigley Field', team: 'Cubs', opened: 1914, seats: '42,000', at: [41.9484, -87.6553], xy: [641, 240], topic: 'Umpire Bot: if, elif and else',
      fact: 'The outfield walls are covered in real ivy. Sometimes the ball gets lost in the leaves!' },
    { city: 'St. Louis', stadium: 'Busch Stadium', team: 'Cardinals', opened: 2006, seats: '44,000', at: [38.6226, -90.1928], xy: [606, 314], topic: 'My Lineup Card: lists',
      fact: 'From the seats you can see the giant Gateway Arch behind the outfield.' },
    { city: 'Houston', stadium: 'Daikin Park', team: 'Astros', opened: 2000, seats: '41,000', at: [29.7573, -95.3555], xy: [522, 509], topic: 'Game Day Loop: for loops',
      fact: 'The roof opens and closes, and a train rolls along the wall when the Astros hit a home run.' },
    { city: 'Los Angeles', stadium: 'Dodger Stadium', team: 'Dodgers', opened: 1962, seats: '56,000', at: [34.0739, -118.2400], xy: [122, 370], topic: 'Build Your Own Machine: functions',
      fact: 'It has more seats than any other ballpark in baseball.' },
    { city: 'San Francisco', stadium: 'Oracle Park', team: 'Giants', opened: 2000, seats: '41,000', at: [37.7786, -122.3893], xy: [73, 275], topic: 'Player Cards: dictionaries',
      fact: 'Big home runs fly over the right-field wall and splash into the bay, where fans wait in kayaks.' },
    { city: 'Seattle', stadium: 'T-Mobile Park', team: 'Mariners', opened: 1999, seats: '47,000', at: [47.5914, -122.3325], xy: [132, 72], topic: 'Guess the Player: input, while and random',
      fact: 'Its roof slides over the field like a giant umbrella when it rains.' },
    { city: 'Baltimore', stadium: 'Oriole Park at Camden Yards', team: 'Orioles', opened: 1992, seats: '40,000', at: [39.2840, -76.6217], xy: [826, 271], topic: 'Chart Room: bar and line charts',
      fact: 'A huge old brick warehouse stands right behind right field.' },
    { city: 'Kansas City', stadium: 'Kauffman Stadium', team: 'Royals', opened: 1973, seats: '38,000', at: [39.0517, -94.4803], xy: [535, 308], topic: 'My Own Investigation: the big final',
      fact: 'Giant fountains shoot water into the air behind the outfield wall.' } ] }
};
// What the coach says about a stadium. Shared by the game page and the voice recorder (tools/record-voice.mjs).
const stadiumLine = w => `<b>${w.stadium}</b>, home of the ${w.team}. Opened in ${w.opened}, about ${w.seats} seats. ${w.fact}`;
const playbookLine = (w, i) => `Week ${i + 1} playbook: <b>${w.topic}</b>.`;
const labFile = (sp, i) => `labs/${sp}-${String(i + 1).padStart(2, '0')}.js`;
// A week is playable once its lab file exists in labs/. Calls back each time one is found.
function findLabs(onFound) {
  for (const sp of ['nfl', 'mlb']) SEASON[sp].weeks.forEach((w, i) => fetch(labFile(sp, i), { method: 'HEAD' }).then(r => { if (r.ok) { w.ready = true; onFound?.(sp, i); } }).catch(() => {}));
}
const loadWins = () => { try { return { nfl: [], mlb: [], ...JSON.parse(localStorage.getItem('wins')) }; } catch { return { nfl: [], mlb: [] }; } };
