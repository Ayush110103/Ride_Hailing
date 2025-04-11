const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Cab = require('../models/cab');
const jwt = require('jsonwebtoken');

describe('Cab Service API Tests', () => {
  let validToken;
  
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_TEST_URI);
    
    // Create a test token
    validToken = jwt.sign(
      { userId: new mongoose.Types.ObjectId(), role: 'user' },
      process.env.JWT_SECRET
    );

    // Ensure index is created
    await Cab.collection.createIndex({ currentLocation: '2dsphere' });
  });

  beforeEach(async () => {
    // Clear the database before each test
    await Cab.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /api/cabs', () => {
    it('should return 400 when coordinates are missing', async () => {
      const response = await request(app)
        .get('/api/cabs')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Location coordinates required');
    });

    it('should return nearby available cabs', async () => {
      const testCab = new Cab({
        driverId: new mongoose.Types.ObjectId(),
        vehicleNumber: 'TEST123',
        vehicleType: 'sedan',
        currentLocation: {
          type: 'Point',
          coordinates: [77.580643, 12.972442] // [longitude, latitude]
        },
        isAvailable: true
      });
      await testCab.save();

      const response = await request(app)
        .get('/api/cabs')
        .query({
          latitude: 12.972442,
          longitude: 77.580643,
          radius: 5000
        })
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.cabs).toHaveLength(1);
      expect(response.body.cabs[0].vehicleNumber).toBe('TEST123');
    });
  });
});


