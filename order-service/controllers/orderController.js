const Order = require('../models/order');

class OrderController {
  constructor() {
    // Bind methods to preserve 'this' context
    this.createOrder = this.createOrder.bind(this);
  }

  async createOrder(req, res) {
    try {
      const { cabId, pickup, dropoff } = req.body;
      const userId = req.user.userId;

      // Validate coordinates
      if (!this.isValidCoordinates(pickup?.coordinates) || !this.isValidCoordinates(dropoff?.coordinates)) {
        return res.status(400).json({ error: 'Invalid coordinates' });
      }

      // Calculate price (simplified version - you might want to add actual price calculation logic)
      const price = 500; // Default price, replace with actual calculation

      const order = new Order({
        userId,
        cabId,
        pickup: {
          type: 'Point',
          coordinates: pickup.coordinates,
          address: pickup.address
        },
        dropoff: {
          type: 'Point',
          coordinates: dropoff.coordinates,
          address: dropoff.address
        },
        price
      });

      await order.save();
      res.status(201).json(order);
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  isValidCoordinates(coordinates) {
    return Array.isArray(coordinates) && 
           coordinates.length === 2 && 
           typeof coordinates[0] === 'number' && 
           typeof coordinates[1] === 'number' &&
           coordinates[0] >= -180 && coordinates[0] <= 180 && 
           coordinates[1] >= -90 && coordinates[1] <= 90;
  }
}

module.exports = new OrderController();

