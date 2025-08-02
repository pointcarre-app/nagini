import { Nagini } from '../src/nagini.js';
import { PyodideFileLoader } from '../src/pyodide/file-loader/file-loader.js';
import { NaginiTests } from './tests/nagini-tests.js';
import { PyodideManagerTests } from './tests/pyodide-manager-tests.js';
import { FileLoaderTests } from './tests/file-loader-tests.js';
import { PyodideIntegrationTests } from './tests/pyodide-integration-tests.js';
import { ValidationUtilsTests } from './tests/validation-utils-tests.js';
import { UtilitiesTests } from './tests/utilities-tests.js';
import { BrythonManagerTests } from './tests/brython-manager-tests.js';
import './interactive-functions.js';

// Define the files to load explicitly
// Local files to avoid CORS issues while checking via static access the "for" scenery tests
const filesToLoad = [
    {
      url: "http://127.0.0.1:8010/scenery/tests/teachers__init__mock.py",
      path: "teachers/__init__.py"
    },
    {
      url: "http://127.0.0.1:8010/scenery/tests/teachers_generator_mock.py",
      path: "teachers/generator.py"
    },
    {
      url: "http://127.0.0.1:8010/scenery/tests/teachers_maths_mock.py",
      path: "teachers/maths.py"
    }
];

let outputDiv = document.getElementById("output");
let testResults = [];

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

function recordTestResult(className, testName, status, error = null, criticValue = null) {
    testResults.push({
        className,
        testName,
        status,
        error: error ? error.toString() : null,
        main_critic: criticValue,
        timestamp: new Date().toISOString()
    });
}

function finalizeTests() {
    const resultsContainer = document.getElementById('test-results-json');
    if (resultsContainer) {
        resultsContainer.textContent = JSON.stringify(testResults, null, 2);
    }
    console.log("All tests completed. Results captured.");
}

async function runTest(testFunction, ...args) {
    const testName = args[0] || testFunction.name;
    const className = args[1] || "Unknown";
    try {
        await testFunction(...args.slice(2));
        recordTestResult(className, testName, 'pass');
    } catch (error) {
        recordTestResult(className, testName, 'fail', error);
        throw error;
    }
}

async function runTestWithTimeout(testFunction, testId, timeout = 30000) {
    return new Promise(async (resolve, reject) => {
        const timer = setTimeout(() => {
            const error = new Error(`Test timed out after ${timeout / 1000}s`);
            window.updateTestStatus(testId, 'fail', error);
            reject(error);
        }, timeout);

        try {
            await testFunction();
            clearTimeout(timer);
            resolve();
        } catch (error) {
            clearTimeout(timer);
            window.updateTestStatus(testId, 'fail', error);
            reject(error);
        }
    });
}

// Global manager instance
let manager = null;

// Global function to update test status
window.updateTestStatus = function(testId, status, error = null) {
    const element = document.getElementById(testId);
    if (element) {
        const tr = element.closest('tr');
        let criticValue;
        let finalStatus = status;

        if (status === 'pass') {
            criticValue = 'wrapp';
        } else if (status === 'fail') {
            if (error && error.toString().includes('ASSERTION FAILED')) {
                criticValue = 'flop';
            } else {
                criticValue = 'glitch';
                finalStatus = 'glitch'; // Use 'glitch' for the CSS class and emoji
            }
        }
        
        if (tr && criticValue) {
            tr.setAttribute('data-main_critic', criticValue);
        }

        const testName = element.closest('tr').querySelector('td:nth-child(3)').innerText.split('\n')[0];
        const className = element.closest('tr').querySelector('td:nth-child(2)').innerText;
        recordTestResult(className, testName, status, error, criticValue);
        
        element.className = `test-status-${finalStatus}`;
        element.textContent = finalStatus === 'pass' ? '✔️' : finalStatus === 'fail' ? '❌' : finalStatus === 'glitch' ? '🐛' : '⏳';
    }
};

