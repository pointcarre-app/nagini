# Pyodide Worker Bundle

This directory contains the Pyodide web worker modules and the build system for bundling them.

## Files

- `worker.js` - Main worker entry point
- `worker-handlers.js` - Message handling logic
- `worker-execution.js` - Python code execution
- `worker-fs.js` - Filesystem operations
- `worker-input.js` - Input handling
- `worker-config.js` - Configuration constants
- `worker-dist.js` - **Bundled output file** (generated)

### Input Handling Flow
The `input()` function in Python is handled via an asynchronous workflow:
1. `worker-input.js` replaces Python's `input()` with a function that sends an `input_required` message to the main thread.
2. The worker then pauses, awaiting a promise to be resolved.
3. The main thread's `manager-input.js` catches the message, gets data from the queue or a callback, and sends it back.
4. The worker receives the response, resolves the promise, and resumes Python execution.
5. It is critical that the bundled `worker-dist.js` is kept up-to-date with any changes to the input handling logic.

## Build Process

### Prerequisites

Make sure you have Node.js installed, then install dependencies:

```bash
npm install
```

### Building

To build the bundled worker:

```bash
npm run build
```

This creates `worker-dist.js` which is a single file containing all worker modules bundled together using webpack.

For development builds:

```bash
npm run build-dev
```

### Usage

The bundled worker (`worker-dist.js`) is used by the Flask examples and other entry points to avoid ES6 import issues when creating blob workers across different origins.

## Why Bundling?

The original modular worker files use ES6 imports, which don't work when creating blob workers from cross-origin contexts (e.g., loading from port 8010 while running on port 5001). The bundled version resolves all imports into a single file that can be safely used as a blob worker.

## Architecture

```
worker.js (entry) 
  ↓ imports
worker-handlers.js
  ↓ imports  
worker-execution.js + worker-fs.js + worker-input.js
  ↓ imports
worker-config.js

webpack bundles all ↓
worker-dist.js (single file, no imports)
``` 