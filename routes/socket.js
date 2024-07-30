// routes/socketRoutes.js
const express = require('express');
const router = express.Router();
const { handleSocketConnection } = require('../controllers/socketController');

module.exports = (io) => {
  handleSocketConnection(io); // Initialize the socket connection handler
  router.get('/socket', (req, res) => {
    res.send('Socket.io is set up');
  });
  return router;
};
