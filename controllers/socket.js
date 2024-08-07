// const io = require('socket.io')(3000);
// const { v4: uuidv4 } = require('uuid'); // For generating unique room IDs

const user = require('./socket/pubsub/users')
const video = require('./socket/pubsub/video')
exports.handleSocketConnection = function (io) {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        user(socket, io);
        video(socket, io);
       
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
