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



const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
require("dotenv").config({ path: ".env" });
const sequelize = require('./config/dbConfig');
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, 'public')));
let port = process.env.PORT || 5050;

// Create an HTTP server
const server = http.createServer(app);

// Integrate Socket.io with the server
const io = socketIo(server);

app.get('/', (req, res) => {
  res.send('home');
});

// db connection
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synced');
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve the test HTML file
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    socket.broadcast.emit('callEnded');
  });

  socket.on('setUsername', (username) => {
    socket.username = username;
    io.emit('updateUsers', getUsers());
  });

  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('callUser', { signal: data.signalData, from: socket.id, name: socket.username });
  });

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', { signal: data.signal, from: socket.id });
  });

  socket.on('iceCandidate', (data) => {
    io.to(data.to).emit('iceCandidate', { candidate: data.candidate });
  });

  function getUsers() {
    const clients = io.sockets.sockets;
    const users = {};
    for (const id in clients) {
      users[id] = clients[id].username || 'Anonymous';
    }
    return users;
  }
});
