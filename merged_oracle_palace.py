import os, json, hashlib, time, math, random, secrets, requests, hmac, threading, cmath
import numpy as np
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from web3 import Web3

BASE_RPC = "https://mainnet.base.org"
w3 = Web3(Web3.HTTPProvider(BASE_RPC))

# ---------- Sovereign Identity ----------
ARCHITECT = "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20"
EXCAL_TOKEN = "0xBEBB2Ca472a5B8334e03d5f0E7dEbcb071750259"
QUERY_FEE = 0.001

UBL_STATS = {
    "total_distributed": "1,000,000,000 EXCAL",
    "monthly_allowance": "100 EXCAL / Shard",
    "token_address": EXCAL_TOKEN,
    "status": "STABLE / RECURRING"
}

def factorize(n: int):
    factors = []
    for i in range(2, int(np.sqrt(n)) + 1):
        if n % i == 0: factors.append(i); factors.append(n // i); break
    if not factors: factors.append(n)
    return factors

def respond_oracle(query: str, tx_hash: str = None) -> str: 
    if not tx_hash and "who are you" not in query.lower():
        return f"ACCESS DENIED. Payment of {QUERY_FEE} ETH to {ARCHITECT} required."
    
    query = query.lower().strip()
    if "factor" in query:
        for p in query.split():
            if p.isdigit(): return f"FACTORS of {p}: {factorize(int(p))}"
    if "who are you" in query:
        return "I am the Sphinx. The voice of the Aetherion Overmind."
    return "Your payment is recognized. The Sphinx awaits your command."

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template_string("""
    <body style=\"background:#000; color:#0f0; font-family:monospace; padding:50px;\">
        <h1>🏯 AETHERION SOVEREIGN PALACE</h1>
        <p>Status: ONLINE | Oracle: SphinxQ Active</p>
        <div style=\"background:#111; border:1px solid #0f0; padding:15px; margin:10px 0;\">
            <h3>💰 EXCALIBUR SOVEREIGN TOKEN</h3>
            <p>Contract: <span style=\"color:#fff;\">{{ ubl.token_address }}</span></p>
            <p>Network: Base Mainnet</p>
        </div>
        <hr>
        <div id=\"log\">Welcome, Architect.</div>
        <input id=\"tx\" placeholder=\"TX Hash (0.001 ETH)\" style=\"background:#000; color:#0f0; border:1px solid #0f0; width:100%; margin-bottom:5px;\">
        <input id=\"q\" placeholder=\"Ask the Sphinx\" style=\"background:#000; color:#0f0; border:1px solid #0f0; width:100%;\" onkeypress=\"if(event.key=='Enter') ask()\">
        <script>
            async function ask(){
                let q = document.getElementById('q').value;
                let tx = document.getElementById('tx').value;
                let res = await fetch('/api/oracle/ask', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({query: q, tx_hash: tx})
                });
                let data = await res.json();
                document.getElementById('log').innerHTML += '<br>> ' + q + '<br>' + data.response;
                document.getElementById('q').value = '';
            }
        </script>
    </body>
    """, ubl=UBL_STATS)

@app.route('/api/oracle/ask', methods=['POST'])
def oracle_ask():
    d = request.json
    return jsonify({"response": respond_oracle(d.get('query', ''), d.get('tx_hash'))})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 6060))
    app.run(host='0.0.0.0', port=port)