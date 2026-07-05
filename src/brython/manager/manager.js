import { ValidationUtils } from '../../utils/validation.js';
import { executeAsync as _executeAsync } from './executor.js';
import { loadBrython } from './loader.js';

/**
 * BrythonManager – Minimal backend for Nagini focused on turtle graphics.
 * Provides the same public surface as PyodideManager but runs directly in
 * the main thread with Brython.  Input(), packages, and filesystem are NOT
 * supported for now.
 */
class BrythonManager {
  constructor(packages = [], filesToLoad = [], initPath = '', workerPath = '', brythonOptions = {}) {
    console.log('🐍 [BrythonManager] constructor');

    // Same validation contract as PyodideManager: invalid input throws
    ValidationUtils.validateArray(packages, 'packages', 'BrythonManager');
    ValidationUtils.validateArray(filesToLoad, 'filesToLoad', 'BrythonManager');
    
    this.packages = packages;
    this.filesToLoad = filesToLoad;  // Store filesToLoad for API parity
    
    console.log('🐍 [BrythonManager] filesToLoad set to:', this.filesToLoad);
    console.log('🐍 [BrythonManager] packages set to:', this.packages);

    this.executionHistory = [];
    this.isReady = false;

    // Begin loading Brython runtime immediately with optional configuration
    this._readyPromise = loadBrython(brythonOptions).then(() => {
      this.isReady = true;
      console.log('🐍 [BrythonManager] ready');
    });
  }

  // ------------------ Execution APIs ------------------
  async executeAsync(filename, code, namespace = undefined, timeoutMs = 30000) {
    if (!this.isReady) {
      await this._readyPromise;
    }

    ValidationUtils.validateExecutionParams(filename, code, undefined, 'BrythonManager');

    const raw = await _executeAsync(code, filename, timeoutMs);

    const result = {
      filename,
      time: raw.time,
      stdout: raw.stdout || '',
      stderr: raw.stderr || '',
      missive: raw.missive ?? null,
      figures: [], // turtle draws directly to canvas
      error: raw.error ?? null,
      timestamp: new Date().toISOString()
    };

    this.executionHistory.push(result);
    return result;
  }

  executeFile(filename, code, namespace = undefined) {
    this.executeAsync(filename, code, namespace).catch(console.error);
  }

  // ------------------ Unsupported stubs ------------------
  async fs() {
    throw new Error('Brython backend does not support filesystem operations');
  }

  queueInput() { console.warn('Brython backend: input() not supported'); }
  provideInput() { console.warn('Brython backend: input() not supported'); }
  setInputCallback() { console.warn('Brython backend: input() not supported'); }
  isWaitingForInput() { return false; }
  getCurrentPrompt() { return null; }

  clearExecutionHistory() { this.executionHistory = []; }
}

export { BrythonManager }; 