import os
from flask import Flask

app = Flask(__name__)

@app.route('/')
def singularity():
    return '<body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:serif; font-style:italic;"><div>.</div></body>'

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 6060))
    app.run(host="0.0.0.0", port=port)