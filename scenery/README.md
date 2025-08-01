# Scenery - Test Suite Documentation

This directory contains the comprehensive test suite for Nagini, including programmatic unit/integration tests and a Selenium-based harness for validating the UI and end-to-end functionality.

## Automated Testing with Selenium

The test suite includes a robust, automated testing script (`run_tests.py`) that uses Selenium and Chrome to verify the application's behavior in a real browser environment.

### Setup

To run the tests, you must first set up a dedicated Python virtual environment.

1.  **Navigate to the `scenery` directory**:
    ```bash
    cd scenery
    ```

2.  **Create the virtual environment**:
    This project is configured to use Python 3.12.
    ```bash
    python3.12 -m venv env
    ```

3.  **Activate the environment**:
    ```bash
    source env/bin/activate
    ```

4.  **Install dependencies**:
    All required packages, including Selenium, webdriver-manager, and BeautifulSoup4, are listed in `requirements.txt`.
    ```bash
    pip install -r requirements.txt
    ```

### Running the Tests Manually

Once the setup is complete, you can run the full test suite from the project's root directory with the following command:

```bash
# From the project root (pca-nagini/)
source scenery/env/bin/activate && python scenery/run_tests.py
```

The script will:
1.  Start the local web server on port `8010`.
2.  Launch a headless Chrome browser.
3.  Navigate to the `scenery/index.html` test page.
4.  Wait for all programmatic tests to complete.
5.  Parse the HTML to extract test results and their `data-main_critic` attributes.
6.  Generate a JSON report of the test outcomes.
7.  Print the results to the console and exit with a non-zero status code if any failures are found.

## Test Result Artifacts (`critics/` directory)

The test suite is designed to produce a JSON report for each run, which is particularly useful for release validation.

-   **Location**: `scenery/critics/`
-   **Filename**: The JSON files are named after the git tag being pushed (e.g., `v0.0.11.json`).

### JSON Output Structure

Each test case produces a JSON object with the following structure:

```json
[
  {
    "className": "FailureTests",
    "testName": "testFlop()",
    "status": "fail",
    "error": "Error: ASSERTION FAILED: ...",
    "timestamp": "2025-08-01T20:00:00.000Z",
    "main_critic": "flop"
  },
  {
    "className": "FailureTests",
    "testName": "testGlitch()",
    "status": "fail",
    "error": "PythonError: ModuleNotFoundError: ...",
    "timestamp": "2025-08-01T20:00:01.000Z",
    "main_critic": "glitch"
  },
  {
    "className": "NaginiTests",
    "testName": "createManager(...)",
    "status": "pass",
    "error": null,
    "timestamp": "2025-08-01T20:00:02.000Z",
    "main_critic": "wrapp"
  }
]
```

### `data-main_critic` Attribute

This attribute is added to each test row (`<tr>`) in the HTML and captured in the JSON. It provides a quick, semantic overview of the test outcome:

-   `"main_critic": "wrapp"`: The test passed successfully.
-   `"main_critic": "flop"`: The test failed because of an assertion error. The code ran, but produced the wrong result.
-   `"main_critic": "glitch"`: The test failed because of a runtime error (e.g., a crash, timeout, or Python exception). The test could not be properly executed.

## Git `pre-push` Hook

The repository is configured with a `pre-push` hook that automatically runs this Selenium test suite whenever you attempt to push a new tag.

-   If any test has a `main_critic` value of `"flop"` or `"glitch"`, the hook will fail and the push will be aborted.
-   This ensures that no release can be tagged if the test suite is not passing. 