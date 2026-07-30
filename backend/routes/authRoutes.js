const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  getDrivers 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/drivers', getDrivers);

// Protected Routes
router.get('/profile', protect, getUserProfile);

module.exports = router;