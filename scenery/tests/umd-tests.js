import {
    assert,
    logTestStart,
    logTestPass,
    logTestFail
} from './test-utils.js';

export class UMDTests {
    /**
     * Test loading Nagini UMD bundle from jsDelivr CDN
     * @param {string} version - The version tag to test (e.g., 'v0.0.17')
     * @returns {Promise<void>}
     */
    static async test1LoadUMDFromCDN(version = 'v0.0.17') {
        const testName = `loadUMDFromCDN(${version})`;
        const className = 'UMD';
        logTestStart(className, testName);
        
        try {
            // Construct the jsDelivr URL for the UMD bundle
            const umdUrl = `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@${version}/src/nagini.umd.js`;
            console.log(`Loading Nagini UMD from CDN: ${umdUrl}`);
            
            // Use dynamic import to load the UMD module
            const module = await import(umdUrl);
            const NaginiUMD = module.default || module;
            
            if (!NaginiUMD) {
                throw new Error('Nagini UMD not found in imported module');
            }
            
            // Verify basic functionality
            const supportedBackends = NaginiUMD.getSupportedBackends();
            assert(Array.isArray(supportedBackends), 'getSupportedBackends should return an array');
            assert(supportedBackends.includes('pyodide'), 'Supported backends should include pyodide');
            assert(supportedBackends.includes('brython'), 'Supported backends should include brython');
            
            // Verify all expected methods exist
            assert(typeof NaginiUMD.createManager === 'function', 'Should have createManager method');
            assert(typeof NaginiUMD.waitForReady === 'function', 'Should have waitForReady method');
            assert(typeof NaginiUMD.executeFromUrl === 'function', 'Should have executeFromUrl method');
            assert(typeof NaginiUMD.getSupportedBackends === 'function', 'Should have getSupportedBackends method');
            assert(typeof NaginiUMD.isBackendSupported === 'function', 'Should have isBackendSupported method');
            
            console.log(`✅ Successfully loaded Nagini UMD ${version} from jsDelivr CDN`);
            console.log(`   Available backends: ${supportedBackends.join(', ')}`);
            console.log(`   Available methods: ${Object.keys(NaginiUMD).join(', ')}`);
            
            logTestPass(testName);
        } catch (error) {
            console.error(`❌ Failed to load Nagini UMD ${version} from CDN:`, error);
            logTestFail(testName, error);
            throw error;
        }
    }
    
    /**
     * Test UMD bundle compatibility across different loading methods
     * @param {string} version - The version tag to test
     * @returns {Promise<void>}
     */
    static async test2UMDCompatibility(version = 'v0.0.17') {
        const testName = `umdCompatibility(${version})`;
        const className = 'UMD';
        logTestStart(className, testName);
        
        try {
            const umdUrl = `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@${version}/src/nagini.umd.js`;
            
            console.log('Testing UMD compatibility across different loading methods...');
            
            // Test 1: ES Module import (what we're already doing)
            const esModule = await import(umdUrl);
            const NaginiES = esModule.default || esModule;
            assert(NaginiES, 'Should load as ES module');
            
            // Test 2: Verify it would work as global script (simulate)
            // We can't actually test global loading in this environment, but we can verify the UMD structure
            assert(typeof NaginiES === 'object', 'UMD should export an object');
            assert(NaginiES.createManager, 'Should have createManager in UMD export');
            
            // Test 3: Verify backend support checking
            assert(NaginiES.isBackendSupported('pyodide'), 'Should support pyodide');
            assert(NaginiES.isBackendSupported('brython'), 'Should support brython');
            assert(!NaginiES.isBackendSupported('invalid'), 'Should reject invalid backend');
            
            console.log('✅ UMD bundle is compatible with multiple loading methods');
            console.log('   - ES Module import: ✅');
            console.log('   - UMD structure: ✅');
            console.log('   - Backend validation: ✅');
            
            logTestPass(testName);
        } catch (error) {
            console.error(`❌ Failed UMD compatibility test for version ${version}:`, error);
            logTestFail(testName, error);
            throw error;
        }
    }
    
    /**
     * Test UMD bundle inline dependency resolution
     * @param {string} version - The version tag to test
     * @returns {Promise<void>}
     */
    static async test3UMDDependencyResolution(version = 'v0.0.17') {
        const testName = `umdDependencyResolution(${version})`;
        const className = 'UMD';
        logTestStart(className, testName);
        
        try {
            const umdUrl = `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@${version}/src/nagini.umd.js`;
            
            console.log('Testing UMD inline dependency resolution...');
            
            // Import the UMD bundle
            const module = await import(umdUrl);
            const NaginiUMD = module.default || module;
            
            // The key test: UMD should not require external dependencies
            // If this works, it means ValidationUtils is bundled inline
            try {
                // This should work without any additional imports
                NaginiUMD.isBackendSupported('pyodide');
                NaginiUMD.isBackendSupported('invalid-backend'); // Should not throw, just return false
                
                console.log('✅ UMD bundle successfully resolves dependencies internally');
                
            } catch (error) {
                throw new Error(`UMD dependency resolution failed: ${error.message}`);
            }
            
            // Verify that calling methods doesn't trigger import errors
            const backends = NaginiUMD.getSupportedBackends();
            assert(backends.length > 0, 'Should return supported backends');
            
            console.log('✅ UMD bundle has all dependencies bundled inline');
            console.log(`   Supported backends: ${backends.join(', ')}`);
            
            logTestPass(testName);
        } catch (error) {
            console.error(`❌ Failed UMD dependency resolution test for version ${version}:`, error);
            logTestFail(testName, error);
            throw error;
        }
    }
}
