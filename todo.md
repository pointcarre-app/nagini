
# Critical

- input() to aggressively replaced : 




```
fs.js:353 [FS] Python stderr: Traceback (most recent call last):
  File "/lib/python313.zip/_pyodide/_base.py", line 597, in eval_code_async
    await CodeRunner(
          ~~~~~~~~~~^
        source,
        ^^^^^^^
    ...<5 lines>...
        optimize=optimize,
        ^^^^^^^^^^^^^^^^^^
    )
    ^
  File "/lib/python313.zip/_pyodide/_base.py", line 285, in __init__
    self.ast = next(self._gen)
               ~~~~^^^^^^^^^^^
  File "/lib/python313.zip/_pyodide/_base.py", line 149, in _parse_and_compile_gen
    mod = compile(source, filename, mode, flags | ast.PyCF_ONLY_AST)
  File "<exec>", line 40
    def clean_await input(latex: str) -> str:
                    ^^^^^
SyntaxError: expected '('

executeValidation @ fs.js:353
await in executeValidation
(anonymous) @ fs.js:499Understand this error
fs.js:357 [FS] Execution error: {name: 'PythonError', message: 'Unknown execution error'}
```

```txt
Perfect! Now we can see the actual error! 🎯
The Problem
File "<exec>", line 40    def clean_await input(latex: str) -> str:                    ^^^^^SyntaxError: expected '('
There's a syntax error in smart_validator.py at line 40. It looks like there's an extra word await in the function definition:
def clean_await input(latex: str) -> str:  # ❌ WRONG
Should be:
def clean_input(latex: str) -> str:  # ✅ CORRECT
Let me check the file to confirm:
Wait, the file looks correct! Line 33 is def clean_input(latex: str) -> str: which is fine. But the error says line 40 has def clean_await input(latex: str) -> str:.
Ah! The issue is with the CACHE!
The cached script has the old buggy version. When we prefetch scripts during init, we cache them. But if the script file was updated on the server, the cache still has the old broken version.
The cache needs to be invalidated! Let me check - when the page reloads, does the cache clear? Looking at the code, teachersScriptCache is in the singleton instance which persists across SPA navigations...
The fix: We need to either:
Clear the cache on page reload
Add cache busting (version parameter in URL)
Or just do a hard refresh to clear the singleton
For now, the quickest solution is to hard refresh the browser (Cmd+Shift+R or Ctrl+Shift+R) to clear the singleton instance and reload the corrected script.
```



# High
vestigation of the Nagini codebase, here's how you can get precise Python error messages when running code through Nagini:

- [x] How Nagini Handles Python Errors

1. **Error Capture Mechanism**

When Python code execution fails in Nagini, errors are captured at multiple levels:

- **Worker Level** (Pyodide): In `src/pyodide/worker/worker-execution.js`, when a Python exception occurs:
  - The error is caught in a try-catch block
  - An error object is created with `name` and `message` properties
  - Python's stderr output (including tracebacks) is still captured via `get_stderr()`

- **Brython**: Errors are handled differently since it transpiles to JavaScript, but still captures stderr

2. **Getting the Full Error Information**

When you execute Python code using Nagini, the result object contains multiple error-related fields:

```javascript
const result = await manager.executeAsync("script.py", pythonCode);

// Check for errors in multiple places:
if (result.error) {
    // 1. Error object with basic info
    console.error("Error name:", result.error.name);
    console.error("Error message:", result.error.message);
}

// 2. STDERR contains the full Python traceback
if (result.stderr) {
    console.error("Python stderr (with traceback):", result.stderr);
}

// 3. STDOUT might contain error output if printed
if (result.stdout) {
    console.log("Python stdout:", result.stdout);
}
```

3. **Key Points for Error Handling**

1. **`result.error`**: Contains a JavaScript-friendly error object with:
   - `name`: The error type (e.g., "PythonError")
   - `message`: Basic error message

2. **`result.stderr`**: **This is where you get the precise Python error message!**
   - Contains the full Python traceback
   - Shows the exact line numbers
   - Includes the complete error context
   - This is captured even when an exception occurs

