const URL = "/";
const socket = io(URL, { autoConnect: false });
const form = document.querySelector("#form");
const messageInput = document.querySelector("#message-input");
let currentDest = "general";
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
    // we reset the input field
    messageInput.value = "";

    // we append the new message to the list of message
    newMessage(message);

    // we emit to the server that we send a new message
    socket.emit("new message", message);
  }
}

function newMessage(message) {
  // we get the sender's username
  const user = users.find((user) => user.id == message.from);

  // we check if we are in the correct room
  if (currentDest === message.to || currentDest === message.from) {
    // if we are in the correct room we add the message to the messages list
    const messagesList = document.querySelector(".messages");
    const messageElement = document.createElement("li");
    messageElement.classList.add("message");
    messageElement.textContent = `${user.username}: ${message.message}`;
    messagesList.appendChild(messageElement);
  }else{
    // if it is a private message and there is no chat yet we create a new chat
    if(message.to === socket.id){
      createChat(message.from);
    }
  }
}

socket.on("new message", newMessage);

function init() {
  let username = prompt("Enter username please: ");
  if (username) {
    socket.auth = { username };
    socket.connect();

    // we select the general chat
    const general = document.querySelector('[data-id="general"]');
    general.classList.add("active");
    general.addEventListener("click", switchChat);
  }
}

function switchChat(e) {
  const chat = e.target;
  const chatId = chat.dataset.id;
  const chatType = chat.dataset.chatType;
  // we change the destination for the user message
  currentDest = chatId;

  // we make the selected chat the active one
  const chats = document.querySelectorAll(".chat");
  chats.forEach((element) => {
    if (element.classList.contains("active")) {
      element.classList.remove("active");
    }
  });
  chat.classList.add("active");

  // we tell the server we want the messages from the selected chat
  socket.emit("switch chat", { chatType, chatId });
}

function createChat(id) {
  const userId = id;
  let user = users.find((el) => el.id === id);

  // We check if the chat doesn't already in the chats list
  const chatList = document.querySelector(".chats-list");
  const chats = [...document.querySelectorAll(".chat")];
  const chatExist = chats.every((chat) => chat.dataset.id !== userId);

  if (chatExist) {
    const chat = document.createElement("li");
    chat.classList.add("chat");
    chat.dataset.chatType = "chat";
    chat.dataset.id = userId;
    chat.textContent = user.username;

    chat.addEventListener("click", switchChat);
    chatList.appendChild(chat);
  }
}

window.addEventListener("DOMContentLoaded", init);

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
    userElement.addEventListener("click", () => createChat(user.id));
    usersList.appendChild(userElement);
  });
}

socket.on("users", updateUsersList);

function getMessages(messages) {
  console.log(messages);

  const messagesList = document.querySelector(".messages");

  // we delete all the previous messages
  while (messagesList.lastChild) {
    messagesList.removeChild(messagesList.lastChild);
  }

  messages.forEach((message) => {
    newMessage(message);
  });
}

socket.on("messages", getMessages);
