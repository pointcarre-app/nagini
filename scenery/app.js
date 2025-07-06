import { Nagini } from '../src/nagini.js';
import { PyodideFileLoader } from '../src/pyodide/file-loader/file-loader.js';
import { NaginiTests } from './tests/nagini-tests.js';
import { PyodideManagerTests } from './tests/pyodide-manager-tests.js';
import { FileLoaderTests } from './tests/file-loader-tests.js';
import { PyodideIntegrationTests } from './tests/pyodide-integration-tests.js';
import { ValidationUtilsTests } from './tests/validation-utils-tests.js';
import { UtilitiesTests } from './tests/utilities-tests.js';
import './interactive-functions.js';

// Define the files to load explicitly
const filesToLoad = [
    {
      url: "https://pca-teachers.s3.eu-west-par.io.cloud.ovh.net/teachers-src/teachers/__init__.py",
      path: "teachers/__init__.py"
    },
    {
      url: "https://pca-teachers.s3.eu-west-par.io.cloud.ovh.net/" +
           "teachers-src/teachers/generator.py",
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
        // Make manager globally accessible for interactive functions
        window.manager = manager;
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

        // PyodideIntegration Tests
        console.log("\nPyodideIntegration Tests");
        console.log("=" .repeat(50));

        console.log("1️⃣ complex input data scenarios");
        await PyodideIntegrationTests.testComplexInputData(manager);
        window.updateTestStatus('status-integration-1', 'pass');

        console.log("2️⃣ data visualization workflow");
        await PyodideIntegrationTests.testDataVisualizationWorkflow(manager);
        window.updateTestStatus('status-integration-2', 'pass');

        console.log("3️⃣ filesystem and import workflow");
        await PyodideIntegrationTests.testFileSystemAndImportWorkflow(manager);
        window.updateTestStatus('status-integration-3', 'pass');

        console.log("4️⃣ mixed execution scenarios");
        await PyodideIntegrationTests.testMixedExecutionScenarios(manager);
        window.updateTestStatus('status-integration-4', 'pass');

        console.log("5️⃣ advanced matplotlib workflow");
        await PyodideIntegrationTests.testAdvancedMatplotlibWorkflow(manager);
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
// Interactive functions are now imported from ./interactive-functions.js
