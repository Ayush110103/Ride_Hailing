# Ride Hailing Microservices Application

A modern ride-hailing platform built using microservices architecture, leveraging Node.js, Express, and MongoDB.

## Architecture Overview

The application is divided into four main microservices:

1. **API Gateway** (`api-gateway/`)
   - Entry point for all client requests
   - Handles request routing and load balancing
   - Provides a unified API interface

2. **Auth Service** (`auth-service/`)
   - Manages user authentication and authorization
   - Handles user registration and login
   - Issues JWT tokens for secure communication

3. **Cab Service** (`cab-service/`)
   - Manages cab/driver related operations
   - Handles driver availability and location updates
   - Processes cab booking requests

4. **Order Service** (`order-service/`)
   - Manages ride orders and bookings
   - Handles payment processing
   - Maintains ride history and status

## Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Testing**: Jest, Supertest
- **API Documentation**: HTTP files
- **Containerization**: Docker
- **Authentication**: JWT (JSON Web Tokens)

## Advantages of This Architecture

1. **Scalability**: Each service can be scaled independently based on load
2. **Maintainability**: Services are loosely coupled and can be developed/deployed independently
3. **Resilience**: System remains partially operational even if some services fail
4. **Technology Flexibility**: Each service can potentially use different technologies
5. **Team Organization**: Different teams can work on different services

## Testing Instructions

### Prerequisites
- Node.js installed
- Docker and Docker Compose installed
- HTTP client (like Postman or VS Code REST Client)

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/Ayush110103/Ride_Hailing.git
cd ride-hailing-app
```

2. Start all services using Docker Compose:
```bash
docker-compose up -d
```

### API Testing Sequence

1. **User Registration** (Auth Service)
```http
POST http://localhost:4001/auth/register
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "phone": "+1234567890"
}
```

2. **User Login** (Auth Service)
```http
POST http://localhost:4001/auth/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123"
}
```
- Save the returned JWT token for subsequent requests

3. **Create Order** (Order Service)
```http
POST http://localhost:4003/orders
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "pickup": "123 Main St",
    "destination": "456 Park Ave",
    "requestedCabType": "standard"
}
```

4. **Check Order Status** (Order Service)
```http
GET http://localhost:4003/orders/<order-id>
Authorization: Bearer <your-jwt-token>
```

### Health Checks

Each service has a health check endpoint:
- Auth Service: `GET http://localhost:4001/`
- Cab Service: `GET http://localhost:4002/`
- Order Service: `GET http://localhost:4003/`

## Security Features

1. **JWT Authentication**: All protected endpoints require valid JWT tokens
2. **Request Validation**: Input validation for all API requests
3. **Error Handling**: Standardized error responses across services
4. **Logging**: Request logging for debugging and monitoring

## Development Notes

- Each service has its own Dockerfile for containerization
- Services communicate through REST APIs
- Environment variables are used for configuration
- Middleware handles authentication and logging
- Error handling is standardized across services

## Future Improvements

1. Implement API rate limiting
2. Add service discovery
3. Implement circuit breakers

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## Individual Service Testing

### Auth Service Testing
```bash
# Navigate to auth service directory
cd auth-service

# Install dependencies
npm install

# Start the service independently
npm start
```

Test endpoints using these commands:
```http
### Health Check
GET http://localhost:4001/

### Register User
POST http://localhost:4001/auth/register
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "phone": "+1234567890"
}

### Login User
POST http://localhost:4001/auth/login
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123"
}
```

### Cab Service Testing
```bash
# Navigate to cab service directory
cd cab-service

# Install dependencies
npm install

# Start the service independently
npm start
```

Test endpoints using these commands:
```http
### Health Check
GET http://localhost:4002/

### List Available Cabs
GET http://localhost:4002/cabs
Authorization: Bearer <your-jwt-token>

### Update Cab Location
PUT http://localhost:4002/cabs/:cabId/location
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "latitude": 12.972442,
    "longitude": 77.580643
}

### Update Cab Availability
PUT http://localhost:4002/cabs/:cabId/availability
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "isAvailable": true
}
```

### Order Service Testing
```bash
# Navigate to order service directory
cd order-service

# Install dependencies
npm install

# Start the service independently
npm start
```

Test endpoints using these commands:
```http
### Health Check
GET http://localhost:4003/

### Create New Order
POST http://localhost:4003/orders
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "pickup": {
        "coordinates": [77.580643, 12.972442],
        "address": "Pickup Location"
    },
    "dropoff": {
        "coordinates": [77.590643, 12.982442],
        "address": "Dropoff Location"
    },
    "cabId": "cab-id-here"
}

### Get Order Status
GET http://localhost:4003/orders/:orderId
Authorization: Bearer <your-jwt-token>

### Update Order Status
PUT http://localhost:4003/orders/:orderId/status
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "status": "IN_PROGRESS"
}
```

### API Gateway Testing
```bash
# Navigate to api gateway directory
cd api-gateway

# Install dependencies
npm install

# Start the service independently
npm start
```

Test endpoints using these commands:
```http
### Health Check
GET http://localhost:3000/health

### Test Auth Service through Gateway
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User",
    "phone": "+1234567890"
}

### Test Cab Service through Gateway
GET http://localhost:3000/api/cabs
Authorization: Bearer <your-jwt-token>

### Test Order Service through Gateway
GET http://localhost:3000/api/orders/:orderId
Authorization: Bearer <your-jwt-token>
```

### Running Unit Tests
Each service includes its own test suite:

```bash
# In auth-service directory
cd auth-service
npm test

# In cab-service directory
cd cab-service
npm test

# In order-service directory
cd order-service
npm test

# In api-gateway directory
cd api-gateway
npm test
```

### Environment Setup for Individual Testing
Each service requires its own environment variables. Create a `.env` file in each service directory:

Auth Service `.env`:
```env
PORT=4001
MONGODB_URI=mongodb://localhost:27017/auth
JWT_SECRET=your_jwt_secret
```

Cab Service `.env`:
```env
PORT=4002
MONGODB_URI=mongodb://localhost:27017/cab
JWT_SECRET=your_jwt_secret
```

Order Service `.env`:
```env
PORT=4003
MONGODB_URI=mongodb://localhost:27017/order
JWT_SECRET=your_jwt_secret
```

API Gateway `.env`:
```env
PORT=3000
AUTH_SERVICE_URL=http://localhost:4001
CAB_SERVICE_URL=http://localhost:4002
ORDER_SERVICE_URL=http://localhost:4003
```

### Debugging Individual Services
Each service can be debugged independently using Node.js debugging:

```bash
# Start service in debug mode
node --inspect server.js

# Or using npm script (if configured)
npm run debug
```

Then connect using Chrome DevTools or VS Code debugger.


