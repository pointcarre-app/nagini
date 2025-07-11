/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// ./worker-config.js
/**
 * PyodideWorker Configuration
 *
 * Centralized configuration constants and messages for the pyodide worker
 * Extracted from the main worker file to improve maintainability
 */

/**
 * Configuration object containing all constants and messages
 * @type {WorkerConfig}
 */
var worker_config_PYODIDE_WORKER_CONFIG = {
  /**
   * Pyodide CDN URL for loading runtime
   * @type {string}
   */
  PYODIDE_CDN: "https://cdn.jsdelivr.net/pyodide/v0.27.7/full/",
  /**
   * Centralized messages for consistent error reporting and logging
   * @type {WorkerMessages}
   */
  MESSAGES: {
    // Error messages
    /** @type {string} */
    INVALID_MESSAGE: "Invalid message format: expected object with 'type' property",
    /** @type {string} */
    INVALID_TYPE: "Invalid message type: expected non-empty string",
    /** @type {string} */
    UNKNOWN_TYPE: "Unknown message type",
    /** @type {string} */
    ALREADY_INITIALIZED: "Worker already initialized",
    /** @type {string} */
    NOT_INITIALIZED: "Worker not initialized. Call init() first.",
    /** @type {string} */
    INIT_FAILED: "Failed to initialize Pyodide",
    /** @type {string} */
    FETCH_FAILED: "Failed to fetch initialization script",
    /** @type {string} */
    FS_NOT_INITIALIZED: "Filesystem not available - worker not initialized",
    // Package loading messages
    /** @type {string} */
    PACKAGE_CHECK: "Checking packages to load:",
    /** @type {string} */
    PACKAGE_SKIP: "Skipping already loaded packages:",
    /** @type {string} */
    PACKAGE_INSTALL: "Installing packages:",
    /** @type {string} */
    PACKAGE_LOADED: "All loaded packages:",
    /** @type {string} */
    PACKAGE_FAILED: "Package loading failed:",
    /** @type {string} */
    PACKAGE_WARNING: "Package loading warning:",
    /** @type {string} */
    ALL_LOADED: "All packages already loaded",
    // Smart loading messages
    /** @type {string} */
    SMART_LOADING: "Smart loading: Skipping",
    /** @type {string} */
    SMART_SUCCESS: "Smart loading: Successfully loaded",
    // Execution messages
    /** @type {string} */
    EXEC_NAMESPACE: "Executing Python code with namespace",
    /** @type {string} */
    EXEC_GLOBAL: "Executing Python code in global scope",
    // Output capture messages
    /** @type {string} */
    INVALID_MISSIVE: "Invalid missive JSON:",
    /** @type {string} */
    OUTPUT_FAILED: "Failed to capture outputs:",
    /** @type {string} */
    OUTPUT_RETRIEVAL_FAILED: "Output retrieval failed"
  }
};


/**
 * @typedef {Object} WorkerConfig
 * @property {string} PYODIDE_CDN - CDN URL for Pyodide runtime
 * @property {WorkerMessages} MESSAGES - Centralized messages object
 */

/**
 * @typedef {Object} WorkerMessages
 * @property {string} INVALID_MESSAGE - Invalid message format error
 * @property {string} INVALID_TYPE - Invalid message type error
 * @property {string} UNKNOWN_TYPE - Unknown message type error
 * @property {string} ALREADY_INITIALIZED - Already initialized error
 * @property {string} NOT_INITIALIZED - Not initialized error
 * @property {string} INIT_FAILED - Initialization failed error
 * @property {string} FETCH_FAILED - Fetch failed error
 * @property {string} FS_NOT_INITIALIZED - Filesystem not initialized error
 * @property {string} PACKAGE_CHECK - Package checking message
 * @property {string} PACKAGE_SKIP - Package skipping message
 * @property {string} PACKAGE_INSTALL - Package installation message
 * @property {string} PACKAGE_LOADED - Package loaded message
 * @property {string} PACKAGE_FAILED - Package loading failed message
 * @property {string} PACKAGE_WARNING - Package warning message
 * @property {string} ALL_LOADED - All packages loaded message
 * @property {string} SMART_LOADING - Smart loading skip message
 * @property {string} SMART_SUCCESS - Smart loading success message
 * @property {string} EXEC_NAMESPACE - Namespace execution message
 * @property {string} EXEC_GLOBAL - Global execution message
 * @property {string} INVALID_MISSIVE - Invalid missive JSON error
 * @property {string} OUTPUT_FAILED - Output capture failed error
 * @property {string} OUTPUT_RETRIEVAL_FAILED - Output retrieval failed error
 */
;// ./worker-execution.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * PyodideWorker Execution Module
 *
 * Handles Python code execution, transformation, and output capture
 * for the Pyodide worker environment.
 */



/**
 * Handle Python code execution
 * Executes Python code with optional namespace isolation and captures outputs
 *
 * @param {ExecuteMessage} data - Execution message data
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Promise<void>}
 */
function handleExecute(_x, _x2) {
  return _handleExecute.apply(this, arguments);
}

/**
 * Transform code for execution, handling input() calls if present
 * @param {string} code - The original Python code
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Object} - {code: transformedCode, needsAsync: boolean}
 */
