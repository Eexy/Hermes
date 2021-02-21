let socket = null;
const me = {id: null, room: null};
let name = getUserName();

function getUserName(){
  let name = prompt('Enter your name please: ');
  if(name != null){
    socket = new io();
    me.id = socket.id;
    return name;
  }
}

socket.on('update info', updateInfo)

function updateInfo(update){
  console.log(update);
}