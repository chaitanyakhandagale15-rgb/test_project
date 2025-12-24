const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');
const { error } = require('./result');

/**
 * Middleware to authenticate JWT token
 */
function authenticate(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.send(error('Authorization token missing'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { email, role }
    next();
  } catch (err) {
    return res.send(error('Invalid or expired token'));
  }
}

module.exports = authenticate;
