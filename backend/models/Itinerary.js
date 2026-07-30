const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripTitle: { type: String, required: true },
  durationDays: { type: Number, required: true },
  travelStyle: { type: String, required: true },
  
  // දවසෙන් දවස යන ස්ථාන ලැයිස්තුව
  dayPlans: [{
    dayNumber: { type: Number },
    placesToVisit: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place' }],
    note: { type: String }
  }],
  
  estimatedBudgetLKR: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', itinerarySchema);