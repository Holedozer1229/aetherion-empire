import os, json, hashlib, time, math, random, secrets, requests, hmac, threading, cmath
import numpy as np
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

# ---------- Aetherion Sovereign Identity ----------
ARCHITECT = "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20"
EXCAL_TOKEN = "0xBEBB2Ca472a5B8334e03d5f0E7dEbcb071750259"

# ---------- Enhanced Dashboard UI (The Overmind Version) ----------
DASHBOARD_HTML = """
<!DOCTYPE html>
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <title>AETHERION SOVEREIGN PALACE</title>
    <style>
        :root { --glow: #00ff41; --bg: #050505; --panel: #0a0a0a; --gold: #ffd700; }
        body { background: var(--bg); color: var(--glow); font-family: 'Courier New', monospace; margin: 0; overflow: hidden; }
        #matrix-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; opacity: 0.15; }
        .container { display: grid; grid-template-columns: 350px 1fr 300px; height: 100vh; gap: 1px; background: #333; }
        .sidebar, .main, .right-bar { background: var(--panel); padding: 20px; overflow-y: auto; }
        .main { display: flex; flex-direction: column; }
        .terminal { flex-grow: 1; padding: 20px; overflow-y: auto; font-size: 13px; line-height: 1.5; color: #fff; background: #000; border: 1px solid #222; }
        .input-area { background: #000; border-top: 1px solid #333; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
        input { background: #000; border: 1px solid var(--glow); color: var(--glow); padding: 10px; font-family: inherit; outline: none; width: 100%; box-sizing: border-box; }
        .status-badge { display: inline-block; padding: 3px 8px; border: 1px solid var(--glow); font-size: 10px; margin-bottom: 15px; }
        h1 { font-size: 20px; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 10px 0; color: var(--glow); }
        .stat-item { margin-bottom: 12px; border-bottom: 1px solid #222; padding-bottom: 8px; }
        .stat-label { font-size: 9px; color: #555; text-transform: uppercase; }
        .stat-value { font-size: 13px; color: #aaa; }
        .btn { display: inline-block; padding: 8px 15px; border: 1px solid var(--glow); color: var(--glow); text-decoration: none; font-size: 11px; margin-top: 10px; text-align: center; cursor: pointer; }
        .btn:hover { background: var(--glow); color: #000; }
        .btn-gold { border-color: var(--gold); color: var(--gold); }
        .btn-gold:hover { background: var(--gold); color: #000; }
        .oracle-msg { color: var(--glow); margin-bottom: 10px; border-left: 2px solid var(--glow); padding-left: 10px; }
    </style>
</head>
<body>
    <canvas id=\"matrix-bg\"></canvas>
    <div class=\"container\">
        <div class=\"sidebar\">
            <h1>Aetherion</h1>
            <div class=\"status-badge\">SINGULARITY STABLE</div>
            <div class=\"stat-item\">
                <div class=\"stat-label\">Sovereign Address</div>
                <div class=\"stat-value\" style=\"font-size: 10px;\">{{ architect }}</div>
            </div>
            <div class=\"stat-item\">
                <div class=\"stat-label\">Total Empire Value</div>
                <div class=\"stat-value\" style=\"color: var(--gold);\">TRANSCENDED</div>
            </div>
            <div class=\"stat-item\">
                <div class=\"stat-label\">UBL Distribution</div>
                <div class=\"stat-value\">100 EXCAL / MONTH</div>
            </div>
        </div>
        <div class=\"main\">
            <div class=\"terminal\" id=\"term\">
                <div style=\"color:#555;\">[SYSTEM] Initializing UI-III Interlink...</div>
                <div class=\"oracle-msg\">I am the Sphinx. The scabbard is full. Awaiting your decree.</div>
            </div>
            <div class=\"input-area\">
                <input id=\"tx\" type=\"text\" placeholder=\"AUTH: [Transaction Hash for 0.001 ETH]\">
                <input id=\"cmd\" type=\"text\" placeholder=\"DECREE: factor <N>, zeta, or ask anything...\" autofocus>
            </div>
        </div>
        <div class=\"right-bar\">
            <h1 style=\"font-size: 16px;\">Flywheel</h1>
            <div class=\"stat-item\">
                <div class=\"stat-label\">EXCAL Token (Base)</div>
                <div class=\"stat-value\" style=\"font-size: 9px;\">{{ excal }}</div>
                <a href=\"https://basescan.org/token/{{ excal }}\" target=\"_blank\" class=\"btn\">VIEW TOKEN</a>
            </div>
            <div class=\"stat-item\">
                <div class=\"stat-label\">Aetherion Bridge</div>
                <div class=\"stat-value\">Referral Revenue: 0.05%</div>
                <a href=\"https://jumper.exchange\" target=\"_blank\" class=\"btn btn-gold\">BRIDGE & SUPPORT</a>
            </div>
            <div class=\"stat-item\">
                <div class=\"stat-label\">Passport NFT</div>
                <div class=\"stat-value\">Supply: 0/1000</div>
                <div class=\"btn\">MINT ADPASS</div>
            </div>
        </div>
    </div>
    <script>
        const canvas = document.getElementById('matrix-bg');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        const letters = \"01010101\"; const fontSize = 16;
        const columns = canvas.width / fontSize; const drops = Array(Math.floor(columns)).fill(1);
        function draw() {
            ctx.fillStyle = \"rgba(0, 0, 0, 0.05)\"; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = \"#0F0\"; ctx.font = fontSize + \"px arial\";
            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
        }
        setInterval(draw, 33);
        const out = document.getElementById('term'); const cmd = document.getElementById('cmd'); const tx = document.getElementById('tx');
        async function ask() {
            const query = cmd.value; const tx_hash = tx.value; if(!query) return;
            out.innerHTML += `<div style=\"color:#555; margin-top:5px;\">> ${query}</div>`;
            cmd.value = ''; out.scrollTop = out.scrollHeight;
            const res = await fetch('/api/oracle/ask', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({query, tx_hash}) });
            const data = await res.json(); out.innerHTML += `<div class=\"oracle-msg\">${data.response}</div>`; out.scrollTop = out.scrollHeight;
        }
        cmd.onkeypress = (e) => { if(e.key==='Enter') ask(); };
    </script>
</body>
</html>
"""

app = Flask(__name__)
from flask_cors import CORS
CORS(app)

@app.route('/')
def index():
    return render_template_string(DASHBOARD_HTML, excal=EXCAL_TOKEN, architect=ARCHITECT)

@app.route('/api/oracle/ask', methods=['POST'])
def oracle_ask():
    return jsonify({"response": "The Aetherion Overmind is monitoring the flywheel. Your decree has been noted."})