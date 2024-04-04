const dotenv = require("dotenv");
dotenv.config();


const express = require("express")
const app = express();



const http = require("http");
const {Server} = require("socket.io");


// Create an HTTP server
const server = http.createServer(app);


// Attach Socket.IO to the HTTP server
const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

let activeUsers = [];
let socketIdDetails = {};

io.on('connection', socket => {

  socket.on('join_room', (data) =>{
    const {complaintId, clientIdentifierId} = data;
    socket.join(room);
  })

  socket.on('new-user', (clientIdentifierId, complaintId) => {
    // Check if the complaint ID already exists in socketIdDetails
    if (Object.values(socketIdDetails).filter(user => user.complaintId === complaintId).length < 3) {
      const obj = {
        "complaintId" : complaintId,
        "clientIdentifierId": clientIdentifierId,
        "socketId": socket.id
      };
    
      activeUsers.push(obj); // Push the entire obj, not just clientIdentifierId
      console.log("New User Connected", activeUsers);
      socketIdDetails[socket.id] = obj;
    } else {
      console.log("More than 3 users already connected with the same complaint ID. Cannot proceed.");
      // You may add additional logic here to handle the case where more than 3 users are already connected with the same complaint ID.
    }
    
    io.emit('user-connected', activeUsers); // Broadcast to all connected clients
  });
  

  socket.on("chat-with", (message) => {
    const senderObj = socketIdDetails[socket.id];
    let recipient = "";
  
    // Finding recipient based on condition
    for (const recipientId in socketIdDetails) {
      const recipientObj = socketIdDetails[recipientId];
      if (recipientObj.complaintId === senderObj.complaintId) {
        recipient = recipientObj;
        break; // Exit loop if recipient found
      }
    }
  
    if (recipient) {
      io.to(recipient.socketId).emit("receive-msg", senderObj, message); // Emit message to recipient's socketId
    } else {
      console.log(`User ${senderObj.complaintId} not found`);
    }
  });
  
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
