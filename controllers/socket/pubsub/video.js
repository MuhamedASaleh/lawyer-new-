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

// const onlineUsers = {}; // To track online users by socket ID
// const rooms = {}; // To store active rooms

// const video = (socket, io) => { 
//   // Handle user joining
//   socket.on('join', (username) => {
//     onlineUsers[socket.id] = username;
//     io.emit('updateUserList', Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));
//     console.log(`${username} joined. Online users:`, onlineUsers);
//   });

//   // Handle starting a call with socket ID
//   socket.on('startCall', (calleeSocketId) => {
//     if (onlineUsers[calleeSocketId]) {
//       io.to(calleeSocketId).emit('incomingCall', {
//         caller: onlineUsers[socket.id],
//         callerSocketId: socket.id,
//       });
//     }
//   });

//   // Handle accepting a call
//   socket.on('acceptCall', ({ callerSocketId }) => {
//     const roomId = `${socket.id}-${callerSocketId}`;
//     socket.join(roomId);
//     rooms[roomId] = { callerSocketId, calleeSocketId: socket.id };
//     io.to(callerSocketId).emit('callAccepted', { roomId });
//     io.to(socket.id).emit('callAccepted', { roomId });
//   });

//   socket.on('videoChatOffer', ({ sdp, roomId }) => {
//     console.log(`Received videoChatOffer from socket ${socket.id} for room ${roomId}`);

//     // Find the room by roomId
//     const room = rooms[roomId];
//     console.log(`Room details:`, room);

//     // If the room exists
//     if (room) {
//       const { calleeSocketId } = room;
//       console.log(`Sending videoChatOffer to callee socket ${calleeSocketId}`);

//       // Send the SDP offer to the callee
//       io.to(calleeSocketId).emit('getVideoChatOffer', { sdp });
//       console.log(`Sent videoChatOffer to callee socket ${calleeSocketId} with SDP:`, sdp);
//     } else {
//       console.log(`Room ${roomId} not found`);
//     }
//   });

//   // Handle video chat answer
//   socket.on('videoChatAnswer', ({ sdp, roomId }) => {
//     console.log(`Received videoChatAnswer from socket ${socket.id} for room ${roomId}`);

//     // Find the room by roomId
//     const room = rooms[roomId];
//     console.log(`Room details:`, room);

//     // If the room exists
//     if (room) {
//       const { callerSocketId } = room;
//       console.log(`Sending videoChatAnswer to caller socket ${callerSocketId}`);

//       // Send the SDP answer to the caller
//       io.to(callerSocketId).emit('getVideoChatAnswer', { sdp });
//       console.log(`Sent videoChatAnswer to caller socket ${callerSocketId} with SDP:`, sdp);
//     } else {
//       console.log(`Room ${roomId} not found`);
//     }
//   });

//   // Handle ICE candidates
//   socket.on('candidate', ({ candidate, roomId }) => {
//     console.log(`Received ICE candidate from socket ${socket.id} for room ${roomId}`);

//     // Find the room by roomId
//     const room = rooms[roomId];
//     console.log(`Room details:`, room);

//     // If the room exists
//     if (room) {
//       const { callerSocketId, calleeSocketId } = room;
//       console.log(`Room participants - Caller: ${callerSocketId}, Callee: ${calleeSocketId}`);

//       // Check if the sender is the caller or callee and send the candidate accordingly
//       if (socket.id === callerSocketId) {
//         console.log(`Sending ICE candidate to callee socket ${calleeSocketId}`);
//         io.to(calleeSocketId).emit('getCandidate', candidate);
//       } else {
//         console.log(`Sending ICE candidate to caller socket ${callerSocketId}`);
//         io.to(callerSocketId).emit('getCandidate', candidate);
//       }
//       console.log(`Sent ICE candidate:`, candidate);
//     } else {
//       console.log(`Room ${roomId} not found`);
//     }
//   });


//   // Handle user disconnection
//   socket.on('disconnect', () => {
//     // Clean up rooms and notify other users
//     for (let roomId in rooms) {
//       if (rooms[roomId].callerSocketId === socket.id || rooms[roomId].calleeSocketId === socket.id) {
//         io.to(roomId).emit('userLeft');
//         delete rooms[roomId];
//       }
//     }
//     delete onlineUsers[socket.id];
//     io.emit('updateUserList', Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));
//     console.log(`User ${socket.id} disconnected. Online users:`, onlineUsers);
//   });
// } 


