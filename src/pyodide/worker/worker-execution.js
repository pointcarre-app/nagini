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
  if (!validateInitialized(workerState, data.id)) return;

  const { code, filename, namespace, id } = data;
  const start = Date.now();
  let stdout = "", stderr = "", missive = null, figures = [], error = null;

  try {
    // Transform code for async execution if needed
    const result = transformCodeForExecution(code, workerState);

    workerState.captureSystem.reset_captures();

    // Always execute through runPythonAsync: it handles synchronous code
    // identically and enables top-level await in any user code (asyncio,
    // httpx/ASGI, transformed input() calls, ...)
    if (namespace !== undefined) {
      const pyodideNamespace = workerState.pyodide.toPy(namespace);
      try {
        await workerState.pyodide.runPythonAsync(result.code, { globals: pyodideNamespace });
      } finally {
        pyodideNamespace.destroy();
      }
    } else {
      await workerState.pyodide.runPythonAsync(result.code);
    }

    ({ stdout, stderr, missive, figures } = captureOutputs(workerState));

  } catch (err) {
    error = { name: err.name || "PythonError", message: err.message || "Unknown execution error" };
    ({ stdout, stderr, figures } = captureOutputs(workerState, true));
  }

  // Default-namespace runs persist their globals, so a rebinding of the
  // exposed builtins (missive, input) outlives this execution: warn once
  if (namespace === undefined) {
    warnShadowedBuiltins(workerState, filename);
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
    id, filename, stdout, stderr, missive, figures, error,
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
  // Ne match que les vrais appels input(, pas some_func__input( ni obj.input(.
  // La réécriture réelle est faite côté Python sur l'AST ; ce gate ne décide
  // que du passage en exécution asynchrone (runPythonAsync).
  const needsAsync = /(?<![\w.])input\s*\(/.test(code);

  if (needsAsync) {
    // Transform the code using the Python transformation, called through the
    // module reference (immune to user code rebinding the name)
    const transformedCode = workerState.codeTransformation.transform_code_for_execution(code);
    return { code: transformedCode, needsAsync: true };
  } else {
    // Return original code as-is
    return { code: code, needsAsync: false };
  }
}

/**
 * Capture Python outputs (stdout, stderr, missive, figures)
 * Retrieves execution outputs through the capture_system module reference,
 * never by name lookup in the interpreter globals: user code rebinding
 * get_stdout, get_missive or json cannot corrupt the capture
 *
 * @param {WorkerState} workerState - Current worker state object
 * @param {boolean} [isErrorCase=false] - Whether this is capturing after an error
 * @returns {CapturedOutputs} Object containing stdout, stderr, missive, and figures
 */
export function captureOutputs(workerState, isErrorCase = false) {
  const capture = workerState.captureSystem;
  let stdout = "", stderr = "", missive = null, figures = [];

  try {
    stdout = capture.get_stdout() || "";
    stderr = capture.get_stderr() || "";

    if (!isErrorCase) {
      const missiveJson = capture.get_missive();
      if (missiveJson) {
        // Keep as string - get_missive() already returns JSON string via json.dumps()
        missive = missiveJson;
      }

      // Capture matplotlib figures
      try {
        const figuresResult = capture.get_figures();
        if (figuresResult && figuresResult.toJs) {
          figures = figuresResult.toJs();
          figuresResult.destroy();
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

/**
 * Warn (once per name per worker life) when user code rebound one of the
 * exposed builtins (missive, input) in the persistent global namespace.
 * A diagnostic must never fail an execution: errors are swallowed.
 *
 * @param {WorkerState} workerState - Current worker state object
 * @param {string} filename - Execution that triggered the check
 * @returns {void}
 */
function warnShadowedBuiltins(workerState, filename) {
  try {
    const result = workerState.captureSystem.detect_shadowed_names(workerState.pyodide.globals);
    const shadowed = result.toJs ? result.toJs() : result;
    if (result.destroy) result.destroy();

    for (const name of shadowed) {
      if (workerState.shadowWarnedNames.has(name)) continue;
      workerState.shadowWarnedNames.add(name);
      postWarning(
        `The global name "${name}" was rebound by user code (${filename}) and now shadows ` +
        `the built-in ${name}(). It persists across executions: later code cannot call the ` +
        `built-in until the shadow is removed (del ${name}).`
      );
    }
  } catch (e) {
    // Diagnostic only: never let it affect the execution result
  }
}

// Helper functions for messaging: the request id (when present) is echoed
// back so the manager can correlate the response with its pending promise
const postResult = (data) => self.postMessage({ type: "result", ...data });
const postError = (message, id) => self.postMessage({ type: "error", id, message: `🐍 [Worker] ${message}` });
const postWarning = (message) => self.postMessage({ type: "warning", message: `🐍 [Worker] ${message}` });

/**
 * Validate that worker is properly initialized
 * @param {WorkerState} workerState - Current worker state
 * @param {number} [id] - Request id to echo in the error response
 * @returns {boolean} True if initialized, false otherwise
 */
function validateInitialized(workerState, id) {
  if (!workerState.isInitialized || !workerState.pyodide) {
    postError(PYODIDE_WORKER_CONFIG.MESSAGES.NOT_INITIALIZED, id);
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
 * @property {string|null} missive - Missive as a JSON string (parse on the consumer side)
 * @property {string[]} figures - Base64 encoded matplotlib figures
 */

/**
 * @typedef {Object} WorkerState
 * @property {PyodideAPI|null} pyodide - Pyodide instance
 * @property {boolean} isInitialized - Whether Pyodide is initialized
 * @property {Set<string>} packagesLoaded - Set of loaded package names
 * @property {Object|null} captureSystem - PyProxy of the capture_system module
 * @property {Object|null} codeTransformation - PyProxy of the code_transformation module
 * @property {Set<string>} shadowWarnedNames - Built-in names already reported as shadowed
 */
