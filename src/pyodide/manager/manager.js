/**
 * PyodideManager - Main thread interface for Pyodide execution
 *
 * Manages a web worker running Pyodide Python interpreter with clean communication
 * via the "missive" system for structured data exchange.
 *
 * DOM Dependencies: None
 *
 * 💜 ALL VALIDATIONS SHOULD BE DONE IN THE MANAGER - PREFERABLY IN THE CONSTRUCTOR 💜
 *
 * STRICT CONSTRUCTOR - NO DEFAULTS, EXPLICIT TYPES REQUIRED:
 *
 * @param {string[]} packages - MUST be array of Python package names
 * @param {Array<FileToLoad>} filesToLoad - MUST be array of file objects
 * @param {string} workerPath - MUST be string path to worker file
 *
 * USAGE EXAMPLE:
 * const manager = new PyodideManager(
 *   ['numpy', 'pandas'],           // Array of packages
 *   ['antlr4-python3-runtime'],   // Array of micropip packages
 *   [],                           // Array filesToLoad
 *   './pyodide-worker.js' // String worker path
 * );
 *
 * NAMESPACE BEHAVIOR:
 * - No namespace: Variables persist between executions (global scope)
 * - With namespace: Variables isolated to that namespace object
 */

import { PyodideManagerStaticExecutor } from './manager-static-execution.js';
import { PyodideManagerInput } from './manager-input.js';
import { PyodideManagerFS } from './manager-fs.js';
import { ValidationUtils } from '../../utils/validation.js';
import { createBlobWorkerUrl } from '../../utils/createBlobWorker.js';

/** Cap on executionHistory entries (ring buffer behaviour) */
const MAX_EXECUTION_HISTORY = 50;

class PyodideManager {
  /**
   * Create a new PyodideManager instance
   *
   * @param {string[]} packages - Array of Python package names to install
   * @param {string[]} micropipPackages - Array of Python package names to install with micropip
   * @param {Array<FileToLoad>} filesToLoad - Array of file objects to load into filesystem
   * @param {string} workerPath - Path to the bundled web worker file (must be worker-dist.js)
   * @param {Object} [config={}] - Optional configuration object
   * @param {string} [config.pyodideCdnUrl] - Custom Pyodide CDN URL (for local/offline use, e.g., Capacitor apps)
   * @param {boolean} [config.snapshotCache] - Cache the bare interpreter as a memory snapshot in IndexedDB for near-instant later boots
   * @throws {Error} If any parameter has incorrect type or worker is not bundled
   */
  constructor(packages, micropipPackages, filesToLoad, workerPath, config = {}) {
    // Minimal logging - constructor called

    // Strict type validation using ValidationUtils
    ValidationUtils.validatePackages(packages, 'PyodideManager');
    ValidationUtils.validatePackages(micropipPackages, 'PyodideManager');
    ValidationUtils.validateFilesToLoad(filesToLoad, 'PyodideManager');
    ValidationUtils.validateString(workerPath, 'workerPath', 'PyodideManager');

    // Enforce bundled worker requirement
    if (!workerPath.includes('worker-dist.js')) {
      throw new Error(`🚨 [PyodideManager] Only bundled workers are supported. Expected 'worker-dist.js', got: ${workerPath}`);
    }

    /** @type {Worker|null} Web worker instance */
    this.worker = null;

    /** @type {Array<ExecutionResult>} Execution history with results and metadata */
    this.executionHistory = [];

    /** @type {boolean} Whether Pyodide is ready for execution */
    this.isReady = false;

    /** @type {string[]} Python packages to install during initialization - filtered and validated */
    this.packages = this.validateAndFilterPackages(packages);

    /** @type {string[]} Python packages to install with micropip - filtered and validated */
    this.micropipPackages = this.validateAndFilterPackages(micropipPackages);

    /** @type {Array<FileToLoad>} Files to load into Pyodide filesystem */
    this.filesToLoad = filesToLoad;

    /** @type {string} Path to the bundled web worker file */
    this.workerPath = workerPath;

    /** @type {string|undefined} Custom Pyodide CDN URL (for local/offline use) */
    this.pyodideCdnUrl = config.pyodideCdnUrl;

    /** @type {boolean} Cache the bare interpreter as a memory snapshot in
     *  IndexedDB: later boots restore it in ~100 ms instead of a full
     *  interpreter boot. Packages and files still load after the restore */
    this.snapshotCache = !!config.snapshotCache;

    /** @type {boolean} Whether this worker booted from a cached snapshot
     *  (set on the ready message) */
    this.snapshotRestored = false;

    /** @type {string|null} Blob URL for cleanup */
    this.blobUrl = null;

    // Initialize input state using the input module
    PyodideManagerInput.initializeInputState(this);

    /** @type {Promise<any>} Serialization chain for executeAsync calls */
    this.executionChain = Promise.resolve();

    /** @type {Map<number, {resolve: Function, reject: Function, timeoutId: number}>}
     *  Pending id-correlated requests (execute, fs) awaiting a worker response */
    this._pendingRequests = new Map();

    /** @type {number} Monotonic id for request correlation */
    this._nextRequestId = 1;

    /** @type {Promise<void>} Resolves on the worker "ready" message, rejects
     *  with the original cause if initialization fails */
    this.readyPromise = new Promise((resolve, reject) => {
      this._readySettled = false;
      this._readyResolve = () => { this._readySettled = true; resolve(); };
      this._readyReject = (error) => {
        if (!this._readySettled) { this._readySettled = true; reject(error); }
      };
    });
    // Guard: an init failure must not surface as an unhandled rejection when
    // the consumer only polls isReady
    this.readyPromise.catch(() => {});

    // Initialize worker asynchronously
    this.initWorker().catch((error) => {
      console.error("🚨 [PyodideManager] Worker initialization failed:", error);
      this._readyReject(error);
    });
  }

