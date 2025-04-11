const express = require('express');
const app = express();
const mongoose = require('mongoose');

// Middleware
app.use(express.json());

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

module.exports = app;