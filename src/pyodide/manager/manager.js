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
 * @param {string} pyodideInitPath - MUST be string path to pyodide_init.py
 * @param {string} workerPath - MUST be string path to worker file
 *
 * USAGE EXAMPLE:
 * const manager = new PyodideManager(
 *   ['numpy', 'pandas'],           // Array of packages
 *   [],                           // Array filesToLoad
 *   '../pyodide_init.py',      // String init path
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

class PyodideManager {
  /**
   * Create a new PyodideManager instance
   *
   * @param {string[]} packages - Array of Python package names to install
   * @param {Array<FileToLoad>} filesToLoad - Array of file objects to load into filesystem
   * @param {string} pyodideInitPath - Path to the pyodide_init.py file
   * @param {string} workerPath - Path to the web worker file
   * @throws {Error} If any parameter has incorrect type
   */
  constructor(packages, filesToLoad, pyodideInitPath, workerPath) {
    console.log("🎛️ [PyodideManager] Constructor called");

    // Strict type validation using ValidationUtils
    ValidationUtils.validatePackages(packages, 'PyodideManager');
    ValidationUtils.validateFilesToLoad(filesToLoad, 'PyodideManager');
    ValidationUtils.validateString(
      pyodideInitPath,
      'pyodideInitPath',
      'PyodideManager'
    );
    ValidationUtils.validateString(workerPath, 'workerPath', 'PyodideManager');

    /** @type {Worker|null} Web worker instance */
    this.worker = null;

    /** @type {Array<ExecutionResult>} Execution history with results and metadata */
    this.executionHistory = [];

    /** @type {boolean} Whether Pyodide is ready for execution */
    this.isReady = false;

    /** @type {string[]} Python packages to install during initialization - filtered and validated */
    this.packages = this.validateAndFilterPackages(packages);

    /** @type {Array<FileToLoad>} Files to load into Pyodide filesystem */
    this.filesToLoad = filesToLoad;

    /** @type {string} Path to the pyodide_init.py file */
    this.pyodideInitPath = pyodideInitPath;

    /** @type {string} Path to the web worker file */
    this.workerPath = workerPath;

    // Initialize input state using the input module
    PyodideManagerInput.initializeInputState(this);

    this.initWorker();
    console.log("🎛️ [PyodideManager] Worker initialized");
  }

  /**
   * Validate and filter Python packages
   *
   * @param {string[]} packages - Array of package names to validate
   * @returns {string[]} Validated and filtered package names
   */
  validateAndFilterPackages(packages) {
    const validPackages = packages.filter(pkg => {
      if (typeof pkg !== "string") {
        console.warn(`🎛️ [PyodideManager] Skipping non-string package: ${pkg}`);
        return false;
      }
      if (pkg.trim().length === 0) {
        console.warn(`🎛️ [PyodideManager] Skipping empty package name`);
        return false;
      }
      return true;
    });

    return validPackages;
  }

  /**
   * Initialize the web worker and set up message handling
   *
   * @private
   * @returns {void}
   */
  initWorker() {
    this.worker = new Worker(this.workerPath);
    this.worker.onmessage = (e) => this.handleMessage(e.data);
    this.worker.postMessage({
      type: "init",
      packages: this.packages,
      filesToLoad: this.filesToLoad,
      pyodideInitPath: this.pyodideInitPath,
    });
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
      console.log("🎛️ [PyodideManager] Ready for execution");
    }

    // Pyodide initialization or execution error
    if (data.type === "error") {
      console.error("🎛️ [PyodideManager] Error:", data.message || data.error || data);
    }

    // Package installation warning (non-fatal)
    if (data.type === "warning") {
      console.warn("🎛️ [PyodideManager] Warning:", data.message || "Unknown warning");
    }

    // Package installation info (optimization messages)
    if (data.type === "info") {
      console.info("🎛️ [PyodideManager] Info:", data.message || "Unknown info");
    }

    // Handle input-related messages using input module
    PyodideManagerInput.handleInputMessage(this, data);

    // Python code execution completed
    if (data.type === "result") {
      PyodideManagerInput.resetInputState(this);

      console.log("🎛️ [PyodideManager] Execution result received");
      console.log("🎛️ [PyodideManager] stdout length:", data.stdout ? data.stdout.length : 0);
      console.log("🎛️ [PyodideManager] stderr length:", data.stderr ? data.stderr.length : 0);
      console.log("🎛️ [PyodideManager] missive:", data.missive);
      console.log("🎛️ [PyodideManager] figures:", data.figures ? data.figures.length : 0);
      console.log("🎛️ [PyodideManager] error:", data.error);

      // Create execution entry with all result data
      const entry = {
        filename: data.filename,
        time: data.time,
        stdout: data.stdout,
        stderr: data.stderr,
        missive: data.missive,
        figures: data.figures,
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
