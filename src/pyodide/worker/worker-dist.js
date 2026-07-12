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
  PYODIDE_CDN: "https://cdn.jsdelivr.net/pyodide/v314.0.2/full/",
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
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
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
    var code, filename, namespace, id, start, stdout, stderr, missive, figures, error, result, pyodideNamespace, _captureOutputs, _captureOutputs2, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (validateInitialized(workerState, data.id)) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          code = data.code, filename = data.filename, namespace = data.namespace, id = data.id;
          start = Date.now();
          stdout = "", stderr = "", missive = null, figures = [], error = null;
          _context.p = 2;
          // Transform code for async execution if needed
          result = transformCodeForExecution(code, workerState);
          workerState.captureSystem.reset_captures();

          // Always execute through runPythonAsync: it handles synchronous code
          // identically and enables top-level await in any user code (asyncio,
          // httpx/ASGI, transformed input() calls, ...)
          if (!(namespace !== undefined)) {
            _context.n = 6;
            break;
          }
          pyodideNamespace = workerState.pyodide.toPy(namespace);
          _context.p = 3;
          _context.n = 4;
          return workerState.pyodide.runPythonAsync(result.code, {
            globals: pyodideNamespace
          });
        case 4:
          _context.p = 4;
          pyodideNamespace.destroy();
          return _context.f(4);
        case 5:
          _context.n = 7;
          break;
        case 6:
          _context.n = 7;
          return workerState.pyodide.runPythonAsync(result.code);
        case 7:
          _captureOutputs = captureOutputs(workerState);
          stdout = _captureOutputs.stdout;
          stderr = _captureOutputs.stderr;
          missive = _captureOutputs.missive;
          figures = _captureOutputs.figures;
          _context.n = 9;
          break;
        case 8:
          _context.p = 8;
          _t = _context.v;
          error = {
            name: _t.name || "PythonError",
            message: _t.message || "Unknown execution error"
          };
          _captureOutputs2 = captureOutputs(workerState, true);
          stdout = _captureOutputs2.stdout;
          stderr = _captureOutputs2.stderr;
          figures = _captureOutputs2.figures;
        case 9:
          // Default-namespace runs persist their globals, so a rebinding of the
          // exposed builtins (missive, input) outlives this execution: warn once
          if (namespace === undefined) {
            warnShadowedBuiltins(workerState, filename);
          }

          // 🐍 POST EXECUTION RESULTS (always logged with snake emoji)
          console.log("🐍 Worker execution result:", {
            filename: filename,
            stdout: stdout.length + " chars",
            stderr: stderr.length + " chars",
            missive: missive,
            figures: figures.length + " figures",
            error: error,
            time: Date.now() - start + "ms"
          });
          postResult({
            id: id,
            filename: filename,
            stdout: stdout,
            stderr: stderr,
            missive: missive,
            figures: figures,
            error: error,
            time: Date.now() - start,
            executedWithNamespace: namespace !== undefined
          });
        case 10:
          return _context.a(2);
      }
    }, _callee, null, [[3,, 4, 5], [2, 8]]);
  }));
  return _handleExecute.apply(this, arguments);
}
function transformCodeForExecution(code, workerState) {
  // Ne match que les vrais appels input(, pas some_func__input( ni obj.input(.
  // La réécriture réelle est faite côté Python sur l'AST ; ce gate ne décide
  // que du passage en exécution asynchrone (runPythonAsync).
  var needsAsync = /(?<![\w.])input\s*\(/.test(code);
  if (needsAsync) {
    // Transform the code using the Python transformation, called through the
    // module reference (immune to user code rebinding the name)
    var transformedCode = workerState.codeTransformation.transform_code_for_execution(code);
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
 * Retrieves execution outputs through the capture_system module reference,
 * never by name lookup in the interpreter globals: user code rebinding
 * get_stdout, get_missive or json cannot corrupt the capture
 *
 * @param {WorkerState} workerState - Current worker state object
 * @param {boolean} [isErrorCase=false] - Whether this is capturing after an error
 * @returns {CapturedOutputs} Object containing stdout, stderr, missive, and figures
 */
function captureOutputs(workerState) {
  var isErrorCase = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var capture = workerState.captureSystem;
  var stdout = "",
    stderr = "",
    missive = null,
    figures = [];
  try {
    stdout = capture.get_stdout() || "";
    stderr = capture.get_stderr() || "";
    if (!isErrorCase) {
      var missiveJson = capture.get_missive();
      if (missiveJson) {
        // Keep as string - get_missive() already returns JSON string via json.dumps()
        missive = missiveJson;
      }

      // Capture matplotlib figures
      try {
        var figuresResult = capture.get_figures();
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
    console.warn("🐍 " + worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.OUTPUT_FAILED, err.message);
    if (isErrorCase) stderr = "".concat(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.OUTPUT_RETRIEVAL_FAILED, ": ").concat(err.message);
  }
  return {
    stdout: stdout,
    stderr: stderr,
    missive: missive,
    figures: figures
  };
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
    var result = workerState.captureSystem.detect_shadowed_names(workerState.pyodide.globals);
    var shadowed = result.toJs ? result.toJs() : result;
    if (result.destroy) result.destroy();
    var _iterator = _createForOfIteratorHelper(shadowed),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var name = _step.value;
        if (workerState.shadowWarnedNames.has(name)) continue;
        workerState.shadowWarnedNames.add(name);
        postWarning("The global name \"".concat(name, "\" was rebound by user code (").concat(filename, ") and now shadows ") + "the built-in ".concat(name, "(). It persists across executions: later code cannot call the ") + "built-in until the shadow is removed (del ".concat(name, ")."));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  } catch (e) {
    // Diagnostic only: never let it affect the execution result
  }
}

// Helper functions for messaging: the request id (when present) is echoed
// back so the manager can correlate the response with its pending promise
var postResult = function postResult(data) {
  return self.postMessage(_objectSpread({
    type: "result"
  }, data));
};
var postError = function postError(message, id) {
  return self.postMessage({
    type: "error",
    id: id,
    message: "\uD83D\uDC0D [Worker] ".concat(message)
  });
};
var postWarning = function postWarning(message) {
  return self.postMessage({
    type: "warning",
    message: "\uD83D\uDC0D [Worker] ".concat(message)
  });
};

/**
 * Validate that worker is properly initialized
 * @param {WorkerState} workerState - Current worker state
 * @param {number} [id] - Request id to echo in the error response
 * @returns {boolean} True if initialized, false otherwise
 */
function validateInitialized(workerState, id) {
  if (!workerState.isInitialized || !workerState.pyodide) {
    postError(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.NOT_INITIALIZED, id);
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
    var setupNamespace;
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
                  // Send input request to main thread
                  self.postMessage({
                    type: "input_required",
                    prompt: prompt
                  });

                  // Return a promise that will be resolved when input is received
                  return _context.a(2, new Promise(function (resolve) {
                    self.pendingInputResolver = resolve;
                  }));
              }
            }, _callee);
          }));

          // Set up the Python environment with input handling. The snippet runs in
          // a throwaway namespace: none of its names (sys, requestInput,
          // input_handler) leak into the interpreter globals where user code runs,
          // so they cannot be shadowed or rebound from user code. The handler keeps
          // them alive through its own module-level closure.
          setupNamespace = pyodide.toPy({});
          _context2.p = 1;
          _context2.n = 2;
          return pyodide.runPythonAsync("\nimport builtins\nimport sys\nfrom js import requestInput\n\nasync def input_handler(prompt=\"\"):\n    # Always print the prompt to stdout first\n    if prompt:\n        print(prompt, end=\"\", flush=True)\n        sys.stdout.flush()\n\n    # Request input from JavaScript\n    return await requestInput(prompt)\n\n# Replace the built-in input function with our async version\nbuiltins.input = input_handler\n", {
            globals: setupNamespace
          });
        case 2:
          _context2.p = 2;
          setupNamespace.destroy();
          return _context2.f(2);
        case 3:
          return _context2.a(2);
      }
    }, _callee2, null, [[1,, 2, 3]]);
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
            // Resolve the pending input promise if it exists
            if (self.pendingInputResolver) {
              self.pendingInputResolver(input);
              self.pendingInputResolver = null;
            } else {
              console.warn("No pending input resolver found");
            }
          } catch (err) {
            console.error("Failed to provide input:", err);
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
    message: "\uD83D\uDC0D [Worker] ".concat(message)
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
          postFSError(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.FS_NOT_INITIALIZED, data.id);
          return _context.a(2);
        case 1:
          try {
            result = executeFS(data, workerState.pyodide);
            self.postMessage({
              type: "fs_result",
              id: data.id,
              result: result
            });
          } catch (error) {
            postFSError(error.message, data.id);
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

// Helper functions for messaging: the request id (when present) is echoed
// back so the manager can correlate the response with its pending promise
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
          worker_fs_postWarning("".concat(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.PACKAGE_WARNING, " ").concat(_t.message));
        case 4:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 3]]);
  }));
  return _loadPackages.apply(this, arguments);
}
var postFSError = function postFSError(error, id) {
  return self.postMessage({
    type: "fs_error",
    id: id,
    error: "\uD83D\uDD27 [Worker] ".concat(error)
  });
};
var postInfo = function postInfo(message) {
  return self.postMessage({
    type: "info",
    message: "\uD83D\uDD27 [Worker] ".concat(message)
  });
};
var worker_fs_postWarning = function postWarning(message) {
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
;// ./worker-snapshot.js
function worker_snapshot_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = worker_snapshot_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function worker_snapshot_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return worker_snapshot_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (worker_snapshot_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, worker_snapshot_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, worker_snapshot_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), worker_snapshot_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", worker_snapshot_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), worker_snapshot_regeneratorDefine2(u), worker_snapshot_regeneratorDefine2(u, o, "Generator"), worker_snapshot_regeneratorDefine2(u, n, function () { return this; }), worker_snapshot_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (worker_snapshot_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function worker_snapshot_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } worker_snapshot_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { worker_snapshot_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, worker_snapshot_regeneratorDefine2(e, r, n, t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || worker_snapshot_unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function worker_snapshot_unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return worker_snapshot_arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? worker_snapshot_arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return worker_snapshot_arrayLikeToArray(r); }
function worker_snapshot_arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function worker_snapshot_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function worker_snapshot_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { worker_snapshot_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { worker_snapshot_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/**
 * PyodideWorker Snapshot Cache Module
 *
 * Optional interpreter snapshot cache (manager option snapshotCache). The
 * snapshot covers the bare interpreter plus Nagini's embedded Python modules
 * and is taken BEFORE input setup, file loading and package installation:
 * those hold live JavaScript references (hiwire entries) that Pyodide cannot
 * serialize, so they are replayed on every boot instead. Packages therefore
 * still load and import after a restore; only the interpreter boot is saved.
 *
 * The cache key hashes the embedded module sources and includes the Pyodide
 * origin, so changing either invalidates the entry by construction. Every
 * failure path degrades to a fresh boot: the cache can never brick a worker.
 */

var DB_NAME = 'nagini-snapshots';
var STORE = 'snapshots';
var KEY_PREFIX = 'nagini-snap:v1:';
function openDb() {
  return new Promise(function (resolve, reject) {
    var req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = function () {
      return req.result.createObjectStore(STORE);
    };
    req.onsuccess = function () {
      return resolve(req.result);
    };
    req.onerror = function () {
      return reject(req.error);
    };
  });
}

/**
 * Compute the cache key for a snapshot: prefix + Pyodide origin + SHA-256 of
 * the embedded Python module sources
 *
 * @param {string} cdnUrl - Resolved Pyodide base URL (part of the key)
 * @param {string[]} moduleSources - Embedded Python sources (hashed)
 * @returns {Promise<string>} Cache key
 */
function snapshotKey(_x, _x2) {
  return _snapshotKey.apply(this, arguments);
}

/**
 * Read a cached snapshot; any failure (no IndexedDB, quota, missing key)
 * resolves to null
 *
 * @param {string} key - Cache key
 * @returns {Promise<Uint8Array|null>}
 */
function _snapshotKey() {
  _snapshotKey = worker_snapshot_asyncToGenerator(/*#__PURE__*/worker_snapshot_regenerator().m(function _callee(cdnUrl, moduleSources) {
    var data, digest, hex;
    return worker_snapshot_regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          data = new TextEncoder().encode(moduleSources.join(' '));
          _context.n = 1;
          return crypto.subtle.digest('SHA-256', data);
        case 1:
          digest = _context.v;
          hex = _toConsumableArray(new Uint8Array(digest)).map(function (b) {
            return b.toString(16).padStart(2, '0');
          }).join('');
          return _context.a(2, "".concat(KEY_PREFIX).concat(cdnUrl, ":").concat(hex));
      }
    }, _callee);
  }));
  return _snapshotKey.apply(this, arguments);
}
function loadSnapshot(_x3) {
  return _loadSnapshot.apply(this, arguments);
}

