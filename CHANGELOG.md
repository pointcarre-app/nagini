# v0.0.5

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



# v0.0.4

- No dual licensing: only AGPLv3



# v0.0.3

- Added micropip support
    - Added antlr4-python3-runtime support


# v0.0.2

- Fixed missive handling (ie parse at last moment, outside of the manager)
- Fixed `/scenery` 
- Fixed `/tests` (ie Flask cross origin)


# v0.0.1 

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