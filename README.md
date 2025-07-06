# Nagini

**Python in the Browser via Pyodide WebAssembly**

A production-ready Python execution system for web applications featuring
worker-based architecture, interactive input handling, matplotlib visualization,
and remote module loading. Perfect for data analysis tools, educational
platforms, scientific computing applications, and interactive development
environments.

## Core Features

- **🚀 Worker Architecture** - Python execution isolated in web workers
- **🎮 Interactive Input** - Natural `input()` support with queue/callbacks
- **📊 Matplotlib Integration** - Automatic figure capture as base64 images
- **🔗 Remote Module Loading** - Load Python modules from URLs with retry logic
- **🎯 Namespace Isolation** - Complete execution isolation between runs
- **💬 Structured Data Exchange** - "Missive" system for Python ↔ JavaScript communication
- **📁 Filesystem Access** - Complete file operations (`writeFile`, `readFile`, `mkdir`, etc.)
- **🔧 Backend Agnostic** - Designed for multiple Python backends (currently supports Pyodide)

## Quick Start

```javascript
import { Nagini } from './src/nagini.js';

// 1. Create manager (defaults to 'pyodide' backend)
const manager = await Nagini.createManager(
    'pyodide',                           // Backend (currently only 'pyodide')
    ["sympy", "matplotlib"],             // Python packages
    [],                                  // Files to load (URL objects)
    "./src/pyodide/python/pyodide_init.py",  // Init script
    "./src/pyodide/worker/worker.js"     // Worker script
);

// 2. Wait for initialization
await Nagini.waitForReady(manager);

// 3. Execute Python code
const result = await manager.executeAsync("demo.py", `
import sympy as sp
x = sp.Symbol('x')
equation = x**2 - 4
solutions = sp.solve(equation, x)
print(f"Solutions: {solutions}")
missive({"solutions": [str(s) for s in solutions]})
`);

console.log(result.stdout);   // "Solutions: [-2, 2]"
console.log(result.missive);  // {"solutions": ["-2", "2"]}
```

## Interactive Input

```javascript
// Queue inputs programmatically
manager.queueInput("Alice");
manager.queueInput("25");

const result = await manager.executeAsync("survey.py", `
name = input("What's your name? ")
age = int(input("How old are you? "))
print(f"Hello {name}! You are {age} years old.")
`);

// Or use interactive callbacks
manager.setInputCallback(async (prompt) => {
    const input = window.prompt(prompt);
    manager.provideInput(input);
});
```

## Matplotlib Visualization

```javascript
const result = await manager.executeAsync("plot.py", `
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
y = np.sin(x)
plt.plot(x, y)
plt.title("Sine Wave")
print("Plot created!")
`);

// Access captured figures
result.figures.forEach((base64, i) => {
    const img = document.createElement('img');
    img.src = `data:image/png;base64,${base64}`;
    document.body.appendChild(img);
});
```

## Remote Module Loading

```javascript
const filesToLoad = [
    {
        url: "https://example.com/modules/math_utils.py",
        path: "utils/math_utils.py"
    }
];

const manager = await Nagini.createManager(
    'pyodide',
    ["numpy"], 
    filesToLoad,  // Load from URLs
    "./src/pyodide/python/pyodide_init.py",
    "./src/pyodide/worker/worker.js"
);

await Nagini.waitForReady(manager);

// Use loaded modules
const result = await manager.executeAsync("test.py", `
from utils.math_utils import calculate_fibonacci
result = calculate_fibonacci(10)
print(f"Fibonacci(10) = {result}")
`);
```

## Architecture

```
Main Thread                          Web Worker
┌─────────────────────┐             ┌─────────────────────┐
│                     │             │                     │
│  Nagini             │             │  PyodideWorker      │
│  ├─ createManager   │             │  ├─ Entry Point     │
│  ├─ waitForReady    │    Worker   │  ├─ Dynamic Imports │
│  ├─ executeFromUrl  │   Messages  │  ├─ Message         │
│  └─ Backend Support │◄───────────►│  │   Handlers       │
│                     │             │  └─ Configuration   │
│  PyodideManager     │             │                     │
│  ├─ executeAsync    │             │  Pyodide Runtime    │
│  ├─ executeFile     │             │  ├─ Python Env      │
│  ├─ queueInput      │             │  ├─ Package Mgmt    │
│  ├─ fs()            │             │  ├─ Matplotlib      │
│  └─ Input Callbacks │             │  └─ File Loading    │
│                     │             │                     │
│  Static Modules     │             │  Worker Modules     │
│  ├─ Execution       │             │  ├─ Handlers        │
│  ├─ Input           │             │  ├─ Execution       │
│  ├─ Filesystem      │             │  ├─ Filesystem      │
│  └─ Validation      │             │  └─ Input           │
└─────────────────────┘             └─────────────────────┘
```

