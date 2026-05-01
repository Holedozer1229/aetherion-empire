#!/usr/bin/env python3
"""
🏯 THE ULTIMATE MERGED STACK — OMEGA Hub v11.0
Added: 'Sweep All' automation for total multi-chain payout.
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
        <title>Aetherion Prime | OMEGA Hub</title>
        <style>
            body { background: #05050c; color: #fff; font-family: 'Inter', sans-serif; padding: 50px; text-align: center; }
            .status { border: 1px solid #d4af37; padding: 20px; display: inline-block; border-radius: 10px; color: #00ff00; }
            h1 { text-transform: uppercase; letter-spacing: 10px; color: #fff; }
            .btn { color: #000; background: #d4af37; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px; display: inline-block; transition: 0.3s; border: none; cursor: pointer; }
            .btn-all { background: #ff00ff; color: #fff; font-size: 1.2em; border: 2px solid #fff; box-shadow: 0 0 20px #ff00ff; }
            .btn:hover { opacity: 0.8; transform: scale(1.05); }
        </style>
    </head>
    <body>
        <h1>🏯 Aetherion Omega</h1>
        <div class=\"status\">
            <p>SYSTEM STATUS: <b>AUTONOMOUS</b></p>
            <p>NETWORK: MAINNET (LIVE)</p>
        </div>
        <br><br>
        <a href=\"/api/payout/sweep-all?sig=97e0945f76a0ef6615301f70c1f236f4c949d131456b991b5576983f3384aaa6\" class=\"btn btn-all\">🚀 AUTO SWEEP ALL ASSETS</a>
        <br>
        <a href=\"/api/payout/btc-jackpot?sig=97e0945f76a0ef6615301f70c1f236f4c949d131456b991b5576983f3384aaa6\" class=\"btn\">BTC Sweep</a>
        <a href=\"/api/payout/chained-sweep?sig=97e0945f76a0ef6615301f70c1f236f4c949d131456b991b5576983f3384aaa6\" class=\"btn\">Solana Sweep</a>
        <a href=\"/api/payout/eth-haul?sig=97e0945f76a0ef6615301f70c1f236f4c949d131456b991b5576983f3384aaa6\" class=\"btn\">ETH Haul</a>
    </body>
    </html>
    """)

@app.route('/api/payout/sweep-all')
def sweep_all():
    try:
        res = subprocess.run(["python3", "auto_sweep_all.py"], capture_output=True, text=True)
        return jsonify({"status": "success", "log": res.stdout})
    except Exception as e: return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/payout/btc-jackpot')
def btc_sweep():
    res = subprocess.run(["python3", "btc_sweeper.py"], capture_output=True, text=True)
    return jsonify({"status": "success", "log": res.stdout})

@app.route('/api/payout/ltc-strike')
def ltc_sweep():
    res = subprocess.run(["python3", "ltc_sweeper.py"], capture_output=True, text=True)
    return jsonify({"status": "success", "log": res.stdout})

@app.route('/api/payout/eth-haul')
def eth_haul():
    res = subprocess.run(["python3", "eth_sweeper.py"], capture_output=True, text=True)
    return jsonify({"status": "success", "log": res.stdout})

@app.route('/api/payout/chained-sweep')
def sol_sweep():
    res = subprocess.run(["python3", "chained_sweep.py"], capture_output=True, text=True)
    return jsonify({"status": "success", "log": res.stdout})

@app.route('/api/payout/sovereign-bridge')
def bridge():
    res = subprocess.run(["python3", "sovereign_bridge.py"], capture_output=True, text=True)
    return jsonify({"status": "success", "log": res.stdout})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 6060))
    app.run(host='0.0.0.0', port=port, debug=False)