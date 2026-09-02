# Security

Nagini adds no sandbox on top of what the browser and WebAssembly provide. Do not treat it as a security boundary for untrusted code.

## What user code can reach

On the Pyodide backend, code runs in a worker with the whole virtual filesystem, network access through the browser (`fetch` via `pyodide.http` or micropip), and the `js` module bridge to the worker scope, through which it can post arbitrary protocol messages. Never base a grade or a decision on a missive alone: the worker's output is untrusted by construction.

On the Brython backend, code runs in the main thread of the host page with full DOM access: cookies, `fetch` with the page's session, the whole document. Only run first-party, trusted code through it. Never feed it end-user or student code on a page that holds a session.

## Isolation between runs

Pass a `namespace` object to `executeAsync` so assignments and rebindings die with the run instead of persisting in the shared globals. The exact guarantees, and the list of what a namespaced run can still affect (builtins, `sys.modules`, the filesystem, matplotlib state, CPU and memory), are in [state and namespaces](state.md). The capture layer is called through references held by the worker since boot, so user code cannot corrupt result capture by rebinding names. If runs must not observe each other at all, use one manager per trust domain.

`ValidationUtils.checkDangerousPatterns(code)` in `src/utils/validation.js` is an opt-in heuristic that flags known risky patterns. It is not applied automatically and can be bypassed. Call it yourself before `executeAsync` if you want the signal.

## Content Security Policy

Nagini needs a blob worker plus scripts and wheels from wherever Pyodide is hosted. A reference policy for a page that self-hosts Nagini and uses the jsDelivr Pyodide CDN:

```
Content-Security-Policy:
  script-src 'self' https://cdn.jsdelivr.net;
  worker-src 'self' blob:;
  connect-src 'self' https://cdn.jsdelivr.net https://pypi.org https://files.pythonhosted.org;
```

`connect-src` must cover the hosts Pyodide fetches wheels from: jsDelivr for `loadPackage`, PyPI for micropip. With a self-hosted Pyodide (`pyodideCdnUrl`), replace the CDN entries with your own origin. Interactive `input()` needs no special headers: it is message-based, and native blocking uses JSPI, not SharedArrayBuffer. The cross-origin isolation headers set by `serve.py` (`Cross-Origin-Embedder-Policy: require-corp`, `Cross-Origin-Opener-Policy: same-origin`) remain a good default and will become necessary the day execution interruption lands, since that relies on SharedArrayBuffer.

## Pinning and integrity

Serve Nagini and `worker-dist.js` from your own origin in production, or pin CDN URLs to an immutable commit SHA rather than a tag, since tags can be re-pointed. The demo pages in this repository pin their third-party assets to exact versions with `integrity` attributes; do the same in your pages. Subresource integrity cannot cover dynamically imported modules, and the worker loads `pyodide.mjs` with a dynamic import, which is one more reason to self-host.

## See also

[Brython backend](brython.md) for the main-thread caveats, [install](../getting-started/install.md) for self-hosting.
