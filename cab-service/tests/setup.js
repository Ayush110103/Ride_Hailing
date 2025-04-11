const mongoose = require('mongoose');

// Configure mongoose
mongoose.set('strictQuery', false);

// Set environment variables
process.env.MONGO_TEST_URI = 'mongodb://localhost:27017/cab-test';
process.env.JWT_SECRET = 'test-secret';

