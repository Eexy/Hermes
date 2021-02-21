let socket = new io();
const me = { id: null, name: null, dest: null };

const form = document.querySelector('#form');
const messageInput = document.querySelector('#message-input');

form.addEventListener('submit', sendMessage)

function sendMessage(e){
  e.preventDefault();
  if(messageInput.value){
    const message = {
      from: me.id,
      dest: me.dest,
      message: messageInput.value
    };

    socket.emit('new message', message);
  }
}

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
    li.addEventListener('click', createPrivateRoom);
    usersList.appendChild(li);
  });
}

function switchRoom(){

}

function isRoomAlreadyExist(id){
  const rooms = document.querySelectorAll('.room');
  let exist = false;
  
  if(rooms){
    rooms.forEach((room) => {
      if(room.dataset.destId === id){
        exist = true;
      }
    });
  }

  return exist;
}

// Create a new private room when we click on a user
function createPrivateRoom(e){
  // We get the user we want to start a new discussion
  const user = e.target;
  // if the room doesn't already exist we create it
  if(!isRoomAlreadyExist(user.dataset.userId)){
    const roomsList = document.querySelector('.rooms__list');
    const li = document.createElement('li');
    li.classList.add('room');
    li.dataset.destId = user.dataset.userId;
    li.textContent = user.textContent;
    roomsList.appendChild(li);
  }
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
  getUsersList(users)
});

function handleNewMessage(message){
  const messagesList = document.querySelector('.messages');

  // create message element
  const li = document.createElement('li');
  li.classList.add('message');
  li.textContent = message.message;

  // append the new message and scroll to the bottom
  messagesList.appendChild(li);
}

socket.on("new message", handleNewMessage);
