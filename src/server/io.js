const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

let users = [];
let rooms = new Map();

// setting general rooms
rooms.set('general', {name: 'general', users: [], messages: []})

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

function joinRoom(room, user, socket){
  // we inform all the user that someone enter the room
  // we send them the new list of user
  io.to(room).emit('user join', [user, ...rooms.get(room).users]);

  // We had the new user to the room
  let value = rooms.get(room);
  value.users.push(user);
  rooms.set(room, value);
  
  // We sent back to the user his new room
  // and connect it's socket to the room
  socket.join(socket.id);
  socket.join('general');
  io.to(socket.id).emit('join room', rooms.get(room));
}

io.on("connection", (socket) => {
  socket.on('user connect', (name) => connect(name, socket));
});

http.listen(PORT, () => console.log(`Chat server listening port ${PORT}`));


