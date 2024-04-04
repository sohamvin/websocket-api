
  


  socket.on('user-disconnected', name1 => {
    appendMessage(`${name1} disconnected`);
  });














socket.on('chat-message', data => {
    appendMessage(`${data.name}: ${data.message}`);
  });

socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })


















