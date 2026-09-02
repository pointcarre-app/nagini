# Execution and results

`executeAsync` runs a string of Python and resolves with everything the run produced.

## Use

```javascript
const result = await manager.executeAsync('hello.py', `
name = "world"
print(f"hello {name}")
`, undefined, 30000);

result.stdout   // "hello world\n"
result.stderr   // "" or the traceback
result.error    // null, or { name, message }
result.time     // milliseconds
```

Two variants share the same machinery. `executeFile(filename, code, namespace)` is fire and forget. `Nagini.executeFromUrl(url, manager, namespace)` fetches the code first and uses the last path segment as filename.

## The result object

| Field | Type | Notes |
| --- | --- | --- |
| `filename` | string | Echo of the first argument. |
| `stdout`, `stderr` | string | Everything printed during the run. The traceback of an uncaught exception is in `stderr`. |
| `error` | object or null | `{ name, message }` when Python raised. On current Pyodide `message` is often the fallback `"Unknown execution error"`, so read `stderr` for the diagnostic. |
| `missive` | string, object or null | The structured answer of the run: a JSON string on Pyodide, a live object on Brython. See [missive](missive.md). |
| `figures` | string array | Base64 PNG for every matplotlib figure. See [figures](figures.md). |
| `time` | number | Execution time in milliseconds, measured in the worker. |
| `timestamp` | string | ISO date of the run, added by the manager. |
| `executedWithNamespace` | boolean | Present when a namespace object was passed. |

## Details

A Python exception resolves the promise with `error` set. The promise rejects only for infrastructure reasons: invalid arguments, manager not ready, the timeout, or a worker crash. Handle both paths:

```javascript
try {
  const r = await manager.executeAsync('run.py', code);
  if (r.error) show(r.stderr);
} catch (e) {
  show(String(e));   // timeout, crash, bad arguments
}
```

Calls on one manager are serialized in call order: one interpreter lives in the worker, so a second `executeAsync` waits for the first to settle. Each request carries an id, so a late answer from a timed-out run can never be delivered to the next call.

The timeout (30 s by default) rejects the promise but does not interrupt Python. The worker finishes the run, then serves the next message. The late result is discarded for the caller but still logged in `executionHistory`. Raise `timeoutMs` for long computations and for anything that waits on `input()`.

`executionHistory` keeps the last 50 results without their figures. `clearExecutionHistory()` empties it. `destroy()` rejects every pending promise, terminates the worker and revokes the blob URL.

## Limits

There is no way to interrupt a running execution yet. A tight infinite loop keeps the worker busy until the page drops the manager with `destroy()`.

## See also

[Classic executeAsync](../execution-flows.md#classic-executeasync) traces the messages. Live: [classic](https://pointcarre-app.github.io/nagini/scenery/executions/#classic) and [error with traceback](https://pointcarre-app.github.io/nagini/scenery/executions/#error).
