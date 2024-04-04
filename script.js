const socket = io('http://localhost:3000')
const sidebar = document.getElementById('sidebar');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

let chatlog = {

}

const uname = prompt('What is your name?')

console.log(uname);

let inwith = ""

let active = [];

socket.emit('new-user', uname);

socket.on('user-connected', (activeUsers) => {
  active = activeUsers;
  showActive();
});

socket.on('receive-msg', (fromUser, message) => {
  const formattedMessage = `${fromUser}: ${message}`;
  const messageElement = document.createElement('div');
  messageElement.innerText = formattedMessage;
  appendMessage(formattedMessage);
  
  // Store the received message in the chatlog
  if (chatlog[fromUser]) {
    chatlog[fromUser].push(formattedMessage);
  } else {
    chatlog[fromUser] = [formattedMessage];
  }
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  const messageElement = document.createElement('div')
  messageElement.innerText = "you : " + message
  if(chatlog[inwith]) {
    chatlog[inwith].push(messageElement); // Push messageElement to the array
  } else {
    let li = []
    li.push(messageElement); // Push messageElement to the new array
    chatlog[inwith] = li;
  }

  appendMessage(`You: ${message}`);
  socket.emit('chat-with', inwith, message); // Corrected parameter order
  messageInput.value = '';
});

function showActive() {
  sidebar.innerHTML = '';
  active.forEach(user => {
    const userElement = document.createElement('div');
    userElement.innerText = user;
    userElement.classList.add('active-user');
    userElement.onclick = () => openChat(user);
    sidebar.appendChild(userElement);
  });
}

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

function openChat(user) {
  console.log(`Opening chat with ${user}`);
  inwith = user;

  messageContainer.innerHTML = '';

  if(chatlog[inwith]){
    chatlog[inwith].forEach(ele =>{
      messageContainer.push(ele);
    });
  } else {
    messageContainer.innerHTML = ''
  }


  // Add your logic to open the chat with the selected user
}

