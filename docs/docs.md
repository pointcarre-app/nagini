# Nagini Documentation

**Complete Guide to Python-in-Browser Execution via Pyodide**

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [API Reference](#api-reference)
4. [Features](#features)
5. [Testing](#testing)
6. [Development](#development)
7. [Licensing](#licensing)
8. [Troubleshooting](#troubleshooting)

---

## Overview

Nagini is a production-ready Python execution system for web browsers supporting two backends: **Pyodide WebAssembly** (full-featured with automatic blob workers) and **Brython** (lightweight JavaScript transpilation). It provides a clean, modular architecture with worker-based execution for Pyodide, interactive input handling, matplotlib visualization, and remote module loading capabilities.

### Use Cases

Nagini enables a wide range of applications across different domains:

- **Data Analysis & Visualization**: Interactive dashboards, scientific computing, statistical analysis
- **Educational Platforms**: Coding tutorials, interactive learning environments, programming courses
- **Development Tools**: Online IDEs, code playgrounds, prototyping environments
- **Research Applications**: Scientific simulations, data exploration, academic research tools
- **Business Intelligence**: Report generation, data processing, analytics platforms
- **Training & Consulting**: Professional development tools, skill assessment platforms

### Key Benefits

- **Dual Backend Support**: Choose Pyodide (full-featured) or Brython (lightweight, instant startup)
- **Automatic Blob Workers**: Cross-origin compatibility for Pyodide (Flask, Django, etc.)
- **Isolated Execution**: Python runs in web workers (Pyodide) or main thread (Brython)
- **Interactive Support**: Natural `input()` function support with multiple interaction modes (Pyodide only)
- **Visualization Ready**: Automatic matplotlib figure capture and display (Pyodide only)
- **Micropip Support**: Install packages from PyPI using `micropip` (Pyodide only).
- **Module Loading**: Load Python modules from S3/URLs at runtime (Pyodide only)
- **Namespace Isolation**: Complete variable isolation between executions
- **Unified Test Suite**: Comprehensive side-by-side testing with tactical turtle graphics (Brython) and scientific computing (Pyodide)
- **Cross-Origin Testing**: Real-world Flask integration with automatic blob worker creation
- **Open Source**: Licensed under GNU Affero General Public License v3.0 (AGPL-3.0)

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          Main Thread                            │
│                                                                 │
│    ┌─────────────────┐    ┌─────────────────────────────────┐   │
│    │     Nagini      │    │       PyodideManager            │   │
│    │                 │    │                                 │   │
│    │ createManager() │───►│ executeAsync()                  │   │
│    │ waitForReady()  │    │ queueInput()                    │   │
│    │ executeFromUrl()│    │ fs()                            │   │
│    └─────────────────┘    │ setInputCallback()              │   │
│                           └─────────────────────────────────┘   │
│                                            │                    │
│                                            │                    │
│    ┌─────────────────────────────────────────────────────────┐  │
│    │         PyodideManagerStaticExecutor                    │  │
│    │                                                         │  │
│    │ executeFile()     - Fire-and-forget execution           │  │
│    │ executeAsync()    - Promise-based execution             │  │
│    │                                                         │  │
│    │ Static methods for pure, testable execution logic       │  │
│    └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
  │
  │ postMessage()
  │
┌─────────────────────────────────────────────────────────────────┐
│                        Web Worker                               │
│                                                                 │
│   ┌─────────────────┐    ┌─────────────────────────────────┐    │
│   │ PyodideWorker   │    │   PyodideWorkerHandlers         │    │
│   │                 │    │                                 │    │
│   │ Entry Point     │───►│ handleInit()                    │    │
│   │ Dynamic Import  │    │ handleExecute()                 │    │
│   │ State Mgmt      │    │ handleFSOperation()             │    │
│   └─────────────────┘    │ loadPackages()                  │    │
│                          │ captureOutputs()                │    │
│                          └─────────────────────────────────┘    │
│                                           │                     │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │         PyodideWorkerConfig                             │   │
│   │                                                         │   │
│   │ PYODIDE_CDN: "https://cdn.jsdelivr.net/pyodide/v0.27.7" │   │
│   │ MESSAGES: { error/warning/info constants }              │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              Pyodide Runtime                            │   │
│   │                                                         │   │
│   │ Python Interpreter + Standard Library                   │   │
│   │ Package Management (pip/micropip)                       │   │
│   │ Virtual Filesystem                                      │   │
│   │ Matplotlib Backend                                      │   │
│   │ Input/Output Capture System                             │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

#### Main Thread Components

**Nagini** (High-Level API)
- `createManager()` - Factory function for PyodideManager instances
- `waitForReady()` - Initialization completion helper
- `executeFromUrl()` - URL-based code execution

**PyodideManager** (Core Manager)
- Worker lifecycle management
- Message routing and handling
- Input queue and callback management
- Filesystem operation proxying
- Execution history tracking

**PyodideManagerStaticExecutor** (Execution Logic)
- Pure execution functions separated from manager state
- `executeFile()` - Fire-and-forget execution
- `executeAsync()` - Promise-based execution with results
- Parameter validation and namespace handling

#### Worker Components

**PyodideWorker** (Entry Point)
- Worker initialization and state management
- Dynamic import of handler modules
- Message delegation to appropriate handlers

**PyodideWorkerHandlers** (Business Logic)
- `handleInit()` - Pyodide and package initialization
- `handleExecute()` - Python code execution with namespace support
- `handleFSOperation()` - Virtual filesystem operations
- `loadPackages()` - Smart package loading with caching
- `captureOutputs()` - stdout/stderr/matplotlib capture

**PyodideWorkerConfig** (Configuration)
- Centralized constants and error messages
- Pyodide CDN version configuration
- Message templates for consistent communication

---

## API Reference

### Nagini (High-Level API)

#### `createManager(backend, packages, micropipPackages, filesToLoad, workerPath)`

Creates a new manager instance with strict type validation.

**Parameters:**
- `backend` (String): Backend to use ('pyodide' or 'brython').
- `packages` (Array): Pyodide packages to install from the standard channel (e.g., `["numpy", "pandas"]`).
- `micropipPackages` (Array): Python packages to install from PyPI using `micropip` (e.g., `["requests", "beautifulsoup4"]`).
- `filesToLoad` (Array): Files to load into the virtual filesystem.
- `workerPath` (String): Path to the web worker file (for Pyodide).

**Returns:** `PyodideManager` or `BrythonManager` instance.

**Example:**
```javascript
const manager = await Nagini.createManager(
    'pyodide',
    ["sympy", "matplotlib"],
    ["antlr4-python3-runtime"],
    [
        {
            url: "https://example.com/modules/utils.py",
            path: "utils/utils.py"
        }
    ],
    "./src/pyodide/worker/worker.js"         // Development (ES6 modules)
    // "./src/pyodide/worker/worker-dist.js" // Production (bundled)
);
```

#### `waitForReady(manager, timeout)`

Waits for manager initialization to complete.

**Parameters:**
- `manager` (PyodideManager): Manager instance
- `timeout` (Number): Timeout in milliseconds (default: 30000)

**Returns:** `Promise<void>`

**Example:**
```javascript
await Nagini.waitForReady(manager, 60000); // 60 second timeout
```

#### `executeFromUrl(url, manager, namespace)`

Executes Python code from a URL with optional namespace isolation.

**Parameters:**
- `url` (String): URL to fetch Python code from
- `manager` (PyodideManager): Manager instance
- `namespace` (Object, optional): Execution namespace for isolation

**Returns:** `Promise<ExecutionResult>`

**Example:**
```javascript
const result = await Nagini.executeFromUrl(
    "./scripts/analysis.py", 
    manager,
    { data: [1, 2, 3, 4, 5] }
);
```

### PyodideManager (Core Manager)

#### `executeAsync(filename, code, namespace)`

Executes Python code asynchronously with comprehensive result tracking.

**Parameters:**
- `filename` (String): Name for tracking purposes
- `code` (String): Python code to execute
- `namespace` (Object, optional): Isolated namespace for execution

**Returns:** `Promise<ExecutionResult>`

**ExecutionResult Structure:**
```javascript
{
    filename: "test.py",
    time: 125,                    // Execution time in milliseconds
    stdout: "Hello World\n",      // Standard output
    stderr: "",                   // Standard error
    missive: {"result": 42},      // Structured data from Python
    figures: ["base64..."],       // Matplotlib figures as base64
    error: null,                  // JavaScript execution errors
    timestamp: "2025-01-01T12:00:00.000Z"
}
```

**Example:**
```javascript
const result = await manager.executeAsync("analysis.py", `
import numpy as np
data = np.array([1, 2, 3, 4, 5])
mean = np.mean(data)
print(f"Mean: {mean}")
missive({"mean": mean, "data_length": len(data)})
`);

console.log(result.stdout);   // "Mean: 3.0"
console.log(result.missive);  // {"mean": 3.0, "data_length": 5}
```

#### Input Handling Methods

**`queueInput(input)`**
Queue input for automatic provision when Python code requests it.

```javascript
manager.queueInput("Alice");
manager.queueInput("25");

await manager.executeAsync("survey.py", `
name = input("Name: ")
age = int(input("Age: "))
print(f"{name} is {age} years old")
`);
```

**`setInputCallback(callback)`**
Set a callback function for interactive input handling.

```javascript
manager.setInputCallback(async (prompt) => {
    const userInput = window.prompt(prompt);
    manager.provideInput(userInput);
});
```

**`provideInput(input)`**
Provide input to waiting Python code.

```javascript
manager.provideInput("user response");
```

**`isWaitingForInput()`**
Check if Python code is currently waiting for input.

```javascript
if (manager.isWaitingForInput()) {
    const prompt = manager.getCurrentPrompt();
    // Handle input request
}
```

#### Filesystem Operations

**`fs(operation, params)`**

Perform filesystem operations in the Pyodide environment.

**Supported Operations:**
- `writeFile` - Write content to a file
- `readFile` - Read file content
- `mkdir` - Create directory
- `exists` - Check if path exists
- `listdir` - List directory contents

**Examples:**
```javascript
// Write file
await manager.fs("writeFile", {
    path: "data/config.json",
    content: JSON.stringify({model: "gpt-4", temperature: 0.7})
});

// Read file
const content = await manager.fs("readFile", {
    path: "data/config.json"
});

// Create directory
await manager.fs("mkdir", {
    path: "data/output"
});

// Check existence
const exists = await manager.fs("exists", {
    path: "data/config.json"
});

// List directory
const files = await manager.fs("listdir", {
    path: "data"
});
```

#### Properties

- `isReady` (Boolean): Whether manager is ready for execution
- `executionHistory` (Array): Complete execution history with metadata
- `packages` (Array): List of installed packages
- `filesToLoad` (Array): Files loaded into filesystem
- `worker` (Worker): Web worker instance
- `pyodideInitPath` (String): Path to Python initialization script
- `workerPath` (String): Path to web worker file

### PyodideManagerStaticExecutor

Static utility class containing pure execution logic extracted from PyodideManager.

#### `executeFile(worker, isReady, filename, code, namespace)`

Execute Python code without waiting for result (fire-and-forget).

**Parameters:**
- `worker` (Worker): Web worker instance
- `isReady` (Boolean): Whether Pyodide is ready
- `filename` (String): Name for tracking
- `code` (String): Python code to execute
- `namespace` (Object, optional): Execution namespace

**Returns:** `void`

#### `executeAsync(worker, isReady, executionHistory, setHandleMessage, getHandleMessage, filename, code, namespace)`

Execute Python code asynchronously with result tracking.

**Parameters:**
- `worker` (Worker): Web worker instance
- `isReady` (Boolean): Whether Pyodide is ready
- `executionHistory` (Array): History array for tracking
- `setHandleMessage` (Function): Message handler setter
- `getHandleMessage` (Function): Message handler getter
- `filename` (String): Name for tracking
- `code` (String): Python code to execute
- `namespace` (Object, optional): Execution namespace

**Returns:** `Promise<ExecutionResult>`

### BrythonManager (Lightweight Backend)

The Brython backend executes Python by transpiling it to JavaScript directly in the **main thread** (no WebAssembly, no web-workers). It is great for lightweight demos such as turtle graphics but has several limitations compared to Pyodide.

**Key points**
- ✅ Instant startup – no WASM download
- ✅ Same result object shape as Pyodide for `executeAsync`
- ⚠️  No package installation (only Brython stdlib)
- ⚠️  No `input()` queue / callbacks (methods are stubs that emit console warnings)
- ⚠️  No virtual filesystem (`fs()` will throw)
- ⚠️  Runs on the UI thread – long-running scripts will block the page

#### `executeAsync(filename, code)`
Execute Python code and return a full `ExecutionResult` object (with `stdout`, `stderr`, `missive`, `time`, etc.).

```javascript
const manager = await Nagini.createManager(
    'brython',      // Use the Brython backend
    [],             // packages ignored
    [],             // micropipPackages ignored
    [],             // filesToLoad ignored
    ''              // workerPath ignored
);

await Nagini.waitForReady(manager);

const result = await manager.executeAsync('demo.py', `
from browser import document
import turtle

# Simple square
pen = turtle.Turtle()
for _ in range(4):
    pen.forward(100)
    pen.right(90)

print('Finished drawing!')
`);

console.log(result.stdout); // "Finished drawing!\n"
```

#### `executeFile(filename, code)`
Fire-and-forget wrapper around `executeAsync` (returns void).

#### Unsupported / Stubbed APIs
```javascript
manager.fs();                 // ➜ Error: not supported
manager.queueInput('data');   // ➜ Console warning (ignored)
manager.setInputCallback(cb); // ➜ Console warning (ignored)
```

Properties available: `isReady`, `executionHistory`, `packages`.

---

## Features

### Interactive Input System

Nagini provides comprehensive support for Python's `input()` function with multiple interaction modes:

#### 1. Programmatic Input Queue

Pre-queue inputs for automated execution:

```javascript
// Queue inputs before execution
manager.queueInput("Alice");
manager.queueInput("25");
manager.queueInput("Engineer");

const result = await manager.executeAsync("survey.py", `
print("Starting survey...")
name = input("What's your name? ")
age = int(input("How old are you? "))
job = input("What's your job? ")
print(f"Hello {name}, you're a {age}-year-old {job}!")
`);
```

#### 2. Interactive Callbacks

Handle input requests in real-time:

```javascript
manager.setInputCallback(async (prompt) => {
    const userInput = window.prompt(prompt || 'Enter input:');
    manager.provideInput(userInput);
});

const result = await manager.executeAsync("interactive.py", `
name = input("Enter your name: ")
print(f"Hello {name}!")
`);
```

#### 3. Custom Input UI

Build custom input interfaces:

```javascript
manager.setInputCallback(async (prompt) => {
    // Create custom input UI
    const inputElement = document.createElement('input');
    inputElement.placeholder = prompt;
    
    // Add to DOM and wait for user interaction
    document.body.appendChild(inputElement);
    
    const userInput = await new Promise(resolve => {
        inputElement.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                resolve(inputElement.value);
                inputElement.remove();
            }
        });
    });
    
    manager.provideInput(userInput);
});
```

### Matplotlib Integration

Automatic figure capture and display:

```javascript
const result = await manager.executeAsync("visualization.py", `
import matplotlib.pyplot as plt
import numpy as np

# Create multiple figures
fig1, ax1 = plt.subplots()
x = np.linspace(0, 10, 100)
y = np.sin(x)
ax1.plot(x, y)
ax1.set_title("Sine Wave")

fig2, ax2 = plt.subplots()
y2 = np.cos(x)
ax2.plot(x, y2)
ax2.set_title("Cosine Wave")

print("Figures created successfully!")
`);

console.log(result.figures.length); // 2
result.figures.forEach((base64, index) => {
    const img = document.createElement('img');
    img.src = `data:image/png;base64,${base64}`;
    img.alt = `Figure ${index + 1}`;
    document.body.appendChild(img);
});
```

### Namespace Isolation

Complete isolation between executions:

```javascript
// Namespace A
const namespaceA = { 
    value: "A", 
    multiplier: 2 
};

const resultA = await manager.executeAsync("test_A.py", `
result = value * multiplier
local_var = "only_in_A"
print(f"Result A: {result}")
missive({"result": result, "local_var": local_var})
`, namespaceA);

// Namespace B (completely isolated)
const namespaceB = { 
    value: "B", 
    multiplier: 3 
};

const resultB = await manager.executeAsync("test_B.py", `
result = value * multiplier
local_var = "only_in_B"
print(f"Result B: {result}")
missive({"result": result, "local_var": local_var})
`, namespaceB);

// Results are completely isolated
console.log(resultA.missive); // {"result": "AA", "local_var": "only_in_A"}
console.log(resultB.missive); // {"result": "BBB", "local_var": "only_in_B"}
```

### Missive System

Structured data exchange between Python and JavaScript:

```python
# Python side - can only be called once per execution
missive({
    "results": [1, 2, 3, 4, 5],
    "statistics": {
        "mean": 3.0,
        "median": 3.0,
        "std": 1.58
    },
    "status": "success"
})

# Calling missive() again raises ValueError
# missive({"another": "value"})  # Error!
```

```javascript
// JavaScript side
const result = await manager.executeAsync("analysis.py", pythonCode);
console.log(result.missive.results);     // [1, 2, 3, 4, 5]
console.log(result.missive.statistics);  // {mean: 3.0, median: 3.0, std: 1.58}
console.log(result.missive.status);      // "success"
```

### Remote Module Loading

Load remote Python modules at runtime:

```javascript
const filesToLoad = [
    {
        url: "https://example.com/modules/analytics.py",
        path: "analytics/analytics.py"
    },
    {
        url: "https://example.com/modules/utils.py",
        path: "analytics/utils.py"
    },
    {
        url: "https://example.com/modules/__init__.py",
        path: "analytics/__init__.py"
    }
];

const manager = await Nagini.createManager(
    'pyodide',
    ["numpy", "pandas"],
    [], // No micropip packages
    filesToLoad,
    "./src/pyodide/worker/worker.js"
);

await Nagini.waitForReady(manager);

// Use loaded modules
const result = await manager.executeAsync("analysis.py", `
from analytics.analytics import compute_statistics
from analytics.utils import format_results

data = [1, 2, 3, 4, 5]
stats = compute_statistics(data)
formatted = format_results(stats)
print(formatted)
missive({"statistics": stats})
`);
```

### Micropip Package Installation

In addition to the standard Pyodide packages, Nagini supports installing packages from the Python Package Index (PyPI) using `micropip`. This feature is only available for the **Pyodide backend**.

`micropip` allows you to install pure Python packages or packages with wheel files that are compatible with the Pyodide environment.

#### Usage

To install packages with `micropip`, pass an array of package names to the `micropipPackages` parameter of `Nagini.createManager`:

```javascript
const manager = await Nagini.createManager(
    'pyodide',
    [], // No standard packages
    ["requests", "beautifulsoup4"], // Install from PyPI
    [],
    "./src/pyodide/worker/worker-dist.js"
);

await Nagini.waitForReady(manager);

const result = await manager.executeAsync("network_test.py", `
import requests

try:
    response = requests.get("https://api.github.com")
    print(f"GitHub API Status: {response.status_code}")
    missive({"status": response.status_code})
except Exception as e:
    print(f"Error: {e}")
    missive({"error": str(e)})
`);

console.log(result.stdout);
// Expected output: GitHub API Status: 200
```

#### How it Works

When `micropipPackages` are provided, Nagini instructs the Pyodide worker to:
1. Load the `micropip` package itself.
2. Use `micropip.install()` to download and install the specified packages from PyPI.
3. The worker maintains a cache of installed `micropip` packages to avoid re-installing them on subsequent executions.

This process happens automatically during the manager's initialization phase.

---

## Testing

### Test Suite Overview

Nagini includes 18 comprehensive test cases covering all major features:

#### Core API Tests (Nagini)
1. **Manager Creation** - `Nagini.createManager()` with validation
2. **Initialization** - `Nagini.waitForReady()` with timeout handling
3. **URL Execution** - `Nagini.executeFromUrl()` with error handling

#### Manager Tests (PyodideManager)
4. **Direct Execution** - `executeAsync()` with result validation
5. **Namespace Functionality** - Variable access in custom namespaces
6. **Namespace Isolation** - Complete isolation between executions
7. **Execution History** - Result tracking with timestamps
8. **Worker Access** - Web worker instance validation
9. **Ready State** - Initialization state tracking
10. **Package List** - Installed package validation
11. **Files to Load** - File loading configuration
12. **Init Path** - Python initialization script path
13. **Worker Path** - Web worker script path
14. **Input Handling** - Queue system and stdout verification
15. **Matplotlib Integration** - Figure capture and base64 encoding
16. **Micropip Package Installation** - Verification of package installation from PyPI.

#### Manager Tests (BrythonManager)
17. **Simple Execution** - `executeAsync()` basic stdout validation

#### File Loading Tests (PyodideFileLoader)
18. **Remote Integration** - Remote file loading and Python imports

### Running Tests

```bash
# Start local server
python -m http.server 8000

# Open test interface
open http://localhost:8000/scenery/

# Tests run automatically on page load
# Results displayed in real-time with pass/fail indicators
```

### Test Structure

Each test follows a consistent pattern:

```javascript
static async test_name(manager) {
    const testName = "descriptive test name";
    logTestStart("Component", testName);
    
    try {
        // Test implementation
        const result = await manager.executeAsync("test.py", `
            # Python test code
        `);
        
        // Assertions
        assert(result, "Result should be returned");
        assertContains(result.stdout, "expected output");
        assertEquals(result.missive.value, expectedValue);
        
        logTestPass(testName);
        return { result, testName };
    } catch (error) {
        logTestFail(testName, error);
        throw error;
    }
}
```

### Test Coverage

- **API Coverage**: All public methods and properties
- **Error Handling**: Timeout, invalid parameters, execution errors
- **Data Types**: Validation of inputs and outputs
- **Integration**: End-to-end workflows with real Python code
- **Performance**: Execution timing and memory usage
- **Browser Support**: Works across modern browsers

---

## Development

### Project Structure

```
pca-nagini/
├── src/                           # Core source code
│   ├── nagini.js                  # High-level API
│   ├── utils/
│   │   ├── validation.js          # Parameter validation utilities
│   │   └── createBlobWorker.js    # Cross-origin worker utilities
│   ├── brython/                   # Brython backend
│   │   ├── index.html
│   │   ├── lib/
│   │   │   ├── brython.js
│   │   │   └── brython_stdlib.js
│   │   ├── manager/
│   │   │   ├── manager.js
│   │   │   ├── loader.js
│   │   │   └── executor.js
│   │   └── python/
│   │       └── turtle_min.py
│   └── pyodide/
│       ├── manager/
│       │   ├── manager.js         # Core PyodideManager class
│       │   ├── manager-static-execution.js  # Execution logic
│       │   ├── manager-input.js   # Input handling
│       │   └── manager-fs.js      # Filesystem operations
│       ├── worker/
│       │   ├── worker.js          # Worker entry point (ES6 modules)
│       │   ├── worker-config.js   # Configuration constants
│       │   ├── worker-handlers.js # Message handlers
│       │   ├── worker-execution.js # Execution logic
│       │   ├── worker-input.js    # Input handling
│       │   ├── worker-fs.js       # Filesystem operations
│       │   ├── webpack.config.cjs # Webpack bundling configuration
│       │   ├── package.json       # NPM dependencies and build scripts
│       │   ├── package-lock.json  # Dependency lock file
│       │   ├── worker-dist.js     # **Bundled worker output** (generated)
│       │   ├── bundle-worker.py   # Python bundling script (alternative)
│       │   ├── .gitignore         # Build artifacts exclusions
│       │   ├── README.md          # Worker bundling documentation
│       │   └── node_modules/      # NPM dependencies (generated)
│       ├── file-loader/
│       │   └── file-loader.js     # Remote file loading
│       └── python/
│           ├── pyodide_init.py    # Python initialization script
│           ├── capture_system.py  # Output capture system
│           ├── code_transformation.py # Code transformation utilities
│           └── pyodide_utilities.py # Python helper functions
├── scenery/                       # Testing and demo
│   ├── app.js
│   ├── index.html
│   ├── interactive-functions.js
│   └── tests/                     # Test modules
│       ├── brython-manager-tests.js
│       └── ... (other test files)
├── experiments/                   # Experimental playgrounds
│   └── brython/ (demo resources)
├── tests/                         # Flask integration examples
│   ├── flask-example.py          # Complete Flask app example
│   ├── flask-test.html           # Simple HTML test page
│   ├── DEPLOYMENT.md             # Two-port deployment guide
│   └── README.md                 # Test documentation
├── hooks/                         # Git / editor hooks
│   ├── install-hooks.sh
│   ├── pre-commit
│   └── validate_editorconfig.py
├── docs/
│   └── docs.md                   # This comprehensive documentation
├── README.md                     # Project overview
├── LICENSE
├── 3RD-PARTY.md
├── serve.py                      # Static file server for development
└── todo.md
```

### Architecture Principles

#### Separation of Concerns
- **Nagini**: High-level convenience API
- **PyodideManager**: Lifecycle and worker management
- **PyodideManagerStaticExecutor**: Pure execution logic
- **Worker Components**: Isolated execution environment

#### Modular Worker Design
- **Entry Point**: Dynamic imports and state management
- **Handlers**: Business logic for different message types
- **Configuration**: Centralized constants and messages

#### Static Execution Pattern
- Core execution logic extracted to static methods
- Improves testability with pure functions
- Clear separation between state and behavior

### Development Guidelines

#### Constructor Validation
```javascript
// Strict type validation - no defaults or coercion
if (!Array.isArray(packages)) {
    throw new Error("packages must be an array");
}
if (typeof workerPath !== "string") {
    throw new Error("workerPath must be a string");
}
```

#### Error Handling
```javascript
try {
    const result = await manager.executeAsync("test.py", code);
    // Handle success
} catch (error) {
    console.error("Execution failed:", error.message);
    // Handle failure
}
```

#### Message Handler Pattern (Core Architecture)

The **Handler Replacement Pattern** is a fundamental architectural technique that enables Promise-based APIs over web worker message passing. This pattern is essential for converting asynchronous message communication into synchronous-looking JavaScript code.

**The Problem:**
Web workers communicate via messages, not direct function calls. When we send a message to the worker, we get a response later via `handleMessage()`. But JavaScript functions expect immediate return values or Promises.

**Normal Flow:**
1. User calls: `manager.executeAsync("test.py", "print('hello')")`
2. Manager sends message to worker
3. Worker executes Python code  
4. Worker sends result back
5. `handleMessage()` receives the result
6. But how do we get the result back to the original caller?

**The Solution - Handler Replacement:**
We temporarily "hijack" the `handleMessage` function to capture the specific result for the specific caller, then restore the original function.

**Step-by-Step Process:**
1. **Save Original Handler**: `const originalHandler = this.getHandleMessage()`
2. **Replace with Interceptor**: Replace `handleMessage` with a custom function that:
   - Still calls the original handler (for normal processing)  
   - BUT ALSO checks if this is the result we're waiting for
   - If yes: resolve the Promise with the result
   - Then restore the original `handleMessage`
3. **Send Message**: Send the message to the worker
4. **Capture Result**: When the result comes back, our custom handler catches it
5. **Restore Handler**: Original handler is restored for future calls

**Why This is Safe:**
JavaScript is single-threaded, so only one execution can happen at a time. No race conditions are possible - each call completes before the next starts.

**Implementation Example:**
```javascript
// Core implementation of the handler replacement pattern
static async executeAsync(worker, isReady, executionHistory, setHandleMessage, getHandleMessage, filename, code, namespace) {
    return new Promise((resolve, reject) => {
        // Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {
            setHandleMessage(originalHandler);
            reject(new Error("Execution timeout after 30 seconds"));
        }, 30000);

        // Save original handler and replace with interceptor
        const originalHandler = getHandleMessage();
        
        setHandleMessage(function(data) {
            try {
                // Call original handler for normal processing
                originalHandler.call(this, data);
                
                // Check if this is the result we're waiting for
                if (data.type === "result") {
                    clearTimeout(timeoutId);
                    const result = executionHistory[executionHistory.length - 1];
                    resolve(result);
                    // Restore original handler
                    setHandleMessage(originalHandler);
                } else if (data.type === "error") {
                    clearTimeout(timeoutId);
                    setHandleMessage(originalHandler);
                    reject(new Error(`Execution error: ${data.message}`));
                }
            } catch (error) {
                clearTimeout(timeoutId);
                setHandleMessage(originalHandler);
                reject(new Error(`Handler error: ${error.message}`));
            }
        });

        // Send execution message to worker
        worker.postMessage({
            type: "execute",
            filename,
            code,
            namespace
        });
    });
}
```

**Analogy:**
Like temporarily replacing your mailbox with a special one that:
1. Still puts mail in your house (original function)
2. But ALSO checks for a specific letter you're expecting  
3. When that letter arrives, immediately gives it to you
4. Then puts your normal mailbox back

**Pattern Usage in Nagini:**
- **PyodideManagerStaticExecutor.executeAsync()**: Core execution with results
- **PyodideManagerFS._sendFSCommand()**: Filesystem operations  
- **PyodideManagerInput**: Input handling (similar pattern)

This pattern enables clean, Promise-based APIs while maintaining the performance benefits of web worker execution.

### Worker Bundling System

Nagini includes a comprehensive **webpack-based bundling system** to handle cross-origin deployment scenarios, particularly for Flask apps and other web frameworks.

#### Problem Solved

When creating web workers from blob URLs across different origins (e.g., loading Nagini from port 8010 while Flask runs on port 5001), ES6 dynamic imports fail due to CORS restrictions:

```javascript
// This fails in cross-origin blob workers:
import { handleMessage } from './worker-handlers.js';  // CORS error
```

#### Solution: Two Worker Versions

**1. Development Version (`worker.js`)**
- Uses ES6 imports for clean, modular development
- Perfect for same-origin development
- Easy debugging and hot reloading

**2. Production Version (`worker-dist.js`)**
- Single bundled file with all dependencies resolved
- No ES6 imports - works in any blob worker context
- Optimized with webpack + babel transpilation
- ~64KB compressed bundle

#### Build Process

```bash
# Navigate to worker directory
cd src/pyodide/worker

# Install dependencies (first time only)
npm install

# Build production bundle
npm run build                # Creates worker-dist.js (production)
npm run build-dev           # Creates worker-dist.js (development mode)
```

#### Webpack Configuration

The bundling system uses a specialized webpack configuration optimized for web workers:

```javascript
// webpack.config.cjs
module.exports = {
  mode: 'production',
  entry: './worker.js',
  output: {
    filename: 'worker-dist.js',
    globalObject: 'self',     // Important for web workers
  },
  target: 'webworker',        // Optimize for web worker environment
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env', {
            targets: { browsers: ['last 2 versions'] }
          }]]
        }
      }
    }]
  }
};
```

#### Usage Examples

**Same-Origin Development:**
```javascript
const manager = await Nagini.createManager(
    'pyodide',
    ["numpy"],
    [], // No micropip packages
    [],
    "./src/pyodide/worker/worker.js"        // ES6 modules version
);
```

**Cross-Origin Production (Flask):**
```javascript
// Direct bundled worker usage
const manager = await Nagini.createManager(
    'pyodide',
    ["numpy"],
    [], // No micropip packages
    [],
    "http://127.0.0.1:8010/src/pyodide/worker/worker-dist.js"  // Bundled version
);

// Or with blob worker for maximum compatibility
async function createBlobWorkerUrl(workerPath) {
    const response = await fetch(workerPath);
    const workerCode = await response.text();
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
}

const workerPath = "http://127.0.0.1:8010/src/pyodide/worker/worker-dist.js";
const blobWorkerUrl = await createBlobWorkerUrl(workerPath);

const manager = await Nagini.createManager(
    'pyodide',
    ["numpy"],
    [], // No micropip packages
    [],
    blobWorkerUrl  // Blob URL works across any origin
);
```

#### Bundle Contents

The bundled worker includes all necessary modules:
- `worker.js` (entry point)
- `worker-handlers.js` (message handling)
- `worker-execution.js` (Python execution)
- `worker-fs.js` (filesystem operations)
- `worker-input.js` (input handling)
- `worker-config.js` (configuration constants)

#### Deployment Benefits

- **Flask Integration**: Seamless integration with Flask and other web frameworks
- **CORS Compatibility**: No cross-origin restrictions with blob workers
- **CDN Distribution**: Single file can be served from CDNs
- **Performance**: Optimized bundle with minimal overhead
- **Browser Support**: Works across all modern browsers

---

## Licensing

Nagini is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

### Key Requirements:
- **Source Code Sharing**: Any modifications must be shared under the same license
- **Network Use**: Users of network services must have access to source code
- **Derivative Works**: Must use compatible licenses
- **Copyright Notices**: Must be preserved

### What This Means:
- ✅ **Free to use** for any purpose (personal, educational, commercial, research)
- ✅ **Modify and distribute** with source code sharing
- ✅ **Commercial use** allowed with copyleft compliance
- ✅ **Network services** permitted with source availability

For complete details, see the [LICENSE](LICENSE) file.

---

## Troubleshooting

### Common Issues

**`TypeError: Failed to fetch dynamically imported module`**
- **Cause**: Cross-origin restrictions on dynamic imports in blob workers.
- **Solution**: Use the bundled `worker-dist.js` instead of `worker.js`. See [Worker Bundling System](#worker-bundling-system).

**`Execution timeout after 30 seconds`**
- **Cause**: Python code is taking too long to execute, or Pyodide initialization is slow.
- **Solution**:
    1. Increase the timeout in `Nagini.waitForReady()`.
    2. Optimize your Python code for performance.
    3. Ensure a stable network connection for package loading.

**`ModuleNotFoundError: No module named '...'`**
- **Cause**:
    1. The required package was not included in the `packages` or `micropipPackages` array.
    2. The package is not compatible with Pyodide.
    3. The module is from a custom file that was not loaded correctly.
- **Solution**:
    1. Add the package to the `packages` or `micropipPackages` array during manager creation.
    2. Check the Pyodide or PyPI documentation for package compatibility.
    3. Verify the `filesToLoad` configuration for custom modules.

### Reporting Bugs

Please report any bugs or issues on our [GitHub Issues](https://github.com/your-repo/issues) page. Include the following details:
- Browser and version
- Operating system
- Steps to reproduce the issue
- Console logs and error messages
- A minimal, reproducible example if possible

We appreciate your contributions to making Nagini better! 