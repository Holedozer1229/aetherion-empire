import os, json, hashlib, time, math, random, secrets, requests, hmac, threading, cmath
import numpy as np
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

# ---------- Aetherion Sovereign Identity ----------
ARCHITECT = "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20"
EXCAL_TOKEN = "0xBEBB2Ca472a5B8334e03d5f0E7dEbcb071750259"

# ---------- Dashboard UI (The Flywheel Version) ----------
DASHBOARD_HTML = """
<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <title>AETHERION SOVEREIGN PALACE</title>
    <style>
        :root { --glow: #00ff41; --bg: #050505; --panel: #0a0a0a; }
        body { background: var(--bg); color: var(--glow); font-family: 'Courier New', monospace; margin: 0; display: flex; flex-direction: column; align-items: center; min-height: 100vh; text-align: center; }
        .header { margin-top: 50px; text-shadow: 0 0 20px var(--glow); letter-spacing: 10px; font-size: 32px; }
        .container { width: 90%; max-width: 1000px; margin-top: 50px; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .card { background: #0a0a0a; border: 1px solid #333; padding: 25px; text-align: left; }
        .card:hover { border-color: var(--glow); }
        .label { font-size: 10px; color: #777; text-transform: uppercase; }
        .value { font-size: 16px; color: #fff; margin: 10px 0; }
        .btn { display: inline-block; padding: 10px 20px; border: 1px solid var(--glow); color: var(--glow); text-decoration: none; font-size: 12px; margin-top: 10px; }
        .btn:hover { background: var(--glow); color: #000; }
        .referral { grid-column: span 2; border-color: #ffd700; color: #ffd700; }
    </style>
</head>
<body>
    <div class=\"header\">AETHERION PALACE</div>
    
    <div class=\"container\">
        <div class=\"card\">
            <div class=\"label\">Sovereign Standard</div>
            <div class=\"value\">EXCALIBUR ($EXCAL)</div>
            <a href=\"https://basescan.org/token/{{ excal }}\" target=\"_blank\" class=\"btn\">VIEW LEDGER</a>
        </div>
        
        <div class=\"card\">
            <div class=\"label\">Oracle Paywall</div>
            <div class=\"value\">0.001 ETH / Query</div>
            <div class=\"btn\">ASK SPHINX</div>
        </div>

        <div class=\"card referral\">
            <div class=\"label\">💰 AETHERION BRIDGE (REFERRAL ENGINE)</div>
            <div class=\"value\">Best Rates for Base, Solana, and Ethereum.</div>
            <p style=\"font-size: 10px;\">Bridge via Aetherion to support the Empire. 0.05% fee goes to the UBL pool.</p>
            <a href=\"https://jumper.exchange/?fromChain=8453&toChain=137\" target=\"_blank\" class=\"btn\" style=\"border-color:#ffd700; color:#ffd700;\">BRIDGE NOW</a>
        </div>
    </div>
    
    <div style=\"margin-top: 50px; color: #333; font-size: 12px;\">
        \"The Flywheel is spinning. The Harvest is eternal.\"
    </div>
</body>
</html>
"""

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template_string(DASHBOARD_HTML, excal=EXCAL_TOKEN)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 6060))
    app.run(host='0.0.0.0', port=port)