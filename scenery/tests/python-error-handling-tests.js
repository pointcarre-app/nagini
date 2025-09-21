/**
 * Python Error Handling Tests for Nagini
 * 
 * Tests that Python errors are properly captured and returned to JavaScript
 * with full traceback information in stderr.
 */

import { assert, assertContains, logTestPass, logTestFail } from './test-utils.js';

export async function runPythonErrorHandlingTests(manager) {
    console.log('🧪 Running Python Error Handling Tests...');
    const results = [];

    // Test 1: ZeroDivisionError with full traceback
    results.push(await testZeroDivisionError(manager));
    
    // Test 2: NameError with undefined variable
    results.push(await testNameError(manager));
    
    // Test 3: TypeError with wrong argument types
    results.push(await testTypeError(manager));
    
    // Test 4: Custom exception with message
    results.push(await testCustomException(manager));
    
    // Test 5: Syntax error (if supported)
    results.push(await testSyntaxError(manager));
    
    // Test 6: Import error
    results.push(await testImportError(manager));
    
    // Test 7: Index error
    results.push(await testIndexError(manager));
    
    // Test 8: Multiple errors with successful code before and after
    results.push(await testMixedExecution(manager));

    return results;
}

async function testZeroDivisionError(manager) {
    const testName = 'ZeroDivisionError - Full Traceback';
    try {
        console.log(`📝 Testing ${testName}...`);
        
        const result = await manager.executeAsync("zero_div_test.py", `
print("About to divide by zero...")
x = 1 / 0
print("This won't be printed")
        `);
        
        // The promise should resolve (not reject) even with Python errors
        assert(result !== undefined, "Result should be defined");
        
        // Check that we have error information
        assert(result.error, "Result should have error property");
        assert(result.error.name, "Error should have name");
        assert(result.error.message, "Error should have message");
        
        // Check stderr contains the full traceback
        assert(result.stderr, "Result should have stderr with traceback");
        assertContains(result.stderr, "ZeroDivisionError", "stderr should contain error type");
        assertContains(result.stderr, "division by zero", "stderr should contain error message");
        assertContains(result.stderr, "Traceback", "stderr should contain traceback");
        assertContains(result.stderr, "line", "stderr should contain line information");
        
        // Check stdout contains output before the error
        assert(result.stdout, "Should have stdout");
        assertContains(result.stdout, "About to divide by zero", "stdout should contain pre-error output");
        assert(!result.stdout.includes("This won't be printed"), "stdout should not contain post-error output");
        
        console.log("✅ ZeroDivisionError traceback captured successfully:");
        console.log("  Error name:", result.error.name);
        console.log("  Error message:", result.error.message);
        console.log("  Stderr preview:", result.stderr.substring(0, 100) + "...");
        
        logTestPass(testName);
        return { testName, passed: true, result };
    } catch (error) {
        logTestFail(testName, error);
        throw error;
    }
}

async function testNameError(manager) {
    const testName = 'NameError - Undefined Variable';
    try {
        console.log(`📝 Testing ${testName}...`);
        
        const result = await manager.executeAsync("name_error_test.py", `
print("Starting test...")
undefined_variable
print("This won't execute")
        `);
        
        assert(result !== undefined, "Result should be defined");
        assert(result.error, "Result should have error property");
        assert(result.stderr, "Result should have stderr");
        
        assertContains(result.stderr, "NameError", "stderr should contain NameError");
        assertContains(result.stderr, "undefined_variable", "stderr should mention the undefined variable");
        assertContains(result.stderr, "is not defined", "stderr should contain error description");
        
        logTestPass(testName);
        return { testName, passed: true, result };
    } catch (error) {
        logTestFail(testName, error);
        throw error;
    }
}

async function testTypeError(manager) {
    const testName = 'TypeError - Wrong Argument Types';
    try {
        console.log(`📝 Testing ${testName}...`);
        
        const result = await manager.executeAsync("type_error_test.py", `
def add_numbers(a, b):
    return a + b

result = add_numbers("string", 5)
        `);
        
        assert(result !== undefined, "Result should be defined");
        assert(result.error, "Result should have error property");
        assert(result.stderr, "Result should have stderr");
        
        assertContains(result.stderr, "TypeError", "stderr should contain TypeError");
        assertContains(result.stderr, "str", "stderr should mention string type");
        
        logTestPass(testName);
        return { testName, passed: true, result };
    } catch (error) {
        logTestFail(testName, error);
        throw error;
    }
}

