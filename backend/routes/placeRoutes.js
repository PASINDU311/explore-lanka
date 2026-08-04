const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  getPlaces,
  getPlaceById,
  getNearbyPlaces,
  createPlace,
  updatePlace,
  deletePlace
} = require('../controllers/placeController');

const { protect, authorize } = require('../middleware/authMiddleware');

// 🟢 Multer Storage Setup (Upload වන පින්තූර uploads ෆෝල්ඩරයට save කිරීම)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Public Routes
router.get('/', getPlaces);
router.get('/nearby', getNearbyPlaces);
router.get('/:id', getPlaceById);

// 🟢 Protected Admin Routes (upload.single('image') middleware එක එකතු කරන ලදී)
router.post('/', protect, authorize('admin'), upload.single('image'), createPlace);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updatePlace);
router.delete('/:id', protect, authorize('admin'), deletePlace);

module.exports = router;