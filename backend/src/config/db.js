const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/resumeiq';
  console.log(`[Database] Attempting to connect to MongoDB: ${mongoURI}`);

  try {
    // Set 3 second timeout for quick fallback verification
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log('[Database] MongoDB connected successfully.');
    process.env.USE_MOCK_DB = 'false';
  } catch (error) {
    console.warn(`[Database] MongoDB connection failed: ${error.message}`);
    console.warn('[Database] Falling back to IN-MEMORY MOCK database mode for evaluation.');
    process.env.USE_MOCK_DB = 'true';
  }
};

module.exports = connectDB;
