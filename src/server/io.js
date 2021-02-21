const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

let users = [];
let rooms = new Map();

// setting general rooms
rooms.set('general', {name: 'general', users: [], messages: []})
rooms.set('temp', {name: 'temp', users: [], messages: []})

function connect(name, socket){
  // add the user to the list of users
  const user = {id: socket.id, name, room: 'general'};
  users.push(user);

  // We send back his socket id
  socket.join(socket.id);
  io.to(socket.id).emit('connected', socket.id)

  // Add user to the general room
  joinRoom('general', user, socket);
}

function joinRoom(roomName, user, socket){
  // we inform all the user that someone enter the room
  // we send them the new list of user
  io.to(roomName).emit('user join', [user, ...rooms.get(roomName).users]);

  // We had the new user to the room if the user isn't already in the room
  let room = rooms.get(roomName);
  if(!room.users.find(temp => temp.id = user.id)){
    room.users.push(user);
    rooms.set(roomName, room);
  }
  
  // We sent back to the user his new room and connect it's socket to the room
  socket.join(socket.id);
  socket.join(roomName);
  io.to(socket.id).emit('join room', rooms.get(roomName));
}

function handleNewMessage(message){
  // We add the message to the list of messages in the right room by looking at the destination
  let room = rooms.get(message.dest);
  room.messages.push(message);
  rooms.set(message.dest, room);

  io.to(message.dest).emit('new message', message);
}

io.on("connection", (socket) => {
  socket.on('user connect', (name) => connect(name, socket));

  socket.on('join room', (roomName, id) => {
    joinRoom(roomName, users.find(user => user.id == id), socket);
  });

  socket.on('new message', handleNewMessage);
});

http.listen(PORT, () => console.log(`Chat server listening port ${PORT}`));


