# Interactive input

Python's `input()` pauses the run and asks the host page for a value. Pyodide backend only.

## Use

```javascript
manager.queueInput('Ada');                    // consumed by the first input()
manager.setInputCallback((prompt) => {        // used when the queue is empty
  const value = window.prompt(prompt);
  manager.provideInput(value ?? '');
});

const result = await manager.executeAsync('ask.py', `
name = input("Your name? ")
print(f"Hello {name}")
`, undefined, 120000);                        // give humans time
```

`isWaitingForInput()` and `getCurrentPrompt()` let a custom UI show the prompt and a field. The empty string is a valid answer: a bare Enter makes `input()` return `""`.

## Details

Two bridges exist, picked once at boot and exposed as `manager.inputMode`.

| Mode | When | How |
| --- | --- | --- |
| `jspi` | The browser supports WebAssembly stack switching (`WebAssembly.Suspending`, Chrome 137 and later). | `builtins.input` is a plain synchronous function that blocks through `pyodide.ffi.run_sync`. User code runs unmodified. `input()` works anywhere, including inside sync functions, lambdas and class bodies. |
| `async` | No JSPI. | `builtins.input` is a coroutine and genuine `input()` calls are rewritten to `await input()` on the AST before running. Names like `my_input()` or `obj.input()` are untouched. |

The message round trip is identical in both modes: the worker posts `input_required` with the prompt, the manager takes the next queued value or calls the callback, `provideInput` sends the answer back and Python resumes. The prompt itself is printed to stdout, as in a terminal.

## Limits

In `async` mode, `input()` inside a sync `def`, a lambda or a class body is not rewritten, because `await` is a syntax error there. The call then fails at runtime. This is exactly what `jspi` mode removes.

The execution timeout keeps ticking while Python waits for a human. If it fires, the promise rejects, but the paused run keeps waiting inside the worker and finishes only when a `provideInput` arrives later.

## See also

[input(): pausing Python for the host](../execution-flows.md#input-pausing-python-for-the-host) traces both modes. Live: [interactive input](https://pointcarre-app.github.io/nagini/scenery/executions/#input).
