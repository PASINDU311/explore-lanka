const Place = require('../models/Place');

// 1. Get All Places
const getPlaces = async (req, res) => {
  try {
    const places = await Place.find().sort({ createdAt: -1 });
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get Place By ID
const getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json(place);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get Nearby Places
const getNearbyPlaces = async (req, res) => {
  try {
    const places = await Place.find().limit(6);
    res.json(places);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 4. Create New Place / Destination (Safe Version with Defaults)
const createPlace = async (req, res) => {
  try {
    const { 
      name, 
      title, 
      description, 
      category, 
      province, 
      district, 
      imageUrl, 
      image, 
      entryFee, 
      price 
    } = req.body;

    const placeName = name || title;

    if (!placeName) {
      return res.status(400).json({ message: 'Place name or title is required' });
    }

    // Mongoose Model එකේ required fields සඳහා Default values ලබා දීම
    const newPlace = await Place.create({
      name: placeName,
      title: placeName,
      description: description || 'No description provided',
      category: category || 'Culture',
      province: province || district || 'General',
      district: district || 'Colombo',
      imageUrl: imageUrl || image || 'https://via.placeholder.com/300',
      images: imageUrl ? [imageUrl] : [],
      entryFee: Number(entryFee || price || 0),
      price: Number(entryFee || price || 0),
      location: {
        type: 'Point',
        coordinates: [0, 0]
      }
    });

    res.status(201).json(newPlace);
  } catch (error) {
    console.error('❌ Mongoose Place Creation Error:', error.message);
    res.status(400).json({ message: error.message });
  }
};

// 5. Update Place
const updatePlace = async (req, res) => {
  try {
    const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedPlace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Delete Place
const deletePlace = async (req, res) => {
  try {
    await Place.findByIdAndDelete(req.params.id);
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