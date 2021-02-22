const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MessagesService = require('./messagesService'); 
const PORT = process.env.PORT || 3000;

let users = [];
const messagesService = new MessagesService();

function connect(socket){
  const user = {
    id: socket.id,
    username: socket.handshake.auth.username
  }

  users.push(user);

  // We emit to everyone the new users list
  io.emit('users', users);

  // When the user connect we send him the message
  io.to(socket.id).emit('messages', messagesService.getMessages({to: 'general'}));
}

function disconnect(socket){
  // We create a new array of user without the one who just disconnect
  users = users.filter((user) => user.id !== socket.id);
  // We emit to everyone the new users list
  io.emit('users', users);
}

function handleNewMessage(socket, message){
  messagesService.saveMessage(message);

  socket.broadcast.emit('new message', message);
}

io.on("connection", (socket) => {
  // Each time someone connect we update the list of user
  connect(socket);
  
  socket.on('disconnect', () => disconnect(socket));

  socket.on('new message', (message) => handleNewMessage(socket, message));
});

http.listen(PORT, () => console.log(`Chat server listening port ${PORT}`));


