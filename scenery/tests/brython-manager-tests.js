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
                testManager = await Nagini.createManager('brython', [], [], '', brythonOptions);
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
} 