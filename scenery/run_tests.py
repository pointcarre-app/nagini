import time
import subprocess
import socket
import json
import sys
import traceback
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait


def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(("localhost", port)) == 0


def run_scenery_tests():
    server_process = None
    driver = None
    port = 8010
    try:
        # Start the server if the port is not in use
        if not is_port_in_use(port):
            server_process = subprocess.Popen(["python", "../serve.py", str(port)])
            time.sleep(2)  # Give the server a moment to start
        else:
            print(f"✅ Server already running on port {port}")

        # Set up Selenium WebDriver
        options = webdriver.ChromeOptions()
        options.add_argument("--headless")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        driver = webdriver.Chrome(
            service=ChromeService(ChromeDriverManager().install()), options=options
        )

        # Open the test page
        driver.get(f"http://localhost:{port}/scenery/index.html")

        # Programmatic tests (check JSON output)
        print("Running programmatic tests...")
        WebDriverWait(driver, 30).until(
            lambda d: d.find_element(By.ID, "test-results-json")
            .get_attribute("textContent")
            .strip()
        )
        results_json = driver.find_element(By.ID, "test-results-json").get_attribute("textContent")
        results = json.loads(results_json)
        if len(sys.argv) > 1:
            output_path = sys.argv[1]
            with open(output_path, "w") as f:
                json.dump(results, f, indent=2)
            print(f"✅ Programmatic test results saved to {output_path}")

        # Validate the test outcomes
        failures = [r for r in results if r["status"] == "fail"]

        expected_failures = ["testFlop()", "testGlitch()"]
        actual_failure_names = {f["testName"] for f in failures}

        unexpected_failures = [f for f in failures if f["testName"] not in expected_failures]

        flop_failed = "testFlop()" in actual_failure_names
        glitch_failed = "testGlitch()" in actual_failure_names

        if unexpected_failures:
            print("❌ UNEXPECTED FAILURES FOUND:")
            for f in unexpected_failures:
                print(f"  - {f['className']} - {f['testName']}: {f['error']}")
            return False

        if not flop_failed:
            print("❌ VALIDATION FAILED: The 'flop' test was expected to fail, but it passed.")
            return False

        if not glitch_failed:
            print("❌ VALIDATION FAILED: The 'glitch' test was expected to fail, but it passed.")
            return False

        print("\n✅ All tests behaved as expected.")
        print("   - 'flop' test failed as intended (assertion error).")
        print("   - 'glitch' test failed as intended (runtime error).")
        print("   - All other tests passed.")
        return True

    except Exception:
        print("❌ A critical error occurred in the test runner:")
        traceback.print_exc()
        if driver:
            print("\nPage Source at time of failure:")
            print(driver.page_source)
        return False
    finally:
        if driver:
            driver.quit()
        if server_process:
            server_process.kill()
            server_process.wait()


if __name__ == "__main__":
    if not run_scenery_tests():
        exit(1)