async function runAllTests() {
    console.log("Starting Nagini Test Suite\n");

    const packages = ["sympy", "pydantic", "strictyaml", "matplotlib", "numpy"];
    const micropipPackages = ["antlr4-python3-runtime"];
    const pyodideWorkerPath = "../src/pyodide/worker/worker-dist.js"; // Use relative path
    const brythonOptions = {
        brythonJsPath: "../src/brython/lib/brython.js", // Use relative path
        brythonStdlibPath: "../src/brython/lib/brython_stdlib.js" // Use relative path
    };

    const tests = [
        // Nagini Tests (Pyodide)
        { id: 'status-nagini-1', desc: "1️⃣ Nagini.createManager() - Pyodide", func: async () => {
            const result = await NaginiTests.test1CreateManager('pyodide', packages, micropipPackages, filesToLoad, pyodideWorkerPath);
            manager = result.manager;
            window.manager = manager;
            window.updateTestStatus('status-nagini-1', 'pass');
        }},
        { id: 'status-nagini-2', desc: "2️⃣ Nagini.waitForReady() - Pyodide", func: () => NaginiTests.test2WaitForReady(manager).then(() => window.updateTestStatus('status-nagini-2', 'pass')) },
        { id: 'status-nagini-3', desc: "3️⃣ Nagini.executeFromUrl() - Pyodide", func: () => NaginiTests.test3ExecuteFromUrl(manager, "./tests/sympy_test.py").then(() => window.updateTestStatus('status-nagini-3', 'pass')) },
        { id: 'status-nagini-4', desc: "4️⃣ Nagini.getSupportedBackends()", func: () => NaginiTests.test4GetSupportedBackends().then(() => window.updateTestStatus('status-nagini-4', 'pass')) },
        { id: 'status-nagini-5', desc: "5️⃣ Nagini.isBackendSupported()", func: () => NaginiTests.test5IsBackendSupported().then(() => window.updateTestStatus('status-nagini-5', 'pass')) },
        
        // PyodideManager Tests
        { id: 'status-pyodide-manager-1', desc: "1️⃣ executeAsync()", func: () => PyodideManagerTests.test4ExecuteAsync(manager).then(() => window.updateTestStatus('status-pyodide-manager-1', 'pass')) },
        { id: 'status-pyodide-manager-2', desc: "2️⃣ executeAsync with namespace", func: () => PyodideManagerTests.test5ExecuteAsyncWithNamespace(manager).then(() => window.updateTestStatus('status-pyodide-manager-2', 'pass')) },
        { id: 'status-pyodide-manager-3', desc: "3️⃣ namespace isolation", func: () => PyodideManagerTests.test6NamespaceIsolation(manager).then(() => window.updateTestStatus('status-pyodide-manager-3', 'pass')) },
        { id: 'status-pyodide-manager-4', desc: "4️⃣ executionHistory", func: () => PyodideManagerTests.test7ExecutionHistory(manager).then(() => window.updateTestStatus('status-pyodide-manager-4', 'pass')) },
        { id: 'status-pyodide-manager-5', desc: "5️⃣ worker", func: () => PyodideManagerTests.test8Worker(manager).then(() => window.updateTestStatus('status-pyodide-manager-5', 'pass')) },
        { id: 'status-pyodide-manager-6', desc: "6️⃣ isReady", func: () => PyodideManagerTests.test9IsReady(manager).then(() => window.updateTestStatus('status-pyodide-manager-6', 'pass')) },
        { id: 'status-pyodide-manager-7', desc: "7️⃣ packages", func: () => PyodideManagerTests.test10Packages(manager).then(() => window.updateTestStatus('status-pyodide-manager-7', 'pass')) },
        { id: 'status-pyodide-manager-8', desc: "8️⃣ filesToLoad", func: () => PyodideManagerTests.test11FilesToLoad(manager).then(() => window.updateTestStatus('status-pyodide-manager-8', 'pass')) },
        { id: 'status-pyodide-manager-9', desc: "9️⃣ pyodideInitPath", func: () => PyodideManagerTests.test12PyodideInitPath(manager).then(() => window.updateTestStatus('status-pyodide-manager-9', 'pass')) },
        { id: 'status-pyodide-manager-10', desc: "🔟 workerPath", func: () => PyodideManagerTests.test13WorkerPath(manager).then(() => window.updateTestStatus('status-pyodide-manager-10', 'pass')) },
        { id: 'status-pyodide-manager-11', desc: "1️⃣1️⃣ input handling", func: () => PyodideManagerTests.test15InputHandling(manager).then(() => window.updateTestStatus('status-pyodide-manager-11', 'pass')) },
        { id: 'status-pyodide-manager-12', desc: "1️⃣2️⃣ matplotlib figure capture", func: () => PyodideManagerTests.test16MatplotlibFigureCapture(manager).then(() => window.updateTestStatus('status-pyodide-manager-12', 'pass')) },
        { id: 'status-pyodide-manager-13', desc: "1️⃣3️⃣ filesystem operations", func: () => PyodideManagerTests.test17FilesystemOperations(manager).then(() => window.updateTestStatus('status-pyodide-manager-13', 'pass')) },

        // FileLoader Tests
        { id: 'status-file-loader-1', desc: "1️⃣ PyodideFileLoader.loadFiles()", func: () => FileLoaderTests.test14LoadFilesAndImport(manager, filesToLoad).then(() => window.updateTestStatus('status-file-loader-1', 'pass')) },
        { id: 'status-file-loader-2', desc: "2️⃣ PyodideFileLoader retry logic", func: () => FileLoaderTests.test2FileLoaderRetryLogic(manager).then(() => window.updateTestStatus('status-file-loader-2', 'pass')) },
        { id: 'status-file-loader-3', desc: "3️⃣ PyodideFileLoader error handling", func: () => FileLoaderTests.test3FileLoaderErrorHandling(manager).then(() => window.updateTestStatus('status-file-loader-3', 'pass')) },

        // Integration Tests
        { id: 'status-integration-1', desc: "1️⃣ complex input data scenarios", func: () => PyodideIntegrationTests.testComplexInputData(manager).then(() => window.updateTestStatus('status-integration-1', 'pass')) },
        { id: 'status-integration-2', desc: "2️⃣ data visualization workflow", func: () => PyodideIntegrationTests.testDataVisualizationWorkflow(manager).then(() => window.updateTestStatus('status-integration-2', 'pass')) },
        { id: 'status-integration-3', desc: "3️⃣ filesystem and import workflow", func: () => PyodideIntegrationTests.testFileSystemAndImportWorkflow(manager).then(() => window.updateTestStatus('status-integration-3', 'pass')) },
        { id: 'status-integration-4', desc: "4️⃣ mixed execution scenarios", func: () => PyodideIntegrationTests.testMixedExecutionScenarios(manager).then(() => window.updateTestStatus('status-integration-4', 'pass')) },
        { id: 'status-integration-5', desc: "5️⃣ advanced matplotlib workflow", func: () => PyodideIntegrationTests.testAdvancedMatplotlibWorkflow(manager).then(() => window.updateTestStatus('status-integration-5', 'pass')) },
        { id: 'status-integration-6', desc: "6️⃣ micropip package installation", func: () => PyodideIntegrationTests.testMicropipPackageInstallation(manager).then(() => window.updateTestStatus('status-integration-6', 'pass')) },
        { id: 'status-integration-7', desc: "7️⃣ antlr4 and sympy interaction", func: () => PyodideIntegrationTests.testAntlr4AndSympyInteraction(manager).then(() => window.updateTestStatus('status-integration-7', 'pass')) },
        
        // Validation and Utilities Tests
        { id: 'status-validation-1', desc: "1️⃣ validateArray", func: () => ValidationUtilsTests.test1ValidateArray().then(() => window.updateTestStatus('status-validation-1', 'pass')) },
        { id: 'status-validation-2', desc: "2️⃣ validateString", func: () => ValidationUtilsTests.test2ValidateString().then(() => window.updateTestStatus('status-validation-2', 'pass')) },
        { id: 'status-validation-3', desc: "3️⃣ validateBackend", func: () => ValidationUtilsTests.test3ValidateBackend().then(() => window.updateTestStatus('status-validation-3', 'pass')) },
        { id: 'status-validation-4', desc: "4️⃣ checkDangerousPatterns", func: () => ValidationUtilsTests.test4CheckDangerousPatterns().then(() => window.updateTestStatus('status-validation-4', 'pass')) },
        { id: 'status-utilities-1', desc: "1️⃣ test-utils assert function", func: () => UtilitiesTests.test1TestUtilsAssertFunction().then(() => window.updateTestStatus('status-utilities-1', 'pass')) },
        { id: 'status-utilities-2', desc: "2️⃣ test-utils assertEquals function", func: () => UtilitiesTests.test2TestUtilsEqualsFunction().then(() => window.updateTestStatus('status-utilities-2', 'pass')) },
        { id: 'status-utilities-3', desc: "3️⃣ string manipulation utilities", func: () => UtilitiesTests.test3StringManipulationUtilities().then(() => window.updateTestStatus('status-utilities-3', 'pass')) },
    ];

    for (const test of tests) {
        try {
            console.log(test.desc);
            await runTestWithTimeout(test.func, test.id);
        } catch (error) {
            console.error(`Test failed: ${test.desc}`, error);
            // Continue to the next test
        }
    }

    // Brython tests - currently breaking, run separately
    try {
        console.log("\nBrython Backend Tests");
        console.log("=" .repeat(50));
        const brythonManagerResult = await NaginiTests.test1CreateManager('brython', [], [], [], '', brythonOptions);
        const brythonManager = brythonManagerResult.manager;
        await NaginiTests.test2WaitForReady(brythonManager);
        await BrythonManagerTests.test1SimpleExecution(brythonManager);
        window.updateTestStatus('status-brython-manager-1', 'pass');
    } catch (error) {
        console.error("Brython tests failed:", error);
        window.updateTestStatus('status-brython-manager-1', 'fail', error);
    }
}

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

        await runAllTests();

    } catch (error) {
        console.error("An error occurred during test execution:", error);
        console.log("\n==================================================");
        console.log("❌ SOME TESTS FAILED. Please review the results above.");
        console.log("==================================================");
    } finally {
        finalizeTests();
    }
}

// Auto-run tests when page loads
document.addEventListener("DOMContentLoaded", () => {
    // Initialize summary line counts
    if (window.updateSummaryLineCount) {
        window.updateSummaryLineCount('logs-summary', '', 'Display JS logs');
    }
    runDemo();

    // Attach event listeners for interactive tests
    const executeInputBtn = document.getElementById('execute-input-code');
    if (executeInputBtn) {
        executeInputBtn.addEventListener('click', window.executeInputCode);
    }

    const executeMatplotlibBtn = document.getElementById('execute-matplotlib-code');
    if (executeMatplotlibBtn) {
        executeMatplotlibBtn.addEventListener('click', window.executeMatplotlibCode);
    }

    const executeTurtleBtn = document.getElementById('execute-turtle-code');
    if (executeTurtleBtn) {
        executeTurtleBtn.addEventListener('click', window.executeTurtleCode);
    }
});
