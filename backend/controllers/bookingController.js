const Booking = require('../models/Booking');

// @desc    Create a Driver Booking Request (Tourist)
// @route   POST /api/v1/bookings
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

// @desc    Get Bookings for logged-in User (Tourist or Driver)
// @route   GET /api/v1/bookings/my-bookings
const getMyBookings = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'driver') {
      query = { driver: req.user._id };
    } else {
      query = { tourist: req.user._id };
    }

    const bookings = await Booking.find(query)
      .populate('tourist', 'name email')
      .populate('driver', 'name driverDetails');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Booking Status (Driver Only: confirm, reject, complete)
// @route   PATCH /api/v1/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'confirmed', 'rejected', or 'completed'

    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Request එක එව්වේ අදාළ Driver මදැයි බලමු
    if (booking.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus
};