// const onlineUsers = {}; // To track online users by socket ID
// const rooms = {}; // To store rooms and socket IDs

// const video = (socket, io) => {
//   // Handle user joining and tracking online users
//   socket.on('join', (username) => {
//     onlineUsers[socket.id] = username;
//     io.emit('updateUserList', Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));
//     console.log(`${username} joined. Online users:`, onlineUsers);
//   });

//   // Handle starting a call by creating/joining a room
//   socket.on('startCall', (calleeSocketId) => {
//     if (onlineUsers[calleeSocketId]) {
//       const roomId = `${socket.id}-${calleeSocketId}`;
//       rooms[roomId] = [socket.id, calleeSocketId];
//       socket.join(roomId);
//       io.to(calleeSocketId).emit('incomingCall', {
//         caller: onlineUsers[socket.id],
//         callerSocketId: socket.id,
//         roomId,
//       });
//     }
//   });

//   // Handle accepting a call and joining the room
//   socket.on('acceptCall', ({ roomId }) => {
//     if (rooms[roomId]) { 
//       socket.join(roomId);
//       io.to(roomId).emit('callAccepted', { roomId });
//     }
//   });
    

//   // Handle video chat offer
//   socket.on('videoChatOffer', ({ sdp, roomId }) => {
//     const room = rooms[roomId];
//     if (room) {
//       const otherUser = room.find(id => id !== socket.id);
//       if (otherUser) {
//         io.to(otherUser).emit('getVideoChatOffer', { sdp });
//       }
//     }
//   });

//   // Handle video chat answer
//   socket.on('videoChatAnswer', ({ sdp, roomId }) => {
//     const room = rooms[roomId];
//     if (room) {
//       const otherUser = room.find(id => id !== socket.id);
//       if (otherUser) {
//         io.to(otherUser).emit('getVideoChatAnswer', { sdp });
//       }
//     }
//   });

//   // Handle ICE candidates
//   socket.on('candidate', ({ candidate, roomId }) => {
//     const room = rooms[roomId];
//     if (room) {
//       const otherUser = room.find(id => id !== socket.id);
//       if (otherUser) {
//         io.to(otherUser).emit('getCandidate', candidate);
//       }
//     }
//   });

//   // Handle user disconnection
//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//     delete onlineUsers[socket.id];
//     io.emit('updateUserList', Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));

//     for (const roomId in rooms) {
//       rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
//       if (rooms[roomId].length === 0) {
//         delete rooms[roomId];
//       } else {
//         io.to(roomId).emit('userLeft');
//       } 
//     } 
//   });  
// };  

// module.exports = video; 
// const onlineUsers = {}; // To track online users by socket ID
// const rooms = {}; // To store rooms and socket IDs

// const video = (socket, io) => { 
//   // Handle user joining and tracking online users
//   socket.on('join', (username) => {
//     onlineUsers[socket.id] = username;
//     io.emit('updateUserList', Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));
//     console.log(`${username} joined. Online users:`, onlineUsers);
//   }); 
   
//   // Handle starting a call by creating/joining a room
//   socket.on('startCall', (calleeSocketId) => {
//     if (onlineUsers[calleeSocketId]) {
//       const roomId = `${socket.id}-${calleeSocketId}`;
//       rooms[roomId] = [socket.id, calleeSocketId];
//       socket.join(roomId);
//       io.to(calleeSocketId).emit('incomingCall', {
//         caller: onlineUsers[socket.id],
//         callerSocketId: socket.id,
//         roomId,
//       });
//     }
//   });

//   // Handle accepting a call and joining the room
//   socket.on('acceptCall', ({ roomId }) => {
//     if (rooms[roomId]) {
//       socket.join(roomId);
//       io.to(roomId).emit('callAccepted', { roomId });
//     } 
//   }); 

//   // Handle video chat offer
//   socket.on('videoChatOffer', ({ sdp, roomId }) => {
//     const room = rooms[roomId];
//     if (room) {
//       const otherUser = room.find(id => id !== socket.id);
//       if (otherUser) {
//         io.to(otherUser).emit('getVideoChatOffer', { sdp });
//       }
//     }
//   });

