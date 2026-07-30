const Place = require('../models/Place');

// @desc    Get all places (With Search, Filter & Pagination)
// @route   GET /api/v1/places
const getPlaces = async (req, res) => {
  try {
    const { category, district, search } = req.query;

    // Filter Query එක Build කිරීම
    let query = {};

    if (category) query.category = category;
    if (district) query.district = { $regex: district, $options: 'i' };
    if (search) {
      query.title = { $regex: search, $options: 'i' }; // Case-insensitive search
    }

    const places = await Place.find(query);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single place details by ID
// @route   GET /api/v1/places/:id
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Nearby Places using GeoSpatial Query
// @route   GET /api/v1/places/nearby?lat=6.927&lng=79.861&radius=10000
const getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng, radius } = req.query; // radius in meters (e.g. 10000 = 10km)

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Please provide lat and lng query parameters' });
    }

    // MongoDB 2dsphere GeoSpatial Query
    const places = await Place.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)] // [Longitude, Latitude]
          },
          $maxDistance: parseInt(radius) || 10000 // Default 10km
        }
      }
    });

    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new place (Admin Only)
// @route   POST /api/v1/places
const createPlace = async (req, res) => {
  try {
    const { title, description, category, district, images, entryFeeUSD, coordinates } = req.body;

    const place = await Place.create({
      title,
      description,
      category,
      district,
      images,
      entryFeeUSD,
      location: {
        type: 'Point',
        coordinates: coordinates // [Longitude, Latitude]
      }
    });

    res.status(201).json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update place details (Admin Only)
// @route   PUT /api/v1/places/:id
const updatePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete place (Admin Only)
// @route   DELETE /api/v1/places/:id
const deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlaces,
  getPlaceById,
  getNearbyPlaces,
  createPlace,
  updatePlace,
  deletePlace
};