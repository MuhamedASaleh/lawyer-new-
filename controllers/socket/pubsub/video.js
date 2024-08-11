// const jwt = require('jsonwebtoken');
// const User  = require('../../../models/userModel'); // Assuming you're using Sequelize and have a User model

// let clientCaller = { token: null, userId: null, socketID: null };
// let clientCallee = { id: null, socketID: null };

// const video = (socket, io) => {
//   socket.on('userRoom', async (data) => {
//     try {
//       const { token, id } = data;

//       // Verify the token
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       // console.log(`Decoded ID from token: ${decoded.id}`);

//       if (!clientCaller.token) {
//           // Assign caller details
//           clientCaller = { token, userId: decoded.id, socketID: socket.id };
//           // console.log(`Caller assigned: ${JSON.stringify(clientCaller)}`);
//           io.to(socket.id).emit('userWaiting', 'Waiting for another user...');
//       }

//       if (id) {
//           // Verify that the user ID exists in the database
//           const user = await User.findByPk(id);
//           if (!user) {
//               // console.log('No user found');
//               socket.emit('error', 'User ID does not exist.');
//               return;
//           }

//           // Assign callee details
//           clientCallee = { id: user.userID, socketID: socket.id };
//           // console.log(`Callee assigned: ${JSON.stringify(clientCallee)}`);

//           // Create a unique room ID based on user IDs
//           const roomId = `room_${clientCaller.userId}_${clientCallee.id}`;

//           // Add the caller to the room
//           io.sockets.sockets.get(clientCaller.socketID).join(roomId);
//           // console.log(`User ${clientCaller.socketID} joined room ${roomId}`);

//           // Add the callee to the room
//           socket.join(roomId);
//           console.log(socket)
//           console.log(`User ${clientCallee.socketID} joined room ${roomId}`);

//           // Notify both users that they are in the room
//           io.to(roomId).emit('callStarted', `Users ${clientCaller.socketID} and ${clientCallee.socketID} are in room ${roomId}`);
//           io.to(clientCaller.socketID).emit('roomReady', `Connecting you to the other user in room ${roomId}`);
//           io.to(clientCallee.socketID).emit('roomReady', `Connecting you to the other user in room ${roomId}`);
//       }  

//     } catch (error) {
//       socket.emit('error', 'Invalid or expired token.');
//       // console.error('Token verification error:', error);
//     }
//   });
//   // console.log('=========================================')
//   // console.log(socket.id)
//   // console.log(clientCaller.socketID)

//   socket.on('videoChatOffer', ({ sdp }) => {
//     // console.log("Received video chat offer");
//     if (socket.id === clientCaller.socketID) {
//       io.to(clientCallee.socketID).emit('getVideoChatOffer', sdp);
//       // console.log(sdp )
//       // console.log(clientCaller )
//       // console.log(clientCallee)
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





// // Handle user joining
// socket.on('join', (username) => {
//   onlineUsers[socket.id] = username;
//   io.emit('updateUserList', Object.values(onlineUsers));
//   console.log(`${username} joined. Online users:`, onlineUsers);
// });

// // Handle starting a call
// socket.on('startCall', (calleeUsername) => {
//   const calleeSocketId = Object.keys(onlineUsers).find(
//       (id) => onlineUsers[id] === calleeUsername
//   );
//   if (calleeSocketId) {
//       io.to(calleeSocketId).emit('incomingCall', {
//           caller: onlineUsers[socket.id],
//           callerSocketId: socket.id,
//       });
//   }
// });

// // Handle accepting a call
// socket.on('acceptCall', ({ callerSocketId }) => {
//   const roomId = `${socket.id}-${callerSocketId}`;
//   socket.join(roomId);
//   io.to(callerSocketId).emit('callAccepted', { roomId });
//   io.to(socket.id).emit('callAccepted', { roomId });
// });

// // Handle offer
// socket.on('offer', (offer, roomId) => {
//   socket.to(roomId).emit('offer', offer);
// });

// // Handle answer
// socket.on('answer', (answer, roomId) => {
//   socket.to(roomId).emit('answer', answer);
// });

// // Handle ICE candidate
// socket.on('ice candidate', (candidate, roomId) => {
//   socket.to(roomId).emit('ice candidate', candidate);
// });


















// socket.on('join', (username) => {
//   onlineUsers[socket.id] = username;
//   io.emit('updateUserList', Object.values(onlineUsers));
//   console.log(`${username} joined. Online users:`, onlineUsers);
// });

// socket.on('startCall', (calleeUsername) => {
//   const calleeSocketId = Object.keys(onlineUsers).find(
//     (id) => onlineUsers[id] === calleeUsername
//   );
//   if (calleeSocketId) {
//     io.to(calleeSocketId).emit('incomingCall', {
//       caller: onlineUsers[socket.id],
//       callerSocketId: socket.id,
//     });
//   }
// });

// socket.on('acceptCall', ({ callerSocketId }) => {
//   const roomId = `${socket.id}-${callerSocketId}`;

//   // Join the room for both users
//   socket.join(roomId);
//   io.to(callerSocketId).emit('callAccepted', { roomId });
//   io.to(socket.id).emit('callAccepted', { roomId });

//   // Ensure the caller also joins the room
//   io.sockets.sockets.get(callerSocketId)?.join(roomId);

