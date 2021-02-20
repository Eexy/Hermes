const express = require("express");
const app = express();
const path = require("path");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

const publicDir = path.join(__dirname, "/public");
app.use(express.static(publicDir));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/html/index.html");
});

let currentUsers = [];

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    let disconnectedUser = currentUsers.find(user => user.id == socket.id);
    currentUsers = currentUsers.filter((user) => user.id !== socket.id);

    io.emit("user disconnected", { disconnectedUser, currentUsers });
  });

  socket.on("user join", (msg) => {
    const user = { id: socket.id, name: msg };
    currentUsers.push(user);
    io.emit("user join", { user, currentUsers });
  });

  socket.on("user typing", () => {
    io.emit("user typing", "user is typing");
  });

  // When we receive a message we broadcast it to everyone
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at ${port}`);
});
