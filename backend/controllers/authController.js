const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// JWT Token එකක් Generate කරන Helper Function එක
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new User (Tourist or Driver)
// @route   POST /api/v1/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, driverDetails } = req.body;

    // Email එක කලින් අරන් තියෙනවාද බලන්න
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Password එක Encrypt (Hash) කිරීම
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // New User කෙනෙක් Save කිරීම
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'tourist',
      driverDetails: role === 'driver' ? driverDetails : {}
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate User & Get Token
// @route   POST /api/v1/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User ව Email එකෙන් සොයා ගැනීම
    const user = await User.findOne({ email });

    // User ඉන්නවා නම්, Password එක Match වෙනවාදැයි පරීක්ෂා කිරීම
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Current User Profile
// @route   GET /api/v1/auth/profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };