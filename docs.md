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

Nagini is a production-ready Python execution system for web browsers using Pyodide WebAssembly. It provides a clean, modular architecture with worker-based execution, interactive input handling, matplotlib visualization, and remote module loading capabilities.

### Use Cases

Nagini enables a wide range of applications across different domains:

- **Data Analysis & Visualization**: Interactive dashboards, scientific computing, statistical analysis
- **Educational Platforms**: Coding tutorials, interactive learning environments, programming courses
- **Development Tools**: Online IDEs, code playgrounds, prototyping environments
- **Research Applications**: Scientific simulations, data exploration, academic research tools
- **Business Intelligence**: Report generation, data processing, analytics platforms
- **Training & Consulting**: Professional development tools, skill assessment platforms

### Key Benefits

- **Isolated Execution**: Python runs in web workers, preventing main thread blocking
- **Interactive Support**: Natural `input()` function support with multiple interaction modes
- **Visualization Ready**: Automatic matplotlib figure capture and display
- **Module Loading**: Load Python modules from S3/URLs at runtime
- **Namespace Isolation**: Complete variable isolation between executions
- **Production Tested**: 16 comprehensive test cases covering all features
- **Flexible Licensing**: Free for non-commercial use, commercial licenses available

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

#### `createManager(backend, packages, filesToLoad, pyodideInitPath, workerPath)`

Creates a new PyodideManager instance with strict type validation.

**Parameters:**
- `backend` (String): Backend to use ('pyodide')
- `packages` (Array): Python packages to install (e.g., `["numpy", "pandas"]`)
- `filesToLoad` (Array): Files to load into filesystem (URL objects)
- `pyodideInitPath` (String): Path to `pyodide_init.py` file
- `workerPath` (String): Path to web worker file

**Returns:** `PyodideManager` instance

**Example:**
```javascript
const manager = await Nagini.createManager(
    'pyodide',
    ["sympy", "matplotlib"],
    [
        {
            url: "https://example.com/modules/utils.py",
            path: "utils/utils.py"
        }
    ],
    "./src/pyodide/python/pyodide_init.py",
    "./src/pyodide/worker/worker.js"
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
    filesToLoad,
    "./src/pyodide/python/pyodide_init.py",
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

### Package Management

Smart package loading with duplicate prevention:

```javascript
// First manager loads numpy and pandas
const manager1 = Nagini.createManager(
    ["numpy", "pandas"],
    [],
    "./src/pyodide_init.py",
    "./src/pyodide-worker.js"
);

// Second manager only loads scipy (numpy/pandas already cached)
const manager2 = Nagini.createManager(
    ["numpy", "pandas", "scipy"],  // Only scipy will be installed
    [],
    "./src/pyodide_init.py",
    "./src/pyodide-worker.js"
);
```

---

## Testing

### Test Suite Overview

Nagini includes 16 comprehensive test cases covering all major features:

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

#### File Loading Tests (PyodideFileLoader)
16. **Remote Integration** - Remote file loading and Python imports

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
│   │   └── validation.js          # Parameter validation utilities
│   └── pyodide/
│       ├── manager/
│       │   ├── manager.js         # Core PyodideManager class
│       │   ├── manager-static-execution.js  # Execution logic
│       │   ├── manager-input.js   # Input handling
│       │   └── manager-fs.js      # Filesystem operations
│       ├── worker/
│       │   ├── worker.js          # Worker entry point
│       │   ├── worker-config.js   # Configuration constants
│       │   ├── worker-handlers.js # Message handlers
│       │   ├── worker-execution.js # Execution logic
│       │   ├── worker-input.js    # Input handling
│       │   └── worker-fs.js       # Filesystem operations
│       ├── file-loader/
│       │   └── file-loader.js     # Remote file loading
│       └── python/
│           └── pyodide_init.py    # Python initialization script
├── scenery/                       # Testing and demo
│   └── tests/                     # Test modules
├── docs.md                        # This documentation
├── README.md                      # Project overview
└── LICENSE                        # License
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
if (typeof pyodideInitPath !== "string") {
    throw new Error("pyodideInitPath must be a string");
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

#### Message Handler Pattern
```javascript
// Temporarily replace message handler to capture specific results
const originalHandler = this.getHandleMessage();
this.setHandleMessage(function(data) {
    originalHandler.call(this, data);
    
    if (data.type === "result") {
        // Handle result and restore original handler
        this.setHandleMessage(originalHandler);
        resolve(data);
    }
});
```

#### Configuration Management
```javascript
// Use centralized configuration
import { PYODIDE_WORKER_CONFIG } from './pyodide-worker-config.js';

