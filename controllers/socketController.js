
// controllers/socketController.js
// exports.handleSocketConnection = function (io) {
//     io.on('connection', (socket) => {
//         console.log('A user connected');
//         // Notify others of the new user
//         socket.broadcast.emit('new-user', { userId: socket.id });

//         // Handle incoming offer
//         socket.on('offer', (data) => {
//             // Notify the target user of the incoming call
//             socket.to(data.target).emit('incomingCall', {
//                 sdp: data.sdp,
//                 caller: socket.id,
//             });
//         });

//         // Handle incoming answer
//         socket.on('answer', (data) => {
//             socket.to(data.target).emit('answer', {
//                 sdp: data.sdp,
//                 callee: socket.id,
//             });
//         });

//         // Handle incoming ICE candidate
//         socket.on('candidate', (data) => {
//             socket.to(data.target).emit('candidate', { candidate: data.candidate });
//         });

//         // Handle end call
//         socket.on('endCall', () => {
//             // Notify the other user that the call has ended
//             socket.broadcast.emit('endCallNotification');
//         });

//         // Handle user disconnection
//         socket.on('disconnect', () => {
//             console.log('A user disconnected');
//         });
//     });
// };

//////////////////

// exports.handleSocketConnection = function (io) {
//     io.on('connection', (socket) => {
//         console.log('A user connected');
//         console.log(socket.id) 
//         // Notify others of the new user
//         socket.broadcast.emit('new-user', { userId: socket.id });

//         // Handle incoming offer
//         socket.on('offer', (data) => {
//             // Notify the target user of the incoming call
//             socket.to(data.target).emit('incomingCall', {
//                 sdp: data.sdp,
//                 caller: socket.id,
//                 video: data.video // Include video flag
//             });
//         });

//         // Handle incoming answer
//         socket.on('answer', (data) => {
//             socket.to(data.target).emit('answer', {
//                 sdp: data.sdp,
//                 callee: socket.id,
//             });
//         });

//         // Handle incoming ICE candidate
//         socket.on('candidate', (data) => {
//             socket.to(data.target).emit('candidate', { candidate: data.candidate });
//         });

//         // Handle end call
//         socket.on('endCall', (data) => {
//             // Notify the other user that the call has ended
//             socket.to(data.target).emit('endCallNotification');
//         });

//         // Handle user disconnection
//         socket.on('disconnect', () => {
//             console.log('A user disconnected');
//         });
//     });
// };

const onlineUsers = [];

exports.handleSocketConnection = function (io) {
    io.on('connection', (socket) => {
        console.log('A user connected');
        console.log(socket.id);

        // Listen for add user to onlineUsers array
        socket.on('add-user', (userId) => {
            onlineUsers.push({ socketId: socket.id, userId });

            // Notify all users of the current online users
            io.emit('update-online-users', { onlineUsers });
        });

        // Listen for join-private-room event with two user IDs
        socket.on('join-private-room', ({ roomId, callerId, calleeId }) => {
            const caller = onlineUsers.find(user => user.userId === callerId);
            const callee = onlineUsers.find(user => user.userId === calleeId);

            if (caller && callee) {
                // Join the specified room
                socket.join(roomId);
                io.to(caller.socketId).emit('join-room', { roomId, callerId, calleeId });
                io.to(callee.socketId).emit('join-room', { roomId, callerId, calleeId });

                console.log(`User ${callerId} and User ${calleeId} joined room ${roomId}`);

                // Notify all users in the room of the new participants
                io.to(roomId).emit('new-user', { callerId, calleeId });
            } else {
                console.log('Caller or Callee not found');
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');

            // Remove the user from the online users array
            const index = onlineUsers.findIndex(user => user.socketId === socket.id);
            if (index !== -1) {
                const userId = onlineUsers[index].userId;
                onlineUsers.splice(index, 1);

                // Notify all users of the user disconnection
                io.emit('user-disconnected', { userId, onlineUsers });
            }
        });

        // Handle WebRTC signaling
        socket.on('offer', (data) => {
            const target = onlineUsers.find(user => user.socketId !== socket.id);
            if (target) {
                io.to(target.socketId).emit('offer', data);
            }
        });

        socket.on('answer', (data) => {
            const target = onlineUsers.find(user => user.socketId !== socket.id);
            if (target) {
                io.to(target.socketId).emit('answer', data);
            }
        });

        socket.on('ice-candidate', (data) => {
            const target = onlineUsers.find(user => user.socketId !== socket.id);
            if (target) {
                io.to(target.socketId).emit('ice-candidate', data);
            }
        });
    });
};

