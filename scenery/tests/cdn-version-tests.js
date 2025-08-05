import {
    assert,
    logTestStart,
    logTestPass,
    logTestFail
} from './test-utils.js';

export class CDNVersionTests {
    /**
     * Test loading Nagini from jsDelivr CDN with a specific tagged version
     * @param {string} version - The version tag to test (e.g., 'v0.0.17')
     * @returns {Promise<void>}
     */
    static async test1LoadFromCDN(version = 'v0.0.17') {
        const testName = `loadFromCDN(${version})`;
        const className = 'CDNVersion';
        logTestStart(className, testName);
        
        try {
            // Construct the jsDelivr URL for the specific version
            const cdnUrl = `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@${version}/src/nagini.js`;
            console.log(`Loading Nagini from CDN: ${cdnUrl}`);
            
            // Use dynamic import to load the module directly
            const module = await import(cdnUrl);
            const NaginiCDN = module.Nagini;
            
            if (!NaginiCDN) {
                throw new Error('Nagini not found in imported module');
            }
            
            // Verify basic functionality
            const supportedBackends = NaginiCDN.getSupportedBackends();
            assert(Array.isArray(supportedBackends), 'getSupportedBackends should return an array');
            assert(supportedBackends.includes('pyodide'), 'Supported backends should include pyodide');
            
            console.log(`✅ Successfully loaded Nagini ${version} from jsDelivr CDN`);
            console.log(`   Available backends: ${supportedBackends.join(', ')}`);
            
            logTestPass(testName);
        } catch (error) {
            console.error(`❌ Failed to load Nagini ${version} from CDN:`, error);
            logTestFail(testName, error);
            throw error;
        }
    }
    
    /**
     * Test basic CDN functionality without creating a full manager
     * @param {string} version - The version tag to test (e.g., 'v0.0.17')
     * @returns {Promise<void>}
     */
    static async test2BasicCDNFunctionality(version = 'v0.0.17') {
        const testName = `basicCDNFunctionality(${version})`;
        const className = 'CDNVersion';
        logTestStart(className, testName);
        
        try {
            // For now, let's just verify the CDN module loads and has the expected API
            // Creating a full Pyodide manager from CDN requires all dependencies to be available
            const cdnUrl = `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@${version}/src/nagini.js`;
            
            console.log('Testing basic CDN functionality...');
            
            // Import the module
            const module = await import(cdnUrl);
            const NaginiCDN = module.Nagini;
            
            // Verify the API
            assert(NaginiCDN, 'Nagini should be available from CDN');
            assert(typeof NaginiCDN.createManager === 'function', 'Should have createManager method');
            assert(typeof NaginiCDN.waitForReady === 'function', 'Should have waitForReady method');
            assert(typeof NaginiCDN.executeFromUrl === 'function', 'Should have executeFromUrl method');
            assert(typeof NaginiCDN.getSupportedBackends === 'function', 'Should have getSupportedBackends method');
            assert(typeof NaginiCDN.isBackendSupported === 'function', 'Should have isBackendSupported method');
            
            // Test that we can check supported backends
            const backends = NaginiCDN.getSupportedBackends();
            assert(Array.isArray(backends), 'getSupportedBackends should return an array');
            assert(backends.includes('pyodide'), 'Should support pyodide backend');
            assert(backends.includes('brython'), 'Should support brython backend');
            
            // Test backend support check
            assert(NaginiCDN.isBackendSupported('pyodide') === true, 'pyodide should be supported');
            assert(NaginiCDN.isBackendSupported('invalid') === false, 'invalid backend should not be supported');
            
            console.log(`✅ CDN version ${version} loaded successfully with all expected methods`);
            console.log(`   Supported backends: ${backends.join(', ')}`);
            
            // Note: We're not testing actual manager creation because that would require
            // all dependencies (worker files, pyodide files, etc.) to be available via CDN
            console.log('Note: Full manager creation test skipped - would require complete CDN setup');
            
            logTestPass(testName);
        } catch (error) {
            console.error(`❌ Failed to test CDN version ${version}:`, error);
            logTestFail(testName, error);
            throw error;
        }
    }
    
    /**
     * Test that all expected files are accessible via CDN
     * @param {string} version - The version tag to test (e.g., 'v0.0.17')
     * @returns {Promise<void>}
     */
    static async test3CheckCDNFiles(version = 'v0.0.17') {
        const testName = `checkCDNFiles(${version})`;
        const className = 'CDNVersion';
        logTestStart(className, testName);
        
        try {
            const baseUrl = `https://cdn.jsdelivr.net/gh/pointcarre-app/nagini@${version}`;
            const filesToCheck = [
                '/src/nagini.js',
                '/src/pyodide/worker/worker-dist.js',
                '/src/pyodide/manager/manager.js',
                '/src/brython/manager/manager.js',
                '/src/utils/validation.js'
            ];
            
            console.log(`Checking availability of key files from CDN for version ${version}...`);
            
            const checkPromises = filesToCheck.map(async (file) => {
                const url = baseUrl + file;
                try {
                    const response = await fetch(url, { method: 'HEAD' });
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    console.log(`  ✓ ${file} - Available`);
                    return { file, success: true };
                } catch (error) {
                    console.log(`  ✗ ${file} - Not available (${error.message})`);
                    return { file, success: false, error: error.message };
                }
            });
            
            const results = await Promise.all(checkPromises);
            const failures = results.filter(r => !r.success);
            
            if (failures.length > 0) {
                throw new Error(`${failures.length} files not accessible via CDN: ${failures.map(f => f.file).join(', ')}`);
            }
            
            console.log(`✅ All ${filesToCheck.length} key files are accessible via CDN for version ${version}`);
            
            logTestPass(testName);
        } catch (error) {
            console.error(`❌ CDN file availability check failed for version ${version}:`, error);
            logTestFail(testName, error);
            throw error;
        }
    }
}