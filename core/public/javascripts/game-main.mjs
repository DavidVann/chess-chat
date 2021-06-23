import GameClient from './modules/GameClient.mjs';

const origin = location.origin.replace(/^http/, 'ws')
const room = location.href.match(/(game\/)(?<room>[\w\d-]+)/).groups.room;

const client = new GameClient(origin, room);

const messageInput = document.querySelector('.message-input');
const messageSend = document.querySelector('.message-send');

messageSend.addEventListener('click', () => {
    client.sendChat(messageInput.value);
})