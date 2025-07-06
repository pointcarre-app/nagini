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
            assertEquals(result.missive.namespace_custom_var, 42, "Namespace custom_var should be accessible");
            assertEquals(result.missive.namespace_custom_name, "test_namespace", "Namespace custom_name should be accessible");
            assertEquals(result.missive.namespace_result, 84, "Namespace computation should work");
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
            // Verify independence
            assertEquals(resultA.missive.isolation_var, "A_modified", "Namespace A isolation_var should be correct");
            assertEquals(resultB.missive.isolation_var, "B_modified", "Namespace B isolation_var should be correct");
            assertEquals(resultA.missive.shared_name, "namespace_A", "Namespace A shared_name should be correct");
            assertEquals(resultB.missive.shared_name, "namespace_B", "Namespace B shared_name should be correct");
            assertEquals(resultA.missive.namespace_specific, "only_in_A", "Namespace A specific var should be correct");
            assertEquals(resultB.missive.namespace_specific, "only_in_B", "Namespace B specific var should be correct");
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
        const testName = "pyodideInitPath";
        logTestStart("PyodideManager", testName);
        try {
            assert(typeof manager.pyodideInitPath === 'string', "PyodideInitPath should be a string");
            assertContains(manager.pyodideInitPath, ".py", "PyodideInitPath should contain .py extension");
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
            // Simple test without actual input() calls for now
            const result = await manager.executeAsync(
                "test_input_handling.py",
                `print("Input handling system ready")
missive({"input_system": "ready"})`
            );
            assert(!result.error, "Input handling should not have errors");
            assertContains(result.stdout, "Input handling system ready", "Should show ready message");
            assert(result.missive.input_system === "ready", "Should have missive confirmation");
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
            assertEquals(result.missive.plot_type, "sine_wave", "Should have correct missive data");
            assertEquals(result.missive.x_points, 100, "Should have correct x_points");
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
} 
