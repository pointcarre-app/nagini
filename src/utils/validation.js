/**
 * Validation Utilities for Nagini
 *
 * Centralized parameter validation functions used across all components
 * to ensure consistent error handling and type checking.
 *
 * @module ValidationUtils
 */

/**
 * General validation utility class with static methods for parameter validation
 */
export class ValidationUtils {
  /**
   * Validate that a value is an array
   * @param {any} value - Value to validate
   * @param {string} paramName - Parameter name for error messages
   * @param {string} [component] - Component name for error context
   * @throws {Error} If value is not an array
   */
  static validateArray(value, paramName, component = 'Component') {
    if (!Array.isArray(value)) {
      throw new Error(`🔧 [${component}] ${paramName} must be an array, got ${typeof value}`);
    }
  }

  /**
   * Validate that a value is a string
   * @param {any} value - Value to validate
   * @param {string} paramName - Parameter name for error messages
   * @param {string} [component] - Component name for error context
   * @param {boolean} [allowEmpty=false] - Whether to allow empty strings
   * @throws {Error} If value is not a string or is empty when not allowed
   */
  static validateString(value, paramName, component = 'Component', allowEmpty = false) {
    if (typeof value !== 'string') {
      throw new Error(`🔧 [${component}] ${paramName} must be a string, got ${typeof value}`);
    }
    if (!allowEmpty && value.trim().length === 0) {
      throw new Error(`🔧 [${component}] ${paramName} cannot be empty`);
    }
  }

  /**
   * Validate that a value is a boolean
   * @param {any} value - Value to validate
   * @param {string} paramName - Parameter name for error messages
   * @param {string} [component] - Component name for error context
   * @throws {Error} If value is not a boolean
   */
  static validateBoolean(value, paramName, component = 'Component') {
    if (typeof value !== 'boolean') {
      throw new Error(`🔧 [${component}] ${paramName} must be a boolean, got ${typeof value}`);
    }
  }

  /**
   * Validate that a value is a function
   * @param {any} value - Value to validate
   * @param {string} paramName - Parameter name for error messages
   * @param {string} [component] - Component name for error context
   * @throws {Error} If value is not a function
   */
  static validateFunction(value, paramName, component = 'Component') {
    if (typeof value !== 'function') {
      throw new Error(`🔧 [${component}] ${paramName} must be a function, got ${typeof value}`);
    }
  }

