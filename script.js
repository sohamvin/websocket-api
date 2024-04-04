const socket = io('http://localhost:3000');
const sidebar = document.getElementById('sidebar');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

let chatlog = {};

const uname = prompt('What is your name?');
const complaintId = prompt("What is the complaint id?");

console.log(uname);

let currentlyInChatWith = "";

let active = [];

socket.emit('new-user', uname, complaintId);

socket.on('user-connected', (activeUsers) => {
  active = activeUsers.map(user => user.clientIdentifierId); // Extracting only clientIdentifierId from activeUsers array
  showActive();
});

socket.on('receive-msg', (fromWho, message) => {
  const formattedMessage = `${fromWho.clientIdentifierId}: ${message}`;
  const messageElement = document.createElement('div');
  messageElement.innerText = formattedMessage;
  appendMessage(formattedMessage);
  
  // Store the received message in the chatlog
  if (chatlog[fromWho.clientIdentifierId]) {
    chatlog[fromWho.clientIdentifierId].push(formattedMessage);
  } else {
    chatlog[fromWho.clientIdentifierId] = [formattedMessage];
  }
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  const messageElement = document.createElement('div')
  messageElement.innerText = "You: " + message
  console.log("message from you : ", message);
  appendMessage(`You: ${message}`);
  console.log("currently in chat with before emmit : ", currentlyInChatWith);
  socket.emit('chat-with', message);
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
  currentlyInChatWith = user;

  messageContainer.innerHTML = '';

  if(chatlog[currentlyInChatWith]){
    chatlog[currentlyInChatWith].forEach(message => {
      appendMessage(message); // Append stored messages to message container
    });
  } else {
    messageContainer.innerHTML = ''
  }
}
