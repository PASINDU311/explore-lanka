const express = require('express');
const router = express.Router();
const {
  getPlaces,
  getPlaceById,
  getNearbyPlaces,
  createPlace,
  updatePlace,
  deletePlace
} = require('../controllers/placeController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Public Routes (ඕනෑම අයෙකුට බලන්න පුළුවන්)
router.get('/', getPlaces);
router.get('/nearby', getNearbyPlaces);
router.get('/:id', getPlaceById);

// Protected Admin Routes (Admin ට පමණක් සිදුකළ හැක)
router.post('/', protect, authorize('admin'), createPlace);
router.put('/:id', protect, authorize('admin'), updatePlace);
router.delete('/:id', protect, authorize('admin'), deletePlace);

module.exports = router;