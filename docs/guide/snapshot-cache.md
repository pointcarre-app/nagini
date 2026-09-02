# Snapshot cache

With `snapshotCache: true`, the worker stores a memory snapshot of the freshly booted interpreter in IndexedDB and restores it on later boots in about 100 ms instead of about 0.8 s. Pyodide backend only.

## Use

```javascript
const manager = await Nagini.createManager('pyodide', ['matplotlib'], [], [], WORKER, { snapshotCache: true });
await Nagini.waitForReady(manager, 60000);
manager.snapshotRestored   // true when this boot came from the cache
```

## Details

The snapshot is taken right after Pyodide boots and Nagini's embedded Python modules are loaded, and right before the `input()` bridge is installed. That placement is a hard constraint: the bridge keeps a live JavaScript reference inside the interpreter, and Pyodide's serializer rejects those.

The cache key is the full Pyodide base URL plus a SHA-256 of the embedded Python sources, so a runtime upgrade or a change in Nagini's Python side invalidates the entry by construction. One entry weighs about 31 MB. Storing a new one evicts every other Nagini entry.

After a restore, the worker replays what the snapshot cannot hold: the input bridge, `filesToLoad`, `packages` and `micropipPackages`. Everything else in the boot sequence is unchanged.

The cache is best-effort. A missing IndexedDB, a quota error, or a corrupt entry (deleted after a failed restore) all fall back to a fresh boot, and the page never sees an error.

## Limits

Package state cannot be snapshotted on current Pyodide: loading any package creates the same kind of live reference the serializer rejects. A package-heavy manager therefore saves only the interpreter boot, not the package time. Snapshots are per browser profile, private to the origin, and disappear with site data.

## See also

[The snapshot cache branch](../execution-flows.md#the-snapshot-cache-branch) of the initialization flow. The [executions](https://pointcarre-app.github.io/nagini/scenery/executions/) page boots with the option on; the [snapshot benchmark](https://pointcarre-app.github.io/nagini/scenery/experiments-snapshot/) page measures fresh boot against restore.
