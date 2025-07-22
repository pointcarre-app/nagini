// Xterm + Nagini Integration
import { Nagini } from '../../src/nagini.js';

class XtermNaginiApp {
    constructor() {
        this.terminal = null;
        this.fitAddon = null;
        this.manager = null;
        this.isReady = false;
        this.currentPrompt = '';
        this.inputMode = false;
        this.commandHistory = [];
        this.historyIndex = -1;
        
        // Template storage
        this.templates = {
            hello_world: `# Hello World with Input
print("Hello from Nagini Python Terminal!")
name = input("What's your name? ")
age = input("How old are you? ")
print(f"Nice to meet you, {name}! You are {age} years old.")
print("🎉 Welcome to the Python terminal!")`,

            data_analysis: `# Data Analysis Demo
import numpy as np
import matplotlib.pyplot as plt

print("📊 Data Analysis Demo")
print("===================")

# Generate sample data
np.random.seed(42)
data = np.random.normal(100, 15, 1000)

# Calculate statistics
mean = np.mean(data)
std = np.std(data)
median = np.median(data)

print(f"📈 Statistics:")
print(f"   Mean: {mean:.2f}")
print(f"   Std Dev: {std:.2f}")
print(f"   Median: {median:.2f}")

# Create histogram
plt.figure(figsize=(10, 6))
plt.hist(data, bins=30, alpha=0.7, color='skyblue', edgecolor='black')
plt.title('Sample Data Distribution')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.axvline(mean, color='red', linestyle='--', label=f'Mean: {mean:.2f}')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("✅ Analysis complete! Check the plot above.")
missive({"mean": mean, "std": std, "median": median, "data_size": len(data)})`,

            calculator: `# Interactive Calculator
print("🧮 Python Calculator")
print("==================")
print("Available operations: +, -, *, /, **, sqrt, sin, cos, tan")
print("Type 'quit' to exit")

import math

while True:
    try:
        expression = input("Enter calculation (or 'quit'): ")
        
        if expression.lower() in ['quit', 'exit', 'q']:
            print("👋 Goodbye!")
            break
            
        # Replace common math functions
        expression = expression.replace('sqrt', 'math.sqrt')
        expression = expression.replace('sin', 'math.sin')
        expression = expression.replace('cos', 'math.cos')
        expression = expression.replace('tan', 'math.tan')
        expression = expression.replace('pi', 'math.pi')
        expression = expression.replace('e', 'math.e')
        
        result = eval(expression)
        print(f"Result: {result}")
        
    except KeyboardInterrupt:
        break
    except Exception as e:
        print(f"Error: {e}")
        print("Please check your expression and try again.")`,

            plot_demo: `# Matplotlib Plotting Demo
import matplotlib.pyplot as plt
import numpy as np

print("📈 Matplotlib Plotting Demo")
print("===========================")

# Create figure with subplots
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(12, 10))

# Plot 1: Sine and Cosine
x = np.linspace(0, 4*np.pi, 100)
ax1.plot(x, np.sin(x), 'b-', label='sin(x)', linewidth=2)
ax1.plot(x, np.cos(x), 'r--', label='cos(x)', linewidth=2)
ax1.set_title('Trigonometric Functions')
ax1.legend()
ax1.grid(True)

# Plot 2: Random scatter
np.random.seed(42)
x_scatter = np.random.randn(100)
y_scatter = np.random.randn(100)
colors = np.random.rand(100)
ax2.scatter(x_scatter, y_scatter, c=colors, alpha=0.6, cmap='viridis')
ax2.set_title('Random Scatter Plot')

# Plot 3: Bar chart
categories = ['A', 'B', 'C', 'D', 'E']
values = [23, 45, 56, 78, 32]
ax3.bar(categories, values, color=['red', 'green', 'blue', 'orange', 'purple'])
ax3.set_title('Bar Chart')
ax3.set_ylabel('Values')

# Plot 4: Pie chart
labels = ['Python', 'JavaScript', 'Java', 'C++', 'Other']
sizes = [30, 25, 20, 15, 10]
ax4.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90)
ax4.set_title('Programming Languages')

plt.tight_layout()
plt.show()

print("✅ All plots generated successfully!")
print("🎨 You should see 4 different types of plots above.")

missive({"plots_generated": 4, "types": ["line", "scatter", "bar", "pie"]})`
        };
        
        this.init();
    }
    
    async init() {
        this.setupTerminal();
        this.setupEventListeners();
        await this.initializeNagini();
        this.showWelcomeMessage();
    }
    
