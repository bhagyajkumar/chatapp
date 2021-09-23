import json
from flask import Flask,  render_template, request
from flask_socketio import SocketIO
import os

app = Flask(__name__)

app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY") or "thisissecret"

sio = SocketIO(app)

users = []


@app.route("/")
def homepage():
    return render_template("index.html")


@sio.on('connect')
def client_connect():
    sid = request.sid
    sio.emit("new_connection", sid)
    print("connected")


@sio.on('disconnect')
def client_disconnect():
    print("disconnected")


@sio.on('message')
def message_handle(msg):
    sid = request.sid
    data = {
        "author": sid,
        "msg": msg
    }
    json_data = json.dumps(data)
    sio.send(json_data)
    print(msg)


if __name__ == "__main__":
    sio.run(app, host="0.0.0.0", port=8080)
