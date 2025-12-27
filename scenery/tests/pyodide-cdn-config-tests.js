import {
    assert,
    assertEquals,
    assertContains,
    logTestStart,
    logTestPass,
    logTestFail
} from './test-utils.js';
import { Nagini } from '../../src/nagini.js';

/**
 * Tests for dynamic Pyodide CDN URL configuration
 * 
 * These tests verify the ability to customize the Pyodide CDN URL,
 * which is essential for:
 * - Capacitor/iOS apps using local Pyodide files
 * - Offline-capable applications
 * - Custom CDN mirrors or self-hosted Pyodide
 */
export class PyodideCdnConfigTests {
    
    // Default CDN URL (must match worker-config.js)
    static DEFAULT_CDN_URL = "https://cdn.jsdelivr.net/pyodide/v0.28.0/full/";
    
    /**
     * Test 1: No pyodideCdnUrl provided - uses default (backward compatibility)
     * 
     * Verifies that when no pyodideCdnUrl is provided in options,
     * the manager initializes correctly using the default CDN URL.
     * This ensures backward compatibility with existing code.
     */
    static async test1DefaultCdnUrl(workerPath) {
        const testName = "Default CDN URL (no value provided)";
        logTestStart("PyodideCdnConfig", testName);
        
        try {
            // Create manager WITHOUT pyodideCdnUrl option
            const manager = await Nagini.createManager(
                'pyodide',
                [],  // No packages for faster test
                [],
                [],
                workerPath
                // No options object - tests backward compatibility
            );
            
            // Verify manager was created
            assert(manager, "Manager should be created");
            
            // Verify pyodideCdnUrl is undefined (not explicitly set)
            assert(manager.pyodideCdnUrl === undefined, "pyodideCdnUrl should be undefined when not provided");
            
            // Wait for initialization to complete
            await Nagini.waitForReady(manager, 60000);
            
            // Verify manager is ready (proves default CDN worked)
            assert(manager.isReady, "Manager should be ready after initialization");
            
            // Execute simple Python code to verify Pyodide loaded correctly
            const result = await manager.executeAsync(
                "test_default_cdn.py",
                `import sys\nprint(f"Python version: {sys.version_info.major}.{sys.version_info.minor}")`
            );
            
            assert(!result.error, "Execution should not have errors");
            assertContains(result.stdout, "Python version:", "Should print Python version");
            
            // Cleanup
            manager.destroy();
            
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    
    /**
     * Test 2: pyodideCdnUrl set to default value explicitly
     * 
     * Verifies that when pyodideCdnUrl is explicitly set to the default value,
     * the manager stores the value and initializes correctly.
     */
    static async test2ExplicitDefaultCdnUrl(workerPath) {
        const testName = "Explicit default CDN URL";
        logTestStart("PyodideCdnConfig", testName);
        
        try {
            // Create manager WITH explicit default pyodideCdnUrl
            const manager = await Nagini.createManager(
                'pyodide',
                [],  // No packages for faster test
                [],
                [],
                workerPath,
                { pyodideCdnUrl: PyodideCdnConfigTests.DEFAULT_CDN_URL }
            );
            
            // Verify manager was created
            assert(manager, "Manager should be created");
            
            // Verify pyodideCdnUrl is stored correctly
            assertEquals(
                manager.pyodideCdnUrl, 
                PyodideCdnConfigTests.DEFAULT_CDN_URL,
                "pyodideCdnUrl should match the explicitly provided default value"
            );
            
            // Wait for initialization to complete
            await Nagini.waitForReady(manager, 60000);
            
            // Verify manager is ready
            assert(manager.isReady, "Manager should be ready after initialization");
            
            // Execute simple Python code to verify Pyodide loaded correctly
            const result = await manager.executeAsync(
                "test_explicit_default_cdn.py",
                `import sys\nprint(f"Pyodide loaded from explicit default CDN")`
            );
            
            assert(!result.error, "Execution should not have errors");
            assertContains(result.stdout, "Pyodide loaded from explicit default CDN", "Should execute Python code");
            
            // Cleanup
            manager.destroy();
            
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
    
    /**
     * Test 3: Local Pyodide path (simulated with alternate CDN)
     * 
     * This test verifies that custom CDN URLs are properly passed through
     * the system. For actual local testing in Capacitor apps, you would use:
     * - capacitor://localhost/pyodide/
     * - file:///path/to/local/pyodide/
     * 
     * Note: This test uses a local server path to simulate local Pyodide.
     * For this test to pass, Pyodide must be available at the specified path.
     * In production Capacitor apps, you would bundle Pyodide with the app.
     */
    static async test3LocalPyodidePath(workerPath, localPyodidePath) {
        const testName = "Local Pyodide path";
        logTestStart("PyodideCdnConfig", testName);
        
        try {
            // Create manager with local Pyodide path
            const manager = await Nagini.createManager(
                'pyodide',
                [],  // No packages for faster test
                [],
                [],
                workerPath,
                { pyodideCdnUrl: localPyodidePath }
            );
            
            // Verify manager was created
            assert(manager, "Manager should be created");
            
            // Verify pyodideCdnUrl is stored correctly
            assertEquals(
                manager.pyodideCdnUrl,
                localPyodidePath,
                "pyodideCdnUrl should match the provided local path"
            );
            
            // Wait for initialization to complete
            await Nagini.waitForReady(manager, 60000);
            
            // Verify manager is ready (proves local path worked)
            assert(manager.isReady, "Manager should be ready after initialization with local Pyodide");
            
            // Execute simple Python code to verify Pyodide loaded correctly
            const result = await manager.executeAsync(
                "test_local_pyodide.py",
                `import sys\nprint(f"Pyodide loaded from local path successfully!")`
            );
            
            assert(!result.error, "Execution should not have errors");
            assertContains(result.stdout, "Pyodide loaded from local path successfully!", "Should execute Python code from local Pyodide");
            
            // Cleanup
            manager.destroy();
            
            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
}

