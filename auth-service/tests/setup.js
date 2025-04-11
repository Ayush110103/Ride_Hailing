const mongoose = require('mongoose');


mongoose.set('strictQuery', false);


process.env.MONGO_TEST_URI = 'mongodb://localhost:27017/auth-test';
process.env.JWT_SECRET = 'test-secret';