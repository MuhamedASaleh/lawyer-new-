const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const dotenv = require('dotenv');
const sequelize = require('./config/dbConfig');
const cors = require('cors');
const bodyParser = require('body-parser');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const newsRoutes = require('./routes/newsRoutes');
const caseRoutes = require('./routes/caseRoutes');
const questionAnswerRoutes = require('./routes/questionAnswerRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');
const reviewRoutes = require('./routes/reviewRoute');
const errorMiddleWare = require('./middleware/errorMiddleWare');

dotenv.config({ path: '.env' });

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 5050;

app.use(cors({ origin: '*' }));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/api', newsRoutes);
app.use('/api/questionAnswer', questionAnswerRoutes);
app.use('/api', adminRoutes);
app.use('/api', reviewRoutes);
app.use('/api/cases', caseRoutes);

app.use(errorMiddleWare);

// Serve the index.html file at /test endpoint
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

const socketRoute = require('./routes/socket')(io)
app.use('/api', socketRoute);

// Sync database and start server
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database synced');
    server.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
