# CDN Import Solutions for Nagini

This document explains the different methods for importing Nagini from CDN to resolve ES6 import dependency issues.

## The Problem

Nagini's main `src/nagini.js` file contains ES6 import statements:
```javascript
import { ValidationUtils } from './utils/validation.js';
```

When loaded from a CDN like jsDelivr, these relative imports fail because:
1. The browser doesn't know where to find `'./utils/validation.js'`
2. Cross-origin module loading restrictions apply
3. Raw CDN services don't resolve dependencies automatically

## Solutions Overview

### 1. esm.sh CDN (Recommended)

**Best for**: Universal compatibility, automatic dependency resolution

```html
<script type="module">
    const naginiModule = await import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.17/src/nagini.js');
    const Nagini = naginiModule.Nagini;
</script>
```

**How it works**: esm.sh acts as a smart CDN that automatically resolves and bundles ES6 imports on-the-fly.

### 2. UMD Bundle (Maximum Compatibility)

**Best for**: Legacy browsers, environments with strict CSP, maximum compatibility

```html
<script type="module">
    const naginiModule = await import('https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.17/src/nagini.umd.js');
    const Nagini = naginiModule.default || naginiModule;
</script>
```

**How it works**: The UMD bundle includes all dependencies inline, eliminating import statements entirely.

### 3. Import Maps (Modern Browsers)

**Best for**: Modern browsers, fine-grained control over dependencies

```html
<script type="importmap">
{
  "imports": {
    "./utils/validation.js": "https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.17/src/utils/validation.js",
    "./pyodide/manager/manager.js": "https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.17/src/pyodide/manager/manager.js",
    "./brython/manager/manager.js": "https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.17/src/brython/manager/manager.js"
  }
}
</script>
<script type="module">
    const naginiModule = await import('https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.17/src/nagini.js');
    const Nagini = naginiModule.Nagini;
</script>
```

**How it works**: Import maps tell the browser where to find each dependency, allowing the original ES6 imports to work.

## Complete Examples

### Static Website Example (esm.sh)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Nagini Static Website</title>
</head>
<body>
    <script type="module">
        try {
            // Load Nagini from esm.sh
            const naginiModule = await import('https://esm.sh/gh/pointcarre-app/nagini@v0.0.17/src/nagini.js');
            const Nagini = naginiModule.Nagini;
            
            // Create manager
            const manager = await Nagini.createManager(
                'pyodide',
                ['numpy'],
                [],
                [],
                'https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.17/src/pyodide/worker/worker-dist.js'
            );
            
            await Nagini.waitForReady(manager);
            
            // Execute Python
            const result = await manager.executeAsync('test.py', `
                import numpy as np
                arr = np.array([1, 2, 3, 4, 5])
                print(f"Array: {arr}")
                print(f"Sum: {arr.sum()}")
            `);
            
            console.log(result.stdout);
            
        } catch (error) {
            console.error('Error:', error);
        }
    </script>
</body>
</html>
```

### Cordova App Example (UMD)

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nagini Cordova App</title>
</head>
<body>
    <div id="output"></div>
    
    <script type="module">
        try {
            // UMD bundle works well in Cordova
            const naginiModule = await import('https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@v0.0.17/src/nagini.umd.js');
            const Nagini = naginiModule.default || naginiModule;
            
            // Create Brython manager for lightweight execution
            const manager = await Nagini.createManager('brython', [], [], '', '');
            await Nagini.waitForReady(manager);
            
            // Execute Python
            const result = await manager.executeAsync('mobile.py', `
                import math
                result = math.sqrt(16)
                print(f"Square root of 16 is: {result}")
            `);
            
            document.getElementById('output').textContent = result.stdout;
            
        } catch (error) {
            console.error('Cordova error:', error);
            document.getElementById('output').textContent = 'Error: ' + error.message;
        }
    </script>
</body>
</html>
```

## Troubleshooting

### Common Issues

1. **"Cannot use import statement outside a module"**
   - Solution: Use esm.sh CDN or UMD bundle
   
2. **"Failed to resolve module specifier"**
   - Solution: Use import maps or esm.sh CDN
   
3. **CORS errors**
   - Solution: All solutions work with CORS, use blob workers for Pyodide

### Browser Support

- **esm.sh**: All modern browsers (ES2020+)
- **UMD Bundle**: All browsers including IE11+
- **Import Maps**: Modern browsers only (Chrome 89+, Firefox 108+, Safari 16.4+)

## CDN Solution Comparison Table

| Solution | Simplicity | Universal Support | Static Websites | Web Apps | Cordova Apps | Bundle Size | Load Speed | Offline | Commercial Use | Maintenance |
|----------|------------|-------------------|-----------------|----------|--------------|-------------|------------|---------|----------------|-------------|
| **esm.sh CDN** ⭐ | 🟢 Very Easy | 🟢 Excellent | 🟢 Perfect | 🟢 Perfect | 🟢 Perfect | 🟢 Dynamic | 🟡 Medium | 🔴 No | 🟢 Free | 🟢 None |
| **UMD Bundle** | 🟢 Very Easy | 🟢 Universal | 🟢 Perfect | 🟢 Perfect | 🟢 Perfect | 🟡 ~15KB | 🟢 Fast | 🟢 Yes | 🟢 Free | 🟡 Manual |
| **Import Maps** | 🟡 Medium | 🔴 Modern Only | 🟡 Limited | 🟡 Limited | 🔴 Poor | 🟢 Original | 🔴 Slow | 🟢 Yes | 🟢 Free | 🔴 Complex |
| **Raw jsDelivr** | 🔴 Fails | 🔴 Broken | 🔴 Broken | 🔴 Broken | 🔴 Broken | 🟢 Original | 🔴 Error | 🔴 No | 🟢 Free | N/A |

### Why esm.sh Wins ⭐

1. **🎯 Simplicity**: One-line import, no configuration needed
2. **🌐 Universal**: Works in all environments without modification  
3. **🚀 Automatic**: Resolves all dependencies without manual mapping
4. **💰 Free**: No cost for commercial use, no rate limits for normal usage
5. **🔧 Zero Maintenance**: No need to update bundles or manage dependencies
6. **⚡ Performance**: Smart caching and optimization
7. **🛡️ Reliable**: Backed by a robust CDN infrastructure

## Recommendation

**Use esm.sh CDN** ⭐ for most applications - it provides the best balance of simplicity, performance, and compatibility while automatically handling dependency resolution.
