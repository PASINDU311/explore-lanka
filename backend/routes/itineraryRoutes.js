const express = require('express');
const router = express.Router();
const { generateItinerary, getMyItineraries, getItineraryById } = require('../controllers/itineraryController');
const { protect } = require('../middleware/authMiddleware');

// Registered/Logged-in Users ලට පමණයි access තියෙන්නේ
router.post('/generate', protect, generateItinerary);
router.get('/my-trips', protect, getMyItineraries);
router.get('/:id', protect, getItineraryById);

module.exports = router;