/**
 * PyodideWorker Filesystem Module
 *
 * Handles filesystem operations and package loading in the Pyodide worker environment.
 */

import { PYODIDE_WORKER_CONFIG } from './worker-config.js';

/**
 * Handle filesystem operations
 * Processes filesystem commands like read, write, mkdir, exists, listdir
 *
 * @param {FSOperationMessage} data - Filesystem operation message data
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Promise<void>}
 */
export async function handleFSOperation(data, workerState) {
  if (!workerState.isInitialized || !workerState.pyodide) {
    postFSError(PYODIDE_WORKER_CONFIG.MESSAGES.FS_NOT_INITIALIZED);
    return;
  }

  try {
    const result = executeFS(data, workerState.pyodide);
    self.postMessage({ type: "fs_result", result });
  } catch (error) {
    postFSError(error.message);
  }
}

/**
 * Execute filesystem operation
 * Handles all filesystem operations (read, write, mkdir, exists, listdir)
 *
 * @param {FSOperationMessage} data - Filesystem operation data
 * @param {PyodideAPI} pyodide - Pyodide instance
 * @returns {FSOperationResult} Result of the filesystem operation
 * @throws {Error} If operation is unknown or fails
 */
export function executeFS(data, pyodide) {
  const { operation, path, content } = data;

  const ops = {
    writeFile: () => {
      // Ensure directory exists
      const dir = path.split('/').slice(0, -1).join('/');
      if (dir && !pyodide.FS.analyzePath(dir).exists) {
        try { pyodide.FS.mkdir(dir); } catch (e) { /* ignore */ }
      }
      pyodide.FS.writeFile(path, content);
      return { success: true };
    },
    readFile: () => ({ content: pyodide.FS.readFile(path, { encoding: 'utf8' }) }),
    mkdir: () => { pyodide.FS.mkdir(path); return { success: true }; },
    exists: () => ({ exists: pyodide.FS.analyzePath(path).exists }),
    listdir: () => ({ files: pyodide.FS.readdir(path) })
  };

  const op = ops[operation];
  if (!op) throw new Error(`Unknown FS operation: ${operation}`);

  return op();
}

/**
 * Load packages with smart loading logic
 * Prevents duplicate package installations and provides progress feedback
 *
 * @param {string[]} packages - Array of package names to load
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Promise<void>}
 */
export async function loadPackages(packages, workerState) {
  const toLoad = packages.filter(pkg => !workerState.packagesLoaded.has(pkg));
  const loaded = packages.filter(pkg => workerState.packagesLoaded.has(pkg));

  if (loaded.length > 0) {
    postInfo(`${PYODIDE_WORKER_CONFIG.MESSAGES.SMART_LOADING} ${loaded.length} already loaded: ${loaded.join(", ")}`);
  }

  if (toLoad.length > 0) {
    try {
      await workerState.pyodide.loadPackage(toLoad);
      toLoad.forEach(pkg => workerState.packagesLoaded.add(pkg));
      postInfo(
        `${PYODIDE_WORKER_CONFIG.MESSAGES.SMART_SUCCESS} ${toLoad.length} new packages: ${toLoad.join(", ")}`
      );
    } catch (err) {
      postWarning(`${PYODIDE_WORKER_CONFIG.MESSAGES.PACKAGE_WARNING} ${err.message}`);
    }
  }
}

// Helper functions for messaging
const postFSError = (error) => self.postMessage({ type: "fs_error", error: `🔧 [Worker] ${error}` });
const postInfo = (message) => self.postMessage({ type: "info", message: `🔧 [Worker] ${message}` });
const postWarning = (message) => self.postMessage({ type: "warning", message: `🔧 [Worker] ${message}` });

/**
 * @typedef {Object} FSOperationMessage
 * @property {'fs_operation'} type - Message type
 * @property {string} operation - Filesystem operation name
 * @property {string} path - File or directory path
 * @property {string} [content] - File content (for write operations)
 */

/**
 * @typedef {Object} FSOperationResult
 * @property {boolean} [success] - Whether operation succeeded
 * @property {string} [content] - File content (for readFile)
 * @property {boolean} [exists] - Whether file exists (for exists)
 * @property {string[]} [files] - Directory contents (for listdir)
 */

/**
 * @typedef {Object} WorkerState
 * @property {PyodideAPI|null} pyodide - Pyodide instance
 * @property {boolean} isInitialized - Whether Pyodide is initialized
 * @property {Set<string>} packagesLoaded - Set of loaded package names
 */
