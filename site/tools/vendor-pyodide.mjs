// Copies Python (Pyodide) and the packages the labs use into the site, so the browser gets them from our own site.
//   cd site/tools && node vendor-pyodide.mjs
// Source: the pyodide npm package in node_modules (its version is pinned in package.json), which holds the engine
// and the wheels check-lab.mjs uses. Every wheel is checked against the sha256 in pyodide-lock.json.
// Writes site/assets/vendor/pyodide/<version>/. The version is in the path, so the files never change under a
// URL and can be cached for good (sw.js, Caddy). After updating Pyodide, also update PY in py-worker.js.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)), SRC = path.join(HERE, 'node_modules', 'pyodide');
const version = JSON.parse(fs.readFileSync(path.join(SRC, 'package.json'), 'utf8')).version;
const OUT = path.resolve(HERE, '..', 'assets', 'vendor', 'pyodide', version);
const lock = JSON.parse(fs.readFileSync(path.join(SRC, 'pyodide-lock.json'), 'utf8')).packages;

// pandas for the tables, matplotlib for the charts, and everything they need.
const need = new Set();
const add = name => { if (need.has(name)) return; need.add(name); lock[name].depends.forEach(add); };
['pandas', 'matplotlib'].forEach(add);

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const copy = f => fs.copyFileSync(path.join(SRC, f), path.join(OUT, f));
['pyodide.js', 'pyodide.asm.js', 'pyodide.asm.wasm', 'python_stdlib.zip', 'pyodide-lock.json'].forEach(copy);
for (const name of need) {
  const { file_name: f, sha256 } = lock[name];
  if (!fs.existsSync(path.join(SRC, f))) throw new Error(`${f} is not in node_modules/pyodide: run node check-lab.mjs nfl-01 once, it downloads the packages`);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(path.join(SRC, f))).digest('hex');
  if (hash !== sha256) throw new Error(`${f}: sha256 does not match pyodide-lock.json`);
  copy(f);
}
fs.writeFileSync(path.join(OUT, 'LICENSE.txt'), `Pyodide ${version} (https://pyodide.org, https://github.com/pyodide/pyodide), Mozilla Public License 2.0.
The Python packages here (${[...need].sort().join(', ')}) keep their own open-source licences.
Copied unchanged from the pyodide npm package by site/tools/vendor-pyodide.mjs.
`);
const mb = fs.readdirSync(OUT).reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0) / 1e6;
console.log(`assets/vendor/pyodide/${version}: ${fs.readdirSync(OUT).length} files, ${mb.toFixed(1)} MB (${need.size} packages, all sha256 checked)`);
