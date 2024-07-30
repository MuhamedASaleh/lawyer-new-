// controllers/socketController.js
// exports.handleSocketConnection = function (io) {
//     io.on('connection', (socket) => {
//         console.log('A user connected');
//         // Notify others of the new user
//         socket.broadcast.emit('new-user', { userId: socket.id });
//         socket.on('offer', (data) => {
//             socket.to(data.target).emit('offer', {
//                 sdp: data.sdp,
//                 caller: socket.id,
//             });
//         });
//         socket.on('answer', (data) => {
//             socket.to(data.target).emit('answer', {
//                 sdp: data.sdp,
//                 callee: socket.id,
//             });
//         });
//         socket.on('candidate', (data) => {
//             socket.to(data.target).emit('candidate', { candidate: data.candidate });
//         });
//         socket.on('disconnect', () => {
//             console.log('A user disconnected');
//         });
//     });
// };

////////////////////////////////////////////
exports.handleSocketConnection = function (io) {
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('offer', (data) => {
            socket.to(data.target).emit('offer', {
                sdp: data.sdp,
                caller: socket.id,
            });
        });

        socket.on('answer', (data) => {
            socket.to(data.target).emit('answer', {
                sdp: data.sdp,
                callee: socket.id,
            });
        });

        socket.on('candidate', (data) => {
            socket.to(data.target).emit('candidate', { candidate: data.candidate });
        });

        socket.on('endCall', () => {
            socket.broadcast.emit('endCall');
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};
