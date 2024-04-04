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

let activeUsers = []; //account number and em[ployee ids.
let socketIdToIdentifier = {}; // map socket to active users
let complaintMap = {} //key is complaint, val is list of socket.ids who asked for it.
let socketIdToComplaintId = {} // what socket id brought which complaint



io.on('connection', socket => {

  socket.on('new-user', (clientIdentifierId, complaintId) => {

    activeUsers.push(clientIdentifierId);
    socketIdToIdentifier[socket.id] = clientIdentifierId;

    socketIdToComplaintId[socket.id] = complaintId

    if (complaintMap[complaintId]) {
      complaintMap[complaintId].push(socket.id);
    } else {
      complaintMap[complaintId] = [socket.id]; // Correctly initialize the array for the complaintId
    }
    
    io.emit('user-connected', activeUsers); // Broadcast to all connected clients
  });
  

  socket.on("chat-with", (message, time) => {
    if (complaintMap[socketIdToComplaintId[socket.id]]) {
      complaintMap[socketIdToComplaintId[socket.id]].forEach(socketId => {
        io.to(socketId).emit("receive-msg", socketIdToIdentifier[socket.id], message, time);
      });
    } else {
      console.log("ERROR");
    }
  });
  

  socket.on('disconnect', () => {
    const disconnectingUser = socketIdToIdentifier[socket.id];
    socket.broadcast.emit('user-disconnected', disconnectingUser);
  
    // Remove from activeUsers
    activeUsers = activeUsers.filter(id => id !== disconnectingUser);
  
    // Remove socket ID from the complaintMap
    const complaintId = socketIdToComplaintId[socket.id];
    if (complaintMap[complaintId]) {
      complaintMap[complaintId] = complaintMap[complaintId].filter(id => id !== socket.id);
      if (complaintMap[complaintId].length === 0) {
        delete complaintMap[complaintId];
      }
    }
  
    // Cleanup mappings
    delete socketIdToIdentifier[socket.id];
    delete socketIdToComplaintId[socket.id];
  });
  
  
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
