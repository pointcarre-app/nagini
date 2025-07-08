#!/usr/bin/env python3
"""
Simple Flask app example showing how to integrate Nagini
"""

from flask import Flask, render_template_string
import os

app = Flask(__name__)

# Ensure Flask responses include CORS and COOP/COEP headers so that
# cross-origin module workers and SharedArrayBuffer are allowed.


@app.after_request
def add_cors_and_isolation_headers(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "*"
    # Cross-origin isolation headers
    resp.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
    resp.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    return resp


# Determine which port the static Nagini server is running on.
STATIC_PORT = os.getenv("NAGINI_STATIC_PORT", "8010")

# Simple HTML template that uses Nagini; port is supplied via Jinja {{}} variable.
TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="description" content="Flask app with Nagini integration">
    <meta name="keywords" content="flask, nagini, python, integration">
    <title>Flask + Nagini</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        button { padding: 10px 20px; margin: 10px; font-size: 16px; }
        #output { background: #f5f5f5; padding: 20px; margin: 20px 0; white-space: pre-wrap; }
    </style>
</head>
<body>
    <h1>Flask App with Nagini</h1>
    <button onclick="runPython()">Run Python Code</button>
    <div id="output">Click button to run Python...</div>

    <script type="module">
        import { Nagini } from 'http://127.0.0.1:{{ port }}/src/nagini.js';
        
        let manager = null;
        
        async function createBlobWorkerUrl(workerPath) {
            try {
                // Fetch the worker module
                const response = await fetch(workerPath);
                if (!response.ok) {
                    throw new Error(`Failed to fetch worker: ${response.status} ${response.statusText}`);
                }
                const workerCode = await response.text();

                // Create a blob with the bundled worker code directly
                const blob = new Blob([workerCode], { type: 'application/javascript' });
                const blobUrl = URL.createObjectURL(blob);

                return blobUrl;
            } catch (error) {
                throw new Error(`Failed to create blob worker URL: ${error.message}`);
            }
        }
        
        async function initNagini() {
            if (manager) return manager;
            
            // Create blob worker URL to avoid CORS issues - using webpack bundled worker
            const workerPath = "http://127.0.0.1:{{ port }}/src/pyodide/worker/worker-dist.js";
            const blobWorkerUrl = await createBlobWorkerUrl(workerPath);
            
            manager = await Nagini.createManager(
                'pyodide',  // backend
                ["numpy"],  // packages
                [],  // filesToLoad
                "http://127.0.0.1:{{ port }}/src/pyodide/python/pyodide_init.py",  // pyodideInitPath
                blobWorkerUrl  // pass the blob URL as workerPath
            );
            
            await Nagini.waitForReady(manager);
            return manager;
        }
        
        async function runPython() {
            const output = document.getElementById('output');
            output.textContent = 'Initializing Nagini...';
            
            try {
                const mgr = await initNagini();
                output.textContent = 'Running Python code...';
                
                const result = await mgr.executeAsync('flask_demo.py', `
import numpy as np
print("Hello from Flask + Nagini!")
data = np.array([1, 2, 3, 4, 5])
print(f"Data: {data}")
print(f"Mean: {np.mean(data)}")
print(f"Sum: {np.sum(data)}")
print("✅ Success!")
                `);
                
                output.textContent = result.stdout || 'No output';
                
            } catch (error) {
                output.textContent = `Error: ${error.message}`;
            }
        }
        
        // Make it globally available
        window.runPython = runPython;
    </script>
</body>
</html>
"""


@app.route("/")
def index():
    return render_template_string(TEMPLATE, port=STATIC_PORT)


if __name__ == "__main__":
    print("Starting Flask app...")
    print(f"Make sure Nagini server is running on http://127.0.0.1:{STATIC_PORT}")
    print("Then open http://127.0.0.1:5001")
    app.run(debug=True, host="0.0.0.0", port=5001)
