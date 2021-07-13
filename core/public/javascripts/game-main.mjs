import Connect4 from './modules/Connect4.mjs';
import GameClient from './modules/GameClient.mjs';

const nameBox = document.querySelector('.name-box');
const nameInput = document.querySelector('.name-box--input');
const nameSave = document.querySelector('.name-box--save');

const chatBox = document.querySelector('.chat');
const chatBtn = document.querySelector('.chat__btn');
const chatInput = document.querySelector('.chat__input');
const chatSend = document.querySelector('.chat__send');

const overlay = document.querySelector('.overlay');

const origin = location.origin.replace(/^http/, 'ws')
const room = location.href.match(/(game\/)(?<room>[\w\d-]+)/).groups.room;

const toggleNameBoxDisplay = () => {
    nameBox.classList.toggle('name-box--hidden');
}

const toggleOverlayDisplay = () => {
    overlay.classList.toggle('overlay--hidden');
}

const alertEmptyName = () => {
    let errorMessage = document.createElement('p');
    errorMessage.textContent = 'Cannot leave name empty.'
    errorMessage.classList.add('name-box__error');
    nameBox.append(errorMessage);

    setTimeout(() => {
        errorMessage.classList.toggle('name-box__error--hidden');
    }, 5000)
}



async function resolveName() {
    return new Promise((resolve, reject) => {
        let storedName = localStorage.getItem('name');
        if (storedName === null) {
            toggleNameBoxDisplay();
            toggleOverlayDisplay();
            nameSave.addEventListener('click', () => {
                let name = nameInput.value;
                if (name != "") {
                    localStorage.setItem('name', nameInput.value);
                    toggleNameBoxDisplay();
                    toggleOverlayDisplay();
                    resolve();
                } else {
                    alertEmptyName();
                }
            })
        } else {
            resolve();
        }
    })
}

async function connect(origin, room) {
    let nameExists = await resolveName();
    try {
        let client = new GameClient(origin, room);
        return client;
    } catch(e) {
        console.log(e);
    }
}

connect(origin, room).then((client) => {
    chatSend.addEventListener('click', () => {
        client.sendChat(chatInput.value);
    })

    chatBtn.addEventListener('click', () => {
        chatBox.classList.toggle('chat--visible')
        chatBox.classList.toggle('chat--hidden');
    })
})



let draw = SVG().addTo('#game-container')

let chipRed = draw.symbol();
chipRed.circle(85).fill('red').stroke({color: 'black', width: 1});

let chipRef = [];


for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
        let chip = draw.use(chipRed).move(i*100 + 8, j*100 + 8);
        chipRef.push(chip);
    }
}

let maskOffset = 5;
let holeMask = draw.mask();
holeMask.add(draw.rect(700, 600).fill('white'));
for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
        let hole = draw.circle(90).move(i*100 + maskOffset, j*100 + maskOffset).fill('black')
        holeMask.add(hole);
    }
}


let chipBoard = draw.rect(700, 600).fill('grey').maskWith(holeMask);

let c = new Connect4();
c.dropChip(0);
c.dropChip(1);
c.dropChip(0);
console.log(c.grid);