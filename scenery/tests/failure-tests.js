import { assertEquals } from './test-utils.js';

export class FailureTests {
    /**
     * This test is designed to fail an assertion, which should be categorized as a 'flop'.
     * The Python code itself executes correctly.
     */
    static async testFlop(manager) {
        const result = await manager.executeAsync(
            "flop_test.py",
            `
# This Python code is correct, but the JS test will assert the wrong result.
result = 1 + 1
missive({"result": result})
`
        );
        
        // This assertion will intentionally fail.
        assertEquals(3, result.missive.result, "ASSERTION FAILED: 1 + 1 should be 3 (intentionally wrong)");
    }

    /**
     * This test executes Python code that will cause a runtime error,
     * which should be categorized as a 'glitch'.
     */
    static async testGlitch(manager) {
        await manager.executeAsync(
            "glitch_test.py",
            `
# This code will cause a ModuleNotFoundError in Python.
import a_module_that_does_not_exist
`
        );
        // The executeAsync call itself will throw an exception, which will be caught by the test runner.
    }
} 