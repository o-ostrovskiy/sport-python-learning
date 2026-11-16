// Draws the season map once, at build time: the outline of the 48 lower states as SVG paths, and each stadium's
// spot on it. The page then needs no map library and no map service.
//   cd site/tools && node build-map.mjs
// Writes site/assets/usa-map.js (window.USA_MAP = { W, H, land, borders }) and an xy: [x, y] next to every
// at: [lat, lon] in site/season.js. Run it again after adding or moving a stadium.
// Outlines: us-atlas (US Census Bureau cartographic boundaries, public domain), Albers projection from d3-geo.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { geoAlbers, geoPath } from 'd3-geo';
import { merge, mesh } from 'topojson-client';
import { presimplify, simplify } from 'topojson-simplify';

const HERE = path.dirname(fileURLToPath(import.meta.url)), SITE = path.resolve(HERE, '..');
const W = 1000, H = 640;
const us = simplify(presimplify(JSON.parse(fs.readFileSync(path.join(HERE, 'node_modules/us-atlas/states-10m.json'), 'utf8'))), 0.001);
// No Alaska, Hawaii or territories: no stadium is there, and the 48 states get more room.
us.objects.states.geometries = us.objects.states.geometries.filter(g => !['02', '15', '60', '66', '69', '72', '78'].includes(g.id));
const land = merge(us, us.objects.states.geometries), borders = mesh(us, us.objects.states, (a, b) => a !== b);
const proj = geoAlbers().fitExtent([[30, 40], [W - 30, H - 40]], land), draw = geoPath(proj).digits(1);

const map = { W, H, land: draw(land), borders: draw(borders) };
fs.writeFileSync(path.join(SITE, 'assets', 'usa-map.js'),
  `// Made by tools/build-map.mjs from us-atlas (US Census Bureau outlines, public domain). Do not edit by hand.\nwindow.USA_MAP = ${JSON.stringify(map)};\n`);

const file = path.join(SITE, 'season.js');
let src = fs.readFileSync(file, 'utf8'), n = 0;
src = src.replace(/at: \[(-?[\d.]+), (-?[\d.]+)\](, xy: \[-?\d+, -?\d+\])?/g, (_, lat, lon) => {
  const [x, y] = proj([+lon, +lat]).map(Math.round); n++;
  if (!(x > 0 && x < W && y > 0 && y < H)) throw new Error(`stadium at ${lat}, ${lon} is off the map`);
  return `at: [${lat}, ${lon}], xy: [${x}, ${y}]`;
});
fs.writeFileSync(file, src);
const ctx = {}; vm.createContext(ctx); vm.runInContext(src + '\nthis.S = SEASON;', ctx);   // the file must still load
console.log(`usa-map.js: ${(fs.statSync(path.join(SITE, 'assets', 'usa-map.js')).size / 1024).toFixed(0)} KB; ${n} stadiums placed in season.js`);
