const Booking = require('../models/Booking');

// 1. Get messages for a specific booking
const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking.messages || []);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error while fetching messages' });
  }
};

// 2. Send a message for a specific booking
const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { sender, text } = req.body;

    if (!text || !sender) {
      return res.status(400).json({ message: 'Sender and text are required' });
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const newMessage = {
      sender, // 'driver' or 'tourist'
      text,
      createdAt: new Date()
    };

    booking.messages.push(newMessage);
    await booking.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
};

// 3. Create New Booking
const createBooking = async (req, res) => {
  try {
    const { driverId, pickupLocation, destination, date, totalPrice } = req.body;

    const booking = await Booking.create({
      tourist: req.user._id,
      driver: driverId,
      pickupLocation,
      destination,
      date,
      totalPrice
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. Get Logged-in Tourist's Bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tourist: req.user._id })
      .populate('driver', 'name email driverDetails')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Get Logged-in Driver's Bookings (Driver ට ලැබුණු Requests)
const getDriverBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ driver: req.user._id })
      .populate('tourist', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. Update Booking Status (Accept / Reject)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. Get All Bookings (For Admin)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('tourist', 'name email')
      .populate('driver', 'name email')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 සියලුම Functions එකම Object එකක් ලෙස Export කිරීම
module.exports = { 
  getMessages,
  sendMessage,
  createBooking, 
  getMyBookings, 
  getDriverBookings,
  updateBookingStatus, 
  getAllBookings 
};