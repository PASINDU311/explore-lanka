const Booking = require('../models/Booking');

// 1. Create a new booking
const createBooking = async (req, res) => {
  try {
    const { driverId, pickupLocation, travelDate, note } = req.body;

    const booking = await Booking.create({
      tourist: req.user._id,
      driver: driverId,
      pickupLocation,
      travelDate,
      note
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get User/Driver Bookings
const getMyBookings = async (req, res) => {
  try {
    let bookings;
    if (req.user.role === 'driver') {
      bookings = await Booking.find({ driver: req.user._id }).populate('tourist', 'name email');
    } else {
      bookings = await Booking.find({ tourist: req.user._id }).populate('driver', 'name email driverDetails');
    }
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Update Booking Status (Accept / Reject)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Get ALL Bookings (Admin Only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('tourist', 'name email')
      .populate('driver', 'name email driverDetails')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ⚠️ Functions සියල්ල Export කර ඇද්දැයි තහවුරු කරගන්න
module.exports = { createBooking, getMyBookings, updateBookingStatus, getAllBookings };