const socket = new io();
const messages = document.querySelector(".messages");
const form = document.querySelector("#form");
const input = document.querySelector("input");
const usersList = document.querySelector(".users-list");
const usersListItem = null;
const rooms = document.querySelector(".rooms-list");

let name = getUserName();

function getUserName() {
  let name = prompt("Enter your name please:");

  if (name != null) {
    socket.emit("user join", name);
    return name;
  }
}

socket.on("user join", (users) => {
  const msgItem = document.createElement("li");
  msgItem.classList.add("message");

  msgItem.textContent = `${users.user.name} join the chat`;
  messages.appendChild(msgItem);

  updateUsersList(users.currentUsers);
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", { name, msg: input.value });
    input.value = "";
  }
});

function updateUsersList(users) {
  while (usersList.lastChild) {
    usersList.removeChild(usersList.lastChild);
  }

  users.forEach((user) => {
    const userItem = document.createElement("li");
    userItem.classList.add("user-name");
    userItem.dataset.userId = user.id;

    userItem.textContent = user.name;
    userItem.addEventListener("click", () => createRoom(user.id, user.name));
    usersList.appendChild(userItem);
  });
}

function createRoom(id, name) {
  const room = document.createElement("li");
  room.classList.add("room");
  room.dataset.userId = id;

  room.textContent = name;
  rooms.appendChild(room);

  socket.emit("join private chat", id);
}

socket.on("private message", (id, msg) => {
  console.log(`you receive a message from ${id}: ${msg}`);
});

socket.on("chat message", function (msg) {
  const msgItem = document.createElement("li");
  msgItem.classList.add("message");

  msgItem.textContent = `${msg.name}: ${msg.msg}`;
  messages.appendChild(msgItem);
});

socket.on("user disconnected", (users) => {
  if (users.disconnectedUser != undefined) {
    const msgItem = document.createElement("li");
    msgItem.classList.add("message");

    msgItem.textContent = `${users.disconnectedUser.name} leave the chat`;
    messages.appendChild(msgItem);
  }
  updateUsersList(users.currentUsers);
});
