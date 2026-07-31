const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getMyBookings, 
  getDriverBookings,
  updateBookingStatus, 
  getAllBookings 
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/driver-bookings', protect, getDriverBookings); // 👈 Driver ගේ requests සඳහා
router.patch('/:id/status', protect, updateBookingStatus); // 👈 Approve/Reject සඳහා

// Admin Only Route
router.get('/all', protect, authorize('admin'), getAllBookings);

module.exports = router;