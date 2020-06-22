const express = require('express');
const app = express();
const path = require('path');
const socket = require('socket.io');

const server = app.listen(8000, () => {
    console.log('Server is running on port: 8000');
});

const messages = [];
let users = [];

const io = socket(server);
app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('message', (message) => { 
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    socket.on('disconnect', () => {
        const disconectedUser = users.find(el => el.id === socket.id);
        socket.broadcast.emit('removeUser', disconectedUser.author);
        users.splice(disconectedUser);
    });
    socket.on('join', (userName) => {
        users.push({author: userName, id: socket.id});
        socket.broadcast.emit('join', userName);
    });
  });