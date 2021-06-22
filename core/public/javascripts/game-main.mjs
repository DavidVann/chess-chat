import GameClient from './modules/GameClient.mjs';

const origin = location.origin.replace(/^http/, 'ws')
const room = location.href.match(/(game\/)(?<room>[\w\d-]+)/).groups.room;

const client = new GameClient(origin, room);

const messageInput = document.querySelector('.message-input');
const messageSender = document.querySelector('.message-send');

messageSender.addEventListener('click', () => {
    client.sendChat(messageInput.value);
})