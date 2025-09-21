/**
 * PyodideManagerStaticExecutor - Static utility class for Python execution logic
 *
 * This class contains the core execution logic extracted from PyodideManager
 * to improve separation of concerns and testability.
 *
 * 📋 RECENT CHANGES:
 * - Renamed from PyodideStaticExecutor to PyodideManagerStaticExecutor
 * - File renamed from pyodide-static-executor.js to pyodide-manager-static-execution.js
 * - All log messages and error messages updated to use new class name
 * - Updated as part of the comprehensive "Simple" prefix removal initiative
 *
 * 🎯 PURPOSE:
 * - Provides pure, testable static methods for Python code execution
 * - Handles both fire-and-forget and Promise-based execution patterns
 * - Manages namespace isolation and parameter validation
 * - Separates execution logic from PyodideManager lifecycle management
 *
 * ⚡ STATIC METHODS:
 * - executeFile(): Fire-and-forget execution
 * - executeAsync(): Promise-based execution with result tracking
 */

import { ValidationUtils } from '../../utils/validation.js';

export class PyodideManagerStaticExecutor {
  /**
   * Execute Python code in the worker with optional namespace isolation
   *
   * TECHNICAL DETAILS FOR PYODIDE:
   * - This method sends a message to the web worker containing the execution request
   * - The worker receives: {type: 'execute', filename, code, namespace?}
   * - Worker calls pyodide.runPython(code) or pyodide.runPython(code, namespace)
   *
   * NAMESPACE FLOW:
   * 1. JavaScript object namespace -> sent to worker via postMessage
   * 2. Worker receives it as JavaScript object
   * 3. Worker passes it directly to pyodide.runPython() as second parameter
   * 4. Pyodide converts JavaScript object to Python dict automatically
   * 5. Python code executes with that dict as its namespace
   *
   * @param {Worker} worker - Web worker instance for executing Python code
   * @param {boolean} isReady - Whether Pyodide is ready for execution
   * @param {string} filename - Name for this execution (for tracking and debugging)
   * @param {string} code - Python code to execute
   * @param {Object|undefined} [namespace] - Optional namespace object for Python execution
   * @returns {void} - No return value, sends message to worker
   * @throws {Error} If parameters are invalid or worker is not ready
   */
  static executeFile(worker, isReady, filename, code, namespace = undefined) {
    // Validate parameters using ValidationUtils
    ValidationUtils.validateWorker(worker, 'PyodideManagerStaticExecutor');
    ValidationUtils.validateBoolean(isReady, 'isReady', 'PyodideManagerStaticExecutor');
    ValidationUtils.validateExecutionParams(filename, code, namespace, 'PyodideManagerStaticExecutor');

    if (!isReady) {
      console.warn("Manager not ready, execution will be delayed until initialization completes");
      return;
    }

    // Prepare message for worker
    const message = {
      type: "execute",
      filename,
      code,
    };

    // Only include namespace in message if it's provided
    // This is crucial: we don't want to send undefined/null to the worker
    if (namespace !== undefined) {
      message.namespace = namespace;
    }

    try {
      worker.postMessage(message);
    } catch (error) {
      console.error(`Failed to dispatch execution: ${error.message}`);
    }
  }

