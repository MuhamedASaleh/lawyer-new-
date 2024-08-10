const jwt = require('jsonwebtoken');
const User = require('../../../models/userModel'); // Assuming you're using Sequelize and have a User model

let clientCaller = { token: null, userId: null, socketID: null };
let clientCallee = { id: null, socketID: null };

// const video = (socket, io) => {
//   socket.on('userRoom', async (data) => {
//     try {
//       const { token, id } = data;
//       // Verify the token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log(`Decoded ID from token: ${decoded.id}`);

//       if (!clientCaller.token) {
//         // Assign caller details
//         clientCaller = { token, userId: decoded.id, socketID: socket.id };
//         console.log(`Caller assigned: ${JSON.stringify(clientCaller)}`);
//         io.to(socket.id).emit('userWaiting', 'Waiting for another user...');
//       }
// // console.log(clientCaller)
//       if (id) {
//         // Verify that the user ID exists in the database
//         const user = await User.findByPk(id);
//         if (!user) {
//           console.log(' no user')
//           socket.emit('error', 'User ID does not exist.');
//           return;
//         }

//         // Assign callee details
//         clientCallee = { id: user.userID, socketID: socket.id };
//         console.log(`Callee assigned: ${JSON.stringify(clientCallee)}`);

//         // Create a unique room and add both users
//         const roomId = `room_${clientCaller.userId}_${clientCallee.id}`;
//         socket.join(roomId);
//         io.to(clientCaller.socketID).emit('roomReady', `Connecting you to the other user in room ${roomId}`);
//         io.to(clientCallee.socketID).emit('roomReady', `Connecting you to the other user in room ${roomId}`);

//       }
//     } catch (error) {
//       socket.emit('error', 'Invalid or expired token.');
//       console.error('Token verification error:', error);
//     }
//   });
//   console.log('=========================================')
//   console.log(socket.id)
//   console.log(clientCaller.socketID)

//   socket.on('videoChatOffer', ({ sdp }) => {
//     console.log("Received video chat offer");
//     if (socket.id === clientCaller.socketID) {
//       io.to(clientCallee.socketID).emit('getVideoChatOffer', sdp);
//       console.log(socket.id )
//       console.log(clientCaller )
//       console.log(clientCallee)
//     }
//   }); 

//   socket.on('videoChatAnswer', ({ sdp }) => {
//     io.to(clientCaller.socketID).emit('getVideoChatAnswer', sdp);
//   });     

//   socket.on('candidate', ({ candidate }) => {
//     if (socket.id === clientCaller.socketID) {
//       io.to(clientCallee.socketID).emit('getCandidate', candidate);
//     } else {
//       io.to(clientCaller.socketID).emit('getCandidate', candidate);
//     }
//   });

//   socket.on('disconnect', () => {
//     if (socket.id === clientCaller.socketID) {
//       clientCaller = { token: null, socketID: null };
//       io.to(clientCallee.socketID).emit('userDisconnected', 'The other user has disconnected.');
//     } else if (socket.id === clientCallee.socketID) {
//       clientCallee = { id: null, socketID: null };
//       io.to(clientCaller.socketID).emit('userDisconnected', 'The other user has disconnected.');
//     }
//   });
// };

// module.exports = video;

// const activeSessions = new Map(); // Store active sessions

// const video = (socket, io) => {
//   socket.on('userRoom', async (data) => {
//     try {
//       const { token, id } = data;
//       // Verify the token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       console.log(`Decoded ID from token: ${decoded.id}`);

//       if (!activeSessions.has(socket.id)) {
//         // Assign caller details
//         if (!clientCaller.token) {
//           clientCaller = { token, userId: decoded.id, socketID: socket.id };
//           console.log(`Caller assigned: ${JSON.stringify(clientCaller)}`);
//           io.to(socket.id).emit('userWaiting', 'Waiting for another user...');
//         }

//         if (id) {
//           // Verify that the user ID exists in the database
//           const user = await User.findByPk(id);
//           if (!user) {
//             console.log('User does not exist');
//             socket.emit('error', 'User ID does not exist.');
//             return;
//           }

//           // Assign callee details
//           clientCallee = { id: user.userID, socketID: socket.id };
//           console.log(`Callee assigned: ${JSON.stringify(clientCallee)}`);

//           // Create a unique room and add both users
//           const roomId = `room_${clientCaller.userId}_${clientCallee.id}`;
//           socket.join(roomId);
//           io.to(clientCaller.socketID).emit('roomReady', `Connecting you to the other user in room ${roomId}`);
//           io.to(clientCallee.socketID).emit('roomReady', `Connecting you to the other user in room ${roomId}`);

