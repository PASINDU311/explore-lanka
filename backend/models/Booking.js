const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tourist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  totalPrice: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);