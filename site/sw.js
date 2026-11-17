// Keeps the big files in this browser after the first visit, so coming back opens a lab in seconds instead of
// downloading Python again, and a lab already open keeps working on a shaky connection.
// It only ever stores files from our own site; nothing is sent anywhere. Registered by js/main.js.
//   Python (assets/vendor/pyodide/<version>/): the version is in the path, so the cached copy is used as it is.
//   Data (data/*.csv) and recorded voice (assets/voice/*.mp3): the cached copy at once, refreshed in the background.
//   Everything else (pages, code, lessons, pictures): the network first, so an update shows at once;
//   the cached copy only when the network fails.
// Change VERSION to throw every cached copy away (the new service worker deletes the old caches).
const VERSION = 'python-season-1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const key of await caches.keys()) if (key !== VERSION) await caches.delete(key);
  await self.clients.claim();
})()));

const keep = (req, res) => {
  if (res.ok && res.status === 200 && res.type === 'basic') caches.open(VERSION).then(c => c.put(req, res));
};
async function cacheFirst(req) {
  const hit = await caches.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  keep(req, res.clone());
  return res;
}
async function staleWhileRevalidate(req) {
  const hit = await caches.match(req);
  const fresh = fetch(req).then(res => { keep(req, res.clone()); return res; });
  if (hit) { fresh.catch(() => {}); return hit; }
  return fresh;
}
async function networkFirst(req) {
  try {
    const res = await fetch(req);
    keep(req, res.clone());
    return res;
  } catch (e) {
    const hit = await caches.match(req);
    if (hit) return hit;
    throw e;
  }
}

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;   // only our own files
  if (url.pathname.startsWith('/api/')) return;
  // Audio asks for byte ranges, which a cached whole file does not answer well (Safari): leave those to the browser.
  if (req.headers.has('range')) return;
  if (url.pathname.startsWith('/assets/vendor/pyodide/')) return e.respondWith(cacheFirst(req));
  if (/\.(csv|mp3)$/.test(url.pathname)) return e.respondWith(staleWhileRevalidate(req));
  e.respondWith(networkFirst(req));
});
