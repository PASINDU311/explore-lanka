const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['tourist', 'driver', 'admin'], 
    default: 'tourist' 
  },
  avatar: { type: String, default: '' },
  
  // Driver කෙනෙක් නම් පමණක් පිරවිය යුතු විස්තර
  driverDetails: {
    vehicleType: { type: String, enum: ['TukTuk', 'Car', 'Van', 'None'], default: 'None' },
    licenseNumber: { type: String, default: '' },
    pricePerKm: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);