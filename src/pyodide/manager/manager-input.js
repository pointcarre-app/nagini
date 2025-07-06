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
      console.error("🎛️ [PyodideManagerInput] Manager not ready");
      return;
    }

    console.log("🎛️ [PyodideManagerInput] Providing input:", input);

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

    console.log("🎛️ [PyodideManagerInput] Queuing input:", input);
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
    if (data.type === "input_required") {
      console.log("🎛️ [PyodideManagerInput] Input required:", data.prompt || "No prompt");
      manager.inputState.isWaitingForInput = true;
      manager.inputState.currentPrompt = data.prompt || "";

      // Check if we have input queued up
      if (manager.inputState.inputQueue.length > 0) {
        const input = manager.inputState.inputQueue.shift();
        console.log("🎛️ [PyodideManagerInput] Providing queued input:", input);
        PyodideManagerInput.provideInput(manager, input);
      } else if (manager.inputState.inputCallback) {
        // Call the input callback if one is registered
        console.log("🎛️ [PyodideManagerInput] Calling input callback");
        manager.inputState.inputCallback(data.prompt);
      } else {
        console.warn("🎛️ [PyodideManagerInput] Input required but no callback or queued input available");
        console.warn("🎛️ [PyodideManagerInput] Current queue length:", manager.inputState.inputQueue.length);
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
