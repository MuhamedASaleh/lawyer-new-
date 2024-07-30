
// // controllers/socketController.js
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

//         // Handle user disconnection
//         socket.on('disconnect', () => {
//             console.log('A user disconnected');
//         });
//     });
// };



//////////////////////////
// controllers/socketController.js
exports.handleSocketConnection = function (io) {
    io.on('connection', (socket) => {
        console.log('A user connected');
        // Notify others of the new user
        socket.broadcast.emit('new-user', { userId: socket.id });

        socket.on('offer', (data) => {
            socket.to(data.target).emit('incomingCall', {
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

        // Notify the other user when a call ends
        socket.on('endCall', () => {
            socket.broadcast.emit('endCallNotification');
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};
