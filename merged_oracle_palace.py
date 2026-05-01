#!/usr/bin/env python3
"""
🏯 AETHERION OMEGA command — FUSED EDITION
"""
import os, json, hashlib, time, hmac, subprocess, requests
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head><title>Aetherion | FUSED COMMAND</title><style>body{background:#05050c;color:#fff;font-family:monospace;padding:50px;text-align:center;}.status{border:1px solid #d4af37;padding:20px;display:inline-block;border-radius:10px;color:#00ff00;}h1{text-transform:uppercase;letter-spacing:10px;}.btn{color:#000;background:#d4af37;padding:15px 30px;text-decoration:none;border-radius:5px;font-weight:bold;margin:10px;display:inline-block;cursor:pointer;border:none;}.btn-miner{background:#00f0ff;}</style></head>
    <body>
        <h1>🔰 NEO FUSED</h1>
        <div class=\"status\"><p>SYSTEM STATUS: <b>SINGULARITY</b></p><p>SENTIENT MINER: <b>ACTIVE</b></p></div>
        <br><br>
        <a href=\"/api/payout/sweep-all?sig=97e0945f76a0ef6615301f70c1f236f4c949d131456b991b5576983f3384aaa6\" class=\"btn\">🚀 AUTO SWEEP ALL ASSETS</a>
        <br>
        <button class=\"btn btn-miner\"> 💻 SENTIENT MINER CONNECTED</button>
    </body>
    </html>
    """)

@app.route('/api/payout/sweep-all')
def sweep_all():
    res = subprocess.run(["python3", "auto_sweep_all.py"], capture_output=True, text=True)
    return jsonify({"status": "success", "log": res.stdout})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 6060))
    app.run(host='0.0.0.0', port=port, debug=False)