import Chess from './Chess.mjs';

const chatBox = document.getElementById('chat-box')

class GameClient {
    constructor(origin, room) {
        let roomURL = `${origin}/${room}`
        console.log(roomURL);
        this.ws = new WebSocket(roomURL);
        this.ws.onopen = () => {this.handleOpen()};
        this.ws.onerror = (error) => {this.handleError(error)};
        this.ws.onmessage = (e) => {this.handleMessage(e)};

        this.room = room;

    }
    
    handleOpen() {
        this.sendChat('CLIENT: Connection Open')
    }

    handleError(error) {
        console.log(`WebSocket error: ${error}`);
    }

    handleMessage(e) {
        let packet = JSON.parse(e.data);
        if (packet.type === "chat") {
            this.displayChatMessage(packet)
        }

    }

    displayChatMessage(packet) {
        console.log(packet.message);
        let newMessage = document.createElement('p');
        newMessage.textContent = packet.message;
        chatBox.append(newMessage);
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
}

export default GameClient;