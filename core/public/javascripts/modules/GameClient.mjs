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

        if (packet.type === "chat") {
            this.readChat(packet)
        }

        else if (packet.type === "history") {
            for (let subPacket of packet.messages) {
                subPacket = JSON.parse(subPacket);
                console.log(subPacket);
                if (subPacket.type === "chat") {
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
        let newMessage = document.createElement('p');
        newMessage.classList.add('message')
        newMessage.textContent = packet.message;
        chatDisplay.append(newMessage);
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

    // sendChat(message) {
    //     let packet = {
    //         "type": "chat",
    //         "author": this.name,
    //         "room": this.room,
    //         "message": message,
    //         "timestamp": new Date()
    //     };

    //     this.ws.send(JSON.stringify(packet));
    // }

    // sendState(message) {
    //     let packet = {
    //         "type": "state",
    //         "room": this.room,
    //         "message": message,
    //         "timestamp": new Date()
    //     }
    // }

    // getName() {
    //     let storedName = localStorage.getItem('name');
    //     if (storedName) {
    //         this.name = storedName;
    //     }
    // }
}

export default GameClient;