// Bundles the code editor (CodeMirror 6, MIT licence) into one ES module served from our own site.
//   cd site/tools && node build-editor.mjs
// Writes site/assets/vendor/codemirror/codemirror.js and its LICENSE. Run it again after updating the packages.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const HERE = path.dirname(fileURLToPath(import.meta.url)), OUT = path.resolve(HERE, '..', 'assets', 'vendor', 'codemirror');
fs.mkdirSync(OUT, { recursive: true });
const versions = ['state', 'view', 'commands', 'language', 'autocomplete', 'lang-python']
  .map(p => `@codemirror/${p} ${JSON.parse(fs.readFileSync(path.join(HERE, 'node_modules/@codemirror', p, 'package.json'), 'utf8')).version}`).join(', ');
await build({
  entryPoints: [path.join(HERE, 'editor-entry.mjs')], bundle: true, format: 'esm', minify: true, target: 'es2020',
  outfile: path.join(OUT, 'codemirror.js'), legalComments: 'none',
  banner: { js: `// CodeMirror 6 (MIT licence, see LICENSE next to this file): ${versions}. Built by site/tools/build-editor.mjs.` },
});
fs.copyFileSync(path.join(HERE, 'node_modules/@codemirror/view/LICENSE'), path.join(OUT, 'LICENSE'));
console.log(`codemirror.js: ${(fs.statSync(path.join(OUT, 'codemirror.js')).size / 1024).toFixed(0)} KB (${versions})`);
