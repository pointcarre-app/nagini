(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Nagini"] = factory();
	else
		root["Nagini"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 586:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  PyodideManager: () => (/* binding */ PyodideManager)
});

// EXTERNAL MODULE: ../../utils/validation.js
var validation = __webpack_require__(800);
;// ../manager/manager-static-execution.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * PyodideManagerStaticExecutor - Static utility class for Python execution logic
 *
 * This class contains the core execution logic extracted from PyodideManager
 * to improve separation of concerns and testability.
 *
 * 📋 RECENT CHANGES:
 * - Renamed from PyodideStaticExecutor to PyodideManagerStaticExecutor
 * - File renamed from pyodide-static-executor.js to pyodide-manager-static-execution.js
 * - All log messages and error messages updated to use new class name
 * - Updated as part of the comprehensive "Simple" prefix removal initiative
 *
 * 🎯 PURPOSE:
 * - Provides pure, testable static methods for Python code execution
 * - Handles both fire-and-forget and Promise-based execution patterns
 * - Manages namespace isolation and parameter validation
 * - Separates execution logic from PyodideManager lifecycle management
 *
 * ⚡ STATIC METHODS:
 * - executeFile(): Fire-and-forget execution
 * - executeAsync(): Promise-based execution with result tracking
 */


var PyodideManagerStaticExecutor = /*#__PURE__*/function () {
  function PyodideManagerStaticExecutor() {
    _classCallCheck(this, PyodideManagerStaticExecutor);
  }
  return _createClass(PyodideManagerStaticExecutor, null, [{
    key: "executeFile",
    value:
    /**
     * Execute Python code in the worker with optional namespace isolation
     *
     * TECHNICAL DETAILS FOR PYODIDE:
     * - This method sends a message to the web worker containing the execution request
     * - The worker receives: {type: 'execute', filename, code, namespace?}
     * - Worker calls pyodide.runPython(code) or pyodide.runPython(code, namespace)
     *
     * NAMESPACE FLOW:
     * 1. JavaScript object namespace -> sent to worker via postMessage
     * 2. Worker receives it as JavaScript object
     * 3. Worker passes it directly to pyodide.runPython() as second parameter
     * 4. Pyodide converts JavaScript object to Python dict automatically
     * 5. Python code executes with that dict as its namespace
     *
     * @param {Worker} worker - Web worker instance for executing Python code
     * @param {boolean} isReady - Whether Pyodide is ready for execution
     * @param {string} filename - Name for this execution (for tracking and debugging)
     * @param {string} code - Python code to execute
     * @param {Object|undefined} [namespace] - Optional namespace object for Python execution
     * @returns {void} - No return value, sends message to worker
     * @throws {Error} If parameters are invalid or worker is not ready
     */
    function executeFile(worker, isReady, filename, code) {
      var namespace = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : undefined;
      // Validate parameters using ValidationUtils
      validation/* ValidationUtils */.n.validateWorker(worker, 'PyodideManagerStaticExecutor');
      validation/* ValidationUtils */.n.validateBoolean(isReady, 'isReady', 'PyodideManagerStaticExecutor');
      validation/* ValidationUtils */.n.validateExecutionParams(filename, code, namespace, 'PyodideManagerStaticExecutor');
      if (!isReady) {
        console.warn("Manager not ready, execution will be delayed until initialization completes");
        return;
      }

      // Prepare message for worker
      var message = {
        type: "execute",
        filename: filename,
        code: code
      };

      // Only include namespace in message if it's provided
      // This is crucial: we don't want to send undefined/null to the worker
      if (namespace !== undefined) {
        message.namespace = namespace;
      }
      try {
        worker.postMessage(message);
      } catch (error) {
        console.error("Failed to dispatch execution: ".concat(error.message));
      }
    }

    /**
     * Execute Python code asynchronously and return a Promise with the result
     *
     * This method provides Promise-based execution with comprehensive result tracking.
     * It implements the HANDLER REPLACEMENT PATTERN to enable Promise-based APIs
     * over web worker message passing.
     *
     * 🔧 HANDLER REPLACEMENT PATTERN IMPLEMENTATION:
     *
     * THE PROBLEM:
     * Web workers communicate via messages, not direct function calls. When we send
     * a message to the worker, we get a response later via handleMessage(). But
     * JavaScript functions expect immediate return values or Promises.
     *
     * THE SOLUTION:
     * We temporarily "hijack" the handleMessage function to capture the specific
     * result for the specific caller, then restore the original function.
     *
     * STEP-BY-STEP PROCESS:
     * 1. Save the original handleMessage function
     * 2. Replace handleMessage with a custom function that:
     *    - Still calls the original (for normal processing)
     *    - BUT ALSO checks if this is the result we're waiting for
     *    - If yes: resolve the Promise with the result
     *    - Then restore the original handleMessage
     * 3. Send the message to the worker
     * 4. When the result comes back, our custom handler catches it
     * 5. Original handler is restored for future calls
     *
     * WHY THIS IS SAFE:
     * Only one execution may be in flight at a time: PyodideManager.executeAsync
     * serializes calls through its executionChain before delegating here.
     *
     * @param {Worker} worker - Web worker instance for executing Python code
     * @param {boolean} isReady - Whether Pyodide is ready for execution
     * @param {Array<ExecutionResult>} executionHistory - Array to store execution results
     * @param {function(Function): void} setHandleMessage - Function to set the message handler
     * @param {function(): Function} getHandleMessage - Function to get the current message handler
     * @param {string} filename - Name for this execution (for tracking and debugging)
     * @param {string} code - Python code to execute
     * @param {Object|undefined} [namespace] - Optional namespace object for Python execution
     * @returns {Promise<ExecutionResult>} Promise that resolves with execution result
     * @throws {Error} If manager is not ready or execution times out
     */
  }, {
    key: "executeAsync",
    value: (function () {
      var _executeAsync = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(worker, isReady, executionHistory, setHandleMessage, getHandleMessage, filename, code) {
        var namespace,
          timeoutMs,
          _args = arguments;
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              namespace = _args.length > 7 && _args[7] !== undefined ? _args[7] : undefined;
              timeoutMs = _args.length > 8 && _args[8] !== undefined ? _args[8] : 30000;
              // Comprehensive parameter validation
              validation/* ValidationUtils */.n.validateWorker(worker, 'PyodideManagerStaticExecutor');
              validation/* ValidationUtils */.n.validateBoolean(isReady, 'isReady', 'PyodideManagerStaticExecutor');
              validation/* ValidationUtils */.n.validateArray(executionHistory, 'executionHistory', 'PyodideManagerStaticExecutor');
              validation/* ValidationUtils */.n.validateFunction(setHandleMessage, 'setHandleMessage', 'PyodideManagerStaticExecutor');
              validation/* ValidationUtils */.n.validateFunction(getHandleMessage, 'getHandleMessage', 'PyodideManagerStaticExecutor');
              validation/* ValidationUtils */.n.validateExecutionParams(filename, code, namespace, 'PyodideManagerStaticExecutor');
              if (isReady) {
                _context.n = 1;
                break;
              }
              throw new Error("⚡ [PyodideManagerStaticExecutor] Manager not ready yet. Wait for initialization to complete.");
            case 1:
              return _context.a(2, new Promise(function (resolve, reject) {
                // Add timeout to prevent hanging
                var timeoutId = setTimeout(function () {
                  try {
                    setHandleMessage(originalHandler);
                  } catch (error) {
                    console.warn("Failed to restore handler on timeout:", error.message);
                  }
                  reject(new Error("\u26A1 [PyodideManagerStaticExecutor] Execution timeout after ".concat(timeoutMs / 1000, " seconds")));
                }, timeoutMs);

                // Save original handler and replace with interceptor
                var originalHandler = getHandleMessage();
                if (!originalHandler) {
                  clearTimeout(timeoutId);
                  reject(new Error("⚡ [PyodideManagerStaticExecutor] No message handler available"));
                  return;
                }
                setHandleMessage(function (data) {
                  try {
                    // Call original handler for normal processing
                    originalHandler.call(this, data);

                    // Check if this is the result we're waiting for
                    if (data.type === "result") {
                      clearTimeout(timeoutId);
                      setHandleMessage(originalHandler); // Restore original handler

                      // Build the result from the worker payload rather than reading
                      // back executionHistory: the history entry is intentionally
                      // lighter (no figures) and capped
                      var result = {
                        filename: data.filename,
                        time: data.time,
                        stdout: data.stdout,
                        stderr: data.stderr,
                        missive: data.missive,
                        figures: data.figures,
                        bokeh_figures: data.bokeh_figures,
                        error: data.error,
                        timestamp: new Date().toISOString()
                      };
                      // Always resolve with the result, even if it contains Python errors
                      // This allows the caller to access stderr for full traceback information
                      resolve(result);
                    } else if (data.type === "error") {
                      clearTimeout(timeoutId);
                      setHandleMessage(originalHandler);
                      reject(new Error("\u26A1 [PyodideManagerStaticExecutor] Execution error: ".concat(data.message || data.error || 'Unknown error')));
                    }
                  } catch (error) {
                    clearTimeout(timeoutId);
                    setHandleMessage(originalHandler);
                    reject(new Error("\u26A1 [PyodideManagerStaticExecutor] Handler error: ".concat(error.message)));
                  }
                });

                // Send execution message to worker
                try {
                  PyodideManagerStaticExecutor.executeFile(worker, isReady, filename, code, namespace);
                } catch (error) {
                  clearTimeout(timeoutId);
                  setHandleMessage(originalHandler);
                  reject(new Error("\u26A1 [PyodideManagerStaticExecutor] Failed to send execution message: ".concat(error.message)));
                }
              }));
          }
        }, _callee);
      }));
      function executeAsync(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
        return _executeAsync.apply(this, arguments);
      }
      return executeAsync;
    }())
  }]);
}();

