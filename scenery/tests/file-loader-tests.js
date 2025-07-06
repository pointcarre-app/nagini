import {
    assert,
    assertEquals,
    assertContains,
    logTestStart,
    logTestPass,
    logTestFail
} from './test-utils.js';
import { PyodideFileLoader } from '../../src/pyodide/file-loader/file-loader.js';

export class FileLoaderTests {
    static async test14LoadFilesAndImport(manager, filesToLoad) {
        const testName = "loadFiles and import";
        logTestStart("PyodideFileLoader", testName);

        try {
            // Load files using the new FS proxy methods
            for (const file of filesToLoad) {
                const response = await fetch(file.url);
                const content = await response.text();

                // Create directory if needed
                const dir = file.path.split('/').slice(0, -1).join('/');
                if (dir) {
                    try {
                        await manager.fs("mkdir", { path: dir });
                    } catch (e) {
                        // Directory might already exist, that's OK
                    }
                }

                // Write file
                await manager.fs("writeFile", { path: file.path, content: content });
            }

            // Test the import
            const result = await manager.executeAsync("file_loader_test.py", `
from teachers.maths import MathsObject
print(f"MathsObject imported successfully: {MathsObject}")
missive({
    "MathsObject_dir": dir(MathsObject),
    "MathsObject_type": str(type(MathsObject))
})
`);

            assert(!result.error, "Import should not have errors");
            assertContains(result.stdout, "MathsObject imported successfully", "Should import MathsObject");
            assert(result.missive, "Should have missive data");
            assert(result.missive.MathsObject_dir, "Should have MathsObject_dir in missive");
            assert(Array.isArray(result.missive.MathsObject_dir), "MathsObject_dir should be an array");
            assert(result.missive.MathsObject_dir.length > 0, "MathsObject_dir should not be empty");
            assertContains(result.missive.MathsObject_type, "class", "MathsObject should be a class");

            logTestPass(testName);
            return { result, testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async test2FileLoaderRetryLogic(manager) {
        const testName = "PyodideFileLoader retry logic";
        logTestStart("PyodideFileLoader", testName);

        try {
            // Test basic filesystem operations
            const testContent = "print('Hello from file loader test')";
            const testPath = "test_loader.py";

            // Write a simple test file
            await manager.fs("writeFile", { path: testPath, content: testContent });

            // Verify file exists
            const exists = await manager.fs("exists", { path: testPath });
            assert(exists, "File should exist after writing");

            // Test directory operations
            await manager.fs("mkdir", { path: "test_dir" });
            const dirExists = await manager.fs("exists", { path: "test_dir" });
            assert(dirExists, "Directory should exist after creation");

            // Test file listing
            const files = await manager.fs("listdir", { path: "/" });
            assert(Array.isArray(files), "Should return an array of files");
            assert(files.length > 0, "Should have at least some files");

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }

    static async test3FileLoaderErrorHandling(manager) {
        const testName = "PyodideFileLoader error handling";
        logTestStart("PyodideFileLoader", testName);

        try {
            // Test filesystem error handling - reading non-existent file
            let fsErrorThrown = false;
            try {
                await manager.fs("readFile", { path: "definitely-non-existent-file.py" });
            } catch (error) {
                fsErrorThrown = true;
                assert(error.message.includes("error"), "Should throw filesystem error");
            }
            assert(fsErrorThrown, "Should throw error for non-existent file");

            // Test filesystem error handling - reading from non-existent directory
            let dirErrorThrown = false;
            try {
                await manager.fs("listdir", { path: "definitely-non-existent-directory" });
            } catch (error) {
                dirErrorThrown = true;
                assert(error.message.includes("error"), "Should throw directory error");
            }
            assert(dirErrorThrown, "Should throw error for non-existent directory");

            // Test Python import error handling
            const result = await manager.executeAsync("test_import_error", `
try:
    from non_existent_module import NonExistentClass
    import_success = True
    error_message = None
except ImportError as e:
    import_success = False
    error_message = str(e)

print(f"Import success: {import_success}")
print(f"Error message: {error_message}")
missive({
    "import_success": import_success,
    "error_occurred": not import_success,
    "error_message": error_message
})
`);

            assert(!result.error, "Python execution should work even with import errors");
            assert(!result.missive.import_success, "Import should fail for non-existent module");
            assert(result.missive.error_occurred, "Error should be caught");
            assert(result.missive.error_message, "Error message should be captured");
            assertContains(result.missive.error_message, "No module named", "Should contain import error message");

            logTestPass(testName);
            return { testName };
        } catch (error) {
            logTestFail(testName, error);
            throw error;
        }
    }
}
