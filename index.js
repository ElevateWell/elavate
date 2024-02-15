const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());


const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

io.on('connection', (socket) => {

  console.log('User connected:', socket.id);

  socket.on('join', (data) => {
    console.log(`User ${socket.id} joined with username: ${data.username}`);
    io.emit('chatMessage', {
      user: 'System',
      message: `${data.username} has joined the chat.`
     });
  });

  socket.on('chatMessage', (data) => {  
    io.emit('chatMessage', {
      user: socket.id,
      message: data.message
    });     
  });

  socket.on('offer', (data) => {
    socket.broadcast.emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.broadcast.emit('answer', data);
  });

  socket.on('ice-candidate', (data) => {
    socket.broadcast.emit('ice-candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit('chatMessage', {
      user: 'System',
      message: `${socket.id} has left the chat.`
    }); 
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
