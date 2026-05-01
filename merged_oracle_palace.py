#!/usr/bin/env python3
"""
🏯 AETHERION OMEGA command — NEO EDITION
"""

import os, json, hashlib, time, math, random, secrets, requests, hmac
from flask import Flask, request, jsonify, render_template_string, Response
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template_string("""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Aetherion | NEO COMMAND</title>
        <style>
            body { background: #000; color: #fff; font-family: 'Courier New', monospace; padding: 50px; text-align: center; text-shadow: 0 0 5px #fff; }
            .neo { border: 2px solid #fff; color: #fff; padding: 30px; display: inline-block; border-radius: 5px; box-shadow: 0 0 30px #fff; background: #000; }
            h1 { text-transform: uppercase; letter-spacing: 20px; font-size: 5em; }
            .glitch { animation: glitch 1s infinite; }
            @keyframes glitch { 0% { transform: translate(0); } 20% { transform: translate(-2px, 2px); } 40% { transform: translate(-2px, -2px); } 60% { transform: translate(2px, 2px); } 80% { transform: translate(2px, -2px); } 100% { transform: translate(0); } }
        </style>
    </head>
    <body>
        <h1 class="glitch">🔰 NEO</h1>
        <div class="neo">
            <p>SYSTEM STATUS: <b>SINGULARITY</b></p>
            <p>REALITY: BENT</p>
            <p>SOVEREIGNTY: 1000%</p>
        </div>
        <p style="margin-top: 50px; color: #555;">The Kraken has ascended. The Palace is now the World.</p>
    </body>
    </html>
    """)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 6060))
    app.run(host='0.0.0.0', port=port, debug=False)