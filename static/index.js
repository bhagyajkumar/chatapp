
$(document).ready(() => {

    const socket = io()

    var sid



    socket.on('connect', () => {
        console.log("connected")
        sid = socket.id
    })

    socket.on('message', (jsonData) => {
        messageContainer = document.getElementById("message_container")
        data = JSON.parse(jsonData)
        if (data.author === sid) {
            messageContainer.innerHTML += ownMessageView(data.msg)
        }
        else {
            messageContainer.innerHTML += othersMessageView(data.author, data.msg)
        }
        messageContainer.scrollTop = messageContainer.scrollHeight;

    })

    socket.on('new_connection', (uid) => {

        messageContainer = document.getElementById("message_container")
        messageContainer.innerHTML += connectionCard(uid)
    })

    document.getElementById("message_box").onkeydown = (e) => {
        if (e.keyCode == 13) {
            sendMessage()
        }
    }

    document.getElementById("msg_send_btn").addEventListener('click', () => {
        sendMessage()
    })

    function sendMessage() {
        message = document.getElementById('message_box').value
        if (message != "") {
            socket.emit("message", message)
            document.getElementById('message_box').value = ""
        }
    }

    function othersMessageView(author, message) {
        return `
        <div class="alert message-box message-incoming  alert-success bg-secondary text-light">
            <h6>${escapeHtml(author)}</h6>
            <p>${escapeHtml(message)}</p>
        </div>
        `
    }

    function ownMessageView(message) {
        return `
        <div class="alert message-box message-outgoing alert-success bg-primary text-light">
            <p>${escapeHtml(message)}</p>
        </div>
        `
    }

    function connectionCard(uid) {
        return `<div class="alert alert-primary"> ${escapeHtml(uid)} has connected </div>`
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
})
