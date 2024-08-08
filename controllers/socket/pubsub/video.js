const jwt = require('jsonwebtoken');

let clientCaller = { token: null, userId: null, socketID: null };
let clientCallee = { token: null, userId: null, socketID: null };

const video = (socket, io) => {
  socket.on('userRoom', (data) => {
    try {

      const { token } = data;

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded.id)
      if (!clientCaller.token) {

        clientCaller = { token,userId :decoded.id ,socketID: socket.id };
        console.log(clientCaller)
        io.to(socket.id).emit('userWaiting', 'Waiting for another user...');
      } else {
        clientCallee = { token,userId :decoded.id , socketID: socket.id };

        console.log(clientCallee)
        io.to(socket.id).emit('userWaiting', 'Connecting you to a video chat...');
        io.to(clientCaller.socketID).emit('roomReady', 'Connecting you to the other user');
      }
    } catch (error) {
      socket.emit('error', 'Invalid or expired token.');
      console.error('Token verification error:', error);
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
      clientCaller = { token: null, socketID: null };
      io.to(clientCallee.socketID).emit('userDisconnected', 'The other user has disconnected.');
    } else if (socket.id === clientCallee.socketID) {
      clientCallee = { token: null, socketID: null };
      io.to(clientCaller.socketID).emit('userDisconnected', 'The other user has disconnected.');
    }
  });
};

module.exports = video;