## API Reference

### Nagini (High-Level API)

```javascript
// Create manager with backend selection
const manager = await Nagini.createManager(backend, packages, filesToLoad, initPath, workerPath);

// Wait for initialization
await Nagini.waitForReady(manager, timeout);

// Execute code from URL
const result = await Nagini.executeFromUrl(url, manager, namespace);

// Check supported backends
const backends = Nagini.getSupportedBackends(); // ['pyodide']
const isSupported = Nagini.isBackendSupported('pyodide'); // true
```

### PyodideManager (Core Manager)

```javascript
// Execute Python code
const result = await manager.executeAsync(filename, code, namespace);
manager.executeFile(filename, code, namespace); // Fire-and-forget

// Input handling
manager.queueInput(input);
manager.setInputCallback(callback);
manager.provideInput(input);
const waiting = manager.isWaitingForInput();
const prompt = manager.getCurrentPrompt();

// Filesystem operations
await manager.fs("writeFile", {path: "file.txt", content: "data"});
const content = await manager.fs("readFile", {path: "file.txt"});
await manager.fs("mkdir", {path: "directory"});
const exists = await manager.fs("exists", {path: "file.txt"});
const files = await manager.fs("listdir", {path: "."});

// Manager state
console.log(manager.isReady);
console.log(manager.packages);
console.log(manager.executionHistory);
```

## File Structure

```
src/
├── nagini.js                        # Main API entry point
├── utils/
│   └── validation.js                # Parameter validation utilities
└── pyodide/
    ├── manager/
    │   ├── manager.js               # Core PyodideManager class
    │   ├── manager-static-execution.js  # Execution logic
    │   ├── manager-input.js         # Input handling
    │   └── manager-fs.js            # Filesystem operations
    ├── worker/
    │   ├── worker.js               # Worker entry point
    │   ├── worker-config.js        # Configuration constants
    │   ├── worker-handlers.js      # Message handlers
    │   ├── worker-execution.js     # Execution logic
    │   ├── worker-input.js         # Input handling
    │   └── worker-fs.js            # Filesystem operations
    ├── file-loader/
    │   └── file-loader.js          # Remote file loading
    └── python/
        └── pyodide_init.py         # Python initialization script
```

## Testing

The system includes comprehensive test suites covering:

- Manager creation and initialization
- Code execution with results tracking
- Namespace isolation and variable scoping
- Interactive input handling with queues
- Matplotlib figure capture and display
- Remote file loading and Python imports
- Filesystem operations
- Integration workflows

```bash
# Run tests
python -m http.server 8000
open http://localhost:8000/scenery/
```

## Dependencies

- **Pyodide v0.27.7** - Python runtime via WebAssembly (Mozilla Public License 2.0)
- **Brython** - Python-to-JavaScript transpilation capabilities (BSD 3-Clause License)
- **Modern Browser** - WebWorkers, SharedArrayBuffer support
- **No external dependencies** - Self-contained system

**📄 For complete license information and compatibility details, see [LICENCE-DEPENDENCIES.md](LICENCE-DEPENDENCIES.md)**

## Performance

- **Initialization**: ~3-7 seconds (packages + network)
- **Execution**: Near-native Python speed in WebAssembly
- **Memory**: ~100-300MB (package dependent)
- **Figure Capture**: Real-time base64 encoding

## License

**Dual License Model**

- **🆓 Non-Commercial Use**: AGPL v3.0 (free for education, research, government, personal projects)
- **💼 Commercial Use**: Commercial license required for businesses and profit-generating activities
- **🔓 Copyleft-Free Option**: Commercial license available for anyone wanting to avoid AGPL obligations

See [LICENSE](LICENSE) file for complete details.

**Need a commercial license?** Contact us for pricing and custom terms.

---

*Built with Pyodide WebAssembly • Production-ready • Dual licensed for community and commercial use*