//           // Store session details
//           activeSessions.set(roomId, { clientCaller, clientCallee });
//         }
//       }
//     } catch (error) {
//       socket.emit('error', 'Invalid or expired token.');
//       console.error('Token verification error:', error);
//     }
//   });

//   socket.on('videoChatOffer', ({ sdp }) => {
//     console.log("Received video chat offer");
//     const room = [...activeSessions.values()].find(session => session.clientCaller.socketID === socket.id);
//     if (room) {
//       console.log(room.clientCallee.socketID)
//       io.to(room.clientCallee.socketID).emit('getVideoChatOffer', sdp);
//     }
//   });

//   socket.on('videoChatAnswer', ({ sdp }) => {
//     const room = [...activeSessions.values()].find(session => session.clientCaller.socketID === socket.id);
//     if (room) {
//       console.log(room)
//       io.to(room.clientCaller.socketID).emit('getVideoChatAnswer', sdp);
//     }
//   });

//   socket.on('candidate', ({ candidate }) => {
//     const room = [...activeSessions.values()].find(session => session.clientCaller.socketID === socket.id);
//     if (room) {
//       io.to(room.clientCallee.socketID).emit('getCandidate', candidate);
//     } else {
//       io.to(room.clientCaller.socketID).emit('getCandidate', candidate);
//     }
//   });

//   socket.on('disconnect', () => {
//     const roomId = [...activeSessions.keys()].find(id => {
//       const session = activeSessions.get(id);
//       return session.clientCaller.socketID === socket.id || session.clientCallee.socketID === socket.id;
//     });

//     if (roomId) {
//       const { clientCaller, clientCallee } = activeSessions.get(roomId);
//       if (socket.id === clientCaller.socketID) {
//         io.to(clientCallee.socketID).emit('userDisconnected', 'The other user has disconnected.');
//         clientCaller = { token: null, socketID: null };
//       } else if (socket.id === clientCallee.socketID) {
//         io.to(clientCaller.socketID).emit('userDisconnected', 'The other user has disconnected.');
//         clientCallee = { id: null, socketID: null };
//       }
//       activeSessions.delete(roomId);
//       socket.leave(roomId);
//     }
//   });
// };    

// module.exports = video;
const video = (socket, io) => {


  socket.on('userRoom', async (data) => {
    try {
      const { token, id } = data;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!clientCaller.token) {
        clientCaller = { token, userId: decoded.id, socketID: socket.id };
        io.to(socket.id).emit('userWaiting', 'Waiting for the other user...');
      }

      if (id) {
        const user = await User.findByPk(id);
        if (!user) {
          socket.emit('error', 'User ID does not exist.');
          return;
        }

        clientCallee = { id: user.userID, socketID: socket.id };
        io.to(clientCallee.socketID).emit('incomingCall', { from: clientCaller.userId });
      }
    } catch (error) {
      socket.emit('error', 'Invalid or expired token.');
    }
  });

  socket.on('callResponse', (response) => {
    if (response.accepted) {
      const roomId = `room_${clientCaller.userId}_${clientCallee.id}`;
      socket.join(roomId);
      io.to(clientCaller.socketID).emit('roomReady', roomId);
      io.to(clientCallee.socketID).emit('roomReady', roomId);
    } else {
      io.to(clientCaller.socketID).emit('callDeclined', 'The user has declined the call.');
      clientCaller = { token: null, userId: null, socketID: null };
      clientCallee = { id: null, socketID: null };
    }
  });

  socket.on('videoChatOffer', ({ sdp }) => {
    io.to(clientCallee.socketID).emit('getVideoChatOffer', { sdp });
  });

  socket.on('videoChatAnswer', ({ sdp }) => {
    io.to(clientCaller.socketID).emit('getVideoChatAnswer', { sdp });
  });

  socket.on('candidate', ({ candidate }) => {
    if (socket.id === clientCaller.socketID) {
      io.to(clientCallee.socketID).emit('getCandidate', { candidate });
    } else {
      io.to(clientCaller.socketID).emit('getCandidate', { candidate });
    }
  });

  socket.on('disconnect', () => {
    if (socket.id === clientCaller.socketID) {
      io.to(clientCallee.socketID).emit('userDisconnected', 'The other user has disconnected.');
      clientCaller = { token: null, userId: null, socketID: null };
    } else if (socket.id === clientCallee.socketID) {
      io.to(clientCaller.socketID).emit('userDisconnected', 'The other user has disconnected.');
      clientCallee = { id: null, socketID: null };
    }
  });

}
module.exports = video;
