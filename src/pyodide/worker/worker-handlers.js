/**
 * PyodideWorker Message Handlers - Optimized
 *
 * Concise message handling logic for the pyodide worker
 */

import { PYODIDE_WORKER_CONFIG } from './worker-config.js';
import { handleExecute, transformCodeForExecution, captureOutputs } from './worker-execution.js';
import { setupInputHandling, handleInputResponse } from './worker-input.js';
import { handleFSOperation, executeFS, loadPackages } from './worker-fs.js';
import { PyodideFileLoader } from '../file-loader/file-loader.js';

// Import Python modules as bundled strings
import captureSystemPy from '@python/capture_system.py';
import codeTransformationPy from '@python/code_transformation.py';
import pyodideUtilitiesPy from '@python/pyodide_utilities.py';
import pyodideInitPy from '@python/pyodide_init.py';

/**
 * Post error message to main thread
 * @param {string} message - Error message to send
 * @returns {void}
 */
const postError = (message) => self.postMessage({
  type: "error",
  message: `🔧 [Worker] ${message}`
});

/**
 * Post filesystem error message to main thread
 * @param {string} error - Error message to send
 * @returns {void}
 */
const postFSError = (error) => self.postMessage({ type: "fs_error", error: `🔧 [Worker] ${error}` });

/**
 * Post execution result to main thread
 * @param {ExecutionResultData} data - Execution result data
 * @returns {void}
 */
const postResult = (data) => self.postMessage({ type: "result", ...data });

/**
 * Post info message to main thread
 * @param {string} message - Info message to send
 * @returns {void}
 */
const postInfo = (message) => self.postMessage({ type: "info", message: `🔧 [Worker] ${message}` });

/**
 * Post warning message to main thread
 * @param {string} message - Warning message to send
 * @returns {void}
 */
const postWarning = (message) => self.postMessage({ type: "warning", message: `🔧 [Worker] ${message}` });

/**
 * Post input required message to main thread
 * @param {string} prompt - Input prompt
 * @returns {void}
 */
const postInputRequired = (prompt) => self.postMessage({ type: "input_required", prompt });

/**
 * Validate that worker is properly initialized
 * @param {WorkerState} workerState - Current worker state
 * @returns {boolean} True if initialized, false otherwise
 */
const validateInitialized = (workerState) => {
  if (!workerState.isInitialized || !workerState.pyodide) {
    postError(PYODIDE_WORKER_CONFIG.MESSAGES.NOT_INITIALIZED);
    return false;
  }
  return true;
};

/**
 * Main message dispatcher
 * Handles incoming messages from the main thread and routes them to appropriate handlers
 *
 * @param {MessageEvent} e - Message event from main thread
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Promise<void>}
 */
async function handleMessage(e, workerState) {
  const { data } = e;

  if (!data?.type) {
    postError(PYODIDE_WORKER_CONFIG.MESSAGES.INVALID_MESSAGE);
    return;
  }

  const handlers = {
    init: handleInit,
    execute: handleExecute,
    fs_operation: handleFSOperation,
    input_response: handleInputResponse
  };

  const handler = handlers[data.type];
  if (!handler) {
    postError(`${PYODIDE_WORKER_CONFIG.MESSAGES.UNKNOWN_TYPE}: ${data.type}`);
    return;
  }

  await handler(data, workerState);
}

/**
 * Handle Pyodide initialization
 * Loads Pyodide runtime, bundled Python modules, and packages
 *
 * @param {InitMessage} data - Initialization message data
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Promise<void>}
 */
