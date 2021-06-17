import Client from './modules/Client.mjs';

// const port = app.get('port');
const url = 'ws://localhost:3000'

const ws = new WebSocket(url);

ws.onopen = () => {
    console.log('Connection opened. \n Sending message: "Hi, I am open" to server.');
    ws.send('CLIENT: Hi, I am open.')
}

ws.onerror = (error) => {
    console.log(`WebSocket error: ${error}`);
}

ws.onmessage = (e) => {
    console.log(e.data);
    // console.debug("CLIENT: WebSocket message received:", e);
    // console.log(e);

    let p = document.createElement('p');
    p.textContent = e.data;
    document.body.append(p);
}

const client = new Client(ws);

const messageInput = document.querySelector('.message-input');
const messageSender = document.querySelector('.message-send');

messageSender.addEventListener('click', () => {
    client.send(messageInput.value);
})