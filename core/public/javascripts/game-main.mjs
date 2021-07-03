import Connect4 from './modules/Connect4.mjs';
import GameClient from './modules/GameClient.mjs';


const origin = location.origin.replace(/^http/, 'ws')
const room = location.href.match(/(game\/)(?<room>[\w\d-]+)/).groups.room;

const client = new GameClient(origin, room);

const messageInput = document.querySelector('.message-input');
const messageSend = document.querySelector('.message-send');

messageSend.addEventListener('click', () => {
    client.sendChat(messageInput.value);
})

const chatBox = document.querySelector('.chat');
const chatBtn = document.querySelector('.chat__btn');

chatBtn.addEventListener('click', () => {
    chatBox.classList.toggle('chat--visible')
    chatBox.classList.toggle('chat--hidden');
})

let draw = SVG().addTo('#game-container')

let chipRed = draw.symbol();
chipRed.circle(85).fill('red').stroke({color: 'black', width: 1});

let chipRef = [];


for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
        let chip = draw.use(chipRed).move(i*100 + 3, j*100 + 3);
        chipRef.push(chip);
    }
}

let holeMask = draw.mask();
holeMask.add(draw.rect(700, 600).fill('white'));
for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
        let hole = draw.circle(90).move(i*100, j*100).fill('black')
        holeMask.add(hole);
    }
}


let chipBoard = draw.rect(700, 600).fill('grey').maskWith(holeMask);

let c = new Connect4();
c.dropChip(0);
c.dropChip(1);
c.dropChip(0);
console.log(c.grid);