// Access constants
const cdnUrl = PYODIDE_WORKER_CONFIG.PYODIDE_CDN;
const errorMsg = PYODIDE_WORKER_CONFIG.MESSAGES.NOT_INITIALIZED;
```

### Performance Considerations

#### Initialization Optimization
- Packages cached globally across manager instances
- Files loaded once and reused
- Worker initialization optimized for speed

#### Memory Management
- Clear execution history periodically: `manager.clearExecutionHistory()`
- Matplotlib figures automatically cleaned up
- Workers can be terminated: `manager.worker.terminate()`

#### Execution Optimization
- Namespace isolation only when needed
- Direct execution for simple scripts
- Minimal message passing overhead

---

## Licensing

### Dual License Model

Nagini is available under a **dual licensing structure** that balances open-source community development with sustainable commercial funding.

#### Non-Commercial Use - AGPL v3.0 (Free)

**✅ Eligible for Free Use:**
- **Educational Institutions**: Schools, universities, training centers, online learning platforms
- **Government & Public Sector**: Ministries, agencies, public administrations, municipal services
- **Research Organizations**: Academic institutions, think tanks, scientific research projects
- **Individual Developers**: Personal projects, learning, experimentation, portfolio development
- **Open Source Projects**: Community-driven initiatives, public repositories, collaborative development
- **Non-Profit Organizations**: NGOs, charities, community groups, volunteer initiatives

**📋 AGPL v3.0 Requirements:**
- **Source Code Sharing**: Modifications must be made available under AGPL v3.0
- **Network Copyleft**: Web services using Nagini must provide source access to users
- **License Preservation**: Copyright notices and license terms must be maintained
- **Compatible Licensing**: Derivative works must use AGPL v3.0 or compatible licenses

#### Commercial Use - Commercial License (Paid)

**💼 Commercial License Required For:**
- **Private Companies**: Corporations, LLCs, partnerships using Nagini in business operations
- **Commercial Software**: Products sold, licensed, or distributed for profit
- **SaaS Platforms**: Hosted services, cloud platforms, subscription-based offerings
- **Professional Services**: Consulting, training, development services sold to clients
- **Product Integration**: Embedding Nagini in commercial products or solutions
- **Profit-Generating Activities**: Any use where Nagini contributes to revenue generation

**🆓 Commercial License Also Available For:**
- **Any organization or individual** who prefers not to comply with AGPL v3.0 copyleft obligations
- **Non-commercial projects** that require private modifications
- **Organizations** with policies against copyleft licensing
- **Users** who want maximum flexibility without source code sharing requirements

**🎯 Commercial License Benefits:**
- **Proprietary Development**: No obligation to share source code modifications
- **Flexible Deployment**: Use in closed-source and proprietary systems
- **Commercial Support**: Priority technical support and assistance
- **Custom Development**: Feature requests and custom modifications
- **Legal Protection**: Indemnification and warranty coverage
- **Multiple Projects**: Single license can cover multiple commercial applications

### License Selection Guide

**🤔 Not Sure Which License Applies?**

| Use Case | License Type | Example |
|----------|--------------|---------|
| University research project | **Free (AGPL)** | Academic study using Python in browser |
| Government training portal | **Free (AGPL)** | Public sector employee education |
| Personal coding experiments | **Free (AGPL)** | Learning Python/WebAssembly development |
| Open-source educational tool | **Free (AGPL)** | Community-developed learning platform |
| Startup EdTech platform | **Commercial** | Subscription-based learning service |
| Corporate training system | **Commercial** | Internal employee development platform |
| Consulting project delivery | **Commercial** | Custom solution for paying client |
| Commercial data analysis tool | **Commercial** | Product sold to business customers |
| Non-profit avoiding copyleft | **Commercial** | NGO wanting private modifications |
| Research lab with IP policies | **Commercial** | Institution requiring proprietary code |
| Personal project (private) | **Commercial** | Individual avoiding source sharing |

### Commercial Licensing Process

**📞 Contact Information:**
- **Email**: [Your Business Email]
- **Website**: [Your Commercial Website]
- **Phone**: [Your Business Phone]

**💰 Pricing Structure:**
- **Startup License**: For companies with <$1M annual revenue
- **Business License**: For mid-size companies and teams
- **Enterprise License**: For large corporations with custom requirements
- **OEM License**: For software vendors redistributing Nagini

**📋 What to Include in Your Inquiry:**
- Company size and revenue range
- Intended use case and application type
- Number of developers/users
- Deployment timeline and requirements
- Support and customization needs

### Compliance and Legal

#### AGPL v3.0 Compliance

**✅ To Comply with AGPL v3.0:**
1. **Preserve Copyright**: Keep all existing copyright notices intact
2. **Include License**: Distribute AGPL v3.0 license text with your software
3. **Share Modifications**: Make source code of modifications available
4. **Network Disclosure**: For web services, provide source access to users
5. **Compatible Licensing**: Ensure all components use AGPL-compatible licenses

**⚠️ AGPL v3.0 Obligations Triggered By:**
- Modifying Nagini source code
- Distributing software that includes Nagini
- Running modified Nagini on servers accessible over network
- Creating derivative works based on Nagini

#### Commercial License Compliance

**✅ Commercial License Provides:**
- **Freedom from Copyleft**: No requirement to share proprietary code
- **Closed Source Development**: Keep modifications and integrations private
- **Flexible Distribution**: Distribute without AGPL restrictions
- **Commercial Support**: Access to professional development assistance

### Frequently Asked Questions

**Q: Can I use Nagini for my startup?**
A: If your startup generates revenue or seeks profit, you need a commercial license. We offer startup-friendly pricing for companies under $1M revenue.

**Q: What if I'm building an open-source educational platform?**
A: Open-source educational projects qualify for free AGPL v3.0 use, provided you comply with source sharing requirements.

**Q: Can government agencies use Nagini for free?**
A: Yes, government agencies and public administrations qualify for free AGPL v3.0 use.

**Q: What happens if I start commercial but want to go open-source?**
A: You can switch from commercial to AGPL v3.0 license at any time by open-sourcing your modifications.

**Q: Do I need a license for evaluation or proof-of-concept?**
A: 30-day evaluation periods are available for commercial prospects. Contact us for evaluation terms.

**Q: Can I get a commercial license even if I'm not doing commercial activities?**
A: Absolutely! Commercial licenses are available to anyone who prefers not to comply with AGPL v3.0 copyleft obligations, regardless of whether their use is commercial or non-commercial.

**Q: Why would a non-profit or researcher want a commercial license?**
A: Some organizations have policies against copyleft licensing, need to keep modifications private, or simply want maximum flexibility without source code sharing requirements.

**Q: Can I get a custom license agreement?**
A: Yes, we offer custom licensing terms for unique use cases, OEM partnerships, and special requirements.

---

## Troubleshooting

### Common Issues

#### 1. Manager Not Ready
```javascript
// Problem: Calling executeAsync before initialization
const result = await manager.executeAsync("test.py", code);
// Error: Manager not ready

