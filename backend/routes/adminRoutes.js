const express = require('express');
const router = express.Router();
const User = require('../models/User');

// All Drivers fetch කිරීම (Pending & Approved දෙගොල්ලන්ම)
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' }).select('-password');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching drivers' });
  }
});

// Driver Status වෙනස් කිරීම (Approve / Reject)
router.patch('/drivers/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const driver = await User.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: status },
      { new: true }
    ).select('-password');
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: 'Error updating status' });
  }
});

// Driver Remove කිරීම
router.delete('/drivers/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Driver removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing driver' });
  }
});

module.exports = router;