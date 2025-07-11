// DOM elements
const statusDiv = document.getElementById('status');
const outputDiv = document.getElementById('output');
const pythonOutputDiv = document.getElementById('python-output');
const testPackageBtn = document.getElementById('testPackage');
const runCustomCodeBtn = document.getElementById('runCustomCode');
const clearOutputBtn = document.getElementById('clearOutput');

// Create worker
const worker = new Worker('js/worker.js');

// Handle worker messages
worker.onmessage = function(e) {
    const {
        type,
        message,
        result
    } = e.data;

    switch (type) {
        case 'ready':
            statusDiv.className = 'status success';
            statusDiv.textContent = message;
            testPackageBtn.disabled = false;
            runCustomCodeBtn.disabled = false;
            outputDiv.textContent = 'Pyodide worker ready! Click buttons to test functionality.';
            break;

        case 'result':
            pythonOutputDiv.textContent += '\\n' + (result || 'Code executed successfully (no return value)');
            break;

        case 'error':
            statusDiv.className = 'status error';
            statusDiv.textContent = 'Error: ' + message;
            outputDiv.textContent += '\\nError: ' + message;
            break;
    }
};

// Initialize worker
worker.postMessage({
    type: 'init'
});

async function runPythonFile(path, description) {
    pythonOutputDiv.textContent += `\\n--- ${description} ---`;
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to fetch script: ${response.statusText}`);
        }
        const pythonCode = await response.text();
        worker.postMessage({ type: 'run', code: pythonCode });
    } catch (error) {
        outputDiv.textContent += `\\nError loading script: ${error.message}`;
    }
}

// Event listeners
testPackageBtn.addEventListener('click', () => {
    runPythonFile('python/test_antlr.py', 'Testing ANTLR4 Package');
});

runCustomCodeBtn.addEventListener('click', () => {
    runPythonFile('python/sympy_parse_expr.py', 'Testing Sympy Parse Expr');
});

clearOutputBtn.addEventListener('click', () => {
    outputDiv.textContent = 'Output cleared.';
    pythonOutputDiv.textContent = '';
}); 