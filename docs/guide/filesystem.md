# Filesystem

The Pyodide worker has a virtual filesystem. The page can read and write it with `fs()`, and pre-load files from URLs at boot. Pyodide backend only.

## Use

```javascript
await manager.fs('mkdir',     { path: 'data' });
await manager.fs('writeFile', { path: 'data/notes.txt', content: 'hello' });
await manager.fs('exists',    { path: 'data/notes.txt' });      // true
await manager.fs('readFile',  { path: 'data/notes.txt' });      // "hello"
await manager.fs('listdir',   { path: 'data' }, 5000);          // ["notes.txt"], own timeout
```

Python sees the same tree:

```javascript
const r = await manager.executeAsync('read.py', `
print(open("data/notes.txt").read())
`);
```

## Files from URLs

`filesToLoad`, the fourth argument of `createManager`, downloads files into the filesystem before `ready`:

```javascript
const filesToLoad = [
  { url: 'https://example.com/modules/math_utils.py', path: 'utils/math_utils.py' },
  { url: 'https://example.com/modules/__init__.py',   path: 'utils/__init__.py' },
];
const manager = await Nagini.createManager('pyodide', [], [], filesToLoad, WORKER);
await Nagini.waitForReady(manager, 60000);

await manager.executeAsync('use.py', 'from utils.math_utils import fib\nprint(fib(10))');
```

Parent directories are created as needed. Each download is retried three times with a growing delay. The URL must be reachable from the worker, so it needs CORS headers when it is on another origin.

## Details

| Operation | Params | Resolves with |
| --- | --- | --- |
| `writeFile` | `path`, `content` | `{ success: true }` |
| `readFile` | `path` | the file content as a string |
| `mkdir` | `path` | `{ success: true }` |
| `exists` | `path` | boolean |
| `listdir` | `path` | array of names |

`fs()` requests are correlated by id like executions but not serialized behind them: one can be issued while a run is in flight, and the worker serves it as soon as its event loop is free, for instance while Python waits on `input()`. The default timeout is 10 s.

Files persist for the life of the manager, across runs and namespaces, and vanish with `destroy()`.

## Limits

The filesystem is in-memory. Nothing survives a page reload, and there is no delete or rename operation on the `fs()` surface; do those from Python with `os`.

## See also

[Filesystem operations](../execution-flows.md#filesystem-operations-fs) and the [initialization flow](../execution-flows.md#initialization-and-readypromise) for `filesToLoad`. Live: [filesystem](https://pointcarre-app.github.io/nagini/scenery/executions/#fs).
