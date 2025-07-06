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
    static async test1SimpleExecution() {
        const testName = "simple executeAsync()";
        logTestStart("BrythonManager", testName);

        try {
            // Create a minimal manager – no packages, no files, dummy paths
            const manager = await Nagini.createManager('brython', [], [], '', '');
            await Nagini.waitForReady(manager, 10000);

            const message = 'Hello from Brython';
            const result = await manager.executeAsync('hello.py', `print('${message}')`);

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