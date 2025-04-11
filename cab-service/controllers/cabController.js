const Cab = require('../models/cab');

exports.listAvailableCabs = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Location coordinates required' });
    }

    const cabs = await Cab.find({
      isAvailable: true,
      currentLocation: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      }
    });

    res.json({ cabs });
  } catch (error) {
    console.error('Error finding cabs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
