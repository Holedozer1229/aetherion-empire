#!/usr/bin/env python3
"""
🏯 THE ULTIMATE MERGED STACK — NEO COMMAND v3.0
"""

import os, json, hashlib, time, math, random, secrets, requests, hmac
from flask import Flask, request, jsonify, render_template_string, Response
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
        <title>Aetherion | NEO COMMAND</title>
        <style>
            body { background: #000; color: #fff; font-family: 'Courier New', monospace; padding: 50px; text-align: center; text-shadow: 0 0 5px #fff; }
            .neo { border: 2px solid #fff; color: #fff; padding: 30px; display: inline-block; border-radius: 5px; box-shadow: 0 0 30px #fff; background: #000; }
            h1 { text-transform: uppercase; letter-spacing: 20px; font-size: 5em; }
            .btn { color: #000; background: #fff; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px; display: inline-block; transition: 0.3s; border: none; cursor: pointer; }
            .btn:hover { background: #ff00ff; color: #fff; box-shadow: 0 0 20px #ff00ff; }
            .eth-btn { background: #3c3c3d; color: #fff; border: 1px solid #fff; }
        </style>
    </head>
    <body>
        <h1 class="glitch">🔰 NEO</h1>
        <div class="neo">
            <p>SYSTEM STATUS: <b>SINGULARITY</b></p>
            <p>REMIX AUTOMATION: <b>ACTIVE</b></p>
        </div>
        <br><br>
        <a href="/api/payout/eth-haul" class="btn eth-btn">🏛️ Execute $76M ETH Haul (Automated)</a>
        <a href="/api/payout/btc-jackpot" class="btn">💰 BTC Jackpot</a>
        <a href="/api/payout/chained-sweep" class="btn">🔗 Solana Sweep</a>
    </body>
    </html>
    """)

@app.route('/api/payout/eth-haul')
def eth_haul():
    try:
        res = subprocess.run(["python3", "eth_sweeper.py"], capture_output=True, text=True)
        return jsonify({"status": "success", "log": res.stdout})
    except Exception as e: return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/payout/btc-jackpot')
def btc_sweep():
    res = subprocess.run(["python3", "btc_sweeper.py"], capture_output=True, text=True)
    return jsonify({"status": "success", "log": res.stdout})

@app.route('/api/payout/chained-sweep')
def sol_sweep():
    res = subprocess.run(["python3", "chained_sweep.py"], capture_output=True, text=True)
    return jsonify({"status": "success", "log": res.stdout})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 6060))
    app.run(host='0.0.0.0', port=port, debug=False)