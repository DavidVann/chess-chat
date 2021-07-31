import Connect4 from './Connect4.mjs';

const chatBox = document.querySelector('.chat');
const chatDisplay = document.querySelector('.chat__receive-area');

class GameClient {
    constructor(origin, room, name) {
        let roomURL = `${origin}/${room}`
        this.ws = new WebSocket(roomURL);
        this.ws.onopen = () => {this.handleOpen()};
        this.ws.onerror = (error) => {this.handleError(error)};
        this.ws.onmessage = (e) => {this.handleMessage(e)};

        this.room = room;
        this.name = name;
        this.player = null;

        this.game = null;
    }

    startGame() {
        this.game = new Connect4(this);
    }
    
    handleOpen() {
        console.log('Connection Open')
    }

    handleError(error) {
        console.log(`WebSocket error: ${error}`);
    }

    async handleMessage(e) {
        let packet = JSON.parse(e.data);

        console.log(packet);

        if (packet.type === "chat" || packet.type === "server") {
            this.readChat(packet)
        }

        else if (packet.type === "history") {
            for (let subPacket of packet.messages) {
                subPacket = JSON.parse(subPacket);
                console.log(subPacket);
                if (subPacket.type === "chat" || subPacket.type === "server") {
                    this.readChat(subPacket);
                } else if (subPacket.type === "move") {
                    // Need to wait until the game is initialized before re-adding moves to board from history.
                    await this.waitGameReady();
                    console.log("reading move from history");
                    this.readMove(subPacket);
                }
            }
        }

        else if (packet.type === "move") {
            this.readMove(packet)
        }

        else if (packet.type === "player-assignment") {
            this.player = packet.player;
        }

    }

    readChat(packet) {
        console.log(packet.message);
        let block = document.createElement('div');
        let name = document.createElement('p');
        let messageBody = document.createElement('p');

        name.textContent = packet.author;
        messageBody.textContent = packet.message;

        if (packet.author === this.name) {
            block.classList.add('message--send');
        } else {
            block.classList.add('message--receive');
        }

        if (packet.author === "Server") {
            block.classList.add('message--server');
        }

        block.classList.add('message');
        name.classList.add('message__name');
        messageBody.classList.add('message__body');

        block.append(name);
        block.append(messageBody);
        chatDisplay.append(block);
    }

    readMove(packet) {
        this.game.confirmMove(packet);
    }

    send(type, message) {
        let packet = {
            "type": type,
            "author": this.name,
            "room": this.room,
            "player": this.player,
            "timestamp": new Date()
        }

        switch (type) {
            case "server":
                packet["author"] = "Server";
                packet["message"] = message;

            case "chat":
                packet["message"] = message;
                break;
            case "move":
                packet["row:col"] = message;
                break;
        }

        this.ws.send(JSON.stringify(packet));
    }

    async waitGameReady() {
        while (this.game === null) {
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log("Waiting for game setup.");
        }
    }
    
}

export default GameClient;