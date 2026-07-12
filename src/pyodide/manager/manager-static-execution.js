/**
 * PyodideManagerStaticExecutor - Static utility class for Python execution logic
 *
 * 🎯 PURPOSE:
 * - Provides a pure, testable static method for fire-and-forget execution
 * - Manages namespace forwarding and parameter validation
 *
 * Promise-based execution lives in PyodideManager.executeAsync, built on
 * id-correlated worker messages (see PyodideManager._postRequest): every
 * request carries an id, the worker echoes it back, and a single permanent
 * onmessage handler settles the matching promise. No handler replacement.
 */

import { ValidationUtils } from '../../utils/validation.js';

export class PyodideManagerStaticExecutor {
  /**
   * Execute Python code in the worker with optional namespace isolation
   *
   * TECHNICAL DETAILS FOR PYODIDE:
   * - This method sends a message to the web worker containing the execution request
   * - The worker receives: {type: 'execute', filename, code, namespace?}
   * - Worker calls pyodide.runPythonAsync(code) or pyodide.runPythonAsync(code, {globals})
   *
   * NAMESPACE FLOW:
   * 1. JavaScript object namespace -> sent to worker via postMessage
   * 2. Worker receives it as JavaScript object
   * 3. Worker passes it to pyodide.runPythonAsync() as execution globals
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
}

/**
 * @typedef {Object} ExecutionResult
 * @property {string} filename - Name of the executed file
 * @property {number} time - Execution time in milliseconds
 * @property {string} stdout - Standard output from Python execution
 * @property {string} stderr - Standard error from Python execution
 * @property {string|null} missive - Missive as a JSON string (parse on the consumer side)
 * @property {string[]} figures - Base64 encoded matplotlib figures
 * @property {Object|null} error - JavaScript execution error object
 * @property {string} timestamp - ISO timestamp of execution
 * @property {boolean} [executedWithNamespace] - Whether execution used namespace
 */
