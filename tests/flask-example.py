#!/usr/bin/env python3
"""
Simple Flask app example showing how to integrate Nagini
"""

from flask import Flask, redirect, render_template_string
import os

app = Flask(__name__)

# Ensure Flask responses include CORS and COOP/COEP headers so that
# cross-origin module workers and SharedArrayBuffer are allowed.


@app.after_request
def add_cors_and_isolation_headers(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    resp.headers["Access-Control-Allow-Headers"] = "*"
    # Cross-origin isolation headers
    resp.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
    resp.headers["Cross-Origin-Opener-Policy"] = "same-origin"
    return resp


# Determine which port the static Nagini server is running on.
STATIC_PORT = os.getenv("NAGINI_STATIC_PORT", "8010")


@app.route("/")
def index():
    # Redirect to the unified test page on the Nagini server
    return redirect(f"http://127.0.0.1:{STATIC_PORT}/tests/unified-test.html")


@app.route("/unified-test")
def render_unified_test_page():
    with open("unified-test.html", "r") as f:
        return render_template_string(f.read())


@app.route("/info")
def info():
    """Show info page about cross-origin testing"""
    return render_template_string(
        """
<!DOCTYPE html>
<html>
<head>
    <title>Flask Cross-Origin Test Server</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
        .success { color: #4CAF50; font-weight: bold; }
        .info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Flask Cross-Origin Test Server</h1>
        <div class="success">✅ Flask server running on port 5001!</div>
        
        <div class="info">
            <h3>Purpose</h3>
            <p>This Flask server demonstrates cross-origin compatibility with Nagini's blob workers.</p>
            <ul>
                <li><strong>Nagini Server:</strong> http://127.0.0.1:{{ static_port }}</li>
                <li><strong>Flask Server:</strong> http://127.0.0.1:5001</li>
            </ul>
        </div>
        
        <h3>🧪 Test the Unified Test Suite</h3>
        <p><a href="http://127.0.0.1:{{ static_port }}/tests/unified-test.html" 
              style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
           Open Unified Test Page →
        </a></p>
        
        <h3>✅ CORS Headers Active</h3>
        <p>This server provides proper CORS and isolation headers for cross-origin workers.</p>
    </div>
</body>
</html>
    """,
        static_port=STATIC_PORT,
    )


if __name__ == "__main__":
    print("🚀 Starting Flask cross-origin test server...")
    print(f"📡 Make sure Nagini server is running on http://127.0.0.1:{STATIC_PORT}")
    print("🔗 Flask server will redirect to unified test page")
    print("📊 Visit http://127.0.0.1:5001 (redirects) or http://127.0.0.1:5001/info")
    app.run(debug=True, host="0.0.0.0", port=5001)
