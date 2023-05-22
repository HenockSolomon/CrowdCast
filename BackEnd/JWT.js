const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (token) {
    jwt.verify(token, 'your-secret-key', (err, user) => {
      if (err) {
        return res.sendStatus(403); // Invalid token
      }
      req.user = user; // Attach the decoded user data to req.user
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = authenticateJWT;
