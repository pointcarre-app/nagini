/**
 * Nagini UMD Bundle - Universal Module Definition
 * This version bundles all dependencies for CDN usage
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node.js
        module.exports = factory();
    } else {
        // Browser globals
        root.Nagini = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {

    // Inline ValidationUtils to avoid import dependency
    const ValidationUtils = {
        validateBackend: (backend, componentName) => {
            if (!backend || typeof backend !== 'string') {
                throw new Error(`🐍 [${componentName}] Backend must be a non-empty string`);
            }
            
            const supportedBackends = ['pyodide', 'brython'];
            if (!supportedBackends.includes(backend.toLowerCase())) {
                throw new Error(`🐍 [${componentName}] Unsupported backend: ${backend}. Supported: ${supportedBackends.join(', ')}`);
            }
        },

        validateArray: (array, componentName) => {
            if (!Array.isArray(array)) {
                throw new Error(`🐍 [${componentName}] Expected array, got ${typeof array}`);
            }
        },

        validateString: (str, componentName) => {
            if (typeof str !== 'string') {
                throw new Error(`🐍 [${componentName}] Expected string, got ${typeof str}`);
            }
        },

        checkDangerousPatterns: (code) => {
            const dangerousPatterns = [
                /import\s+os/,
                /from\s+os\s+import/,
                /subprocess/,
                /__import__\s*\(/,
                /exec\s*\(/,
                /eval\s*\(/
            ];
            
            for (const pattern of dangerousPatterns) {
                if (pattern.test(code)) {
                    console.warn(`🐍 [ValidationUtils] Potentially dangerous pattern detected: ${pattern}`);
                }
            }
        }
    };

    // Main Nagini object
    const Nagini = {
        /**
         * Create a new manager instance with specified backend
         * @param {string} [backend='pyodide'] - Backend to use ('pyodide' or 'brython')
         * @param {string[]} packages - Python packages to install
         * @param {string[]} micropipPackages - Python packages to install with micropip
         * @param {Array} filesToLoad - Custom files to load into filesystem
         * @param {string} workerPath - Path to the bundled web worker file
         * @param {Object} [options={}] - Backend-specific options
         * @returns {Promise<Manager>} New manager instance
         */
        createManager: async (backend = 'pyodide', packages, micropipPackages, filesToLoad, workerPath, options = {}) => {
            // Validate backend parameter
            ValidationUtils.validateBackend(backend, 'Nagini');

            if (backend.toLowerCase() === 'pyodide') {
                // For UMD bundle, we need to dynamically import the manager
                // This will only work if the dependencies are also available
                try {
                    // Try to load from the same base URL
                    const baseUrl = workerPath.substring(0, workerPath.lastIndexOf('/'));
                    const managerUrl = `${baseUrl}/../manager/manager.js`;
                    
                    const { PyodideManager } = await import(managerUrl);
                    return new PyodideManager(packages, micropipPackages, filesToLoad, workerPath);
                } catch (error) {
                    throw new Error(`🐍 [Nagini UMD] Failed to load PyodideManager: ${error.message}. Make sure all dependencies are available at the same CDN location.`);
                }
            } else if (backend.toLowerCase() === 'brython') {
                try {
                    const baseUrl = workerPath ? workerPath.substring(0, workerPath.lastIndexOf('/')) : '';
                    const managerUrl = `${baseUrl}/../brython/manager/manager.js`;
                    
                    const { BrythonManager } = await import(managerUrl);
                    return new BrythonManager(packages, filesToLoad, '', workerPath, options);
                } catch (error) {
                    throw new Error(`🐍 [Nagini UMD] Failed to load BrythonManager: ${error.message}. Make sure all dependencies are available at the same CDN location.`);
                }
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

    return Nagini;
}));


