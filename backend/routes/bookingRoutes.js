const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getMyBookings, 
  getDriverBookings,
  updateBookingStatus, 
  getAllBookings,
  getMessages, 
  sendMessage
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/driver-bookings', protect, getDriverBookings); 
router.patch('/:id/status', protect, updateBookingStatus); 

// 🟢 Chat / Messages සඳහා නව Routes දෙක
router.get('/:id/messages', getMessages);
router.post('/:id/messages', sendMessage);
// Admin Only Route
router.get('/all', protect, authorize('admin'), getAllBookings);

module.exports = router;