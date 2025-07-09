import {
    assert,
    assertEquals,
    assertContains,
    logTestStart,
    logTestPass,
    logTestFail
} from './test-utils.js';
import { ValidationUtils } from '../../src/utils/validation.js';

export class ValidationUtilsTests {
    static async test1ValidateArray() {
        const testName = "validateArray()";
        logTestStart("ValidationUtils", testName);

        try {
            // Test valid array
            ValidationUtils.validateArray([1, 2, 3], 'testArray', 'TestComponent');

            // Test invalid array - should throw
            let errorThrown = false;
            try {
                ValidationUtils.validateArray("not an array", 'testArray', 'TestComponent');
            } catch (error) {
                errorThrown = true;
                assertContains(error.message, "🔧 [TestComponent] testArray must be an array", "Should have correct error message");
            }
            assert(errorThrown, "Should throw error for non-array");

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async test2ValidateString() {
        const testName = "validateString()";
        logTestStart("ValidationUtils", testName);

        try {
            // Test valid string
            ValidationUtils.validateString("hello", 'testString', 'TestComponent');

            // Test empty string with allowEmpty=true
            ValidationUtils.validateString("", 'testString', 'TestComponent', true);

            // Test invalid string - should throw
            let errorThrown = false;
            try {
                ValidationUtils.validateString(123, 'testString', 'TestComponent');
            } catch (error) {
                errorThrown = true;
                assertContains(error.message, "🔧 [TestComponent] testString must be a string", "Should have correct error message");
            }
            assert(errorThrown, "Should throw error for non-string");

            // Test empty string with allowEmpty=false - should throw
            errorThrown = false;
            try {
                ValidationUtils.validateString("", 'testString', 'TestComponent', false);
            } catch (error) {
                errorThrown = true;
                assertContains(error.message, "🔧 [TestComponent] testString cannot be empty", "Should have correct empty error message");
            }
            assert(errorThrown, "Should throw error for empty string when not allowed");

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async test3ValidateBackend() {
        const testName = "validateBackend()";
        logTestStart("ValidationUtils", testName);

        try {
            // Test valid backends
            ValidationUtils.validateBackend('pyodide', 'TestComponent');
            ValidationUtils.validateBackend('brython', 'TestComponent');
            ValidationUtils.validateBackend('PYODIDE', 'TestComponent'); // Should work with uppercase
            ValidationUtils.validateBackend('BRYTHON', 'TestComponent'); // Should work with uppercase

            // Test invalid backend - should throw
            let errorThrown = false;
            try {
                ValidationUtils.validateBackend('invalid', 'TestComponent');
            } catch (error) {
                errorThrown = true;
                assertContains(error.message, "🔧 [TestComponent] backend must be one of: pyodide, brython", "Should have correct error message");
            }
            assert(errorThrown, "Should throw error for invalid backend");

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async test4CheckDangerousPatterns() {
        const testName = "checkDangerousPatterns()";
        logTestStart("ValidationUtils", testName);

        try {
            // Test safe code
            const safeCode = "print('hello world')";
            const safePatterns = ValidationUtils.checkDangerousPatterns(safeCode);
            assertEquals(safePatterns.length, 0, "Safe code should have no dangerous patterns");

            // Test dangerous code
            const dangerousCode = `
import os
import subprocess
eval("dangerous code")
exec("more dangerous code")
open("file.txt", "r")
`;
            const dangerousPatterns = ValidationUtils.checkDangerousPatterns(dangerousCode);
            assert(dangerousPatterns.length > 0, "Dangerous code should have patterns");
            assertContains(dangerousPatterns.join(','), 'OS module access', "Should detect OS module");
            assertContains(dangerousPatterns.join(','), 'Subprocess execution', "Should detect subprocess");
            assertContains(dangerousPatterns.join(','), 'Dynamic code evaluation', "Should detect eval");
            assertContains(dangerousPatterns.join(','), 'Dynamic code execution', "Should detect exec");
            assertContains(dangerousPatterns.join(','), 'File system access', "Should detect file access");

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
}
