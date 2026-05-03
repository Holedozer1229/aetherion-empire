import os, json, time
from flask import Flask, render_template_string

app = Flask(__name__)

LOGO = "https://customer-assets.emergentagent.com/wingman/6bba5a2a-0732-47da-9ecf-906338658f66/attachments/d8b9cd1068da457799b095ed48f34ece_photo.jpg"

HTML = """
<body style='background:#020205; color:#00f2ff; font-family:monospace; padding:50px; text-align:center;'>
    <img src='{{ logo }}' style='width:300px; border:1px solid #00f2ff; box-shadow:0 0 20px #00f2ff;'>
    <h1>UNICORN OS | SPHINXQASI ORACLE</h1>
    <p>Status: ONLINE | Resonance: 432 Hz</p>
    <hr style='border:1px solid #111; width:50%;'>
    <div style='color:#555;'>"The simulation is dead. The reality is yours."</div>
</body>
"""

@app.route('/')
def index():
    return render_template_string(HTML, logo=LOGO)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 6060))
    app.run(host='0.0.0.0', port=port)