/**
 * @typedef {Object} ExecutionResult
 * @property {string} filename - Name of the executed file
 * @property {number} time - Execution time in milliseconds
 * @property {string} stdout - Standard output from Python execution
 * @property {string} stderr - Standard error from Python execution
 * @property {Object|null} missive - Structured JSON data from Python
 * @property {string[]} figures - Base64 encoded matplotlib figures
 * @property {string[]} bokeh_figures - JSON strings of Bokeh figures
 * @property {Object|null} error - JavaScript execution error object
 * @property {string} timestamp - ISO timestamp of execution
 * @property {boolean} [executedWithNamespace] - Whether execution used namespace
 */
;// ../manager/manager-input.js
function manager_input_typeof(o) { "@babel/helpers - typeof"; return manager_input_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, manager_input_typeof(o); }
function manager_input_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function manager_input_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, manager_input_toPropertyKey(o.key), o); } }
function manager_input_createClass(e, r, t) { return r && manager_input_defineProperties(e.prototype, r), t && manager_input_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function manager_input_toPropertyKey(t) { var i = manager_input_toPrimitive(t, "string"); return "symbol" == manager_input_typeof(i) ? i : i + ""; }
function manager_input_toPrimitive(t, r) { if ("object" != manager_input_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != manager_input_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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



/**
 * Static class containing input handling functionality for PyodideManager
 */
var PyodideManagerInput = /*#__PURE__*/function () {
  function PyodideManagerInput() {
    manager_input_classCallCheck(this, PyodideManagerInput);
  }
  return manager_input_createClass(PyodideManagerInput, null, [{
    key: "initializeInputState",
    value:
    /**
     * Initialize input state for a PyodideManager instance
     * @param {PyodideManager} manager - Manager instance to initialize
     * @returns {void}
     */
    function initializeInputState(manager) {
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
  }, {
    key: "provideInput",
    value: function provideInput(manager, input) {
      validation/* ValidationUtils */.n.validateString(input, 'input', 'PyodideManagerInput');
      if (!manager.isReady) {
        console.error("Manager not ready");
        return;
      }
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
  }, {
    key: "queueInput",
    value: function queueInput(manager, input) {
      validation/* ValidationUtils */.n.validateString(input, 'input', 'PyodideManagerInput');
      manager.inputState.inputQueue.push(input);
    }

    /**
     * Set a callback function to be called when input is required
     *
     * @param {PyodideManager} manager - Manager instance
     * @param {Function} callback - Function to call when input is needed
     * @returns {void}
     */
  }, {
    key: "setInputCallback",
    value: function setInputCallback(manager, callback) {
      if (callback !== null) {
        validation/* ValidationUtils */.n.validateFunction(callback, 'callback', 'PyodideManagerInput');
      }
      manager.inputState.inputCallback = callback;
    }

    /**
     * Check if Python code is currently waiting for input
     *
     * @param {PyodideManager} manager - Manager instance
     * @returns {boolean} True if waiting for input, false otherwise
     */
  }, {
    key: "isWaitingForInput",
    value: function isWaitingForInput(manager) {
      return manager.inputState.isWaitingForInput;
    }

    /**
     * Get the current input prompt if waiting for input
     *
     * @param {PyodideManager} manager - Manager instance
     * @returns {string} Current input prompt or empty string
     */
  }, {
    key: "getCurrentPrompt",
    value: function getCurrentPrompt(manager) {
      return manager.inputState.currentPrompt;
    }

    /**
     * Handle input-related message from worker
     *
     * @param {PyodideManager} manager - Manager instance
     * @param {Object} data - Message data from worker
     * @returns {void}
     */
  }, {
    key: "handleInputMessage",
    value: function handleInputMessage(manager, data) {
      // Handle input request from worker
      if (data.type === "input_required") {
        manager.inputState.isWaitingForInput = true;
        manager.inputState.currentPrompt = data.prompt;

        // Check if we have queued input
        if (manager.inputState.inputQueue.length > 0) {
          var input = manager.inputState.inputQueue.shift(); // Dequeue the next input
          this.provideInput(manager, input);
        } else {
          // Call the input callback if set
          if (manager.inputState.inputCallback) {
            manager.inputState.inputCallback(data.prompt || "");
          } else {
            console.warn("No input callback set and no queued input. " + "Use setInputCallback() or queueInput() to handle input requests.");
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
  }, {
    key: "resetInputState",
    value: function resetInputState(manager) {
      manager.inputState.isWaitingForInput = false;
      manager.inputState.currentPrompt = "";
    }
  }]);
}();
;// ../manager/manager-fs.js
function manager_fs_typeof(o) { "@babel/helpers - typeof"; return manager_fs_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, manager_fs_typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = manager_fs_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function manager_fs_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return manager_fs_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (manager_fs_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, manager_fs_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, manager_fs_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), manager_fs_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", manager_fs_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), manager_fs_regeneratorDefine2(u), manager_fs_regeneratorDefine2(u, o, "Generator"), manager_fs_regeneratorDefine2(u, n, function () { return this; }), manager_fs_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (manager_fs_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function manager_fs_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } manager_fs_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { manager_fs_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, manager_fs_regeneratorDefine2(e, r, n, t); }
function manager_fs_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function manager_fs_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { manager_fs_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { manager_fs_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function manager_fs_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function manager_fs_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, manager_fs_toPropertyKey(o.key), o); } }
function manager_fs_createClass(e, r, t) { return r && manager_fs_defineProperties(e.prototype, r), t && manager_fs_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function manager_fs_toPropertyKey(t) { var i = manager_fs_toPrimitive(t, "string"); return "symbol" == manager_fs_typeof(i) ? i : i + ""; }
function manager_fs_toPrimitive(t, r) { if ("object" != manager_fs_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != manager_fs_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * PyodideManagerFS - Filesystem operations for PyodideManager
 *
 * Contains all filesystem-related methods extracted from PyodideManager to improve
 * code organization and keep file sizes manageable.
 *
 * Features:
 * - File operations (read, write, mkdir, exists, listdir)
 * - Promise-based async filesystem interface
 * - Error handling and timeout management
 * - Message handler interception pattern
 */



/**
 * Static class containing filesystem functionality for PyodideManager
 */
var PyodideManagerFS = /*#__PURE__*/function () {
  function PyodideManagerFS() {
    manager_fs_classCallCheck(this, PyodideManagerFS);
  }
  return manager_fs_createClass(PyodideManagerFS, null, [{
    key: "fs",
    value: (
    /**
     * Filesystem operations proxy - main public interface
     *
     * @param {PyodideManager} manager - Manager instance
     * @param {FSOperation} operation - FS operation: 'writeFile', 'readFile', 'mkdir', 'exists', 'listdir'
     * @param {FSOperationParams} params - Operation parameters
     * @returns {Promise<any>} Operation result
     * @throws {Error} If operation fails or times out
     */
    function () {
      var _fs = manager_fs_asyncToGenerator(/*#__PURE__*/manager_fs_regenerator().m(function _callee(manager, operation, params) {
        var result, _t;
        return manager_fs_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              validation/* ValidationUtils */.n.validateString(operation, 'operation', 'PyodideManagerFS');
              validation/* ValidationUtils */.n.validateObject(params, 'params', 'PyodideManagerFS');
              _context.n = 1;
              return PyodideManagerFS._sendFSCommand(manager, operation, params);
            case 1:
              result = _context.v;
              _t = operation;
              _context.n = _t === "readFile" ? 2 : _t === "exists" ? 3 : _t === "listdir" ? 4 : _t === "writeFile" ? 5 : _t === "mkdir" ? 5 : 5;
              break;
            case 2:
              return _context.a(2, result.content);
            case 3:
              return _context.a(2, result.exists);
            case 4:
              return _context.a(2, result.files);
            case 5:
              return _context.a(2, result);
            case 6:
              return _context.a(2);
          }
        }, _callee);
      }));
      function fs(_x, _x2, _x3) {
        return _fs.apply(this, arguments);
      }
      return fs;
    }()
    /**
     * Write file to Pyodide filesystem
     *
     * @param {PyodideManager} manager - Manager instance
     * @param {string} path - File path
     * @param {string} content - File content
     * @returns {Promise<Object>} Operation result
     */
    )
  }, {
    key: "writeFile",
    value: (function () {
      var _writeFile = manager_fs_asyncToGenerator(/*#__PURE__*/manager_fs_regenerator().m(function _callee2(manager, path, content) {
        return manager_fs_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              validation/* ValidationUtils */.n.validateString(path, 'path', 'PyodideManagerFS');
              validation/* ValidationUtils */.n.validateString(content, 'content', 'PyodideManagerFS');
              return _context2.a(2, PyodideManagerFS.fs(manager, 'writeFile', {
                path: path,
                content: content
              }));
          }
        }, _callee2);
      }));
      function writeFile(_x4, _x5, _x6) {
        return _writeFile.apply(this, arguments);
      }
      return writeFile;
    }()
    /**
     * Read file from Pyodide filesystem
     *
     * @param {PyodideManager} manager - Manager instance
     * @param {string} path - File path
     * @returns {Promise<string>} File content
     */
    )
  }, {
    key: "readFile",
    value: (function () {
      var _readFile = manager_fs_asyncToGenerator(/*#__PURE__*/manager_fs_regenerator().m(function _callee3(manager, path) {
        return manager_fs_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              validation/* ValidationUtils */.n.validateString(path, 'path', 'PyodideManagerFS');
              return _context3.a(2, PyodideManagerFS.fs(manager, 'readFile', {
                path: path
              }));
          }
        }, _callee3);
      }));
      function readFile(_x7, _x8) {
        return _readFile.apply(this, arguments);
      }
      return readFile;
    }()
    /**
     * Create directory in Pyodide filesystem
     *
     * @param {PyodideManager} manager - Manager instance
     * @param {string} path - Directory path
     * @returns {Promise<Object>} Operation result
     */
    )
  }, {
    key: "mkdir",
    value: (function () {
      var _mkdir = manager_fs_asyncToGenerator(/*#__PURE__*/manager_fs_regenerator().m(function _callee4(manager, path) {
        return manager_fs_regenerator().w(function (_context4) {
          while (1) switch (_context4.n) {
            case 0:
              validation/* ValidationUtils */.n.validateString(path, 'path', 'PyodideManagerFS');
              return _context4.a(2, PyodideManagerFS.fs(manager, 'mkdir', {
                path: path
              }));
          }
        }, _callee4);
      }));
      function mkdir(_x9, _x0) {
        return _mkdir.apply(this, arguments);
      }
      return mkdir;
    }()
    /**
     * Check if path exists in Pyodide filesystem
     *
     * @param {PyodideManager} manager - Manager instance
     * @param {string} path - Path to check
     * @returns {Promise<boolean>} True if exists, false otherwise
     */
    )
  }, {
    key: "exists",
    value: (function () {
      var _exists = manager_fs_asyncToGenerator(/*#__PURE__*/manager_fs_regenerator().m(function _callee5(manager, path) {
        return manager_fs_regenerator().w(function (_context5) {
          while (1) switch (_context5.n) {
            case 0:
              validation/* ValidationUtils */.n.validateString(path, 'path', 'PyodideManagerFS');
              return _context5.a(2, PyodideManagerFS.fs(manager, 'exists', {
                path: path
              }));
          }
        }, _callee5);
      }));
      function exists(_x1, _x10) {
        return _exists.apply(this, arguments);
      }
      return exists;
    }()
    /**
     * List directory contents in Pyodide filesystem
     *
     * @param {PyodideManager} manager - Manager instance
     * @param {string} path - Directory path
     * @returns {Promise<string[]>} Array of file/directory names
     */
    )
  }, {
    key: "listdir",
    value: (function () {
      var _listdir = manager_fs_asyncToGenerator(/*#__PURE__*/manager_fs_regenerator().m(function _callee6(manager, path) {
        return manager_fs_regenerator().w(function (_context6) {
          while (1) switch (_context6.n) {
            case 0:
              validation/* ValidationUtils */.n.validateString(path, 'path', 'PyodideManagerFS');
              return _context6.a(2, PyodideManagerFS.fs(manager, 'listdir', {
                path: path
              }));
          }
        }, _callee6);
      }));
      function listdir(_x11, _x12) {
        return _listdir.apply(this, arguments);
      }
      return listdir;
    }()
    /**
     * Private helper method to send FS commands to worker with message interception
     *
     * This method implements the HANDLER REPLACEMENT PATTERN to enable Promise-based
     * filesystem operations over web worker message passing.
     *
     * 🔧 HANDLER REPLACEMENT PATTERN FOR FILESYSTEM OPERATIONS:
     *
     * This method uses the same core pattern as PyodideManagerStaticExecutor.executeAsync(),
     * but specialized for filesystem operations:
     *
     * 1. Save the original handleMessage function
     * 2. Replace with a custom interceptor that:
     *    - Still calls the original handler (for normal processing)
     *    - BUT ALSO checks if this is the FS result we're waiting for
     *    - If yes: resolve the Promise with the result
     *    - Then restore the original handleMessage
     * 3. Send the filesystem command to the worker
     * 4. When the FS result comes back, our custom handler catches it
     * 5. Original handler is restored for future calls
     *
     * This enables clean Promise-based filesystem APIs like:
     * - await manager.fs("writeFile", {path: "test.txt", content: "hello"})
     * - await manager.fs("readFile", {path: "test.txt"})
     * - await manager.fs("mkdir", {path: "new-directory"})
     *
     * @private
     * @param {PyodideManager} manager - Manager instance
     * @param {FSOperation} operation - FS operation name
     * @param {FSOperationParams} params - Operation parameters
     * @returns {Promise<FSOperationResult>} Operation result
     * @throws {Error} If operation fails or times out
     */
    )
  }, {
    key: "_sendFSCommand",
    value: (function () {
      var _sendFSCommand2 = manager_fs_asyncToGenerator(/*#__PURE__*/manager_fs_regenerator().m(function _callee7(manager, operation, params) {
        return manager_fs_regenerator().w(function (_context7) {
          while (1) switch (_context7.n) {
            case 0:
              if (manager.isReady) {
                _context7.n = 1;
                break;
              }
              throw new Error("🐍 [PyodideManagerFS] Manager not ready yet. Wait for initialization to complete.");
            case 1:
              return _context7.a(2, new Promise(function (resolve, reject) {
                // Add timeout to prevent hanging
                var timeoutId = setTimeout(function () {
                  try {
                    manager.handleMessage = originalHandler;
                  } catch (error) {
                    console.warn("Failed to restore handler on timeout:", error.message);
                  }
                  reject(new Error("🐍 [PyodideManagerFS] Filesystem operation timeout"));
                }, 10000);

                // Save original handler and replace with interceptor
                var originalHandler = manager.handleMessage.bind(manager);
                if (!originalHandler) {
                  clearTimeout(timeoutId);
                  reject(new Error("🎛️ [PyodideManagerFS] No message handler available"));
                  return;
                }
                manager.handleMessage = function (data) {
                  try {
                    // Call original handler for normal processing
                    originalHandler(data);

                    // Check if this is the FS result we're waiting for
                    if (data.type === "fs_result") {
                      clearTimeout(timeoutId);
                      manager.handleMessage = originalHandler;
                      resolve(data.result);
                    } else if (data.type === "fs_error") {
                      clearTimeout(timeoutId);
                      manager.handleMessage = originalHandler;
                      reject(new Error("\uD83C\uDF9B\uFE0F [PyodideManagerFS] Filesystem error: ".concat(data.error)));
                    }
                  } catch (error) {
                    clearTimeout(timeoutId);
                    manager.handleMessage = originalHandler;
                    reject(new Error("\uD83C\uDF9B\uFE0F [PyodideManagerFS] Handler error: ".concat(error.message)));
                  }
                };

                // Send FS command to worker
                try {
                  manager.worker.postMessage(_objectSpread({
                    type: "fs_operation",
                    operation: operation
                  }, params));
                } catch (error) {
                  clearTimeout(timeoutId);
                  manager.handleMessage = originalHandler;
                  reject(new Error("\uD83C\uDF9B\uFE0F [PyodideManagerFS] Failed to send filesystem command: ".concat(error.message)));
                }
              }));
          }
        }, _callee7);
      }));
      function _sendFSCommand(_x13, _x14, _x15) {
        return _sendFSCommand2.apply(this, arguments);
      }
      return _sendFSCommand;
    }())
  }]);
}();

/**
 * @typedef {'writeFile'|'readFile'|'mkdir'|'exists'|'listdir'} FSOperation
 */

/**
 * @typedef {Object} FSOperationParams
 * @property {string} path - File or directory path
 * @property {string} [content] - File content (for writeFile operation)
 */

/**
 * @typedef {Object} FSOperationResult
 * @property {boolean} [success] - Whether operation succeeded
 * @property {string} [content] - File content (for readFile)
 * @property {boolean} [exists] - Whether file/directory exists
 * @property {string[]} [files] - Directory contents (for listdir)
 */
;// ../../utils/createBlobWorker.js
function createBlobWorker_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return createBlobWorker_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (createBlobWorker_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, createBlobWorker_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, createBlobWorker_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), createBlobWorker_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", createBlobWorker_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), createBlobWorker_regeneratorDefine2(u), createBlobWorker_regeneratorDefine2(u, o, "Generator"), createBlobWorker_regeneratorDefine2(u, n, function () { return this; }), createBlobWorker_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (createBlobWorker_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function createBlobWorker_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } createBlobWorker_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { createBlobWorker_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, createBlobWorker_regeneratorDefine2(e, r, n, t); }
function createBlobWorker_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function createBlobWorker_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { createBlobWorker_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { createBlobWorker_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Blob Worker Creation Utility
 * 
 * Creates web workers from blob URLs to handle cross-origin scenarios.
 * Essential for Flask apps and other frameworks where Nagini is served
 * from a different origin than the main application.
 */

/**
 * Create a blob worker URL from a bundled worker script
 * @param {string} workerUrl - URL to the bundled worker script (worker-dist.js)
 * @returns {Promise<string>} Blob URL that can be used to create a Worker
 * @throws {Error} If worker script cannot be fetched
 */
function createBlobWorkerUrl(_x) {
  return _createBlobWorkerUrl.apply(this, arguments);
}

/**
 * Create a Worker instance using blob URL pattern
 * @param {string} workerUrl - URL to the bundled worker script (worker-dist.js)
 * @returns {Promise<Worker>} Web Worker instance created from blob URL
 * @throws {Error} If worker creation fails
 */
function _createBlobWorkerUrl() {
  _createBlobWorkerUrl = createBlobWorker_asyncToGenerator(/*#__PURE__*/createBlobWorker_regenerator().m(function _callee(workerUrl) {
    var response, workerScript, blob, blobUrl, _t;
    return createBlobWorker_regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return fetch(workerUrl);
        case 1:
          response = _context.v;
          if (response.ok) {
            _context.n = 2;
            break;
          }
          throw new Error("Failed to fetch worker script: HTTP ".concat(response.status));
        case 2:
          _context.n = 3;
          return response.text();
        case 3:
          workerScript = _context.v;
          // Create a blob URL for the worker script
          blob = new Blob([workerScript], {
            type: 'application/javascript'
          });
          blobUrl = URL.createObjectURL(blob);
          return _context.a(2, blobUrl);
        case 4:
          _context.p = 4;
          _t = _context.v;
          console.error('Failed to create blob worker:', _t);
          throw new Error("Failed to create blob worker from ".concat(workerUrl, ": ").concat(_t.message));
        case 5:
          return _context.a(2);
      }
    }, _callee, null, [[0, 4]]);
  }));
  return _createBlobWorkerUrl.apply(this, arguments);
}
function createBlobWorker(_x2) {
  return _createBlobWorker.apply(this, arguments);
}

/**
 * Cleanup blob URL to prevent memory leaks
 * @param {string} blobUrl - Blob URL to revoke
 */
function _createBlobWorker() {
  _createBlobWorker = createBlobWorker_asyncToGenerator(/*#__PURE__*/createBlobWorker_regenerator().m(function _callee2(workerUrl) {
    var blobUrl, worker, _t2;
    return createBlobWorker_regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.p = 0;
          // Ensure we're using the bundled worker
          if (!workerUrl.includes('worker-dist.js')) {
            console.warn('Warning: Expected bundled worker (worker-dist.js), got:', workerUrl);
          }
          _context2.n = 1;
          return createBlobWorkerUrl(workerUrl);
        case 1:
          blobUrl = _context2.v;
          worker = new Worker(blobUrl);
          return _context2.a(2, worker);
        case 2:
          _context2.p = 2;
          _t2 = _context2.v;
          console.error('Worker creation failed:', _t2);
          throw _t2;
        case 3:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return _createBlobWorker.apply(this, arguments);
}
function revokeBlobUrl(blobUrl) {
  try {
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.warn('Failed to revoke blob URL:', error);
  }
}
;// ../manager/manager.js
function manager_typeof(o) { "@babel/helpers - typeof"; return manager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, manager_typeof(o); }
function manager_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return manager_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (manager_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, manager_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, manager_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), manager_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", manager_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), manager_regeneratorDefine2(u), manager_regeneratorDefine2(u, o, "Generator"), manager_regeneratorDefine2(u, n, function () { return this; }), manager_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (manager_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function manager_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } manager_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { manager_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, manager_regeneratorDefine2(e, r, n, t); }
function manager_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function manager_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { manager_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { manager_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function manager_classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function manager_defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, manager_toPropertyKey(o.key), o); } }
function manager_createClass(e, r, t) { return r && manager_defineProperties(e.prototype, r), t && manager_defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function manager_toPropertyKey(t) { var i = manager_toPrimitive(t, "string"); return "symbol" == manager_typeof(i) ? i : i + ""; }
function manager_toPrimitive(t, r) { if ("object" != manager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != manager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * PyodideManager - Main thread interface for Pyodide execution
 *
 * Manages a web worker running Pyodide Python interpreter with clean communication
 * via the "missive" system for structured data exchange.
 *
 * DOM Dependencies: None
 *
 * 💜 ALL VALIDATIONS SHOULD BE DONE IN THE MANAGER - PREFERABLY IN THE CONSTRUCTOR 💜
 *
 * STRICT CONSTRUCTOR - NO DEFAULTS, EXPLICIT TYPES REQUIRED:
 *
 * @param {string[]} packages - MUST be array of Python package names
 * @param {Array<FileToLoad>} filesToLoad - MUST be array of file objects
 * @param {string} workerPath - MUST be string path to worker file
 *
 * USAGE EXAMPLE:
 * const manager = new PyodideManager(
 *   ['numpy', 'pandas'],           // Array of packages
 *   ['antlr4-python3-runtime'],   // Array of micropip packages
 *   [],                           // Array filesToLoad
 *   './pyodide-worker.js' // String worker path
 * );
 *
 * NAMESPACE BEHAVIOR:
 * - No namespace: Variables persist between executions (global scope)
 * - With namespace: Variables isolated to that namespace object
 */







/** Cap on executionHistory entries (ring buffer behaviour) */
var MAX_EXECUTION_HISTORY = 50;
var PyodideManager = /*#__PURE__*/function () {
  /**
   * Create a new PyodideManager instance
   *
   * @param {string[]} packages - Array of Python package names to install
   * @param {string[]} micropipPackages - Array of Python package names to install with micropip
   * @param {Array<FileToLoad>} filesToLoad - Array of file objects to load into filesystem
   * @param {string} workerPath - Path to the bundled web worker file (must be worker-dist.js)
   * @param {Object} [config={}] - Optional configuration object
   * @param {string} [config.pyodideCdnUrl] - Custom Pyodide CDN URL (for local/offline use, e.g., Capacitor apps)
   * @throws {Error} If any parameter has incorrect type or worker is not bundled
   */
  function PyodideManager(packages, micropipPackages, filesToLoad, workerPath) {
    var config = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    manager_classCallCheck(this, PyodideManager);
    // Minimal logging - constructor called

    // Strict type validation using ValidationUtils
    validation/* ValidationUtils */.n.validatePackages(packages, 'PyodideManager');
    validation/* ValidationUtils */.n.validatePackages(micropipPackages, 'PyodideManager');
    validation/* ValidationUtils */.n.validateFilesToLoad(filesToLoad, 'PyodideManager');
    validation/* ValidationUtils */.n.validateString(workerPath, 'workerPath', 'PyodideManager');

    // Enforce bundled worker requirement
    if (!workerPath.includes('worker-dist.js')) {
      throw new Error("\uD83D\uDEA8 [PyodideManager] Only bundled workers are supported. Expected 'worker-dist.js', got: ".concat(workerPath));
    }

    /** @type {Worker|null} Web worker instance */
    this.worker = null;

    /** @type {Array<ExecutionResult>} Execution history with results and metadata */
    this.executionHistory = [];

    /** @type {boolean} Whether Pyodide is ready for execution */
    this.isReady = false;

    /** @type {string[]} Python packages to install during initialization - filtered and validated */
    this.packages = this.validateAndFilterPackages(packages);

    /** @type {string[]} Python packages to install with micropip - filtered and validated */
    this.micropipPackages = this.validateAndFilterPackages(micropipPackages);

    /** @type {Array<FileToLoad>} Files to load into Pyodide filesystem */
    this.filesToLoad = filesToLoad;

    /** @type {string} Path to the bundled web worker file */
    this.workerPath = workerPath;

    /** @type {string|undefined} Custom Pyodide CDN URL (for local/offline use) */
    this.pyodideCdnUrl = config.pyodideCdnUrl;

    /** @type {string|null} Blob URL for cleanup */
    this.blobUrl = null;

    // Initialize input state using the input module
    PyodideManagerInput.initializeInputState(this);

    /** @type {Promise<any>} Serialization chain for executeAsync calls */
    this.executionChain = Promise.resolve();

    // Initialize worker asynchronously
    this.initWorker().catch(function (error) {
      console.error("🚨 [PyodideManager] Worker initialization failed:", error);
    });
  }

  /**
   * Validate and filter Python packages
   *
   * @param {string[]} packages - Array of package names to validate
   * @returns {string[]} Validated and filtered package names
   */
  return manager_createClass(PyodideManager, [{
    key: "validateAndFilterPackages",
    value: function validateAndFilterPackages(packages) {
      var validPackages = packages.filter(function (pkg) {
        if (typeof pkg !== "string" || pkg.trim().length === 0) {
          return false;
        }
        return true;
      });
      return validPackages;
    }

    /**
     * Initialize the web worker using blob URL pattern and set up message handling
     *
     * @private
     * @returns {Promise<void>}
     * @throws {Error} If blob worker creation fails
     */
  }, {
    key: "initWorker",
    value: (function () {
      var _initWorker = manager_asyncToGenerator(/*#__PURE__*/manager_regenerator().m(function _callee() {
        var _this = this;
        var _t;
        return manager_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.p = 0;
              _context.n = 1;
              return createBlobWorkerUrl(this.workerPath);
            case 1:
              this.blobUrl = _context.v;
              // Create worker from blob URL
              this.worker = new Worker(this.blobUrl);

              // Set up message handling
              this.worker.onmessage = function (e) {
                return _this.handleMessage(e.data);
              };

              // Surface worker crashes (wasm trap, failed import, ...) as error
              // messages so pending executions reject instead of hanging forever
              this.worker.onerror = function (e) {
                _this.handleMessage({
                  type: "error",
                  message: "Worker crashed: ".concat(e.message || "unknown error")
                });
              };
              this.worker.onmessageerror = function () {
                _this.handleMessage({
                  type: "error",
                  message: "Worker message could not be deserialized"
                });
              };

              // Start initialization
              this.worker.postMessage({
                type: "init",
                packages: this.packages,
                micropipPackages: this.micropipPackages,
                filesToLoad: this.filesToLoad,
                pyodideCdnUrl: this.pyodideCdnUrl
              });
              _context.n = 3;
              break;
            case 2:
              _context.p = 2;
              _t = _context.v;
              console.error("🚨 [PyodideManager] Failed to initialize blob worker:", _t);
              throw new Error("Failed to initialize blob worker: ".concat(_t.message));
            case 3:
              return _context.a(2);
          }
        }, _callee, this, [[0, 2]]);
      }));
      function initWorker() {
        return _initWorker.apply(this, arguments);
      }
      return initWorker;
    }()
    /**
     * Handle messages from the Pyodide worker
     * Updates UI status and manages execution context
     *
     * @param {WorkerMessage} data - Message from worker
     * @returns {void}
     */
    )
  }, {
    key: "handleMessage",
    value: function handleMessage(data) {
      // Pyodide initialization complete
      if (data.type === "ready") {
        this.isReady = true;
      }

      // Pyodide initialization or execution error
      if (data.type === "error") {
        console.error("🐍 [PyodideManager] Error:", data.message || data.error || data);
      }

      // Package installation warning (non-fatal)
      if (data.type === "warning") {
        console.warn("🐍 [PyodideManager] Warning:", data.message || "Unknown warning");
      }

      // Package installation info (optimization messages) - minimized
      // if (data.type === "info") { /* minimized */ }

      // Handle input-related messages using input module
      PyodideManagerInput.handleInputMessage(this, data);

      // Python code execution completed
      if (data.type === "result") {
        PyodideManagerInput.resetInputState(this);

        // 🐍 EXECUTION RESULTS (always logged with snake emoji)
        console.log("🐍 Execution completed:", {
          stdout: data.stdout ? data.stdout.length + " chars" : "empty",
          stderr: data.stderr ? data.stderr.length + " chars" : "empty",
          missive: data.missive,
          figures: data.figures ? data.figures.length + " figures" : "none",
          bokeh_figures: data.bokeh_figures ? data.bokeh_figures.length + " bokeh figures" : "none",
          error: data.error
        });

        // Create execution entry: figures are kept out of the history (base64
        // payloads accumulate into an effective memory leak in long sessions);
        // they remain available on the result resolved by executeAsync
        var entry = {
          filename: data.filename,
          time: data.time,
          stdout: data.stdout,
          stderr: data.stderr,
          missive: data.missive,
          error: data.error,
          timestamp: new Date().toISOString()
        };
        this.executionHistory.push(entry);
        if (this.executionHistory.length > MAX_EXECUTION_HISTORY) {
          this.executionHistory.shift();
        }
      }
    }

    // Input handling methods - delegate to input module
  }, {
    key: "provideInput",
    value: function provideInput(input) {
      return PyodideManagerInput.provideInput(this, input);
    }
  }, {
    key: "queueInput",
    value: function queueInput(input) {
      return PyodideManagerInput.queueInput(this, input);
    }
  }, {
    key: "setInputCallback",
    value: function setInputCallback(callback) {
      return PyodideManagerInput.setInputCallback(this, callback);
    }
  }, {
    key: "isWaitingForInput",
    value: function isWaitingForInput() {
      return PyodideManagerInput.isWaitingForInput(this);
    }
  }, {
    key: "getCurrentPrompt",
    value: function getCurrentPrompt() {
      return PyodideManagerInput.getCurrentPrompt(this);
    }

    // Filesystem operations - delegate to filesystem module
  }, {
    key: "fs",
    value: function () {
      var _fs = manager_asyncToGenerator(/*#__PURE__*/manager_regenerator().m(function _callee2(operation, params) {
        return manager_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              return _context2.a(2, PyodideManagerFS.fs(this, operation, params));
          }
        }, _callee2, this);
      }));
      function fs(_x, _x2) {
        return _fs.apply(this, arguments);
      }
      return fs;
    }()
    /**
     * Get or set the current message handler
     *
     * @param {Function} [newHandler] - New message handler to set
     * @returns {Function} Current message handler
     */
  }, {
    key: "setHandleMessage",
    value: function setHandleMessage(newHandler) {
      if (newHandler) {
        this.handleMessage = newHandler;
      }
    }

    /**
     * Get the current message handler
     *
     * @returns {Function} Current message handler
     */
  }, {
    key: "getHandleMessage",
    value: function getHandleMessage() {
      return this.handleMessage;
    }

    /**
     * Execute Python code in the worker with optional namespace isolation
     *
     * @param {string} filename - Name for this execution (for tracking and debugging)
     * @param {string} code - Python code to execute
     * @param {Object|undefined} [namespace] - Optional namespace object for Python execution
     * @returns {void} - No return value, sends message to worker
     */
  }, {
    key: "executeFile",
    value: function executeFile(filename, code) {
      var namespace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      return PyodideManagerStaticExecutor.executeFile(this.worker, this.isReady, filename, code, namespace);
    }

    /**
     * Execute Python code asynchronously and return a Promise with the result
     *
     * @param {string} filename - Name for this execution (for tracking and debugging)
     * @param {string} code - Python code to execute
     * @param {Object|undefined} [namespace] - Optional namespace object for Python execution
     * @param {number} [timeoutMs=30000] - Execution timeout in milliseconds (raise it for interactive input() code)
     * @returns {Promise<ExecutionResult>} Promise that resolves with execution result
     * @throws {Error} If manager is not ready or execution times out
     */
  }, {
    key: "executeAsync",
    value: (function () {
      var _executeAsync = manager_asyncToGenerator(/*#__PURE__*/manager_regenerator().m(function _callee3(filename, code) {
        var _this2 = this;
        var namespace,
          timeoutMs,
          run,
          result,
          _args3 = arguments;
        return manager_regenerator().w(function (_context3) {
          while (1) switch (_context3.n) {
            case 0:
              namespace = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : undefined;
              timeoutMs = _args3.length > 3 && _args3[3] !== undefined ? _args3[3] : 30000;
              // Executions are serialized: the worker and the message interceptor in
              // PyodideManagerStaticExecutor only support one execution at a time, so
              // concurrent calls are queued instead of corrupting each other
              run = function run() {
                return PyodideManagerStaticExecutor.executeAsync(_this2.worker, _this2.isReady, _this2.executionHistory, function (handler) {
                  return _this2.setHandleMessage(handler);
                }, function () {
                  return _this2.getHandleMessage();
                }, filename, code, namespace, timeoutMs);
              };
              result = this.executionChain.then(run, run);
              this.executionChain = result.catch(function () {});
              return _context3.a(2, result);
          }
        }, _callee3, this);
      }));
      function executeAsync(_x3, _x4) {
        return _executeAsync.apply(this, arguments);
      }
      return executeAsync;
    }()
    /**
     * Clear execution history context
     *
     * @returns {void}
     */
    )
  }, {
    key: "clearExecutionHistory",
    value: function clearExecutionHistory() {
      this.executionHistory = [];
    }

    /**
     * Cleanup resources and terminate worker
     * Call this when the manager is no longer needed to prevent memory leaks
     *
     * @returns {void}
     */
  }, {
    key: "destroy",
    value: function destroy() {
      // Terminate worker
      if (this.worker) {
        this.worker.terminate();
        this.worker = null;
      }

      // Revoke blob URL to prevent memory leaks
      if (this.blobUrl) {
        URL.revokeObjectURL(this.blobUrl);
        this.blobUrl = null;
      }

      // Reset state
      this.isReady = false;
      this.executionHistory = [];
    }
  }]);
}(); // Add export at the end of the file


/**
 * @typedef {Object} FileToLoad
 * @property {string} path - Path where file should be saved in filesystem
 * @property {string} content - File content to write
 * @property {string} [encoding] - File encoding (default: 'utf8')
 */

/**
 * @typedef {Object} WorkerMessage
 * @property {'ready'|'error'|'warning'|'info'|'result'|'fs_result'|'fs_error'} type - Message type
 * @property {string} [message] - Message content
 * @property {string} [error] - Error message
 * @property {string} [filename] - Filename for execution results
 * @property {number} [time] - Execution time in milliseconds
 * @property {string} [stdout] - Standard output
 * @property {string} [stderr] - Standard error
 * @property {Object|null} [missive] - Structured data from Python
 * @property {Object|null} [error] - Execution error object
 * @property {any} [result] - Filesystem operation result
 */

/**
 * @typedef {Object} ExecutionResult
 * @property {string} filename - Name of the executed file
 * @property {number} time - Execution time in milliseconds
 * @property {string} stdout - Standard output from Python execution
 * @property {string} stderr - Standard error from Python execution
 * @property {Object|null} missive - Structured JSON data from Python
 * @property {Object|null} error - JavaScript execution error object
 * @property {string} timestamp - ISO timestamp of execution
 * @property {boolean} [executedWithNamespace] - Whether execution used namespace
 */

/***/ }),

