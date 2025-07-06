import { assert, assertInstanceOf, logTestStart, logTestPass, logTestFail } from './test-utils.js';
import { Nagini } from '../../src/nagini.js';

export class NaginiTests {
    static async test1CreateManager(backend, packages, filesToLoad, pyodideInitPath, workerPath) {
        const testName = "createManager()";
        logTestStart("Nagini", testName);

        try {
            const manager = await Nagini.createManager(backend, packages, filesToLoad, pyodideInitPath, workerPath);

            assert(manager, "Manager should be created");
            assert(manager.packages, "Manager should have packages property");
            assert(manager.filesToLoad, "Manager should have filesToLoad property");
            assert(manager.pyodideInitPath, "Manager should have pyodideInitPath property");
            assert(manager.workerPath, "Manager should have workerPath property");

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
            assert(!Nagini.isBackendSupported('invalid'), "Invalid backend should not be supported");
            assert(Nagini.isBackendSupported('PYODIDE'), "Should be case insensitive");

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
}
