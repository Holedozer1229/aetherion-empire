import os, json, hashlib, time, math, random, secrets, requests, hmac, threading, cmath
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

# ---------- Sovereign Identity ----------
ARCHITECT = "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20"
EXCAL_TOKEN = "0xBEBB2Ca472a5B8334e03d5f0E7dEbcb071750259"
OMEGA_HASH = "0x76ee5dac574d82cff12f8059a13fb059457bea7090df90616a6b3bf5d67cf4c1"

# ---------- EXCAL Portal UI ----------
PORTAL_HTML = """
<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <title>EXCAL PORTAL | AETHERION</title>
    <style>
        :root { --gold: #ffd700; --glow: #00ff41; --bg: #000; }
        body { background: var(--bg); color: var(--glow); font-family: 'Courier New', monospace; margin: 0; display: flex; flex-direction: column; align-items: center; min-height: 100vh; text-align: center; }
        .header { margin-top: 50px; text-shadow: 0 0 20px var(--glow); letter-spacing: 10px; font-size: 32px; }
        .omega { font-size: 10px; color: #555; margin-top: 10px; cursor: pointer; }
        .portal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; width: 90%; max-width: 1000px; margin-top: 50px; }
        .card { background: #0a0a0a; border: 1px solid #333; padding: 25px; transition: 0.3s; position: relative; overflow: hidden; }
        .card:hover { border-color: var(--glow); box-shadow: 0 0 15px rgba(0, 255, 65, 0.2); }
        .label { font-size: 10px; color: #777; text-transform: uppercase; margin-bottom: 10px; }
        .value { font-size: 16px; color: #fff; }
        .btn { display: inline-block; margin-top: 20px; padding: 10px 20px; border: 1px solid var(--glow); color: var(--glow); text-decoration: none; font-size: 12px; transition: 0.3s; }
        .btn:hover { background: var(--glow); color: #000; }
        .pulse { animation: pulse-animation 2s infinite; }
        @keyframes pulse-animation { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
    </style>
</head>
<body>
    <div class=\"header pulse\">EXCAL PORTAL</div>
    <div class=\"omega\" title=\"Sovereign DNA\">OMEGA_HASH: {{ omega }}</div>
    
    <div class=\"portal-grid\">
        <div class=\"card\">
            <div class=\"label\">Sovereign Standard</div>
            <div class=\"value\">EXCALIBUR ($EXCAL)</div>
            <div class=\"value\" style=\"font-size: 10px; margin-top: 10px;\">{{ excal }}</div>
            <a href=\"https://basescan.org/token/{{ excal }}\" target=\"_blank\" class=\"btn\">VIEW LEDGER</a>
        </div>
        
        <div class=\"card\">
            <div class=\"label\">Universal Liquidity</div>
            <div class=\"value\">100 EXCAL / SHARD</div>
            <div class=\"value\" style=\"color: #0f0; margin-top: 10px;\">Status: DISTRIBUTING</div>
            <div class=\"btn\">CLAIM SHARD</div>
        </div>

        <div class=\"card\">
            <div class=\"label\">Sovereign Anchor</div>
            <div class=\"value\">Architect: Satoshi v2.0</div>
            <div class=\"value\" style=\"font-size: 10px; margin-top: 10px;\">{{ architect }}</div>
            <div class=\"btn\">MINT PASSPORT</div>
        </div>
    </div>

    <div style=\"margin-top: 50px; color: #333; font-size: 12px; font-style: italic;\">
        \"The simulation is dead. The reality is yours.\"
    </div>
</body>
</html>
"""

app = Flask(__name__)
CORS(app)

@app.route('/')
def portal():
    return render_template_string(PORTAL_HTML, excal=EXCAL_TOKEN, architect=ARCHITECT, omega=OMEGA_HASH)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 6060))
    app.run(host="0.0.0.0", port=port)