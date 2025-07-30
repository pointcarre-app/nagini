/**
 * Nagini - Python-in-Browser Runtime Manager
 *
 * This file provides a higher-level API with useful convenience methods
 * for managing Python execution in the browser using different backends
 * (Pyodide, <?> etc.).
 */

import { ValidationUtils } from './utils/validation.js';

// Export Nagini as ES module
export const Nagini = {
    /**
     * Create a new manager instance with specified backend
     * @param {string} [backend='pyodide'] - Backend to use ('pyodide' or 'brython')
     * @param {string[]} packages - Python packages to install
     * @param {string[]} micropipPackages - Python packages to install with micropip
     * @param {Array} filesToLoad - Custom files to load into filesystem
     *                              Array of objects with {url, path} properties
     *                              Supports both local paths and remote URLs (S3, etc.)
     * @param {string} workerPath - Path to the bundled web worker file (must be worker-dist.js)
     * @param {Object} [options={}] - Backend-specific options (e.g. brythonJsPath for Brython)
     * @returns {Manager} New manager instance
     */
    createManager: async (backend = 'pyodide', packages, micropipPackages, filesToLoad, workerPath, options = {}) => {
      // Validate backend parameter
      ValidationUtils.validateBackend(backend, 'Nagini');

      if (backend.toLowerCase() === 'pyodide') {
        // Enforce bundled worker usage for Pyodide (cross-origin compatibility)
        let finalWorkerPath = workerPath;
        if (!workerPath.includes('worker-dist.js')) {
          // Auto-convert to bundled worker
          if (workerPath.includes('worker.js')) {
            finalWorkerPath = workerPath.replace('worker.js', 'worker-dist.js');
            console.warn(`🐍 [Nagini] Auto-converted to bundled worker: ${finalWorkerPath}`);
            console.warn(`🐍 [Nagini] Only bundled workers are supported for cross-origin compatibility.`);
            console.warn(`🐍 [Nagini] Please update your code to use worker-dist.js directly.`);
          } else {
            throw new Error(`🐍 [Nagini] Only bundled workers are supported for Pyodide. Expected 'worker-dist.js', got: ${workerPath}. Please build the worker first with 'npm run build' in the worker directory.`);
          }
        }
        
        const { PyodideManager } = await import('./pyodide/manager/manager.js');
        return new PyodideManager(packages, micropipPackages, filesToLoad, finalWorkerPath);
      } else if (backend.toLowerCase() === 'brython') {
        // Brython doesn't require bundled workers - use as-is
        const { BrythonManager } = await import('./brython/manager/manager.js');
        return new BrythonManager(packages, filesToLoad, '', workerPath, options);
      } else {
        throw new Error(`🐍 [Nagini] ${backend} backend not yet implemented`);
      }
    },

    /**
     * Wait for a manager to be ready for execution
     * @param {Manager} manager - Manager instance to wait for
     * @param {number} [timeout] - Timeout in milliseconds (default: 30000)
     * @returns {Promise<void>} Resolves when manager is ready
     */
    waitForReady: async (manager, timeout = 30000) => {
      const startTime = Date.now();
      while (!manager.isReady) {
        if (Date.now() - startTime > timeout) {
          throw new Error(`🐍 [Nagini] Manager initialization timeout after ${timeout}ms`);
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    },

    /**
     * Execute Python code from a URL
     * @param {string} url - URL to fetch Python code from
     * @param {Manager} manager - Manager instance to use
     * @param {Object} [namespace] - Optional namespace for execution
     * @returns {Promise<Object>} Execution result
     */
    executeFromUrl: async (url, manager, namespace = undefined) => {
      if (!manager.isReady) {
        throw new Error(
          "🐍 [Nagini] Manager not ready. Call Nagini.waitForReady() first."
        );
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`🐍 [Nagini] Failed to fetch ${url}: HTTP ${response.status}`);
      }

      const code = await response.text();
      const filename = url.split("/").pop() || "unknown.py";

      return manager.executeAsync(filename, code, namespace);
    },

    /**
     * Get list of supported backends
     * @returns {string[]} Array of supported backend names
     */
    getSupportedBackends: () => {
      return ['pyodide', 'brython'];
    },

    /**
     * Check if a backend is supported
     * @param {string} backend - Backend name to check
     * @returns {boolean} True if backend is supported
     */
    isBackendSupported: (backend) => {
      return Nagini.getSupportedBackends().includes(backend.toLowerCase());
    }
  };