// Solution: Always wait for ready state
await Nagini.waitForReady(manager);
const result = await manager.executeAsync("test.py", code);
```

#### 2. Type Validation Errors
```javascript
// Problem: Incorrect parameter types
const manager = Nagini.createManager(
    "numpy",           // Should be array
    null,             // Should be array
    123,              // Should be string
    undefined         // Should be string
);

// Solution: Use correct types
const manager = Nagini.createManager(
    ["numpy"],        // Array of strings
    [],               // Array of objects
    "./init.py",      // String path
    "./worker.js"     // String path
);
```

#### 3. Input Handling Issues
```javascript
// Problem: Input requested but no callback or queue
manager.setInputCallback(null);  // No callback
// Code with input() will hang

// Solution: Set callback or queue inputs
manager.setInputCallback(async (prompt) => {
    const input = window.prompt(prompt);
    manager.provideInput(input);
});

// Or queue inputs
manager.queueInput("response1");
manager.queueInput("response2");
```

#### 4. Matplotlib Not Working
```javascript
// Problem: matplotlib not in packages list
const manager = Nagini.createManager(
    ["numpy"],  // Missing matplotlib
    [],
    "./init.py",
    "./worker.js"
);

// Solution: Include matplotlib in packages
const manager = Nagini.createManager(
    ["numpy", "matplotlib"],
    [],
    "./init.py",
    "./worker.js"
);
```

#### 5. File Loading Failures
```javascript
// Problem: Incorrect file object structure
const filesToLoad = [
    "https://example.com/file.py"  // Should be object
];