/**
 * Store a snapshot and evict every other nagini-snap entry (stale runtimes
 * or module versions have no reader anymore)
 *
 * @param {string} key - Cache key
 * @param {Uint8Array} bytes - Snapshot buffer
 * @returns {Promise<boolean>} True when stored
 */
function _loadSnapshot() {
  _loadSnapshot = worker_snapshot_asyncToGenerator(/*#__PURE__*/worker_snapshot_regenerator().m(function _callee2(key) {
    var db, _t;
    return worker_snapshot_regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          _context2.p = 0;
          _context2.n = 1;
          return openDb();
        case 1:
          db = _context2.v;
          _context2.n = 2;
          return new Promise(function (resolve) {
            var req = db.transaction(STORE).objectStore(STORE).get(key);
            req.onsuccess = function () {
              return resolve(req.result || null);
            };
            req.onerror = function () {
              return resolve(null);
            };
          });
        case 2:
          return _context2.a(2, _context2.v);
        case 3:
          _context2.p = 3;
          _t = _context2.v;
          return _context2.a(2, null);
      }
    }, _callee2, null, [[0, 3]]);
  }));
  return _loadSnapshot.apply(this, arguments);
}
function storeSnapshot(_x4, _x5) {
  return _storeSnapshot.apply(this, arguments);
}

