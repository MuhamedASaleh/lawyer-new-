const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized: No token provided' });
//   }

//   jwt.verify(token.replace('Bearer ', ''), JWT_SECRET, (err, decoded) => { // Ensure token prefix is stripped
//     if (err) {
//       return res.status(401).json({ error: 'Unauthorized: Invalid token' });
//     }

//     req.userID = decoded.userID;
//     next();
//   }); 
// };

exports.Auth = (req, res, next) => {

  const token = 
    req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  if (!token) return res.sendStatus(401); // Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

   
    if (err) return res.sendStatus(403); // Forbidden

    console.log(user)
    // req.user = user;


    next();
  });
};
// middleware/authorizeRole.js
exports.AuthorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.sendStatus(403); // Forbidden
    }
    next();
  };
};

// const authenticateJWT = (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     console.log('No authorization header provided');
//     return res.status(401).json({ error: 'Unauthorized: No token provided' });
//   }

//   const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'

//   if (!token) {
//     console.log('No token provided');
//     return res.status(401).json({ error: 'Unauthorized: No token provided' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) {
//       console.log('Invalid token', err);
//       return res.status(401).json({ error: 'Unauthorized: Invalid token' });
//     }

//     req.userID = decoded.userID;
//     console.log('Token verified, userID:', req.userID);
//     next();
//   });
// };
// module.exports = { authenticateJWT, verifyToken };