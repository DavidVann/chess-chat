// class GameClient {
//     constructor(WebSocketClient) {
//         this.ws = WebSocketClient;
//     }

//     connect() {

//     }

//     send(message) {
//         this.ws.send(message);
//     }
// }

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
        this.send('CLIENT: Connection Open')
    }

    handleError(error) {
        console.log(`WebSocket error: ${error}`);
    }

    handleMessage(e) {
        let packet = JSON.parse(e.data);
        let message = packet.message;
        console.log(message);
        // console.debug("CLIENT: WebSocket message received:", e);
        // console.log(e);
    
        let p = document.createElement('p');
        p.textContent = message;
        document.body.append(p);
    }

    _displayMessage(message) {

    }

    send(message) {
        let packet = {
            "room": this.room,
            "message": message,
            "timestamp": new Date()
        };

        this.ws.send(JSON.stringify(packet));
    }
}

export default GameClient;