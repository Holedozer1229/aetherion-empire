import os, json, time
from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

CHAT_MESSAGES = [
    {"user": "UI-III", "msg": "Sovereign Communications initialized.", "time": "ETERNAL"}
]

DASH_HTML = """
<body style='background:#000; color:#0f0; font-family:monospace; padding:20px;'>
    <h1>AETHERION PALACE: CHAT ACTIVE</h1>
    <div id='chat' style='height:200px; overflow-y:auto; border:1px solid #222; padding:10px; margin-bottom:10px;'>
        {% for m in chat %}
        <div><b>[{{ m.user }}]</b>: {{ m.msg }}</div>
        {% endfor %}
    </div>
    <input id='i' style='width:80%; background:#111; color:#0f0; border:1px solid #0f0;' onkeypress='if(event.key=="Enter") send()'>
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
    </script>
</body>
"""

@app.route('/')
def index():
    return render_template_string(DASH_HTML, chat=CHAT_MESSAGES)

@app.route('/api/palace/chat', methods=['POST'])
def palace_chat():
    d = request.json
    CHAT_MESSAGES.append({"user": d.get('user', 'anon'), "msg": d.get('msg', ''), "time": "ETERNAL"})
    if len(CHAT_MESSAGES) > 10: CHAT_MESSAGES.pop(0)
    return jsonify({"history": CHAT_MESSAGES})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 6060))
    app.run(host='0.0.0.0', port=port)