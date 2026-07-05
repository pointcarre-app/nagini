import {
    assert,
    assertContains,
    logTestStart,
    logTestPass,
    logTestFail
} from './test-utils.js';

import { Nagini } from '../../src/nagini.js';

export class BrythonManagerTests {
    /**
     * Verify we can create a BrythonManager, wait for ready, and run code.
     */
    static async test1SimpleExecution(manager = null) {
        const testName = "simple executeAsync()";
        logTestStart("BrythonManager", testName);

        try {
            let testManager = manager;
            
            // Only create a manager if one wasn't provided
            if (!testManager) {
                const brythonOptions = {
                    brythonJsPath: "/src/brython/lib/brython.js",
                    brythonStdlibPath: "/src/brython/lib/brython_stdlib.js"
                };
                testManager = await Nagini.createManager('brython', [], [], [], '', brythonOptions);
                await Nagini.waitForReady(testManager, 10000);
            }

            const message = 'Hello from Brython';
            const result = await testManager.executeAsync('hello.py', `print('${message}')`);

            assert(result, 'Result should be returned');
            assertContains(result.stdout, message, 'stdout should contain printed message');
            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    /**
     * A script that raises must resolve with error set (not hang forever).
     */
    static async test2ErrorPropagation(manager) {
        const testName = "executeAsync error propagation";
        logTestStart("BrythonManager", testName);

        try {
            const result = await manager.executeAsync(
                'boom.py',
                "print('before the raise')\nraise ValueError('boom')"
            );

            assert(result, 'Result should be returned even when the code raises');
            assert(result.error, 'result.error should be set when the code raises');
            assertContains(result.stderr, 'ValueError', 'stderr should contain the traceback');
            assertContains(result.stdout, 'before the raise', 'stdout before the raise should be captured');
            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    /**
     * Overlapping executions must each resolve with their own stdout
     * (per-execution callbacks, no shared global slot).
     */
    static async test3ConcurrentExecutions(manager) {
        const testName = "executeAsync concurrent executions";
        logTestStart("BrythonManager", testName);

        try {
            const [a, b] = await Promise.all([
                manager.executeAsync('alpha.py', "print('alpha-output')"),
                manager.executeAsync('beta.py', "print('beta-output')")
            ]);

            assertContains(a.stdout, 'alpha-output', 'first execution should keep its own stdout');
            assert(!a.stdout.includes('beta-output'), 'first execution must not capture second stdout');
            assertContains(b.stdout, 'beta-output', 'second execution should keep its own stdout');
            assert(!b.stdout.includes('alpha-output'), 'second execution must not capture first stdout');
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
} 