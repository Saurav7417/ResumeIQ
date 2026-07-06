const express = require('express');
const multer = require('multer');
const router = express.Router();

const { signup, login, getProfile, updateProfile } = require('../controllers/authController');
const { uploadAndAnalyze, getUserResumes, getResumeDetails, matchWithJob } = require('../controllers/resumeController');
const { getAdminStats } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Configure Multer for in-memory upload handling
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit files to 10MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'text/plain'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOCX, and TXT files are accepted.'), false);
    }
  }
});

// Authentication Endpoints
router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.get('/auth/profile', protect, getProfile);
router.put('/auth/profile', protect, updateProfile);

// Resume Analysis Endpoints
router.post('/resumes/upload', protect, upload.single('resume'), uploadAndAnalyze);
router.get('/resumes', protect, getUserResumes);
router.get('/resumes/:id', protect, getResumeDetails);
router.post('/resumes/:id/match', protect, matchWithJob);

// Admin Telemetry Endpoint
router.get('/admin/stats', protect, adminOnly, getAdminStats);

module.exports = router;