/***/ 800:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   n: () => (/* binding */ ValidationUtils)
/* harmony export */ });
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
var ValidationUtils = /*#__PURE__*/function () {
  function ValidationUtils() {
    _classCallCheck(this, ValidationUtils);
  }
  return _createClass(ValidationUtils, null, [{
    key: "validateArray",
    value:
    /**
     * Validate that a value is an array
     * @param {any} value - Value to validate
     * @param {string} paramName - Parameter name for error messages
     * @param {string} [component] - Component name for error context
     * @throws {Error} If value is not an array
     */
    function validateArray(value, paramName) {
      var component = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Component';
      if (!Array.isArray(value)) {
        throw new Error("\uD83D\uDD27 [".concat(component, "] ").concat(paramName, " must be an array, got ").concat(_typeof(value)));
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
  }, {
    key: "validateString",
    value: function validateString(value, paramName) {
      var component = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Component';
      var allowEmpty = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      if (typeof value !== 'string') {
        throw new Error("\uD83D\uDD27 [".concat(component, "] ").concat(paramName, " must be a string, got ").concat(_typeof(value)));
      }
      if (!allowEmpty && value.trim().length === 0) {
        throw new Error("\uD83D\uDD27 [".concat(component, "] ").concat(paramName, " cannot be empty"));
      }
    }

    /**
     * Validate that a value is a boolean
     * @param {any} value - Value to validate
     * @param {string} paramName - Parameter name for error messages
     * @param {string} [component] - Component name for error context
     * @throws {Error} If value is not a boolean
     */
  }, {
    key: "validateBoolean",
    value: function validateBoolean(value, paramName) {
      var component = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Component';
      if (typeof value !== 'boolean') {
        throw new Error("\uD83D\uDD27 [".concat(component, "] ").concat(paramName, " must be a boolean, got ").concat(_typeof(value)));
      }
    }

    /**
     * Validate that a value is a function
     * @param {any} value - Value to validate
     * @param {string} paramName - Parameter name for error messages
     * @param {string} [component] - Component name for error context
     * @throws {Error} If value is not a function
     */
  }, {
    key: "validateFunction",
    value: function validateFunction(value, paramName) {
      var component = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Component';
      if (typeof value !== 'function') {
        throw new Error("\uD83D\uDD27 [".concat(component, "] ").concat(paramName, " must be a function, got ").concat(_typeof(value)));
      }
    }

    /**
     * Validate that a value is an object (not null, not array)
     * @param {any} value - Value to validate
     * @param {string} paramName - Parameter name for error messages
     * @param {string} [component] - Component name for error context
     * @throws {Error} If value is not a plain object
     */
  }, {
    key: "validateObject",
    value: function validateObject(value, paramName) {
      var component = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'Component';
      if (_typeof(value) !== 'object' || value === null || Array.isArray(value)) {
        throw new Error("\uD83D\uDD27 [".concat(component, "] ").concat(paramName, " must be a plain object, got ").concat(_typeof(value)));
      }
    }

    /**
     * Validate Worker instance
     * @param {any} worker - Worker to validate
     * @param {string} [component] - Component name for error context
     * @throws {Error} If worker is not valid
     */
  }, {
    key: "validateWorker",
    value: function validateWorker(worker) {
      var component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Component';
      if (!worker || typeof worker.postMessage !== 'function') {
        throw new Error("\uD83D\uDD27 [".concat(component, "] Invalid worker instance - missing postMessage method"));
      }
    }

    /**
     * Validate Pyodide instance
     * @param {any} pyodide - Pyodide instance to validate
     * @param {string} [component] - Component name for error context
     * @throws {Error} If pyodide is not valid
     */
  }, {
    key: "validatePyodide",
    value: function validatePyodide(pyodide) {
      var component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Component';
      if (!pyodide) {
        throw new Error("\uD83D\uDD27 [".concat(component, "] Pyodide instance is required"));
      }
      if (!pyodide.FS) {
        throw new Error("\uD83D\uDD27 [".concat(component, "] Invalid Pyodide instance - missing FS"));
      }
      if (typeof pyodide.runPython !== 'function') {
        throw new Error("\uD83D\uDD27 [".concat(component, "] Invalid Pyodide instance - missing runPython"));
      }
    }

    /**
     * Validate file objects array for FileLoader
     * @param {Array} filesToLoad - Array of file objects
     * @param {string} [component] - Component name for error context
     * @throws {Error} If any file object is invalid
     */
  }, {
    key: "validateFilesToLoad",
    value: function validateFilesToLoad(filesToLoad) {
      var component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'PyodideFileLoader';
      this.validateArray(filesToLoad, 'filesToLoad', component);
      var _iterator = _createForOfIteratorHelper(filesToLoad.entries()),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            index = _step$value[0],
            file = _step$value[1];
          if (!file || _typeof(file) !== 'object') {
            throw new Error("\uD83D\uDD27 [".concat(component, "] filesToLoad[").concat(index, "] must be an object"));
          }
          this.validateString(file.url, "filesToLoad[".concat(index, "].url"), component);
          this.validateString(file.path, "filesToLoad[".concat(index, "].path"), component);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    /**
     * Validate packages array
     * @param {Array} packages - Array of package names
     * @param {string} [component] - Component name for error context
     * @throws {Error} If packages array is invalid
     */
  }, {
    key: "validatePackages",
    value: function validatePackages(packages) {
      var component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Component';
      this.validateArray(packages, 'packages', component);
      var _iterator2 = _createForOfIteratorHelper(packages.entries()),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _step2$value = _slicedToArray(_step2.value, 2),
            index = _step2$value[0],
            pkg = _step2$value[1];
          if (typeof pkg !== 'string') {
            throw new Error("\uD83D\uDD27 [".concat(component, "] packages[").concat(index, "] must be a string, got ").concat(_typeof(pkg)));
          }
          if (pkg.trim().length === 0) {
            throw new Error("\uD83D\uDD27 [".concat(component, "] packages[").concat(index, "] cannot be empty"));
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    /**
     * Validate namespace object (optional parameter)
     * @param {any} namespace - Namespace to validate
     * @param {string} [component] - Component name for error context
     * @throws {Error} If namespace is provided but invalid
     */
  }, {
    key: "validateNamespace",
    value: function validateNamespace(namespace) {
      var component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Component';
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
  }, {
    key: "validateExecutionParams",
    value: function validateExecutionParams(filename, code, namespace) {
      var component = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'Component';
      this.validateString(filename, 'filename', component);
      this.validateString(code, 'code', component);
      this.validateNamespace(namespace, component);
    }

    /**
     * Check for potentially dangerous Python code patterns
     * @param {string} code - Python code to check
     * @returns {Array<string>} Array of dangerous patterns found
     */
  }, {
    key: "checkDangerousPatterns",
    value: function checkDangerousPatterns(code) {
      var dangerousPatterns = [{
        pattern: /import\s+os\b/g,
        reason: 'OS module access'
      }, {
        pattern: /import\s+subprocess\b/g,
        reason: 'Subprocess execution'
      }, {
        pattern: /\beval\s*\(/g,
        reason: 'Dynamic code evaluation'
      }, {
        pattern: /\bexec\s*\(/g,
        reason: 'Dynamic code execution'
      }, {
        pattern: /\b__import__\s*\(/g,
        reason: 'Dynamic module import'
      }, {
        pattern: /\bopen\s*\(/g,
        reason: 'File system access'
      }, {
        pattern: /\bcompile\s*\(/g,
        reason: 'Code compilation'
      }];
      var found = [];
      for (var _i = 0, _dangerousPatterns = dangerousPatterns; _i < _dangerousPatterns.length; _i++) {
        var _dangerousPatterns$_i = _dangerousPatterns[_i],
          pattern = _dangerousPatterns$_i.pattern,
          reason = _dangerousPatterns$_i.reason;
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
  }, {
    key: "validateBackend",
    value: function validateBackend(backend) {
      var component = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'Component';
      this.validateString(backend, 'backend', component);
      var validBackends = ['pyodide', 'brython'];
      if (!validBackends.includes(backend.toLowerCase())) {
        throw new Error("\uD83D\uDD27 [".concat(component, "] backend must be one of: ").concat(validBackends.join(', '), ", got \"").concat(backend, "\""));
      }
    }
  }]);
}();

/**
 * @typedef {Object} ValidationError
 * @property {string} message - Error message
 * @property {string} component - Component that threw the error
 * @property {string} parameter - Parameter that failed validation
 */

/***/ }),

/***/ 973:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  BrythonManager: () => (/* binding */ BrythonManager)
});

// EXTERNAL MODULE: ../../utils/validation.js
var validation = __webpack_require__(800);
;// ../../brython/manager/loader.js
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/* Loader for Brython runtime – renamed from brython-loader.js */

var _loadPromise = null;
function loadBrython() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$brythonJsPath = _ref.brythonJsPath,
    brythonJsPath = _ref$brythonJsPath === void 0 ? '/src/brython/lib/brython.js' : _ref$brythonJsPath,
    _ref$brythonStdlibPat = _ref.brythonStdlibPath,
    brythonStdlibPath = _ref$brythonStdlibPat === void 0 ? '/src/brython/lib/brython_stdlib.js' : _ref$brythonStdlibPat;
  if (typeof window === 'undefined') {
    throw new Error('Brython backend requires a browser environment');
  }
  if (_loadPromise) return _loadPromise;
  var inject = function inject(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector("script[src=\"".concat(src, "\"]"))) {
        resolve();
        return;
      }
      var s = document.createElement('script');
      s.src = src;
      s.onload = function () {
        return resolve();
      };
      s.onerror = function () {
        return reject(new Error("Failed to load ".concat(src)));
      };
      document.head.appendChild(s);
    });
  };
  _loadPromise = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!(typeof window.__BRYTHON__ === 'undefined')) {
            _context.n = 2;
            break;
          }
          _context.n = 1;
          return inject(brythonJsPath);
        case 1:
          _context.n = 2;
          return inject(brythonStdlibPath);
        case 2:
          if (typeof window.brython === 'function') {
            window.brython({
              debug: 0
            });
          }
          return _context.a(2, window.__BRYTHON__);
      }
    }, _callee);
  }))();
  return _loadPromise;
}
;// ../../brython/manager/executor.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function executor_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return executor_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (executor_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, executor_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, executor_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), executor_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", executor_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), executor_regeneratorDefine2(u), executor_regeneratorDefine2(u, o, "Generator"), executor_regeneratorDefine2(u, n, function () { return this; }), executor_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (executor_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function executor_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } executor_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { executor_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, executor_regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function executor_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function executor_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { executor_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { executor_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }


