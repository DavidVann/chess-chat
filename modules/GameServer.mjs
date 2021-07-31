import WebSocket from 'ws';
import redis from 'redis';

const expireTime = 86400; // seconds in a day
const shortExpire = 600; // short expiration for testing


function parseCookies(request) {
    let cookies = {};

    request.headers.cookie.split(';')
        .map(cookie => cookie.trim().split('='))
        .reduce((acc, cookie) => {
            acc[cookie[0]] = cookie[1];
            return acc;
        }, cookies);

    return cookies;
}


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
        this.publisher = redis.createClient(process.env.REDIS_URL);
        this.connection = redis.createClient(process.env.REDIS_URL);
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
        let cookies = parseCookies(request);
        let playerID = cookies['playerID'];


        // Assign player number
        let playerPacket = {
            "type": "player-assignment",
        }
        this.connection.multi()
            .get(`room:${room}:player1`, (err, res) => {return res})
            .get(`room:${room}:player2`, (err, res) => {return res})
            .exec((err, replies) => {
                console.log(replies);
                let player1 = replies[0];
                let player2 = replies[1];

                // If a player is rejoining the room (refresh, disconnection, etc.)
                if (player1 === playerID) {
                    playerPacket['player'] = 1;
                } else if (player2 === playerID) {
                    playerPacket['player'] = 2;
                // If a player is new to the room
                } else if (player1 === null) {
                    this.connection.set(`room:${room}:player1`, playerID, 'EX', expireTime);
                    playerPacket['player'] = 1;
                } else if (player2 === null) {
                    this.connection.set(`room:${room}:player2`, playerID, 'EX', expireTime);
                    playerPacket['player'] = 2;
                }

                ws.send(JSON.stringify(playerPacket)); // Let the player know whether they are player 1 or player 2.
            })
        // let player1 = this.connection.get(`room:${room}:player1`, (err, res) => {return res});
        // let player2 = this.connection.get(`room:${room}:player2`, (err, res) => {return res});





        // Get message history and send to client
        this.connection.lrange(`room:${room}`, 0, -1, (err, reply) => {
            let packet = {
                "type": "history",
                "messages": reply
            }
            console.log(packet);

            ws.send(JSON.stringify(packet));
        });

        // Subscribe to room updates
        let subscriber = redis.createClient(process.env.REDIS_URL);
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
        console.log(packet);
        let room = packet.room;
        this.publisher.publish(`room:${room}`, message);
        this.connection.rpush(`room:${room}`, message);

        // Expire the room key 24 hours after the last message is sent (continually refreshed after every message)

        this.connection.expire(`room:${room}`, shortExpire);
    }


    getRoom(request) {
        return request.url.substr(1)
    }
}

export default GameServer;