const onlineUsers = [];

exports.handleSocketConnection = function (io) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Add user to onlineUsers array
        socket.on('add-user', (userId) => {
            onlineUsers.push({ socketId: socket.id, userId });
            io.emit('update-online-users', { onlineUsers });
        });


        // Join private room
        socket.on('joinRoom', ({ roomId, callerId, calleeId }) => {
            const caller = onlineUsers.find(user => user.userId === callerId);
            const callee = onlineUsers.find(user => user.userId === calleeId);
            if (caller && callee) {
                socket.join(roomId);
                io.to(caller.socketId).emit('join-room', { roomId, callerId, calleeId });
                io.to(callee.socketId).emit('join-room', { roomId, callerId, calleeId });
                io.to(roomId).emit('new-user', { callerId, calleeId });
            } else {
                console.log('Caller or Callee not found');
            }
        });

        // WebRTC signaling for voice and video calls
        socket.on('offer', (data) => {
            io.to(data.target).emit('offer', { sdp: data.sdp, sender: socket.id, video: data.video });
        });

        socket.on('answer', (data) => {
            io.to(data.target).emit('answer', { sdp: data.sdp, sender: socket.id });
        });

        socket.on('candidate', (data) => {
            io.to(data.target).emit('candidate', { candidate: data.candidate });
        });

        socket.on('end-call', ({ roomId, target }) => {
            io.to(roomId).emit('end-call-notification', { target });
            io.socketsLeave(roomId);
        });

        // Disconnect
        socket.on('disconnect', () => {
            const index = onlineUsers.findIndex(user => user.socketId === socket.id);
            if (index !== -1) {
                const userId = onlineUsers[index].userId;
                onlineUsers.splice(index, 1);
                io.emit('user-disconnected', { userId, onlineUsers });
            }
        });
    });
};
