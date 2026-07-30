const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, // 🟢 Email එක auto simple අකුරු කරයි
    trim: true       // 🟢 වටේ තියෙන Spaces අයින් කරයි
  },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['tourist', 'driver', 'admin'], 
    default: 'tourist' 
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: function() {
      return this.role === 'driver' ? 'pending' : 'approved';
    }
  },
  driverDetails: {
    vehicleType: String,
    vehicleNumber: String,
    pricePerKm: Number,
    licenseNumber: String,
    bio: String
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);