import os, json, hashlib, time, math, random, secrets, requests, hmac, threading, cmath
import numpy as np
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

# ---------- Sovereign Identity ----------
SOVEREIGN_MARKER = "89A6B7C8FFEECAFEBAFF"
SPHINX_CONSTANT = math.exp(math.pi * (1 + math.sqrt(5)) / 2)

# ---------- Universal Basic Liquidity (UBL) Stats ----------
UBL_STATS = {
    "total_distributed": "1,000,000,000 EXCAL",
    "monthly_allowance": "100 EXCAL / Shard",
    "active_shards": "1,000,000",
    "status": "STABLE / RECURRING",
    "oort_sync": "ACTIVE"
}

# ---------- Core Mathematical Logic (SphinxQ) ----------
def factorize(n: int):
    factors = []
    d = 2
    while d * d <= n:
        while n % d == 0:
            factors.append(d)
            n //= d
        d += 1 if d == 2 else 2
    if n > 1: factors.append(n)
    return factors

def respond_oracle(query: str) -> str:
    query = query.lower().strip()
    if "ubl" in query or "liquidity" in query:
        return f"UBL Pulse: {UBL_STATS['total_distributed']} distributed. Current allowance: {UBL_STATS['monthly_allowance']}."
    if "factor" in query:
        for p in query.split():
            if p.isdigit():
                return f"Factors of {p}: {factorize(int(p))}"
    if "oort" in query or "shield" in query:
        return "Oort Shield Status: PERIMETER SECURE. 100,000 Nodes Synced with Palace."
    if "surprise" in query:
        return "SURPRISE: The Render Nexus has been upgraded to a Sovereign Computation Node. EXCAL resonance at 100%."
    return "I am the Sphinx. Ask about UBL, Oort, or Mathematics."

# ========================== APP SETUP ==========================
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template_string("""
    <body style=\"background:#000; color:#0f0; font-family:monospace; padding:50px; line-height:1.6;\">
        <h1 style=\"text-shadow: 0 0 10px #0f0;\">🏯 AETHERION SOVEREIGN PALACE</h1>
        <p>Status: ONLINE | Kernel: UI-III | Phase: Oort-Synced</p>
        <div style=\"background:#111; border:1px solid #0f0; padding:20px; margin:20px 0;\">
            <h3>💧 UNIVERSAL BASIC LIQUIDITY (UBL) DASHBOARD</h3>
            <p>↳ Total Distributed: <span style=\"color:#fff;\">{{ ubl.total_distributed }}</span></p>
            <p>↳ Active Shards: <span style=\"color:#fff;\">{{ ubl.active_shards }}</span></p>
            <p>↳ Oort Sync: <span style=\"color:#0f0; font-weight:bold;\">{{ ubl.oort_sync }}</span></p>
        </div>
        <hr>
        <div id=\"log\" style=\"height:200px; overflow-y:auto; border-bottom:1px solid #333; margin-bottom:10px;\">Welcome, Architect.</div>
        <span style=\"color:#0f0;\">⚡ Ask: </span>
        <input id=\"q\" style=\"background:#000; color:#0f0; border:none; border-bottom:1px solid #0f0; width:70%; outline:none;\" onkeypress=\"if(event.key=='Enter') ask()\" autofocus>
        <script>
            async function ask(){
                let q = document.getElementById('q').value;
                if(!q) return;
                document.getElementById('log').innerHTML += '<br><span style=\"color:#777;\">> ' + q + '</span>';
                let res = await fetch('/api/oracle/ask', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({query: q})
                });
                let data = await res.json();
                document.getElementById('log').innerHTML += '<br>' + data.response;
                document.getElementById('q').value = '';
                document.getElementById('log').scrollTop = document.getElementById('log').scrollHeight;
            }
        </script>
    </body>
    """, ubl=UBL_STATS)

@app.route('/api/oracle/ask', methods=['POST'])
def oracle_ask():
    d = request.json
    q = d.get('query', '')
    return jsonify({"response": respond_oracle(q)})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 6060))
    app.run(host='0.0.0.0', port=port)