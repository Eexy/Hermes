let socket = new io();
const me = { id: null, name: null, dest: null };

const form = document.querySelector('#form');
const messageInput = document.querySelector('#message-input');

function getUserName() {
  let name = prompt("Enter your name please: ");
  if (name != null) {
    me.name = name;
    socket.emit("user connect", name);
  }
}

socket.on("connected", (id) => (me.id = id));

window.addEventListener("DOMContentLoaded", getUserName);

socket.on("join room", (room) => {
  me.dest = room.name;
  getUsersList(room.users);
  getMessages(room.messages);
});

function getUsersList(users) {
  const usersList = document.querySelector(".users__list");

  // we delete all the user
  while (usersList.lastChild) {
    usersList.removeChild(usersList.lastChild);
  }

  // we create the new user list
  users.forEach((user) => {
    const li = document.createElement("li");
    li.classList.add("user");
    li.dataset.userId = user.id;

    li.textContent = `${user.name}`;
    usersList.appendChild(li);
  });
}

function getMessages(messages) {
  const messagesList = document.querySelector(".messages");

  // we delete all the messages
  while (messagesList.lastChild) {
    messagesList.removeChild(messagesList.lastChild);
  }

  messages.forEach((message) => {
    const li = document.createElement("li");
    li.classList.add("message");

    li.textContent = `${message.message}`;
    messagesList.appendChild(li);
  });
}

socket.on("user join", (users) => {
  console.log(users);
  getUsersList(users)
});
