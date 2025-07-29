/**
 * PyodideManagerFS - Filesystem operations for PyodideManager
 *
 * Contains all filesystem-related methods extracted from PyodideManager to improve
 * code organization and keep file sizes manageable.
 *
 * Features:
 * - File operations (read, write, mkdir, exists, listdir)
 * - Promise-based async filesystem interface
 * - Error handling and timeout management
 * - Message handler interception pattern
 */

import { ValidationUtils } from '../../utils/validation.js';

/**
 * Static class containing filesystem functionality for PyodideManager
 */
export class PyodideManagerFS {
  /**
   * Filesystem operations proxy - main public interface
   *
   * @param {PyodideManager} manager - Manager instance
   * @param {FSOperation} operation - FS operation: 'writeFile', 'readFile', 'mkdir', 'exists', 'listdir'
   * @param {FSOperationParams} params - Operation parameters
   * @returns {Promise<any>} Operation result
   * @throws {Error} If operation fails or times out
   */
  static async fs(manager, operation, params) {
    ValidationUtils.validateString(operation, 'operation', 'PyodideManagerFS');
    ValidationUtils.validateObject(params, 'params', 'PyodideManagerFS');

    const result = await PyodideManagerFS._sendFSCommand(manager, operation, params);

    // Return appropriate result based on operation type
    switch(operation) {
      case "readFile":
        return result.content;
      case "exists":
        return result.exists;
      case "listdir":
        return result.files;
      case "writeFile":
      case "mkdir":
      default:
        return result;
    }
  }

  /**
   * Write file to Pyodide filesystem
   *
   * @param {PyodideManager} manager - Manager instance
   * @param {string} path - File path
   * @param {string} content - File content
   * @returns {Promise<Object>} Operation result
   */
  static async writeFile(manager, path, content) {
    ValidationUtils.validateString(path, 'path', 'PyodideManagerFS');
    ValidationUtils.validateString(content, 'content', 'PyodideManagerFS');

    return PyodideManagerFS.fs(manager, 'writeFile', { path, content });
  }

  /**
   * Read file from Pyodide filesystem
   *
   * @param {PyodideManager} manager - Manager instance
   * @param {string} path - File path
   * @returns {Promise<string>} File content
   */
  static async readFile(manager, path) {
    ValidationUtils.validateString(path, 'path', 'PyodideManagerFS');

    return PyodideManagerFS.fs(manager, 'readFile', { path });
  }

  /**
   * Create directory in Pyodide filesystem
   *
   * @param {PyodideManager} manager - Manager instance
   * @param {string} path - Directory path
   * @returns {Promise<Object>} Operation result
   */
  static async mkdir(manager, path) {
    ValidationUtils.validateString(path, 'path', 'PyodideManagerFS');

    return PyodideManagerFS.fs(manager, 'mkdir', { path });
  }

  /**
   * Check if path exists in Pyodide filesystem
   *
   * @param {PyodideManager} manager - Manager instance
   * @param {string} path - Path to check
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  static async exists(manager, path) {
    ValidationUtils.validateString(path, 'path', 'PyodideManagerFS');

    return PyodideManagerFS.fs(manager, 'exists', { path });
  }

  /**
   * List directory contents in Pyodide filesystem
   *
   * @param {PyodideManager} manager - Manager instance
   * @param {string} path - Directory path
   * @returns {Promise<string[]>} Array of file/directory names
   */
  static async listdir(manager, path) {
    ValidationUtils.validateString(path, 'path', 'PyodideManagerFS');

    return PyodideManagerFS.fs(manager, 'listdir', { path });
  }

  /**
   * Private helper method to send FS commands to worker with message interception
   *
   * This method implements the HANDLER REPLACEMENT PATTERN to enable Promise-based
   * filesystem operations over web worker message passing.
   *
   * 🔧 HANDLER REPLACEMENT PATTERN FOR FILESYSTEM OPERATIONS:
   *
   * This method uses the same core pattern as PyodideManagerStaticExecutor.executeAsync(),
   * but specialized for filesystem operations:
   *
   * 1. Save the original handleMessage function
   * 2. Replace with a custom interceptor that:
   *    - Still calls the original handler (for normal processing)
   *    - BUT ALSO checks if this is the FS result we're waiting for
   *    - If yes: resolve the Promise with the result
   *    - Then restore the original handleMessage
   * 3. Send the filesystem command to the worker
   * 4. When the FS result comes back, our custom handler catches it
   * 5. Original handler is restored for future calls
   *
   * This enables clean Promise-based filesystem APIs like:
   * - await manager.fs("writeFile", {path: "test.txt", content: "hello"})
   * - await manager.fs("readFile", {path: "test.txt"})
   * - await manager.fs("mkdir", {path: "new-directory"})
   *
   * @private
   * @param {PyodideManager} manager - Manager instance
   * @param {FSOperation} operation - FS operation name
   * @param {FSOperationParams} params - Operation parameters
   * @returns {Promise<FSOperationResult>} Operation result
   * @throws {Error} If operation fails or times out
   */
  static async _sendFSCommand(manager, operation, params) {
    if (!manager.isReady) {
      throw new Error("🐍 [PyodideManagerFS] Manager not ready yet. Wait for initialization to complete.");
    }

    return new Promise((resolve, reject) => {
      // Add timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        try {
          manager.handleMessage = originalHandler;
        } catch (error) {
          console.warn("🐍 [PyodideManagerFS] Failed to restore handler on timeout:", error.message);
        }
        reject(new Error("🐍 [PyodideManagerFS] Filesystem operation timeout"));
      }, 10000);

      // Save original handler and replace with interceptor
      const originalHandler = manager.handleMessage.bind(manager);

      if (!originalHandler) {
        clearTimeout(timeoutId);
        reject(new Error("🎛️ [PyodideManagerFS] No message handler available"));
        return;
      }

      manager.handleMessage = function (data) {
        try {
          // Call original handler for normal processing
          originalHandler(data);

          // Check if this is the FS result we're waiting for
          if (data.type === "fs_result") {
            clearTimeout(timeoutId);
            manager.handleMessage = originalHandler;
            resolve(data.result);
          } else if (data.type === "fs_error") {
            clearTimeout(timeoutId);
            manager.handleMessage = originalHandler;
            reject(new Error(`🎛️ [PyodideManagerFS] Filesystem error: ${data.error}`));
          }
        } catch (error) {
          clearTimeout(timeoutId);
          manager.handleMessage = originalHandler;
          reject(new Error(`🎛️ [PyodideManagerFS] Handler error: ${error.message}`));
        }
      };

      // Send FS command to worker
      try {
        manager.worker.postMessage({
          type: "fs_operation",
          operation: operation,
          ...params
        });
      } catch (error) {
        clearTimeout(timeoutId);
        manager.handleMessage = originalHandler;
        reject(new Error(`🎛️ [PyodideManagerFS] Failed to send filesystem command: ${error.message}`));
      }
    });
  }
}

/**
 * @typedef {'writeFile'|'readFile'|'mkdir'|'exists'|'listdir'} FSOperation
 */

/**
 * @typedef {Object} FSOperationParams
 * @property {string} path - File or directory path
 * @property {string} [content] - File content (for writeFile operation)
 */

/**
 * @typedef {Object} FSOperationResult
 * @property {boolean} [success] - Whether operation succeeded
 * @property {string} [content] - File content (for readFile)
 * @property {boolean} [exists] - Whether file/directory exists
 * @property {string[]} [files] - Directory contents (for listdir)
 */