/**
 * Delete one snapshot entry (used after a failed restore)
 *
 * @param {string} key - Cache key
 * @returns {Promise<void>}
 */
function _storeSnapshot() {
  _storeSnapshot = worker_snapshot_asyncToGenerator(/*#__PURE__*/worker_snapshot_regenerator().m(function _callee3(key, bytes) {
    var db, _t2;
    return worker_snapshot_regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          _context3.p = 0;
          _context3.n = 1;
          return openDb();
        case 1:
          db = _context3.v;
          _context3.n = 2;
          return new Promise(function (resolve) {
            var tx = db.transaction(STORE, 'readwrite');
            var store = tx.objectStore(STORE);
            var keysReq = store.getAllKeys();
            keysReq.onsuccess = function () {
              var _iterator = worker_snapshot_createForOfIteratorHelper(keysReq.result),
                _step;
              try {
                for (_iterator.s(); !(_step = _iterator.n()).done;) {
                  var k = _step.value;
                  if (typeof k === 'string' && k.startsWith(KEY_PREFIX) && k !== key) {
                    store.delete(k);
                  }
                }
              } catch (err) {
                _iterator.e(err);
              } finally {
                _iterator.f();
              }
              store.put(bytes, key);
            };
            tx.oncomplete = function () {
              return resolve(true);
            };
            tx.onerror = function () {
              return resolve(false);
            };
          });
        case 2:
          return _context3.a(2, _context3.v);
        case 3:
          _context3.p = 3;
          _t2 = _context3.v;
          return _context3.a(2, false);
      }
    }, _callee3, null, [[0, 3]]);
  }));
  return _storeSnapshot.apply(this, arguments);
}
function deleteSnapshot(_x6) {
  return _deleteSnapshot.apply(this, arguments);
}
function _deleteSnapshot() {
  _deleteSnapshot = worker_snapshot_asyncToGenerator(/*#__PURE__*/worker_snapshot_regenerator().m(function _callee4(key) {
    var db, _t3;
    return worker_snapshot_regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.p = 0;
          _context4.n = 1;
          return openDb();
        case 1:
          db = _context4.v;
          _context4.n = 2;
          return new Promise(function (resolve) {
            var tx = db.transaction(STORE, 'readwrite');
            tx.objectStore(STORE).delete(key);
            tx.oncomplete = resolve;
            tx.onerror = resolve;
          });
        case 2:
          _context4.n = 4;
          break;
        case 3:
          _context4.p = 3;
          _t3 = _context4.v;
        case 4:
          return _context4.a(2);
      }
    }, _callee4, null, [[0, 3]]);
  }));
  return _deleteSnapshot.apply(this, arguments);
}
;// ../file-loader/file-loader.js
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(file_loader_typeof(e) + " is not iterable"); }
function file_loader_regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return file_loader_regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (file_loader_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, file_loader_regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, file_loader_regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), file_loader_regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", file_loader_regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), file_loader_regeneratorDefine2(u), file_loader_regeneratorDefine2(u, o, "Generator"), file_loader_regeneratorDefine2(u, n, function () { return this; }), file_loader_regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (file_loader_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function file_loader_regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } file_loader_regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { file_loader_regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, file_loader_regeneratorDefine2(e, r, n, t); }
function file_loader_asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function file_loader_asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { file_loader_asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { file_loader_asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function file_loader_typeof(o) { "@babel/helpers - typeof"; return file_loader_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, file_loader_typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || file_loader_unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function file_loader_createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = file_loader_unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
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
    var _iterator = file_loader_createForOfIteratorHelper(filesToLoad.entries()),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
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
              _iterator2 = file_loader_createForOfIteratorHelper(this.filesToLoad);
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
                      console.log("\uD83D\uDC0D [PyodideFileLoader] Loading: ".concat(file.url, " (attempt ").concat(retryCount + 1, "/").concat(maxRetries, ")"));
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
                          console.log("\uD83D\uDC0D [PyodideFileLoader] Creating directory: ".concat(dir));
                          pyodide.FS.mkdir(dir);
                        }
                      }
                      pyodide.FS.writeFile(file.path, content);
                      console.log("\uD83D\uDC0D [PyodideFileLoader] Saved: ".concat(file.path));
                      return _context.a(3, 9);
                    case 6:
                      _context.p = 6;
                      _t = _context.v;
                      retryCount++;
                      console.warn("\uD83D\uDC0D [PyodideFileLoader] Attempt ".concat(retryCount, " failed for ").concat(file.url, ":"), _t.message);
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
const capture_system_namespaceObject = "# =============================================================================\n# Output Capture System for Pyodide\n# =============================================================================\n# This module handles stdout/stderr capture and the missive system\n# Uses direct sys.stdout/stderr replacement for reliable capture in WebAssembly\n\nimport json\nimport io\nimport sys\nimport builtins\n\n# Store original stdout/stderr so we can restore them if needed\n_original_stdout = sys.stdout\n_original_stderr = sys.stderr\n\n# Create capture buffers\n_stdout_buffer = io.StringIO()\n_stderr_buffer = io.StringIO()\n\n# Storage for missive system - using builtins to ensure global availability\nif not hasattr(builtins, \"_nagini_current_missive\"):\n    builtins._nagini_current_missive = None\nif not hasattr(builtins, \"_nagini_missive_already_called\"):\n    builtins._nagini_missive_already_called = False\n\n\nclass CaptureStream:\n    \"\"\"Custom stream that captures all write operations\"\"\"\n\n    def __init__(self, buffer):\n        self.buffer = buffer\n\n    def write(self, text):\n        self.buffer.write(text)\n        return len(text)\n\n    def flush(self):\n        self.buffer.flush()\n\n    def isatty(self):\n        return False\n\n\n# Create capture streams\n_stdout_capturer = CaptureStream(_stdout_buffer)\n_stderr_capturer = CaptureStream(_stderr_buffer)\n\n\ndef reset_captures() -> None:\n    \"\"\"Reset capture buffers and activate capturing by replacing sys.stdout/stderr\"\"\"\n    # Clear buffers\n    _stdout_buffer.truncate(0)\n    _stdout_buffer.seek(0)\n    _stderr_buffer.truncate(0)\n    _stderr_buffer.seek(0)\n\n    # Clear missive data using builtins for global access\n    builtins._nagini_current_missive = None\n    builtins._nagini_missive_already_called = False\n\n    # Close any existing matplotlib figures (if matplotlib is available)\n    try:\n        import matplotlib.pyplot as plt\n\n        plt.close(\"all\")\n    except ImportError:\n        pass  # matplotlib not available, skip\n    except Exception:\n        pass  # Ignore other errors\n\n    # Activate capturing by replacing sys.stdout/stderr\n    sys.stdout = _stdout_capturer\n    sys.stderr = _stderr_capturer\n\n\ndef get_stdout() -> str:\n    \"\"\"Get captured stdout content\"\"\"\n    return _stdout_buffer.getvalue()\n\n\ndef get_stderr() -> str:\n    \"\"\"Get captured stderr content\"\"\"\n    return _stderr_buffer.getvalue()\n\n\ndef restore_original_streams() -> None:\n    \"\"\"Restore original stdout/stderr (for debugging if needed)\"\"\"\n    sys.stdout = _original_stdout\n    sys.stderr = _original_stderr\n\n\ndef get_missive() -> str | None:\n    \"\"\"\n    Get the current missive dictionary as a JSON string.\n\n    A \"missive\" is our term for structured data that user code wants to send\n    back to JavaScript. It's always a Python dictionary that gets converted\n    to JSON format (which JavaScript can easily understand).\n\n    Returns:\n        str | None: JSON string of the missive data, or None if no missive was sent\n\n    Example:\n        If user code did: missive({\"result\": 42, \"status\": \"success\"})\n        This would return: '{\"result\": 42, \"status\": \"success\"}'\n    \"\"\"\n    if builtins._nagini_current_missive is None:\n        return None  # No missive was stored\n    return json.dumps(builtins._nagini_current_missive)  # Convert Python dict to JSON string\n\n\ndef get_figures() -> list:\n    \"\"\"\n    Capture matplotlib figures and return them as base64 encoded strings.\n\n    Returns:\n        list: List of base64 encoded PNG images of matplotlib figures\n    \"\"\"\n    figures = []\n\n    try:\n        # Import matplotlib only when needed (after packages are loaded)\n        import matplotlib.pyplot as plt\n        import base64\n\n        if hasattr(plt, \"get_fignums\"):\n            try:\n                for fig_num in plt.get_fignums():\n                    plt.figure(fig_num)\n                    buf = io.BytesIO()\n                    plt.savefig(buf, format=\"png\", dpi=100, bbox_inches=\"tight\")\n                    buf.seek(0)\n                    figures.append(base64.b64encode(buf.read()).decode(\"utf-8\"))\n                    plt.close(fig_num)\n            except Exception as e:\n                print(f\"Error capturing figures: {e}\")\n    except ImportError:\n        # matplotlib not available, return empty list\n        pass\n    except Exception as e:\n        print(f\"Error importing matplotlib: {e}\")\n\n    return figures\n\n\ndef missive(data):\n    \"\"\"Send structured data back to JavaScript (once per execution)\n\n    Runs while user output is being captured, so it must not print:\n    anything written here would end up in the user's stdout.\n    \"\"\"\n    if builtins._nagini_missive_already_called:\n        raise ValueError(\n            \"missive() can only be called once per execution. \"\n            \"If you need to send multiple pieces of data, \"\n            \"put them all in one dictionary.\"\n        )\n    builtins._nagini_current_missive = data\n    builtins._nagini_missive_already_called = True\n\n\n# Make the missive function available globally: it is the one name (with\n# input) deliberately exposed to user code. Everything else in this module\n# is reached by the worker through a module reference, never by name lookup\n# in the user's namespace.\nbuiltins.missive = missive\n\n\ndef detect_shadowed_names(user_globals) -> list:\n    \"\"\"Names rebound by user code in its globals, hiding the built-ins\n    Nagini exposes (missive, input). The worker calls this after each\n    default-namespace execution to emit a one-time warning.\"\"\"\n    shadowed = []\n    for name in (\"missive\", \"input\"):\n        if name in user_globals and user_globals[name] is not getattr(builtins, name, None):\n            shadowed.append(name)\n    return shadowed\n";
;// ../python/code_transformation.py
const code_transformation_namespaceObject = "# =============================================================================\n# Code transformation for async input support\n# =============================================================================\n# Le builtin input() est remplacé côté worker par une coroutine asynchrone\n# (voir worker-input.js). Il faut donc préfixer d'un await les vrais appels\n# input(). La détection et la réécriture se font sur l'AST : seuls les appels\n# au builtin input sont touchés, jamais un identifiant comme some_func__input\n# ni une méthode obj.input(). Le code est exécuté par runPythonAsync, qui\n# autorise le await de premier niveau, donc on n'enveloppe pas le code dans une\n# fonction : les variables de niveau module restent dans les globals.\n\nimport ast\n\n\nclass _AwaitInputTransformer(ast.NodeTransformer):\n    \"\"\"Préfixe d'un await chaque appel au builtin input() exécutable au niveau\n    module ou dans une fonction async. Les appels situés dans une fonction\n    synchrone ou un lambda sont laissés tels quels : un await y serait invalide\n    et casserait tout le programme.\"\"\"\n\n    def __init__(self):\n        self.inserted = False\n        self._sync_scope_depth = 0\n\n    def visit_FunctionDef(self, node):\n        self._sync_scope_depth += 1\n        self.generic_visit(node)\n        self._sync_scope_depth -= 1\n        return node\n\n    def visit_Lambda(self, node):\n        self._sync_scope_depth += 1\n        self.generic_visit(node)\n        self._sync_scope_depth -= 1\n        return node\n\n    def visit_ClassDef(self, node):\n        # un corps de classe est un scope propre où await est toujours\n        # invalide, même au niveau module\n        self._sync_scope_depth += 1\n        self.generic_visit(node)\n        self._sync_scope_depth -= 1\n        return node\n\n    def visit_AsyncFunctionDef(self, node):\n        # await redevient valide ici, même quand la fonction async est définie\n        # à l'intérieur d'une fonction synchrone : on repart de zéro\n        saved = self._sync_scope_depth\n        self._sync_scope_depth = 0\n        self.generic_visit(node)\n        self._sync_scope_depth = saved\n        return node\n\n    def visit_Call(self, node):\n        self.generic_visit(node)\n        is_input_builtin = isinstance(node.func, ast.Name) and node.func.id == \"input\"\n        if is_input_builtin and self._sync_scope_depth == 0:\n            self.inserted = True\n            return ast.Await(value=node)\n        return node\n\n\ndef _rewrite_input_calls(code):\n    \"\"\"Renvoie le code réécrit (await input) si au moins un appel a été\n    transformé, sinon None. Laisse remonter SyntaxError si le code ne parse\n    pas, pour que l'erreur soit reportée telle quelle à l'exécution.\"\"\"\n    tree = ast.parse(code)\n    transformer = _AwaitInputTransformer()\n    new_tree = transformer.visit(tree)\n    if not transformer.inserted:\n        return None\n    ast.fix_missing_locations(new_tree)\n    return ast.unparse(new_tree)\n\n\ndef prepare_code_for_async_input(code):\n    \"\"\"Réécrit les appels input() en await input(). Renvoie le code inchangé si\n    aucun vrai appel input() n'est présent ou si le code ne parse pas.\"\"\"\n    try:\n        rewritten = _rewrite_input_calls(code)\n    except SyntaxError:\n        return code\n    return code if rewritten is None else rewritten\n\n\ndef transform_code_for_execution(code):\n    \"\"\"Transforme le code utilisateur pour le support de input() asynchrone.\n\n    Idempotent vis-à-vis du code sans input() : il est renvoyé inchangé.\"\"\"\n    return prepare_code_for_async_input(code)\n";
;// ../python/pyodide_utilities.py
const pyodide_utilities_namespaceObject = "# =============================================================================\n# Pyodide Utilities\n# =============================================================================\n# This module contains utility functions for Pyodide environment setup\n\n\ndef setup_matplotlib():\n    \"\"\"Set up matplotlib configuration if the package is available\"\"\"\n    try:\n        import matplotlib\n        import matplotlib.pyplot as plt\n\n        # Use the non-interactive 'agg' backend, which is required for rendering in a worker.\n        plt.switch_backend(\"agg\")\n\n        # Pyodide n'embarque que les polices DejaVu : pointer sans-serif\n        # vers Arial déclenchait un warning findfont sur chaque rendu\n        matplotlib.rcParams[\"font.family\"] = \"sans-serif\"\n        matplotlib.rcParams[\"font.sans-serif\"] = [\"DejaVu Sans\"]\n        matplotlib.rcParams[\"text.usetex\"] = False\n\n        # Override plt.show() to prevent display attempts\n        def custom_show(*args, **kwargs):\n            pass  # No-op since we capture figures manually\n\n        plt.show = custom_show\n        print(\"🎨 Matplotlib configured successfully with 'agg' backend and font caching disabled\")\n    except ImportError:\n        # matplotlib not available, skip setup\n        pass\n    except Exception as e:\n        print(f\"Warning: Could not configure matplotlib: {e}\")\n\n\n# Additional utility functions can be added here as needed\n";
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
    var packages, micropipPackages, filesToLoad, pyodideCdnUrl, snapshotCache, cdnUrl, _yield$import, loadPyodide, moduleSources, snapshotRestored, snapKey, cached, pythonModules, _i, _pythonModules, module, bytes, loader, toLoad, loaded, micropip, _t, _t2, _t3, _t4, _t5;
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
          packages = data.packages, micropipPackages = data.micropipPackages, filesToLoad = data.filesToLoad, pyodideCdnUrl = data.pyodideCdnUrl, snapshotCache = data.snapshotCache; // Use provided CDN URL or fall back to default
          cdnUrl = pyodideCdnUrl || worker_config_PYODIDE_WORKER_CONFIG.PYODIDE_CDN; // Minimal init logging
          _context2.p = 2;
          _context2.n = 3;
          return import(/* webpackIgnore: true */"".concat(cdnUrl, "pyodide.mjs"));
        case 3:
          _yield$import = _context2.v;
          loadPyodide = _yield$import.loadPyodide;
          moduleSources = [capture_system_namespaceObject, code_transformation_namespaceObject, pyodide_utilities_namespaceObject];
          snapshotRestored = false;
          snapKey = null; // Snapshot cache: restore the interpreter (plus Nagini's Python modules)
          // from IndexedDB when a matching snapshot exists. Every failure falls
          // back to a fresh boot
          if (!snapshotCache) {
            _context2.n = 13;
            break;
          }
          _context2.p = 4;
          _context2.n = 5;
          return snapshotKey(cdnUrl, moduleSources);
        case 5:
          snapKey = _context2.v;
          _context2.n = 6;
          return loadSnapshot(snapKey);
        case 6:
          cached = _context2.v;
          if (!cached) {
            _context2.n = 11;
            break;
          }
          _context2.p = 7;
          _context2.n = 8;
          return loadPyodide({
            indexURL: cdnUrl,
            _loadSnapshot: cached
          });
        case 8:
          workerState.pyodide = _context2.v;
          snapshotRestored = true;
          worker_handlers_postInfo('[Snapshot] Interpreter restored from cache');
          _context2.n = 11;
          break;
        case 9:
          _context2.p = 9;
          _t = _context2.v;
          _context2.n = 10;
          return deleteSnapshot(snapKey);
        case 10:
          worker_handlers_postWarning("[Snapshot] Restore failed, booting fresh: ".concat(_t.message));
        case 11:
          _context2.n = 13;
          break;
        case 12:
          _context2.p = 12;
          _t2 = _context2.v;
          worker_handlers_postWarning("[Snapshot] Cache unavailable: ".concat(_t2.message));
        case 13:
          if (workerState.pyodide) {
            _context2.n = 15;
            break;
          }
          _context2.n = 14;
          return loadPyodide(worker_handlers_objectSpread({
            indexURL: cdnUrl
          }, snapshotCache && snapKey ? {
            _makeSnapshot: true
          } : {}));
        case 14:
          workerState.pyodide = _context2.v;
        case 15:
          // Write the bundled Python modules to the filesystem and import them by
          // reference. Nothing is executed in the interpreter's global namespace:
          // user code cannot shadow or replace the capture infrastructure by
          // rebinding names, it only sees the two builtins deliberately exposed
          // (missive, input). A restored snapshot already contains the files and
          // the imported modules
          if (!snapshotRestored) {
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
              workerState.pyodide.FS.writeFile(module.name, module.content);
            }
          }

          // Importing capture_system also installs builtins.missive (instant on a
          // restored snapshot: the modules are already in sys.modules)
          workerState.captureSystem = workerState.pyodide.pyimport('capture_system');
          workerState.codeTransformation = workerState.pyodide.pyimport('code_transformation');
          workerState.pyodideUtilities = workerState.pyodide.pyimport('pyodide_utilities');

          // Activate output capture
          workerState.captureSystem.reset_captures();

          // Snapshot point: the interpreter holds no JavaScript references yet.
          // Everything after this line (input bridge, loaded files, packages)
          // creates hiwire entries that Pyodide cannot serialize, so it is
          // replayed on every boot instead of being part of the snapshot
          if (!(snapshotCache && snapKey && !snapshotRestored)) {
            _context2.n = 20;
            break;
          }
          _context2.p = 16;
          bytes = workerState.pyodide.makeMemorySnapshot();
          _context2.n = 17;
          return storeSnapshot(snapKey, bytes);
        case 17:
          if (!_context2.v) {
            _context2.n = 18;
            break;
          }
          worker_handlers_postInfo("[Snapshot] Interpreter snapshot cached (".concat((bytes.byteLength / 1e6).toFixed(1), " MB)"));
        case 18:
          _context2.n = 20;
          break;
        case 19:
          _context2.p = 19;
          _t3 = _context2.v;
          worker_handlers_postWarning("[Snapshot] Could not cache interpreter: ".concat(_t3.message));
        case 20:
          _context2.n = 21;
          return setupInputHandling(workerState.pyodide);
        case 21:
          if (!(filesToLoad && filesToLoad.length > 0)) {
            _context2.n = 25;
            break;
          }
          _context2.p = 22;
          loader = new PyodideFileLoader(filesToLoad);
          _context2.n = 23;
          return loader.loadFiles(workerState.pyodide);
        case 23:
          _context2.n = 25;
          break;
        case 24:
          _context2.p = 24;
          _t4 = _context2.v;
          console.error("Failed to load custom files:", _t4);
          throw _t4;
        case 25:
          if (!((packages === null || packages === void 0 ? void 0 : packages.length) > 0)) {
            _context2.n = 26;
            break;
          }
          _context2.n = 26;
          return loadPackages(packages, workerState);
        case 26:
          if (!((micropipPackages === null || micropipPackages === void 0 ? void 0 : micropipPackages.length) > 0)) {
            _context2.n = 29;
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
            _context2.n = 29;
            break;
          }
          worker_handlers_postInfo("[Micropip] Installing ".concat(toLoad.length, " packages: ").concat(toLoad.join(", "), "..."));
          _context2.n = 27;
          return workerState.pyodide.loadPackage("micropip");
        case 27:
          micropip = workerState.pyodide.pyimport("micropip");
          _context2.n = 28;
          return micropip.install(toLoad);
        case 28:
          toLoad.forEach(function (pkg) {
            return workerState.micropipPackagesLoaded.add(pkg);
          });
          worker_handlers_postInfo("[Micropip] Packages installed successfully.");
        case 29:
          // Set up matplotlib if it was loaded
          try {
            workerState.pyodideUtilities.setup_matplotlib();
          } catch (e) {
            // Matplotlib setup skipped (not available)
          }
          workerState.isInitialized = true;
          self.postMessage({
            type: "ready",
            snapshotRestored: snapshotRestored
          });
          _context2.n = 31;
          break;
        case 30:
          _context2.p = 30;
          _t5 = _context2.v;
          workerState.pyodide = null;
          workerState.isInitialized = false;
          worker_handlers_postError("".concat(worker_config_PYODIDE_WORKER_CONFIG.MESSAGES.INIT_FAILED, ": ").concat(_t5.message));
        case 31:
          return _context2.a(2);
      }
    }, _callee2, null, [[22, 24], [16, 19], [7, 9], [4, 12], [2, 30]]);
  }));
  return _handleInit.apply(this, arguments);
}


