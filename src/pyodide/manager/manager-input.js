/**
 * PyodideManagerInput - Input handling functionality for PyodideManager
 *
 * Contains all input-related methods extracted from PyodideManager to improve
 * code organization and keep file sizes manageable.
 *
 * Features:
 * - Input queue management
 * - Callback system for interactive input
 * - Input state tracking
 * - Integration with Python input() function
 */

import { ValidationUtils } from '../../utils/validation.js';

/**
 * Static class containing input handling functionality for PyodideManager
 */
export class PyodideManagerInput {
  /**
   * Initialize input state for a PyodideManager instance
   * @param {PyodideManager} manager - Manager instance to initialize
   * @returns {void}
   */
  static initializeInputState(manager) {
    manager.inputState = {
      isWaitingForInput: false,
      currentPrompt: "",
      inputCallback: null,
      inputQueue: [] // For programmatic input provision
    };
  }

  /**
   * Provide input to Python code that's waiting for input
   *
   * @param {PyodideManager} manager - Manager instance
   * @param {string} input - The input value to provide
   * @returns {void}
   */
  static provideInput(manager, input) {
    ValidationUtils.validateString(input, 'input', 'PyodideManagerInput');

    if (!manager.isReady) {
      console.error("🐍 [PyodideManagerInput] Manager not ready");
      return;
    }

    console.log("🐍 [PyodideManagerInput] Providing input:", input);

    manager.worker.postMessage({
      type: "input_response",
      input: input
    });

    manager.inputState.isWaitingForInput = false;
    manager.inputState.currentPrompt = "";
  }

  /**
   * Queue input for later provision when Python code requests it
   *
   * @param {PyodideManager} manager - Manager instance
   * @param {string} input - The input value to queue
   * @returns {void}
   */
  static queueInput(manager, input) {
    ValidationUtils.validateString(input, 'input', 'PyodideManagerInput');

    console.log("🐍 [PyodideManagerInput] Queuing input:", input);
    manager.inputState.inputQueue.push(input);
  }

  /**
   * Set a callback function to be called when input is required
   *
   * @param {PyodideManager} manager - Manager instance
   * @param {Function} callback - Function to call when input is needed
   * @returns {void}
   */
  static setInputCallback(manager, callback) {
    if (callback !== null) {
      ValidationUtils.validateFunction(callback, 'callback', 'PyodideManagerInput');
    }

    manager.inputState.inputCallback = callback;
  }

  /**
   * Check if Python code is currently waiting for input
   *
   * @param {PyodideManager} manager - Manager instance
   * @returns {boolean} True if waiting for input, false otherwise
   */
  static isWaitingForInput(manager) {
    return manager.inputState.isWaitingForInput;
  }

  /**
   * Get the current input prompt if waiting for input
   *
   * @param {PyodideManager} manager - Manager instance
   * @returns {string} Current input prompt or empty string
   */
  static getCurrentPrompt(manager) {
    return manager.inputState.currentPrompt;
  }

  /**
   * Handle input-related message from worker
   *
   * @param {PyodideManager} manager - Manager instance
   * @param {Object} data - Message data from worker
   * @returns {void}
   */
  static handleInputMessage(manager, data) {
    // Handle input request from worker
    if (data.type === "input_required") {
      console.log("🐍 [PyodideManagerInput] Input required:", data.prompt || "No prompt");
      
      // Check if we have queued input
      if (manager.queuedInput !== null) {
        const input = manager.queuedInput;
        manager.queuedInput = null;
        console.log("🐍 [PyodideManagerInput] Providing queued input:", input);
        manager.worker.postMessage({ type: "input_response", input });
      } else {
        // Call the input callback if set
        console.log("🐍 [PyodideManagerInput] Calling input callback");
        if (manager.inputCallback) {
          manager.inputCallback(data.prompt || "");
        } else {
          console.warn(
            "🐍 [PyodideManagerInput] No input callback set and no queued input. " +
            "Use setInputCallback() or queueInput() to handle input requests."
          );
          console.warn(
            "🐍 [PyodideManagerInput] Providing empty string as fallback input."
          );
          manager.worker.postMessage({ type: "input_response", input: "" });
        }
      }
    }
  }

  /**
   * Reset input state (called on execution completion)
   *
   * @param {PyodideManager} manager - Manager instance
   * @returns {void}
   */
  static resetInputState(manager) {
    manager.inputState.isWaitingForInput = false;
    manager.inputState.currentPrompt = "";
  }
}
