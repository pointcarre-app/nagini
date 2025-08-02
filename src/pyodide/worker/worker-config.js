/**
 * PyodideWorker Configuration
 *
 * Centralized configuration constants and messages for the pyodide worker
 * Extracted from the main worker file to improve maintainability
 */

/**
 * Configuration object containing all constants and messages
 * @type {WorkerConfig}
 */
const PYODIDE_WORKER_CONFIG = {
  /**
   * Pyodide CDN URL for loading runtime
   * @type {string}
   */
  PYODIDE_CDN: "https://cdn.jsdelivr.net/pyodide/v0.28.0/full/",

  /**
   * Centralized messages for consistent error reporting and logging
   * @type {WorkerMessages}
   */
  MESSAGES: {
    // Error messages
    /** @type {string} */
    INVALID_MESSAGE: "Invalid message format: expected object with 'type' property",
    /** @type {string} */
    INVALID_TYPE: "Invalid message type: expected non-empty string",
    /** @type {string} */
    UNKNOWN_TYPE: "Unknown message type",
    /** @type {string} */
    ALREADY_INITIALIZED: "Worker already initialized",
    /** @type {string} */
    NOT_INITIALIZED: "Worker not initialized. Call init() first.",
    /** @type {string} */
    INIT_FAILED: "Failed to initialize Pyodide",
    /** @type {string} */
    FETCH_FAILED: "Failed to fetch initialization script",
    /** @type {string} */
    FS_NOT_INITIALIZED: "Filesystem not available - worker not initialized",

    // Package loading messages
    /** @type {string} */
    PACKAGE_CHECK: "Checking packages to load:",
    /** @type {string} */
    PACKAGE_SKIP: "Skipping already loaded packages:",
    /** @type {string} */
    PACKAGE_INSTALL: "Installing packages:",
    /** @type {string} */
    PACKAGE_LOADED: "All loaded packages:",
    /** @type {string} */
    PACKAGE_FAILED: "Package loading failed:",
    /** @type {string} */
    PACKAGE_WARNING: "Package loading warning:",
    /** @type {string} */
    ALL_LOADED: "All packages already loaded",

    // Smart loading messages
    /** @type {string} */
    SMART_LOADING: "Smart loading: Skipping",
    /** @type {string} */
    SMART_SUCCESS: "Smart loading: Successfully loaded",

    // Execution messages
    /** @type {string} */
    EXEC_NAMESPACE: "Executing Python code with namespace",
    /** @type {string} */
    EXEC_GLOBAL: "Executing Python code in global scope",

    // Output capture messages
    /** @type {string} */
    INVALID_MISSIVE: "Invalid missive JSON:",
    /** @type {string} */
    OUTPUT_FAILED: "Failed to capture outputs:",
    /** @type {string} */
    OUTPUT_RETRIEVAL_FAILED: "Output retrieval failed"
  }
};

export { PYODIDE_WORKER_CONFIG };

/**
 * @typedef {Object} WorkerConfig
 * @property {string} PYODIDE_CDN - CDN URL for Pyodide runtime
 * @property {WorkerMessages} MESSAGES - Centralized messages object
 */

/**
 * @typedef {Object} WorkerMessages
 * @property {string} INVALID_MESSAGE - Invalid message format error
 * @property {string} INVALID_TYPE - Invalid message type error
 * @property {string} UNKNOWN_TYPE - Unknown message type error
 * @property {string} ALREADY_INITIALIZED - Already initialized error
 * @property {string} NOT_INITIALIZED - Not initialized error
 * @property {string} INIT_FAILED - Initialization failed error
 * @property {string} FETCH_FAILED - Fetch failed error
 * @property {string} FS_NOT_INITIALIZED - Filesystem not initialized error
 * @property {string} PACKAGE_CHECK - Package checking message
 * @property {string} PACKAGE_SKIP - Package skipping message
 * @property {string} PACKAGE_INSTALL - Package installation message
 * @property {string} PACKAGE_LOADED - Package loaded message
 * @property {string} PACKAGE_FAILED - Package loading failed message
 * @property {string} PACKAGE_WARNING - Package warning message
 * @property {string} ALL_LOADED - All packages loaded message
 * @property {string} SMART_LOADING - Smart loading skip message
 * @property {string} SMART_SUCCESS - Smart loading success message
 * @property {string} EXEC_NAMESPACE - Namespace execution message
 * @property {string} EXEC_GLOBAL - Global execution message
 * @property {string} INVALID_MISSIVE - Invalid missive JSON error
 * @property {string} OUTPUT_FAILED - Output capture failed error
 * @property {string} OUTPUT_RETRIEVAL_FAILED - Output retrieval failed error
 */
