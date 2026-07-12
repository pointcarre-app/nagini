import { 
    assert, 
    assertEquals, 
    assertContains, 
    assertInstanceOf, 
    logTestStart, 
    logTestPass, 
    logTestFail 
} from './test-utils.js';
export class PyodideManagerTests {
    static async test4ExecuteAsync(manager) {
        const testName = "executeAsync()";
        logTestStart("PyodideManager", testName);
        try {
            const result = await manager.executeAsync(
                "test_execute_async.py",
                `import sympy as sp\nprint(f"Hello from Python! SymPy version: {sp.__version__}")`
            );
            assert(result, "Result should be returned");
            assert(result.hasOwnProperty('stdout'), "Result should have stdout property");
            assert(result.hasOwnProperty('stderr'), "Result should have stderr property");
            assertContains(result.stdout, "Hello from Python!", "Output should contain expected message");
            assertContains(result.stdout, "SymPy version:", "Output should contain SymPy version");
            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    static async test5ExecuteAsyncWithNamespace(manager) {
        const testName = "executeAsync with namespace";
        logTestStart("PyodideManager", testName);
        try {
            const namespace = { custom_var: 42, custom_name: "test_namespace" };
            const result = await manager.executeAsync(
                "test_execute_with_namespace.py",
                `print(f"custom_var from namespace: {custom_var}")
print(f"custom_name from namespace: {custom_name}")
namespace_result = custom_var * 2
missive({"namespace_custom_var": custom_var, "namespace_custom_name": custom_name, "namespace_result": namespace_result})`,
                namespace
            );
            assert(result.missive, "Result should have missive property");
            
            // Parse missive JSON string to object
            const missiveData = JSON.parse(result.missive);
            
            assertEquals(missiveData.namespace_custom_var, 42, "Namespace custom_var should be accessible");
            assertEquals(missiveData.namespace_custom_name, "test_namespace", "Namespace custom_name should be accessible");
            assertEquals(missiveData.namespace_result, 84, "Namespace computation should work");
            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    static async test6NamespaceIsolation(manager) {
        const testName = "namespace isolation";
        logTestStart("PyodideManager", testName);
        try {
            // Execute in namespace A
            const namespaceA = { isolation_var: "A", shared_name: "namespace_A" };
            const resultA = await manager.executeAsync(
                "test_namespace_isolation_a.py",
                `isolation_var = isolation_var + "_modified"
namespace_specific = "only_in_A"
missive({"isolation_var": isolation_var, "shared_name": shared_name, "namespace_specific": namespace_specific})`,
                namespaceA
            );
            // Execute in namespace B
            const namespaceB = { isolation_var: "B", shared_name: "namespace_B" };
            const resultB = await manager.executeAsync(
                "test_namespace_isolation_b.py",
                `isolation_var = isolation_var + "_modified"
namespace_specific = "only_in_B"
missive({"isolation_var": isolation_var, "shared_name": shared_name, "namespace_specific": namespace_specific})`,
                namespaceB
            );
            
            // Parse missive JSON strings to objects
            const missiveA = JSON.parse(resultA.missive);
            const missiveB = JSON.parse(resultB.missive);
            
            // Verify independence
            assertEquals(missiveA.isolation_var, "A_modified", "Namespace A isolation_var should be correct");
            assertEquals(missiveB.isolation_var, "B_modified", "Namespace B isolation_var should be correct");
            assertEquals(missiveA.shared_name, "namespace_A", "Namespace A shared_name should be correct");
            assertEquals(missiveB.shared_name, "namespace_B", "Namespace B shared_name should be correct");
            assertEquals(missiveA.namespace_specific, "only_in_A", "Namespace A specific var should be correct");
            assertEquals(missiveB.namespace_specific, "only_in_B", "Namespace B specific var should be correct");
            logTestPass(testName);
            return { resultA, resultB, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    static async test7ExecutionHistory(manager) {
        const testName = "executionHistory";
        logTestStart("PyodideManager", testName);
        try {
            const history = manager.executionHistory;
            const lastEntry = history[history.length - 1];
            assert(Array.isArray(history), "ExecutionHistory should be an array");
            assert(history.length > 0, "ExecutionHistory should not be empty");
            assert(lastEntry.hasOwnProperty('filename'), "Last entry should have filename");
            assert(lastEntry.hasOwnProperty('time'), "Last entry should have time");
            assert(lastEntry.hasOwnProperty('stdout'), "Last entry should have stdout");
            assert(lastEntry.hasOwnProperty('stderr'), "Last entry should have stderr");
            assert(lastEntry.hasOwnProperty('timestamp'), "Last entry should have timestamp");
            logTestPass(testName);
            return { history, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    static async test8Worker(manager) {
        const testName = "worker";
        logTestStart("PyodideManager", testName);
        try {
            assertInstanceOf(manager.worker, Worker, "Worker should be a Worker instance");
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    static async test9IsReady(manager) {
        const testName = "isReady";
        logTestStart("PyodideManager", testName);
        try {
            assert(typeof manager.isReady === 'boolean', "isReady should be a boolean");
            assert(manager.isReady, "Manager should be ready at this point");
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    static async test10Packages(manager) {
        const testName = "packages";
        logTestStart("PyodideManager", testName);
        try {
            assert(Array.isArray(manager.packages), "Packages should be an array");
            assert(manager.packages.length > 0, "Packages should not be empty");
            assertContains(manager.packages, "sympy", "Should contain sympy package");
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    static async test11FilesToLoad(manager) {
        const testName = "filesToLoad";
        logTestStart("PyodideManager", testName);
        try {
            assert(Array.isArray(manager.filesToLoad), "FilesToLoad should be an array");
            assert(manager.filesToLoad.length > 0, "FilesToLoad should not be empty");
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    static async test12PyodideInitPath(manager) {
        const testName = "executionHistory (updated from pyodideInitPath)";
        logTestStart("PyodideManager", testName);
        try {
            assert(Array.isArray(manager.executionHistory), "ExecutionHistory should be an array");
            assert(manager.executionHistory.length > 0, "ExecutionHistory should have entries after running tests");
            // Check that the latest entry has the expected structure
            const latestEntry = manager.executionHistory[manager.executionHistory.length - 1];
            assert(latestEntry.hasOwnProperty('filename'), "Latest entry should have filename");
            assert(latestEntry.hasOwnProperty('timestamp'), "Latest entry should have timestamp");
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    static async test13WorkerPath(manager) {
        const testName = "workerPath";
        logTestStart("PyodideManager", testName);
        try {
            assert(typeof manager.workerPath === 'string', "WorkerPath should be a string");
            assertContains(manager.workerPath, ".js", "WorkerPath should contain .js extension");
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    static async test15InputHandling(manager) {
        const testName = "input handling";
        logTestStart("PyodideManager", testName);
        try {
            // Real input() roundtrip through the queue
            manager.queueInput("Nagini");
            const result = await manager.executeAsync(
                "test_input_handling.py",
                `name = input("Who? ")
print(f"hello {name}")
missive({"input_system": "ready", "name": name})`
            );
            assert(!result.error, "Input handling should not have errors");
            assertContains(result.stdout, "hello Nagini", "input() should receive the queued value");
            assert(!result.stdout.includes("[DEBUG]"), "stdout must not contain [DEBUG] lines");

            // Parse missive JSON string to object
            const missiveData = JSON.parse(result.missive);
            assert(missiveData.input_system === "ready", "Should have missive confirmation");
            assert(missiveData.name === "Nagini", "Missive should carry the input value");

            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    static async test16MatplotlibFigureCapture(manager) {
        const testName = "matplotlib figure capture";
        logTestStart("PyodideManager", testName);
        try {
            const result = await manager.executeAsync(
                "test_matplotlib_figure_capture.py",
                `import matplotlib.pyplot as plt
import numpy as np
x = np.linspace(0, 10, 100)
y = np.sin(x)
plt.figure(figsize=(8, 6))
plt.plot(x, y, 'b-', label='sin(x)')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Simple Sine Wave')
plt.legend()
plt.grid(True)
print("Figure created successfully!")
missive({"plot_type": "sine_wave", "x_points": len(x)})`
            );
            assert(!result.error, "Matplotlib should not have errors");
            assertContains(result.stdout, "Figure created successfully!", "Should create figure successfully");
            assert(result.figures, "Should have figures property");
            assert(Array.isArray(result.figures), "Figures should be an array");
            assert(result.figures.length > 0, "Should have at least one figure");
            assert(typeof result.figures[0] === 'string', "Figure should be a string (base64)");
            assert(result.figures[0].length > 1000, "Figure base64 should be substantial");
            
            // Parse missive JSON string to object
            const missiveData = JSON.parse(result.missive);
            assertEquals(missiveData.plot_type, "sine_wave", "Should have correct missive data");
            assertEquals(missiveData.x_points, 100, "Should have correct x_points");
            
            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    static async test17FilesystemOperations(manager) {
        const testName = "filesystem operations";
        logTestStart("PyodideManager", testName);
        try {
            // Test mkdir
            await manager.fs("mkdir", { path: "test_fs_dir" });
            // Test writeFile
            const testContent = "print('Hello from filesystem test')";
            await manager.fs("writeFile", { path: "test_fs_dir/test_file.py", content: testContent });
            // Test exists
            const exists = await manager.fs("exists", { path: "test_fs_dir/test_file.py" });
            assert(exists, "File should exist after writing");
            // Test readFile
            const readContent = await manager.fs("readFile", { path: "test_fs_dir/test_file.py" });
            assertEquals(readContent, testContent, "Read content should match written content");
            // Test listdir
            const dirContents = await manager.fs("listdir", { path: "test_fs_dir" });
            assert(Array.isArray(dirContents), "Directory listing should be an array");
            assert(dirContents.includes("test_file.py"), "Directory should contain the test file");
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    /**
     * A filesystem operation issued while an execution is in flight must
     * resolve (id-correlated messages, no handler clobbering).
     */
    static async testFsDuringExecution(manager) {
        const testName = "fs() while executeAsync in flight";
        logTestStart("PyodideManager", testName);
        try {
            const execPromise = manager.executeAsync(
                "slow_exec.py",
                "import time\ntime.sleep(1)\nprint('slow done')"
            );
            const fsPromise = manager.fs("writeFile", { path: "race_check.txt", content: "raced" });

            const [execResult] = await Promise.all([execPromise, fsPromise]);
            assertContains(execResult.stdout, "slow done", "Execution should complete normally");

            const readBack = await manager.fs("readFile", { path: "race_check.txt" });
            assertEquals(readBack, "raced", "FS write issued mid-execution should have landed");
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    /**
     * Two concurrent executeAsync calls are serialized and each resolves
     * with its own result.
     */
    static async testConcurrentExecuteAsync(manager) {
        const testName = "concurrent executeAsync calls";
        logTestStart("PyodideManager", testName);
        try {
            const [a, b] = await Promise.all([
                manager.executeAsync("conc_a.py", "print('alpha-run')"),
                manager.executeAsync("conc_b.py", "print('beta-run')")
            ]);
            assertContains(a.stdout, "alpha-run", "First result should carry first stdout");
            assert(!a.stdout.includes("beta-run"), "First result must not carry second stdout");
            assertContains(b.stdout, "beta-run", "Second result should carry second stdout");
            assert(!b.stdout.includes("alpha-run"), "Second result must not carry first stdout");
            assertEquals(a.filename, "conc_a.py", "First result should keep its filename");
            assertEquals(b.filename, "conc_b.py", "Second result should keep its filename");
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    /**
     * After a timeout, the stale result is discarded by id: the next
     * execution resolves with its own result, not the late one.
     */
    static async testTimeoutRecovery(manager) {
        const testName = "timeout then healthy execution";
        logTestStart("PyodideManager", testName);
        try {
            let timedOut = false;
            try {
                await manager.executeAsync(
                    "too_slow.py",
                    "import time\ntime.sleep(3)\nprint('late output')",
                    undefined,
                    1000
                );
            } catch (error) {
                timedOut = true;
                assertContains(error.message, "timeout", "Rejection should be the timeout error");
            }
            assert(timedOut, "The slow execution should have timed out");

            const result = await manager.executeAsync("healthy.py", "print('healthy-output')");
            assertContains(result.stdout, "healthy-output", "Next execution should resolve with its own stdout");
            assert(!result.stdout.includes("late output"), "Late result from the timed-out run must not leak in");
            assertEquals(result.filename, "healthy.py", "Result should belong to the healthy execution");
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async testInputInSyncFunction(manager) {
        const testName = "input() inside a sync function (jspi)";
        logTestStart("PyodideManager", testName);

        try {
            if (manager.inputMode !== "jspi") {
                // Without stack switching, input() only works at levels the
                // AST rewrite can reach; the async path is covered by the
                // other input tests
                console.log("JSPI not available in this browser, sync-function input() not applicable");
                logTestPass(testName);
                return { testName, skipped: true };
            }

            manager.queueInput("42");
            const result = await manager.executeAsync("sync_input.py",
`def ask():
    return input("n? ")

value = ask()
print("value:" + value)`);
            assert(!result.error, "Sync-function input() should not error");
            assertContains(result.stdout, "value:42", "input() inside a sync def should return the queued value");

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async testSnapshotCacheRestore() {
        const testName = "snapshot cache restore";
        logTestStart("PyodideManager", testName);

        try {
            const { Nagini } = await import('../../src/nagini.js');
            const workerPath = new URL('../../src/pyodide/worker/worker-dist.js', import.meta.url).href;

            // First boot with the cache on: makes and stores the snapshot
            // (or restores one left by a previous run, both are fine)
            const m1 = await Nagini.createManager('pyodide', [], [], [], workerPath, { snapshotCache: true });
            await Nagini.waitForReady(m1, 120000);
            const r1 = await m1.executeAsync('snap1.py', 'missive({"boot": 1})\nprint("one")');
            assert(!r1.error, "First boot should execute cleanly");
            assertContains(r1.stdout, "one", "First boot should print");
            m1.destroy();

            // Second boot must restore from the cached snapshot
            const m2 = await Nagini.createManager('pyodide', [], [], [], workerPath, { snapshotCache: true });
            await Nagini.waitForReady(m2, 120000);
            assert(m2.snapshotRestored === true, "Second boot should restore from the snapshot cache");

            // The replayed input bridge and the capture layer must work on a
            // restored interpreter
            m2.queueInput("from-cache");
            const r2 = await m2.executeAsync('snap2.py', 'x = input()\nprint("echo:" + x)\nmissive({"echo": x})');
            assert(!r2.error, "Restored boot should execute cleanly");
            assertContains(r2.stdout, "echo:from-cache", "input() should work after restore");
            const missiveData = JSON.parse(r2.missive);
            assertEquals(missiveData.echo, "from-cache", "missive should work after restore");
            m2.destroy();

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
}
