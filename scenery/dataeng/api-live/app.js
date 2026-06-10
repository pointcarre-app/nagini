/**
 * API vivante :: logique de la page
 * Boot Nagini (Pyodide + fastapi), app FastAPI + mini-driver ASGI,
 * pont service worker <-> Python, client REST.
 */

import { Nagini } from '../../../src/nagini.js';

const WORKER_PATH = '../../../src/pyodide/worker/worker-dist.js';

const $ = (id) => document.getElementById(id);

let manager = null;
let pythonReady = false;

// ---------------------------------------------------------------- python

const BOOTSTRAP = `
# L'app FastAPI et son mini-driver ASGI (asyncio pur, zéro thread)
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(
    title="API produits (Pyodide)",
    version="1.0",
    description="Une vraie FastAPI qui tourne dans votre navigateur.",
)

PRODUITS = {
    1: {"nom": "clavier", "prix": 49.9},
    2: {"nom": "souris", "prix": 19.9},
    3: {"nom": "ecran", "prix": 179.0},
}

class Produit(BaseModel):
    nom: str
    prix: float

@app.get("/health")
async def health():
    import sys
    return {"statut": "ok", "python": sys.version.split()[0], "moteur": "pyodide"}

@app.get("/produits")
async def lister_produits(limit: int = 10):
    items = [{"id": k, **v} for k, v in sorted(PRODUITS.items())][:limit]
    return {"total": len(PRODUITS), "donnees": items}

@app.get("/produits/{produit_id}")
async def lire_produit(produit_id: int):
    if produit_id not in PRODUITS:
        raise HTTPException(status_code=404, detail="produit inconnu")
    return {"id": produit_id, **PRODUITS[produit_id]}

@app.post("/produits", status_code=201)
async def creer_produit(p: Produit):
    nouvel_id = max(PRODUITS) + 1
    PRODUITS[nouvel_id] = p.model_dump()
    return {"id": nouvel_id, **p.model_dump()}

async def asgi_call(req):
    """Livre une requête HTTP à l'app ASGI, in-process, sans réseau."""
    corps = (req.get("body") or "").encode()
    scope = {
        "type": "http",
        "asgi": {"version": "3.0", "spec_version": "2.3"},
        "http_version": "1.1",
        "method": req["method"],
        "scheme": "http",
        "path": req["path"],
        "raw_path": req["path"].encode(),
        "query_string": (req.get("query") or "").encode(),
        "headers": ([(b"content-type", b"application/json"),
                     (b"content-length", str(len(corps)).encode())]
                    if corps else []),
        "server": ("pyodide", 80),
        "client": ("navigateur", 0),
        "root_path": "",
    }
    deja_lu = False
    async def receive():
        nonlocal deja_lu
        if deja_lu:
            return {"type": "http.disconnect"}
        deja_lu = True
        return {"type": "http.request", "body": corps, "more_body": False}
    messages = []
    async def send(message):
        messages.append(message)
    await app(scope, receive, send)
    debut = next(m for m in messages if m["type"] == "http.response.start")
    body = b"".join(m.get("body", b"")
                    for m in messages if m["type"] == "http.response.body")
    return {
        "status": debut["status"],
        "headers": {k.decode(): v.decode() for k, v in debut.get("headers", [])},
        "body": body.decode("utf-8", "replace"),
    }

print("app FastAPI prête :", app.title)
`;

const DRIVER = `
import json
_req = json.loads(__REQ_JSON__)
_resp = await asgi_call(_req)
missive(_resp)
`;

function driverFor(req) {
  // double encodage JSON : la requête entre comme une chaîne, jamais
  // interpolée dans le source (pas d'injection de code possible)
  return DRIVER.replace('__REQ_JSON__', JSON.stringify(JSON.stringify({
    method: req.method, path: req.path, query: req.query, body: req.body,
  })));
}

// ---------------------------------------------------------------- pont SW -> python

function reponse503(port, detail) {
  port.postMessage({
    status: 503,
    headers: { 'Content-Type': 'application/json', 'Retry-After': '2' },
    body: JSON.stringify({ error: 'python pas encore prêt', detail }),
  });
}

navigator.serviceWorker?.addEventListener('message', async (event) => {
  const data = event.data;
  if (!data || data.kind !== 'api-request') return;
  const port = event.ports[0];
  if (!pythonReady) {
    reponse503(port, 'Pyodide ou FastAPI en cours de chargement, réessayez.');
    return;
  }
  try {
    const result = await manager.executeAsync(
      'api-' + data.id + '.py', driverFor(data), undefined, 30000);
    if (result.error || !result.missive) {
      port.postMessage({
        status: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: result.error ? result.error.message : 'aucune réponse produite',
          stderr: (result.stderr || '').slice(-1500),
        }, null, 2),
      });
    } else {
      port.postMessage(JSON.parse(result.missive));
    }
  } catch (e) {
    port.postMessage({
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: String(e) }),
    });
  }
});

