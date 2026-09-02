# Missive

A missive is the structured answer of a run. Python calls `missive({...})` once; the value comes back on `result.missive`.

## Use

```javascript
const result = await manager.executeAsync('m.py', `
missive({"answer": 42, "status": "ok"})
`);

// portable across both backends
const m = typeof result.missive === 'string' ? JSON.parse(result.missive) : result.missive;
m.answer   // 42
```

## Details

`missive` is a builtin available to user code on both backends. It accepts one JSON-serializable value, usually a dict, and may be called once per run: a second call raises `ValueError`. When the code never calls it, `result.missive` is `null`.

The two backends disagree on the type, and this asymmetry is real in the current release:

| Backend | `result.missive` |
| --- | --- |
| Pyodide | A JSON string, produced by `json.dumps` in the worker. Parse it yourself. |
| Brython | The live object handed to the callback, already usable. `JSON.parse` on it throws. |

On the Pyodide backend the capture layer is called through module references held by the worker since boot, so user code that rebinds `json` or other names cannot corrupt the missive. Rebinding `missive` itself in the persistent globals triggers a one-time `warning` message (a `console.warn` on the page), because that shadow outlives the run.

## Limits

Values must survive `json.dumps`: sets, numpy arrays and custom objects need converting first. There is one missive per run; for streams of values, print JSON lines to stdout and split them on the page.

## See also

[The missive channel](../execution-flows.md#the-missive-channel) shows both backends side by side. Live: [missive exchange](https://pointcarre-app.github.io/nagini/scenery/executions/#missive).