  /**
   * Validate and filter Python packages
   *
   * @param {string[]} packages - Array of package names to validate
   * @returns {string[]} Validated and filtered package names
   */
  validateAndFilterPackages(packages) {
    const validPackages = packages.filter(pkg => {
      if (typeof pkg !== "string" || pkg.trim().length === 0) {
        return false;
      }
      return true;
    });

    return validPackages;
  }

  /**
   * Initialize the web worker using blob URL pattern and set up message handling
   *
   * @private
   * @returns {Promise<void>}
   * @throws {Error} If blob worker creation fails
   */
  async initWorker() {
    try {
      // Create blob URL first for cleanup tracking
      this.blobUrl = await createBlobWorkerUrl(this.workerPath);
      
      // Create worker from blob URL, as a module worker: the bundled worker
      // loads Pyodide with a dynamic import (pyodide.mjs, ESM-only in
      // Pyodide 314+), which importScripts-based classic workers cannot do
      this.worker = new Worker(this.blobUrl, { type: "module" });

      // Set up message handling: dispatch routes id-correlated responses to
      // their pending promise, then hands the message to handleMessage
      this.worker.onmessage = (e) => this._dispatchMessage(e.data);

      // Surface worker crashes (wasm trap, failed import, ...) as error
      // messages so pending executions reject instead of hanging forever
      this.worker.onerror = (e) => {
        this._dispatchMessage({
          type: "error",
          message: `Worker crashed: ${e.message || "unknown error"}`,
        });
      };
      this.worker.onmessageerror = () => {
        this._dispatchMessage({
          type: "error",
          message: "Worker message could not be deserialized",
        });
      };

      // Start initialization
      this.worker.postMessage({
        type: "init",
        packages: this.packages,
        micropipPackages: this.micropipPackages,
        filesToLoad: this.filesToLoad,
        pyodideCdnUrl: this.pyodideCdnUrl,
        snapshotCache: this.snapshotCache,
      });
      
    } catch (error) {
      console.error("🚨 [PyodideManager] Failed to initialize blob worker:", error);
      throw new Error(`Failed to initialize blob worker: ${error.message}`);
    }
  }

  /**
   * Route a worker message: settle the matching pending request (by id) if
   * any, then hand the message to handleMessage for normal processing
   * (execution history, input state, logging)
   *
   * @private
   * @param {WorkerMessage} data - Message from worker
   * @returns {void}
   */
  _dispatchMessage(data) {
    const pending = data && data.id !== undefined
      ? this._pendingRequests.get(data.id)
      : undefined;
    if (pending) {
      this._pendingRequests.delete(data.id);
      clearTimeout(pending.timeoutId);
    }

    // Normal processing first: history push, input state reset, logs. A
    // throwing handler must not leave the pending request unsettled
    try {
      this.handleMessage(data);
    } catch (error) {
      console.error("🚨 [PyodideManager] handleMessage failed:", error);
    }

    if (data && data.type === "ready") {
      this._readyResolve();
    }

    if (data && data.type === "error" && data.id === undefined) {
      // Id-less error: init failure or worker crash. Fail readiness (during
      // init) and every in-flight request, none of them can complete
      const error = new Error(data.message || data.error || "Worker error");
      this._readyReject(error);
      this._failAllPending(error);
    }

    if (!pending) return;

    if (data.type === "result") {
      // Resolve with a result built from the worker payload, even when it
      // contains a Python error: callers read stderr for the full traceback
      pending.resolve({
        filename: data.filename,
        time: data.time,
        stdout: data.stdout,
        stderr: data.stderr,
        missive: data.missive,
        figures: data.figures,
        error: data.error,
        timestamp: new Date().toISOString(),
      });
    } else if (data.type === "fs_result") {
      pending.resolve(data.result);
    } else if (data.type === "fs_error") {
      pending.reject(new Error(`🎛️ [PyodideManagerFS] Filesystem error: ${data.error}`));
    } else if (data.type === "error") {
      pending.reject(new Error(`⚡ [PyodideManager] Execution error: ${data.message || data.error || "Unknown error"}`));
    } else {
      pending.reject(new Error(`🚨 [PyodideManager] Unexpected response type for request: ${data.type}`));
    }
  }

