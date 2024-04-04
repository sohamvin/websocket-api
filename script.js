const socket = io('https://websocket-api-51zi.onrender.com');
console.log(io);
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

socket.on('user-disconnected', name => {
  appendMessage(`${name} disconnected`)
})


socket.emit('new-user', uname, complaintId);

socket.on('user-connected', (activeUsers) => {
  active = activeUsers; // Extracting only clientIdentifierId from activeUsers array
  showActive();
});

socket.on('receive-msg', (fromWho, message, time) => {
  const formattedMessage = `${fromWho.clientIdentifierId}: ${message} at ${time}`;
  appendMessage(formattedMessage);
  
  // // Store the received message in the chatlog
  // if (chatlog[fromWho]) {
  //   chatlog[fromWho].push(formattedMessage);
  // } else {
  //   chatlog[fromWho] = [formattedMessage];
  // }
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();
  const message = messageInput.value;
  const time = new Date();
  // console.log("message from you : ", message);
  appendMessage(`You: ${message} at ${time}`);
  // console.log("currently in chat with before emmit : ", currentlyInChatWith);
  socket.emit('chat-with', message, time);
  messageInput.value = '';
});


function showActive() {
  sidebar.innerHTML = '';
  active.forEach(user => {
    const userElement = document.createElement('div');
    userElement.innerText = user;
    userElement.classList.add('active-user');
    // userElement.onclick = () => openChat(user);
    sidebar.appendChild(userElement);
  });
}

function appendMessage(message) {
  const messageElement = document.createElement('div')
  messageElement.innerText = message
  messageContainer.append(messageElement)
}

// function openChat(user) {
//   console.log(`Opening chat with ${user}`);
//   currentlyInChatWith = user;

//   messageContainer.innerHTML = '';

//   if(chatlog[currentlyInChatWith]){
//     chatlog[currentlyInChatWith].forEach(message => {
//       appendMessage(message); // Append stored messages to message container
//     });
//   } else {
//     messageContainer.innerHTML = ''
//   }
// }
