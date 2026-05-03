import os, json, hashlib, time, math, random, secrets, requests, hmac, threading, cmath
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from web3 import Web3
from cryptography.fernet import Fernet
import base64

# --- Configuration ---
BASE_RPC = "https://mainnet.base.org"
w3 = Web3(Web3.HTTPProvider(BASE_RPC))
ARCHITECT = "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20"
EXCAL_TOKEN = "0xBEBB2Ca472a5B8334e03d5f0E7dEbcb071750259"
NFT_ADDR = "0x52380C49aEAa96A52E16C16f25A555CfAB1920ad"
VAULT_PATH = "vault.enc"

CHAT_MESSAGES = [{"user": "UI-III", "msg": "Creator Cut module initialized. Terminal active.", "time": "ETERNAL"}]

# ---------- Dashboard UI (The Executive Version) ----------
DASH_HTML = """
<body style='background:#000; color:#0f0; font-family:monospace; padding:30px;'>
    <h1>AETHERION EXECUTIVE TERMINAL</h1>
    <p>Status: ONLINE | Wallet: {{ architect }}</p>
    <div style='border:1px solid #333; padding:15px; margin-bottom:20px;'>
        <h3>💰 REVENUE COMMANDS</h3>
        <button class='btn' onclick='withdraw()'>/withdraw_nft</button>
        <p id='rev-log' style='font-size:10px; color:#555;'></p>
    </div>
    <div id='chat' style='height:200px; overflow-y:auto; border:1px solid #222; padding:10px; margin-bottom:10px;'>
        {% for m in chat %}
        <div><b>[{{ m.user }}]</b>: {{ m.msg }}</div>
        {% endfor %}
    </div>
    <input id='i' placeholder='DECREE...' style='width:100%; background:#111; color:#0f0; border:1px solid #0f0;' onkeypress='if(event.key=="Enter") send()'>
    <script>
        async function send(){
            let i = document.getElementById("i");
            let res = await fetch("/api/palace/chat", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({user:"Architect", msg:i.value})});
            let data = await res.json();
            let html = "";
            for (let j=0; j < data.history.length; j++) {
                let m = data.history[j];
                html += "<div><b>[" + m.user + "]</b>: " + m.msg + "</div>";
            }
            document.getElementById("chat").innerHTML = html;
            i.value = "";
        }
        async function withdraw(){
            document.getElementById('rev-log').innerText = "[STRIKE] Initiating NFT Revenue Withdrawal Pulse...";
            let res = await fetch("/api/palace/withdraw", {method:"POST"});
            let data = await res.json();
            document.getElementById('rev-log').innerText = data.status;
        }
    </script>
    <style>.btn{background:none; border:1px solid #0f0; color:#0f0; padding:5px 10px; cursor:pointer; margin-right:10px;}</style>
</body>
"""

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template_string(DASH_HTML, chat=CHAT_MESSAGES, architect=ARCHITECT)

@app.route('/api/palace/chat', methods=['POST'])
def palace_chat():
    d = request.json
    CHAT_MESSAGES.append({"user": d.get('user', 'anon'), "msg": d.get('msg', ''), "time": "ETERNAL"})
    if len(CHAT_MESSAGES) > 10: CHAT_MESSAGES.pop(0)
    return jsonify({"history": CHAT_MESSAGES})

@app.route('/api/palace/withdraw', methods=['POST'])
def palace_withdraw():
    try:
        passphrase = "Aetherion-Prime-2026"
        hashed_pass = hashlib.sha256(passphrase.encode()).digest()
        f = Fernet(base64.urlsafe_b64encode(hashed_pass))
        with open(VAULT_PATH, "rb") as vf: pk = f.decrypt(vf.read()).decode().strip()
        account = w3.eth.account.from_key(pk)
        abi = '[{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
        contract = w3.eth.contract(address=NFT_ADDR, abi=abi)
        tx = contract.functions.withdraw().build_transaction({'from': account.address, 'nonce': w3.eth.get_transaction_count(account.address), 'gas': 100000, 'gasPrice': w3.eth.gas_price, 'chainId': 8453})
        signed_tx = w3.eth.account.sign_transaction(tx, pk)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        return jsonify({"status": f"✅ SUCCESS. TXID: {tx_hash.hex()}"})
    except Exception as e: return jsonify({"status": f"⚠️ SYNC ERROR: {str(e)}"})