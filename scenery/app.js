import { Nagini } from '../src/nagini.js';
import { PyodideFileLoader } from '../src/pyodide/file-loader/file-loader.js';
import { NaginiTests } from './tests/nagini-tests.js';
import { PyodideManagerTests } from './tests/pyodide-manager-tests.js';
import { FileLoaderTests } from './tests/file-loader-tests.js';
import { IntegrationTests } from './tests/integration-tests.js';
import { ValidationUtilsTests } from './tests/validation-utils-tests.js';
import { UtilitiesTests } from './tests/utilities-tests.js';

// Define the files to load explicitly
const filesToLoad = [
    {
      url: "https://pca-teachers.s3.eu-west-par.io.cloud.ovh.net/teachers-src/teachers/__init__.py",
      path: "teachers/__init__.py"
    },
    {
      url: "https://pca-teachers.s3.eu-west-par.io.cloud.ovh.net/teachers-src/teachers/generator.py",
      path: "teachers/generator.py"
    },
    {
      url: "https://pca-teachers.s3.eu-west-par.io.cloud.ovh.net/teachers-src/teachers/maths.py",
      path: "teachers/maths.py"
    }
];

let outputDiv = document.getElementById("output");

// Store original console methods
const originalLog = console.log;
const originalWarn = console.warn;
const originalError = console.error;

// Console capture system
let capturedLogs = [];

// Override console methods to capture logs for display
console.log = function(...args) {
    const message = args.join(' ');
    capturedLogs.push(message);
    updateOutputDisplay();
    originalLog.apply(console, args);
};

console.warn = function(...args) {
    const message = `[WARN] ${args.join(' ')}`;
    capturedLogs.push(message);
    updateOutputDisplay();
    originalWarn.apply(console, args);
};

console.error = function(...args) {
    const message = `[ERROR] ${args.join(' ')}`;
    capturedLogs.push(message);
    updateOutputDisplay();
    originalError.apply(console, args);
};

function updateOutputDisplay() {
    if (outputDiv) {
        const content = capturedLogs.join('\n');
        outputDiv.textContent = content;
        // Update summary line count
        if (window.updateSummaryLineCount) {
            window.updateSummaryLineCount('logs-summary', content, 'Display JS logs');
        }
    }
}



// Global manager instance
let manager = null;

