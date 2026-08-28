const CACHE = 'math-missing-step-v2';
const SHELL = ['/', '/index.html', '/assets/hero-signal.webp', '/assets/hero-signal.jpg', '/favicon.svg'];
self.addEventListener('install', (event) => event.waitUntil((async () => {
  const cache = await caches.open(CACHE);
  await cache.addAll(SHELL);
  const html = await (await fetch('/')).text();
  const builtFiles = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)].map((match) => match[1]);
  await cache.addAll(builtFiles);
  await self.skipWaiting();
})()));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request, { ignoreVary: true }).then((cached) => cached || fetch(event.request).then((response) => {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(event.request, copy));
    return response;
  }).catch(() => event.request.mode === 'navigate' ? caches.match('/', { ignoreVary: true }) : undefined)));
});
