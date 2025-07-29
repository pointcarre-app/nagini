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
    console.log(`🐍 [Worker] Input requested with prompt: "${prompt}"`);

    // Send input request to main thread
    self.postMessage({
      type: "input_required",
      prompt: prompt
    });

    // Return a promise that will be resolved when input is received
    return new Promise((resolve) => {
      console.log("🐍 [Worker] Waiting for input from main thread...");
      self.pendingInputResolver = resolve;
    });
  };

  // Set up the Python environment with input handling
  await pyodide.runPythonAsync(`
import asyncio
import builtins
import sys
from js import requestInput

# Set up input handling
async def input_handler(prompt=""):
    # Always print the prompt to stdout first
    if prompt:
        print(prompt, end="", flush=True)
        sys.stdout.flush()  # Make sure it's flushed

    # Request input from JavaScript
    user_input = await requestInput(prompt)
    return user_input

# Replace the built-in input function with our async version
builtins.input = input_handler

print("🐍 Python: Input handling system set up successfully")
`);
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
    console.log("🐍 [Worker] Handling input response:", input);

    // Resolve the pending input promise if it exists
    if (self.pendingInputResolver) {
      console.log("🐍 [Worker] Resolving pending input promise");
      self.pendingInputResolver(input);
      self.pendingInputResolver = null;
    } else {
      console.warn(
        "🐍 [Worker] No pending input resolver found"
      );
    }
  } catch (err) {
    console.error("🐍 [Worker] Failed to provide input:", err);
    postError(`Failed to provide input: ${err.message}`);
  }
}

// Helper functions
const postError = (message) => self.postMessage({ type: "error", message: `�� [Worker] ${message}` });

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
