// const express = require('express');
// const http = require('http'); // Add this
// const socketIo = require('socket.io'); // Add this
// const path = require('path');

// const app = express();
// require("dotenv").config({ path: ".env" });
// const sequelize = require('./config/dbConfig');
// const cors = require("cors");
// var bodyParser = require("body-parser");
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const newsRoutes = require('./routes/newsRoutes');
// const caseRoutes = require('./routes/caseRoutes')

// const questionAnswerRoutes = require('./routes/questionAnswerRoutes');
// // const adminRoutes =require('./routes/admin/adminRoutes')

// const adminRoutes = require('./routes/admin/adminRoutes')
// const reviewRoutes = require('./routes/reviewRoute')


// app.use(express.static(path.join(__dirname, 'public/images')));
// let port = process.env.PORT || 5050;


// // Create an HTTP server
// const server = http.createServer(app);

// // Integrate Socket.io with the server
// const io = socketIo(server);

// app.get('/', async (req, res) => {
//   res.send('home')
// });

// //db connection
// sequelize.sync({ force: false })
//   .then(() => {
//     console.log('Database synced');
//     app.listen(port, () => {
//       console.log(`Server is running on http://localhost:${port}`);
//     });
//   })
//   .catch(err => {
//     console.error('Error syncing database:', err);
//   });

// app.use(
//   cors({
//     origin: "*",
//   })
// );



// //body parse
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// // Middleware
// app.use(express.json());
// // Routes
// app.use('/auth', authRoutes);
// app.use('/users', userRoutes);
// // Use the news routes
// app.use('/api', newsRoutes);
// // Use the questionAnswers routes
// app.use('/api/questionAnswer', questionAnswerRoutes);

// // Use the admin routes
// app.use('/api', adminRoutes);
// app.use('/api', reviewRoutes);
// // Use the case routes
// app.use('/api/cases', caseRoutes);


// const errorMiddleWare = require('./middleware/errorMiddleWare')
// app.use(errorMiddleWare);


// // Serve the test HTML file
// app.get('/test', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'test.html'));
// });

// // Socket.io logic
// io.on('connection', (socket) => {
//   console.log('New client connected');

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });

//   // Sample event listener
//   socket.on('message', (data) => {
//     console.log('Message received:', data);
//     io.emit('message', data); // Broadcast the message to all connected clients
//   });

//   // Add additional event listeners here
// });
///////////////////////////////////////////////////
// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');
// const path = require('path');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// app.use(express.static('public'));

// const port = process.env.PORT || 5050;


// // Serve the test HTML file
// app.get('/test', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'test.html'));
// });

// io.on('connection', (socket) => {
//   console.log('New client connected: ' + socket.id);

//   socket.on('callUser', (data) => {
//     io.to(data.userToCall).emit('callUser', {
//       signal: data.signalData,
//       from: socket.id,
//     });
//   });

//   socket.on('answerCall', (data) => {
//     io.to(data.to).emit('callAccepted', {
//       signal: data.signal,
//       from: socket.id,
//     });
//   });

//   socket.on('iceCandidate', (data) => {
//     io.to(data.to).emit('iceCandidate', {
//       candidate: data.candidate,
//     });
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected: ' + socket.id);
//     // Notify other clients about disconnection
//     io.emit('userDisconnected', socket.id);
//   });
// });

// server.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
/////////////////////////////////////////////

const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve the index.html file at /test endpoint
app.get('/test', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Notify others of the new user
    socket.broadcast.emit('new-user', { userId: socket.id });

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
        socket.to(data.target).emit('candidate', data.candidate);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(5050, () => {
    console.log('Server is listening on port 3000');
});
