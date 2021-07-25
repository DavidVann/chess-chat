// import Connect4 from './modules/Connect4.mjs';
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
                    resolve(name);
                } else {
                    alertEmptyName();
                }
            })
        } else {
            resolve(storedName);
        }
    })
}

async function resolvePlayer(client) {
    /**
     * Poll for whether the server has assigned client a player number.
     */

    // https://stackoverflow.com/questions/7307983/while-variable-is-not-defined-wait
    while (client.player === null) {
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log("Waiting for player assignment.");
    }
    // return new Promise(resolve => resolve())
}


async function connect(origin, room) {
    let name = await resolveName();
    let client = new GameClient(origin, room, name);
    await resolvePlayer(client);
    return client;
}

connect(origin, room).then((client) => {
    console.log("Finished connecting");
    chatSend.addEventListener('click', () => {
        client.send("chat", chatInput.value);
        chatInput.value = '';
    })

    chatBtn.addEventListener('click', () => {
        chatBox.classList.toggle('chat--visible')
        chatBox.classList.toggle('chat--hidden');
    })

    // client.game.ui.initialize();

    client.game.attemptMove(0);
    client.game.attemptMove(1);
    client.game.attemptMove(0);
    // client.game.attemptMove(0);
    // client.game.attemptMove(0);

    client.send("chat", `${client.name} connected.`);

})



// let draw = SVG().addTo('#game-container')

// let chipRed = draw.symbol();
// chipRed.circle(85).fill('red').stroke({color: 'black', width: 1});

// let chipRef = [];


// for (let i = 0; i < 7; i++) {
//     for (let j = 0; j < 6; j++) {
//         let chip = draw.use(chipRed).move(i*100 + 8, j*100 + 8);
//         chipRef.push(chip);
//     }
// }

// let maskOffset = 5;
// let holeMask = draw.mask();
// holeMask.add(draw.rect(700, 600).fill('white'));
// for (let i = 0; i < 7; i++) {
//     for (let j = 0; j < 6; j++) {
//         let hole = draw.circle(90).move(i*100 + maskOffset, j*100 + maskOffset).fill('black')
//         holeMask.add(hole);
//     }
// }