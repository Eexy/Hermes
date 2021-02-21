const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

let users = [];
let rooms = new Map();

// setting general rooms
rooms.set('general', {users: [], message: []})

io.on("connection", async (socket) => {
  const userId = socket.id;
  // add the user to the list of users
  users.push({id: userId, room: 'general'});

  // push the user in the room
  socket.join('general');

  // send back the room to the users
  socket.join(userId);
  io.to(userId).emit('update info', {room: 'general'});
});

http.listen(PORT, () => console.log(`Chat server listening port ${PORT}`));


