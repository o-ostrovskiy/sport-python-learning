// Checks the site's files without a browser (IMPROVEMENTS.md item 8). Needs no answer keys.
//   cd site/tools && node check-site.mjs
// 1. Syntax: node --check on every script of the site, the tools and the home server.
// 2. Links: every local href / src in the pages, and every import in site/js, points at a file that exists,
//    and every #anchor points at an id on that page. Links to other sites are listed, not fetched.
// 3. HTML basics: doctype, <html lang>, one <title>, a viewport, no repeated ids, alt on every image,
//    a name on every button.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)), SITE = path.resolve(HERE, '..'), ROOT = path.resolve(SITE, '..');
const fails = [];
const fail = m => fails.push(m);
const rel = f => path.relative(ROOT, f);

// 1. Syntax
const walk = (dir, keep) => fs.readdirSync(dir, { withFileTypes: true }).flatMap(d => {
  const p = path.join(dir, d.name);
  if (d.isDirectory()) return ['node_modules', 'vendor', 'answers'].includes(d.name) ? [] : walk(p, keep);
  return keep(p) ? [p] : [];
});
const scripts = [...walk(SITE, p => /\.(m?js)$/.test(p)), ...walk(path.join(ROOT, 'server'), p => p.endsWith('.mjs'))];
for (const f of scripts) {
  try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); }
  catch (e) { fail(`syntax: ${rel(f)}: ${String(e.stderr).split('\n').find(l => /Error/.test(l)) || 'does not parse'}`); }
}

// 2 and 3. Pages
const pages = fs.readdirSync(SITE).filter(f => f.endsWith('.html'));
const idsOf = html => [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
const outside = new Set();
for (const name of pages) {
  const file = path.join(SITE, name), html = fs.readFileSync(file, 'utf8'), where = `site/${name}`;
  if (!/^<!doctype html>/i.test(html)) fail(`${where}: no <!doctype html>`);
  if (!/<html lang="[a-z-]+"/.test(html)) fail(`${where}: <html> has no lang`);
  if ((html.match(/<title>/g) || []).length !== 1) fail(`${where}: needs exactly one <title>`);
  if (!/<meta name="viewport"/.test(html)) fail(`${where}: no viewport meta`);
  const ids = idsOf(html), seen = new Set();
  for (const id of ids) { if (seen.has(id)) fail(`${where}: id "${id}" is used twice`); seen.add(id); }
  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(img)) fail(`${where}: image without alt: ${img.slice(0, 60)}`);
  for (const [, attrs, text] of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g))
    if (!text.replace(/<[^>]+>/g, '').trim() && !/aria-label="[^"]+"/.test(attrs)) fail(`${where}: a button with no name: <button${attrs}>`);
  for (const [, url] of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:)?\/\//.test(url)) { outside.add(url); continue; }
    if (/^(mailto|data|javascript):/.test(url)) continue;
    const [p, hash] = url.split('#'), target = p ? path.join(SITE, p.split('?')[0]) : file;
    if (!fs.existsSync(target)) { fail(`${where}: link to a missing file: ${url}`); continue; }
    if (hash && target.endsWith('.html') && !idsOf(fs.readFileSync(target, 'utf8')).includes(hash)) fail(`${where}: no id "${hash}" for ${url}`);
  }
}
// Imports between the game's modules.
for (const f of walk(path.join(SITE, 'js'), p => p.endsWith('.js'))) {
  for (const [, spec] of fs.readFileSync(f, 'utf8').matchAll(/(?:^|\n)\s*(?:import|export)\b[^'"\n]*?from\s+'([^']+)'|(?:^|\n)\s*import\s+'([^']+)'/g)) {
    if (spec && !fs.existsSync(path.resolve(path.dirname(f), spec))) fail(`${rel(f)}: imports a missing file: ${spec}`);
  }
}

console.log(`${fails.length ? '✗' : '✓'} site: ${scripts.length} scripts parse, ${pages.length} pages checked; links to other sites (not fetched): ${[...outside].length}`);
fails.forEach(f => console.log('   FAIL  ' + f));
process.exit(fails.length ? 1 : 0);
