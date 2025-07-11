import {
    assert,
    assertInstanceOf,
    logTestStart,
    logTestPass,
    logTestFail
} from './test-utils.js';
import { Nagini } from '../../src/nagini.js';

export class NaginiTests {
    static async test1CreateManager(
        backend,
        packages,
        micropipPackages,
        filesToLoad,
        workerPath,
        options = {}
    ) {
        const testName = "createManager()";
        logTestStart("Nagini", testName);

        try {
            const manager = await Nagini.createManager(
                backend,
                packages,
                micropipPackages,
                filesToLoad,
                workerPath,
                options
            );

            assert(manager, "Manager should be created");
            assert(manager.packages !== undefined, "Manager should have packages property");
            assert(manager.filesToLoad !== undefined, "Manager should have filesToLoad property");
            
            // Only check for worker-specific properties in Pyodide backend
            if (backend.toLowerCase() === 'pyodide') {
                assert(manager.workerPath, "Pyodide manager should have workerPath property");
            } else if (backend.toLowerCase() === 'brython') {
                // Brython doesn't use workers, so these properties may not exist
                assert(manager.executeAsync, "Brython manager should have executeAsync method");
                assert(manager.isReady !== undefined, "Brython manager should have isReady property");
            }

            logTestPass(testName);
            return { manager, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async test2WaitForReady(manager) {
        const testName = "waitForReady()";
        logTestStart("Nagini", testName);

        try {
            await Nagini.waitForReady(manager);

            assert(manager.isReady, "Manager should be ready after waitForReady");

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async test3ExecuteFromUrl(manager, url) {
        const testName = "executeFromUrl()";
        logTestStart("Nagini", testName);

        try {
            const result = await Nagini.executeFromUrl(url, manager);

            assert(result, "Result should be returned");
            assert(result.hasOwnProperty('stdout'), "Result should have stdout property");
            assert(result.hasOwnProperty('stderr'), "Result should have stderr property");
            assert(result.hasOwnProperty('missive'), "Result should have missive property");

            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async test4GetSupportedBackends() {
        const testName = "getSupportedBackends()";
        logTestStart("Nagini", testName);

        try {
            const backends = Nagini.getSupportedBackends();

            assert(Array.isArray(backends), "Should return an array");
            assert(backends.length > 0, "Should have at least one backend");
            assert(backends.includes('pyodide'), "Should include pyodide backend");
            assert(backends.includes('brython'), "Should include brython backend");

            logTestPass(testName);
            return { backends, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async test5IsBackendSupported() {
        const testName = "isBackendSupported()";
        logTestStart("Nagini", testName);

        try {
            assert(Nagini.isBackendSupported('pyodide'), "Pyodide should be supported");
            assert(Nagini.isBackendSupported('brython'), "Brython should be supported");
            assert(!Nagini.isBackendSupported('invalid'), "Invalid backend should not be supported");
            assert(Nagini.isBackendSupported('PYODIDE'), "Should be case insensitive for pyodide");
            assert(Nagini.isBackendSupported('BRYTHON'), "Should be case insensitive for brython");

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async test6BackendSpecificFeatures(manager, backend) {
        const testName = "backend-specific features";
        logTestStart("Nagini", testName);

        try {
            if (backend.toLowerCase() === 'pyodide') {
                // Pyodide-specific features
                assert(manager.worker, "Pyodide manager should have worker property");
                assert(manager.worker instanceof Worker, "Pyodide manager worker should be a Worker instance");
                assert(manager.fs, "Pyodide manager should have fs method");
                assert(manager.queueInput, "Pyodide manager should have queueInput method");
            } else if (backend.toLowerCase() === 'brython') {
                // Brython-specific features
                assert(manager.executeAsync, "Brython manager should have executeAsync method");
                assert(manager.isReady !== undefined, "Brython manager should have isReady property");
                // Brython doesn't have workers or filesystem operations
                assert(!manager.worker, "Brython manager should not have worker property");
                
                // Test that filesystem operations throw appropriate errors
                try {
                    await manager.fs("readFile", { path: "test.txt" });
                    assert(false, "Brython fs operations should throw error");
                } catch (error) {
                    assert(error.message.includes("not support filesystem"), "Should throw filesystem not supported error");
                }
            }

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
}
