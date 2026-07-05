# Nagini

**Live Documentation & Demos:**
- **Browse Full Source Tree:** [https://pointcarre-app.github.io/nagini/](https://pointcarre-app.github.io/nagini/)
- **Interactive Test Suite (`scenery`):** [https://pointcarre-app.github.io/nagini/scenery/](https://pointcarre-app.github.io/nagini/scenery/)
- **Visual Showcase (`scenery/examples`):** [https://pointcarre-app.github.io/nagini/scenery/examples/](https://pointcarre-app.github.io/nagini/scenery/examples/) - 12 visual examples (daisyUI + CodeMirror)
- **High-School Maths Algorithms (`scenery/lycee`):** [https://pointcarre-app.github.io/nagini/scenery/lycee/](https://pointcarre-app.github.io/nagini/scenery/lycee/) - official French curriculum algorithms (seconde, première, terminale)
- **Main Documentation (MkDocs):** [https://pointcarre-app.github.io/nagini/](https://pointcarre-app.github.io/nagini/)
- **API Reference:** [https://pointcarre-app.github.io/nagini/api-reference/](https://pointcarre-app.github.io/nagini/api-reference/)
- **Repository Reference:** [https://pointcarre-app.github.io/nagini/repo_reference/](https://pointcarre-app.github.io/nagini/repo_reference/)

**Interactive Bokeh Examples:**
- **📊 Bokeh Interactive Demo:** [https://pointcarre-app.github.io/nagini/examples/bokeh-interactive.html](https://pointcarre-app.github.io/nagini/examples/bokeh-interactive.html) - Multiple plot types with pan/zoom/hover
- **🎛️ Bokeh Bidirectional Widgets:** [https://pointcarre-app.github.io/nagini/examples/bokeh-interactive-widgets.html](https://pointcarre-app.github.io/nagini/examples/bokeh-interactive-widgets.html) - JavaScript controls updating Python plots
- **🧪 Bokeh Test Example:** [https://pointcarre-app.github.io/nagini/examples/bokeh-test.html](https://pointcarre-app.github.io/nagini/examples/bokeh-test.html) - Simple implementation test

**Python in the Browser via Pyodide WebAssembly**

> [!IMPORTANT]
> **Production Usage & Branching**
>
> - **Production**: For production environments, always use a specific [tagged version](https://github.com/pointcarre-app/nagini/tags) to ensure stability.
> - **Branches**:
>   - `main`: The main development branch. It is not guaranteed to be stable or correspond to a specific tagged release.
>   - `main-dev`: A development branch for experimental features.
>
> **Do not use the `main` branch for production deployments.**

A production-ready Python execution system for web applications featuring
worker-based architecture, interactive input handling, matplotlib visualization,
and remote module loading. Perfect for data analysis tools, educational
platforms, scientific computing applications, and interactive development
environments.

[![GitHub](https://img.shields.io/badge/GitHub-nagini-blue?logo=github)](https://github.com/pointcarre-app/nagini)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Pyodide](https://img.shields.io/badge/Pyodide-v0.29.4-blue.svg)](https://pyodide.org/)
[![Brython](https://img.shields.io/badge/Brython-stable-green.svg)](https://brython.info/)

## Table of Contents

- [Core Features](#core-features)
- [Quick Start](#quick-start)
- [Interactive Input](#interactive-input)
- [Matplotlib Visualization](#matplotlib-visualization)
- [Remote Module Loading](#remote-module-loading)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [File Structure](#file-structure)
- [Testing](#testing)
- [Dependencies](#dependencies)
- [Security](#security)
- [Performance](#performance)
- [Licensing](#licensing---gnu-affero-general-public-license-v30-agpl-30)

---

## Core Features

- **🚀 Worker Architecture** - Python execution isolated in web workers (Pyodide) or main thread (Brython)
- **🔧 Automatic Blob Workers** - Cross-origin compatibility for Pyodide (Flask, Django, etc.)
- **📦 Micropip Support** - Install packages from PyPI using micropip (Pyodide only)
- **🎮 Interactive Input** - Natural `input()` support with queue/callbacks (Pyodide only)
- **📊 Matplotlib Integration** - Automatic figure capture as base64 images (Pyodide only)
- **📈 Bokeh Integration** - Interactive plot capture as JSON with full pan/zoom/hover (Pyodide only)
- **🔗 Remote Module Loading** - Load Python modules from URLs with retry logic (Pyodide only)
- **🎯 Namespace Isolation** - Complete execution isolation between runs
- **💬 Structured Data Exchange** - "Missive" system for Python ↔ JavaScript communication
- **📁 Filesystem Access** - Complete file operations (Pyodide only)
- **🎨 Dual Backend Support** - Pyodide (full-featured) & Brython (lightweight, instant startup)
- **🌐 CDN-Ready** - Multiple import solutions for static websites, web apps, and Cordova apps

## Quick Start

### CDN Import ⭐ (Static Websites, Web Apps, Cordova)

For static websites, web apps, and Cordova applications, use the **esm.sh CDN** - our recommended solution:

#### esm.sh CDN (Recommended - One Line Solution)
```html
<script type="module">
    // esm.sh automatically resolves ALL ES6 imports - no configuration needed!
    const naginiModule = await import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.44/src/nagini.js');
    const Nagini = naginiModule.Nagini;
    
    // Create manager and start using Python immediately
    const manager = await Nagini.createManager('pyodide', ['numpy'], [], [], 
        'https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.44/src/pyodide/worker/worker-dist.js');
    
    await Nagini.waitForReady(manager);
    
    // Execute Python code
    const result = await manager.executeAsync('demo.py', `
        import numpy as np
        data = np.array([1, 2, 3, 4, 5])
        print(f"Mean: {data.mean()}")
    `);
    
    console.log(result.stdout); // "Mean: 3.0"
</script>
```

**Why esm.sh?**
- ✅ **One-line import** - no configuration needed
- ✅ **Universal compatibility** - works everywhere
- ✅ **Free for commercial use** - no restrictions
- ✅ **Automatic dependency resolution** - handles all ES6 imports
- ✅ **Zero maintenance** - no bundles to update

#### Alternative Solutions

<details>
<summary>Click to see other CDN options (UMD Bundle, Import Maps)</summary>

**UMD Bundle (Maximum Compatibility):**
```html
<script type="module">
    const naginiModule = await import('https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.44/src/nagini.umd.js');
    const Nagini = naginiModule.default || naginiModule;
</script>
```

**Import Maps (Modern Browsers Only):**
```html
<script type="importmap">
{
  "imports": {
    "./utils/validation.js": "https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.44/src/utils/validation.js",
    "./pyodide/manager/manager.js": "https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.44/src/pyodide/manager/manager.js"
  }
}
</script>
<script type="module">
    const naginiModule = await import('https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.44/src/nagini.js');
    const Nagini = naginiModule.Nagini;
</script>
```

</details>

### Pyodide Backend (Recommended) - Automatic Blob Workers

```javascript
import { Nagini } from './src/nagini.js';

// 1. Create manager with Pyodide (requires bundled worker for cross-origin compatibility)
const manager = await Nagini.createManager(
    'pyodide',                                                    // Backend
    ["sympy", "matplotlib"],                                      // Python packages
    ["antlr4-python3-runtime"],                                   // Micropip packages
    [],                                                           // Files to load (URL objects)
    "http://127.0.0.1:8010/src/pyodide/worker/worker-dist.js"    // Bundled worker
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

### Brython Backend (Lightweight) - No Workers Needed

```javascript
// Brython runs directly in main thread - no blob workers required
const manager = await Nagini.createManager(
    'brython',      // Backend - no worker requirements
    [],             // Packages ignored (uses Brython stdlib only)
    [],             // Files ignored
    '',             // Init path ignored
    ''              // Worker path ignored
);

await Nagini.waitForReady(manager);

// Execute Python code (transpiled to JavaScript)
const result = await manager.executeAsync("turtle_demo.py", `
import turtle
t = turtle.Turtle()
for _ in range(4):
    t.forward(100)
    t.left(90)
print("Square drawn!")
`);
```

## Worker Bundling for Pyodide Cross-Origin Use

**⚠️ Pyodide Only:** When using the **Pyodide backend** with Flask apps or other cross-origin scenarios, bundled workers are **mandatory** to avoid ES6 import issues. Brython doesn't use workers and is unaffected.

**🔧 Automatic:** Nagini automatically creates blob workers from bundled files for maximum compatibility.

### Quick Usage (Pyodide with Bundled Worker)

```javascript
// For Pyodide in Flask/cross-origin apps - bundled worker is automatically converted to blob
const manager = await Nagini.createManager(
    'pyodide',  // Only Pyodide requires bundled workers
    ["numpy", "matplotlib"],
    ["antlr4-python3-runtime"],
    [],
    "http://127.0.0.1:8010/src/pyodide/worker/worker-dist.js"   // Nagini auto-creates blob worker
);
```

### Quick Usage (Brython - No Workers)

```javascript
// Brython runs in main thread - no worker bundling needed
const manager = await Nagini.createManager(
    'brython',  // No worker requirements for Brython
    [],         // Only Brython stdlib available
    [],
    '',         // Ignored for Brython
    ''          // Ignored for Brython
);
```

### Blob Worker Creation (Flask Example)

```javascript
// Create blob worker URL to avoid CORS issues
async function createBlobWorkerUrl(workerPath) {
    const response = await fetch(workerPath);
    const workerCode = await response.text();
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    return URL.createObjectURL(blob);
}

// Use in Flask app
const workerPath = "http://127.0.0.1:8010/src/pyodide/worker/worker-dist.js";
const blobWorkerUrl = await createBlobWorkerUrl(workerPath);

const manager = await Nagini.createManager(
    'pyodide',
    ["numpy"],
    [], // No micropip packages in this example
    [],
    blobWorkerUrl  // Blob URL works across origins
);
```

### Building the Pyodide Worker Bundle

**⚠️ Only required for Pyodide backend** - Brython doesn't use workers.

```bash
# Navigate to Pyodide worker directory
cd src/pyodide/worker

# Install dependencies (first time only)
npm install

# Build production bundle for Pyodide
npm run build

# Build development bundle (with source maps)
npm run build-dev
```

**Output**: Creates `worker-dist.js` (64KB bundled file) that Nagini automatically converts to blob workers for cross-origin compatibility.

## Interactive Input

Nagini provides robust, asynchronous support for Python's built-in `input()` function, allowing for both programmatic and user-driven interaction without blocking the main browser thread.

### How It Works
1.  **Code Transformation**: Code containing `input()` is rewritten at the AST level: only genuine calls to the builtin `input()` are prefixed with `await` (names like `my_input()` or `obj.input()` are untouched, and calls inside sync `def`, `lambda` or class bodies are left as-is). The code is not wrapped in a function: it runs directly via `runPythonAsync` with top-level `await`, so top-level variables persist in the globals between runs.
2.  **Pause and Wait**: The Python worker pauses execution and sends an `input_required` message to the main thread.
3.  **Data Provision**: The main thread provides the input from a queue or a user-facing callback.
4.  **Resume**: The worker receives the input and resumes Python execution.

### Programmatic Input

```javascript
// Queue inputs programmatically
manager.queueInput("Alice");
manager.queueInput("25");

const result = await manager.executeAsync("survey.py", `
name = input("What's your name? ")
age = int(input("How old are you? "))
print(f"Hello {name}! You are {age} years old.")
`);
```

### Interactive Callbacks

```javascript
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

## Bokeh Visualization

Nagini supports capturing Bokeh plots as JSON for interactive visualization in the browser.

### Basic Setup

```javascript
// 1. Load Bokeh packages in Pyodide
const manager = await Nagini.createManager(
    'pyodide',
    ['numpy', 'bokeh'],  // Include bokeh in packages
    [],
    [],
    './src/pyodide/worker/worker-dist.js'
);

// 2. Execute Bokeh code
const result = await manager.executeAsync("bokeh_plot.py", `
from bokeh.plotting import figure, curdoc
from bokeh.models import HoverTool

# Create plot
p = figure(title="Interactive Plot", width=600, height=400)
p.line([1, 2, 3, 4, 5], [2, 5, 3, 6, 4], line_width=2)

# Add to document for capture
curdoc().add_root(p)
print("Bokeh plot created!")
`);

// Access captured Bokeh figures (as JSON strings)
console.log(result.bokeh_figures);  // Array of JSON strings
```

### Rendering Bokeh Plots (Frontend Requirements)

**⚠️ Important**: To render Bokeh plots interactively, you need to load BokehJS libraries in your HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Required: BokehJS libraries for rendering -->
    <script src="https://cdn.bokeh.org/bokeh/release/bokeh-3.6.2.min.js"></script>
    <script src="https://cdn.bokeh.org/bokeh/release/bokeh-widgets-3.6.2.min.js"></script>
    <script src="https://cdn.bokeh.org/bokeh/release/bokeh-tables-3.6.2.min.js"></script>
</head>
<body>
    <div id="bokeh-plot"></div>
    
    <script type="module">
        import { Nagini } from './src/nagini.js';
        
        // ... create manager and execute Bokeh code ...
        
        // Render the captured Bokeh plot
        if (result.bokeh_figures && result.bokeh_figures.length > 0) {
            const figureJson = JSON.parse(result.bokeh_figures[0]);
            await Bokeh.embed.embed_item(figureJson, 'bokeh-plot');
        }
    </script>
</body>
</html>
```

### Key Differences: Matplotlib vs Bokeh

| Feature | Matplotlib | Bokeh |
|---------|------------|-------|
| **Output Format** | Base64 PNG images | JSON objects |
| **Interactivity** | Static images | Interactive plots (pan, zoom, hover) |
| **Frontend Requirements** | None (uses `<img>` tags) | Requires BokehJS libraries |
| **Capture Method** | `result.figures` (base64 strings) | `result.bokeh_figures` (JSON strings) |
| **Display Method** | Set img.src to data URL | Use `Bokeh.embed.embed_item()` |

### Complete Example with Bidirectional Interaction

See `examples/bokeh-interactive-widgets.html` for a full example showing how to:
- Create HTML controls that pass parameters to Python
- Generate Bokeh plots based on those parameters
- Render interactive visualizations
- Update plots dynamically based on user input

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
    [], // No micropip packages
    filesToLoad,  // Load from URLs
    "./src/pyodide/worker/worker-dist.js"
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

### Pyodide Backend (Web Worker + Blob Workers)

```
Main Thread                          Blob Web Worker (Cross-Origin Compatible)
┌─────────────────────┐             ┌─────────────────────┐
│                     │             │                     │
│  Nagini             │             │  PyodideWorker      │
│  ├─ createManager   │   Bundled   │  ├─ Entry Point     │
│  ├─ waitForReady    │    Worker   │  ├─ All Modules     │
│  ├─ executeFromUrl  │   Messages  │  │   Bundled        │
│  └─ Backend Support │◄───────────►│  └─ Configuration   │
│                     │             │                     │
│  PyodideManager     │   Automatic │  Pyodide Runtime    │
│  ├─ executeAsync    │ Blob Worker │  ├─ Python Env      │
│  ├─ executeFile     │  Creation   │  ├─ Package Mgmt    │
│  ├─ queueInput      │             │  ├─ Matplotlib      │
│  ├─ fs()            │             │  ├─ Bokeh Capture   │
│  └─ Input Callbacks │             │  ├─ File Loading    │
│                     │             │  └─ WebAssembly     │
└─────────────────────┘             └─────────────────────┘
```

### Visualization Capture System

Nagini automatically captures visualization outputs from Python execution:

#### Matplotlib Capture
- **Method**: `get_figures()` in `capture_system.py`
- **Process**: Saves plots to BytesIO → Base64 encoding → Returns as strings
- **Output**: `result.figures` array containing base64 PNG images
- **Display**: Direct embedding in `<img>` tags

#### Bokeh Capture
- **Method**: `get_bokeh_figures()` in `capture_system.py`
- **Process**: Extracts from `curdoc()` → `json_item()` conversion → Returns as JSON strings
- **Output**: `result.bokeh_figures` array containing JSON representations
- **Display**: Requires BokehJS library and `Bokeh.embed.embed_item()`
- **Note**: The worker bundle (`worker-dist.js`) must be rebuilt after modifying capture system

### Brython Backend (Main Thread Only)

```
Main Thread Only (No Workers)
┌─────────────────────────────────────────┐
│                                         │
│  Nagini                BrythonManager   │
│  ├─ createManager ───► ├─ executeAsync  │
│  ├─ waitForReady       ├─ executeFile   │
│  └─ executeFromUrl     └─ Transpiler    │
│                               │         │
│  Brython Runtime             │         │
│  ├─ JavaScript Transpilation │         │
│  ├─ DOM Integration          │         │
│  ├─ Turtle Graphics          │         │
│  └─ Instant Startup          │         │
└─────────────────────────────────────────┘
```

## API Reference

### Nagini (High-Level API)

```javascript
// Create Pyodide manager (requires bundled worker for cross-origin compatibility)
const pyodideManager = await Nagini.createManager(
    'pyodide',
    packages,
    micropipPackages,
    filesToLoad,
    "http://127.0.0.1:8010/src/pyodide/worker/worker-dist.js"   // Auto-converted to blob worker
);

// Create Brython manager (no worker requirements)
const brythonManager = await Nagini.createManager(
    'brython', 
    [],      // Packages ignored
    [],      // Files ignored  
    '',      // Init path ignored
    ''       // Worker path ignored
);

// Wait for initialization (both backends)
await Nagini.waitForReady(manager, timeout);

// Execute code from URL (both backends)
const result = await Nagini.executeFromUrl(url, manager, namespace);

// Check supported backends
const backends = Nagini.getSupportedBackends(); // ['pyodide', 'brython']
const isSupported = Nagini.isBackendSupported('brython'); // true
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
│   ├── validation.js                # Parameter validation utilities
│   └── createBlobWorker.js          # Cross-origin worker utilities
├── brython/                         # Brython backend
│   ├── index.html
│   ├── lib/
│   │   ├── brython.js
│   │   └── brython_stdlib.js
│   ├── manager/
│   │   ├── manager.js
│   │   ├── loader.js
│   │   └── executor.js
│   └── python/
│       └── turtle_min.py
└── pyodide/
    ├── manager/
    │   ├── manager.js               # Core PyodideManager class
    │   ├── manager-static-execution.js  # Execution logic
    │   ├── manager-input.js         # Input handling
    │   └── manager-fs.js            # Filesystem operations
    ├── worker/
    │   ├── worker.js               # Worker entry point (ES6 modules)
    │   ├── worker-config.js        # Configuration constants
    │   ├── worker-handlers.js      # Message handlers
    │   ├── worker-execution.js     # Execution logic
    │   ├── worker-input.js         # Input handling
    │   ├── worker-fs.js            # Filesystem operations
    │   ├── webpack.config.cjs      # Webpack bundling configuration
    │   ├── package.json            # NPM dependencies and build scripts
    │   ├── package-lock.json       # Dependency lock file
    │   ├── worker-dist.js          # **Bundled worker output** (generated)
    │   ├── .gitignore              # Build artifacts exclusions
    │   ├── README.md               # Worker bundling documentation
    │   └── node_modules/           # NPM dependencies (generated)
    ├── file-loader/
    │   └── file-loader.js          # Remote file loading
    └── python/
        ├── pyodide_init.py         # Python initialization script
        ├── capture_system.py       # Output capture system
        ├── code_transformation.py  # Code transformation utilities
        └── pyodide_utilities.py    # Python helper functions
tests/
├── unified-test.html               # **Comprehensive unified test suite**
├── flask-example.py                # Cross-origin Flask server (port 5001)
└── README.md                       # Unified test documentation
```

### Pyodide Worker Bundling System

The Pyodide worker directory includes a complete **webpack-based bundling system** to resolve ES6 import issues when creating blob workers across different origins (e.g., Flask apps):

- **Development**: Use modular `worker.js` with ES6 imports (single-origin only)
- **Production**: Use bundled `worker-dist.js` (cross-origin compatible)
- **Automatic Conversion**: Nagini automatically converts bundled workers to blob URLs
- **Build Process**: `npm run build` creates optimized bundle
- **Cross-Origin Support**: Blob workers work with Flask, Django, any framework

**⚠️ Note**: Brython doesn't use workers, so this system is Pyodide-specific.

## Testing

### Unified Test Suite

Nagini includes a **comprehensive unified test suite** that demonstrates both Pyodide and Brython backends in a side-by-side comparison. The unified test provides a complete evaluation of cross-origin compatibility, worker architecture, and dual backend capabilities.

**🎯 Features Tested:**

#### Pyodide Column (Left - Full-Featured)
- ✅ **Basic Python execution** with automatic blob workers
- ✅ **NumPy + Matplotlib integration** with figure capture
- ✅ **Interactive input() handling** with queue system
- ✅ **Cross-origin compatibility** (Flask ↔ Nagini servers)
- ✅ **Automatic blob worker creation** for CORS scenarios

#### Brython Column (Right - Lightweight)
- ✅ **Basic Python execution** (JavaScript transpilation)
- ✅ **Tactical turtle graphics** with 300x300 canvas
- ✅ **DOM integration** and browser APIs
- ✅ **Instant startup** (no downloads required)

### Quick Test Setup

```bash
# 1. Start Nagini server (port 8010)
python3 serve.py

# 2. Start Flask cross-origin test server (port 5001) 
python3 tests/flask-example.py

# 3. Open unified test suite
open http://127.0.0.1:8010/tests/unified-test.html

# 4. Test everything with buttons in both columns
```

### Cross-Origin Testing

The test suite demonstrates **real-world cross-origin scenarios**:
- **Nagini Server**: `http://127.0.0.1:8010` (serves static files)
- **Flask Server**: `http://127.0.0.1:5001` (provides CORS headers)
- **Blob Workers**: Automatically created for cross-origin compatibility
- **Full URLs**: Required for proper cross-origin module loading

### Test Coverage

The unified test suite covers all core features:

- **Manager creation and initialization** (both backends)
- **Code execution with results tracking**
- **Namespace isolation and variable scoping**
- **Interactive input handling with queues** (Pyodide only)
- **Matplotlib figure capture and display** (Pyodide only)
- **Turtle graphics with tactical patterns** (Brython only)
- **DOM integration and browser APIs** (Brython only)
- **Cross-origin worker compatibility**
- **Automatic blob worker creation**
- **Dual backend comparison**

## Dependencies

- **Pyodide v0.29.4** - Python runtime via WebAssembly (Mozilla Public License 2.0)
- **Brython** - Python-to-JavaScript transpilation capabilities (BSD 3-Clause License)
- **Modern Browser** - WebWorkers, SharedArrayBuffer support
- **No external dependencies** - Self-contained system

**📄 For complete license information and compatibility details, see [3RD-PARTY.md](3RD-PARTY.md)**

## Troubleshooting

### Bokeh Plots Not Appearing

1. **Check BokehJS Libraries**: Ensure you've loaded the required BokehJS scripts in your HTML:
   ```html
   <script src="https://cdn.bokeh.org/bokeh/release/bokeh-3.6.2.min.js"></script>
   ```

2. **Verify Package Loading**: Include 'bokeh' in the packages array when creating the manager:
   ```javascript
   const manager = await Nagini.createManager('pyodide', ['bokeh'], ...);
   ```

3. **Check Document Root**: Bokeh plots must be added to `curdoc()` to be captured:
   ```python
   from bokeh.plotting import curdoc
   curdoc().add_root(plot)  # Required for capture
   ```

4. **Rebuild Worker Bundle**: After modifying capture system files, rebuild the worker:
   ```bash
   cd src/pyodide/worker
   npm run build
   ```

### Empty bokeh_figures Array

- Ensure plots are added to the document before execution ends
- Check console for Python errors during plot creation
- Verify Bokeh package version compatibility

## Security

Nagini does not apply any sandboxing beyond what the browser and WebAssembly already provide. Python code runs with full access to the Pyodide environment (virtual filesystem, network requests via the browser, `js` module bridge to the page or worker scope). Do not treat Nagini as a security boundary for untrusted code.

`ValidationUtils.checkDangerousPatterns` (in `src/utils/validation.js`) is an opt-in helper that scans code for known risky patterns. It is **not** applied automatically before execution: if you want it, call it yourself before passing code to `executeAsync`. It is a heuristic filter, not a sandbox, and can be bypassed.

### Brython backend: no isolation

> [!WARNING]
> Unlike the Pyodide backend (which runs in a web worker), the **Brython backend executes Python in the main thread of the host page, with full DOM access**: cookies, `fetch` with the page's session, the whole document. Only run first-party, trusted code through the Brython backend. Never feed it end-user or student code on a page that holds a session.

### Content Security Policy

Nagini needs a blob worker plus scripts fetched from wherever you host Pyodide and the bundles. A reference CSP for a page embedding Nagini, assuming self-hosted assets plus the jsDelivr Pyodide CDN:

```
Content-Security-Policy:
  script-src 'self' https://cdn.jsdelivr.net;
  worker-src 'self' blob:;
  connect-src 'self' https://cdn.jsdelivr.net https://pypi.org https://files.pythonhosted.org;
```

`connect-src` must cover the hosts Pyodide fetches wheels from (jsDelivr for `loadPackage`, PyPI for micropip). If you self-host Pyodide (see `pyodideCdnUrl`), replace the CDN entries with your own origin. For interactive `input()` support and best performance, also send the cross-origin isolation headers shown in `serve.py`: `Cross-Origin-Embedder-Policy: require-corp` and `Cross-Origin-Opener-Policy: same-origin`.

### Pinning and integrity

Load Nagini and `worker-dist.js` from your own origin in production, or pin CDN URLs to an immutable commit SHA rather than a tag (tags can be re-pointed). The demo pages in this repository pin their third-party CDN assets to exact versions with `integrity` (SRI) attributes; do the same in your embedding pages. SRI cannot cover dynamically imported modules or `importScripts`, which is one more reason to self-host in production.

## Performance

- **Initialization**: ~3-7 seconds (packages + network)
- **Execution**: Near-native Python speed in WebAssembly
- **Memory**: ~100-300MB (package dependent)
- **Figure Capture**: Real-time base64 encoding

## Licensing - GNU Affero General Public License v3.0 (AGPL-3.0)

Nagini is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

### 📋 AGPL v3.0 Requirements:
- **Source Code Sharing**: Any modifications to Nagini must be shared under the same license
- **Network Use**: If you run Nagini on a server and let users interact with it remotely, you must make your source code available to those users
- **Derivative Works**: Must use compatible licenses
- **Copyright Notices**: Must be preserved

### ✅ What You Can Do:
- **Use freely** for any purpose (personal, educational, commercial, research)
- **Modify** the source code to fit your needs
- **Distribute** copies and modifications
- **Run** on servers and provide network services

### 📝 What You Must Do:
- **Share source code** of any modifications you make
- **Provide source access** to users of network services
- **Include copyright notices** and license information
- **Use compatible licenses** for derivative works

### 🎓 Perfect For:
- **Educational institutions** and training programs
- **Research organizations** and academic projects
- **Open-source projects** and community initiatives
- **Commercial applications** that comply with copyleft requirements
- **Government agencies** and public organizations
- **Individual developers** and personal projects

---

## GNU Affero General Public License v3.0

Copyright (C) 2025 SAS POINTCARRE.APP

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

### Additional Terms for Network Use

If you run a modified version of this software on a server and let users
interact with it remotely through a computer network, you must make the
source code of your modified version available to those users.

---

## Third-Party Dependencies

This software incorporates components from the following open-source projects:

### Brython
- **License**: BSD 3-Clause "New" or "Revised" License
- **Copyright**: Copyright (c) 2012, Pierre Quentel pierre.quentel@gmail.com
- **Project**: brython-dev/brython
- **Usage**: Python-to-JavaScript transpilation capabilities

**BSD 3-Clause License Requirements:**
- Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

### Pyodide
- **License**: Mozilla Public License 2.0
- **Project**: pyodide/pyodide
- **Usage**: Python runtime via WebAssembly

**Mozilla Public License 2.0 Requirements:**
- Source code of licensed files and modifications must be made available under the same license
- Copyright and license notices must be preserved
- Patent rights are expressly granted
- Larger works using the licensed work may be distributed under different terms

**📄 For complete license texts and detailed information about all dependencies, see [3RD-PARTY.md](3RD-PARTY.md)**

---

*Nagini is free and open-source software licensed under AGPL v3.0, ensuring it remains available for all users while promoting open-source collaboration and transparency.*
