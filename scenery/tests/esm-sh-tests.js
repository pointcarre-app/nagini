import {
    assert,
    logTestStart,
    logTestPass,
    logTestFail
} from './test-utils.js';

export class EsmShTests {
    /**
     * Test loading Nagini from esm.sh CDN with automatic dependency resolution
     * @param {string} version - The version tag to test (e.g., 'v0.0.19')
     * @returns {Promise<void>}
     */
    static async test1LoadFromEsmSh(version = 'v0.0.19') {
        const testName = `loadFromEsmSh(${version})`;
        const className = 'EsmSh';
        logTestStart(className, testName);
        
        try {
            // Construct the esm.sh URL for the specific version
            const esmShUrl = `https://esm.sh/gh/pointcarre-app/nagini@${version}/src/nagini.js`;
            console.log(`Loading Nagini from esm.sh CDN: ${esmShUrl}`);
            
            // Use dynamic import to load the module - esm.sh handles dependencies automatically
            const module = await import(esmShUrl);
            const NaginiEsmSh = module.Nagini;
            
            if (!NaginiEsmSh) {
                throw new Error('Nagini not found in esm.sh imported module');
            }
            
            // Verify basic functionality
            const supportedBackends = NaginiEsmSh.getSupportedBackends();
            assert(Array.isArray(supportedBackends), 'getSupportedBackends should return an array');
            assert(supportedBackends.includes('pyodide'), 'Supported backends should include pyodide');
            assert(supportedBackends.includes('brython'), 'Supported backends should include brython');
            
            // Verify all expected methods exist
            assert(typeof NaginiEsmSh.createManager === 'function', 'Should have createManager method');
            assert(typeof NaginiEsmSh.waitForReady === 'function', 'Should have waitForReady method');
            assert(typeof NaginiEsmSh.executeFromUrl === 'function', 'Should have executeFromUrl method');
            assert(typeof NaginiEsmSh.getSupportedBackends === 'function', 'Should have getSupportedBackends method');
            assert(typeof NaginiEsmSh.isBackendSupported === 'function', 'Should have isBackendSupported method');
            
            // Test backend validation
            assert(NaginiEsmSh.isBackendSupported('pyodide') === true, 'pyodide should be supported');
            assert(NaginiEsmSh.isBackendSupported('brython') === true, 'brython should be supported');
            assert(NaginiEsmSh.isBackendSupported('invalid') === false, 'invalid backend should not be supported');
            
            console.log(`✅ Successfully loaded Nagini ${version} from esm.sh CDN`);
            console.log(`   Available backends: ${supportedBackends.join(', ')}`);
            console.log(`   Available methods: ${Object.keys(NaginiEsmSh).join(', ')}`);
            console.log(`   ⭐ esm.sh automatically resolved all ES6 dependencies!`);
            
            logTestPass(testName);
        } catch (error) {
            console.error(`❌ Failed to load Nagini ${version} from esm.sh CDN:`, error);
            logTestFail(testName, error);
            throw error;
        }
    }
    
    /**
     * Test esm.sh dependency resolution capabilities
     * @param {string} version - The version tag to test
     * @returns {Promise<void>}
     */
    static async test2EsmShDependencyResolution(version = 'v0.0.19') {
        const testName = `esmShDependencyResolution(${version})`;
        const className = 'EsmSh';
        logTestStart(className, testName);
        
        try {
            const esmShUrl = `https://esm.sh/gh/pointcarre-app/nagini@${version}/src/nagini.js`;
            
            console.log('Testing esm.sh automatic dependency resolution...');
            
            // Import the module - the key test is that this succeeds without errors
            const module = await import(esmShUrl);
            const NaginiEsmSh = module.Nagini;
            
            // The fact that we got here means esm.sh successfully:
            // 1. Resolved './utils/validation.js' import
            // 2. Handled any other ES6 imports
            // 3. Made everything work together seamlessly
            
            assert(NaginiEsmSh, 'Nagini should be available from esm.sh');
            
            // Test that internal dependencies are working by calling methods that use them
            try {
                // This method uses ValidationUtils internally
                const isSupported = NaginiEsmSh.isBackendSupported('pyodide');
                assert(typeof isSupported === 'boolean', 'Backend validation should work (depends on ValidationUtils)');
                
                // This should not throw (ValidationUtils working)
                const backends = NaginiEsmSh.getSupportedBackends();
                assert(Array.isArray(backends), 'getSupportedBackends should work');
                
                console.log('✅ esm.sh successfully resolved all internal dependencies');
                console.log('   - ValidationUtils: ✅ Working');
                console.log('   - Backend validation: ✅ Working');
                console.log('   - All ES6 imports: ✅ Resolved automatically');
                
            } catch (dependencyError) {
                throw new Error(`esm.sh dependency resolution failed: ${dependencyError.message}`);
            }
            
            console.log(`✅ esm.sh CDN ${version} has perfect dependency resolution`);
            console.log('   🎯 This is why esm.sh is our recommended solution!');
            
            logTestPass(testName);
        } catch (error) {
            console.error(`❌ Failed esm.sh dependency resolution test for version ${version}:`, error);
            logTestFail(testName, error);
            throw error;
        }
    }
    
    /**
     * Test esm.sh performance and caching behavior
     * @param {string} version - The version tag to test
     * @returns {Promise<void>}
     */
    static async test3EsmShPerformance(version = 'v0.0.19') {
        const testName = `esmShPerformance(${version})`;
        const className = 'EsmSh';
        logTestStart(className, testName);
        
        try {
            const esmShUrl = `https://esm.sh/gh/pointcarre-app/nagini@${version}/src/nagini.js`;
            
            console.log('Testing esm.sh performance characteristics...');
            
            // First load - measure initial load time
            const firstLoadStart = performance.now();
            const module1 = await import(esmShUrl);
            const firstLoadTime = performance.now() - firstLoadStart;
            
            assert(module1.Nagini, 'First load should succeed');
            
            // Second load - should be faster due to caching
            const secondLoadStart = performance.now();
            const module2 = await import(esmShUrl);
            const secondLoadTime = performance.now() - secondLoadStart;
            
            assert(module2.Nagini, 'Second load should succeed');
            
            // Third load - should be even faster
            const thirdLoadStart = performance.now();
            const module3 = await import(esmShUrl);
            const thirdLoadTime = performance.now() - thirdLoadStart;
            
            assert(module3.Nagini, 'Third load should succeed');
            
            // Verify they're the same object (cached properly)
            assert(module1.Nagini === module2.Nagini, 'Modules should be cached and identical');
            assert(module2.Nagini === module3.Nagini, 'All modules should be cached and identical');
            
            console.log(`✅ esm.sh performance test results for ${version}:`);
            console.log(`   First load:  ${firstLoadTime.toFixed(2)}ms (includes dependency resolution)`);
            console.log(`   Second load: ${secondLoadTime.toFixed(2)}ms (cached)`);
            console.log(`   Third load:  ${thirdLoadTime.toFixed(2)}ms (cached)`);
            console.log(`   Cache efficiency: ${((firstLoadTime - secondLoadTime) / firstLoadTime * 100).toFixed(1)}% faster`);
            console.log('   🚀 esm.sh provides excellent caching and performance!');
            
            logTestPass(testName);
        } catch (error) {
            console.error(`❌ Failed esm.sh performance test for version ${version}:`, error);
            logTestFail(testName, error);
            throw error;
        }
    }
}
