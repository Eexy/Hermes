const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const publicDir = path.join(__dirname, '/public');
app.use(express.static(publicDir));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/html/index.html');
});

io.on('connection', (socket) => {
  io.emit('user connected', 'A new user is connected');

  socket.on('disconnect', () => {
    io.emit('user disconnected', 'An user is disconnected');
  });
  // When we receive a message we broadcast it to everyone
  socket.on('chat message',(msg) => {
    io.emit('chat message', msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});