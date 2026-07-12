/**
 * PyodideWorker Input Module
 *
 * Handles input requests and responses in the Pyodide worker environment.
 */

import { PYODIDE_WORKER_CONFIG } from './worker-config.js';

/**
 * Set up input handling system in Python environment
 * Based on the successful implementation from the other repo
 *
 * @param {PyodideAPI} pyodide - Pyodide instance
 * @returns {Promise<void>}
 */
export async function setupInputHandling(pyodide) {
  // Create the requestInput function in the worker's global scope
  self.requestInput = async (prompt = "") => {
    // Send input request to main thread
    self.postMessage({
      type: "input_required",
      prompt: prompt
    });

    // Return a promise that will be resolved when input is received
    return new Promise((resolve) => {
      self.pendingInputResolver = resolve;
    });
  };

  // Set up the Python environment with input handling. The snippet runs in
  // a throwaway namespace: none of its names (sys, requestInput,
  // input_handler) leak into the interpreter globals where user code runs,
  // so they cannot be shadowed or rebound from user code. The handler keeps
  // them alive through its own module-level closure.
  const setupNamespace = pyodide.toPy({});
  try {
    await pyodide.runPythonAsync(`
import builtins
import sys
from js import requestInput

async def input_handler(prompt=""):
    # Always print the prompt to stdout first
    if prompt:
        print(prompt, end="", flush=True)
        sys.stdout.flush()

    # Request input from JavaScript
    return await requestInput(prompt)

# Replace the built-in input function with our async version
builtins.input = input_handler
`, { globals: setupNamespace });
  } finally {
    setupNamespace.destroy();
  }
}

/**
 * Handle input response from main thread
 * Provides user input to Python code that's waiting for input
 *
 * @param {InputResponseMessage} data - Input response message data
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Promise<void>}
 */
export async function handleInputResponse(data, workerState) {
  if (!validateInitialized(workerState)) return;

  const { input } = data;

  try {
    // Resolve the pending input promise if it exists
    if (self.pendingInputResolver) {
      self.pendingInputResolver(input);
      self.pendingInputResolver = null;
    } else {
      console.warn("No pending input resolver found");
    }
  } catch (err) {
    console.error("Failed to provide input:", err);
    postError(`Failed to provide input: ${err.message}`);
  }
}

// Helper functions
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
 * @typedef {Object} InputResponseMessage
 * @property {'input_response'} type - Message type
 * @property {string} input - User input value
 */

/**
 * @typedef {Object} WorkerState
 * @property {PyodideAPI|null} pyodide - Pyodide instance
 * @property {boolean} isInitialized - Whether Pyodide is initialized
 * @property {Set<string>} packagesLoaded - Set of loaded package names
 */
