# State and namespaces

One Python interpreter lives in the worker for the whole life of a manager. Globals persist between runs unless you pass a namespace.

## Use

```javascript
await manager.executeAsync('a.py', 'x = 41');
const r1 = await manager.executeAsync('b.py', 'print(x + 1)');
r1.stdout   // "42\n": globals persist

const r2 = await manager.executeAsync('c.py', "print('x' in globals())", {});
r2.stdout   // "False\n": the namespace object isolates the run
```

The third argument is a plain object. The worker converts it to a Python dict and runs the code with that dict as its globals, then discards it. The Brython backend accepts the argument and ignores it.

## Details

Persistence is deliberate: a notebook-like page can define a function in one run and call it in the next. `input()` support keeps this property, since neither bridge wraps the code in a function.

A namespaced run gives these verified guarantees:

- Assignments, `def` statements and `import` bindings land in the namespace dict and die with the run.
- Rebinding `missive`, `input` or any other name cannot shadow them for later runs.
- The capture layer (stdout and stderr buffers, missive slot, figure capture, the input bridge) is out of reach by construction: the worker calls it through references held since boot, never through a namespace.

What a namespaced run can still do, because the interpreter is shared:

- mutate `builtins` (`import builtins; builtins.missive = ...`), which poisons the name for user code in later runs, though capture itself stays intact,
- monkey-patch any imported module through `sys.modules`,
- write to the virtual filesystem, where files persist for the manager's life,
- leave matplotlib state behind (the next run's `reset_captures()` closes leftover figures),
- post arbitrary protocol messages through the `js` bridge, and burn CPU or memory without quota.

For default-namespace runs the worker posts a `warning` the first time user code shadows `missive` or `input` in the persistent globals.

Concurrent `executeAsync` calls on one manager are serialized in call order, each with its own request id. A timeout rejects the caller but does not interrupt Python; the late result is discarded by id and only logged in `executionHistory`. A worker crash rejects every pending promise with the cause.

## Limits

If runs must not observe each other at all, use one manager per trust domain: `destroy()` and recreate, or run several managers side by side. Namespace isolation is a convenience for well-behaved code, not a sandbox (see [security](security.md)).

## See also

[State across executions](../execution-flows.md#state-across-executions) traces persistence, isolation, serialization, timeout and crash. Live: [multiple executions](https://pointcarre-app.github.io/nagini/scenery/executions/#multiple).
