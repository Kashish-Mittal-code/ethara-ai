const jwt = require('jsonwebtoken');
const { ROLES } = require('../constants/roles');

const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return next({ status: 401, message: 'No token provided' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return next({ status: 401, message: 'Invalid token format' });
  try {
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    next({ status: 401, message: 'Invalid token' });
  }
};

const authorizeRole = (role) => (req, res, next) => {
  if (!req.user) return next({ status: 401, message: 'Unauthenticated' });
  if (req.user.role !== role && req.user.role !== ROLES.ADMIN) {
    return next({ status: 403, message: 'Forbidden' });
  }
  next();
};

module.exports = { authenticate, authorizeRole };