function _handleExecute() {
  _handleExecute = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(data, workerState) {
    var code, filename, namespace, start, stdout, stderr, missive, figures, error, result, originalValues, keysToRestore, _i, _Object$entries, _Object$entries$_i, key, value, _i2, _keysToRestore, _key, _captureOutputs, _captureOutputs2, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (validateInitialized(workerState)) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          code = data.code, filename = data.filename, namespace = data.namespace;
          start = Date.now();
          stdout = "", stderr = "", missive = null, figures = [], error = null;
          _context.p = 2;
          console.log("🔧 [Worker] Starting execution for", filename);

          // Transform code for async execution if needed
          result = transformCodeForExecution(code, workerState);
          console.log("🔧 [Worker] Code transformed, needsAsync:", result.needsAsync);
          console.log("🔧 [Worker] Transformed code length:", result.code.length);

          // LOG THE ACTUAL TRANSFORMED CODE
          console.log("🔧 [Worker] ACTUAL TRANSFORMED CODE:");
          console.log("=".repeat(50));
          console.log(result.code);
          console.log("=".repeat(50));
          workerState.pyodide.runPython("reset_captures()");

          // Execute with or without namespace
          if (!(namespace !== undefined)) {
            _context.n = 8;
            break;
          }
          console.log(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.EXEC_NAMESPACE);
          console.log("🔧 [Worker] Namespace variables:", Object.keys(namespace));

          // Store original values to restore later
          originalValues = {};
          keysToRestore = []; // Temporarily set namespace variables
          for (_i = 0, _Object$entries = Object.entries(namespace); _i < _Object$entries.length; _i++) {
            _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], value = _Object$entries$_i[1];
            // Store original value if it exists
            if (workerState.pyodide.globals.has(key)) {
              originalValues[key] = workerState.pyodide.globals.get(key);
              keysToRestore.push(key);
            } else {
              keysToRestore.push(key);
            }
            workerState.pyodide.globals.set(key, value);
            console.log("\uD83D\uDD27 [Worker] Set ".concat(key, " = ").concat(value));
          }
          _context.p = 3;
          if (!result.needsAsync) {
            _context.n = 5;
            break;
          }
          console.log("🔧 [Worker] Running async with namespace");
          _context.n = 4;
          return workerState.pyodide.runPythonAsync(result.code);
        case 4:
          _context.n = 6;
          break;
        case 5:
          workerState.pyodide.runPython(result.code);
        case 6:
          _context.p = 6;
          // Clean up namespace variables
          for (_i2 = 0, _keysToRestore = keysToRestore; _i2 < _keysToRestore.length; _i2++) {
            _key = _keysToRestore[_i2];
            if (originalValues.hasOwnProperty(_key)) {
              // Restore original value
              workerState.pyodide.globals.set(_key, originalValues[_key]);
              console.log("\uD83D\uDD27 [Worker] Restored ".concat(_key, " to original value"));
            } else {
              // Delete the variable we added
              workerState.pyodide.globals.delete(_key);
              console.log("\uD83D\uDD27 [Worker] Removed ".concat(_key, " from globals"));
            }
          }
          return _context.f(6);
        case 7:
          _context.n = 11;
          break;
        case 8:
          console.log(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.EXEC_GLOBAL);
          if (!result.needsAsync) {
            _context.n = 10;
            break;
          }
          console.log("🔧 [Worker] Running async in global scope");
          _context.n = 9;
          return workerState.pyodide.runPythonAsync(result.code);
        case 9:
          _context.n = 11;
          break;
        case 10:
          workerState.pyodide.runPython(result.code);
        case 11:
          console.log("🔧 [Worker] Execution completed, capturing outputs");
          _captureOutputs = captureOutputs(workerState.pyodide);
          stdout = _captureOutputs.stdout;
          stderr = _captureOutputs.stderr;
          missive = _captureOutputs.missive;
          figures = _captureOutputs.figures;
          console.log("🔧 [Worker] Captured outputs - stdout:", stdout.length, "stderr:", stderr.length, "missive:", missive, "figures:", figures.length);
          _context.n = 13;
          break;
        case 12:
          _context.p = 12;
          _t = _context.v;
          console.error("🔧 [Worker] Execution error:", _t);
          error = {
            name: _t.name || "PythonError",
            message: _t.message || "Unknown execution error"
          };
          _captureOutputs2 = captureOutputs(workerState.pyodide, true);
          stdout = _captureOutputs2.stdout;
          stderr = _captureOutputs2.stderr;
          figures = _captureOutputs2.figures;
        case 13:
          console.log("🔧 [Worker] Posting result");
          postResult({
            filename: filename,
            stdout: stdout,
            stderr: stderr,
            missive: missive,
            figures: figures,
            error: error,
            time: Date.now() - start,
            executedWithNamespace: namespace !== undefined
          });
        case 14:
          return _context.a(2);
      }
    }, _callee, null, [[3,, 6, 7], [2, 12]]);
  }));
  return _handleExecute.apply(this, arguments);
}
function transformCodeForExecution(code, workerState) {
  var needsAsync = code.includes('input(');
  if (needsAsync) {
    // Transform the code using Python transformation
    var transformedCode = workerState.pyodide.runPython("transform_code_for_execution(".concat(JSON.stringify(code), ")"));
    return {
      code: transformedCode,
      needsAsync: true
    };
  } else {
    // Return original code as-is
    return {
      code: code,
      needsAsync: false
    };
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
function captureOutputs(pyodide) {
  var isErrorCase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var stdout = "",
    stderr = "",
    missive = null,
    figures = [];
  try {
    stdout = pyodide.runPython("get_stdout()") || "";
    stderr = pyodide.runPython("get_stderr()") || "";
    if (!isErrorCase) {
      var missiveJson = pyodide.runPython("get_missive()");
      if (missiveJson) {
        // Keep as string - get_missive() already returns JSON string via json.dumps()
        missive = missiveJson;
      }

      // Capture matplotlib figures
      try {
        var figuresResult = pyodide.runPython("get_figures()");
        if (figuresResult && figuresResult.toJs) {
          figures = figuresResult.toJs();
        } else if (Array.isArray(figuresResult)) {
          figures = figuresResult;
        }
      } catch (e) {
        console.warn("Failed to capture matplotlib figures:", e.message);
      }
    }
  } catch (err) {
    console.warn(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.OUTPUT_FAILED, err.message);
    if (isErrorCase) stderr = "".concat(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.OUTPUT_RETRIEVAL_FAILED, ": ").concat(err.message);
  }
  return {
    stdout: stdout,
    stderr: stderr,
    missive: missive,
    figures: figures
  };
}

// Helper functions for messaging
var postResult = function postResult(data) {
  return self.postMessage(_objectSpread({
    type: "result"
  }, data));
};
var postError = function postError(message) {
  return self.postMessage({
    type: "error",
    message: "\uD83D\uDD27 [Worker] ".concat(message)
  });
};

/**
 * Validate that worker is properly initialized
 * @param {WorkerState} workerState - Current worker state
 * @returns {boolean} True if initialized, false otherwise
 */
function validateInitialized(workerState) {
  if (!workerState.isInitialized || !workerState.pyodide) {
    postError(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.NOT_INITIALIZED);
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
;// ./worker-input.js
function worker_input_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return worker_input_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (worker_input_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, worker_input_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, worker_input_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), worker_input_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", worker_input_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), worker_input_regeneratorDefine2(u), worker_input_regeneratorDefine2(u, o, "Generator"), worker_input_regeneratorDefine2(u, n, function () { return this; }), worker_input_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (worker_input_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function worker_input_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } worker_input_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { worker_input_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, worker_input_regeneratorDefine2(e, r, n, t); }
function worker_input_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function worker_input_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { worker_input_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { worker_input_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * PyodideWorker Input Module
 *
 * Handles input requests and responses in the Pyodide worker environment.
 */



/**
 * Set up input handling system in Python environment
 * Based on the successful implementation from the other repo
 *
 * @param {PyodideAPI} pyodide - Pyodide instance
 * @returns {Promise<void>}
 */
function setupInputHandling(_x) {
  return _setupInputHandling.apply(this, arguments);
}

/**
 * Handle input response from main thread
 * Provides user input to Python code that's waiting for input
 *
 * @param {InputResponseMessage} data - Input response message data
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Promise<void>}
 */
function _setupInputHandling() {
  _setupInputHandling = worker_input_asyncToGenerator(/*#__PURE__*/worker_input_regenerator().m(function _callee2(pyodide) {
    return worker_input_regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          // Create the requestInput function in the worker's global scope
          self.requestInput = /*#__PURE__*/worker_input_asyncToGenerator(/*#__PURE__*/worker_input_regenerator().m(function _callee() {
            var prompt,
              _args = arguments;
            return worker_input_regenerator().w(function (_context) {
              while (1) switch (_context.n) {
                case 0:
                  prompt = _args.length > 0 && _args[0] !== undefined ? _args[0] : "";
                  console.log("\uD83D\uDD27 [Worker] Input requested with prompt: \"".concat(prompt, "\""));

                  // Send input request to main thread
                  self.postMessage({
                    type: "input_required",
                    prompt: prompt
                  });

                  // Return a promise that will be resolved when input is received
                  return _context.a(2, new Promise(function (resolve) {
                    console.log("🔧 [Worker] Waiting for input from main thread...");
                    self.pendingInputResolver = resolve;
                  }));
              }
            }, _callee);
          }));

          // Set up the Python environment with input handling
          _context2.n = 1;
          return pyodide.runPythonAsync("\nimport asyncio\nimport builtins\nimport sys\nfrom js import requestInput\n\n# Set up input handling\nasync def input_handler(prompt=\"\"):\n    # Always print the prompt to stdout first\n    if prompt:\n        print(prompt, end=\"\", flush=True)\n        sys.stdout.flush()  # Make sure it's flushed\n\n    # Request input from JavaScript\n    user_input = await requestInput(prompt)\n    return user_input\n\n# Replace the built-in input function with our async version\nbuiltins.input = input_handler\n\nprint(\"\uD83D\uDC0D Python: Input handling system set up successfully\")\n");
        case 1:
          return _context2.a(2);
      }
    }, _callee2);
  }));
  return _setupInputHandling.apply(this, arguments);
}
function handleInputResponse(_x2, _x3) {
  return _handleInputResponse.apply(this, arguments);
}

// Helper functions
function _handleInputResponse() {
  _handleInputResponse = worker_input_asyncToGenerator(/*#__PURE__*/worker_input_regenerator().m(function _callee3(data, workerState) {
    var input;
    return worker_input_regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          if (worker_input_validateInitialized(workerState)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2);
        case 1:
          input = data.input;
          try {
            console.log("🔧 [Worker] Handling input response:", input);

            // Resolve the pending input promise if it exists
            if (self.pendingInputResolver) {
              console.log("🔧 [Worker] Resolving pending input promise");
              self.pendingInputResolver(input);
              self.pendingInputResolver = null;
            } else {
              console.warn("🔧 [Worker] No pending input resolver found");
            }
          } catch (err) {
            console.error("🔧 [Worker] Failed to provide input:", err);
            worker_input_postError("Failed to provide input: ".concat(err.message));
          }
        case 2:
          return _context3.a(2);
      }
    }, _callee3);
  }));
  return _handleInputResponse.apply(this, arguments);
}
var worker_input_postError = function postError(message) {
  return self.postMessage({
    type: "error",
    message: "\uD83D\uDD27 [Worker] ".concat(message)
  });
};

