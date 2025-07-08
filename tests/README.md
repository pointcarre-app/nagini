# Simple Nagini Tests

Basic tests to verify Nagini works with Flask apps.

## Files

- `flask-test.html` - Simple HTML test page
- `flask-example.py` - Complete Flask app example

## How to run

1. **Start Nagini server:**
   ```bash
   python3 serve.py
   ```

2. **Test the HTML page:**
   ```bash
   open http://localhost:8010/tests/flask-test.html
   ```

3. **Test with Flask:**
   ```bash
   python3 tests/flask-example.py
   open http://localhost:5000
   ```

That's it. Simple. 