const Booking = require('../models/Booking');

// 1. Create New Booking
const createBooking = async (req, res) => {
  try {
    const { driverId, pickupLocation, destination, date, totalPrice } = req.body;

    const booking = await Booking.create({
      tourist: req.user._id,
      driver: driverId,
      pickupLocation,
      destination,
      date,
      totalPrice
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get Logged-in Tourist's Bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tourist: req.user._id })
      .populate('driver', 'name email driverDetails')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 3. Get Logged-in Driver's Bookings (Driver ට ලැබුණු Requests)
const getDriverBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ driver: req.user._id })
      .populate('tourist', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Update Booking Status (Accept / Reject)
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

// 5. Get All Bookings (For Admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('tourist', 'name email')
      .populate('driver', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createBooking, 
  getMyBookings, 
  getDriverBookings,
  updateBookingStatus, 
  getAllBookings 
};