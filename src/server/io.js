const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MessagesService = require('./messagesService'); 
const PORT = process.env.PORT || 3000;

let users = [];
const messagesService = new MessagesService();

function connect(socket){
  // we put the user in the general room
  socket.join('general');

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

  socket.to(message.to).emit('new message', message);
}

function handleSwitchChat(socket, options){
  const type = options.chatType;
  const dest = options.chatId;

  let messages = [];
  if(type === 'room'){
    messages = messagesService.getMessages({to: dest});
  }else{
    messages = messagesService.getMessagesBetweenUser(socket.id, dest);
  }

  io.to(socket.id).emit('messages', messages);
}

io.on("connection", (socket) => {
  // Each time someone connect we update the list of user
  connect(socket);
  
  socket.on('disconnect', () => disconnect(socket));

  socket.on('new message', (message) => handleNewMessage(socket, message));

  socket.on('switch chat', (options) => handleSwitchChat(socket, options));
});

http.listen(PORT, () => console.log(`Chat server listening port ${PORT}`));


