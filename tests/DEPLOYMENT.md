# Two-Port Deployment Scenario

## Current Setup

### Port 8010: Nagini Server
- **Purpose**: Serves Nagini static files and assets
- **Command**: `python3 serve.py`
- **URL**: `http://localhost:8010`
- **Serves**:
  - `/src/nagini.js` - Main Nagini API
  - `/src/pyodide/worker/worker.js` - Web worker
  - `/src/pyodide/python/pyodide_init.py` - Python init script
  - `/tests/flask-test.html` - Simple test page

### Port 5001: Flask App
- **Purpose**: Your actual web application
- **Command**: `python3 tests/flask-example.py`
- **URL**: `http://localhost:5001`
- **Features**:
  - Imports Nagini from port 8010
  - Runs Python code in browser
  - Full Flask web app

## How It Works

1. **Flask app** (port 5001) serves your web pages
2. **Browser** loads Nagini from port 8010 using:
   ```javascript
   import { Nagini } from 'http://localhost:8010/src/nagini.js';
   ```
3. **Nagini** creates web workers that also load from port 8010
4. **Python code** executes in browser using Pyodide

## Test It

1. **Start Nagini server:**
   ```bash
   python3 serve.py
   # Running at http://localhost:8010
   ```

2. **Start Flask app:**
   ```bash
   python3 tests/flask-example.py
   # Running at http://localhost:5000
   ```

3. **Open Flask app:** `http://localhost:5001`
4. **Click "Run Python Code"** - it works!

## Production Deployment

- **Nagini server** can be any static file server (nginx, Apache, CDN)
- **Flask app** can be deployed anywhere (Heroku, AWS, etc.)
- Just update the import URLs to point to your Nagini server

That's it. Two ports, works perfectly. 