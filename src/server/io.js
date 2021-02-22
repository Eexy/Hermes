const app = require('./app');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MessagesService = require('./messagesService'); 
const PORT = process.env.PORT || 3000;

let users = [];
const messagesService = new MessagesService();

io.on("connection", (socket) => {
  
});

http.listen(PORT, () => console.log(`Chat server listening port ${PORT}`));


