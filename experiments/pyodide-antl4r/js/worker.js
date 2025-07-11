// Load Pyodide
importScripts('https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js');

let pyodide;

async function loadPyodideAndPackages() {
    try {
        pyodide = await self.loadPyodide();
        await pyodide.loadPackage('micropip');
        await pyodide.runPythonAsync(`
            import micropip
            await micropip.install('antlr4-python3-runtime')
        `);
        postMessage({
            type: 'ready',
            message: 'Pyodide loaded and antlr4-python3-runtime installed successfully!'
        });
    } catch (error) {
        postMessage({
            type: 'error',
            message: 'Failed to load Pyodide: ' + error.message
        });
    }
}

// Handle messages from main thread
self.onmessage = async function(e) {
    const { type, code } = e.data;
    
    try {
        switch (type) {
            case 'init':
                await loadPyodideAndPackages();
                break;
                
            case 'run':
                if (!pyodide) {
                    throw new Error('Pyodide not loaded');
                }
                
                const result = await pyodide.runPythonAsync(code);
                postMessage({
                    type: 'result',
                    result: result
                });
                break;
        }
    } catch (error) {
        postMessage({
            type: 'error',
            message: error.message
        });
    }
}; 