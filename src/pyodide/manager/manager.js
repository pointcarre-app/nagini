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

class PyodideManager {
  /**
   * Create a new PyodideManager instance
   *
   * @param {string[]} packages - Array of Python package names to install
   * @param {string[]} micropipPackages - Array of Python package names to install with micropip
   * @param {Array<FileToLoad>} filesToLoad - Array of file objects to load into filesystem
   * @param {string} workerPath - Path to the bundled web worker file (must be worker-dist.js)
   * @throws {Error} If any parameter has incorrect type or worker is not bundled
   */
  constructor(packages, micropipPackages, filesToLoad, workerPath) {
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

    /** @type {string|null} Blob URL for cleanup */
    this.blobUrl = null;

    // Initialize input state using the input module
    PyodideManagerInput.initializeInputState(this);

    // Initialize worker asynchronously
    this.initWorker().catch((error) => {
      console.error("🚨 [PyodideManager] Worker initialization failed:", error);
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
      
      // Create worker from blob URL
      this.worker = new Worker(this.blobUrl);
      
      // Set up message handling
      this.worker.onmessage = (e) => this.handleMessage(e.data);
      
      // Start initialization
      this.worker.postMessage({
        type: "init",
        packages: this.packages,
        micropipPackages: this.micropipPackages,
        filesToLoad: this.filesToLoad,
      });
      
    } catch (error) {
      console.error("🚨 [PyodideManager] Failed to initialize blob worker:", error);
      throw new Error(`Failed to initialize blob worker: ${error.message}`);
    }
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
        bokeh_figures: data.bokeh_figures ? data.bokeh_figures.length + " bokeh figures" : "none",
        error: data.error
      });

      // Create execution entry with all result data
      const entry = {
        filename: data.filename,
        time: data.time,
        stdout: data.stdout,
        stderr: data.stderr,
        missive: data.missive,
        figures: data.figures,
        bokeh_figures: data.bokeh_figures,
        error: data.error,
        timestamp: new Date().toISOString(),
      };

      this.executionHistory.push(entry);
    }
  }

  // Input handling methods - delegate to input module
  provideInput(input) { return PyodideManagerInput.provideInput(this, input); }
  queueInput(input) { return PyodideManagerInput.queueInput(this, input); }
  setInputCallback(callback) { return PyodideManagerInput.setInputCallback(this, callback); }
  isWaitingForInput() { return PyodideManagerInput.isWaitingForInput(this); }
  getCurrentPrompt() { return PyodideManagerInput.getCurrentPrompt(this); }

  // Filesystem operations - delegate to filesystem module
  async fs(operation, params) { return PyodideManagerFS.fs(this, operation, params); }

  /**
   * Get or set the current message handler
   *
   * @param {Function} [newHandler] - New message handler to set
   * @returns {Function} Current message handler
   */
  setHandleMessage(newHandler) {
    if (newHandler) {
      this.handleMessage = newHandler;
    }
  }

  /**
   * Get the current message handler
   *
   * @returns {Function} Current message handler
   */
  getHandleMessage() {
    return this.handleMessage;
  }

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
   * @returns {Promise<ExecutionResult>} Promise that resolves with execution result
   * @throws {Error} If manager is not ready or execution times out
   */
  async executeAsync(filename, code, namespace = undefined) {
    return PyodideManagerStaticExecutor.executeAsync(
      this.worker,
      this.isReady,
      this.executionHistory,
      (handler) => this.setHandleMessage(handler),
      () => this.getHandleMessage(),
      filename,
      code,
      namespace
    );
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
 * @property {Object|null} [missive] - Structured data from Python
 * @property {Object|null} [error] - Execution error object
 * @property {any} [result] - Filesystem operation result
 */

/**
 * @typedef {Object} ExecutionResult
 * @property {string} filename - Name of the executed file
 * @property {number} time - Execution time in milliseconds
 * @property {string} stdout - Standard output from Python execution
 * @property {string} stderr - Standard error from Python execution
 * @property {Object|null} missive - Structured JSON data from Python
 * @property {Object|null} error - JavaScript execution error object
 * @property {string} timestamp - ISO timestamp of execution
 * @property {boolean} [executedWithNamespace] - Whether execution used namespace
 */