async function runDemo() {
    try {
        // Clear previous logs
        capturedLogs = [];
        if (outputDiv) {
            outputDiv.textContent = "";
            // Reset logs summary
            if (window.updateSummaryLineCount) {
                window.updateSummaryLineCount('logs-summary', '', 'Display JS logs');
            }
        }

        console.log("Starting Nagini Test Suite\n");

        // Test parameters - using absolute paths for worker compatibility
        const packages = ["sympy", "pydantic", "strictyaml", "matplotlib", "numpy"];
        const pyodideInitPath = "/src/pyodide/python/pyodide_init.py";
        const workerPath = "/src/pyodide/worker/worker.js";

        // Nagini Tests
        console.log("Nagini Tests");
        console.log("=" .repeat(50));

        console.log("1️⃣ Nagini.createManager()");
        const managerResult = await NaginiTests.test1CreateManager(
            'pyodide', packages, filesToLoad, pyodideInitPath, workerPath
        );
        manager = managerResult.manager;
        window.updateTestStatus('status-nagini-1', 'pass');

        console.log("2️⃣ Nagini.waitForReady()");
        await NaginiTests.test2WaitForReady(manager);
        window.updateTestStatus('status-nagini-2', 'pass');

        console.log("3️⃣ Nagini.executeFromUrl()");
        await NaginiTests.test3ExecuteFromUrl(manager, "./tests/sympy_test.py");
        window.updateTestStatus('status-nagini-3', 'pass');

        console.log("4️⃣ Nagini.getSupportedBackends()");
        await NaginiTests.test4GetSupportedBackends();
        window.updateTestStatus('status-nagini-4', 'pass');

        console.log("5️⃣ Nagini.isBackendSupported()");
        await NaginiTests.test5IsBackendSupported();
        window.updateTestStatus('status-nagini-5', 'pass');

        // PyodideManager Tests
        console.log("\nPyodideManager Tests");
        console.log("=" .repeat(50));

        console.log("1️⃣ executeAsync()");
        await PyodideManagerTests.test4ExecuteAsync(manager);
        window.updateTestStatus('status-pyodide-manager-1', 'pass');

        console.log("2️⃣ executeAsync with namespace");
        await PyodideManagerTests.test5ExecuteAsyncWithNamespace(manager);
        window.updateTestStatus('status-pyodide-manager-2', 'pass');

        console.log("3️⃣ namespace isolation");
        await PyodideManagerTests.test6NamespaceIsolation(manager);
        window.updateTestStatus('status-pyodide-manager-3', 'pass');

        console.log("4️⃣ executionHistory");
        await PyodideManagerTests.test7ExecutionHistory(manager);
        window.updateTestStatus('status-pyodide-manager-4', 'pass');

        console.log("5️⃣ worker");
        await PyodideManagerTests.test8Worker(manager);
        window.updateTestStatus('status-pyodide-manager-5', 'pass');

        console.log("6️⃣ isReady");
        await PyodideManagerTests.test9IsReady(manager);
        window.updateTestStatus('status-pyodide-manager-6', 'pass');

        console.log("7️⃣ packages");
        await PyodideManagerTests.test10Packages(manager);
        window.updateTestStatus('status-pyodide-manager-7', 'pass');

        console.log("8️⃣ filesToLoad");
        await PyodideManagerTests.test11FilesToLoad(manager);
        window.updateTestStatus('status-pyodide-manager-8', 'pass');

        console.log("9️⃣ pyodideInitPath");
        await PyodideManagerTests.test12PyodideInitPath(manager);
        window.updateTestStatus('status-pyodide-manager-9', 'pass');

        console.log("🔟 workerPath");
        await PyodideManagerTests.test13WorkerPath(manager);
        window.updateTestStatus('status-pyodide-manager-10', 'pass');

        console.log("1️⃣1️⃣ input handling");
        await PyodideManagerTests.test15InputHandling(manager);
        window.updateTestStatus('status-pyodide-manager-11', 'pass');

        console.log("1️⃣2️⃣ matplotlib figure capture");
        await PyodideManagerTests.test16MatplotlibFigureCapture(manager);
        window.updateTestStatus('status-pyodide-manager-12', 'pass');

        console.log("1️⃣3️⃣ filesystem operations");
        await PyodideManagerTests.test17FilesystemOperations(manager);
        window.updateTestStatus('status-pyodide-manager-13', 'pass');

        // PyodideFileLoader Tests
        console.log("\nPyodideFileLoader Tests");
        console.log("=" .repeat(50));

        console.log("1️⃣ PyodideFileLoader.loadFiles()");
        await FileLoaderTests.test14LoadFilesAndImport(manager, filesToLoad);
        window.updateTestStatus('status-file-loader-1', 'pass');

        console.log("2️⃣ PyodideFileLoader retry logic");
        await FileLoaderTests.test2FileLoaderRetryLogic(manager);
        window.updateTestStatus('status-file-loader-2', 'pass');

        console.log("3️⃣ PyodideFileLoader error handling");
        await FileLoaderTests.test3FileLoaderErrorHandling(manager);
        window.updateTestStatus('status-file-loader-3', 'pass');

        // Integration Tests
        console.log("\nIntegration Tests");
        console.log("=" .repeat(50));

        console.log("1️⃣ complex input data scenarios");
        await IntegrationTests.testComplexInputData(manager);
        window.updateTestStatus('status-integration-1', 'pass');

        console.log("2️⃣ data visualization workflow");
        await IntegrationTests.testDataVisualizationWorkflow(manager);
        window.updateTestStatus('status-integration-2', 'pass');

        console.log("3️⃣ filesystem and import workflow");
        await IntegrationTests.testFileSystemAndImportWorkflow(manager);
        window.updateTestStatus('status-integration-3', 'pass');

        console.log("4️⃣ mixed execution scenarios");
        await IntegrationTests.testMixedExecutionScenarios(manager);
        window.updateTestStatus('status-integration-4', 'pass');

        console.log("5️⃣ advanced matplotlib workflow");
        await IntegrationTests.testAdvancedMatplotlibWorkflow(manager);
        window.updateTestStatus('status-integration-5', 'pass');

        // ValidationUtils Tests
        console.log("\nValidationUtils Tests");
        console.log("=" .repeat(50));

        console.log("1️⃣ validateArray");
        await ValidationUtilsTests.test1ValidateArray();
        window.updateTestStatus('status-validation-1', 'pass');

        console.log("2️⃣ validateString");
        await ValidationUtilsTests.test2ValidateString();
        window.updateTestStatus('status-validation-2', 'pass');

        console.log("3️⃣ validateBackend");
        await ValidationUtilsTests.test3ValidateBackend();
        window.updateTestStatus('status-validation-3', 'pass');

        console.log("4️⃣ checkDangerousPatterns");
        await ValidationUtilsTests.test4CheckDangerousPatterns();
        window.updateTestStatus('status-validation-4', 'pass');

        // TestUtils Tests
        console.log("\nTestUtils Tests");
        console.log("=" .repeat(50));

        console.log("1️⃣ test-utils assert function");
        await UtilitiesTests.test1TestUtilsAssertFunction();
        window.updateTestStatus('status-utilities-1', 'pass');

        console.log("2️⃣ test-utils assertEquals function");
        await UtilitiesTests.test2TestUtilsEqualsFunction();
        window.updateTestStatus('status-utilities-2', 'pass');

        console.log("3️⃣ string manipulation utilities");
        await UtilitiesTests.test3StringManipulationUtilities();
        window.updateTestStatus('status-utilities-3', 'pass');

        console.log("\nALL TESTS PASSED!");
        console.log("=" .repeat(50));

    } catch (error) {
        console.log(`\nTESTS FAILED: ${error.message}`);
        console.log("=" .repeat(50));
        throw error;
    }
}