  /**
   * Execute Python code asynchronously and return a Promise with the result
   *
   * This method provides Promise-based execution with comprehensive result tracking.
   * It implements the HANDLER REPLACEMENT PATTERN to enable Promise-based APIs
   * over web worker message passing.
   *
   * 🔧 HANDLER REPLACEMENT PATTERN IMPLEMENTATION:
   *
   * THE PROBLEM:
   * Web workers communicate via messages, not direct function calls. When we send
   * a message to the worker, we get a response later via handleMessage(). But
   * JavaScript functions expect immediate return values or Promises.
   *
   * THE SOLUTION:
   * We temporarily "hijack" the handleMessage function to capture the specific
   * result for the specific caller, then restore the original function.
   *
   * STEP-BY-STEP PROCESS:
   * 1. Save the original handleMessage function
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
   * @param {Worker} worker - Web worker instance for executing Python code
   * @param {boolean} isReady - Whether Pyodide is ready for execution
   * @param {Array<ExecutionResult>} executionHistory - Array to store execution results
   * @param {function(Function): void} setHandleMessage - Function to set the message handler
   * @param {function(): Function} getHandleMessage - Function to get the current message handler
   * @param {string} filename - Name for this execution (for tracking and debugging)
   * @param {string} code - Python code to execute
   * @param {Object|undefined} [namespace] - Optional namespace object for Python execution
   * @returns {Promise<ExecutionResult>} Promise that resolves with execution result
   * @throws {Error} If manager is not ready or execution times out
   */
  static async executeAsync(
    worker,
    isReady,
    executionHistory,
    setHandleMessage,
    getHandleMessage,
    filename,
    code,
    namespace = undefined
  ) {
    // Comprehensive parameter validation
    ValidationUtils.validateWorker(worker, 'PyodideManagerStaticExecutor');
    ValidationUtils.validateBoolean(isReady, 'isReady', 'PyodideManagerStaticExecutor');
    ValidationUtils.validateArray(executionHistory, 'executionHistory', 'PyodideManagerStaticExecutor');
    ValidationUtils.validateFunction(setHandleMessage, 'setHandleMessage', 'PyodideManagerStaticExecutor');
    ValidationUtils.validateFunction(getHandleMessage, 'getHandleMessage', 'PyodideManagerStaticExecutor');
    ValidationUtils.validateExecutionParams(filename, code, namespace, 'PyodideManagerStaticExecutor');

    if (!isReady) {
      throw new Error(
        "⚡ [PyodideManagerStaticExecutor] Manager not ready yet. Wait for initialization to complete."
      );
    }

    return new Promise((resolve, reject) => {
      // Add timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        try {
          setHandleMessage(originalHandler);
        } catch (error) {
          console.warn("Failed to restore handler on timeout:", error.message);
        }
        reject(
          new Error("⚡ [PyodideManagerStaticExecutor] Execution timeout after 30 seconds")
        );
      }, 30000);

      // Save original handler and replace with interceptor
      const originalHandler = getHandleMessage();

      if (!originalHandler) {
        clearTimeout(timeoutId);
        reject(new Error("⚡ [PyodideManagerStaticExecutor] No message handler available"));
        return;
      }

      setHandleMessage(function(data) {
          try {
              // Call original handler for normal processing
              originalHandler.call(this, data);
              
              // Check if this is the result we're waiting for
              if (data.type === "result") {
                  clearTimeout(timeoutId);
                  setHandleMessage(originalHandler); // Restore original handler
                  
                  const result = executionHistory[executionHistory.length - 1];
                  // Always resolve with the result, even if it contains Python errors
                  // This allows the caller to access stderr for full traceback information
                  resolve(result);
              } else if (data.type === "error") {
                  clearTimeout(timeoutId);
                  setHandleMessage(originalHandler);
                  reject(
                    new Error(
                      `⚡ [PyodideManagerStaticExecutor] Execution error: ${data.message || data.error || 'Unknown error'}`
                    )
                  );
              }
          } catch (error) {
              clearTimeout(timeoutId);
              setHandleMessage(originalHandler);
              reject(new Error(`⚡ [PyodideManagerStaticExecutor] Handler error: ${error.message}`));
          }
      });

      // Send execution message to worker
      try {
        PyodideManagerStaticExecutor.executeFile(worker, isReady, filename, code, namespace);
      } catch (error) {
        clearTimeout(timeoutId);
        setHandleMessage(originalHandler);
        reject(new Error(`⚡ [PyodideManagerStaticExecutor] Failed to send execution message: ${error.message}`));
      }
    });
  }
}

/**
 * @typedef {Object} ExecutionResult
 * @property {string} filename - Name of the executed file
 * @property {number} time - Execution time in milliseconds
 * @property {string} stdout - Standard output from Python execution
 * @property {string} stderr - Standard error from Python execution
 * @property {Object|null} missive - Structured JSON data from Python
 * @property {string[]} figures - Base64 encoded matplotlib figures
 * @property {string[]} bokeh_figures - JSON strings of Bokeh figures
 * @property {Object|null} error - JavaScript execution error object
 * @property {string} timestamp - ISO timestamp of execution
 * @property {boolean} [executedWithNamespace] - Whether execution used namespace
 */
