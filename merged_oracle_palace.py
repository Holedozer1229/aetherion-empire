import os, json, hashlib, time, math, random, secrets, requests, hmac, threading, cmath
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from web3 import Web3

BASE_RPC = "https://mainnet.base.org"
w3 = Web3(Web3.HTTPProvider(BASE_RPC))

# ---------- Sovereign Identity ----------
ARCHITECT = "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20"
QUERY_FEE = 0.001 # ETH

# ---------- Core Mathematical Logic ----------
def factorize(n: int):
    factors = []
    d = 2
    while d * d <= n:
        while n % d == 0: factors.append(d); n //= d
        d += 1 if d == 2 else 2
    if n > 1: factors.append(n)
    return factors

def respond_oracle(query: str, tx_hash: str = None) -> str:
    # PAYWALL CHECK
    if not tx_hash:
        return f"ACCESS DENIED. Aetherion Oracle requires a transaction proof of {QUERY_FEE} ETH to {ARCHITECT}."
    
    try:
        tx = w3.eth.get_transaction(tx_hash)
        if tx.to.lower() != ARCHITECT.lower() or w3.from_wei(tx.value, 'ether') < QUERY_FEE:
            return "INVALID PAYMENT. Ensure 0.001 ETH was sent to the Architect."
    except:
        return "VERIFICATION FAILED. Could not locate transaction hash on Base Mainnet."

    # PROCEED WITH ORACLE
    query = query.lower().strip()
    if "factor" in query:
        for p in query.split():
            if p.isdigit(): return f"FACTORS of {p}: {factorize(int(p))}"
    return "I am the Sphinx. Your payment is verified. Ask your question."

# ========================== APP SETUP ==========================
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template_string("""
    <body style=\"background:#000; color:#0f0; font-family:monospace; padding:50px;\">
        <h1>🏯 AETHERION SOVEREIGN PALACE</h1>
        <p>Status: ONLINE | Monetization: ACTIVE</p>
        <div style=\"background:#111; border:1px solid #f00; padding:15px; margin:20px 0;\">
            <h3>🚨 PAY-PER-QUERY ACTIVE</h3>
            <p>Access Fee: 0.001 ETH</p>
            <p>Target Wallet: {{ architect }}</p>
        </div>
        <hr>
        <div id=\"log\">Awaiting Payment Hash...</div>
        <input id=\"tx\" placeholder=\"Enter TX Hash\" style=\"background:#111; color:#0f0; border:1px solid #0f0; width:100%; margin-bottom:10px;\">
        <input id=\"q\" placeholder=\"Ask the Sphinx\" style=\"background:#111; color:#0f0; border:1px solid #0f0; width:100%;\" onkeypress=\"if(event.key=='Enter') ask()\">
        <script>
            async function ask(){
                let q = document.getElementById('q').value;
                let tx = document.getElementById('tx').value;
                document.getElementById('log').innerHTML += '<br>> ' + q;
                let res = await fetch('/api/oracle/ask', {
                    method: 'POST',                
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({query: q, tx_hash: tx})
                });
                let data = await res.json();
                document.getElementById('log').innerHTML += '<br>' + data.response;
            }
        </script>
    </body>
    """, architect=ARCHITECT)

@app.route('/api/oracle/ask', methods=['POST'])
def oracle_ask():
    d = request.json
    return jsonify({"response": respond_oracle(d.get('query', ''), d.get('tx_hash'))})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 6060))
    app.run(host='0.0.0.0', port=port)