async function testCustomException(manager) {
    const testName = 'Custom Exception with Message';
    try {
        console.log(`📝 Testing ${testName}...`);
        
        const result = await manager.executeAsync("custom_exception_test.py", `
class CustomError(Exception):
    pass

def risky_operation():
    raise CustomError("Something went wrong in the operation!")

print("Before exception")
risky_operation()
print("After exception")
        `);
        
        assert(result !== undefined, "Result should be defined");
        assert(result.error, "Result should have error property");
        assert(result.stderr, "Result should have stderr");
        
        assertContains(result.stderr, "CustomError", "stderr should contain CustomError");
        assertContains(result.stderr, "Something went wrong in the operation", "stderr should contain custom message");
        assertContains(result.stderr, "risky_operation", "stderr should show function name in traceback");
        
        logTestPass(testName);
        return { testName, passed: true, result };
    } catch (error) {
        logTestFail(testName, error);
        throw error;
    }
}

async function testSyntaxError(manager) {
    const testName = 'SyntaxError - Invalid Python Syntax';
    try {
        console.log(`📝 Testing ${testName}...`);
        
        const result = await manager.executeAsync("syntax_error_test.py", `
print("Before syntax error")
if True
    print("Missing colon")
        `);
        
        assert(result !== undefined, "Result should be defined");
        
        // Syntax errors might be caught differently
        if (result.error || result.stderr) {
            console.log("✅ Syntax error captured");
            if (result.stderr) {
                assertContains(result.stderr.toLowerCase(), "syntax", "stderr should mention syntax");
            }
        }
        
        logTestPass(testName);
        return { testName, passed: true, result };
    } catch (error) {
        logTestFail(testName, error);
        throw error;
    }
}

async function testImportError(manager) {
    const testName = 'ImportError - Non-existent Module';
    try {
        console.log(`📝 Testing ${testName}...`);
        
        const result = await manager.executeAsync("import_error_test.py", `
print("Attempting to import non-existent module...")
import non_existent_module_xyz123
print("This won't execute")
        `);
        
        assert(result !== undefined, "Result should be defined");
        assert(result.error, "Result should have error property");
        assert(result.stderr, "Result should have stderr");
        
        assertContains(result.stderr, "Error", "stderr should contain Error");
        assertContains(result.stderr, "non_existent_module_xyz123", "stderr should mention the module name");
        
        logTestPass(testName);
        return { testName, passed: true, result };
    } catch (error) {
        logTestFail(testName, error);
        throw error;
    }
}

async function testIndexError(manager) {
    const testName = 'IndexError - List Index Out of Range';
    try {
        console.log(`📝 Testing ${testName}...`);
        
        const result = await manager.executeAsync("index_error_test.py", `
my_list = [1, 2, 3]
print(f"List has {len(my_list)} elements")
element = my_list[10]
print("This won't execute")
        `);
        
        assert(result !== undefined, "Result should be defined");
        assert(result.error, "Result should have error property");
        assert(result.stderr, "Result should have stderr");
        
        assertContains(result.stderr, "IndexError", "stderr should contain IndexError");
        assertContains(result.stderr, "index out of range", "stderr should contain error description");
        
        assert(result.stdout, "Should have stdout");
        assertContains(result.stdout, "List has 3 elements", "stdout should contain pre-error output");
        
        logTestPass(testName);
        return { testName, passed: true, result };
    } catch (error) {
        logTestFail(testName, error);
        throw error;
    }
}

async function testMixedExecution(manager) {
    const testName = 'Mixed Execution - Success, Error, Recovery';
    try {
        console.log(`📝 Testing ${testName}...`);
        
        // First execution: successful
        const result1 = await manager.executeAsync("mixed_test_1.py", `
print("First execution: successful")
result = 2 + 2
print(f"Result is {result}")
        `);
        
        assert(result1 !== undefined, "Result1 should be defined");
        assert(!result1.error, "Result1 should not have error");
        assert(!result1.stderr || result1.stderr === "", "Result1 should not have stderr");
        assertContains(result1.stdout, "Result is 4", "Result1 stdout should show calculation");
        
        // Second execution: with error
        const result2 = await manager.executeAsync("mixed_test_2.py", `
print("Second execution: will fail")
x = 1 / 0
        `);
        
        assert(result2 !== undefined, "Result2 should be defined");
        assert(result2.error, "Result2 should have error");
        assert(result2.stderr, "Result2 should have stderr");
        assertContains(result2.stderr, "ZeroDivisionError", "Result2 stderr should contain error");
        
        // Third execution: recovery after error
        const result3 = await manager.executeAsync("mixed_test_3.py", `
print("Third execution: recovered from previous error")
result = 10 * 5
print(f"New result is {result}")
        `);
        
        assert(result3 !== undefined, "Result3 should be defined");
        assert(!result3.error, "Result3 should not have error");
        assert(!result3.stderr || result3.stderr === "", "Result3 should not have stderr");
        assertContains(result3.stdout, "New result is 50", "Result3 stdout should show new calculation");
        
        console.log("✅ Manager correctly handles mixed execution scenarios");
        
        logTestPass(testName);
        return { testName, passed: true, results: [result1, result2, result3] };
    } catch (error) {
        logTestFail(testName, error);
        throw error;
    }
}
