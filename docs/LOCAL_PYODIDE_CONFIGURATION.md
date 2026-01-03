# Local Pyodide Configuration Guide

## Quick Start

### 1. Copy folders to your static directory

```bash
# Copy Nagini (whole folder)
cp -r nagini/src/ your-static/nagini/

# Copy minimal Pyodide bundle
python scripts/create_minimal_pyodide.py
cp -r pyodide-local-needed-for-app/ your-static/pyodide/
```

### 2. Initialize

```javascript
import { Nagini } from './nagini/nagini.js';

const manager = await Nagini.createManager(
    'pyodide',
    ['sympy', 'pydantic'],
    [], [], 
    './nagini/pyodide/worker/worker-dist.js',
    { pyodideCdnUrl: './pyodide/' }  // 👈 Must end with /
);

await Nagini.waitForReady(manager, 60000);
```

### 3. Use

```javascript
const result = await manager.executeAsync('test.py', `
import sympy as sp
x = sp.Symbol('x')
print(sp.solve(x**2 - 4, x))
`);
```

---

## Folder Structure

```
your-static/
├── nagini/           # Copied from nagini/src/
│   ├── nagini.js
│   └── pyodide/
│       └── worker/
│           └── worker-dist.js
│
└── pyodide/          # Created by script (~18MB)
    ├── pyodide.js
    ├── pyodide.asm.wasm
    ├── python_stdlib.zip
    ├── sympy-*.whl
    └── ...
```

---

## Customize Packages

Edit `PACKAGES_TO_INCLUDE` in `scripts/create_minimal_pyodide.py`:

```python
PACKAGES_TO_INCLUDE = [
    "sympy", "mpmath",
    "pydantic", "pydantic_core", 
    "micropip", "packaging",
    # Add your packages here
]
```

---

## Troubleshooting

- **404 errors**: Check `pyodideCdnUrl` ends with `/`
- **Package not found**: Add the `.whl` to your pyodide folder