// ---------------------------------------------------------------- ui

function setBadge(id, state, label) {
  const el = $(id);
  el.className = 'badge badge-sm ' + state; // badge-warning | badge-success | badge-error
  el.textContent = label;
}

function maybeEnable() {
  const swOk = !!navigator.serviceWorker?.controller;
  $('client-rest').classList.toggle('opacity-40', !(swOk && pythonReady));
  for (const btn of document.querySelectorAll('[data-fetch]')) {
    btn.disabled = !(swOk && pythonReady);
  }
  $('go-btn').disabled = !(swOk && pythonReady);
}

function logRequest(method, url, status, ms, body) {
  const tpl = document.createElement('div');
  const ok = status >= 200 && status < 400;
  tpl.className = 'border border-base-300 rounded-box overflow-hidden';
  tpl.innerHTML = `
    <div class="flex items-center gap-2 px-3 py-2 bg-base-200 text-xs mono">
      <span class="badge badge-xs ${ok ? 'badge-success' : 'badge-error'}">${status}</span>
      <span class="font-bold">${method}</span>
      <span class="truncate flex-1"></span>
      <span class="opacity-60">${ms} ms</span>
    </div>
    <pre class="text-xs mono p-3 overflow-auto max-h-56 m-0"></pre>`;
  tpl.querySelector('span.truncate').textContent = url;
  let pretty = body;
  try { pretty = JSON.stringify(JSON.parse(body), null, 2); } catch (_) { /* brut */ }
  tpl.querySelector('pre').textContent = pretty;
  const journal = $('journal');
  journal.prepend(tpl);
  while (journal.children.length > 12) journal.lastChild.remove();
}

async function appeler(method, url, body = null) {
  const t0 = performance.now();
  try {
    const r = await fetch(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body,
    });
    const texte = await r.text();
    logRequest(method, url, r.status, Math.round(performance.now() - t0), texte);
  } catch (e) {
    logRequest(method, url, 0, Math.round(performance.now() - t0), String(e));
  }
}

// ---------------------------------------------------------------- boot

async function boot() {
  // --- service worker -------------------------------------------------
  if (!('serviceWorker' in navigator) || !window.isSecureContext) {
    setBadge('sw-badge', 'badge-error', 'service worker indisponible');
    $('fallback-alert').classList.remove('hidden');
    return;
  }
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    setBadge('sw-badge', 'badge-success', 'service worker actif');
    maybeEnable();
  });
  try {
    await navigator.serviceWorker.register('./sw.js', {
      scope: './', updateViaCache: 'none',
    });
    await navigator.serviceWorker.ready;
    if (navigator.serviceWorker.controller) {
      setBadge('sw-badge', 'badge-success', 'service worker actif');
    } else {
      setBadge('sw-badge', 'badge-warning', 'service worker : activation...');
    }
  } catch (e) {
    setBadge('sw-badge', 'badge-error', 'échec service worker');
    $('fallback-alert').classList.remove('hidden');
    return;
  }

  // --- python ----------------------------------------------------------
  setBadge('py-badge', 'badge-warning', 'chargement de Python + FastAPI');
  try {
    manager = await Nagini.createManager('pyodide', ['fastapi'], [], [], WORKER_PATH);
    await Nagini.waitForReady(manager, 180000);
    const r = await manager.executeAsync('bootstrap.py', BOOTSTRAP, undefined, 60000);
    if (r.error) throw new Error(r.error.message);
    pythonReady = true;
    window.manager = manager;
    setBadge('py-badge', 'badge-success', 'API Python prête');
  } catch (e) {
    setBadge('py-badge', 'badge-error', 'échec : ' + String(e).slice(0, 80));
    return;
  }
  maybeEnable();
}

for (const btn of document.querySelectorAll('[data-fetch]')) {
  btn.addEventListener('click', () => {
    const body = btn.dataset.body || null;
    appeler(btn.dataset.method || 'GET', btn.dataset.fetch, body);
  });
}
$('go-btn').addEventListener('click', () => appeler('GET', $('url-field').value));
$('url-field').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !$('go-btn').disabled) appeler('GET', $('url-field').value);
});
$('unregister-btn').addEventListener('click', async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  await reg?.unregister();
  alert('Service worker désinscrit : rechargez la page pour le réinstaller.');
});

boot();
