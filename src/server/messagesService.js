class MessagesService{
  constructor(){
    this.messages = [];

    this.filterMessage = this.filterMessage.bind(this);
  }

  saveMessage(message){
    this.messages.push(message);
  }

  getMessages(opt){
    const messages = this.messages.filter((message) => this.filterMessage(message, opt));
    return messages;
  }

  getMessagesBetweenUser(user1, user2){
    const messages = this.messages.filter((message) => {
      if(message.to === user1 && message.from === user2){
        return true;
      }else if(message.to === user2 && message.from === user1){
        return true;
      }

      return false;
    });

    return messages;
  }

  filterMessage(message, opt){
    const keys = Object.keys(opt);
    let isValid = true;
    
    keys.forEach((key) => {
      if(message[key] !== opt[key]){
        isValid = false;
      }
    });

    return isValid;
  }
}

module.exports = MessagesService;