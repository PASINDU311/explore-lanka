const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Token එක Check කරලා User ව Identify කරගන්න Middleware එක
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Authorization Header එකෙන් Token එක විතරක් වෙන් කරගැනීම
      token = req.headers.authorization.split(' ')[1];

      // Token එක Decode කිරීම
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User ගේ Details සොයාගෙන Request එකට Attach කිරීම (Password එක හැර)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // ඊළඟ Function එකට යන්න අවසර දීම
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized! Invalid Token' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No token provided, authorization denied' });
  }
};

// Roles අනුව Access Control කිරීම (e.g. Admin/Driver විතරක්)
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role '${req.user.role}' is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { protect, authorize };