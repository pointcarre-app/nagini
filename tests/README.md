# Nagini Unified Test Suite

Single comprehensive test page that demonstrates both Pyodide and Brython backends in a side-by-side comparison.

## Files

- `unified-test.html` - Complete test suite with two columns (Pyodide vs Brython)
- `flask-example.py` - Flask app for cross-origin testing (required for proper CORS testing)

## Features Tested

### Pyodide (Left Column)
- ✅ Basic Python execution with blob workers
- ✅ NumPy + Matplotlib integration
- ✅ Interactive input() handling
- ✅ Cross-origin compatibility
- ✅ Automatic blob worker creation

### Brython (Right Column)  
- ✅ Basic Python execution (JavaScript transpilation)
- ✅ Turtle graphics with canvas integration
- ✅ DOM manipulation and browser integration
- ✅ Instant startup (no downloads)

## How to Run

1. **Start Nagini server (port 8010):**
   ```bash
   python3 serve.py
   ```

2. **Start Flask app (port 5001) for cross-origin testing:**
   ```bash
   python3 tests/flask-example.py
   ```

3. **Open unified test page:**
   ```bash
   open http://127.0.0.1:8010/tests/unified-test.html
   ```

4. **Test everything:**
   - Click buttons in both columns to test different features
   - Pyodide tests will show blob worker initialization
   - Brython tests will show instant execution
   - Turtle graphics will appear in the canvas

The test demonstrates cross-origin compatibility between the Nagini server (8010) and Flask app (5001), showcasing how blob workers solve CORS issues for Pyodide while Brython runs directly in the main thread. 