//   // Handle video chat answer
//   socket.on('videoChatAnswer', ({ sdp, roomId }) => {
//     const room = rooms[roomId];
//     if (room) {
//       const otherUser = room.find(id => id !== socket.id);
//       if (otherUser) {
//         io.to(otherUser).emit('getVideoChatAnswer', { sdp });
//       }
//     }
//   });

//   // Handle ICE candidates
//   socket.on('candidate', ({ candidate, roomId }) => {
//     const room = rooms[roomId];
//     if (room) {
//       const otherUser = room.find(id => id !== socket.id);
//       if (otherUser) {
//         io.to(otherUser).emit('getCandidate', candidate);
//       }
//     }
//   });

//   // Handle user disconnection
//   socket.on('disconnect', () => {
//     console.log('A user disconnected:', socket.id);
//     delete onlineUsers[socket.id];
//     io.emit('updateUserList', Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));

//     for (const roomId in rooms) {
//       rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
//       if (rooms[roomId].length === 0) {
//         delete rooms[roomId];
//       } else {
//         io.to(roomId).emit('userLeft');
//       }
//     }
//   });
// };

// module.exports = video;
//  ==========================================================================

// Authentication middleware for Socket.IO



const onlineUsers = {}; // To track online users by socket ID
const rooms = {}; // To store rooms and socket IDs

const video = (socket, io) => {
      // Handle offer
      socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer);
    });

    // Handle answer
    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });

    // Handle ICE candidates
    socket.on('ice-candidate', (candidate) => {
        socket.broadcast.emit('ice-candidate', candidate);
    });
  // // Generate a unique identifier for the user
  // const userId = socket.id; // You can use socket.id or generate a unique ID if needed
  // onlineUsers[userId] = `User_${userId.substring(0, 6)}`; // Generate a simple username or ID

  // // Emit the updated user list to all clients
  // io.emit('updateUserList', Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));
  // console.log(`User ${userId} joined. Online users:`, onlineUsers);
  
  // // Handle starting a call by creating/joining a room
  // socket.on('startCall', (calleeSocketId) => {
  //   if (onlineUsers[calleeSocketId]) {
  //     const roomId = `${socket.id}-${calleeSocketId}`;
  //     rooms[roomId] = [socket.id, calleeSocketId];
  //     socket.join(roomId);
  //     io.to(calleeSocketId).emit('incomingCall', {
  //       caller: onlineUsers[socket.id],
  //       callerSocketId: socket.id,
  //       roomId,
  //     });
  //   }
  // });
 
  // // Handle accepting a call and joining the room
  // socket.on('acceptCall', ({ roomId }) => {
  //   if (rooms[roomId]) {
  //     socket.join(roomId);
  //     io.to(roomId).emit('callAccepted', { roomId });
  //   } 
  // });

  // // Handle video chat offer
  // socket.on('videoChatOffer', ({ sdp, roomId }) => {
  //   const room = rooms[roomId];
  //   if (room) {
  //     const otherUser = room.find(id => id !== socket.id);
  //     if (otherUser) {
  //       io.to(otherUser).emit('getVideoChatOffer', { sdp });
  //     }
  //   }
  // });

  // // Handle video chat answer
  // socket.on('videoChatAnswer', ({ sdp, roomId }) => {
  //   const room = rooms[roomId];
  //   if (room) {
  //     const otherUser = room.find(id => id !== socket.id);
  //     if (otherUser) {
  //       io.to(otherUser).emit('getVideoChatAnswer', { sdp });
  //     }
  //   }
  // });

  // // Handle ICE candidates
  // socket.on('candidate', ({ candidate, roomId }) => {
  //   const room = rooms[roomId];
  //   if (room) {
  //     const otherUser = room.find(id => id !== socket.id);
  //     if (otherUser) {
  //       io.to(otherUser).emit('getCandidate', candidate);
  //     }
  //   }
  // });

  // // Handle user disconnection
  // socket.on('disconnect', () => {
  //   console.log('A user disconnected:', socket.id);
  //   delete onlineUsers[socket.id];
  //   io.emit('updateUserList', Object.entries(onlineUsers).map(([id, name]) => ({ id, name })));

  //   for (const roomId in rooms) {
  //     rooms[roomId] = rooms[roomId].filter(id => id !== socket.id);
  //     if (rooms[roomId].length === 0) {
  //       delete rooms[roomId];
  //     } else {
  //       io.to(roomId).emit('userLeft');
  //     }
  //   }
  // });
}; 

module.exports = video;
