# Xterm + Nagini Python Terminal

A simple experiment integrating **xterm.js** with **Nagini** to create an interactive Python terminal in the browser.

## Features

- 🖥️ **Real Terminal Interface** - Full xterm.js terminal with cursor, colors, and keyboard navigation
- 🐍 **Python Execution** - Execute Python code using Nagini's Pyodide backend
- 📋 **Template System** - Pre-written Python scripts ready to execute
- 📊 **Matplotlib Support** - Automatic figure display and matplotlib integration
- 🔧 **Interactive Commands** - Built-in terminal commands for easy navigation
- 📚 **Scientific Packages** - Includes numpy and matplotlib

## Getting Started

1. **Start a local server** from the project root:
   ```bash
   python serve.py
   # or
   python -m http.server 8000
   ```

2. **Open the experiment** in your browser:
   ```
   http://localhost:8000/experiments/xterm/
   ```

3. **Wait for initialization** - Nagini will download and initialize Pyodide (may take 30-60 seconds)

4. **Start using the terminal** - Type `help` for available commands

## Available Commands

- `help` - Show help message
- `clear` - Clear the terminal screen
- `templates` - List all available Python templates
- `run <name>` - Execute a Python template by name
- `status` - Show Nagini system status

## Python Templates

### hello_world
Simple hello world script with user input demonstration.

### data_analysis
Basic data analysis using numpy with statistics calculation and histogram plotting.

### calculator
Interactive calculator supporting basic math operations and scientific functions.

### plot_demo
Comprehensive matplotlib demonstration with multiple plot types (line, scatter, bar, pie).

## Usage Examples

```bash
# List available templates
$ templates

# Run a specific template
$ run hello_world

# Check system status
$ status

# Get help
$ help
```

## Template Buttons

You can also execute templates using the buttons below the terminal - these provide the same functionality as the terminal commands.

## Technical Details

- **Frontend**: xterm.js for terminal interface
- **Backend**: Nagini with Pyodide for Python execution
- **Packages**: numpy, matplotlib pre-installed
- **Worker**: Uses ES6 modules (development mode)

## Customization

To add new templates, edit the `templates` object in `app.js`:

```javascript
this.templates = {
    my_template: `# My custom Python script
print("Hello from my template!")
# ... your Python code here
`
};
```

## Browser Requirements

- Modern browser with WebAssembly support
- JavaScript enabled
- Minimum 4GB RAM recommended for Pyodide

## Troubleshooting

- **Slow initialization**: Pyodide download may take time on slower connections
- **Memory issues**: Pyodide requires significant memory - close other tabs if needed
- **Worker errors**: Make sure you're serving from the correct directory

---

This experiment demonstrates the integration between terminal interfaces and Python execution in the browser, showcasing the power of combining xterm.js with Nagini's Python capabilities. 