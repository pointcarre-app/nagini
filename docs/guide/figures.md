# Figures

Every matplotlib figure left open at the end of a run comes back as a base64 PNG in `result.figures`. Pyodide backend only.

## Use

Create the manager with `matplotlib` in the packages list, then draw:

```javascript
const manager = await Nagini.createManager('pyodide', ['matplotlib'], [], [], WORKER);
await Nagini.waitForReady(manager, 60000);

const result = await manager.executeAsync('plot.py', `
import matplotlib.pyplot as plt
plt.plot([0, 1, 2], [0, 1, 4])
plt.title("squares")
`);

for (const b64 of result.figures) {
  const img = document.createElement('img');
  img.src = 'data:image/png;base64,' + b64;
  document.body.appendChild(img);
}
```

## Details

At boot the worker switches matplotlib to the `agg` backend, the only one that renders inside a worker, and disables font caching. No `plt.show()` is needed: after the run, the worker walks the pyplot figure registry, saves each figure to PNG in memory and encodes it. Several figures give several entries, in creation order.

Before each run, `reset_captures()` closes figures left over from the previous one, so a run only returns what it drew itself.

The figures are on the resolved result only. The `executionHistory` entry drops them to keep memory bounded.

## Limits

Interactive backends, animations and `plt.show()` blocking behavior do not exist in a worker. Anything that needs a display falls back to a static PNG.

## See also

[Figure capture](../execution-flows.md#figure-capture-matplotlib) traces the messages. Live: [matplotlib capture](https://pointcarre-app.github.io/nagini/scenery/executions/#matplotlib) and the [sympy](https://pointcarre-app.github.io/nagini/scenery/sympy/) page, whose symbolic-to-figure section feeds a sympy expression to matplotlib.