async function handleInit(data, workerState) {
  if (workerState.isInitialized) {
    postError(PYODIDE_WORKER_CONFIG.MESSAGES.ALREADY_INITIALIZED);
    return;
  }

  const { packages, micropipPackages, filesToLoad } = data;

  console.log("🐍 [Worker] handleInit called with data:", {
    packages: packages ? packages.length : 0,
    micropipPackages: micropipPackages ? micropipPackages.length : 0,
    filesToLoad: filesToLoad ? filesToLoad.length : 0
  });

  console.log("🐍 [Worker] filesToLoad details:", filesToLoad);

  try {
    // Load Pyodide runtime
    importScripts(`${PYODIDE_WORKER_CONFIG.PYODIDE_CDN}pyodide.js`);
    workerState.pyodide = await loadPyodide({ indexURL: PYODIDE_WORKER_CONFIG.PYODIDE_CDN });

    console.log("🐍 Using bundled Python modules");

    // Load bundled Python modules directly (no HTTP fetching needed!)
    const pythonModules = [
      { name: 'capture_system.py', content: captureSystemPy },
      { name: 'code_transformation.py', content: codeTransformationPy },
      { name: 'pyodide_utilities.py', content: pyodideUtilitiesPy }
    ];

    for (const module of pythonModules) {
      try {
        // Write to filesystem for potential imports
        workerState.pyodide.FS.writeFile(module.name, module.content);
        // Execute the module so it can be imported
        workerState.pyodide.runPython(module.content);
        console.log(`🐍 Loaded and executed bundled Python module: ${module.name}`);
      } catch (error) {
        console.warn(`🐍 Could not load bundled Python module ${module.name}:`, error.message);
      }
    }

    // Load main Python initialization script from bundle
    console.log("🐍 Loading bundled pyodide_init.py");
    workerState.pyodide.runPython(pyodideInitPy);

    // Set up input handling system
    await setupInputHandling(workerState.pyodide);

    // Load custom files into filesystem if provided
    if (filesToLoad && filesToLoad.length > 0) {
      console.log(`🐍 [Worker] Loading ${filesToLoad.length} custom files into filesystem`);
      console.log(`🐍 [Worker] Files to load:`, filesToLoad);
      
      try {
        const loader = new PyodideFileLoader(filesToLoad);
        await loader.loadFiles(workerState.pyodide);
        console.log(`🐍 [Worker] Successfully loaded ${filesToLoad.length} custom files`);
      } catch (error) {
        console.error(`🐍 [Worker] Failed to load custom files:`, error);
        throw error;
      }
    } else {
      console.log(`🐍 [Worker] No custom files to load (filesToLoad: ${filesToLoad})`);
    }

    // Load packages if provided
    if (packages?.length > 0) await loadPackages(packages, workerState);

    // Load micropip packages if provided
    if (micropipPackages?.length > 0) {
      const toLoad = micropipPackages.filter(pkg => !workerState.micropipPackagesLoaded.has(pkg));
      const loaded = micropipPackages.filter(pkg => workerState.micropipPackagesLoaded.has(pkg));

      if (loaded.length > 0) {
        postInfo(`[Micropip] Skipping ${loaded.length} already installed packages: ${loaded.join(", ")}`);
      }

      if (toLoad.length > 0) {
        postInfo(`[Micropip] Installing ${toLoad.length} packages: ${toLoad.join(", ")}...`);
        await workerState.pyodide.loadPackage("micropip");
        const micropip = workerState.pyodide.pyimport("micropip");
        await micropip.install(toLoad);
        toLoad.forEach(pkg => workerState.micropipPackagesLoaded.add(pkg));
        postInfo("[Micropip] Packages installed successfully.");
      }
    }

    // Set up matplotlib if it was loaded
    try {
      workerState.pyodide.runPython("setup_matplotlib()");
    } catch (e) {
      console.log("🎨 Matplotlib setup skipped (not available):", e.message);
    }

    workerState.isInitialized = true;
    self.postMessage({ type: "ready" });

  } catch (err) {
    workerState.pyodide = null;
    workerState.isInitialized = false;
    postError(`${PYODIDE_WORKER_CONFIG.MESSAGES.INIT_FAILED}: ${err.message}`);
  }
}

export { handleMessage, handleInit, handleExecute, handleFSOperation, handleInputResponse, setupInputHandling };

/**
 * @typedef {Object} WorkerState
 * @property {PyodideAPI|null} pyodide - Pyodide instance
 * @property {boolean} isInitialized - Whether Pyodide is initialized
 * @property {Set<string>} packagesLoaded - Set of loaded package names
 * @property {Set<string>} micropipPackagesLoaded - Set of loaded micropip package names
 */

/**
 * @typedef {Object} InitMessage
 * @property {'init'} type - Message type
 * @property {string[]} packages - Array of package names to install
 * @property {string[]} [micropipPackages] - Optional array of package names to install with micropip
 * @property {Array<FileToLoad>} filesToLoad - Files to load into filesystem
 */

/**
 * @typedef {Object} ExecuteMessage
 * @property {'execute'} type - Message type
 * @property {string} filename - Name for execution tracking
 * @property {string} code - Python code to execute
 * @property {Object} [namespace] - Optional namespace for execution
 */

/**
 * @typedef {Object} FSOperationMessage
 * @property {'fs_operation'} type - Message type
 * @property {string} operation - Filesystem operation name
 * @property {string} path - File or directory path
 * @property {string} [content] - File content (for write operations)
 */

/**
 * @typedef {Object} ExecutionResultData
 * @property {string} filename - Name of executed file
 * @property {string} stdout - Standard output
 * @property {string} stderr - Standard error
 * @property {Object|null} missive - Structured data from Python
 * @property {Object|null} error - Execution error object
 * @property {number} time - Execution time in milliseconds
 * @property {boolean} executedWithNamespace - Whether execution used namespace
 */

/**
 * @typedef {Object} CapturedOutputs
 * @property {string} stdout - Standard output
 * @property {string} stderr - Standard error
 * @property {Object|null} missive - Structured JSON data
 */

/**
 * @typedef {Object} FSOperationResult
 * @property {boolean} [success] - Whether operation succeeded
 * @property {string} [content] - File content (for readFile)
 * @property {boolean} [exists] - Whether file exists (for exists)
 * @property {string[]} [files] - Directory contents (for listdir)
 */

/**
 * @typedef {Object} FileToLoad
 * @property {string} path - Target path in filesystem
 * @property {string} content - File content to write
 */

/**
 * @typedef {Object} PyodideAPI
 * @property {function} runPython - Execute Python code
 * @property {function} loadPackage - Load Python packages
 * @property {function} toPy - Convert JavaScript to Python
 * @property {Object} FS - Filesystem operations
 */
