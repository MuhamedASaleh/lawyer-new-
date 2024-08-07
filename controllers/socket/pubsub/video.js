const { createRoom, addUserBySocketId, deleteRoomById } = require('../controller/Room');

let clientCaller = { userId: null, socketID: null, roomId: null };
let clientCallee = { userId: null, socketID: null, roomId: null };lientCallee = { userId: null, socketID: null };

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

  socket.on('offer', ({ sdp }) => {
    if (socket.id === clientCaller.socketID) {
      io.to(clientCallee.socketID).emit('getVideoChatOffer', sdp);
    }
  });

  socket.on('videoChatAnswer', ({ sdp }) => {
    io.to(clientCaller.socketID).emit('getVideoChatAnswer', sdp);
  });

  socket.on('ice-candidate', ({ candidate }) => {
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




// const { createRoom, addUserBySocketId, deleteRoomById } = require('../controller/Room');

// let clientCaller = { userId: null, socketID: null, roomId: null };
// let clientCallee = { userId: null, socketID: null, roomId: null };

// const video = (socket, io) => {
//   socket.on('userEnterRoom', async (userId) => {
//     if (!clientCaller.userId) {
//       clientCaller = { userId, socketID: socket.id, roomId: null };
//       io.to(socket.id).emit('userWaiting', `Hello, waiting for other user...`);
//     } else {
//       clientCallee = { userId, socketID: socket.id, roomId: null };

//       // Create a new room
//       const roomId = await createRoom();
//       if (roomId) {
//         clientCaller.roomId = roomId;
//         clientCallee.roomId = roomId;

//         await addUserBySocketId(roomId, clientCaller.socketID);
//         await addUserBySocketId(roomId, clientCallee.socketID);

//         io.to(clientCaller.socketID).emit('roomReady', `Connecting you to a video chat`);
//         io.to(clientCallee.socketID).emit('roomReady', `Connecting you to a video chat`);
        
//         // Notify both users about the room creation
//         io.to(clientCaller.socketID).emit('notification', { message: 'Room created', roomId });
//         io.to(clientCallee.socketID).emit('notification', { message: 'Room created', roomId });
//       }
//     }
//   });

//   socket.on('videoChatOffer', ({ sdp }) => {
//     if (socket.id === clientCaller.socketID) {
//       io.to(clientCallee.socketID).emit('getVideoChatOffer', sdp);
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

//   socket.on('disconnect', async () => {
//     if (socket.id === clientCaller.socketID || socket.id === clientCallee.socketID) {
//       const roomId = clientCaller.roomId || clientCallee.roomId;
//       if (roomId) {
//         await deleteRoomById(roomId);
        
//         // Notify both users about the room destruction
//         io.to(clientCaller.socketID).emit('notification', { message: 'Room destroyed', roomId });
//         io.to(clientCallee.socketID).emit('notification', { message: 'Room destroyed', roomId });
//       }
//       clientCaller = { userId: null, socketID: null, roomId: null };
//       clientCallee = { userId: null, socketID: null, roomId: null };
//     }
//   });
// };

// module.exports = video;