// Auto-run tests when page loads
document.addEventListener("DOMContentLoaded", () => {
    // Initialize summary line counts
    if (window.updateSummaryLineCount) {
        window.updateSummaryLineCount('logs-summary', '', 'Display JS logs');
    }
    runDemo();
});

// ============================================
// INTERACTIVE TESTS (PRESERVED AS REQUESTED)
// ============================================

// Initialize interactive manager
async function initInteractiveManager() {
    if (!manager) {
        throw new Error('Manager not initialized. Please run the tests first by refreshing the page.');
    }
    if (!manager.isReady) {
        throw new Error('Manager not ready. Please wait for tests to complete.');
    }
    return manager;
}

// Execute input code from the input text area with interactive input handling
async function executeInputCode() {
    const codeEditor = document.getElementById('input-code-editor');
    const output = document.getElementById('input-code-output');

    if (!codeEditor || !output) {
        console.error('Input code editor or output element not found');
        return;
    }

    const code = codeEditor.value;
    if (!code.trim()) {
        output.textContent = 'No code to execute';
        return;
    }

    try {
        // Initialize manager if needed
        const mgr = await initInteractiveManager();

        // Clear previous output and images
        output.textContent = 'Executing input code...\n';
        clearPreviousImages(output);

        // Set up input callback for interactive input
        mgr.setInputCallback(async (prompt) => {
            // Show the prompt in the output area
            output.textContent += '\n' + (prompt || 'Enter input:') + '\n';

            // Create input field and button
            const inputContainer = document.createElement('div');
            inputContainer.style.margin = '10px 0';

            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.placeholder = 'Type your input here...';
            inputField.style.padding = '5px';
            inputField.style.marginRight = '10px';
            inputField.style.width = '200px';

            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.style.padding = '5px 10px';

            inputContainer.appendChild(inputField);
            inputContainer.appendChild(submitButton);

            // Insert the input UI after the output
            output.parentNode.insertBefore(inputContainer, output.nextSibling);

            // Focus the input field
            inputField.focus();

            // Handle input submission
            const handleSubmit = () => {
                const userInput = inputField.value;

                // Display the input in the output
                output.textContent += '> ' + userInput + '\n';

                // Remove the input UI
                inputContainer.remove();

                // Provide the input back to Python
                mgr.provideInput(userInput);
            };

            // Submit on button click or Enter key
            submitButton.onclick = handleSubmit;
            inputField.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    handleSubmit();
                }
            };
        });

        // Execute the code
        const result = await mgr.executeAsync('interactive_input_code', code);

        // Display results
        if (result.stdout) {
            output.textContent += result.stdout;
        }
        if (result.stderr) {
            output.textContent += '\nERROR:\n' + result.stderr;
        }
        if (result.error) {
            output.textContent += '\nEXECUTION ERROR:\n' + result.error.message;
        }

        output.textContent += '\nInteractive code execution completed!';

    } catch (error) {
        console.error('Interactive input execution failed:', error);
        output.textContent = 'ERROR: ' + error.message;
    }
}

