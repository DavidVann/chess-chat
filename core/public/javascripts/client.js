// const port = app.get('port');
const url = 'ws://localhost:3000'

const ws = new WebSocket(url);

ws.onopen = () => {
    console.log('Connection opened. \n Sending message: "Hi, I am open" to server.');
    ws.send('CLIENT: Hi, I am open.')
    let p = document.createElement('p');
    p.textContent = 'hello';
    document.body.appendChild(p);
}

ws.onerror = (error) => {
    console.log(`WebSocket error: ${error}`);
}

ws.onmessage = (e) => {
    console.log(e.data);
    // console.debug("CLIENT: WebSocket message received:", e);
    // console.log(e);
}