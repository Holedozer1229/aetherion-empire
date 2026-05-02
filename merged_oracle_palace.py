import os
import json
import hashlib
import time
import threading
import hmac
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

def generate_deterministic_k(msghash, privkey):
    v = b'\x01' * 32
    k = b'\x00' * 32
    k = hmac.new(k, v + b'\x00' + privkey + msghash, hashlib.sha256).digest()
    v = hmac.new(k, v, hashlib.sha256).digest()
    k = hmac.new(k, v + b'\x01' + privkey + msghash, hashlib.sha256).digest()
    v = hmac.new(k, v, hashlib.sha256).digest()
    return int.from_bytes(hmac.new(k, v, hashlib.sha256).digest(), 'big')

KRAKEN_TXID = "f4184fc596403b9d638783cf57adfe4c75c605f6356fbc91338530e9831e9e16"

def run_sniper():
    print("sniper active")
    while True: time.sleep(30)

def run_sniffer():
    print("sniffer active")
    while True: time.sleep(60)

P = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F
class MergedOracle:
    def __init__(self, seed):
        self.acc = seed % P
        self.priv_key = hashlib.sha256(str(seed).encode()).digest()
    def resonate(self, word):
        msghash = hashlib.sha256(word.encode()).digest()
        k = generate_deterministic_k(msghash, self.priv_key)
        self.acc = (self.acc + k) % P
        return (self.acc % 4) - 1, self.acc

app = Flask(__name__)
CORS(app)
players = {}
oracle_states = {}

def get_player_data(pid):
    if pid not in players:
        players[pid] = {"balance": 10.0, "blocks": 0}
        oracle_states[pid] = MergedOracle(int(KRAKEN_TXID, 16) ^ int(hashlib.sha256(pid.encode()).hexdigest(), 16))
    return players[pid], oracle_states[pid]

threading.Thread(target=run_sniper, daemon=True).start()
threading.Thread(target=run_sniffer, daemon=True).start()

@app.route('/')
def index():
    return "<h1>AETHERION SOVEREIGN PALACE</h1><p>Status: ONLINE</p>"

@app.route('/api/palace/mine/chat', methods=['POST'])
def merge_mine():
    d = request.json
    pid = d.get('user_id', 'anon')
    msg = d.get('message', '')
    player, oracle = get_player_data(pid)
    rewards = 0
    for word in msg.lower().split():
        state, acc = oracle.resonate(word)
        if state == 0:
            rewards += 50.0
            player["blocks"] += 1
    player["balance"] += rewards
    return jsonify({"status": "Resonance Achieved", "new_balance": player["balance"]})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 6060))
    app.run(host='0.0.0.0', port=port)