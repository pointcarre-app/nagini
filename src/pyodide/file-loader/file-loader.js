/**
 * PyodideFileLoader - File loading utilities for Pyodide
 *
 * Handles loading remote files (S3, URLs) into the Pyodide virtual filesystem
 * with retry mechanisms and proper error handling.
 *
 * @example
 * const filesToLoad = [
 *   { url: "https://example.com/module.py", path: "modules/module.py" },
 *   { url: "./local/file.py", path: "local_file.py" }
 * ];
 * const loader = new PyodideFileLoader(filesToLoad);
 * await loader.loadFiles(pyodide);
 */

/**
 * PyodideFileLoader class for loading files into Pyodide filesystem
 */
class PyodideFileLoader {
  /**
   * Create a new PyodideFileLoader instance
   *
   * @param {Array<FileToLoad>} filesToLoad - Array of file objects to load
   * @throws {Error} If filesToLoad is not an array or contains invalid objects
   */
  constructor(filesToLoad) {
    // Validate argument - now required
    if (!Array.isArray(filesToLoad)) {
      throw new Error("📦 [PyodideFileLoader] filesToLoad must be an array");
    }

    // Validate each file object
    for (const [index, file] of filesToLoad.entries()) {
      if (!file || typeof file !== 'object') {
        throw new Error(`📦 [PyodideFileLoader] filesToLoad[${index}] must be an object`);
      }
      if (typeof file.url !== 'string' || !file.url.trim()) {
        throw new Error(
          `📦 [PyodideFileLoader] filesToLoad[${index}].url must be a non-empty string`
        );
      }
      if (typeof file.path !== 'string' || !file.path.trim()) {
        throw new Error(`📦 [PyodideFileLoader] filesToLoad[${index}].path must be a non-empty string`);
      }
    }

    this.filesToLoad = filesToLoad;
  }

  /**
   * Load files into Pyodide filesystem with retry mechanism
   *
   * @param {PyodideAPI} pyodide - Pyodide instance
   * @param {LoadOptions} [options] - Loading options
   * @returns {Promise<void>}
   * @throws {Error} If file loading fails after all retries
   */
  async loadFiles(pyodide, options = {}) {
    const { maxRetries = 3, retryDelay = 1000 } = options;

    // Validate pyodide instance
    if (!pyodide || !pyodide.FS) {
      throw new Error("📦 [PyodideFileLoader] Invalid pyodide instance - missing FS");
    }

    for (const file of this.filesToLoad) {
      let retryCount = 0;

      while (retryCount < maxRetries) {
        try {
          console.log(`🐍 [PyodideFileLoader] Loading: ${file.url} (attempt ${retryCount + 1}/${maxRetries})`);

          const response = await fetch(file.url);
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const content = await response.text();

          // Create directory if needed
          const dir = file.path.split('/').slice(0, -1).join('/');
          if (dir) {
            const dirExists = pyodide.FS.analyzePath(dir).exists;
            if (!dirExists) {
              console.log(`🐍 [PyodideFileLoader] Creating directory: ${dir}`);
              pyodide.FS.mkdir(dir);
            }
          }

          pyodide.FS.writeFile(file.path, content);
          console.log(`🐍 [PyodideFileLoader] Saved: ${file.path}`);
          break; // Success, exit retry loop

        } catch (error) {
          retryCount++;
          console.warn(`🐍 [PyodideFileLoader] Attempt ${retryCount} failed for ${file.url}:`, error.message);

          if (retryCount === maxRetries) {
            const errorMsg = `📦 [PyodideFileLoader] Failed to load ${file.url} after ${maxRetries} attempts: ${error.message}`;
            console.error(errorMsg);
            throw new Error(errorMsg);
          }

          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
        }
      }
    }
  }
}

export { PyodideFileLoader };

/**
 * @typedef {Object} FileToLoad
 * @property {string} url - URL to fetch the file from (supports S3, HTTP, local paths)
 * @property {string} path - Target path in Pyodide filesystem where file should be saved
 */

/**
 * @typedef {Object} LoadOptions
 * @property {number} [maxRetries=3] - Maximum number of retry attempts for failed downloads
 * @property {number} [retryDelay=1000] - Base delay in milliseconds between retries
 */

/**
 * @typedef {Object} PyodideAPI
 * @property {Object} FS - Pyodide filesystem interface
 * @property {Function} FS.writeFile - Write file to filesystem
 * @property {Function} FS.analyzePath - Analyze path existence
 * @property {Function} FS.mkdir - Create directory
 */
