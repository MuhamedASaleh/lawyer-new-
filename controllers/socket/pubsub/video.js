let clientCaller = { userId: null, socketID: null };
let clientCallee = { userId: null, socketID: null };

const video = (socket, io) => {
  socket.on('joinRoom', (userId) => {
    if (!clientCaller.userId) {
      clientCaller = { userId, socketID: socket.id };
      console.log(clientCaller)
      io.to(socket.id).emit('userWaiting', `Hello User ${userId}, waiting for another user...`);
    } else {
      clientCallee = { userId, socketID: socket.id };
      console.log(clientCallee)
      console.log(clientCaller.socketID)
      io.to(socket.id).emit('userWaiting', `Hello User ${userId}, connecting you to a video chat with User ${clientCaller.userId}`);
      io.to(clientCaller.socketID).emit('roomReady', `Connecting you to User ${clientCallee.userId}`);
    }
  });

  socket.on('videoChatOffer', ({ sdp }) => {
    if (socket.id === clientCaller.socketID) {
      io.to(clientCallee.socketID).emit('getVideoChatOffer', sdp);
    }
  });

  socket.on('videoChatAnswer', ({ sdp }) => {
    io.to(clientCaller.socketID).emit('getVideoChatAnswer', sdp);
  });

  socket.on('candidate', ({ candidate }) => {
    if (socket.id === clientCaller.socketID) {
      io.to(clientCallee.socketID).emit('getCandidate', candidate);
    } else {
      io.to(clientCaller.socketID).emit('getCandidate', candidate);
    }
  });

  socket.on('disconnect', () => {
    if (socket.id === clientCaller.socketID) {
      clientCaller = { userId: null, socketID: null };
    } else if (socket.id === clientCallee.socketID) {
      clientCallee = { userId: null, socketID: null };
    }
    // Optionally notify users about disconnection
    io.emit('userDisconnected', { socketId: socket.id });
  });
};

module.exports = video;
