const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});



// Serve the public folder (for client-side files)
app.use(express.static('public'));

// Handle socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle WebRTC signaling
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);  
    console.log(`${roomId} joined user ${userId}`);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId); 
    });

    // Forward WebRTC signaling messages
    socket.on('offer', (offer, targetUserId) => {   
      io.to(targetUserId).emit('offer', offer, userId);
    });

    socket.on('answer', (answer, targetUserId) => {
      io.to(targetUserId).emit('answer', answer, userId);
    });

    socket.on('ice-candidate', (candidate, targetUserId) => {
      io.to(targetUserId).emit('ice-candidate', candidate, userId);
    });

    socket.on('disconnect', () => {
      io.to(roomId).emit('user-disconnected', userId);
    });
  });

  
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
