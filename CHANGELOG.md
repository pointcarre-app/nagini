# v0.0.21

- **Logging Optimization**: Significantly minimized verbose logging across pyodide and utils directories while preserving essential execution results
  - **🐍 Enhanced Execution Logging**: All execution results (stdout/stderr/error/missive) now prominently displayed with snake emoji for easy identification
  - **Reduced Noise**: Removed verbose constructor, initialization, package loading, and file operation logs
  - **Clean Console**: Minimized worker creation, input handling, and validation logs while maintaining error reporting
  - **Performance**: Cleaner console output improves debugging experience and reduces log overhead
- **Code Quality**: Maintained all functionality while significantly improving log signal-to-noise ratio
- **Developer Experience**: Execution results are now the primary focus in console output with clear 🐍 snake emoji markers

# v0.0.20

- **Bug Fixes**: Fixed template literal syntax errors in esm.sh execution tests - replaced triple backslashes with clean string concatenation
- **UMD Bundle Fixes**: Resolved UMD bundle import issues by enhancing test methods to handle multiple import scenarios (module exports + global fallback)
- **Test Improvements**: Updated UMD tests to use v0.0.19 (where UMD bundle was actually created) instead of v0.0.17
- **Documentation**: All CDN import solutions now fully tested and working - esm.sh ⭐, UMD Bundle, and Import Maps
- **Production Ready**: Complete CDN import solution with comprehensive test coverage and clean, maintainable code

# v0.0.19

- **CDN Import Solutions**: Implemented comprehensive CDN import solutions for ES6 module compatibility:
  - **esm.sh CDN** ⭐ (Recommended): Smart CDN with automatic ES6 dependency resolution - free for commercial use
  - **UMD Bundle** (`nagini.umd.js`): Universal module definition for maximum compatibility across all environments
  - **Import Maps**: Modern browser solution for fine-grained dependency control
  - **Comprehensive Testing**: Added dedicated test suites for each CDN import method in scenery
  - **Documentation**: Created detailed comparison table and implementation guides for all solutions
- **Primary Solution**: esm.sh CDN chosen as the recommended approach for its simplicity and universal compatibility


# v0.0.18

- **Testing**: Added comprehensive CDN version and execution tests to the `scenery` test suite. These new tests validate that Nagini can be properly loaded and executed from the jsDelivr CDN, ensuring production readiness for CDN-based deployments.


# v0.0.17

- **CI/CD Fix**: Corrected the `requirements.txt` to properly install the imaging dependencies for the `mkdocs-material` social plugin. This resolves the final, persistent build error and ensures the documentation deploys successfully.

# v0.0.16

- **CI/CD Fix**: Corrected all deployment pathing issues for the GitHub Pages site. The interactive `scenery` test suite is now fully functional on the live documentation site.
- **Docs**: All hardcoded local URLs in the documentation have been replaced with relative paths for portability.
- **Stability**: This version marks the first stable release after the upgrade to Pyodide v0.28.0 and the resolution of all related deployment and testing issues.

> [!DANGER]
> Versions prior to `v0.0.16` are unstable.

# v0.0.15-unstable

- **CI/CD Fix**: Corrected the MkDocs deployment workflow by installing the necessary imaging dependencies (`mkdocs-material[imaging]`) for the social plugin. This resolves the final build error and ensures the documentation deploys successfully.

# v0.0.14-unstable

- **CI/CD**: Refactored the GitHub Pages deployment workflow to use a more robust, two-stage process. This resolves 404 errors for documentation pages by ensuring the entire `site` directory, including the `scenery` test application, is correctly deployed.
- **Docs**: Added links to the live documentation and interactive demos at the top of the `README.md` for easy access.

# v0.0.13-unstable

- **Upgrade**: Upgraded Pyodide to v0.28.0.
- **Fix**: Corrected Matplotlib integration to be compatible with Pyodide v0.28.0. The internal backend is now explicitly set to `agg` to ensure compatibility with the Web Worker environment, and font caching has been disabled to improve test stability.
- **Fix**: Resolved an issue where interactive test buttons in the `/scenery` application were unresponsive.
- **Documentation**: Added a new "Repository Reference" section to the documentation, providing a detailed file-by-file breakdown of the entire `src` directory.
- **Experiments**: Added a new `matplotlib-default` experiment to demonstrate the correct usage of Matplotlib within Nagini. Removed obsolete Matplotlib experiments.

# v0.0.12-unstable

- **Documentation**: Added a full documentation site with MkDocs, including a JSDoc-based API reference.
- **GitHub Actions**: Set up a new workflow to automatically build and deploy the documentation to GitHub Pages.

# v0.0.11-unstable

- **Fix**: Corrected a 404 error in the scenery application by removing an import for a non-existent `failure-tests.js` file.
- **README**: Added a prominent legend to clarify the branching model and production usage guidelines.
- **README**: Removed outdated information about `pre-push` hooks.




# v0.0.10-unstable

- **Bug Fix**: Fixed a critical bug where the asynchronous `input()` handling was broken. The `PyodideManager` was not correctly dequeuing and sending inputs to the worker, causing tests to fail and `input()` to return empty strings.
- **Documentation**: Added comprehensive documentation for the interactive input system to `docs/docs.md` and both the root and worker `README.md` files to clarify the asynchronous flow and prevent future regressions.
- **Worker Bundle Update**: Rebuilt `worker-dist.js` to include the input handling fix.

**🌐 jsDelivr CDN URLs for v0.0.10:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.10/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.10/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.10/src/pyodide/worker/worker-dist.js`


# v0.0.9-unstable

- **Bug Fix**: Corrected an issue where `PyodideFileLoader.loadFiles` was called as a static method instead of an instance method within the web worker, preventing custom files from being loaded.
- **Worker Bundle Update**: Rebuilt `worker-dist.js` to include the file loader fix.

**🌐 jsDelivr CDN URLs for v0.0.9:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.9/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.9/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.9/src/pyodide/worker/worker-dist.js`



# v0.0.8-unstable

- **Code Refactoring**: Removed redundant `Nagini` export in `src/nagini.js` to prevent double exports and improve code clarity.

**🌐 jsDelivr CDN URLs for v0.0.8:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.8/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.8/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.8/src/pyodide/worker/worker-dist.js`



# v0.0.7-unstable

- **Logging Format Standardization**: Standardized all logging messages to use consistent snake emoji (🐍) prefix
    - Updated all console.log, console.warn, console.error, and console.info statements across `/src` directory
    - Replaced various emojis (🔧, ️, 📦, 🏭, 🚨, 🐢, ⚡, etc.) with consistent 🐍 snake emoji
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



# v0.0.5-unstable

- **GitHub Migration**: Migrated project to GitHub for better collaboration and open source visibility
- **Enhanced Documentation**: Updated documentation for better clarity
- **ES6 Module Support**: Fixed module import issues for better browser compatibility

**🌐 jsDelivr CDN URLs for v0.0.5:**
- **Main Nagini Module**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.5/src/nagini.js`
- **Pyodide Worker (ES6)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.5/src/pyodide/worker/worker.js`
- **Pyodide Worker (Bundled)**: `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.5/src/pyodide/worker/worker-dist.js`



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