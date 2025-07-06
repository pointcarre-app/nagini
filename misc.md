


## Old useful doc

```javascript
// No global initialization - users must create their own manager instances

/**
 * Global PyodideAPI - Public interface for Python execution
 *
 * DETAILED EXPLANATION OF THE HANDLER REPLACEMENT PATTERN:
 *
 * THE PROBLEM:
 * Web workers communicate via messages, not direct function calls.
 * When we send a message to the worker, we get a response later via handleMessage().
 * But JavaScript functions expect immediate return values or Promises.
 *
 * NORMAL FLOW:
 * 1. User calls: PyodideAPI.executeFile("4_only_one_missive_per_exec.py", "print('hello')")
 * 2. Manager sends message to worker
 * 3. Worker executes Python code
 * 4. Worker sends result back
 * 5. handleMessage() receives the result
 * 6. But how do we get the result back to the original caller?
 *
 * THE SOLUTION - HANDLER REPLACEMENT:
 * We temporarily "hijack" the handleMessage function to capture the specific
 * result for the specific caller, then restore the original function.
 *
 * STEP BY STEP:
 * 1. Save the original handleMessage function: const originalHandler = ...
 * 2. Replace handleMessage with a custom function that:
 *    - Still calls the original (for normal processing)
 *    - BUT ALSO checks if this is the result we're waiting for
 *    - If yes: resolve the Promise with the result
 *    - Then restore the original handleMessage
 * 3. Send the message to the worker
 * 4. When the result comes back, our custom handler catches it
 * 5. Original handler is restored for future calls
 *
 * WHY THIS IS SAFE:
 * JavaScript is single-threaded, so only one execution can happen at a time.
 * No race conditions possible - each call completes before the next starts.
 *
 * ANALOGY:
 * Like temporarily replacing your mailbox with a special one that:
 * 1. Still puts mail in your house (original function)
 * 2. But ALSO checks for a specific letter you're expecting
 * 3. When that letter arrives, immediately gives it to you
 * 4. Then puts your normal mailbox back
 */

// PyodideAPI moved to separate file: pyodide-api.js
// Load that file to get the convenience methods
```

