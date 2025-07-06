import { assert, assertEquals, assertContains, logTestStart, logTestPass, logTestFail } from './test-utils.js';

export class UtilitiesTests {
    static async test1TestUtilsAssertFunction() {
        const testName = "test-utils assert function";
        logTestStart("Utilities", testName);

        try {
            // Test successful assertion
            assert(true, "This should pass");
            assert(1 === 1, "This should also pass");
            assert("hello".length === 5, "String length assertion should pass");

            // Test failed assertion
            let errorThrown = false;
            try {
                assert(false, "This should fail");
            } catch (error) {
                errorThrown = true;
                assertContains(error.message, "ASSERTION FAILED: This should fail", "Should have correct error message");
            }
            assert(errorThrown, "Should throw error for false assertion");

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async test2TestUtilsEqualsFunction() {
        const testName = "test-utils assertEquals function";
        logTestStart("Utilities", testName);

        try {
            // Test successful equality
            assertEquals(5, 5, "Numbers should be equal");
            assertEquals("hello", "hello", "Strings should be equal");
            assertEquals([1, 2, 3], [1, 2, 3], "Arrays should be equal");
            assertEquals({a: 1, b: 2}, {a: 1, b: 2}, "Objects should be equal");

            // Test failed equality
            let errorThrown = false;
            try {
                assertEquals(5, 6, "Numbers should not be equal");
            } catch (error) {
                errorThrown = true;
                assertContains(error.message, "ASSERTION FAILED: Numbers should not be equal", "Should have correct error message");
                assertContains(error.message, "Expected: 6", "Should show expected value");
                assertContains(error.message, "Actual: 5", "Should show actual value");
            }
            assert(errorThrown, "Should throw error for unequal values");

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async test3StringManipulationUtilities() {
        const testName = "string manipulation utilities";
        logTestStart("Utilities", testName);

        try {
            // Test string contains functionality (used in tests)
            const testString = "Hello, this is a test string with multiple words.";
            assert(testString.includes("Hello"), "Should contain Hello");
            assert(testString.includes("test string"), "Should contain test string");
            assert(!testString.includes("xyz"), "Should not contain xyz");

            // Test string manipulation
            const upperCase = testString.toUpperCase();
            assertContains(upperCase, "HELLO", "Should contain uppercase HELLO");

            const lowerCase = testString.toLowerCase();
            assertContains(lowerCase, "hello", "Should contain lowercase hello");

            const words = testString.split(" ");
            assert(words.length > 5, "Should have multiple words");
            assert(words[0] === "Hello,", "First word should be Hello,");

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
}