/**
 * @typedef {Object} WorkerState
 * @property {PyodideAPI|null} pyodide - Pyodide instance
 * @property {boolean} isInitialized - Whether Pyodide is initialized
 * @property {Set<string>} packagesLoaded - Set of loaded package names
 * @property {Set<string>} micropipPackagesLoaded - Set of loaded micropip package names
 * @property {Object|null} captureSystem - PyProxy of the capture_system module
 * @property {Object|null} codeTransformation - PyProxy of the code_transformation module
 * @property {Object|null} pyodideUtilities - PyProxy of the pyodide_utilities module
 * @property {Set<string>} shadowWarnedNames - Built-in names already reported as shadowed
 */

/**
 * @typedef {Object} InitMessage
 * @property {'init'} type - Message type
 * @property {string[]} packages - Array of package names to install
 * @property {string[]} [micropipPackages] - Optional array of package names to install with micropip
 * @property {Array<FileToLoad>} filesToLoad - Files to load into filesystem
 * @property {string} [pyodideCdnUrl] - Optional custom Pyodide CDN URL (for local/offline use)
 * @property {boolean} [snapshotCache] - Cache the bare interpreter as a memory snapshot in IndexedDB
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
  micropipPackagesLoaded: new Set(),
  /** @type {Object|null} PyProxy of the capture_system module (set at init) */
  captureSystem: null,
  /** @type {Object|null} PyProxy of the code_transformation module (set at init) */
  codeTransformation: null,
  /** @type {Object|null} PyProxy of the pyodide_utilities module (set at init) */
  pyodideUtilities: null,
  /** @type {Set<string>} Built-in names already reported as shadowed by user code */
  shadowWarnedNames: new Set()
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
    var _e$data, _t;
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
          // Error during message handling; echo the request id (if any) so the
          // manager can reject the matching pending promise
          self.postMessage({
            type: "error",
            id: (_e$data = e.data) === null || _e$data === void 0 ? void 0 : _e$data.id,
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