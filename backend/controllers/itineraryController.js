const Itinerary = require('../models/Itinerary');
const Place = require('../models/Place');

// @desc    Generate and Save AI Travel Itinerary
// @route   POST /api/v1/itineraries/generate
const generateItinerary = async (req, res) => {
  try {
    const { tripTitle, durationDays, travelStyle, estimatedBudgetLKR } = req.body;

    // 1. Travel style එකට අදාළ Places DB එකෙන් Extract කිරීම
    let categoryFilter = 'Culture';
    if (travelStyle === 'Beach & Relaxation') categoryFilter = 'Beach';
    if (travelStyle === 'Adventure & Hiking') categoryFilter = 'Hiking';
    if (travelStyle === 'Wildlife Safari') categoryFilter = 'Wildlife';

    const matchingPlaces = await Place.find({ category: categoryFilter });

    // 2. දවස් ගණන අනුව Places වෙන් කර Day Plans හදාගැනීමේ Logic එක
    const dayPlans = [];
    let placeIndex = 0;

    for (let day = 1; day <= durationDays; day++) {
      const placesForToday = [];
      
      // දවසකට Places 2 බැගින් Assign කිරීම (උදාහරණයකට)
      if (matchingPlaces.length > 0) {
        if (matchingPlaces[placeIndex]) placesForToday.push(matchingPlaces[placeIndex]._id);
        if (matchingPlaces[placeIndex + 1]) placesForToday.push(matchingPlaces[placeIndex + 1]._id);
        placeIndex += 2;
      }

      dayPlans.push({
        dayNumber: day,
        placesToVisit: placesForToday,
        note: `Day ${day} plan tailored for ${travelStyle}`
      });
    }

    // 3. Database එකේ Save කිරීම
    const itinerary = await Itinerary.create({
      user: req.user._id,
      tripTitle,
      durationDays,
      travelStyle,
      dayPlans,
      estimatedBudgetLKR
    });

    const populatedItinerary = await Itinerary.findById(itinerary._id).populate('dayPlans.placesToVisit');

    res.status(201).json(populatedItinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get All Itineraries of Logged-in User
// @route   GET /api/v1/itineraries/my-trips
const getMyItineraries = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user._id })
      .populate('dayPlans.placesToVisit');
    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Single Itinerary Details
// @route   GET /api/v1/itineraries/:id
const getItineraryById = async (req, res) => {
  try {
    const itinerary = await Itinerary.findById(req.params.id)
      .populate('dayPlans.placesToVisit');
      
    if (!itinerary) return res.status(404).json({ message: 'Itinerary not found' });
    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  generateItinerary,
  getMyItineraries,
  getItineraryById
};