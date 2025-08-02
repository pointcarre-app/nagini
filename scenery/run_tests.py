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
import os


def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("", 0))
        return s.getsockname()[1]


def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(("localhost", port)) == 0


def run_scenery_tests():
    server_process = None
    driver = None
    port = find_free_port()
    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    try:
        # Start the server if the port is not in use
        if not is_port_in_use(port):
            server_process = subprocess.Popen(["python", "serve.py", str(port)], cwd=project_root)
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

        if failures:
            print("❌ Programmatic tests failed:")
            for f in failures:
                print(f"  - {f['className']} - {f['testName']}: {f['error']}")
            return False

        print("\n✅ All programmatic scenery tests passed!")
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