/**
 * Execute Python code with Brython, capturing stdout, stderr, missive and errors.
 *
 * The user code is embedded as a JSON-escaped string and run through
 * exec(compile(...)) inside a try/except, so the completion callback fires
 * whether the code succeeds or raises. The callback is keyed by execution id,
 * so overlapping executions cannot clobber each other.
 */
function executor_executeAsync(_x) {
  return _executeAsync.apply(this, arguments);
}
function _executeAsync() {
  _executeAsync = executor_asyncToGenerator(/*#__PURE__*/executor_regenerator().m(function _callee(code) {
    var filename,
      timeoutMs,
      _args = arguments;
    return executor_regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          filename = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'script.py';
          timeoutMs = _args.length > 2 && _args[2] !== undefined ? _args[2] : 30000;
          _context.n = 1;
          return loadBrython();
        case 1:
          return _context.a(2, new Promise(function (resolve, reject) {
            var start = performance.now();
            var suffix = "".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2));
            var id = "__brython_exec_".concat(suffix);
            var cbName = "__brython_cb_".concat(suffix);
            var cleanup = function cleanup() {
              clearTimeout(timeoutId);
              var el = document.getElementById(id);
              if (el) el.remove();
              delete window[cbName];
            };
            var timeoutId = setTimeout(function () {
              cleanup();
              reject(new Error("\uD83D\uDC0D [BrythonManager] Execution timeout after ".concat(timeoutMs / 1000, " seconds")));
            }, timeoutMs);
            window[cbName] = function (payload) {
              var end = performance.now();
              cleanup();
              resolve(_objectSpread({
                filename: filename,
                time: end - start
              }, payload));
            };

            // JSON string literals are valid Python string literals
            var codeJson = JSON.stringify(code);
            var filenameJson = JSON.stringify(filename);
            var wrapped = "\nimport sys\nimport traceback\nfrom browser import window\n\n_stdout_buf, _stderr_buf = [], []\n\nclass _Stdout:\n    def write(self, data):\n        _stdout_buf.append(str(data))\n    def flush(self):\n        pass\n\nclass _Stderr:\n    def write(self, data):\n        _stderr_buf.append(str(data))\n    def flush(self):\n        pass\n\nsys.stdout = _Stdout()\nsys.stderr = _Stderr()\n\n_missive_value = None\n\ndef missive(obj):\n    global _missive_value\n    if _missive_value is not None:\n        raise ValueError('missive() can only be called once')\n    _missive_value = obj\n\n_error = None\ntry:\n    exec(compile(".concat(codeJson, ", ").concat(filenameJson, ", 'exec'), globals())\nexcept BaseException as _exc:\n    _error = {\n        'type': type(_exc).__name__,\n        'message': str(_exc),\n        'traceback': traceback.format_exc()\n    }\n    _stderr_buf.append(traceback.format_exc())\n\nwindow.").concat(cbName, "({\n    'stdout': ''.join(_stdout_buf),\n    'stderr': ''.join(_stderr_buf),\n    'missive': _missive_value,\n    'error': _error\n})\n");
            var script = document.createElement('script');
            script.type = 'text/python3';
            script.id = id;
            script.textContent = wrapped;
            document.body.appendChild(script);
            if (typeof window.brython === 'function') {
              window.brython();
            } else {
              cleanup();
              reject(new Error('Brython runtime not initialised'));
            }
          }));
      }
    }, _callee);
  }));
  return _executeAsync.apply(this, arguments);
}
;// ../../brython/manager/manager.js
function manager_typeof(o) { "@babel/helpers - typeof"; return manager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, manager_typeof(o); }
function manager_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return manager_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (manager_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, manager_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, manager_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), manager_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", manager_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), manager_regeneratorDefine2(u), manager_regeneratorDefine2(u, o, "Generator"), manager_regeneratorDefine2(u, n, function () { return this; }), manager_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (manager_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function manager_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } manager_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { manager_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, manager_regeneratorDefine2(e, r, n, t); }
function manager_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function manager_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { manager_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { manager_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, manager_toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function manager_toPropertyKey(t) { var i = manager_toPrimitive(t, "string"); return "symbol" == manager_typeof(i) ? i : i + ""; }
function manager_toPrimitive(t, r) { if ("object" != manager_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != manager_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }




/**
 * BrythonManager – Minimal backend for Nagini focused on turtle graphics.
 * Provides the same public surface as PyodideManager but runs directly in
 * the main thread with Brython.  Input(), packages, and filesystem are NOT
 * supported for now.
 */
var BrythonManager = /*#__PURE__*/function () {
  function BrythonManager() {
    var _this = this;
    var packages = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var filesToLoad = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var initPath = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var workerPath = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var brythonOptions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
    _classCallCheck(this, BrythonManager);
    console.log('🐍 [BrythonManager] constructor');

    // Same validation contract as PyodideManager: invalid input throws
    validation/* ValidationUtils */.n.validateArray(packages, 'packages', 'BrythonManager');
    validation/* ValidationUtils */.n.validateArray(filesToLoad, 'filesToLoad', 'BrythonManager');
    this.packages = packages;
    this.filesToLoad = filesToLoad; // Store filesToLoad for API parity

    console.log('🐍 [BrythonManager] filesToLoad set to:', this.filesToLoad);
    console.log('🐍 [BrythonManager] packages set to:', this.packages);
    this.executionHistory = [];
    this.isReady = false;

    // Begin loading Brython runtime immediately with optional configuration
    this._readyPromise = loadBrython(brythonOptions).then(function () {
      _this.isReady = true;
      console.log('🐍 [BrythonManager] ready');
    });
  }

  // ------------------ Execution APIs ------------------
  return _createClass(BrythonManager, [{
    key: "executeAsync",
    value: function () {
      var _executeAsync2 = manager_asyncToGenerator(/*#__PURE__*/manager_regenerator().m(function _callee(filename, code) {
        var _raw$missive, _raw$error;
        var namespace,
          timeoutMs,
          raw,
          result,
          _args = arguments;
        return manager_regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              namespace = _args.length > 2 && _args[2] !== undefined ? _args[2] : undefined;
              timeoutMs = _args.length > 3 && _args[3] !== undefined ? _args[3] : 30000;
              if (this.isReady) {
                _context.n = 1;
                break;
              }
              _context.n = 1;
              return this._readyPromise;
            case 1:
              validation/* ValidationUtils */.n.validateExecutionParams(filename, code, undefined, 'BrythonManager');
              _context.n = 2;
              return executor_executeAsync(code, filename, timeoutMs);
            case 2:
              raw = _context.v;
              result = {
                filename: filename,
                time: raw.time,
                stdout: raw.stdout || '',
                stderr: raw.stderr || '',
                missive: (_raw$missive = raw.missive) !== null && _raw$missive !== void 0 ? _raw$missive : null,
                figures: [],
                // turtle draws directly to canvas
                error: (_raw$error = raw.error) !== null && _raw$error !== void 0 ? _raw$error : null,
                timestamp: new Date().toISOString()
              };
              this.executionHistory.push(result);
              return _context.a(2, result);
          }
        }, _callee, this);
      }));
      function executeAsync(_x, _x2) {
        return _executeAsync2.apply(this, arguments);
      }
      return executeAsync;
    }()
  }, {
    key: "executeFile",
    value: function executeFile(filename, code) {
      var namespace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      this.executeAsync(filename, code, namespace).catch(console.error);
    }

    // ------------------ Unsupported stubs ------------------
  }, {
    key: "fs",
    value: function () {
      var _fs = manager_asyncToGenerator(/*#__PURE__*/manager_regenerator().m(function _callee2() {
        return manager_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              throw new Error('Brython backend does not support filesystem operations');
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      function fs() {
        return _fs.apply(this, arguments);
      }
      return fs;
    }()
  }, {
    key: "queueInput",
    value: function queueInput() {
      console.warn('Brython backend: input() not supported');
    }
  }, {
    key: "provideInput",
    value: function provideInput() {
      console.warn('Brython backend: input() not supported');
    }
  }, {
    key: "setInputCallback",
    value: function setInputCallback() {
      console.warn('Brython backend: input() not supported');
    }
  }, {
    key: "isWaitingForInput",
    value: function isWaitingForInput() {
      return false;
    }
  }, {
    key: "getCurrentPrompt",
    value: function getCurrentPrompt() {
      return null;
    }
  }, {
    key: "clearExecutionHistory",
    value: function clearExecutionHistory() {
      this.executionHistory = [];
    }
  }]);
}();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Nagini: () => (/* binding */ Nagini)
/* harmony export */ });
/* harmony import */ var _utils_validation_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(800);
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Nagini - Python-in-Browser Runtime Manager
 *
 * This file provides a higher-level API with useful convenience methods
 * for managing Python execution in the browser using different backends
 * (Pyodide, <?> etc.).
 */



// Export Nagini as ES module
var Nagini = {
  /**
   * Create a new manager instance with specified backend
   * @param {string} [backend='pyodide'] - Backend to use ('pyodide' or 'brython')
   * @param {string[]} packages - Python packages to install
   * @param {string[]} micropipPackages - Python packages to install with micropip
   * @param {Array} filesToLoad - Custom files to load into filesystem
   *                              Array of objects with {url, path} properties
   *                              Supports both local paths and remote URLs (S3, etc.)
   * @param {string} workerPath - Path to the bundled web worker file (must be worker-dist.js)
   * @param {Object} [options={}] - Backend-specific options
   * @param {string} [options.pyodideCdnUrl] - Custom Pyodide CDN URL (for local/offline use, e.g., Capacitor apps)
   * @param {string} [options.brythonJsPath] - Path to Brython JS file (Brython backend only)
   * @param {string} [options.brythonStdlibPath] - Path to Brython stdlib (Brython backend only)
   * @returns {Manager} New manager instance
   */
  createManager: function () {
    var _createManager = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var backend,
        packages,
        micropipPackages,
        filesToLoad,
        workerPath,
        options,
        finalWorkerPath,
        _yield$import,
        PyodideManager,
        pyodideConfig,
        _yield$import2,
        BrythonManager,
        _args = arguments;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            backend = _args.length > 0 && _args[0] !== undefined ? _args[0] : 'pyodide';
            packages = _args.length > 1 ? _args[1] : undefined;
            micropipPackages = _args.length > 2 ? _args[2] : undefined;
            filesToLoad = _args.length > 3 ? _args[3] : undefined;
            workerPath = _args.length > 4 ? _args[4] : undefined;
            options = _args.length > 5 && _args[5] !== undefined ? _args[5] : {};
            // Validate backend parameter
            _utils_validation_js__WEBPACK_IMPORTED_MODULE_0__/* .ValidationUtils */ .n.validateBackend(backend, 'Nagini');
            if (!(backend.toLowerCase() === 'pyodide')) {
              _context.n = 4;
              break;
            }
            // Enforce bundled worker usage for Pyodide (cross-origin compatibility)
            finalWorkerPath = workerPath;
            if (workerPath.includes('worker-dist.js')) {
              _context.n = 2;
              break;
            }
            if (!workerPath.includes('worker.js')) {
              _context.n = 1;
              break;
            }
            finalWorkerPath = workerPath.replace('worker.js', 'worker-dist.js');
            console.warn("\uD83D\uDC0D [Nagini] Auto-converted to bundled worker: ".concat(finalWorkerPath));
            console.warn("\uD83D\uDC0D [Nagini] Only bundled workers are supported for cross-origin compatibility.");
            console.warn("\uD83D\uDC0D [Nagini] Please update your code to use worker-dist.js directly.");
            _context.n = 2;
            break;
          case 1:
            throw new Error("\uD83D\uDC0D [Nagini] Only bundled workers are supported for Pyodide. Expected 'worker-dist.js', got: ".concat(workerPath, ". Please build the worker first with 'npm run build' in the worker directory."));
          case 2:
            _context.n = 3;
            return Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 586));
          case 3:
            _yield$import = _context.v;
            PyodideManager = _yield$import.PyodideManager;
            // Extract Pyodide-specific config options
            pyodideConfig = {
              pyodideCdnUrl: options.pyodideCdnUrl
            };
            return _context.a(2, new PyodideManager(packages, micropipPackages, filesToLoad, finalWorkerPath, pyodideConfig));
          case 4:
            if (!(backend.toLowerCase() === 'brython')) {
              _context.n = 6;
              break;
            }
            _context.n = 5;
            return Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 973));
          case 5:
            _yield$import2 = _context.v;
            BrythonManager = _yield$import2.BrythonManager;
            return _context.a(2, new BrythonManager(packages, filesToLoad, '', workerPath, options));
          case 6:
            throw new Error("\uD83D\uDC0D [Nagini] ".concat(backend, " backend not yet implemented"));
          case 7:
            return _context.a(2);
        }
      }, _callee);
    }));
    function createManager() {
      return _createManager.apply(this, arguments);
    }
    return createManager;
  }(),
  /**
   * Wait for a manager to be ready for execution
   * @param {Manager} manager - Manager instance to wait for
   * @param {number} [timeout] - Timeout in milliseconds (default: 30000)
   * @returns {Promise<void>} Resolves when manager is ready
   */
  waitForReady: function () {
    var _waitForReady = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(manager) {
      var timeout,
        startTime,
        _args2 = arguments;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            timeout = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : 30000;
            startTime = Date.now();
          case 1:
            if (manager.isReady) {
              _context2.n = 4;
              break;
            }
            if (!(Date.now() - startTime > timeout)) {
              _context2.n = 2;
              break;
            }
            throw new Error("\uD83D\uDC0D [Nagini] Manager initialization timeout after ".concat(timeout, "ms"));
          case 2:
            _context2.n = 3;
            return new Promise(function (resolve) {
              return setTimeout(resolve, 100);
            });
          case 3:
            _context2.n = 1;
            break;
          case 4:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    function waitForReady(_x) {
      return _waitForReady.apply(this, arguments);
    }
    return waitForReady;
  }(),
  /**
   * Execute Python code from a URL
   * @param {string} url - URL to fetch Python code from
   * @param {Manager} manager - Manager instance to use
   * @param {Object} [namespace] - Optional namespace for execution
   * @returns {Promise<Object>} Execution result
   */
  executeFromUrl: function () {
    var _executeFromUrl = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(url, manager) {
      var namespace,
        response,
        code,
        filename,
        _args3 = arguments;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            namespace = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : undefined;
            if (manager.isReady) {
              _context3.n = 1;
              break;
            }
            throw new Error("🐍 [Nagini] Manager not ready. Call Nagini.waitForReady() first.");
          case 1:
            _context3.n = 2;
            return fetch(url);
          case 2:
            response = _context3.v;
            if (response.ok) {
              _context3.n = 3;
              break;
            }
            throw new Error("\uD83D\uDC0D [Nagini] Failed to fetch ".concat(url, ": HTTP ").concat(response.status));
          case 3:
            _context3.n = 4;
            return response.text();
          case 4:
            code = _context3.v;
            filename = url.split("/").pop() || "unknown.py";
            return _context3.a(2, manager.executeAsync(filename, code, namespace));
        }
      }, _callee3);
    }));
    function executeFromUrl(_x2, _x3) {
      return _executeFromUrl.apply(this, arguments);
    }
    return executeFromUrl;
  }(),
  /**
   * Get list of supported backends
   * @returns {string[]} Array of supported backend names
   */
  getSupportedBackends: function getSupportedBackends() {
    return ['pyodide', 'brython'];
  },
  /**
   * Check if a backend is supported
   * @param {string} backend - Backend name to check
   * @returns {boolean} True if backend is supported
   */
  isBackendSupported: function isBackendSupported(backend) {
    return Nagini.getSupportedBackends().includes(backend.toLowerCase());
  }
};
__webpack_exports__ = __webpack_exports__.Nagini;
/******/ 	return __webpack_exports__;
/******/ })()
;
});