import WebSocket from 'ws';

class GameServer {
    constructor() {
        // Set up WebSocket Server from ws
        this.wss = new WebSocket.Server({ noServer: true });
        this.wss.on('connection', (ws, request) => {
            this.handleConnection(ws, request);
            ws.on('message', message => {
                this.handleMessage(message);
            })
        });

        this.games = {}; // Object for storing game rooms

    }

    attachServer(server) {
        server.on('upgrade', (request, socket, head) => {
            this.wss.handleUpgrade(request, socket, head, ws => {
                this.wss.emit('connection', ws, request);
            });
        });
    }

    handleConnection(ws, request) {
        let room = this.getRoom(request);
        if (!this.games[room]) {
            this.games[room] = [];
        }
        this.games[room].push(ws);
    }

    handleMessage(message) {
        let packet = JSON.parse(message);
        let room = packet.room;
        this.broadcastMessage(message, room);
    }

    broadcastMessage(message, room) {
        let targetClients = this.games[room];
        for (let client of targetClients) {
            client.send(message);
        }
    }

    getRoom(request) {
        return request.url.substr(1)
    }
}

export default GameServer;