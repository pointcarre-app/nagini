// Simple test utilities
export function assert(condition, message) {
    if (!condition) {
        throw new Error(`ASSERTION FAILED: ${message}`);
    }
}

export function assertEquals(actual, expected, message) {
    if (!deepEquals(actual, expected)) {
        throw new Error(`ASSERTION FAILED: ${message}\n  Expected: ${JSON.stringify(expected)}\n  Actual: ${JSON.stringify(actual)}`);
    }
}

function deepEquals(a, b) {
    if (a === b) return true;

    if (a == null || b == null) return false;

    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (!deepEquals(a[i], b[i])) return false;
        }
        return true;
    }

    if (typeof a === 'object' && typeof b === 'object') {
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        for (let key of keysA) {
            if (!keysB.includes(key)) return false;
            if (!deepEquals(a[key], b[key])) return false;
        }
        return true;
    }

    return false;
}

export function assertContains(haystack, needle, message) {
    if (!haystack.includes(needle)) {
        throw new Error(`ASSERTION FAILED: ${message}\n  Expected to contain: ${needle}\n  Actual: ${haystack}`);
    }
}

export function assertInstanceOf(obj, constructor, message) {
    if (!(obj instanceof constructor)) {
        throw new Error(`ASSERTION FAILED: ${message}\n  Expected instance of: ${constructor.name}\n  Actual: ${obj.constructor.name}`);
    }
}

export function logTestStart(className, testName) {
    console.log(`\n[${className}] ${testName}`);
}

export function logTestPass(testName) {
    console.log(`  PASS: ${testName}`);
}

export function logTestFail(testName, error) {
    console.log(`  FAIL: ${testName} - ${error.message}`);
}
