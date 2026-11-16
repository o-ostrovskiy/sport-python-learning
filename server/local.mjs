// Runs the site on this computer: the pages from site/ plus the /api/* routes that hide the Gemini key.
//   node server/local.mjs            (reads server/.env; PORT defaults to 8765)
// For home use only. The public site (python.mystoryland.ai) is the site/ folder as static files, with no server.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handle } from './handler.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url)), SITE = path.resolve(HERE, '..', 'site');
const env = { ...process.env };
try { for (const line of fs.readFileSync(path.join(HERE, '.env'), 'utf8').split('\n')) { const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/); if (m && !(m[1] in process.env)) env[m[1]] = m[2]; } } catch {}

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.csv': 'text/csv; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.wav': 'audio/wav', '.mp3': 'audio/mpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
// Never served: answer keys, build tools, server code, notes.
const HIDDEN = /^\/(labs\/answers|tools|functions)(\/|$)|\/\.|\.md$|\/config[^/]*\.js$/i;
const SECURITY = { 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', 'x-frame-options': 'SAMEORIGIN' };

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) {
      const chunks = []; let size = 0;
      for await (const c of req) { size += c.length; if (size > 10000) { res.writeHead(413).end(); return; } chunks.push(c); }
      const ip = (env.TRUST_PROXY === '1' && String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()) || req.socket.remoteAddress || 'unknown';
      const request = new Request(url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) });
      const out = await handle(request, env, ip);
      res.writeHead(out.status, { ...Object.fromEntries(out.headers), ...SECURITY }); res.end(Buffer.from(await out.arrayBuffer())); return;
    }
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
    let rel = decodeURIComponent(url.pathname); if (rel.endsWith('/')) rel += 'index.html';
    const file = path.join(SITE, rel);
    if (HIDDEN.test(rel) || !file.startsWith(SITE + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found'); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'content-length': fs.statSync(file).size,
      'cache-control': /\.(csv|png|jpg|webp)$/.test(file) ? 'public, max-age=3600' : 'no-cache', ...SECURITY });
    if (req.method === 'HEAD') res.end(); else fs.createReadStream(file).pipe(res);
  } catch (e) { console.error(e); if (!res.headersSent) res.writeHead(500); res.end(); }
}).listen(Number(env.PORT) || 8765, () => console.log(`Python Season is running at http://localhost:${Number(env.PORT) || 8765}  (coach voice and questions: ${env.GEMINI_API_KEY ? 'on' : 'off, no GEMINI_API_KEY'})`));