    setupTerminal() {
        // Create terminal instance
        this.terminal = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: '"Fira Code", "JetBrains Mono", "SF Mono", Consolas, Monaco, "Cascadia Code", "Roboto Mono", monospace',
            fontWeight: 'normal',
            fontWeightBold: 'bold',
            allowTransparency: false,
            cols: 80,
            rows: 24,
            theme: {
                background: '#0c0c0c',
                foreground: '#d4d4d4',
                cursor: '#ffffff',
                selection: '#264f78',
                black: '#000000',
                red: '#f14c4c',
                green: '#23d18b',
                yellow: '#f5f543',
                blue: '#3b8eea',
                magenta: '#d670d6',
                cyan: '#29b8db',
                white: '#e5e5e5',
                brightBlack: '#666666',
                brightRed: '#f14c4c',
                brightGreen: '#23d18b',
                brightYellow: '#f5f543',
                brightBlue: '#3b8eea',
                brightMagenta: '#d670d6',
                brightCyan: '#29b8db',
                brightWhite: '#e5e5e5'
            }
        });
        
        // Create fit addon
        this.fitAddon = new FitAddon.FitAddon();
        this.terminal.loadAddon(this.fitAddon);
        
        // Open terminal
        this.terminal.open(document.getElementById('terminal'));
        
        // Wait a moment for fonts to load, then fit
        setTimeout(() => {
            this.fitAddon.fit();
        }, 100);
        
        // Handle terminal input
        this.terminal.onData(data => this.handleTerminalInput(data));
        
        // Handle window resize
        window.addEventListener('resize', () => {
            setTimeout(() => {
                this.fitAddon.fit();
            }, 100);
        });
    }
    
    setupEventListeners() {
        // Clear button
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.terminal.clear();
            this.showPrompt();
        });
        
        // Help button
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.showHelp();
        });
        
        // Status button (shows detailed status)
        document.getElementById('statusBtn').addEventListener('click', () => {
            this.showStatus();
        });
    }
    
    async initializeNagini() {
        try {
            this.updateStatus('Initializing Nagini Python engine...', 'loading');
            
            // Create Nagini manager with common scientific packages
            this.manager = await Nagini.createManager(
                'pyodide',
                ['numpy', 'matplotlib'],  // Standard packages
                [],  // No micropip packages for this demo
                [],  // No files to load
                '../../src/pyodide/worker/worker.js'  // Worker path
            );
            
            this.updateStatus('Waiting for Nagini to be ready...', 'loading');
            await Nagini.waitForReady(this.manager, 60000);  // 60 second timeout
            
            this.isReady = true;
            this.updateStatus('Nagini Ready', 'ready');
            
            // Update button state
            const statusBtn = document.getElementById('statusBtn');
            statusBtn.textContent = 'Ready ✅';
            statusBtn.disabled = false;
            
            this.terminal.write('\r\n🎉 \x1b[32mNagini Python engine initialized successfully!\x1b[0m\r\n');
            this.terminal.write('📚 Available packages: numpy, matplotlib\r\n');
            
        } catch (error) {
            this.updateStatus(`Error: ${error.message}`, 'error');
            this.terminal.write(`\r\n❌ \x1b[31mFailed to initialize Nagini: ${error.message}\x1b[0m\r\n`);
            
            const statusBtn = document.getElementById('statusBtn');
            statusBtn.textContent = 'Error ❌';
            statusBtn.disabled = false;
        }
    }
    
    updateStatus(message, type) {
        const statusEl = document.getElementById('status');
        statusEl.textContent = message;
        statusEl.className = `status ${type}`;
    }
    
    showWelcomeMessage() {
        this.terminal.write('\x1b[36m+=====================================================================+\x1b[0m\r\n');
        this.terminal.write('\x1b[36m|\x1b[0m \x1b[1;33m🐍 Welcome to Xterm + Nagini Python Terminal!\x1b[0m                  \x1b[36m|\x1b[0m\r\n');
        this.terminal.write('\x1b[36m+---------------------------------------------------------------------+\x1b[0m\r\n');
        this.terminal.write('\x1b[36m|\x1b[0m Available commands:                                              \x1b[36m|\x1b[0m\r\n');
        this.terminal.write('\x1b[36m|\x1b[0m   \x1b[32mhelp\x1b[0m      - Show this help message                              \x1b[36m|\x1b[0m\r\n');
        this.terminal.write('\x1b[36m|\x1b[0m   \x1b[32mclear\x1b[0m     - Clear the terminal                                  \x1b[36m|\x1b[0m\r\n');
        this.terminal.write('\x1b[36m|\x1b[0m   \x1b[32mtemplates\x1b[0m - List available Python templates                     \x1b[36m|\x1b[0m\r\n');
        this.terminal.write('\x1b[36m|\x1b[0m   \x1b[32mrun <name>\x1b[0m - Execute a template by name                        \x1b[36m|\x1b[0m\r\n');
        this.terminal.write('\x1b[36m|\x1b[0m   \x1b[32mstatus\x1b[0m    - Show system status                                  \x1b[36m|\x1b[0m\r\n');
        this.terminal.write('\x1b[36m|\x1b[0m                                                                 \x1b[36m|\x1b[0m\r\n');
        this.terminal.write('\x1b[36m|\x1b[0m 💡 You can also use the template buttons below the terminal!    \x1b[36m|\x1b[0m\r\n');
        this.terminal.write('\x1b[36m+=====================================================================+\x1b[0m\r\n');
        this.terminal.write('\r\n');
        
        // Ensure proper fit after welcome message
        setTimeout(() => {
            this.fitAddon.fit();
        }, 50);
        
        this.showPrompt();
    }
    
    showPrompt() {
        this.currentPrompt = '\x1b[32m$ \x1b[0m';
        this.terminal.write(this.currentPrompt);
        this.inputMode = true;
    }
    
    handleTerminalInput(data) {
        if (!this.inputMode) return;
        
        // Handle different key combinations
        if (data === '\r') {  // Enter key
            const command = this.currentCommand || '';
            this.terminal.write('\r\n');
            this.currentCommand = '';
            this.processCommand(command.trim());
        } else if (data === '\u007F') {  // Backspace
            if (this.currentCommand && this.currentCommand.length > 0) {
                this.currentCommand = this.currentCommand.slice(0, -1);
                this.terminal.write('\b \b');
            }
        } else if (data === '\u001B[A') {  // Up arrow - command history
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
                this.replaceCurrentCommand(this.commandHistory[this.commandHistory.length - 1 - this.historyIndex]);
            }
        } else if (data === '\u001B[B') {  // Down arrow - command history
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.replaceCurrentCommand(this.commandHistory[this.commandHistory.length - 1 - this.historyIndex]);
            } else if (this.historyIndex === 0) {
                this.historyIndex = -1;
                this.replaceCurrentCommand('');
            }
        } else if (data.length === 1 && data.charCodeAt(0) >= 32) {  // Printable characters
            this.currentCommand = (this.currentCommand || '') + data;
            this.terminal.write(data);
        }
    }
    
    replaceCurrentCommand(newCommand) {
        // Clear current line
        const currentLength = (this.currentCommand || '').length;
        for (let i = 0; i < currentLength; i++) {
            this.terminal.write('\b \b');
        }
        
        // Write new command
        this.currentCommand = newCommand;
        this.terminal.write(newCommand);
    }
    
    processCommand(command) {
        if (command) {
            this.commandHistory.push(command);
            this.historyIndex = -1;
        }
        
        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        switch (cmd) {
            case 'help':
                this.showHelp();
                break;
            case 'clear':
                this.terminal.clear();
                break;
            case 'templates':
                this.listTemplates();
                break;
            case 'run':
                if (args.length > 0) {
                    this.executeTemplate(args[0]);
                } else {
                    this.terminal.write('❌ Usage: run <template_name>\r\n');
                    this.terminal.write('💡 Use "templates" to see available templates\r\n');
                }
                break;
            case 'status':
                this.showStatus();
                break;
            case '':
                // Empty command, just show prompt
                break;
            default:
                this.terminal.write(`❌ Unknown command: "${cmd}"\r\n`);
                this.terminal.write('💡 Type "help" for available commands\r\n');
        }
        
        this.showPrompt();
    }
    
    showHelp() {
        this.terminal.write('\x1b[33m📖 Help - Available Commands:\x1b[0m\r\n');
        this.terminal.write('─────────────────────────────\r\n');
        this.terminal.write('\x1b[32mhelp\x1b[0m      - Show this help message\r\n');
        this.terminal.write('\x1b[32mclear\x1b[0m     - Clear the terminal screen\r\n');
        this.terminal.write('\x1b[32mtemplates\x1b[0m - List all available Python templates\r\n');
        this.terminal.write('\x1b[32mrun <name>\x1b[0m - Execute a Python template by name\r\n');
        this.terminal.write('\x1b[32mstatus\x1b[0m    - Show Nagini system status\r\n');
        this.terminal.write('\r\n');
        this.terminal.write('\x1b[36m💡 Pro tip: Use ↑/↓ arrows for command history!\x1b[0m\r\n');
    }
    
    showStatus() {
        this.terminal.write('\x1b[33m🔍 System Status:\x1b[0m\r\n');
        this.terminal.write('─────────────────\r\n');
        this.terminal.write(`Nagini Ready: ${this.isReady ? '\x1b[32m✅ Yes\x1b[0m' : '\x1b[31m❌ No\x1b[0m'}\r\n`);
        if (this.manager) {
            this.terminal.write(`Packages: \x1b[36m${this.manager.packages.join(', ')}\x1b[0m\r\n`);
            this.terminal.write(`Execution History: \x1b[36m${this.manager.executionHistory.length} items\x1b[0m\r\n`);
        }
        this.terminal.write(`Available Templates: \x1b[36m${Object.keys(this.templates).length}\x1b[0m\r\n`);
    }
    
    listTemplates() {
        this.terminal.write('\x1b[33m📋 Available Python Templates:\x1b[0m\r\n');
        this.terminal.write('─────────────────────────────\r\n');
        
        Object.keys(this.templates).forEach(name => {
            const description = this.getTemplateDescription(name);
            this.terminal.write(`\x1b[32m${name}\x1b[0m - ${description}\r\n`);
        });
        
        this.terminal.write('\r\n');
        this.terminal.write('\x1b[36m💡 Usage: run <template_name>\x1b[0m\r\n');
        this.terminal.write('\x1b[36m💡 Example: run hello_world\x1b[0m\r\n');
    }
    
    getTemplateDescription(name) {
        const descriptions = {
            hello_world: 'Simple hello world with user input',
            data_analysis: 'Basic data analysis with numpy and matplotlib',
            calculator: 'Interactive calculator with multiple operations',
            plot_demo: 'Matplotlib plotting demonstration'
        };
        return descriptions[name] || 'Python script template';
    }
    
    async executeTemplate(templateName) {
        if (!this.isReady) {
            this.terminal.write('❌ \x1b[31mNagini is not ready yet. Please wait for initialization.\x1b[0m\r\n');
            return;
        }
        
        if (!this.templates[templateName]) {
            this.terminal.write(`❌ \x1b[31mTemplate "${templateName}" not found.\x1b[0m\r\n`);
            this.terminal.write('\x1b[36m💡 Use "templates" to see available templates\x1b[0m\r\n');
            return;
        }
        
        this.inputMode = false;
        this.terminal.write(`🚀 \x1b[33mExecuting template: ${templateName}\x1b[0m\r\n`);
        this.terminal.write('─'.repeat(50) + '\r\n');
        
        try {
            const code = this.templates[templateName];
            const startTime = Date.now();
            
            // Execute the Python code
            const result = await this.manager.executeAsync(`${templateName}.py`, code);
            const executionTime = Date.now() - startTime;
            
            // Display outputs
            if (result.stdout) {
                this.terminal.write(result.stdout.replace(/\n/g, '\r\n'));
            }
            
            if (result.stderr) {
                this.terminal.write(`\x1b[31m${result.stderr.replace(/\n/g, '\r\n')}\x1b[0m`);
            }
            
            // Show figures if any
            if (result.figures && result.figures.length > 0) {
                this.terminal.write(`\r\n📊 \x1b[36mGenerated ${result.figures.length} figure(s) - displaying above\x1b[0m\r\n`);
                this.displayFigures(result.figures);
            }
            
            // Show missive data if any
            if (result.missive) {
                this.terminal.write(`\r\n📤 \x1b[36mData output: ${JSON.stringify(result.missive)}\x1b[0m\r\n`);
            }
            
            this.terminal.write('─'.repeat(50) + '\r\n');
            this.terminal.write(`✅ \x1b[32mExecution completed in ${executionTime}ms\x1b[0m\r\n`);
            
        } catch (error) {
            this.terminal.write(`\r\n❌ \x1b[31mExecution failed: ${error.message}\x1b[0m\r\n`);
        }
        
        this.inputMode = true;
    }
    
    displayFigures(figures) {
        figures.forEach((figureBase64, index) => {
            const img = document.createElement('img');
            img.src = `data:image/png;base64,${figureBase64}`;
            img.alt = `Figure ${index + 1}`;
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
            img.style.margin = '10px 0';
            img.style.border = '1px solid #444';
            img.style.borderRadius = '4px';
            
            // Insert before the terminal container
            const terminalContainer = document.querySelector('.terminal-container');
            terminalContainer.parentNode.insertBefore(img, terminalContainer);
        });
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.app = new XtermNaginiApp();
});

// Global function for template buttons
window.executeTemplate = function(templateName) {
    if (window.app) {
        window.app.executeTemplate(templateName);
    }
}; 