# Brython backend

Brython transpiles Python to JavaScript and runs it in the page's main thread. No worker, no WebAssembly, no download beyond the runtime: it starts instantly and can draw with turtle and touch the DOM.

## Use

```javascript
const manager = await Nagini.createManager('brython', [], [], [], '', {
  brythonJsPath: './nagini/brython/lib/brython.js',            // defaults: /src/brython/lib/brython.js
  brythonStdlibPath: './nagini/brython/lib/brython_stdlib.js', //           /src/brython/lib/brython_stdlib.js
});
await Nagini.waitForReady(manager);

const result = await manager.executeAsync('hello.py', `
from browser import document
document["out"].text = "hello from Brython"
missive({"done": True})
`);
result.stdout    // ""
result.missive   // { done: true }: a live object on this backend
```

The `packages`, `micropipPackages`, `filesToLoad` and `workerPath` arguments are ignored; pass empty values.

## Details

The manager injects the two Brython scripts once, then each run appends a `<script type="text/python3">` wrapper that embeds the user code as a JSON string inside a try/except. Whether the code succeeds or raises, the wrapper calls back with stdout, stderr, the missive and the error, keyed by execution id so overlapping runs cannot clobber each other. The result object has the same shape as on Pyodide, with `figures` always empty.

Turtle draws into an SVG. Brython replays the frames only when `turtle.done()` runs, so end turtle programs with it; the scenery demo appends the call when it is missing.

## Limits

| Not available | Behavior |
| --- | --- |
| `input()` | `queueInput`, `provideInput` and `setInputCallback` log a console warning and do nothing. |
| `fs()` | Throws. |
| packages | Only the Brython standard library. |
| `namespace` argument | Accepted and ignored. |
| figures | `result.figures` is always `[]`. |

The code runs on the UI thread: a long loop freezes the page. The timeout removes the script element and rejects, but cannot stop code already running.

Security: the code has the full DOM, cookies and the page's session. Only run first-party, trusted code through this backend. See [security](security.md).

## See also

[Brython executeAsync](../execution-flows.md#brython-executeasync) traces a run. The [scenery suite](https://pointcarre-app.github.io/nagini/scenery/) runs the Brython tests in the browser, turtle included.
