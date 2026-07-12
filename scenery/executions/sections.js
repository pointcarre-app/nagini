/**
 * Section catalog for the executions page.
 *
 * One entry per typical Nagini execution shape. Each section carries:
 * - blurb: one short paragraph of context
 * - flow: a compact pure-ASCII excerpt of the execution flow
 *   (drawing characters restricted to + - | > v ^)
 * - demos: runnable demos, each with the exact JS integration snippet
 *   that app.js really performs and one or more python steps
 *
 * Anchors (#classic, #error, #input, #matplotlib, #multiple, #missive,
 * #fs) are stable: docs/execution-flows.md links back to them. Each
 * section's docAnchor is the slug of the matching heading over there.
 */

export const DOC_URL = '../../docs/execution-flows.md';

export const SECTIONS = [

  // ------------------------------------------------------------ classic
  {
    id: 'classic',
    docAnchor: 'classic-executeasync',
    title: 'Classic execution',
    blurb: 'The base case: send a string of Python, get a result object back. '
      + 'The promise resolves with stdout, stderr, the execution time in ms '
      + 'and an error field that stays null on success.',
    flow: `executeAsync("classic.py", code)
        |
        v
+---------------------------+
| manager                   |
| id = next request id      |
| pending[id] = resolver    |
+---------------------------+
        |
        | postMessage: execute, id, code
        v
+---------------------------+
| worker                    |
| runPythonAsync(code)      |
| captures stdout + stderr  |
+---------------------------+
        |
        | postMessage: result, id
        v
+---------------------------+
| manager settles the       |
| promise stored for id     |
+---------------------------+
        |
        v
result: stdout, stderr, time, error`,
    demos: [
      {
        id: 'classic-basic',
        js: `// one shared manager for the whole page, created on first run
import { Nagini } from '../../src/nagini.js';

const manager = await Nagini.createManager(
  'pyodide',        // backend
  ['matplotlib'],   // pyodide packages, loaded at boot
  [],               // micropip packages
  [],               // files to load into the worker fs
  '../../src/pyodide/worker/worker-dist.js',
  { snapshotCache: true }  // cache the interpreter in IndexedDB:
                           // reloads of this page boot in ~100 ms,
                           // packages still load each time
);
await Nagini.waitForReady(manager, 180000);

const result = await manager.executeAsync(
  'classic.py',   // a name used for tracking
  code,           // the python source, a plain string
  undefined,      // no namespace: shared globals
  60000           // timeout in ms
);
// result.stdout, result.stderr, result.time, result.error`,
        steps: [
          {
            file: 'classic.py',
            button: 'Run',
            showDump: true,
            code: `print("hello from pyodide")
value = 6 * 7
print("6 * 7 =", value)

import sys
print("one quiet line on stderr", file=sys.stderr)`,
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------- error
  {
    id: 'error',
    docAnchor: 'classic-executeasync',
    title: 'Error and traceback',
    blurb: 'Raising code does not reject the promise. The failure travels '
      + 'inside the result: error flags the failure and stderr carries the '
      + 'full Python traceback (in practice error.message is often generic, '
      + 'read stderr for the diagnostic).',
    flow: `executeAsync("boom.py", code)
        |
        v
+----------------------------+
| worker                     |
| runPythonAsync raises      |
| error captured, stdout and |
| stderr still collected     |
+----------------------------+
        |
        | postMessage: result, id,
        | with error + traceback
        v
+----------------------------+
| manager resolves normally: |
| the promise does not throw |
+----------------------------+
        |
        v
check result.error, read result.stderr`,
    demos: [
      {
        id: 'error-raise',
        js: `const result = await manager.executeAsync('boom.py', code, undefined, 60000);

// a python exception does not reject the promise:
// the failure travels inside the result object
if (result.error) {
  console.log(result.error.name);     // 'PythonError'
  console.log(result.error.message);  // often generic, do not rely on it
  console.log(result.stderr);         // full traceback: the real diagnostic
}`,
        steps: [
          {
            file: 'boom.py',
            button: 'Run',
            code: `def read_config(path):
    raise FileNotFoundError(f"no such config file: {path}")

print("this line runs before the crash")
read_config("/etc/nagini.toml")
print("this line never runs")`,
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------- input
  {
    id: 'input',
    docAnchor: 'input-pausing-python-for-the-host',
    title: 'Interactive input()',
    blurb: 'input() has two engines, picked at boot and exposed as '
      + 'manager.inputMode: on browsers with JSPI (Chrome 137+) it blocks '
      + 'natively and the code runs unmodified, even input() inside sync '
      + 'functions; elsewhere the worker rewrites genuine input() calls to '
      + 'await input() on the AST. Either way the page decides how to '
      + 'answer: show a field through setInputCallback and provideInput, '
      + 'or queue values ahead of time with queueInput.',
    flow: `executeAsync("ask.py", code)
        |
        v
+-----------------------------+
| manager.inputMode?          |
+-----------------------------+
    |                |
    | jspi           | async
    v                v
+-----------+  +-------------------+
| code runs |  | worker rewrites   |
| unchanged |  | input() to await  |
|           |  | input() (AST)     |
+-----------+  +-------------------+
    |                |
    +--------+-------+
             | input() reached
             v
+-----------------------------+
| worker posts input_required |
| with the prompt text        |
+-----------------------------+
        |
        v
+-----------------------------+
| manager: queued input left? |
+-----------------------------+
    |                |
    | yes            | no
    v                v
+-----------+  +-------------------+
| dequeue,  |  | inputCallback     |
| auto send |  | shows a field;    |
|           |  | provideInput(...) |
+-----------+  +-------------------+
    |                |
    v                v
+-----------------------------+
| worker: input() returns,    |
| python resumes              |
+-----------------------------+
        |
        v
result as usual`,
    demos: [
      {
        id: 'input-interactive',
        heading: 'Interactive: answer in the field',
        note: 'A field appears under the editor when Python reaches input(). '
          + 'The run stays pending until you answer, so the timeout is raised.',
        js: `// manager.inputMode says which engine this browser got:
// 'jspi' (input() blocks natively, code unmodified) or
// 'async' (genuine input() calls rewritten to await input())
console.log(manager.inputMode);

// register once: called each time python reaches input()
manager.setInputCallback((prompt) => showFieldFor(prompt));

// the user submits the field:
sendButton.addEventListener('click', () => {
  manager.provideInput(field.value);
});

// raise the timeout: it keeps ticking while python waits
const result = await manager.executeAsync('ask.py', code, undefined, 180000);`,
        steps: [
          {
            file: 'ask.py',
            button: 'Run',
            timeoutMs: 180000,
            code: `name = input("what is your name? ")
color = input("favorite color? ")
print(f"hello {name}, {color} is a fine choice")`,
          },
        ],
      },
      {
        id: 'input-queued',
        heading: 'Programmatic: queue answers up front',
        note: 'Two values are queued before the run. Each input() consumes '
          + 'one in order and the callback is never called.',
        queued: ['grace', 'grace@navy.mil'],
        js: `// queue answers before running: each input() consumes
// one in order, the input callback is never called
manager.queueInput('grace');
manager.queueInput('grace@navy.mil');

const result = await manager.executeAsync('form.py', code, undefined, 60000);`,
        steps: [
          {
            file: 'form.py',
            button: 'Run with queued answers',
            code: `user = input("user: ")
email = input("email: ")
print("registered", user, "with address", email)
missive({"user": user, "email": email})`,
          },
        ],
      },
    ],
  },

  // --------------------------------------------------------- matplotlib
  {
    id: 'matplotlib',
    docAnchor: 'figure-capture-matplotlib',
    title: 'Matplotlib figure capture',
    blurb: 'plt.show() never opens a window: the worker renders the figure '
      + 'to PNG and ships it as a base64 string in result.figures. The '
      + 'matplotlib package is loaded once at manager boot, which is why '
      + 'the first run on this page takes a while.',
    flow: `executeAsync("plot.py", code)
        |
        v
+------------------------------+
| worker                       |
| plt.show() is intercepted    |
| figure rendered to PNG bytes |
| then encoded to base64       |
+------------------------------+
        |
        | result: id, figures list
        v
+------------------------------+
| page                         |
| img.src = "data:image/png;   |
| base64," + result.figures[0] |
+------------------------------+`,
    demos: [
      {
        id: 'matplotlib-damped',
        js: `const result = await manager.executeAsync('plot.py', code, undefined, 60000);

// each entry of result.figures is a base64 png string
for (const b64 of result.figures) {
  const img = document.createElement('img');
  img.src = 'data:image/png;base64,' + b64;
  target.appendChild(img);
}`,
        steps: [
          {
            file: 'plot.py',
            button: 'Run',
            code: `import math
import matplotlib.pyplot as plt

xs = [i / 40 for i in range(241)]
ys = [math.sin(x) * math.exp(-x / 4) for x in xs]

BG, GRID, FG = "#0e0f12", "#1d2025", "#d7dde2"
fig, ax = plt.subplots(figsize=(7.2, 3.8))
fig.patch.set_facecolor(BG)
ax.set_facecolor(BG)
ax.plot(xs, ys, color="#00e5a0", lw=1.6)
ax.set_title("damped sine, drawn off screen in the worker",
             color=FG, fontsize=10, loc="left", family="monospace")
ax.grid(color=GRID, lw=0.6)
ax.tick_params(colors=FG, labelsize=8)
for side in ax.spines.values():
    side.set_color(GRID)
plt.tight_layout()
plt.show()

print("figure captured into result.figures")`,
          },
        ],
      },
    ],
  },

  // ----------------------------------------------------------- multiple
  {
    id: 'multiple',
    docAnchor: 'state-across-executions',
    title: 'Multiple executions',
    blurb: 'One interpreter serves every run. Globals persist between '
      + 'executions, a namespace object isolates a run, concurrent calls '
      + 'are serialized by the manager, and responses are correlated by id '
      + 'so a timed-out run can never leak its late result into the next one.',
    flow: `executeAsync A   executeAsync B
     |                |
     v                v
+------------------------------+
| manager.executionChain       |
| serializes: A runs, then B   |
| each run has its own id      |
+------------------------------+
        |
        v
+------------------------------+
| one interpreter in the worker|
| globals persist between runs |
| unless a namespace object is |
| passed to executeAsync       |
+------------------------------+
        |
        v
+------------------------------+
| timeout: pending[id] removed |
| a late result with that id   |
| is discarded, later runs are |
| matched by their own ids     |
+------------------------------+
        |
        v
promises settle in call order, never mixed`,
    demos: [
      {
        id: 'multiple-globals',
        heading: 'Globals persist across runs',
        note: 'Run step 1, then step 2: the second run reads what the first '
          + 'one defined. Running step 2 first raises a NameError.',
        js: `// same manager, no namespace argument:
// run 1 writes the interpreter globals, run 2 reads them
await manager.executeAsync('globals-1.py', codeRun1, undefined, 60000);
await manager.executeAsync('globals-2.py', codeRun2, undefined, 60000);`,
        steps: [
          {
            file: 'globals-1.py',
            button: 'Run step 1',
            code: `shared_counter = 1
greeting = "set during run 1"
print("run 1: shared_counter =", shared_counter)`,
          },
          {
            file: 'globals-2.py',
            button: 'Run step 2',
            code: `shared_counter += 1
print("run 2: shared_counter =", shared_counter)
print("run 2: greeting from run 1:", greeting)`,
          },
        ],
      },
      {
        id: 'multiple-namespace',
        heading: 'A namespace object isolates a run',
        note: 'Step 1 runs with the namespace { session_user: "ada" }: it '
          + 'reads that value and cannot see the shared globals. Step 2 runs '
          + 'without a namespace and shows nothing leaked.',
        js: `// a plain object becomes the run's globals: the run reads
// its values and cannot see or touch the shared globals
const namespace = { session_user: 'ada' };
const scoped = await manager.executeAsync('scoped.py', code, namespace, 60000);

// follow-up run on the shared globals proves the isolation
const check = await manager.executeAsync('check.py', checkCode, undefined, 60000);`,
        steps: [
          {
            file: 'scoped.py',
            button: 'Run step 1 (with namespace)',
            namespace: { session_user: 'ada' },
            code: `print("session_user from the namespace object:", session_user)
print("shared_counter visible here:", "shared_counter" in globals())
private_note = "exists only inside this namespace"
print("private_note set in the namespace")`,
          },
          {
            file: 'check.py',
            button: 'Run step 2 (shared globals)',
            code: `print("private_note leaked into shared globals:",
      "private_note" in globals())
print("session_user leaked into shared globals:",
      "session_user" in globals())`,
          },
        ],
      },
      {
        id: 'multiple-concurrent',
        heading: 'Two calls fired together',
        note: 'Both promises are created before either resolves. The manager '
          + 'serializes the runs and each response reaches its own caller.',
        joint: 'Run both together',
        js: `// fire both without awaiting in between: the manager
// serializes them on the single interpreter and each
// response is matched to its caller by request id
const [a, b] = await Promise.all([
  manager.executeAsync('task-a.py', codeA, undefined, 60000),
  manager.executeAsync('task-b.py', codeB, undefined, 60000),
]);`,
        steps: [
          {
            file: 'task-a.py',
            code: `total = sum(range(2_000_000))
print("task a done, total =", total)`,
          },
          {
            file: 'task-b.py',
            code: `print("task b done, it ran after task a on the same interpreter")`,
          },
        ],
      },
      {
        id: 'multiple-timeout',
        heading: 'Short timeout, then recovery',
        note: 'Step 1 sleeps 3 seconds against a 1000 ms budget: the promise '
          + 'rejects and the late worker result is discarded by id. Step 2 '
          + 'runs on the same manager without any reset.',
        js: `// step 1: a 3 second sleep against a 1000 ms budget
try {
  await manager.executeAsync('slow.py', slowCode, undefined, 1000);
} catch (e) {
  // rejects: 'Execution timeout after 1 seconds'
}

// step 2: same manager, no reset needed: when the worker
// finally answers, the stale result is discarded by id
const result = await manager.executeAsync('after.py', healthyCode, undefined, 60000);`,
        steps: [
          {
            file: 'slow.py',
            button: 'Run with a 1000 ms timeout',
            timeoutMs: 1000,
            expectReject: true,
            code: `import time
time.sleep(3)
print("never delivered: the 1000 ms timeout fired first")`,
          },
          {
            file: 'after.py',
            button: 'Run a healthy follow-up',
            code: `print("healthy run: same worker, stale results were dropped by id")`,
          },
        ],
      },
    ],
  },

  // ------------------------------------------------------------ missive
  {
    id: 'missive',
    docAnchor: 'the-missive-channel',
    title: 'Missive: structured payloads',
    blurb: 'missive() ships a structured payload next to stdout. On the '
      + 'Pyodide backend it arrives as a JSON string: parse it once and you '
      + 'have a plain JS object.',
    flow: `python: missive({"answer": 42})
        |
        v
+------------------------------+
| worker stores the payload,   |
| serialized with json.dumps   |
+------------------------------+
        |
        | result: id, missive
        v
+------------------------------+
| page: result.missive is a    |
| JSON string on pyodide,      |
| JSON.parse gives the object  |
+------------------------------+`,
    demos: [
      {
        id: 'missive-report',
        js: `const result = await manager.executeAsync('report.py', code, undefined, 60000);

// pyodide backend: result.missive is a JSON string
console.log(typeof result.missive);   // 'string'
const data = JSON.parse(result.missive);
console.log(data.answer);             // 42`,
        steps: [
          {
            file: 'report.py',
            button: 'Run',
            showMissiveRaw: true,
            code: `import sys

missive({
    "status": "ok",
    "answer": 42,
    "python": sys.version.split()[0],
    "tags": ["structured", "json"],
})
print("missive sent alongside regular stdout")`,
          },
        ],
      },
    ],
  },

  // ----------------------------------------------------------------- fs
  {
    id: 'fs',
    docAnchor: 'filesystem-operations-fs',
    title: 'Filesystem bridge',
    blurb: 'The worker filesystem is shared between the JS api and the '
      + 'Python code. Write a file with manager.fs from the page, then open '
      + 'the very same path from Python.',
    flow: `manager.fs("writeFile", path + content)
        |
        | postMessage: fs_operation, id
        v
+------------------------------+
| worker writes to MEMFS       |
+------------------------------+
        |
        | postMessage: fs_result, id
        v
+------------------------------+
| executeAsync("read-back.py") |
| python opens the same path   |
| inside the worker filesystem |
+------------------------------+
        |
        v
stdout carries the file content`,
    demos: [
      {
        id: 'fs-roundtrip',
        fsDemo: true,
        note: 'Edit the file content below, then run: the page writes '
          + '/data/notes.txt through manager.fs and Python reads it back.',
        js: `// write from the page, into the worker filesystem
if (!(await manager.fs('exists', { path: '/data' }))) {
  await manager.fs('mkdir', { path: '/data' });
}
await manager.fs('writeFile', {
  path: '/data/notes.txt',
  content: field.value,
}, 10000);

// then read the same path from python
const result = await manager.executeAsync('read-back.py', code, undefined, 60000);`,
        steps: [
          {
            file: 'read-back.py',
            button: 'Write file and run',
            code: `with open("/data/notes.txt", encoding="utf-8") as f:
    content = f.read()

print("read from /data/notes.txt:")
print(content)
print("length:", len(content), "characters")`,
          },
        ],
      },
    ],
  },
];