  /**
   * Send an id-correlated request to the worker and return a promise settled
   * by the matching response (see _dispatchMessage)
   *
   * @private
   * @param {Object} message - Message to post (id is added here)
   * @param {number} timeoutMs - Timeout in milliseconds
   * @param {string} timeoutLabel - Error message on timeout
   * @returns {Promise<any>}
   */
  _postRequest(message, timeoutMs, timeoutLabel) {
    return new Promise((resolve, reject) => {
      const id = this._nextRequestId++;
      const timeoutId = setTimeout(() => {
        // A response arriving later is simply discarded by _dispatchMessage
        this._pendingRequests.delete(id);
        reject(new Error(timeoutLabel));
      }, timeoutMs);

      this._pendingRequests.set(id, { resolve, reject, timeoutId });

      try {
        this.worker.postMessage({ ...message, id });
      } catch (error) {
        clearTimeout(timeoutId);
        this._pendingRequests.delete(id);
        reject(new Error(`🚨 [PyodideManager] Failed to send message to worker: ${error.message}`));
      }
    });
  }

  /**
   * Reject every pending request (worker crash, destroy)
   *
   * @private
   * @param {Error} error - Rejection cause
   * @returns {void}
   */
  _failAllPending(error) {
    for (const pending of this._pendingRequests.values()) {
      clearTimeout(pending.timeoutId);
      pending.reject(error);
    }
    this._pendingRequests.clear();
  }

  /**
   * Handle messages from the Pyodide worker
   * Updates UI status and manages execution context
   *
   * @param {WorkerMessage} data - Message from worker
   * @returns {void}
   */
  handleMessage(data) {
    // Pyodide initialization complete
    if (data.type === "ready") {
      this.isReady = true;
      this.snapshotRestored = !!data.snapshotRestored;
    }

    // Pyodide initialization or execution error
    if (data.type === "error") {
      console.error("🐍 [PyodideManager] Error:", data.message || data.error || data);
    }

    // Package installation warning (non-fatal)
    if (data.type === "warning") {
      console.warn("🐍 [PyodideManager] Warning:", data.message || "Unknown warning");
    }

    // Package installation info (optimization messages) - minimized
    // if (data.type === "info") { /* minimized */ }

    // Handle input-related messages using input module
    PyodideManagerInput.handleInputMessage(this, data);

    // Python code execution completed
    if (data.type === "result") {
      PyodideManagerInput.resetInputState(this);

      // 🐍 EXECUTION RESULTS (always logged with snake emoji)
      console.log("🐍 Execution completed:", {
        stdout: data.stdout ? data.stdout.length + " chars" : "empty",
        stderr: data.stderr ? data.stderr.length + " chars" : "empty",
        missive: data.missive,
        figures: data.figures ? data.figures.length + " figures" : "none",
        error: data.error
      });

      // Create execution entry: figures are kept out of the history (base64
      // payloads accumulate into an effective memory leak in long sessions);
      // they remain available on the result resolved by executeAsync
      const entry = {
        filename: data.filename,
        time: data.time,
        stdout: data.stdout,
        stderr: data.stderr,
        missive: data.missive,
        error: data.error,
        timestamp: new Date().toISOString(),
      };

      this.executionHistory.push(entry);
      if (this.executionHistory.length > MAX_EXECUTION_HISTORY) {
        this.executionHistory.shift();
      }
    }
  }

  // Input handling methods - delegate to input module
  provideInput(input) { return PyodideManagerInput.provideInput(this, input); }
  queueInput(input) { return PyodideManagerInput.queueInput(this, input); }
  setInputCallback(callback) { return PyodideManagerInput.setInputCallback(this, callback); }
  isWaitingForInput() { return PyodideManagerInput.isWaitingForInput(this); }
  getCurrentPrompt() { return PyodideManagerInput.getCurrentPrompt(this); }

