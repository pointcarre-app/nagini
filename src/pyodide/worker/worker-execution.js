/**
 * PyodideWorker Execution Module
 *
 * Handles Python code execution, transformation, and output capture
 * for the Pyodide worker environment.
 */

import { PYODIDE_WORKER_CONFIG } from './worker-config.js';

/**
 * Handle Python code execution
 * Executes Python code with optional namespace isolation and captures outputs
 *
 * @param {ExecuteMessage} data - Execution message data
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Promise<void>}
 */
export async function handleExecute(data, workerState) {
  if (!validateInitialized(workerState)) return;

  const { code, filename, namespace } = data;
  const start = Date.now();
  let stdout = "", stderr = "", missive = null, figures = [], error = null;

  try {
    // Transform code for async execution if needed
    const result = transformCodeForExecution(code, workerState);

    workerState.pyodide.runPython("reset_captures()");

    // Execute with or without namespace
    if (namespace !== undefined) {
      const pyodideNamespace = workerState.pyodide.toPy(namespace);
      try {
        if (result.needsAsync) {
          await workerState.pyodide.runPythonAsync(result.code, { globals: pyodideNamespace });
        } else {
          workerState.pyodide.runPython(result.code, { globals: pyodideNamespace });
        }
      } finally {
        pyodideNamespace.destroy();
      }
    } else {
      if (result.needsAsync) {
        await workerState.pyodide.runPythonAsync(result.code);
      } else {
        workerState.pyodide.runPython(result.code);
      }
    }

    ({ stdout, stderr, missive, figures } = captureOutputs(workerState.pyodide));

  } catch (err) {
    error = { name: err.name || "PythonError", message: err.message || "Unknown execution error" };
    ({ stdout, stderr, figures } = captureOutputs(workerState.pyodide, true));
  }

  // 🐍 POST EXECUTION RESULTS (always logged with snake emoji)
  console.log("🐍 Worker execution result:", {
    filename,
    stdout: stdout.length + " chars",
    stderr: stderr.length + " chars", 
    missive,
    figures: figures.length + " figures",
    error,
    time: (Date.now() - start) + "ms"
  });
  
  postResult({
    filename, stdout, stderr, missive, figures, error,
    time: Date.now() - start,
    executedWithNamespace: namespace !== undefined
  });
}

/**
 * Transform code for execution, handling input() calls if present
 * @param {string} code - The original Python code
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Object} - {code: transformedCode, needsAsync: boolean}
 */
export function transformCodeForExecution(code, workerState) {
  const needsAsync = code.includes('input(');

  if (needsAsync) {
    // Transform the code using Python transformation
    const transformedCode = workerState.pyodide.runPython(`transform_code_for_execution(${JSON.stringify(code)})`);
    return { code: transformedCode, needsAsync: true };
  } else {
    // Return original code as-is
    return { code: code, needsAsync: false };
  }
}

/**
 * Capture Python outputs (stdout, stderr, missive, figures)
 * Retrieves execution outputs from Python runtime
 *
 * @param {PyodideAPI} pyodide - Pyodide instance
 * @param {boolean} [isErrorCase=false] - Whether this is capturing after an error
 * @returns {CapturedOutputs} Object containing stdout, stderr, missive, and figures
 */
export function captureOutputs(pyodide, isErrorCase = false) {
  let stdout = "", stderr = "", missive = null, figures = [];

  try {
    stdout = pyodide.runPython("get_stdout()") || "";
    stderr = pyodide.runPython("get_stderr()") || "";

    if (!isErrorCase) {
      const missiveJson = pyodide.runPython("get_missive()");
      if (missiveJson) {
        // Keep as string - get_missive() already returns JSON string via json.dumps()
        missive = missiveJson;
      }

      // Capture matplotlib figures
      try {
        const figuresResult = pyodide.runPython("get_figures()");
        if (figuresResult && figuresResult.toJs) {
          figures = figuresResult.toJs();
        } else if (Array.isArray(figuresResult)) {
          figures = figuresResult;
        }
      } catch (e) {
        console.warn("🐍 Failed to capture matplotlib figures:", e.message);
      }
    }
  } catch (err) {
    console.warn("🐍 " + PYODIDE_WORKER_CONFIG.MESSAGES.OUTPUT_FAILED, err.message);
    if (isErrorCase) stderr = `${PYODIDE_WORKER_CONFIG.MESSAGES.OUTPUT_RETRIEVAL_FAILED}: ${err.message}`;
  }

  return { stdout, stderr, missive, figures };
}

// Helper functions for messaging
const postResult = (data) => self.postMessage({ type: "result", ...data });
const postError = (message) => self.postMessage({ type: "error", message: `🐍 [Worker] ${message}` });

/**
 * Validate that worker is properly initialized
 * @param {WorkerState} workerState - Current worker state
 * @returns {boolean} True if initialized, false otherwise
 */
function validateInitialized(workerState) {
  if (!workerState.isInitialized || !workerState.pyodide) {
    postError(PYODIDE_WORKER_CONFIG.MESSAGES.NOT_INITIALIZED);
    return false;
  }
  return true;
}

/**
 * @typedef {Object} ExecuteMessage
 * @property {'execute'} type - Message type
 * @property {string} filename - Name for execution tracking
 * @property {string} code - Python code to execute
 * @property {Object} [namespace] - Optional namespace for execution
 */

/**
 * @typedef {Object} CapturedOutputs
 * @property {string} stdout - Standard output
 * @property {string} stderr - Standard error
 * @property {Object|null} missive - Structured JSON data
 * @property {string[]} figures - Base64 encoded matplotlib figures
 */

/**
 * @typedef {Object} WorkerState
 * @property {PyodideAPI|null} pyodide - Pyodide instance
 * @property {boolean} isInitialized - Whether Pyodide is initialized
 * @property {Set<string>} packagesLoaded - Set of loaded package names
 */
