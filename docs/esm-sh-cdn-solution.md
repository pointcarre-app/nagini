# esm.sh CDN Solution for Nagini ⭐

**The recommended approach for importing Nagini from CDN**

## Overview

esm.sh is a smart CDN that automatically resolves ES6 module dependencies, making it the perfect solution for importing Nagini without the complexity of manual dependency management or bundling.

## Why esm.sh is Our Recommended Solution

### The Problem We Solve

Nagini's main `src/nagini.js` file contains ES6 import statements:
```javascript
import { ValidationUtils } from './utils/validation.js';
```

When loaded from raw CDNs like jsDelivr, these relative imports fail because:
- The browser doesn't know where to find `'./utils/validation.js'`
- Cross-origin module loading restrictions apply
- Raw CDN services don't resolve dependencies automatically

### The esm.sh Solution

esm.sh acts as a smart proxy that:
1. **Automatically resolves** all ES6 import dependencies
2. **Bundles on-the-fly** without requiring pre-built bundles
3. **Optimizes for performance** with intelligent caching
4. **Works universally** across all modern environments

## Implementation

### Basic Usage

```html
<script type="module">
    // One-line import - esm.sh handles all dependencies automatically
    const naginiModule = await import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.19/src/nagini.js');
    const Nagini = naginiModule.Nagini;
    
    // Use Nagini normally
    const manager = await Nagini.createManager(
        'pyodide',
        ['numpy'],
        [],
        [],
        'https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.19/src/pyodide/worker/worker-dist.js'
    );
    
    await Nagini.waitForReady(manager);
    console.log('Nagini ready!');
</script>
```

### Complete Static Website Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nagini with esm.sh CDN</title>
</head>
<body>
    <h1>Python in Browser with Nagini</h1>
    <div id="output"></div>
    <div id="figures"></div>
    
    <script type="module">
        async function runPythonDemo() {
            try {
                // Load Nagini from esm.sh CDN
                console.log('Loading Nagini from esm.sh...');
                const naginiModule = await import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.19/src/nagini.js');
                const Nagini = naginiModule.Nagini;
                
                // Create Pyodide manager
                const manager = await Nagini.createManager(
                    'pyodide',
                    ['numpy', 'matplotlib'],
                    [],
                    [],
                    'https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.19/src/pyodide/worker/worker-dist.js'
                );
                
                console.log('Waiting for Nagini to be ready...');
                await Nagini.waitForReady(manager);
                
                // Execute Python code
                const result = await manager.executeAsync('demo.py', `
import numpy as np
import matplotlib.pyplot as plt

# Create data
x = np.linspace(0, 2 * np.pi, 100)
y = np.sin(x)

# Create plot
plt.figure(figsize=(10, 6))
plt.plot(x, y, 'b-', linewidth=2)
plt.title('Sine Wave - Generated with Nagini + esm.sh')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.grid(True, alpha=0.3)

print("Plot created successfully!")
print(f"Data points: {len(x)}")
                `);
                
                // Display output
                document.getElementById('output').innerHTML = `
                    <h2>Python Output:</h2>
                    <pre>${result.stdout}</pre>
                `;
                
                // Display figures
                if (result.figures && result.figures.length > 0) {
                    const figuresDiv = document.getElementById('figures');
                    result.figures.forEach((base64, i) => {
                        const img = document.createElement('img');
                        img.src = `data:image/png;base64,${base64}`;
                        img.style.maxWidth = '100%';
                        figuresDiv.appendChild(img);
                    });
                }
                
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('output').innerHTML = `
                    <h2>Error:</h2>
                    <pre style="color: red;">${error.message}</pre>
                `;
            }
        }
        
        // Run the demo
        runPythonDemo();
    </script>
</body>
</html>
```

### Web Application Integration

```javascript
// In your web application
class NaginiService {
    constructor() {
        this.nagini = null;
        this.manager = null;
    }
    
    async initialize() {
        if (this.nagini) return; // Already initialized
        
        try {
            // Load from esm.sh
            const naginiModule = await import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.19/src/nagini.js');
            this.nagini = naginiModule.Nagini;
            
            // Create manager
            this.manager = await this.nagini.createManager(
                'pyodide',
                ['pandas', 'numpy', 'matplotlib'],
                ['scikit-learn'],
                [],
                'https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.19/src/pyodide/worker/worker-dist.js'
            );
            
            await this.nagini.waitForReady(this.manager);
            console.log('Nagini service ready');
            
        } catch (error) {
            console.error('Failed to initialize Nagini:', error);
            throw error;
        }
    }
    
    async executePython(code) {
        if (!this.manager) {
            throw new Error('Nagini not initialized. Call initialize() first.');
        }
        
        return await this.manager.executeAsync('user_code.py', code);
    }
}

// Usage
const naginiService = new NaginiService();
await naginiService.initialize();

const result = await naginiService.executePython(`
import pandas as pd
data = pd.DataFrame({'x': [1, 2, 3], 'y': [4, 5, 6]})
print(data.describe())
`);
```

### Cordova/PhoneGap Mobile Apps

```html
<!-- In your Cordova app's index.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Mobile Python App</title>
</head>
<body>
    <div id="app">
        <h1>Mobile Python Calculator</h1>
        <textarea id="python-code" rows="10" cols="50">
# Mobile Python Calculator
import math

def calculate_area(radius):
    return math.pi * radius ** 2

