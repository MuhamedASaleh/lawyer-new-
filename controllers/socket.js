const io = require('socket.io')(3000);
const { v4: uuidv4 } = require('uuid'); // For generating unique room IDs

const onlineUsers = {}; // Object to store online users
const activeRooms = {}; // Object to store active rooms

exports.handleSocketConnection = function (io) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // Handle new user
        socket.on('new-user', (data) => {
            console.log('New user event received');
            onlineUsers[socket.id] = { userId: data.userId };
            io.emit('update-online-users', { onlineUsers });
            console.log('Online users updated');
            console.log(onlineUsers);

        });

        // Join private room
        socket.on('joinRoom', ({ callerId, calleeId }) => {
            // Find the socket ID of the caller and callee
            const callerSocketId = Object.keys(onlineUsers).find(onlineUsers => onlineUsers === callerId);
            const calleeSocketId = Object.keys(onlineUsers).find(onlineUsers => onlineUsers === calleeId);
            console.log(calleeSocketId)
            console.log(callerSocketId)
            if (callerSocketId && calleeSocketId) {
                const roomId = uuidv4(); // Generate unique room ID
                socket.join(roomId);
                io.to(callerSocketId).emit('join-room', { roomId, callerId, calleeId });
                io.to(calleeSocketId).emit('join-room', { roomId, callerId, calleeId });
                io.to(roomId).emit('new-user', { callerId, calleeId });
                activeRooms[roomId] = [callerSocketId, calleeSocketId];
                console.log(`Room created: ${roomId}`);
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

        socket.on('end-call', ({ roomId }) => {
            io.to(roomId).emit('end-call-notification');
            io.socketsLeave(roomId);
            delete activeRooms[roomId];
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
            if (onlineUsers[socket.id]) {
                const userId = onlineUsers[socket.id].userId;
                delete onlineUsers[socket.id];
                io.emit('update-online-users', { onlineUsers });
                io.emit('user-disconnected', { userId });
                console.log('User removed and online users updated');

                // Remove the room if the user was part of it
                Object.keys(activeRooms).forEach(roomId => {
                    if (activeRooms[roomId].includes(socket.id)) {
                        io.to(roomId).emit('end-call-notification');
                        io.socketsLeave(roomId);
                        delete activeRooms[roomId];
                    }
                });
            }
        });
    });
};
