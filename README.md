# Nagini

**Python in the Browser via Pyodide WebAssembly**

A production-ready Python execution system for web applications featuring
worker-based architecture, interactive input handling, matplotlib visualization,
and remote module loading. Perfect for data analysis tools, educational
platforms, scientific computing applications, and interactive development
environments.

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
- [Performance](#performance)
- [Licensing](#non-commercial-use---gnu-affero-general-public-license-v30-agpl-30)

---

## Core Features

- **🚀 Worker Architecture** - Python execution isolated in web workers
- **🎮 Interactive Input** - Natural `input()` support with queue/callbacks
- **📊 Matplotlib Integration** - Automatic figure capture as base64 images
- **🔗 Remote Module Loading** - Load Python modules from URLs with retry logic
- **🎯 Namespace Isolation** - Complete execution isolation between runs
- **💬 Structured Data Exchange** - "Missive" system for Python ↔ JavaScript communication
- **📁 Filesystem Access** - Complete file operations (`writeFile`, `readFile`, `mkdir`, etc.)
- **🔧 Backend Agnostic** - Supports multiple Python backends (Pyodide & Brython)

## Quick Start

```javascript
import { Nagini } from './src/nagini.js';

// 1. Create manager (defaults to 'pyodide' backend)
const manager = await Nagini.createManager(
    'pyodide',                           // Backend ('pyodide' or 'brython')
    ["sympy", "matplotlib"],             // Python packages
    [],                                  // Files to load (URL objects)
    "./src/pyodide/python/pyodide_init.py",  // Init script
    "./src/pyodide/worker/worker.js"     // Worker script (dev) or worker-dist.js (prod)
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

## Worker Bundling for Cross-Origin Use

When using Nagini with Flask apps or other cross-origin scenarios, use the **bundled worker** to avoid ES6 import issues:

### Quick Usage (Bundled Worker)

```javascript
// For Flask/cross-origin apps - use bundled worker
const manager = await Nagini.createManager(
    'pyodide',
    ["numpy", "matplotlib"],
    [],
    "http://127.0.0.1:8010/src/pyodide/python/pyodide_init.py",
    "http://127.0.0.1:8010/src/pyodide/worker/worker-dist.js"  // Bundled version
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
    [],
    "http://127.0.0.1:8010/src/pyodide/python/pyodide_init.py",
    blobWorkerUrl  // Blob URL works across origins
);
```

### Building the Worker Bundle

```bash
# Navigate to worker directory
cd src/pyodide/worker

# Install dependencies (first time only)
npm install

# Build production bundle
npm run build

# Build development bundle (with source maps)
npm run build-dev
```

**Output**: Creates `worker-dist.js` (64KB bundled file) that works in any environment.

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
```

### Worker Bundling System

The worker directory includes a complete **webpack-based bundling system** to resolve ES6 import issues when creating blob workers across different origins (e.g., Flask apps):

- **Development**: Use modular `worker.js` with ES6 imports
- **Production**: Use bundled `worker-dist.js` (single file, no imports)
- **Build Process**: `npm run build` creates optimized bundle
- **Cross-Origin Support**: Bundled worker works in blob URLs

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

**📄 For complete license information and compatibility details, see [3RD-PARTY.md](3RD-PARTY.md)**

## Performance

- **Initialization**: ~3-7 seconds (packages + network)
- **Execution**: Near-native Python speed in WebAssembly
- **Memory**: ~100-300MB (package dependent)
- **Figure Capture**: Real-time base64 encoding

## Non-Commercial Use - GNU Affero General Public License v3.0 (AGPL-3.0)

For **non-commercial use**, Nagini is licensed under the GNU Affero General Public License v3.0.

### ✅ Free Usage Includes:
- **Educational institutions** (schools, universities, training centers)
- **Government agencies** and public administrations
- **Research organizations** and academic institutions
- **Individual developers** for personal projects
- **Open-source projects** and community initiatives
- **Non-profit organizations** and NGOs

### 📋 AGPL v3.0 Requirements:
- Source code modifications must be shared
- Network use triggers copyleft obligations
- Derivative works must use compatible licenses
- Copyright notices must be preserved

---

## Commercial Use - Commercial License

For **commercial use**, a separate commercial license is required. Additionally, **any organization or individual who prefers not to comply with AGPL v3.0 copyleft obligations** may choose a commercial license regardless of use case.

### 💼 Commercial License Required For:
- **Private companies** and corporations
- **Commercial software development**
- **SaaS platforms** and hosted services
- **Consulting services** and professional training
- **Product integration** in commercial offerings
- **Any profit-generating activities**

### 🆓 Commercial License Also Available For:
- **Non-commercial users** who prefer proprietary development
- **Organizations** that cannot comply with copyleft requirements
- **Projects** requiring private modifications
- **Any user** who wants to avoid AGPL v3.0 obligations

### 🎯 Commercial License Benefits:
- **No copyleft obligations** - keep your code private
- **Commercial support** and priority assistance
- **Custom development** and feature requests
- **Deployment flexibility** for proprietary systems
- **Legal protection** and indemnification

---

# Licensing FAQ - Common Scenarios

## 🤔 **Frequently Asked Questions**

### **Q: I'm a teacher building a tool for my classroom. Do I need a commercial license?**
**A:** No, if you're using it purely for educational purposes in your classroom without charging students or generating revenue.

### **Q: I'm a freelance developer building a client's website. Do I need a commercial license?**
**A:** Yes, this is commercial use - you're providing professional services for payment.

### **Q: I'm a startup with no revenue yet. Do I need a commercial license?**
**A:** Yes, if you plan to monetize or are building for business purposes, it's commercial use regardless of current revenue.

### **Q: I work at a non-profit organization. Do I need a commercial license?**
**A:** No, registered 501(c)(3) organizations qualify for non-commercial use.

### **Q: I'm a government contractor. Do I need a commercial license?**
**A:** Yes, contractors are commercial entities even when working for government.

### **Q: I'm building an open-source project. Do I need a commercial license?**
**A:** No, if it's truly community-driven with no commercial backing or monetization plans.

### **Q: I'm a university researcher but my research is funded by a company. Do I need a commercial license?**
**A:** It depends - contact us to clarify based on your specific arrangement.

### **Q: I want to use it internally at my company. Do I need a commercial license?**
**A:** Yes, any use within a for-profit organization is commercial use.

### **Q: I'm offering a "free" service but collecting user data. Do I need a commercial license?**
**A:** Yes, data collection for business purposes is commercial use.

### **Q: I'm a consultant teaching workshops using this software. Do I need a commercial license?**
**A:** Yes, commercial training and consulting require a commercial license.

### **Q: I'm building a SaaS but only for internal company use. Do I need a commercial license?**
**A:** Yes, building business tools is commercial use even if internal.

### **Q: I'm a student working on a project that might become a business. Do I need a commercial license?**
**A:** Start with AGPL for learning, but switch to commercial license before any business activities.

### **Q: I'm using it for academic research that might lead to a patent. Do I need a commercial license?**
**A:** Contact us - this is a gray area that needs case-by-case evaluation.

### **Q: I'm a YouTube creator making tutorials about the software. Do I need a commercial license?**
**A:** If you monetize the videos (ads, sponsorships, etc.), then yes.

### **Q: I'm building a portfolio project to get hired. Do I need a commercial license?**
**A:** No, if it's purely for learning and demonstration purposes without monetization.

## 🎯 **Simple Decision Tree**

```
Are you making money from it? → YES → Commercial License
Are you planning to make money? → YES → Commercial License
Are you using it for business? → YES → Commercial License
Are you a for-profit company? → YES → Commercial License
Are you providing services? → YES → Commercial License
None of the above? → MAYBE → Non-Commercial (AGPL)
```

---

## How to Obtain a Commercial License

To obtain a commercial license or discuss pricing:

🌐 **Website**: [pointcarre.app](https://pointcarre.app)

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

*This dual licensing model ensures Nagini remains freely available for educational and research purposes while providing sustainable funding for continued development and commercial support.*