3. **Code Transformation**: If your code uses `input()`, Nagini wraps it in a try-catch that also prints tracebacks to stderr:
   ```python
   try:
       # your code
   except Exception as e:
       import traceback
       error_type = type(e).__name__
       error_msg = str(e)
       print(f"Error occurred: " + error_type + ": " + error_msg)
       traceback.print_exc()  # This goes to stderr
   ```

4. **Best Practice for Error Handling**

```javascript
try {
    const result = await manager.executeAsync("script.py", pythonCode);
    
    // Always check both error and stderr
    if (result.error || result.stderr) {
        console.error("Python execution failed!");
        
        if (result.error) {
            console.error("Error:", result.error.message);
        }
        
        if (result.stderr) {
            // This gives you the full Python traceback
            console.error("Full Python Error Output:\n", result.stderr);
        }
    }
    
    // Process successful results
    if (result.stdout) {
        console.log("Output:", result.stdout);
    }
    
} catch (jsError) {
    // This catches JavaScript-level errors (worker issues, timeouts, etc.)
    console.error("JavaScript error:", jsError.message);
}
```

**Example Error Output**

If you run code with an error like:
```python
x = 1 / 0
```

You'll get:
- `result.error.message`: "division by zero"
- `result.stderr`: Full traceback showing:
  ```
  Traceback (most recent call last):
    File "<exec>", line 1, in <module>
  ZeroDivisionError: division by zero
  ```


**To get the precise Python error message from Nagini, always check `result.stderr`** - it contains the complete Python traceback with line numbers, error types, and full context. The `result.error` object provides a simplified version for JavaScript consumption, but `stderr` is where the detailed Python error information lives.

```bash
. Example Error Output
If you run code with an error like:
You'll get:
result.error.message: "division by zero"
result.stderr: Full traceback showing:
Summary
To get the precise Python error message from Nagini, always check result.stderr - it contains the complete Python traceback with line numbers, error types, and full context. The result.error object provides a simplified version for JavaScript consumption, but stderr is where the detailed Python error information lives.
```


- Deal with the error formatting 

- [x] Better changelog

- [x] Clean docs and remove old files from old tentatives (like bundling with python)

- [ ] Clean the `/tests`  (templates / views)
    - [x] Find a way to do a two bird with one stone with `/scenery` (but careful, it requires a server for Flask)
    - [ ] do it the other way around; scenery has its own python environment and therefore can be safely eecetued after isntall any where (and it's not a dependency of nagini)

- [x] CDN Import Solutions
    - [x] Created UMD bundle (`nagini.umd.js`) for universal compatibility
    - [x] Documented esm.sh CDN solution for automatic ES6 import resolution
    - [x] Added import maps solution for modern browsers
    - [ ] Add UMD test to scenery test suite 

    - [ ] git tag hook to ensure all tests in scenery made it

- [x] Implement brython in `src/brython/`
    - [x] Ensure Turtle is working
    - [x] write a test and maybe keep the draft statically in an /experiments folder ? 



- [ ] do hooks  better 
    - [] one for tag: selenium/scenery based (is prepush ? or maybe on main and authorize tags only from main ?)
    - [] one for commits (size of files mostly + static js typing in a python doctest like would be the dream)
    - [ ] critics json to wrapp in git tagging process + visible from scenery/index.html 


- [] Add Licence buy button

- [] Update hooks for ensuring checking of ALL files at every commit

- [] decide about how to use scenery (externally - no install here) 
    - [] check the outputs in the table in `/scenery/index.html`


- [ ] Put `/tests` with flask app in `/scenery`


- [ ] Make this amount of logging optional / define levels (but keep it - it so useful)

# Low

- [ ] Analyse very precisely by generated the meta code from `/pyodide/py` to understand what's loaded / what wrappers are used etc.... 
    - [ ] Make some stuff optional to try to build the lightest fastest 
    - [ ] See if you can have one or two with dedicated set of option (full / nothing except missive ? maybe)





- [] Consider adding support for `input()` with Brython Manager
