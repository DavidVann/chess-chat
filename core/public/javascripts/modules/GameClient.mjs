import Connect4 from './Connect4.mjs';

const chatBox = document.querySelector('.chat');
const chatDisplay = document.getElementById('receive-area');


const hideNameInput = () => {
    let nameInputBox = document.getElementById('name-input-box');
    nameInputBox.style.display = "none";
}

const showNameInput = () => {
    let nameInputBox = document.getElementById('name-input-box');
    let nameInput = document.getElementById('name-input');
    let nameSave = document.getElementById('name-submit');
    nameSave.addEventListener('click', () => {
        let name = nameInput.value;
        if (name != "") {
            localStorage.setItem('name', nameInput.value);
            hideNameInput();
        }
    })
    nameInputBox.style.display = "block";
}

class GameClient {
    constructor(origin, room) {
        let roomURL = `${origin}/${room}`
        this.ws = new WebSocket(roomURL);
        this.ws.onopen = () => {this.handleOpen()};
        this.ws.onerror = (error) => {this.handleError(error)};
        this.ws.onmessage = (e) => {this.handleMessage(e)};

        this.room = room;
        // this.name = null;

        this.getName();
    }
    
    handleOpen() {
        this.sendChat('Connection Open')
    }

    handleError(error) {
        console.log(`WebSocket error: ${error}`);
    }

    handleMessage(e) {
        let packet = JSON.parse(e.data);
        if (packet.type === "chat") {
            this.displayChatMessage(packet)
        }

        else if (packet.type === "history") {
            for (let messagePacket of packet.message) {
                this.displayChatMessage(JSON.parse(messagePacket));
            }
        }

        else if (packet.type === "state") {

        }

    }

    displayChatMessage(packet) {
        console.log(packet.message);
        let newMessage = document.createElement('p');
        newMessage.classList.add('message')
        newMessage.textContent = packet.message;
        chatDisplay.append(newMessage);
    }

    sendChat(message) {
        let packet = {
            "type": "chat",
            "room": this.room,
            "message": message,
            "timestamp": new Date()
        };

        this.ws.send(JSON.stringify(packet));
    }

    sendState(message) {
        let packet = {
            "type": "state",
            "room": this.room,
            "message": message,
            "timestamp": new Date()
        }
    }

    getName() {
        let storedName = localStorage.getItem('name');
        if (storedName) {
            this.name = storedName;
        } else {
            showNameInput()
        }
    }
}

export default GameClient;