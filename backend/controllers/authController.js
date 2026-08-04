const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// JWT Token එක Generate කරන Helper Function එක
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '30d' });
};

// 1. Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, driverDetails } = req.body;

    // Email එක Clean කිරීම (Simple letters & remove spaces)
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    const userExists = await User.findOne({ email: cleanEmail });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Password Hash කිරීම
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: cleanEmail,
      password: hashedPassword,
      role: role || 'tourist',
      approvalStatus: role === 'driver' ? 'pending' : 'approved',
      driverDetails: role === 'driver' ? driverDetails : {}
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      approvalStatus: user.approvalStatus,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email එක Clean කිරීම
    const cleanEmail = email ? email.toLowerCase().trim() : '';

    const user = await User.findOne({ email: cleanEmail });

    // User කෙනෙක් සිටී නම් සහ Password එක හරිනම්
    if (user && (await bcrypt.compare(password, user.password))) {
      
      // 🛑 DRIVER APPROVAL CHECK
      if (user.role === 'driver') {
        if (user.approvalStatus === 'pending') {
          return res.status(403).json({ 
            message: 'Your account is pending Admin approval. Please wait for verification.' 
          });
        }
        if (user.approvalStatus === 'rejected') {
          return res.status(403).json({ 
            message: 'Your driver application has been rejected by Admin.' 
          });
        }
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approvalStatus: user.approvalStatus,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Get All Approved Drivers
const getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver', approvalStatus: 'approved' }).select('-password');
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Update User Profile Controller
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.gender = req.body.gender || user.gender;

      const updatedUser = await user.save();

      res.json({
        message: 'Profile updated successfully',
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser.phone,
          gender: updatedUser.gender,
          role: updatedUser.role
        }
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile, 
  getDrivers
};