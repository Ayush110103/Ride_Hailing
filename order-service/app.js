const express = require('express');
const mongoose = require('mongoose');
const orderController = require('./controllers/orderController');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Order Service is running' });
});

// Order routes
app.post('/api/orders', authMiddleware, orderController.createOrder);

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.path} not found`);
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

module.exports = app;