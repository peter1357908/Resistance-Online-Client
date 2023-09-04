import io from 'socket.io-client';

const socketserver = 'https://resistance-online-server.adaptable.app';
// const socketserver = 'http://localhost:9090/';

const socket = io(socketserver);
socket.on('connect', () => { console.log('socket.io connected'); });
socket.on('disconnect', () => { console.log('socket.io disconnected'); });
socket.on('reconnect', () => { console.log('socket.io reconnected'); });
socket.on('error', (error) => { console.log(error); });

export default socket;
