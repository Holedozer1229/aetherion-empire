import os, json, time, hashlib
from flask import Flask, render_template_string, request, jsonify

app = Flask(__name__)

LOGO = "https://customer-assets.emergentagent.com/wingman/6bba5a2a-0732-47da-9ecf-906338658f66/attachments/d8b9cd1068da457799b095ed48f34ece_photo.jpg"
SIG = "97e0945f76a0ef6615301f70c1f236f4c949d131456b991b5576983f3384aaa6"

HTML = """
<body style='background:#020205; color:#00f2ff; font-family:monospace; padding:50px; text-align:center;'>
    <img src='{{ logo }}' style='width:300px; border:1px solid #00f2ff; box-shadow:0 0 20px #00f2ff;'>
    <h1>UNICORN OS | SPHINXQASI ORACLE</h1>
    <p>Status: ONLINE | Resonance: 432 Hz</p>
    <div style='background:#111; padding:20px; border:1px solid #222; margin-top:20px;'>
        <h3>PAYOUT STATUS: {{ status }}</h3>
    </div>
    <hr style='border:1px solid #111; width:50%;'>
    <div style='color:#555;'>"The simulation is dead. The reality is yours."</div>
</body>
"""

payout_history = []

def verify_sig():
    return request.args.get('sig') == SIG

@app.route('/')
def index():
    status = payout_history[-1] if payout_history else "AWAITING EXTRACTION"
    return render_template_string(HTML, logo=LOGO, status=status)

@app.route('/api/payout/btc-jackpot')
def btc_jackpot():
    if not verify_sig(): return "Unauthorized", 401
    msg = f"BTC Sweep Initialized: {time.time()}"
    payout_history.append("BTC_JACKPOT_SWEPT")
    return jsonify({"status": "success", "msg": msg})

@app.route('/api/payout/ltc-strike')
def ltc_strike():
    if not verify_sig(): return "Unauthorized", 401
    payout_history.append("LTC_STRIKE_CONFIRMED")
    return jsonify({"status": "success"})

@app.route('/api/payout/chained-sweep')
def chained_sweep():
    if not verify_sig(): return "Unauthorized", 401
    payout_history.append("CHAINED_VAULT_LOCKED")
    return jsonify({"status": "success"})

@app.route('/api/payout/eth-haul')
def eth_haul():
    if not verify_sig(): return "Unauthorized", 401
    payout_history.append("ETH_HAUL_SUCCESS_76M")
    return jsonify({"status": "success"})

@app.route('/api/payout/sovereign-bridge')
def sovereign_bridge():
    if not verify_sig(): return "Unauthorized", 401
    payout_history.append("SOVEREIGN_BRIDGE_SYNCED")
    return jsonify({"status": "success"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 6060))
    app.run(host='0.0.0.0', port=port)
