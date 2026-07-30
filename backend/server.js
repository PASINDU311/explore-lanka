const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// --- MAIN ROUTES ---
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/places', require('./routes/placeRoutes'));
app.use('/api/v1/itineraries', require('./routes/itineraryRoutes')); // Itinerary Route
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));     // Booking Route

app.get('/', (req, res) => {
  res.send('ExploreLanka API is running successfully!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in port ${PORT}`);
});