// driverRoutes.get('/')
router.get('/', async (req, res) => {
  try {
    // Only fetch drivers who are APPROVED by Admin
    const drivers = await User.find({ role: 'driver', approvalStatus: 'approved' }).select('-password');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching drivers' });
  }
});