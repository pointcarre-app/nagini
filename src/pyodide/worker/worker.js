/**
 * Pyodide Web Worker - Entry Point
 *
 * Pyodide WebAssembly worker that runs Python code in a separate thread.
 * Handles initialization, code execution, and structured communication (missive + stdout + stderr)
 * with the main thread via message passing.
 *
 * ⚠️ Security Note: This worker executes arbitrary Python code.
 * Use ONLY in trusted environments or implement additional sandboxing.
 *
 * @example
 * // Main thread usage:
 * const worker = new Worker('./pyodide-worker.js');
 * worker.postMessage({ type: 'init', packages: ['numpy'], pyodideInitPath: './init.py' });
 * worker.postMessage({ type: 'execute', filename: 'test.py', code: 'print("Hello")' });
 *
 * @module PyodideWorker
 */

/**
 * Worker state object to track Pyodide instance and loaded packages
 * @type {WorkerState}
 */
const workerState = {
  /** @type {PyodideAPI|null} Pyodide instance - null until initialization complete */
  pyodide: null,

  /** @type {boolean} Tracks initialization state */
  isInitialized: false,

  /** @type {Set<string>} Tracks loaded packages to prevent duplicate loading 📦 */
  packagesLoaded: new Set()
};

/**
 * Web Worker message handler with dynamic import loading
 *
 * Processes messages from the main thread using modular handlers loaded dynamically.
 * This pattern allows for code splitting and lazy loading of handler modules.
 *
 * @param {MessageEvent<WorkerMessage>} e - Message event from main thread
 * @returns {Promise<void>}
 */
self.onmessage = async function (e) {
  try {
    // Dynamically import the handler module for code splitting
    const { handleMessage } = await import('./worker-handlers.js');

    // Replace onmessage with the imported handler for future messages
    self.onmessage = async function (e) {
      await handleMessage(e, workerState);
    };

    // Handle the current message
    await handleMessage(e, workerState);
  } catch (error) {
    // Error during dynamic import or initial message handling
    self.postMessage({
      type: "error",
      message: `🔧 [Worker] Failed to load handlers: ${error.message}`
    });
  }
};

/**
 * @typedef {Object} WorkerState
 * @property {PyodideAPI|null} pyodide - Pyodide instance (null until initialized)
 * @property {boolean} isInitialized - Whether Pyodide is fully initialized
 * @property {Set<string>} packagesLoaded - Set of loaded package names for deduplication
 */

/**
 * @typedef {Object} WorkerMessage
 * @property {'init'|'execute'|'fs_operation'|'input_response'} type - Message type
 * @property {string} [filename] - Filename for execution (execute messages)
 * @property {string} [code] - Python code to execute (execute messages)
 * @property {Object} [namespace] - Execution namespace (execute messages)
 * @property {string[]} [packages] - Python packages to install (init messages)
 * @property {string} [pyodideInitPath] - Path to initialization script (init messages)
 * @property {Array<FileToLoad>} [filesToLoad] - Files to load (init messages)
 * @property {string} [operation] - Filesystem operation type (fs_operation messages)
 * @property {string} [path] - File path (fs_operation messages)
 * @property {string} [content] - File content (fs_operation messages)
 * @property {string} [input] - User input (input_response messages)
 */

/**
 * @typedef {Object} PyodideAPI
 * @property {Function} runPython - Execute Python code synchronously
 * @property {Function} runPythonAsync - Execute Python code asynchronously
 * @property {Function} loadPackage - Load Python packages
 * @property {Function} toPy - Convert JavaScript to Python objects
 * @property {Object} FS - Virtual filesystem interface
 * @property {Function} FS.writeFile - Write file to filesystem
 * @property {Function} FS.readFile - Read file from filesystem
 * @property {Function} FS.mkdir - Create directory
 * @property {Function} FS.analyzePath - Analyze path existence
 * @property {Function} FS.readdir - List directory contents
 */

/**
 * @typedef {Object} FileToLoad
 * @property {string} url - URL to fetch the file from
 * @property {string} path - Target path in Pyodide filesystem
 */