  // Filesystem operations - delegate to filesystem module
  async fs(operation, params, timeoutMs = 10000) { return PyodideManagerFS.fs(this, operation, params, timeoutMs); }

  /**
   * Execute Python code in the worker with optional namespace isolation
   *
   * @param {string} filename - Name for this execution (for tracking and debugging)
   * @param {string} code - Python code to execute
   * @param {Object|undefined} [namespace] - Optional namespace object for Python execution
   * @returns {void} - No return value, sends message to worker
   */
  executeFile(filename, code, namespace = undefined) {
    return PyodideManagerStaticExecutor.executeFile(this.worker, this.isReady, filename, code, namespace);
  }

  /**
   * Execute Python code asynchronously and return a Promise with the result
   *
   * @param {string} filename - Name for this execution (for tracking and debugging)
   * @param {string} code - Python code to execute
   * @param {Object|undefined} [namespace] - Optional namespace object for Python execution
   * @param {number} [timeoutMs=30000] - Execution timeout in milliseconds (raise it for interactive input() code)
   * @returns {Promise<ExecutionResult>} Promise that resolves with execution result
   * @throws {Error} If manager is not ready or execution times out
   */
  async executeAsync(filename, code, namespace = undefined, timeoutMs = 30000) {
    // Executions are serialized: one Python interpreter lives in the worker,
    // so concurrent calls are queued rather than interleaved. Responses are
    // correlated by request id, so a late result from a timed-out run can
    // never be attributed to the next execution
    const run = async () => {
      ValidationUtils.validateExecutionParams(filename, code, namespace, 'PyodideManager');
      if (!this.isReady) {
        throw new Error("⚡ [PyodideManager] Manager not ready yet. Wait for initialization to complete.");
      }
      const message = { type: "execute", filename, code };
      if (namespace !== undefined) {
        message.namespace = namespace;
      }
      return this._postRequest(
        message,
        timeoutMs,
        `⚡ [PyodideManager] Execution timeout after ${timeoutMs / 1000} seconds`
      );
    };
    const result = this.executionChain.then(run, run);
    this.executionChain = result.catch(() => {});
    return result;
  }

  /**
   * Clear execution history context
   *
   * @returns {void}
   */
  clearExecutionHistory() {
    this.executionHistory = [];
  }

  /**
   * Cleanup resources and terminate worker
   * Call this when the manager is no longer needed to prevent memory leaks
   *
   * @returns {void}
   */
  destroy() {
    // Terminate worker
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }

    // Revoke blob URL to prevent memory leaks
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = null;
    }

    // Settle everything still waiting on this manager
    const error = new Error("🚨 [PyodideManager] Manager destroyed");
    this._failAllPending(error);
    this._readyReject(error);

    // Reset state
    this.isReady = false;
    this.executionHistory = [];
  }
}

// Add export at the end of the file
export { PyodideManager };

/**
 * @typedef {Object} FileToLoad
 * @property {string} path - Path where file should be saved in filesystem
 * @property {string} content - File content to write
 * @property {string} [encoding] - File encoding (default: 'utf8')
 */

/**
 * @typedef {Object} WorkerMessage
 * @property {'ready'|'error'|'warning'|'info'|'result'|'fs_result'|'fs_error'} type - Message type
 * @property {string} [message] - Message content
 * @property {string} [error] - Error message
 * @property {string} [filename] - Filename for execution results
 * @property {number} [time] - Execution time in milliseconds
 * @property {string} [stdout] - Standard output
 * @property {string} [stderr] - Standard error
 * @property {string|null} [missive] - Missive as a JSON string from Python
 * @property {Object|null} [error] - Execution error object
 * @property {any} [result] - Filesystem operation result
 */

/**
 * @typedef {Object} ExecutionResult
 * @property {string} filename - Name of the executed file
 * @property {number} time - Execution time in milliseconds
 * @property {string} stdout - Standard output from Python execution
 * @property {string} stderr - Standard error from Python execution
 * @property {string|null} missive - Missive as a JSON string (parse on the consumer side)
 * @property {string[]} [figures] - Base64 encoded matplotlib figures (executeAsync result only, not stored in history)
 * @property {Object|null} error - JavaScript execution error object
 * @property {string} timestamp - ISO timestamp of execution
 * @property {boolean} [executedWithNamespace] - Whether execution used namespace
 */
