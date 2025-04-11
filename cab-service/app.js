const express = require('express');
const jwt = require('jsonwebtoken');
const cabController = require('./controllers/cabController');

const app = express();

app.use(express.json());

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Routes
app.get('/api/cabs', authMiddleware, cabController.listAvailableCabs);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Cab Service is running' });
});

module.exports = app;
