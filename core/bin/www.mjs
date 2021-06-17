#!/usr/bin/env node

/**
 * Module dependencies.
 */

// let app = require('../app.mjs');
// let debug = require('debug')('core:server');
// let http = require('http');

import app from '../app.mjs';
import debug from 'debug';
import http from 'http';

debug('core:server');

// Added dependencies
import WebSocket from 'ws';
import ClientManager from '../modules/ClientManager.mjs';
import * as uuid from 'uuid';
// const WebSocket = require('ws');
// const url = require('url');

/**
 * Get port from environment and store in Express.
 */

let port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Create WebSocket Server (ws) that uses app server. Configure it to handle connections.
 */


// https://github.com/websockets/ws#multiple-servers-sharing-a-single-https-server
const wss = new WebSocket.Server({ noServer: true })
const cm = new ClientManager(wss);

const CLIENTS = [];

wss.on('connection', (ws, request, client) => {
  ws.on('message', message => {
    console.log(`Received message ${message} from user ${client}`);
    ws.send(`SERVER: Echoing your message: "${message}"`)

    for (let socket of CLIENTS) {
      socket.send(`BROADCASTING MESSAGE: ${message}`)
    }

  })

  CLIENTS.push(ws);
  // A message sent immediately on connection
  ws.send('SERVER: Hi. You have connected to the server.');
})

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request);
  });
})

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
