// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwtConfig');

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token.replace('Bearer ', ''), JWT_SECRET, (err, decoded) => { // Ensure token prefix is stripped
    if (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.userID = decoded.userID;
    next();
  });
};
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
      console.log('No authorization header provided');
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
  
  if (!token) {
      console.log('No token provided');
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => { 
      if (err) {
          console.log('Invalid token', err);
          return res.status(401).json({ error: 'Unauthorized: Invalid token' });
      }

      req.userID = decoded.userID; 
      console.log('Token verified, userID:', req.userID);
      next();
  });
};
module.exports = {authenticateJWT,verifyToken};