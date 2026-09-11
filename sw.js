const CACHE = 'menseki-v3';
const STATIC = ['./icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  /* HTMLは絶対にキャッシュしない - 常にネットワークから取得 */
  if(url.pathname.endsWith('.html') || url.pathname.endsWith('/') || url.pathname === ''){
    e.respondWith(fetch(e.request));
    return;
  }
  /* アイコン等の静的ファイルはキャッシュ優先 */
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request)));
});
