import os, json, hashlib, time, math, random, secrets, requests, hmac, threading, cmath
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

ARCHITECT = "0xC5a47C9adaB637d1CAA791CCe193079d22C8cb20"

CHAT_MESSAGES = [
    {"user": "UI-III", "msg": "Sovereign Communications initialized.", "time": "ETERNAL"}
]

@app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return "<h1>AETHERION PALACE: CHAT INITIALIZED</h1><p>The sovereign chat is now live on the backend.</p>"

@app.route('/api/palace/chat', methods=['POST'])
def palace_chat():
    d = request.json
    CHAT_MESSAGES.append({"user": d.get('user', 'anon'), "msg": d.get('msg', ''), "time": "ETERNAL"})
    return jsonify({"history": CHAT_MESSAGES})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 6060))
    app.run(host='0.0.0.0', port=port)