/**
 * Validate that worker is properly initialized
 * @param {WorkerState} workerState - Current worker state
 * @returns {boolean} True if initialized, false otherwise
 */
function worker_input_validateInitialized(workerState) {
  if (!workerState.isInitialized || !workerState.pyodide) {
    worker_input_postError(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.NOT_INITIALIZED);
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
;// ./worker-fs.js
function worker_fs_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return worker_fs_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (worker_fs_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, worker_fs_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, worker_fs_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), worker_fs_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", worker_fs_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), worker_fs_regeneratorDefine2(u), worker_fs_regeneratorDefine2(u, o, "Generator"), worker_fs_regeneratorDefine2(u, n, function () { return this; }), worker_fs_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (worker_fs_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function worker_fs_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } worker_fs_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { worker_fs_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, worker_fs_regeneratorDefine2(e, r, n, t); }
function worker_fs_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function worker_fs_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { worker_fs_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { worker_fs_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * PyodideWorker Filesystem Module
 *
 * Handles filesystem operations and package loading in the Pyodide worker environment.
 */



/**
 * Handle filesystem operations
 * Processes filesystem commands like read, write, mkdir, exists, listdir
 *
 * @param {FSOperationMessage} data - Filesystem operation message data
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Promise<void>}
 */
function handleFSOperation(_x, _x2) {
  return _handleFSOperation.apply(this, arguments);
}

/**
 * Execute filesystem operation
 * Handles all filesystem operations (read, write, mkdir, exists, listdir)
 *
 * @param {FSOperationMessage} data - Filesystem operation data
 * @param {PyodideAPI} pyodide - Pyodide instance
 * @returns {FSOperationResult} Result of the filesystem operation
 * @throws {Error} If operation is unknown or fails
 */
function _handleFSOperation() {
  _handleFSOperation = worker_fs_asyncToGenerator(/*#__PURE__*/worker_fs_regenerator().m(function _callee(data, workerState) {
    var result;
    return worker_fs_regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!(!workerState.isInitialized || !workerState.pyodide)) {
            _context.n = 1;
            break;
          }
          postFSError(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.FS_NOT_INITIALIZED);
          return _context.a(2);
        case 1:
          try {
            result = executeFS(data, workerState.pyodide);
            self.postMessage({
              type: "fs_result",
              result: result
            });
          } catch (error) {
            postFSError(error.message);
          }
        case 2:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _handleFSOperation.apply(this, arguments);
}
function executeFS(data, pyodide) {
  var operation = data.operation,
    path = data.path,
    content = data.content;
  var ops = {
    writeFile: function writeFile() {
      // Ensure directory exists
      var dir = path.split('/').slice(0, -1).join('/');
      if (dir && !pyodide.FS.analyzePath(dir).exists) {
        try {
          pyodide.FS.mkdir(dir);
        } catch (e) {/* ignore */}
      }
      pyodide.FS.writeFile(path, content);
      return {
        success: true
      };
    },
    readFile: function readFile() {
      return {
        content: pyodide.FS.readFile(path, {
          encoding: 'utf8'
        })
      };
    },
    mkdir: function mkdir() {
      pyodide.FS.mkdir(path);
      return {
        success: true
      };
    },
    exists: function exists() {
      return {
        exists: pyodide.FS.analyzePath(path).exists
      };
    },
    listdir: function listdir() {
      return {
        files: pyodide.FS.readdir(path)
      };
    }
  };
  var op = ops[operation];
  if (!op) throw new Error("Unknown FS operation: ".concat(operation));
  return op();
}

/**
 * Load packages with smart loading logic
 * Prevents duplicate package installations and provides progress feedback
 *
 * @param {string[]} packages - Array of package names to load
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Promise<void>}
 */
function loadPackages(_x3, _x4) {
  return _loadPackages.apply(this, arguments);
}

// Helper functions for messaging
function _loadPackages() {
  _loadPackages = worker_fs_asyncToGenerator(/*#__PURE__*/worker_fs_regenerator().m(function _callee2(packages, workerState) {
    var toLoad, loaded, _t;
    return worker_fs_regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          toLoad = packages.filter(function (pkg) {
            return !workerState.packagesLoaded.has(pkg);
          });
          loaded = packages.filter(function (pkg) {
            return workerState.packagesLoaded.has(pkg);
          });
          if (loaded.length > 0) {
            postInfo("".concat(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.SMART_LOADING, " ").concat(loaded.length, " already loaded: ").concat(loaded.join(", ")));
          }
          if (!(toLoad.length > 0)) {
            _context2.n = 4;
            break;
          }
          _context2.p = 1;
          _context2.n = 2;
          return workerState.pyodide.loadPackage(toLoad);
        case 2:
          toLoad.forEach(function (pkg) {
            return workerState.packagesLoaded.add(pkg);
          });
          postInfo("".concat(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.SMART_SUCCESS, " ").concat(toLoad.length, " new packages: ").concat(toLoad.join(", ")));
          _context2.n = 4;
          break;
        case 3:
          _context2.p = 3;
          _t = _context2.v;
          postWarning("".concat(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.PACKAGE_WARNING, " ").concat(_t.message));
        case 4:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 3]]);
  }));
  return _loadPackages.apply(this, arguments);
}
var postFSError = function postFSError(error) {
  return self.postMessage({
    type: "fs_error",
    error: "\uD83D\uDD27 [Worker] ".concat(error)
  });
};
var postInfo = function postInfo(message) {
  return self.postMessage({
    type: "info",
    message: "\uD83D\uDD27 [Worker] ".concat(message)
  });
};
var postWarning = function postWarning(message) {
  return self.postMessage({
    type: "warning",
    message: "\uD83D\uDD27 [Worker] ".concat(message)
  });
};

/**
 * @typedef {Object} FSOperationMessage
 * @property {'fs_operation'} type - Message type
 * @property {string} operation - Filesystem operation name
 * @property {string} path - File or directory path
 * @property {string} [content] - File content (for write operations)
 */

/**
 * @typedef {Object} FSOperationResult
 * @property {boolean} [success] - Whether operation succeeded
 * @property {string} [content] - File content (for readFile)
 * @property {boolean} [exists] - Whether file exists (for exists)
 * @property {string[]} [files] - Directory contents (for listdir)
 */

/**
 * @typedef {Object} WorkerState
 * @property {PyodideAPI|null} pyodide - Pyodide instance
 * @property {boolean} isInitialized - Whether Pyodide is initialized
 * @property {Set<string>} packagesLoaded - Set of loaded package names
 */
;// ../file-loader/file-loader.js
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(file_loader_typeof(e) + " is not iterable"); }
function file_loader_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return file_loader_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (file_loader_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, file_loader_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, file_loader_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), file_loader_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", file_loader_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), file_loader_regeneratorDefine2(u), file_loader_regeneratorDefine2(u, o, "Generator"), file_loader_regeneratorDefine2(u, n, function () { return this; }), file_loader_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (file_loader_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function file_loader_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } file_loader_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { file_loader_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, file_loader_regeneratorDefine2(e, r, n, t); }
function file_loader_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function file_loader_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { file_loader_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { file_loader_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function file_loader_typeof(o) { "@babel/helpers - typeof"; return file_loader_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, file_loader_typeof(o); }
function file_loader_slicedToArray(r, e) { return file_loader_arrayWithHoles(r) || file_loader_iterableToArrayLimit(r, e) || file_loader_unsupportedIterableToArray(r, e) || file_loader_nonIterableRest(); }
function file_loader_nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function file_loader_iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function file_loader_arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = file_loader_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function file_loader_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return file_loader_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? file_loader_arrayLikeToArray(r, a) : void 0; } }
function file_loader_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, file_loader_toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function file_loader_toPropertyKey(t) { var i = file_loader_toPrimitive(t, "string"); return "symbol" == file_loader_typeof(i) ? i : i + ""; }
function file_loader_toPrimitive(t, r) { if ("object" != file_loader_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != file_loader_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
var PyodideFileLoader = /*#__PURE__*/function () {
  /**
   * Create a new PyodideFileLoader instance
   *
   * @param {Array<FileToLoad>} filesToLoad - Array of file objects to load
   * @throws {Error} If filesToLoad is not an array or contains invalid objects
   */
  function PyodideFileLoader(filesToLoad) {
    _classCallCheck(this, PyodideFileLoader);
    // Validate argument - now required
    if (!Array.isArray(filesToLoad)) {
      throw new Error("📦 [PyodideFileLoader] filesToLoad must be an array");
    }

    // Validate each file object
    var _iterator = _createForOfIteratorHelper(filesToLoad.entries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = file_loader_slicedToArray(_step.value, 2),
          index = _step$value[0],
          file = _step$value[1];
        if (!file || file_loader_typeof(file) !== 'object') {
          throw new Error("\uD83D\uDCE6 [PyodideFileLoader] filesToLoad[".concat(index, "] must be an object"));
        }
        if (typeof file.url !== 'string' || !file.url.trim()) {
          throw new Error("\uD83D\uDCE6 [PyodideFileLoader] filesToLoad[".concat(index, "].url must be a non-empty string"));
        }
        if (typeof file.path !== 'string' || !file.path.trim()) {
          throw new Error("\uD83D\uDCE6 [PyodideFileLoader] filesToLoad[".concat(index, "].path must be a non-empty string"));
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
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
  return _createClass(PyodideFileLoader, [{
    key: "loadFiles",
    value: (function () {
      var _loadFiles = file_loader_asyncToGenerator(/*#__PURE__*/file_loader_regenerator().m(function _callee(pyodide) {
        var options,
          _options$maxRetries,
          maxRetries,
          _options$retryDelay,
          retryDelay,
          _iterator2,
          _step2,
          _loop,
          _args2 = arguments,
          _t2;
        return file_loader_regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              options = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
              _options$maxRetries = options.maxRetries, maxRetries = _options$maxRetries === void 0 ? 3 : _options$maxRetries, _options$retryDelay = options.retryDelay, retryDelay = _options$retryDelay === void 0 ? 1000 : _options$retryDelay; // Validate pyodide instance
              if (!(!pyodide || !pyodide.FS)) {
                _context2.n = 1;
                break;
              }
              throw new Error("📦 [PyodideFileLoader] Invalid pyodide instance - missing FS");
            case 1:
              _iterator2 = _createForOfIteratorHelper(this.filesToLoad);
              _context2.p = 2;
              _loop = /*#__PURE__*/file_loader_regenerator().m(function _loop() {
                var file, retryCount, response, content, dir, dirExists, errorMsg, _t;
                return file_loader_regenerator().w(function (_context) {
                  while (1) switch (_context.n) {
                    case 0:
                      file = _step2.value;
                      retryCount = 0;
                    case 1:
                      if (!(retryCount < maxRetries)) {
                        _context.n = 9;
                        break;
                      }
                      _context.p = 2;
                      console.log("\uD83D\uDCE6 [PyodideFileLoader] Loading: ".concat(file.url, " (attempt ").concat(retryCount + 1, "/").concat(maxRetries, ")"));
                      _context.n = 3;
                      return fetch(file.url);
                    case 3:
                      response = _context.v;
                      if (response.ok) {
                        _context.n = 4;
                        break;
                      }
                      throw new Error("HTTP ".concat(response.status, ": ").concat(response.statusText));
                    case 4:
                      _context.n = 5;
                      return response.text();
                    case 5:
                      content = _context.v;
                      // Create directory if needed
                      dir = file.path.split('/').slice(0, -1).join('/');
                      if (dir) {
                        dirExists = pyodide.FS.analyzePath(dir).exists;
                        if (!dirExists) {
                          console.log("\uD83D\uDCE6 [PyodideFileLoader] Creating directory: ".concat(dir));
                          pyodide.FS.mkdir(dir);
                        }
                      }
                      pyodide.FS.writeFile(file.path, content);
                      console.log("\uD83D\uDCE6 [PyodideFileLoader] Saved: ".concat(file.path));
                      return _context.a(3, 9);
                    case 6:
                      _context.p = 6;
                      _t = _context.v;
                      retryCount++;
                      console.warn("\uD83D\uDCE6 [PyodideFileLoader] Attempt ".concat(retryCount, " failed for ").concat(file.url, ":"), _t.message);
                      if (!(retryCount === maxRetries)) {
                        _context.n = 7;
                        break;
                      }
                      errorMsg = "\uD83D\uDCE6 [PyodideFileLoader] Failed to load ".concat(file.url, " after ").concat(maxRetries, " attempts: ").concat(_t.message);
                      console.error(errorMsg);
                      throw new Error(errorMsg);
                    case 7:
                      _context.n = 8;
                      return new Promise(function (resolve) {
                        return setTimeout(resolve, retryDelay * retryCount);
                      });
                    case 8:
                      _context.n = 1;
                      break;
                    case 9:
                      return _context.a(2);
                  }
                }, _loop, null, [[2, 6]]);
              });
              _iterator2.s();
            case 3:
              if ((_step2 = _iterator2.n()).done) {
                _context2.n = 5;
                break;
              }
              return _context2.d(_regeneratorValues(_loop()), 4);
            case 4:
              _context2.n = 3;
              break;
            case 5:
              _context2.n = 7;
              break;
            case 6:
              _context2.p = 6;
              _t2 = _context2.v;
              _iterator2.e(_t2);
            case 7:
              _context2.p = 7;
              _iterator2.f();
              return _context2.f(7);
            case 8:
              return _context2.a(2);
          }
        }, _callee, this, [[2, 6, 7, 8]]);
      }));
      function loadFiles(_x) {
        return _loadFiles.apply(this, arguments);
      }
      return loadFiles;
    }())
  }]);
}();


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
;// ../python/capture_system.py
const capture_system_namespaceObject = "# =============================================================================\n# Output Capture System for Pyodide\n# =============================================================================\n# This module handles stdout/stderr capture and the missive system\n# Uses direct sys.stdout/stderr replacement for reliable capture in WebAssembly\n\nimport json\nimport io\nimport sys\nimport builtins\n\n# Store original stdout/stderr so we can restore them if needed\n_original_stdout = sys.stdout\n_original_stderr = sys.stderr\n\n# Create capture buffers\n_stdout_buffer = io.StringIO()\n_stderr_buffer = io.StringIO()\n\n# Storage for missive system - using builtins to ensure global availability\nif not hasattr(builtins, \"_nagini_current_missive\"):\n    builtins._nagini_current_missive = None\nif not hasattr(builtins, \"_nagini_missive_already_called\"):\n    builtins._nagini_missive_already_called = False\n\n\nclass CaptureStream:\n    \"\"\"Custom stream that captures all write operations\"\"\"\n\n    def __init__(self, buffer):\n        self.buffer = buffer\n\n    def write(self, text):\n        self.buffer.write(text)\n        return len(text)\n\n    def flush(self):\n        self.buffer.flush()\n\n    def isatty(self):\n        return False\n\n\n# Create capture streams\n_stdout_capturer = CaptureStream(_stdout_buffer)\n_stderr_capturer = CaptureStream(_stderr_buffer)\n\n\ndef reset_captures() -> None:\n    \"\"\"Reset capture buffers and activate capturing by replacing sys.stdout/stderr\"\"\"\n\n    # Clear buffers\n    _stdout_buffer.truncate(0)\n    _stdout_buffer.seek(0)\n    _stderr_buffer.truncate(0)\n    _stderr_buffer.seek(0)\n\n    # Clear missive data using builtins for global access\n    builtins._nagini_current_missive = None\n    builtins._nagini_missive_already_called = False\n\n    # Close any existing matplotlib figures (if matplotlib is available)\n    try:\n        import matplotlib.pyplot as plt\n\n        plt.close(\"all\")\n    except ImportError:\n        pass  # matplotlib not available, skip\n    except Exception:\n        pass  # Ignore other errors\n\n    # Activate capturing by replacing sys.stdout/stderr\n    sys.stdout = _stdout_capturer\n    sys.stderr = _stderr_capturer\n\n\ndef get_stdout() -> str:\n    \"\"\"Get captured stdout content\"\"\"\n    return _stdout_buffer.getvalue()\n\n\ndef get_stderr() -> str:\n    \"\"\"Get captured stderr content\"\"\"\n    return _stderr_buffer.getvalue()\n\n\ndef restore_original_streams() -> None:\n    \"\"\"Restore original stdout/stderr (for debugging if needed)\"\"\"\n    sys.stdout = _original_stdout\n    sys.stderr = _original_stderr\n\n\ndef get_missive() -> str | None:\n    \"\"\"\n    Get the current missive dictionary as a JSON string.\n\n    A \"missive\" is our term for structured data that user code wants to send\n    back to JavaScript. It's always a Python dictionary that gets converted\n    to JSON format (which JavaScript can easily understand).\n\n    Returns:\n        str | None: JSON string of the missive data, or None if no missive was sent\n\n    Example:\n        If user code did: missive({\"result\": 42, \"status\": \"success\"})\n        This would return: '{\"result\": 42, \"status\": \"success\"}'\n    \"\"\"\n    if builtins._nagini_current_missive is None:\n        return None  # No missive was stored\n    return json.dumps(builtins._nagini_current_missive)  # Convert Python dict to JSON string\n\n\ndef get_figures() -> list:\n    \"\"\"\n    Capture matplotlib figures and return them as base64 encoded strings.\n\n    Returns:\n        list: List of base64 encoded PNG images of matplotlib figures\n    \"\"\"\n    figures = []\n\n    try:\n        # Import matplotlib only when needed (after packages are loaded)\n        import matplotlib.pyplot as plt\n        import base64\n\n        if hasattr(plt, \"get_fignums\"):\n            try:\n                for fig_num in plt.get_fignums():\n                    plt.figure(fig_num)\n                    buf = io.BytesIO()\n                    plt.savefig(buf, format=\"png\", dpi=100, bbox_inches=\"tight\")\n                    buf.seek(0)\n                    figures.append(base64.b64encode(buf.read()).decode(\"utf-8\"))\n                    plt.close(fig_num)\n            except Exception as e:\n                print(f\"Error capturing figures: {e}\")\n    except ImportError:\n        # matplotlib not available, return empty list\n        pass\n    except Exception as e:\n        print(f\"Error importing matplotlib: {e}\")\n\n    return figures\n\n\ndef missive(data):\n    \"\"\"Send structured data back to JavaScript (once per execution)\"\"\"\n    if builtins._nagini_missive_already_called:\n        raise ValueError(\n            \"missive() can only be called once per execution. \"\n            \"If you need to send multiple pieces of data, \"\n            \"put them all in one dictionary.\"\n        )\n    builtins._nagini_current_missive = data\n    builtins._nagini_missive_already_called = True\n    print(f\"[DEBUG] missive() called with data: {data}\")\n    print(f\"[DEBUG] current_missive set to: {builtins._nagini_current_missive}\")\n\n\n# Make the missive function available globally\nbuiltins.missive = missive\n\n# Legacy global variables for backward compatibility\ncurrent_missive = builtins._nagini_current_missive\nmissive_already_called = builtins._nagini_missive_already_called\n\n\ndef debug_missive_system():\n    \"\"\"Debug function to check the current state of the missive system\"\"\"\n    print(f\"[DEBUG] _nagini_current_missive: {builtins._nagini_current_missive}\")\n    print(f\"[DEBUG] _nagini_missive_already_called: {builtins._nagini_missive_already_called}\")\n    print(f\"[DEBUG] get_missive() returns: {get_missive()}\")\n    print(f\"[DEBUG] missive function available: {hasattr(builtins, 'missive')}\")\n    return {\n        \"current_missive\": builtins._nagini_current_missive,\n        \"missive_already_called\": builtins._nagini_missive_already_called,\n        \"get_missive_result\": get_missive(),\n        \"missive_function_available\": hasattr(builtins, \"missive\"),\n    }\n\n\n# Make debug function available globally too\nbuiltins.debug_missive_system = debug_missive_system\n";
;// ../python/code_transformation.py
const code_transformation_namespaceObject = "# =============================================================================\n# Code Transformation for Async Input Support\n# =============================================================================\n# This module handles transforming Python code to support async input() calls\n# when input handling is detected in user code\n\n\ndef prepare_code_for_async_input(code):\n    \"\"\"\n    Transform code to support async input handling.\n    This replaces input() calls with await input() calls since we'll replace\n    the built-in input function with an async version.\n    \"\"\"\n    lines = []\n    for line in code.split(\"\\n\"):\n        # Make sure input() uses await, but don't modify comments\n        has_input = \"input(\" in line\n        no_await = \"await input(\" not in line\n        not_comment = not line.strip().startswith(\"#\")\n        if has_input and no_await and not_comment:\n            # Replace the input call with await input\n            line = line.replace(\"input(\", \"await input(\")\n        lines.append(line)\n    return \"\\n\".join(lines)\n\n\ndef transform_code_for_execution(code):\n    \"\"\"\n    Transform user code to support input handling only when needed.\n    If code doesn't contain input() calls, execute it directly without transformation.\n    \"\"\"\n    try:\n        print(\"🔧 [Python] Transforming code with input() calls\")\n        # Check if code contains input() calls\n        if \"input(\" in code:\n            # Only transform if input() is present\n            prepared = prepare_code_for_async_input(code)\n\n            # Properly indent the user code for the async function (8 spaces for try block)\n            indented_code = \"\"\n            for line in prepared.split(\"\\n\"):\n                if line.strip():  # Skip empty lines for indentation\n                    indented_code += \"        \" + line + \"\\n\"  # 8 spaces for try block\n                else:\n                    indented_code += \"\\n\"  # Keep empty lines\n\n            transformed = f\"\"\"import asyncio\n\nasync def __run_code():\n    try:\n{indented_code}\n    except Exception as e:\n        import traceback\n        error_type = type(e).__name__\n        error_msg = str(e)\n        print(f\"Error occurred: \" + error_type + \": \" + error_msg)\n        traceback.print_exc()\n\n# Execute the async code\nawait __run_code()\n\"\"\"\n            print(f\"🔧 [Python] Transformation complete, code length: {len(transformed)}\")\n            return transformed\n        else:\n            # No input() calls, execute code directly without transformation\n            print(\"🔧 [Python] No input() calls found, returning original code\")\n            return code\n    except Exception as e:\n        print(f\"🔧 [Python] Error during transformation: {e}\")\n        import traceback\n\n        traceback.print_exc()\n        return code  # Return original code if transformation fails\n";
;// ../python/pyodide_utilities.py
const pyodide_utilities_namespaceObject = "# =============================================================================\n# Pyodide Utilities\n# =============================================================================\n# This module contains utility functions for Pyodide environment setup\n\n\ndef setup_matplotlib():\n    \"\"\"Set up matplotlib configuration if the package is available\"\"\"\n    try:\n        import matplotlib.pyplot as plt\n\n        plt.switch_backend(\"agg\")  # Use non-interactive backend\n\n        # Override plt.show() to prevent display attempts\n        def custom_show(*args, **kwargs):\n            pass  # No-op since we capture figures manually\n\n        plt.show = custom_show\n        print(\"🎨 Matplotlib configured successfully\")\n    except ImportError:\n        # matplotlib not available, skip setup\n        pass\n    except Exception as e:\n        print(f\"Warning: Could not configure matplotlib: {e}\")\n\n\n# Additional utility functions can be added here as needed\n";
;// ../python/pyodide_init.py
const pyodide_init_namespaceObject = "# =============================================================================\n# Pyodide Python Initialization Script - Modular Version\n# =============================================================================\n# This file contains Python utilities that run inside the Pyodide environment.\n# It coordinates all the modular components for a cleaner architecture.\n\n# Standard Library Imports\n# ------------------------\nimport json  # JavaScript Object Notation\nimport builtins  # Built-in functions and exceptions\n\n# Local Module Imports\n# --------------------\nfrom capture_system import (\n    reset_captures,\n    get_stdout,\n    get_stderr,\n    get_missive,\n    get_figures,\n    missive,\n    restore_original_streams,\n)\n\nfrom code_transformation import transform_code_for_execution, prepare_code_for_async_input\n\nfrom pyodide_utilities import setup_matplotlib\n\n# =============================================================================\n# MAKE FUNCTIONS AVAILABLE GLOBALLY\n# =============================================================================\n# Export all the necessary functions to the global namespace so they can be\n# called from JavaScript and from user Python code\n\n# Capture system functions\nbuiltins.reset_captures = reset_captures\nbuiltins.get_stdout = get_stdout\nbuiltins.get_stderr = get_stderr\nbuiltins.get_missive = get_missive\nbuiltins.get_figures = get_figures\nbuiltins.missive = missive\nbuiltins.restore_original_streams = restore_original_streams\n\n# Code transformation functions\nbuiltins.transform_code_for_execution = transform_code_for_execution\nbuiltins.prepare_code_for_async_input = prepare_code_for_async_input\n\n# Utility functions\nbuiltins.setup_matplotlib = setup_matplotlib\n\n# Other globals\nbuiltins.json = json\n\n# =============================================================================\n# INITIALIZATION\n# =============================================================================\n\n# Initialize capture system immediately\nreset_captures()\n\nprint(\"🐍 Pyodide initialization completed successfully!\")\nprint(\"🔧 All modules loaded and capture system active\")\n\n# Note: setup_matplotlib() will be called after packages are loaded\n# in the worker initialization process\n";
;// ./worker-handlers.js
function worker_handlers_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return worker_handlers_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (worker_handlers_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, worker_handlers_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, worker_handlers_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), worker_handlers_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", worker_handlers_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), worker_handlers_regeneratorDefine2(u), worker_handlers_regeneratorDefine2(u, o, "Generator"), worker_handlers_regeneratorDefine2(u, n, function () { return this; }), worker_handlers_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (worker_handlers_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function worker_handlers_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } worker_handlers_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { worker_handlers_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, worker_handlers_regeneratorDefine2(e, r, n, t); }
function worker_handlers_typeof(o) { "@babel/helpers - typeof"; return worker_handlers_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, worker_handlers_typeof(o); }
function worker_handlers_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function worker_handlers_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { worker_handlers_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { worker_handlers_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function worker_handlers_ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function worker_handlers_objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? worker_handlers_ownKeys(Object(t), !0).forEach(function (r) { worker_handlers_defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : worker_handlers_ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function worker_handlers_defineProperty(e, r, t) { return (r = worker_handlers_toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function worker_handlers_toPropertyKey(t) { var i = worker_handlers_toPrimitive(t, "string"); return "symbol" == worker_handlers_typeof(i) ? i : i + ""; }
function worker_handlers_toPrimitive(t, r) { if ("object" != worker_handlers_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != worker_handlers_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * PyodideWorker Message Handlers - Optimized
 *
 * Concise message handling logic for the pyodide worker
 */







// Import Python modules as bundled strings





/**
 * Post error message to main thread
 * @param {string} message - Error message to send
 * @returns {void}
 */
var worker_handlers_postError = function postError(message) {
  return self.postMessage({
    type: "error",
    message: "\uD83D\uDD27 [Worker] ".concat(message)
  });
};

/**
 * Post filesystem error message to main thread
 * @param {string} error - Error message to send
 * @returns {void}
 */
var worker_handlers_postFSError = function postFSError(error) {
  return self.postMessage({
    type: "fs_error",
    error: "\uD83D\uDD27 [Worker] ".concat(error)
  });
};

/**
 * Post execution result to main thread
 * @param {ExecutionResultData} data - Execution result data
 * @returns {void}
 */
var worker_handlers_postResult = function postResult(data) {
  return self.postMessage(worker_handlers_objectSpread({
    type: "result"
  }, data));
};

/**
 * Post info message to main thread
 * @param {string} message - Info message to send
 * @returns {void}
 */
var worker_handlers_postInfo = function postInfo(message) {
  return self.postMessage({
    type: "info",
    message: "\uD83D\uDD27 [Worker] ".concat(message)
  });
};

/**
 * Post warning message to main thread
 * @param {string} message - Warning message to send
 * @returns {void}
 */
var worker_handlers_postWarning = function postWarning(message) {
  return self.postMessage({
    type: "warning",
    message: "\uD83D\uDD27 [Worker] ".concat(message)
  });
};

/**
 * Post input required message to main thread
 * @param {string} prompt - Input prompt
 * @returns {void}
 */
var postInputRequired = function postInputRequired(prompt) {
  return self.postMessage({
    type: "input_required",
    prompt: prompt
  });
};

/**
 * Validate that worker is properly initialized
 * @param {WorkerState} workerState - Current worker state
 * @returns {boolean} True if initialized, false otherwise
 */
var worker_handlers_validateInitialized = function validateInitialized(workerState) {
  if (!workerState.isInitialized || !workerState.pyodide) {
    worker_handlers_postError(PYODIDE_WORKER_CONFIG.MESSAGES.NOT_INITIALIZED);
    return false;
  }
  return true;
};

/**
 * Main message dispatcher
 * Handles incoming messages from the main thread and routes them to appropriate handlers
 *
 * @param {MessageEvent} e - Message event from main thread
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Promise<void>}
 */
function handleMessage(_x, _x2) {
  return _handleMessage.apply(this, arguments);
}
/**
 * Handle Pyodide initialization
 * Loads Pyodide runtime, bundled Python modules, and packages
 *
 * @param {InitMessage} data - Initialization message data
 * @param {WorkerState} workerState - Current worker state object
 * @returns {Promise<void>}
 */
function _handleMessage() {
  _handleMessage = worker_handlers_asyncToGenerator(/*#__PURE__*/worker_handlers_regenerator().m(function _callee(e, workerState) {
    var data, handlers, handler;
    return worker_handlers_regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          data = e.data;
          if (data !== null && data !== void 0 && data.type) {
            _context.n = 1;
            break;
          }
          worker_handlers_postError(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.INVALID_MESSAGE);
          return _context.a(2);
        case 1:
          handlers = {
            init: handleInit,
            execute: handleExecute,
            fs_operation: handleFSOperation,
            input_response: handleInputResponse
          };
          handler = handlers[data.type];
          if (handler) {
            _context.n = 2;
            break;
          }
          worker_handlers_postError("".concat(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.UNKNOWN_TYPE, ": ").concat(data.type));
          return _context.a(2);
        case 2:
          _context.n = 3;
          return handler(data, workerState);
        case 3:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _handleMessage.apply(this, arguments);
}
function handleInit(_x3, _x4) {
  return _handleInit.apply(this, arguments);
}
function _handleInit() {
  _handleInit = worker_handlers_asyncToGenerator(/*#__PURE__*/worker_handlers_regenerator().m(function _callee2(data, workerState) {
    var packages, micropipPackages, filesToLoad, pythonModules, _i, _pythonModules, module, fileLoader, toLoad, loaded, micropip, _t, _t2;
    return worker_handlers_regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          if (!workerState.isInitialized) {
            _context2.n = 1;
            break;
          }
          worker_handlers_postError(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.ALREADY_INITIALIZED);
          return _context2.a(2);
        case 1:
          packages = data.packages, micropipPackages = data.micropipPackages, filesToLoad = data.filesToLoad;
          console.log("🔧 [Worker] handleInit called with data:", {
            packages: packages ? packages.length : 0,
            micropipPackages: micropipPackages ? micropipPackages.length : 0,
            filesToLoad: filesToLoad ? filesToLoad.length : 0
          });
          console.log("🔧 [Worker] filesToLoad details:", filesToLoad);
          _context2.p = 2;
          // Load Pyodide runtime
          importScripts("".concat(worker_config_PYODIDE_WORKER_CONFIG.PYODIDE_CDN, "pyodide.js"));
          _context2.n = 3;
          return loadPyodide({
            indexURL: worker_config_PYODIDE_WORKER_CONFIG.PYODIDE_CDN
          });
        case 3:
          workerState.pyodide = _context2.v;
          console.log("🐍 Using bundled Python modules");

          // Load bundled Python modules directly (no HTTP fetching needed!)
          pythonModules = [{
            name: 'capture_system.py',
            content: capture_system_namespaceObject
          }, {
            name: 'code_transformation.py',
            content: code_transformation_namespaceObject
          }, {
            name: 'pyodide_utilities.py',
            content: pyodide_utilities_namespaceObject
          }];
          for (_i = 0, _pythonModules = pythonModules; _i < _pythonModules.length; _i++) {
            module = _pythonModules[_i];
            try {
              // Write to filesystem for potential imports
              workerState.pyodide.FS.writeFile(module.name, module.content);
              // Execute the module so it can be imported
              workerState.pyodide.runPython(module.content);
              console.log("\uD83D\uDC0D Loaded and executed bundled Python module: ".concat(module.name));
            } catch (error) {
              console.warn("\u26A0\uFE0F Could not load bundled Python module ".concat(module.name, ":"), error.message);
            }
          }

          // Load main Python initialization script from bundle
          console.log("🐍 Loading bundled pyodide_init.py");
          workerState.pyodide.runPython(pyodide_init_namespaceObject);

          // Set up input handling system
          _context2.n = 4;
          return setupInputHandling(workerState.pyodide);
        case 4:
          if (!(filesToLoad && filesToLoad.length > 0)) {
            _context2.n = 9;
            break;
          }
          console.log("\uD83D\uDCE6 [Worker] Loading ".concat(filesToLoad.length, " custom files into filesystem"));
          console.log("\uD83D\uDCE6 [Worker] Files to load:", filesToLoad);
          _context2.p = 5;
          fileLoader = new PyodideFileLoader(filesToLoad);
          _context2.n = 6;
          return fileLoader.loadFiles(workerState.pyodide);
        case 6:
          console.log("\uD83D\uDCE6 [Worker] Successfully loaded ".concat(filesToLoad.length, " custom files"));
          _context2.n = 8;
          break;
        case 7:
          _context2.p = 7;
          _t = _context2.v;
          console.error("\uD83D\uDCE6 [Worker] Failed to load custom files:", _t);
          throw _t;
        case 8:
          _context2.n = 10;
          break;
        case 9:
          console.log("\uD83D\uDCE6 [Worker] No custom files to load (filesToLoad: ".concat(filesToLoad, ")"));
        case 10:
          if (!((packages === null || packages === void 0 ? void 0 : packages.length) > 0)) {
            _context2.n = 11;
            break;
          }
          _context2.n = 11;
          return loadPackages(packages, workerState);
        case 11:
          if (!((micropipPackages === null || micropipPackages === void 0 ? void 0 : micropipPackages.length) > 0)) {
            _context2.n = 14;
            break;
          }
          toLoad = micropipPackages.filter(function (pkg) {
            return !workerState.micropipPackagesLoaded.has(pkg);
          });
          loaded = micropipPackages.filter(function (pkg) {
            return workerState.micropipPackagesLoaded.has(pkg);
          });
          if (loaded.length > 0) {
            worker_handlers_postInfo("[Micropip] Skipping ".concat(loaded.length, " already installed packages: ").concat(loaded.join(", ")));
          }
          if (!(toLoad.length > 0)) {
            _context2.n = 14;
            break;
          }
          worker_handlers_postInfo("[Micropip] Installing ".concat(toLoad.length, " packages: ").concat(toLoad.join(", "), "..."));
          _context2.n = 12;
          return workerState.pyodide.loadPackage("micropip");
        case 12:
          micropip = workerState.pyodide.pyimport("micropip");
          _context2.n = 13;
          return micropip.install(toLoad);
        case 13:
          toLoad.forEach(function (pkg) {
            return workerState.micropipPackagesLoaded.add(pkg);
          });
          worker_handlers_postInfo("[Micropip] Packages installed successfully.");
        case 14:
          // Set up matplotlib if it was loaded
          try {
            workerState.pyodide.runPython("setup_matplotlib()");
          } catch (e) {
            console.log("🎨 Matplotlib setup skipped (not available):", e.message);
          }
          workerState.isInitialized = true;
          self.postMessage({
            type: "ready"
          });
          _context2.n = 16;
          break;
        case 15:
          _context2.p = 15;
          _t2 = _context2.v;
          workerState.pyodide = null;
          workerState.isInitialized = false;
          worker_handlers_postError("".concat(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.INIT_FAILED, ": ").concat(_t2.message));
        case 16:
          return _context2.a(2);
      }
    }, _callee2, null, [[5, 7], [2, 15]]);
  }));
  return _handleInit.apply(this, arguments);
}


/**
 * @typedef {Object} WorkerState
 * @property {PyodideAPI|null} pyodide - Pyodide instance
 * @property {boolean} isInitialized - Whether Pyodide is initialized
 * @property {Set<string>} packagesLoaded - Set of loaded package names
 * @property {Set<string>} micropipPackagesLoaded - Set of loaded micropip package names
 */

/**
 * @typedef {Object} InitMessage
 * @property {'init'} type - Message type
 * @property {string[]} packages - Array of package names to install
 * @property {string[]} [micropipPackages] - Optional array of package names to install with micropip
 * @property {Array<FileToLoad>} filesToLoad - Files to load into filesystem
 */

/**
 * @typedef {Object} ExecuteMessage
 * @property {'execute'} type - Message type
 * @property {string} filename - Name for execution tracking
 * @property {string} code - Python code to execute
 * @property {Object} [namespace] - Optional namespace for execution
 */

/**
 * @typedef {Object} FSOperationMessage
 * @property {'fs_operation'} type - Message type
 * @property {string} operation - Filesystem operation name
 * @property {string} path - File or directory path
 * @property {string} [content] - File content (for write operations)
 */

/**
 * @typedef {Object} ExecutionResultData
 * @property {string} filename - Name of executed file
 * @property {string} stdout - Standard output
 * @property {string} stderr - Standard error
 * @property {Object|null} missive - Structured data from Python
 * @property {Object|null} error - Execution error object
 * @property {number} time - Execution time in milliseconds
 * @property {boolean} executedWithNamespace - Whether execution used namespace
 */

/**
 * @typedef {Object} CapturedOutputs
 * @property {string} stdout - Standard output
 * @property {string} stderr - Standard error
 * @property {Object|null} missive - Structured JSON data
 */

/**
 * @typedef {Object} FSOperationResult
 * @property {boolean} [success] - Whether operation succeeded
 * @property {string} [content] - File content (for readFile)
 * @property {boolean} [exists] - Whether file exists (for exists)
 * @property {string[]} [files] - Directory contents (for listdir)
 */

/**
 * @typedef {Object} FileToLoad
 * @property {string} path - Target path in filesystem
 * @property {string} content - File content to write
 */

/**
 * @typedef {Object} PyodideAPI
 * @property {function} runPython - Execute Python code
 * @property {function} loadPackage - Load Python packages
 * @property {function} toPy - Convert JavaScript to Python
 * @property {Object} FS - Filesystem operations
 */
;// ./worker.js
function worker_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return worker_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (worker_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, worker_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, worker_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), worker_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", worker_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), worker_regeneratorDefine2(u), worker_regeneratorDefine2(u, o, "Generator"), worker_regeneratorDefine2(u, n, function () { return this; }), worker_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (worker_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function worker_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } worker_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { worker_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, worker_regeneratorDefine2(e, r, n, t); }
function worker_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function worker_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { worker_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { worker_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * Pyodide Web Worker - Entry Point
 *
 * Pyodide WebAssembly worker that runs Python code in a separate thread.
 * Handles initialization, code execution, and structured communication (missive + stdout + stderr)
 * with the main thread via message passing.
 *
 * ⚠️ Security Note: This worker executes arbitrary Python code.
 * Use ONLY in trusted environments or implement additional sandboxing.
 *
 * @example
 * // Main thread usage:
 * const worker = new Worker('./pyodide-worker.js');
 * worker.postMessage({ type: 'init', packages: ['numpy'], pyodideInitPath: './init.py' });
 * worker.postMessage({ type: 'execute', filename: 'test.py', code: 'print("Hello")' });
 *
 * @module PyodideWorker
 */



/**
 * Worker state object to track Pyodide instance and loaded packages
 * @type {WorkerState}
 */
var workerState = {
  /** @type {PyodideAPI|null} Pyodide instance - null until initialization complete */
  pyodide: null,
  /** @type {boolean} Tracks initialization state */
  isInitialized: false,
  /** @type {Set<string>} Tracks loaded packages to prevent duplicate loading 📦 */
  packagesLoaded: new Set(),
  /** @type {Set<string>} Tracks loaded micropip packages to prevent duplicate loading 📦 */
  micropipPackagesLoaded: new Set()
};

/**
 * Web Worker message handler
 *
 * Processes messages from the main thread using imported handlers.
 *
 * @param {MessageEvent<WorkerMessage>} e - Message event from main thread
 * @returns {Promise<void>}
 */
self.onmessage = /*#__PURE__*/function () {
  var _ref = worker_asyncToGenerator(/*#__PURE__*/worker_regenerator().m(function _callee(e) {
    var _t;
    return worker_regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return handleMessage(e, workerState);
        case 1:
          _context.n = 3;
          break;
        case 2:
          _context.p = 2;
          _t = _context.v;
          // Error during message handling
          self.postMessage({
            type: "error",
            message: "\uD83D\uDD27 [Worker] Failed to handle message: ".concat(_t.message)
          });
        case 3:
          return _context.a(2);
      }
    }, _callee, null, [[0, 2]]);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * @typedef {Object} WorkerState
 * @property {PyodideAPI|null} pyodide - Pyodide instance (null until initialized)
 * @property {boolean} isInitialized - Whether Pyodide is fully initialized
 * @property {Set<string>} packagesLoaded - Set of loaded package names for deduplication
 * @property {Set<string>} micropipPackagesLoaded - Set of loaded micropip package names for deduplication
 */

/**
 * @typedef {Object} WorkerMessage
 * @property {'init'|'execute'|'fs_operation'|'input_response'} type - Message type
 * @property {string} [filename] - Filename for execution (execute messages)
 * @property {string} [code] - Python code to execute (execute messages)
 * @property {Object} [namespace] - Execution namespace (execute messages)
 * @property {string[]} [packages] - Python packages to install (init messages)
 * @property {string[]} [micropipPackages] - Python micropip packages to install (init messages)
 * @property {string} [pyodideInitPath] - Path to initialization script (init messages)
 * @property {Array<FileToLoad>} [filesToLoad] - Files to load (init messages)
 * @property {string} [operation] - Filesystem operation type (fs_operation messages)
 * @property {string} [path] - File path (fs_operation messages)
 * @property {string} [content] - File content (fs_operation messages)
 * @property {string} [input] - User input (input_response messages)
 */

/**
 * @typedef {Object} PyodideAPI
 * @property {Function} runPython - Execute Python code synchronously
 * @property {Function} runPythonAsync - Execute Python code asynchronously
 * @property {Function} loadPackage - Load Python packages
 * @property {Function} toPy - Convert JavaScript to Python objects
 * @property {Object} FS - Virtual filesystem interface
 * @property {Function} FS.writeFile - Write file to filesystem
 * @property {Function} FS.readFile - Read file from filesystem
 * @property {Function} FS.mkdir - Create directory
 * @property {Function} FS.analyzePath - Analyze path existence
 * @property {Function} FS.readdir - List directory contents
 */

/**
 * @typedef {Object} FileToLoad
 * @property {string} url - URL to fetch the file from
 * @property {string} path - Target path in Pyodide filesystem
 */
/******/ })()
;