// Solution: Use proper file objects
const filesToLoad = [
    {
        url: "https://example.com/file.py",
        path: "modules/file.py"
    }
];
```

### Debug Mode

Enable comprehensive logging:

```javascript
// All components include detailed logging
// Look for these prefixes in browser console:
// 🐍 Nagini
// 🎛️ PyodideManager  
// ⚡ PyodideManagerStaticExecutor
// 🏭 PyodideWorker
// 📦 PyodideFileLoader
```

### Network Diagnostics

Check browser network tab for:
- Pyodide runtime loading (`pyodide.js`)
- Python package downloads from PyPI
- S3 file loading requests
- Worker script loading

### Performance Monitoring

```javascript
// Monitor execution performance
const startTime = performance.now();
const result = await manager.executeAsync("test.py", code);
const endTime = performance.now();
console.log(`Execution took ${endTime - startTime}ms`);
console.log(`Result time: ${result.time}ms`);

// Monitor memory usage
console.log(`History entries: ${manager.executionHistory.length}`);
if (manager.executionHistory.length > 100) {
    manager.clearExecutionHistory();
}
```

### Browser Support

#### Requirements
- **WebWorkers**: Required for Python execution
- **SharedArrayBuffer**: Required for some Pyodide features
- **WebAssembly**: Required for Python runtime
- **Fetch API**: Required for file loading

#### Browser Compatibility
- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (SharedArrayBuffer may need flags)
- **Mobile**: Limited support due to memory requirements

#### CORS Issues
```javascript
// Problem: CORS errors when loading files
// Solution: Ensure proper CORS headers on file server
// Or use same-origin files for development
```

---

## Technical Specifications

### Pyodide Version
- **Current**: v0.27.7
- **CDN**: `https://cdn.jsdelivr.net/pyodide/v0.27.7/full/`
- **Upgrades**: Update `PYODIDE_CDN` in `worker-config.js`

### Performance Metrics
- **Initialization**: 3-7 seconds (network dependent)
- **Execution**: Near-native Python speed
- **Memory**: 100-300MB (package dependent)
- **Figure Generation**: Real-time base64 encoding

### Security Considerations
- **Code Execution**: Arbitrary Python code execution
- **Network Access**: Python can make HTTP requests
- **File System**: Access to virtual filesystem only
- **Worker Isolation**: Thread isolation, not security sandboxing

**⚠️ Important for Production:**
- Implement input validation and code sandboxing
- Use Content Security Policy (CSP) headers
- Monitor and limit execution resources
- Validate all user-provided Python code
- Consider network access restrictions

**Commercial License Holders:** Contact us for security best practices and enterprise deployment guidance.

---

## Legal Notice

**Copyright © 2025 SAS POINTCARRE.APP**

This documentation covers Nagini v1.0 under dual licensing:
- **AGPL v3.0** for non-commercial use
- **Commercial License** for business applications

For commercial licensing inquiries, contact us at [your-email].

*Last updated: 2025*
