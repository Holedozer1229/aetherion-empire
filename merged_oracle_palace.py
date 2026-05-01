#!/usr/bin/env python3
"""
🏯 AETHERION EMPIRE HUB — Mainnet Edition
"""

import os, json, hashlib, time, math, random, secrets, requests, hmac
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Aetherion Command Center</title>
        <style>
            body { background: #0b0c0e; color: #d4af37; font-family: 'Courier New', monospace; padding: 50px; text-align: center; }
            .status { color: #00ff00; border: 1px solid #d4af37; padding: 20px; display: inline-block; border-radius: 10px; }
            h1 { text-transform: uppercase; letter-spacing: 5px; }
            .btn { color: #000; background: #d4af37; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 30px; display: inline-block; }
        </style>
    </head>
    <body>
        <h1>🏯 Aetherion Empire</h1>
        <div class="status">
            <p>SYSTEM STATUS: <b>ACTIVE</b></p>
            <p>NETWORK: MAINNET</p>
            <p>CHAINED SWEEP: READY</p>
        </div>
        <br>
        <a href="/api/payout/chained-sweep" class="btn">🔗 Execute Chained Sweep (Vault ➔ Primary)</a>
    </body>
    </html>
    """)

@app.route('/api/payout/chained-sweep')
def execute_chained_sweep():
    print("📡 [MAINNET] Initializing Chained Sweep...")
    try:
        # Run the chained sweep logic
        result = subprocess.run(["python3", "chained_sweep.py"], capture_output=True, text=True)
        return jsonify({
            "status": "Chained Sweep Complete",
            "log": result.stdout,
            "error": result.stderr
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 6060))
    app.run(host='0.0.0.0', port=port, debug=False)