radius = 5
area = calculate_area(radius)
print(f"Circle area with radius {radius}: {area:.2f}")
        </textarea>
        <br>
        <button onclick="runPython()">Run Python</button>
        <div id="result"></div>
    </div>
    
    <script type="module">
        let naginiManager = null;
        
        // Initialize Nagini when app starts
        document.addEventListener('deviceready', async function() {
            try {
                const naginiModule = await import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.19/src/nagini.js');
                const Nagini = naginiModule.Nagini;
                
                // Use Brython for faster mobile startup
                naginiManager = await Nagini.createManager('brython', [], [], '', '');
                await Nagini.waitForReady(naginiManager);
                
                console.log('Mobile Python ready!');
            } catch (error) {
                console.error('Failed to initialize Python:', error);
            }
        });
        
        // Make runPython available globally
        window.runPython = async function() {
            if (!naginiManager) {
                alert('Python not ready yet. Please wait...');
                return;
            }
            
            const code = document.getElementById('python-code').value;
            const result = await naginiManager.executeAsync('mobile.py', code);
            document.getElementById('result').innerHTML = `<pre>${result.stdout}</pre>`;
        };
    </script>
</body>
</html>
```

## CDN Solution Comparison Table

| Solution | Simplicity | Universal Support | Static Websites | Web Apps | Cordova Apps | Bundle Size | Load Speed | Offline | Commercial Use | Maintenance |
|----------|------------|-------------------|-----------------|----------|--------------|-------------|------------|---------|----------------|-------------|
| **esm.sh CDN** ⭐ | 🟢 Very Easy | 🟢 Excellent | 🟢 Perfect | 🟢 Perfect | 🟢 Perfect | 🟢 Dynamic | 🟡 Medium | 🔴 No | 🟢 Free | 🟢 None |
| **UMD Bundle** | 🟢 Very Easy | 🟢 Universal | 🟢 Perfect | 🟢 Perfect | 🟢 Perfect | 🟡 ~15KB | 🟢 Fast | 🟢 Yes | 🟢 Free | 🟡 Manual |
| **Import Maps** | 🟡 Medium | 🔴 Modern Only | 🟡 Limited | 🟡 Limited | 🔴 Poor | 🟢 Original | 🔴 Slow | 🟢 Yes | 🟢 Free | 🔴 Complex |
| **Raw jsDelivr** | 🔴 Fails | 🔴 Broken | 🔴 Broken | 🔴 Broken | 🔴 Broken | 🟢 Original | 🔴 Error | 🔴 No | 🟢 Free | N/A |

### Why esm.sh Wins

1. **🎯 Simplicity**: One-line import, no configuration needed
2. **🌐 Universal**: Works in all environments without modification
3. **🚀 Automatic**: Resolves all dependencies without manual mapping
4. **💰 Free**: No cost for commercial use, no rate limits for normal usage
5. **🔧 Zero Maintenance**: No need to update bundles or manage dependencies
6. **⚡ Performance**: Smart caching and optimization
7. **🛡️ Reliable**: Backed by a robust CDN infrastructure

## Advanced Features

### Version Pinning

```javascript
// Pin to specific Nagini version
const naginiModule = await import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.19/src/nagini.js');

// Pin to specific esm.sh features
const naginiModule = await import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.19/src/nagini.js?bundle');
```

### Error Handling

```javascript
async function loadNaginiWithFallback() {
    try {
        // Try esm.sh first
        const naginiModule = await import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.19/src/nagini.js');
        return naginiModule.Nagini;
    } catch (esmError) {
        console.warn('esm.sh failed, falling back to UMD bundle:', esmError);
        
        try {
            // Fallback to UMD bundle
            const umdModule = await import('https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.19/src/nagini.umd.js');
            return umdModule.default || umdModule;
        } catch (umdError) {
            console.error('All CDN methods failed:', { esmError, umdError });
            throw new Error('Unable to load Nagini from any CDN source');
        }
    }
}
```

### Performance Optimization

```javascript
// Preload for better performance
const naginiPromise = import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.19/src/nagini.js');

// Use when needed
async function usePython() {
    const naginiModule = await naginiPromise;
    const Nagini = naginiModule.Nagini;
    // ... rest of your code
}
```

## Browser Compatibility

- **Chrome**: Full support (all versions with ES modules)
- **Firefox**: Full support (all versions with ES modules)
- **Safari**: Full support (all versions with ES modules)
- **Edge**: Full support (Chromium-based versions)
- **Mobile**: Full support on all modern mobile browsers
- **Cordova/PhoneGap**: Full support

## Troubleshooting

### Common Issues

1. **"Failed to resolve module"**: Check the version tag and ensure the file exists
2. **CORS errors**: esm.sh handles CORS automatically, but ensure your site allows module imports
3. **Slow loading**: First load may be slower as esm.sh processes dependencies; subsequent loads are cached

### Debug Mode

```javascript
// Enable verbose logging
const naginiModule = await import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.19/src/nagini.js?dev');
```

## Migration Guide

### From Raw jsDelivr

**Before (broken):**
```javascript
const module = await import('https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.19/src/nagini.js');
```

**After (working):**
```javascript
const module = await import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.19/src/nagini.js');
```

### From UMD Bundle

**Before:**
```javascript
const module = await import('https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.19/src/nagini.umd.js');
const Nagini = module.default || module;
```

**After:**
```javascript
const module = await import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.19/src/nagini.js');
const Nagini = module.Nagini;
```

## Conclusion

esm.sh CDN provides the perfect balance of simplicity, performance, and compatibility for importing Nagini. It eliminates the complexity of dependency management while providing universal support across all deployment scenarios.

**Use esm.sh when you want:**
- ✅ The simplest possible integration
- ✅ Universal compatibility
- ✅ Zero maintenance overhead
- ✅ Automatic dependency resolution
- ✅ Commercial-friendly licensing

This makes esm.sh the clear choice for most Nagini deployments.
