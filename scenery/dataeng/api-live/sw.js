/**
 * API vivante :: service worker
 * Intercepte les fetch() vers ./api/* et les route vers la page,
 * qui les fait traiter par l'app FastAPI tournant dans Pyodide.
 * Tout le reste (CDN, wheels Pyodide, assets) passe sans interception.
 */

const SW_VERSION = 'api-live-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const API_PREFIX = new URL('./api/', self.registration.scope).pathname;

function jsonResponse(status, obj, headers = {}) {
  return new Response(JSON.stringify(obj, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'X-Served-By': SW_VERSION,
      ...headers,
    },
  });
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // exigence COEP : ne JAMAIS intercepter autre chose que ./api/*
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(API_PREFIX)) return;
  event.respondWith(handleApi(event, url));
});

async function handleApi(event, url) {
  // retrouver la page qui héberge Python
  let client = await self.clients.get(event.clientId);
  if (!client) {
    const fenetres = await self.clients.matchAll({ type: 'window' });
    client = fenetres.find((c) => c.url.startsWith(self.registration.scope));
  }
  if (!client) {
    return jsonResponse(503, { error: 'aucune page api-live ouverte' },
      { 'Retry-After': '2' });
  }

  // un MessageChannel par requête : le port EST la corrélation
  const { port1, port2 } = new MessageChannel();
  const reponse = new Promise((resolve) => {
    port1.onmessage = (e) => resolve(e.data);
  });

  client.postMessage({
    kind: 'api-request',
    id: crypto.randomUUID(),
    method: event.request.method,
    path: '/' + url.pathname.slice(API_PREFIX.length),
    query: url.search.slice(1),
    body: ['GET', 'HEAD'].includes(event.request.method)
      ? null
      : await event.request.text(),
  }, [port2]);

  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), 30000));
  const msg = await Promise.race([reponse, timeout]);
  port1.close();

  if (!msg) return jsonResponse(504, { error: 'timeout python (30 s)' });
  return new Response(msg.body, {
    status: msg.status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Served-By': SW_VERSION + ' + FastAPI/Pyodide',
      ...(msg.headers || {}),
    },
  });
}
