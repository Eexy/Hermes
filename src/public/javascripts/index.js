const URL = "http://localhost:3000";
const socket = io(URL, {autoConnect: false});
const form = document.querySelector('#form');
let currentDest = 'general';

function getUserName(){
  let username = prompt('Enter username please: ');
  if(username){
    socket.auth = {username};
    socket.connect();
  }
}

getUserName();


function updateUsersList(users){
  const usersList = document.querySelector('.users__list');

  while(usersList.lastChild){
    usersList.removeChild(usersList.lastChild);
  }

  users.forEach((user) => {
    const userElement = document.createElement('li');
    userElement.classList.add('user');
    userElement.dataset.id = user.id;
    userElement.textContent = user.username;
    usersList.appendChild(userElement);
  });
}

socket.on('users', updateUsersList);

function getMessagesList(messages){
  const messagesList = document.querySelector('.messages');

  // we delete all the previous messages
  while(messagesList.lastChild){
    messagesList.removeChild(messagesList.lastChild);
  }

  messages.forEach((message) => {
    const messageElement = document.createElement('li');
    messageElement.classList.add('message');
    messageElement.textContent = `${message.to}: ${message.message}`;
    messagesList.appendChild(messageElement);
  });
}