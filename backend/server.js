const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/places', require('./routes/placeRoutes'));

// 🟢 FIX: Admin Dashboard එකෙන් එන /destinations Request එකත් placeRoutes එකටම යොමු කරන ලදී
app.use('/api/v1/destinations', require('./routes/placeRoutes')); 

app.use('/api/v1/itineraries', require('./routes/itineraryRoutes'));
app.use('/api/v1/bookings', require('./routes/bookingRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));

app.get('/', (req, res) => {
  res.send('ExploreLanka API Running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});