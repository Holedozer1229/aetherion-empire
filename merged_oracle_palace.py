#!/usr/bin/env python3
"""
🏯 THE ULTIMATE MERGED STACK — LTC STRIKE HUB
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
            .btn { color: #000; background: #d4af37; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px; display: inline-block; transition: 0.3s; border: none; cursor: pointer; }
            .btn:hover { background: #fff; }
            .ltc-btn { background: #345d9d; color: white; }
        </style>
    </head>
    <body>
        <h1>🏯 Aetherion Empire</h1>
        <div class=\"status\">
            <p>SYSTEM STATUS: <b>LIVE</b></p>
            <p>LTC STRIKE: ARMED</p>
        </div>
        <br><br>
        <a href=\"/api/payout/ltc-strike\" class=\"btn ltc-btn\">📡 Execute 124 LTC Sweep</a>
        <a href=\"/api/payout/btc-jackpot\" class=\"btn\">💰 BTC Jackpot</a>
    </body>
    </html>
    """)

@app.route('/api/payout/ltc-strike')
def ltc_sweep():
    try:
        res = subprocess.run(["python3", "ltc_sweeper.py"], capture_output=True, text=True)
        return jsonify({"status": "LTC Strike Sequence Initiated", "log": res.stdout, "error": res.stderr})
    except Exception as e: return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 6060))
    app.run(host='0.0.0.0', port=port, debug=False)