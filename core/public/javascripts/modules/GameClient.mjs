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
    constructor(roomURL) {
        this.ws = new WebSocket(roomURL);
        this.ws.onopen = () => {this.handleOpen()};
        this.ws.onerror = (error) => {this.handleError(error)};
        this.ws.onmessage = (e) => {this.handleMessage(e)};
    }
    
    handleOpen() {
        this.send('CLIENT: Connection Open')
    }

    handleError(error) {
        console.log(`WebSocket error: ${error}`);
    }

    handleMessage(e) {
        console.log(e.data);
        // console.debug("CLIENT: WebSocket message received:", e);
        // console.log(e);
    
        let p = document.createElement('p');
        p.textContent = e.data;
        document.body.append(p);
    }

    send(message) {
        // let packet = {
        //     "room": this.room,
        //     "message": message,
        // };

        // this.ws.send(JSON.stringify(packet));

        this.ws.send(message);
    }
}

export default GameClient;