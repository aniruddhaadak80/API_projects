// Tiny service worker so Hammock opens with the Wi-Fi off after the first visit.
// App shell + the Transformers.js / ONNX Runtime files from jsDelivr are cached here.
// Gemma's weights are cached separately by Transformers.js (Cache API, "transformers-cache").
const CACHE = 'hammock-v2';
const SHELL = ['./', './index.html', './src/style.css', './src/app.js', './src/core.js', './src/worker.js', './assets/hero.jpg',
  './samples/family-group.txt', './samples/hackathon-team.txt', './assets/favicon.svg'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  const sameOrigin = url.origin === location.origin;
  const cdn = url.hostname === 'cdn.jsdelivr.net';
  if (!sameOrigin && !cdn) return; // model downloads go straight to Transformers.js' own cache
  // network first for the app (so updates land), cache fallback for offline
  e.respondWith(fetch(e.request).then((res) => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return res;
  }).catch(() => caches.match(e.request, { ignoreSearch: sameOrigin })));
});