// Execute matplotlib code from the matplotlib text area with figure display
async function executeMatplotlibCode() {
    const codeEditor = document.getElementById('matplotlib-code-editor');
    const output = document.getElementById('matplotlib-code-output');

    if (!codeEditor || !output) {
        console.error('Matplotlib code editor or output element not found');
        return;
    }

    const code = codeEditor.value;
    if (!code.trim()) {
        output.textContent = 'No code to execute';
        return;
    }

    try {
        // Initialize manager if needed
        const mgr = await initInteractiveManager();

        // Clear previous output and images
        output.textContent = 'Executing matplotlib code...\n';
        clearPreviousImages(output);

        // Execute the code
        const result = await mgr.executeAsync('interactive_matplotlib_code', code);

        // Display results
        if (result.stdout) {
            output.textContent += result.stdout;
        }
        if (result.stderr) {
            output.textContent += '\nERROR:\n' + result.stderr;
        }
        if (result.error) {
            output.textContent += '\nEXECUTION ERROR:\n' + result.error.message;
        }

        // Handle matplotlib figures
        if (result.figures && result.figures.length > 0) {
            output.textContent += '\nFigures captured: ' + result.figures.length + '\n';

            // Display each figure
            result.figures.forEach((figureBase64, index) => {
                // Create an image element
                const img = document.createElement('img');
                img.src = 'data:image/png;base64,' + figureBase64;
                img.style.maxWidth = '100%';
                img.style.border = '1px solid #ccc';
                img.style.margin = '10px 0';
                img.style.borderRadius = '5px';
                img.alt = `Figure ${index + 1}`;
                img.className = 'matplotlib-figure';

                // Add the image after the output
                output.parentNode.insertBefore(img, output.nextSibling);
            });

            output.textContent += 'Matplotlib figures displayed above!\n';
        } else {
            output.textContent += '\nNo figures were generated.\n';
        }

        output.textContent += '\nMatplotlib code execution completed!';

    } catch (error) {
        console.error('Interactive matplotlib execution failed:', error);
        output.textContent = 'ERROR: ' + error.message;
    }
}

// Helper function to clear previous images
function clearPreviousImages(outputElement) {
    // Remove any existing matplotlib figures
    const existingImages = outputElement.parentNode.querySelectorAll('.matplotlib-figure');
    existingImages.forEach(img => img.remove());

    // Also remove any other images that might be next siblings
    let nextSibling = outputElement.nextSibling;
    while (nextSibling) {
        const toRemove = nextSibling;
        nextSibling = nextSibling.nextSibling;
        if (toRemove.tagName === 'IMG') {
            toRemove.remove();
        }
    }
}

// Make functions globally available for the interactive buttons
window.executeInputCode = executeInputCode;
window.executeMatplotlibCode = executeMatplotlibCode;