//   // Check if both users are in the room
//   setTimeout(() => {
//     const room = io.sockets.adapter.rooms.get(roomId);
//     if (room) {
//       const roomMembers = Array.from(room);
//       console.log('Room Members:', roomMembers);
//       console.log('Socket ID:', socket.id);
//       console.log('Caller Socket ID:', callerSocketId);
//       console.log('Includes Socket ID:', roomMembers.includes(socket.id));
//       console.log('Includes Caller Socket ID:', roomMembers.includes(callerSocketId));

//       if (roomMembers.includes(socket.id) && roomMembers.includes(callerSocketId)) {
//         console.log(`Both users are in the same room: ${roomId}`);
//       } else {
//         console.log('One or both users are not in the room');
//       }
//     } else {
//       console.log('Room does not exist or is empty');
//     }
//   }, 500); // Adjust timeout if needed
// });



// Listen for call initiation
// socket.on('startCall', ({ targetUserId, token }) => {
//   console.log(targetUserId);
//   console.log(token);

//   // Verify token and target user (this is just a mock, replace with actual logic)
//   if (verifyToken(token) && isUserOnline(targetUserId)) {
//     const roomId = createRoomId();
//     rooms[roomId] = [socket.id, targetUserId]; // Save room with participants

//     // Notify target user of the incoming call
//     io.to(targetUserId).emit('incomingCall', { roomId, callerId: socket.id });

//     // Add the caller to the room
//     socket.join(roomId);
//     console.log(`Caller ${socket.id} joined room ${roomId}`);

//     // Optionally, you can add logic to ensure that the target user is also added to the room after accepting the call
//   } else {
//     socket.emit('error', 'Invalid token or user not online.');
//   }
// });

// // Listen for call acceptance
// socket.on('acceptCall', ({ roomId }) => {
//   if (rooms[roomId]) {
//     const [callerId, receiverId] = rooms[roomId];
//     io.to(callerId).emit('callAccepted', { roomId });
//     io.to(receiverId).emit('callAccepted', { roomId });

//     // Add both users to the room
//     io.to(callerId).join(roomId);
//     io.to(receiverId).join(roomId);
//     console.log(`Users ${callerId} and ${receiverId} joined room ${roomId}`);
//   }
// });

// // Listen for call rejection
// socket.on('rejectCall', ({ roomId }) => {
//   if (rooms[roomId]) {
//     const [callerId] = rooms[roomId];
//     io.to(callerId).emit('callRejected');
//     delete rooms[roomId];
//   }
// });

// // Handle disconnection
// socket.on('disconnect', () => {
//   console.log('User disconnected:', socket.id);
//   // Clean up rooms
//   for (const [roomId, participants] of Object.entries(rooms)) {
//     if (participants.includes(socket.id)) {
//       io.to(participants.find(id => id !== socket.id)).emit('callEnded');
//       delete rooms[roomId];
//     }
//   }
// });

// function verifyToken(token) {
//   // Implement token verification logic here
//   return true; // Placeholder
// }

// function isUserOnline(userId) {
//   // Check if the user is connected
//   return io.sockets.sockets.has(userId);
// }

// function createRoomId() {
//   return 'room_' + Math.random().toString(36).substr(2, 9);
// }

const onlineUsers = {}; // To track online users by socket ID
const rooms = {}; // To store active rooms

const video = (socket, io) => {
  // Handle user joining
  socket.on('join', (username) => {
    onlineUsers[socket.id] = username;
    io.emit('updateUserList', Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));
    console.log(`${username} joined. Online users:`, onlineUsers);
  });

  // Handle starting a call with socket ID
  socket.on('startCall', (calleeSocketId) => {
    if (onlineUsers[calleeSocketId]) {
      io.to(calleeSocketId).emit('incomingCall', {
        caller: onlineUsers[socket.id],
        callerSocketId: socket.id,
      });
    }
  });

  // Handle accepting a call
  socket.on('acceptCall', ({ callerSocketId }) => {
    const roomId = [socket.id, callerSocketId].sort().join('-');
    socket.join(roomId);
    rooms[roomId] = { callerSocketId, calleeSocketId: socket.id };
    io.to(callerSocketId).emit('callAccepted', { roomId });
    io.to(socket.id).emit('callAccepted', { roomId });
  });

  // Handle offer
  socket.on('offer', (offer, roomId) => {
    socket.to(roomId).emit('offer', offer);
  });

  // Handle answer
  socket.on('answer', (answer, roomId) => {
    socket.to(roomId).emit('answer', answer);
  });

  // Handle ICE candidate
  socket.on('ice candidate', (candidate, roomId) => {
    socket.to(roomId).emit('ice candidate', candidate);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const username = onlineUsers[socket.id];
    delete onlineUsers[socket.id];
    io.emit('updateUserList', Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));
    console.log(`${username} left. Online users:`, onlineUsers);

    // Clean up rooms involving this user
    const userRooms = Object.entries(rooms).filter(([roomId, participants]) =>
      participants.callerSocketId === socket.id || participants.calleeSocketId === socket.id
    );
    userRooms.forEach(([roomId]) => {
      socket.to(roomId).emit('userDisconnected');
      delete rooms[roomId];
    });
  }); 
};

module.exports = video;
