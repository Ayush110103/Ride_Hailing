const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Order = require('../models/order');
const jwt = require('jsonwebtoken');

describe('Order Service API Tests', () => {
  let validToken;
  let userId;
  let cabId;
  let server;

  beforeAll(async () => {
    // Set Mongoose options to avoid deprecation warnings
    mongoose.set('strictQuery', false);
    
    await mongoose.connect(process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/order-test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    userId = new mongoose.Types.ObjectId();
    cabId = new mongoose.Types.ObjectId();
    
    validToken = jwt.sign(
      { userId, role: 'user' },
      process.env.JWT_SECRET || 'test-secret'
    );

    // Create server instance
    server = app.listen(0);
  });

  beforeEach(async () => {
    await Order.deleteMany({});
  });

  afterEach(async () => {
    await Order.deleteMany({});
  });

  afterAll(async () => {
    // Close server and database connections
    await new Promise((resolve) => server.close(resolve));
    await mongoose.connection.close();
    
    // Add a small delay to ensure all connections are properly closed
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      const response = await request(server) // Use server instead of app
        .post('/api/orders')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          cabId: cabId.toString(),
          pickup: {
            coordinates: [77.580643, 12.972442],
            address: "Pickup Location"
          },
          dropoff: {
            coordinates: [77.590643, 12.982442],
            address: "Dropoff Location"
          }
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.status).toBe('pending');
      expect(response.body.userId).toBe(userId.toString());
    });

    it('should not create order without authentication', async () => {
      const response = await request(server) // Use server instead of app
        .post('/api/orders')
        .send({
          cabId: cabId.toString(),
          pickup: {
            coordinates: [77.580643, 12.972442],
            address: "Pickup Location"
          },
          dropoff: {
            coordinates: [77.590643, 12.982442],
            address: "Dropoff Location"
          }
        });

      expect(response.status).toBe(401);
    });

    it('should not create order with invalid coordinates', async () => {
      const response = await request(server) // Use server instead of app
        .post('/api/orders')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          cabId: cabId.toString(),
          pickup: {
            coordinates: [], // Invalid coordinates
            address: "Pickup Location"
          },
          dropoff: {
            coordinates: [77.590643, 12.982442],
            address: "Dropoff Location"
          }
        });

      expect(response.status).toBe(400);
    });
  });
});