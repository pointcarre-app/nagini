/**
 * Interactive Functions for Scenery Test Suite
 *
 * Contains all interactive test functions that handle user input and matplotlib
 * visualization. These functions are used by the test UI for manual testing.
 */

/**
 * Initialize interactive manager
 * @returns {Promise<Object>} The initialized manager
 */
async function initInteractiveManager() {
    // Get manager from the global window object
    const manager = window.manager;
    if (!manager) {
        throw new Error(
            'Manager not initialized. Please run the tests first by refreshing the page.'
        );
    }
    if (!manager.isReady) {
        throw new Error(
            'Manager not ready. Please wait for tests to complete.'
        );
    }
    return manager;
}

/**
 * Execute input code from the input text area with interactive input handling
 * @returns {Promise<void>}
 */
async function executeInputCode() {
    const codeEditor = document.getElementById('input-code-editor');
    const output = document.getElementById('input-code-output');

    if (!codeEditor || !output) {
        console.error('Input code editor or output element not found');
        return;
    }

    const code = codeEditor.value;
    if (!code.trim()) {
        output.textContent = 'No code to execute';
        return;
    }

    try {
        // Initialize manager if needed
        const mgr = await initInteractiveManager();

        // Clear previous output and images
        output.textContent = 'Executing input code...\n';
        clearPreviousImages(output);

        // Set up input callback for interactive input
        mgr.setInputCallback(async (prompt) => {
            // Show the prompt in the output area
            output.textContent += '\n' + (prompt || 'Enter input:') + '\n';

            // Create input field and button
            const inputContainer = document.createElement('div');
            inputContainer.style.margin = '10px 0';

            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.placeholder = 'Type your input here...';
            inputField.style.padding = '5px';
            inputField.style.marginRight = '10px';
            inputField.style.width = '200px';

            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.style.padding = '5px 10px';

            inputContainer.appendChild(inputField);
            inputContainer.appendChild(submitButton);

            // Insert the input UI after the output
            output.parentNode.insertBefore(inputContainer, output.nextSibling);

            // Focus the input field
            inputField.focus();

            // Handle input submission
            const handleSubmit = () => {
                const userInput = inputField.value;

                // Display the input in the output
                output.textContent += '> ' + userInput + '\n';

                // Remove the input UI
                inputContainer.remove();

                // Provide the input back to Python
                mgr.provideInput(userInput);
            };

            // Submit on button click or Enter key
            submitButton.onclick = handleSubmit;
            inputField.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    handleSubmit();
                }
            };
        });

        // Execute the code
        const result = await mgr.executeAsync('interactive_input_code', code);

        // Display results
        if (result.stdout) {
            output.textContent += result.stdout;
        }
        if (result.stderr) {
            output.textContent += '\nERROR:\n' + result.stderr;
        }
        if (result.error) {
            output.textContent += '\nEXECUTION ERROR:\n' + result.error.message;
        }

        output.textContent += '\nInteractive code execution completed!';

    } catch (error) {
        console.error('Interactive input execution failed:', error);
        output.textContent = 'ERROR: ' + error.message;
    }
}

/**
 * Execute matplotlib code from the matplotlib text area with figure display
 * @returns {Promise<void>}
 */
async function executeMatplotlibCode() {
    const codeEditor = document.getElementById('matplotlib-code-editor');
    const output = document.getElementById('matplotlib-code-output');

    if (!codeEditor || !output) {
        console.error('Matplotlib code editor or output element not found');
        return;
    }

    const code = codeEditor.value;
    if (!code.trim()) {
        output.textContent = 'No code to execute';
        return;
    }

    try {
        // Initialize manager if needed
        const mgr = await initInteractiveManager();

        // Clear previous output and images
        output.textContent = 'Executing matplotlib code...\n';
        clearPreviousImages(output);

        // Execute the code
        const result = await mgr.executeAsync('interactive_matplotlib_code', code);

        // Display results
        if (result.stdout) {
            output.textContent += result.stdout;
        }
        if (result.stderr) {
            output.textContent += '\nERROR:\n' + result.stderr;
        }
        if (result.error) {
            output.textContent += '\nEXECUTION ERROR:\n' + result.error.message;
        }

        // Handle matplotlib figures
        if (result.figures && result.figures.length > 0) {
            output.textContent += '\nFigures captured: ' + result.figures.length + '\n';

            // Display each figure
            result.figures.forEach((figureBase64, index) => {
                // Create an image element
                const img = document.createElement('img');
                img.src = 'data:image/png;base64,' + figureBase64;
                img.style.maxWidth = '100%';
                img.style.border = '1px solid #ccc';
                img.style.margin = '10px 0';
                img.style.borderRadius = '5px';
                img.alt = `Figure ${index + 1}`;
                img.className = 'matplotlib-figure';

                // Add the image after the output
                output.parentNode.insertBefore(img, output.nextSibling);
            });

            output.textContent += 'Matplotlib figures displayed above!\n';
        } else {
            output.textContent += '\nNo figures were generated.\n';
        }

        output.textContent += '\nMatplotlib code execution completed!';

    } catch (error) {
        console.error('Interactive matplotlib execution failed:', error);
        output.textContent = 'ERROR: ' + error.message;
    }
}

/**
 * Helper function to clear previous images
 * @param {HTMLElement} outputElement - The output element to clear images from
 */
function clearPreviousImages(outputElement) {
    // Remove any existing matplotlib figures
    const existingImages = outputElement.parentNode.querySelectorAll('.matplotlib-figure');
    existingImages.forEach(img => img.remove());

    // Also remove any other images that might be next siblings
    let nextSibling = outputElement.nextSibling;
    while (nextSibling) {
        const toRemove = nextSibling;
        nextSibling = nextSibling.nextSibling;
        if (toRemove.tagName === 'IMG') {
            toRemove.remove();
        }
    }
}

// Make functions globally available for the interactive buttons
window.executeInputCode = executeInputCode;
window.executeMatplotlibCode = executeMatplotlibCode;

// Export for potential module usage
export { executeInputCode, executeMatplotlibCode, initInteractiveManager };
