const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false });
const form = document.querySelector("#form");
const messageInput = document.querySelector("#message-input");
let currentDest = 'general';
let users = [];

form.addEventListener("submit", sendMessage);

function sendMessage(e) {
  e.preventDefault();
  // we check if the input isn't empty
  if (messageInput.value) {
    const message = {
      from: socket.id,
      to: currentDest,
      message: messageInput.value,
    };

    // we append the new message to the list of message
    newMessage(message);

    // we emit to the server that we send a new message
    socket.emit("new message", message);
  }
}

function newMessage(message) {
  const messagesList = document.querySelector(".messages");
  const messageElement = document.createElement("li");
  messageElement.classList.add("message");

  // we get the user's who send the message
  const user = users.find((user) => user.id == message.from);

  messageElement.textContent = `${user.username}: ${message.message}`;
  messagesList.appendChild(messageElement);
}

socket.on('new message', newMessage);

function getUserName() {
  let username = prompt("Enter username please: ");
  if (username) {
    socket.auth = { username };
    socket.connect();
  }
}

getUserName();

function updateUsersList(_users) {
  // We update our array of users
  users = _users;

  const usersList = document.querySelector(".users__list");

  while (usersList.lastChild) {
    usersList.removeChild(usersList.lastChild);
  }

  users.forEach((user) => {
    const userElement = document.createElement("li");
    userElement.classList.add("user");
    userElement.dataset.id = user.id;
    userElement.textContent = user.username;
    usersList.appendChild(userElement);
  });
}

socket.on("users", updateUsersList);

function getMessages(messages) {
  const messagesList = document.querySelector(".messages");

  // we delete all the previous messages
  while (messagesList.lastChild) {
    messagesList.removeChild(messagesList.lastChild);
  }

  messages.forEach((message) => {
    newMessage(message);
  });
}

socket.on("messages", getMessages)
