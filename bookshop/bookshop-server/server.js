const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const voucherRoutes = require('./routes/voucherRoutes');

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration with specific options
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-Confirm-Delete'],
  credentials: false, // Changed to match frontend setting
  maxAge: 86400 // 24 hours, how long browsers should cache CORS responses
}));

// JSON body parser
app.use(express.json({
  limit: '10mb' // Increase payload size limit if needed
}));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with improved error handling
const MONGODB_URI = 'mongodb+srv://daspi:bmjdaspi810@cluster0d-bookstore.ecagoyx.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected Successfully');
  console.log('Connection string:', MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Masking password for security
})
.catch(err => {
  console.error('MongoDB Connection Error:', err.message);
  console.error('Connection Details:', {
    errorCode: err.code,
    codeName: err.codeName,
    name: err.name
  });
  console.log('Please check your connection string and make sure MongoDB is running');
  
  // Don't exit the process so that the server can still start without DB
  // This allows the frontend to at least get proper error responses
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/vouchers', voucherRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('Bookshop API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Start Server
const PORT = 5001; // Fixed port, ignoring environment variables
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 