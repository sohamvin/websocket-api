const dotenv = require("dotenv");
dotenv.config();

const io = require('socket.io')( process.env.PORT || 3000,{
  cors: {
    origin: '*'
  }
});

// Use the cors middleware
// app.use(cors())
let activeUsers = [];
let nametoguy = {};

io.on('connection', socket => {
  console.log("HERE");

  socket.on('new-user', (newUserId) => {
    if (!activeUsers.includes(newUserId)) {
      activeUsers.push(newUserId);
      console.log("New User Connected", activeUsers);
      nametoguy[newUserId] = socket.id;
    }
    io.emit('user-connected', activeUsers); // Broadcast to all connected clients
  });

  socket.on("chat-with", (uname, message) => { // Corrected event name
    const recipientSocketId = nametoguy[uname];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive-msg", uname, message); // Corrected parameter order and added recipient's username
    } else {
      console.log(`User ${uname} not found`);
    }
  });
});

