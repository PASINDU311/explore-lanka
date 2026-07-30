const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Beach', 'Culture', 'Hiking', 'Wildlife', 'Food'],
    required: true 
  },
  district: { type: String, required: true },
  images: [{ type: String }],
  entryFeeUSD: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  
  // Map එකේ exact location එක Mark කරන්න (GeoJSON format)
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true } // [Longitude, Latitude]
  }
}, { timestamps: true });

// Map search වේගවත් කිරීමට GeoSpatial Index එකක් හදමු
placeSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Place', placeSchema);