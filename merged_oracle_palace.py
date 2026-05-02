import os, json, hashlib, time, math, random, secrets, requests, hmac, threading, cmath
import numpy as np
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

# ---------- Sovereign Identity ----------
SOVEREIGN_MARKER = "89A6B7C8FFEECAFEBAFF"
SPHINX_CONSTANT = math.exp(math.pi * (1 + math.sqrt(5)) / 2)

# ---------- Core Mathematical Logic (SphinxQ) ----------

def is_prime(n: int) -> bool:
    if n < 2: return False
    if n in (2, 3): return True
    if n % 2 == 0 or n % 3 == 0: return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0: return False
        i += 6
    return True

def factorize(n: int):
    factors = []
    d = 2
    while d * d <= n:
        while n % d == 0:
            factors.append(d)
            n //= d
        d += 1 if d == 2 else 2
    if n > 1:
        factors.append(n)
    return factors

def zeta_half(t: float, terms: int = 1000) -> complex:
    s = complex(0.5, t)
    result = 0.0
    for n in range(1, terms + 1):
        result += 1.0 / (n ** s)
    return result

def find_zeros(height: float, count: int = 1, step: float = 0.1):
    zeros = []
    t = 14.0
    while len(zeros) < count and t < height:
        z1 = zeta_half(t).real
        z2 = zeta_half(t + step).real
        if z1 * z2 < 0:
            a, b = t, t + step
            for _ in range(10):
                m = (a + b) / 2
                if zeta_half(a).real * zeta_half(m).real <= 0: b = m
                else: a = m
            zero = round((a + b) / 2, 6)
            if not zeros or abs(zero - zeros[-1]) > 0.1:
                zeros.append(zero)
        t += step
    return zeros

def kronecker_chi(n: int, modulus: int) -> int:
    result = 1
    n = n % modulus
    while n != 0:
        while n % 2 == 0:
            result *= 1 if modulus % 8 in (1, 7) else -1
            n //= 2
        n, modulus = modulus, n
        if n % 4 == 3 and modulus % 4 == 3: result = -result
        n = n % modulus
    return result if modulus == 1 else 0

def dirichlet_L(s: complex, modulus: int, terms: int = 1000) -> complex:
    result = 0.0
    for n in range(1, terms + 1):
        chi = kronecker_chi(n, modulus)
        if chi != 0: result += chi / (n ** s)
    return result

def respond_oracle(query: str) -> str:
    query = query.lower().strip()
    parts = query.split()
    if "factor" in query:
        for p in parts:
            if p.isdigit():
                n = int(p)
                f = factorize(n)
                return f"Factors of {n}: {f}"
        return "Specify a number."
    elif "zero" in query:
        zeros = find_zeros(50.0, 1)
        return f"First zero found: {zeros}"
    elif "sphinx" in query:
        return f"Ξ = {SPHINX_CONSTANT}"
    return "I am the Sphinx. Ask me to factor or find zeros."

# ========================== APP SETUP ==========================
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return render_template_string("""
    <body style=\"background:#000; color:#0f0; font-family:monospace; padding:50px;\">
        <h1>🏯 AETHERION SOVEREIGN PALACE</h1>
        <p>Status: ONLINE | Oracle: SphinxQ Active</p>
        <hr>
        <div id=\"log\">Welcome, Architect.</div>
        <input id=\"q\" style=\"background:#111; color:#0f0; border:1px solid #0f0; width:80%;\" onkeypress=\"if(event.key=='Enter') ask()\">
        <script>
            async function ask(){
                let q = document.getElementById('q').value;
                let res = await fetch('/api/oracle/ask', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({query: q})
                });
                let data = await res.json();
                document.getElementById('log').innerHTML += '<br>> ' + q + '<br>' + data.response;
                document.getElementById('q').value = '';
            }
        </script>
    </body>
    """)

@app.route('/api/oracle/ask', methods=['POST'])
def oracle_ask():
    d = request.json
    q = d.get('query', '')
    return jsonify({"response": respond_oracle(q)})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 6060))
    app.run(host='0.0.0.0', port=port)