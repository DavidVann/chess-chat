import WebSocket from 'ws';
import redis from 'redis';

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

        // this.games = {}; // Object for storing game rooms
        this.publisher = redis.createClient();
        this.connection = redis.createClient();
        this.subscribers = [];

    }

    attachServer(server) {
        server.on('upgrade', (request, socket, head) => {
            this.wss.handleUpgrade(request, socket, head, ws => {
                this.wss.emit('connection', ws, request);
            });
        });
    }

    handleConnection(ws, request) {
        /**
         * Sends client message history and subscribes client to room updates.
         */

        let room = this.getRoom(request);

        // Get message history and send to client
        this.connection.lrange(`room:${room}`, 0, -1, (err, reply) => {
            let packet = {
                "type": "history",
                "message": reply
            }
            console.log(packet);

            ws.send(JSON.stringify(packet));
        });

        // Subscribe to room updates
        let subscriber = redis.createClient();
        subscriber.on("message", (channel, message) => {
            ws.send(message)
        })
        subscriber.subscribe(`room:${room}`)
        this.subscribers.push(subscriber);
    }

    handleMessage(message) {
        /**
         * 
         */
        let packet = JSON.parse(message);
        let room = packet.room;
        this.publisher.publish(`room:${room}`, message);
        this.connection.rpush(`room:${room}`, message);

        // Expire the room key 24 hours after the last message is sent (continually refreshed after every message)
        let expireTime = 86400;
        let shortExpire = 30; // short expiration for testing
        this.connection.expire(`room:${room}`, shortExpire);
    }


    getRoom(request) {
        return request.url.substr(1)
    }
}

export default GameServer;