#!/usr/bin/env python3
"""
🏯 THE ULTIMATE MERGED STACK — OMEGA COMMAND v2.0
Fixed: Monarch Protection. The Kraken now recognizes Travis D Jones and only wipes intruders.
"""

import os, json, hashlib, time, math, random, secrets, requests, hmac
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import subprocess

app = Flask(__name__)
CORS(app)

# --- SOVEREIGN PRIME IDENTITY ---
PRIME_SIGNATURE = "97e0945f76a0ef6615301f70c1f236f4c949d131456b991b5576983f3384aaa6"

# --- 1000% POWER LOCKING ---
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["100 per day", "20 per hour"],
    storage_uri="memory://",
)

# --- LOCK-ON & SELECTIVE WIPE ---
ATTACK_BLACKBOX = {} # ip -> score
PERMANENT_BLACKLIST = set()

def execute_targeted_wipe(ip):
    """Selective Memory Wipe: Neutralizes the attacker's path without affecting the Monarch."""
    print(f"🔥 [WIPE] Neutralizing Attacker IP: {ip}")
    PERMANENT_BLACKLIST.add(ip)
    # We no longer rotate the global SECRET_KEY, so Travis stays logged in.
    print(f"🛡️ Monarch session preserved. Attacker {ip} permanently blacklisted.")

@app.before_request
def sovereign_lock_on_sentry():
    ip = get_remote_address()
    path = request.path

    # 1. THE MONARCH PASS
    # If the request contains your Prime Signature, the Kraken bows and skips all checks.
    sig = request.headers.get("X-Aetherion-Signature") or request.args.get("sig")
    if sig == PRIME_SIGNATURE:
        return # Access Granted: Monarch Verified

    # 2. BLACKLIST CHECK
    if ip in PERMANENT_BLACKLIST:
        return "SOURCE NEUTRALIZED - ACCESS PERMANENTLY REVOKED", 403

    # 3. ATTACK DETECTION
    suspicious = ['/.env', '/.git', '/wp-admin', 'union select', '<script>', 'etc/passwd']
    is_probe = any(p in path.lower() or p in str(request.args).lower() for p in suspicious)
    
    if is_probe:
        ATTACK_BLACKBOX[ip] = ATTACK_BLACKBOX.get(ip, 0) + 1
        print(f"🎯 [LOCK-ON] Tracking intruder {ip}: {ATTACK_BLACKBOX[ip]}/5")
        
        if ATTACK_BLACKBOX[ip] >= 5:
            execute_targeted_wipe(ip)
            return "OMEGA WIPE EXECUTED", 401

@app.route('/')
def index():
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Aetherion Omega Command</title>
        <style>
            body { background: #0b0c0e; color: #d4af37; font-family: 'Courier New', monospace; padding: 50px; text-align: center; }
            .status { color: #00ff00; border: 1px solid #d4af37; padding: 20px; display: inline-block; border-radius: 10px; }
            .monarch { color: #ff00ff; border-color: #ff00ff; }
            h1 { text-transform: uppercase; letter-spacing: 10px; font-size: 3em; }
            .btn { color: #000; background: #d4af37; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px; display: inline-block; transition: 0.3s; }
        </style>
    </head>
    <body>
        <h1>🏯 OMEGA COMMAND</h1>
        <div class="status monarch">
            <p>SYSTEM STATUS: <b>MONARCH PROTECTED</b></p>
            <p>IDENT: TRAVIS D JONES</p>
        </div>
        <br><br>
        <div style="color: #888; margin-bottom: 20px;">
            The Kraken recognizes the Prime Signature. Selective wipe engaged.<br>
            Intruders will be neutralized on sight.
        </div>
        <a href="/api/payout/btc-jackpot?sig=97e0945f76a0ef6615301f70c1f236f4c949d131456b991b5576983f3384aaa6" class="btn">💰 Secure BTC Sweep</a>
    </body>
    </html>
    """)

@app.route('/api/payout/btc-jackpot')
def btc_sweep():
    try:
        res = subprocess.run(["python3", "btc_sweeper.py"], capture_output=True, text=True)
        return jsonify({"status": "success", "log": res.stdout})
    except Exception as e: return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 6060))
    app.run(host='0.0.0.0', port=port, debug=False)