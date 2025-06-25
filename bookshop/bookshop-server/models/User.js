const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    minlength: 8
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  contactNumber: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Generate user ID
userSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      console.log("Generating userId for new user");
      // Generate a random 8-digit user ID
      let userId;
      let isUnique = false;
      let attempts = 0;
      
      while (!isUnique && attempts < 10) {
        attempts++;
        userId = Math.floor(10000000 + Math.random() * 90000000).toString();
        console.log(`Attempt ${attempts}: Generated userId ${userId}`);
        
        // Check if this ID already exists
        const existingUser = await mongoose.models.User.findOne({ userId });
        if (!existingUser) {
          isUnique = true;
          console.log(`userId ${userId} is unique, assigning to user`);
        } else {
          console.log(`userId ${userId} already exists, trying again`);
        }
      }
      
      if (!isUnique) {
        console.error("Failed to generate a unique userId after 10 attempts");
        return next(new Error("Could not generate a unique user ID"));
      }
      
      this.userId = userId;
    }
    next();
  } catch (error) {
    console.error("Error in userId generation:", error);
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 