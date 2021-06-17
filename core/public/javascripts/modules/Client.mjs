class Client {
    constructor(WebSocketClient) {
        this.ws = WebSocketClient;
    }

    send(message) {
        this.ws.send(message);
    }
}

export default Client;