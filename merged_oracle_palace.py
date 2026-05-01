#!/usr/bin/env python3
"""
🏯 AETHERION EMPIRE HUB — Multi-Chain Mainnet Edition
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
            .btc-btn { background: #f7931a; }
            .sol-btn { background: #9945ff; }
        </style>
    </head>
    <body>
        <h1>🏯 Aetherion Empire</h1>
        <div class=\"status\">
            <p>SYSTEM STATUS: <b>LIVE</b></p>
            <p>ASSETS: BTC / ETH / SOL</p>
        </div>
        <br><br>
        <a href=\"/api/payout/btc-jackpot\" class=\"btn btc-btn\">💰 Sweep BTC Jackpot (0.84 BTC)</a>
        <a href=\"/api/payout/chained-sweep\" class=\"btn sol-btn\">🔗 Execute Solana Sweep</a>
        <a href=\"/api/payout/fund-gas\" class=\"btn\">⛽ Fund ETH Gas</a>
    </body>
    </html>
    """)

@app.route('/api/payout/btc-jackpot')
def btc_sweep():
    try:
        res = subprocess.run(["python3", "btc_sweeper.py"], capture_output=True, text=True)
        return jsonify({"status": "BTC Sweep Sequence Initiated", "log": res.stdout, "error": res.stderr})
    except Exception as e: return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/payout/chained-sweep')
def sol_sweep():
    try:
        res = subprocess.run(["python3", "chained_sweep.py"], capture_output=True, text=True)
        return jsonify({"status": "Solana Sweep Sequence Initiated", "log": res.stdout, "error": res.stderr})
    except Exception as e: return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 6060))
    app.run(host='0.0.0.0', port=port, debug=False)