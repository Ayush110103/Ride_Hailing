const express = require('express');
const mongoose = require('mongoose');
const app = express();
const authController = require('./controllers/authController');

// Important: This middleware must be before routes
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test route to verify service is running
app.get('/', (req, res) => {
  res.json({ message: 'Auth Service is running' });
});

// Auth routes - remove the /api prefix since we're hitting the service directly
app.post('/auth/register', authController.register);
app.post('/auth/login', authController.login);

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`Auth Service running on port ${PORT}`);
});



