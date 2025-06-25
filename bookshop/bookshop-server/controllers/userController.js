const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'bookshop_secret_key';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    console.log("Registration request received with body:", {
      ...req.body,
      password: req.body.password ? "[HIDDEN]" : undefined
    });
    
    const { firstName, lastName, email, password, contactNumber, address } = req.body;

    // Validate all required fields are present
    if (!firstName || !lastName || !email || !password || !contactNumber || !address) {
      console.log("Missing required fields:", {
        hasFirstName: !!firstName,
        hasLastName: !!lastName,
        hasEmail: !!email,
        hasPassword: !!password,
        hasContactNumber: !!contactNumber,
        hasAddress: !!address
      });
      
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("User already exists with email:", email);
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    console.log("Creating new user...");
    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      contactNumber,
      address,
      // userId will be auto-generated in the pre-save middleware
    });
    
    console.log("User created successfully with ID:", user.userId);

    // Generate token
    const token = generateToken(user.userId);

    // Return success response
    res.status(201).json({
      success: true,
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactNumber: user.contactNumber,
        address: user.address,
        token
      }
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    // More detailed error information
    res.status(500).json({
      success: false,
      message: 'Server Error during registration',
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(user.userId);

    res.status(200).json({
      success: true,
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactNumber: user.contactNumber,
        address: user.address,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    // User is attached to req from the auth middleware
    const user = req.user;

    res.status(200).json({
      success: true,
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactNumber: user.contactNumber,
        address: user.address
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, contactNumber, address, password } = req.body;
    const user = req.user;

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (contactNumber) user.contactNumber = contactNumber;
    if (address) user.address = address;
    if (password) user.password = password;

    // Save updated user
    await user.save();

    // Generate new token
    const token = generateToken(user.userId);

    res.status(200).json({
      success: true,
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactNumber: user.contactNumber,
        address: user.address,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 