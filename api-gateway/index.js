const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rateLimit = require('express-rate-limit');

const app = express();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(express.json());

// Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
const CAB_SERVICE_URL = process.env.CAB_SERVICE_URL || 'http://localhost:4002';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:4003';

// Proxy middleware configuration
const createProxy = (target) => createProxyMiddleware({
  target,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/auth',     // rewrite path
    '^/api/cabs': '',          // remove /api/cabs
    '^/api/orders': '/api/orders'  // keep as is
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Service temporarily unavailable' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Service routing
app.use('/api/auth', createProxy(AUTH_SERVICE_URL));
app.use('/api/cabs', createProxy(CAB_SERVICE_URL));
app.use('/api/orders', createProxy(ORDER_SERVICE_URL));

// Basic load balancing simulation
let currentServiceIndex = 0;
const services = [
  'http://localhost:4002',
  'http://localhost:4012',  // Additional cab service instance
  'http://localhost:4022'   // Additional cab service instance
];

app.use('/api/cabs-balanced', (req, res, next) => {
  // Round-robin load balancing
  const target = services[currentServiceIndex];
  currentServiceIndex = (currentServiceIndex + 1) % services.length;
  
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/api/cabs-balanced': ''
    }
  })(req, res, next);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    requestId: req.id
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    path: req.path
  });
});

// Function to find an available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = require('net').createServer();
    
    server.listen(startPort, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Port is in use, try the next port
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
  });
};

// Start the server with automatic port selection
const startServer = async () => {
  try {
    const preferredPort = process.env.PORT || 3000;
    const port = await findAvailablePort(preferredPort);
    
    app.listen(port, () => {
      console.log(`API Gateway running on port ${port}`);
      console.log('\nProxying to:');
      console.log(`- Auth Service: ${AUTH_SERVICE_URL}`);
      console.log(`- Cab Service: ${CAB_SERVICE_URL}`);
      console.log(`- Order Service: ${ORDER_SERVICE_URL}`);
      console.log('\nAvailable endpoints:');
      console.log('- GET  /health            - Health check');
      console.log('- ALL  /api/auth/*        - Auth service endpoints');
      console.log('- ALL  /api/cabs/*        - Cab service endpoints');
      console.log('- ALL  /api/orders/*      - Order service endpoints');
      console.log('- ALL  /api/cabs-balanced/* - Load balanced cab service');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

