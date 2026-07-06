const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const apiRoutes = require('./src/routes/api');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (incorporates dynamic fallback to Mock Mode)
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    databaseMode: process.env.USE_MOCK_DB === 'true' ? 'MOCK_IN_MEMORY' : 'MONGO_DB'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Global Server Error]:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`ResumeIQ Backend server active at http://localhost:${PORT}`);
  console.log(`Database Mode: ${process.env.USE_MOCK_DB === 'true' ? 'MOCK_IN_MEMORY' : 'MONGO_DB'}`);
  console.log(`API Target Env: http://localhost:${PORT}/api`);
  console.log(`===================================================`);
});