  /**
   * Validate that a value is an object (not null, not array)
   * @param {any} value - Value to validate
   * @param {string} paramName - Parameter name for error messages
   * @param {string} [component] - Component name for error context
   * @throws {Error} If value is not a plain object
   */
  static validateObject(value, paramName, component = 'Component') {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      throw new Error(`🔧 [${component}] ${paramName} must be a plain object, got ${typeof value}`);
    }
  }

  /**
   * Validate Worker instance
   * @param {any} worker - Worker to validate
   * @param {string} [component] - Component name for error context
   * @throws {Error} If worker is not valid
   */
  static validateWorker(worker, component = 'Component') {
    if (!worker || typeof worker.postMessage !== 'function') {
      throw new Error(`🔧 [${component}] Invalid worker instance - missing postMessage method`);
    }
  }

  /**
   * Validate Pyodide instance
   * @param {any} pyodide - Pyodide instance to validate
   * @param {string} [component] - Component name for error context
   * @throws {Error} If pyodide is not valid
   */
  static validatePyodide(pyodide, component = 'Component') {
    if (!pyodide) {
      throw new Error(`🔧 [${component}] Pyodide instance is required`);
    }
    if (!pyodide.FS) {
      throw new Error(`🔧 [${component}] Invalid Pyodide instance - missing FS`);
    }
    if (typeof pyodide.runPython !== 'function') {
      throw new Error(`🔧 [${component}] Invalid Pyodide instance - missing runPython`);
    }
  }

  /**
   * Validate file objects array for FileLoader
   * @param {Array} filesToLoad - Array of file objects
   * @param {string} [component] - Component name for error context
   * @throws {Error} If any file object is invalid
   */
      static validateFilesToLoad(filesToLoad, component = 'PyodideFileLoader') {
    this.validateArray(filesToLoad, 'filesToLoad', component);

    for (const [index, file] of filesToLoad.entries()) {
      if (!file || typeof file !== 'object') {
        throw new Error(`🔧 [${component}] filesToLoad[${index}] must be an object`);
      }
      this.validateString(file.url, `filesToLoad[${index}].url`, component);
      this.validateString(file.path, `filesToLoad[${index}].path`, component);
    }
  }

  /**
   * Validate packages array
   * @param {Array} packages - Array of package names
   * @param {string} [component] - Component name for error context
   * @throws {Error} If packages array is invalid
   */
  static validatePackages(packages, component = 'Component') {
    this.validateArray(packages, 'packages', component);

    for (const [index, pkg] of packages.entries()) {
      if (typeof pkg !== 'string') {
        throw new Error(`🔧 [${component}] packages[${index}] must be a string, got ${typeof pkg}`);
      }
      if (pkg.trim().length === 0) {
        throw new Error(`🔧 [${component}] packages[${index}] cannot be empty`);
      }
    }
  }

  /**
   * Validate namespace object (optional parameter)
   * @param {any} namespace - Namespace to validate
   * @param {string} [component] - Component name for error context
   * @throws {Error} If namespace is provided but invalid
   */
  static validateNamespace(namespace, component = 'Component') {
    if (namespace !== undefined) {
      this.validateObject(namespace, 'namespace', component);
    }
  }

  /**
   * Validate execution parameters
   * @param {string} filename - Filename for execution
   * @param {string} code - Python code to execute
   * @param {any} [namespace] - Optional namespace
   * @param {string} [component] - Component name for error context
   * @throws {Error} If any parameter is invalid
   */
  static validateExecutionParams(filename, code, namespace, component = 'Component') {
    this.validateString(filename, 'filename', component);
    this.validateString(code, 'code', component);
    this.validateNamespace(namespace, component);
  }

  /**
   * Check for potentially dangerous Python code patterns
   * @param {string} code - Python code to check
   * @returns {Array<string>} Array of dangerous patterns found
   */
  static checkDangerousPatterns(code) {
    const dangerousPatterns = [
      { pattern: /import\s+os\b/g, reason: 'OS module access' },
      { pattern: /import\s+subprocess\b/g, reason: 'Subprocess execution' },
      { pattern: /\beval\s*\(/g, reason: 'Dynamic code evaluation' },
      { pattern: /\bexec\s*\(/g, reason: 'Dynamic code execution' },
      { pattern: /\b__import__\s*\(/g, reason: 'Dynamic module import' },
      { pattern: /\bopen\s*\(/g, reason: 'File system access' },
      { pattern: /\bcompile\s*\(/g, reason: 'Code compilation' }
    ];

    const found = [];
    for (const { pattern, reason } of dangerousPatterns) {
      if (pattern.test(code)) {
        found.push(reason);
      }
    }

    return found;
  }

  /**
   * Validate backend parameter (must be 'pyodide' or <?>)
   * @param {string} backend - Backend to validate
   * @param {string} [component] - Component name for error context
   * @throws {Error} If backend is not valid
   */
  static validateBackend(backend, component = 'Component') {
    this.validateString(backend, 'backend', component);
    const validBackends = ['pyodide'];
    if (!validBackends.includes(backend.toLowerCase())) {
      throw new Error(`🔧 [${component}] backend must be one of: ${validBackends.join(', ')}, got "${backend}"`);
    }
  }
}

/**
 * @typedef {Object} ValidationError
 * @property {string} message - Error message
 * @property {string} component - Component that threw the error
 * @property {string} parameter - Parameter that failed validation
 */
