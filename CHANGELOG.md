# v0.0.11

- **Fix**: Corrected a 404 error in the scenery application by removing an import for a non-existent `failure-tests.js` file.

> [!DANGER]
> Versions prior to `v0.0.11` are unstable due to a critical bug in the `input()` handling system. These versions should not be used in production.



# v0.0.10-unstable

- **Bug Fix**: Fixed a critical bug where the asynchronous `input()` handling was broken. The `PyodideManager` was not correctly dequeuing and sending inputs to the worker, causing tests to fail and `input()` to return empty strings.
- **Documentation**: Added comprehensive documentation for the interactive input system to `docs/docs.md` and both the root and worker `README.md` files to clarify the asynchronous flow and prevent future regressions.
- **Worker Bundle Update**: Rebuilt `worker-dist.js` to include the input handling fix.

**🌐 jsDelivr CDN URLs for v0.0.10:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.10/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.10/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.10/src/pyodide/worker/worker-dist.js`
- **Xterm Integration**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.10/experiments/xterm/`


# v0.0.9-unstable

- **Bug Fix**: Corrected an issue where `PyodideFileLoader.loadFiles` was called as a static method instead of an instance method within the web worker, preventing custom files from being loaded.
- **Worker Bundle Update**: Rebuilt `worker-dist.js` to include the file loader fix.

**🌐 jsDelivr CDN URLs for v0.0.9:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.9/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.9/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.9/src/pyodide/worker/worker-dist.js`
- **Xterm Integration**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.9/experiments/xterm/`



# v0.0.8-unstable

- **Code Refactoring**: Removed redundant `Nagini` export in `src/nagini.js` to prevent double exports and improve code clarity.

**🌐 jsDelivr CDN URLs for v0.0.8:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.8/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.8/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.8/src/pyodide/worker/worker-dist.js`
- **Xterm Integration**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.8/experiments/xterm/`



# v0.0.7-unstable

- **Logging Format Standardization**: Standardized all logging messages to use consistent snake emoji (🐍) prefix
    - Updated all console.log, console.warn, console.error, and console.info statements across `/src` directory
    - Replaced various emojis (🔧, ��️, 📦, 🏭, 🚨, 🐢, ⚡, etc.) with consistent 🐍 snake emoji
    - Improved log readability and consistency across all modules
- **Reduced Verbose Logging**: Removed full file content logging in worker execution
    - Eliminated logging of entire transformed Python code blocks
    - Removed ASCII separator lines that cluttered console output
    - Kept essential execution information while reducing noise
- **Worker Bundle Update**: Rebuilt worker-dist.js with new logging format
    - All worker logging now follows consistent snake emoji format
    - Reduced bundle size by removing verbose code logging

**🌐 jsDelivr CDN URLs for v0.0.7:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.7/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.7/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.7/src/pyodide/worker/worker-dist.js`
- **Xterm Integration**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.7/experiments/xterm/`



# v0.0.5-unstable

- **GitHub Migration**: Migrated project to GitHub for better collaboration and open source visibility
- **Xterm Integration**: Added new xterm.js terminal experiment in `/experiments/xterm/`
    - Real terminal interface with xterm.js integration
    - Interactive Python execution via Nagini/Pyodide
    - Template system with 4 pre-built Python scripts (hello_world, data_analysis, calculator, plot_demo)
    - Command history support with arrow keys
    - Professional VS Code-inspired dark theme
    - Matplotlib figure display integration
    - ASCII box frame improvements for better cross-platform compatibility
- **Enhanced Documentation**: Updated docs with xterm integration examples
- **ES6 Module Support**: Fixed module import issues for better browser compatibility

**🌐 jsDelivr CDN URLs for v0.0.5:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.5/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.5/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.5/src/pyodide/worker/worker-dist.js`
- **Xterm Integration**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.5/experiments/xterm/`



# v0.0.4-unstable

- No dual licensing: only AGPLv3



# v0.0.3-unstable

- Added micropip support
    - Added antlr4-python3-runtime support


# v0.0.2-unstable

- Fixed missive handling (ie parse at last moment, outside of the manager)
- Fixed `/scenery` 
- Fixed `/tests` (ie Flask cross origin)


# v0.0.1-unstable 

- Initial release
- Worker-based architecture
- Interactive input
- Matplotlib visualization
- Remote module loading
- Namespace isolation
- Structured data exchange
- Filesystem access
- Dual backend support
- Scenery testing