class ClientManager {
    constructor(WebSocketServer) {
        this.ws = WebSocketServer;
        this.clients = [];
    }
}

export default ClientManager;