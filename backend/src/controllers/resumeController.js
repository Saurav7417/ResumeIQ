const Resume = require('../models/Resume');
const { parseDocument } = require('../services/parserService');
const { analyzeResume, matchJob } = require('../services/aiService');

// Seed mock database global array
global.mockResumes = global.mockResumes || [];

// @desc    Upload and analyze resume
// @route   POST /api/resumes/upload
// @access  Private
const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF or DOCX file' });
    }

    const { originalname, size, buffer, mimetype } = req.file;

    // 1. Parse File
    const textContent = await parseDocument(buffer, originalname, mimetype);
    if (!textContent || textContent.trim() === '') {
      return res.status(400).json({ success: false, message: 'Could not extract text content from file' });
    }

    // 2. Perform AI Analysis
    const aiAnalysis = await analyzeResume(textContent);

    const resumeData = {
      userId: req.user._id || req.user.id,
      filename: originalname,
      fileSize: size,
      parsedText: textContent,
      atsScore: aiAnalysis.atsScore,
      predictedRole: aiAnalysis.predictedRole,
      experienceLevel: aiAnalysis.experienceLevel,
      technicalSkills: aiAnalysis.technicalSkills,
      softSkills: aiAnalysis.softSkills,
      strengths: aiAnalysis.strengths,
      weaknesses: aiAnalysis.weaknesses,
      improvements: aiAnalysis.improvements,
      missingKeywords: aiAnalysis.missingKeywords,
      grammarSuggestions: aiAnalysis.grammarSuggestions,
      jobMatches: [],
      createdAt: new Date()
    };

    let savedResume;

    if (process.env.USE_MOCK_DB === 'true') {
      const mockId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      savedResume = { _id: mockId, ...resumeData };
      global.mockResumes.push(savedResume);
    } else {
      savedResume = await Resume.create(resumeData);
    }

    res.status(201).json({
      success: true,
      message: 'Resume parsed and analyzed successfully',
      data: savedResume
    });
  } catch (error) {
    console.error('[Resume Controller] Upload/Analyze error:', error.message);
    res.status(500).json({ success: false, message: 'Server error processing resume' });
  }
};

// @desc    Get all resumes uploaded by user
// @route   GET /api/resumes
// @access  Private
const getUserResumes = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id).toString();

    if (process.env.USE_MOCK_DB === 'true') {
      const userResumes = global.mockResumes.filter(
        r => r.userId.toString() === userId
      );
      return res.json({ success: true, count: userResumes.length, data: userResumes });
    }

    const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    console.error('[Resume Controller] Get user resumes error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching resumes' });
  }
};

// @desc    Get detailed analysis of a single resume
// @route   GET /api/resumes/:id
// @access  Private
const getResumeDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (process.env.USE_MOCK_DB === 'true') {
      const resume = global.mockResumes.find(r => r._id.toString() === id);
      if (!resume) {
        return res.status(404).json({ success: false, message: 'Resume analysis details not found' });
      }
      return res.json({ success: true, data: resume });
    }

    const resume = await Resume.findById(id);
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume analysis details not found' });
    }

    // Security check: verify this belongs to requester
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to resume' });
    }

    res.json({ success: true, data: resume });
  } catch (error) {
    console.error('[Resume Controller] Get resume details error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching resume details' });
  }
};

// @desc    Compare resume with a job description
// @route   POST /api/resumes/:id/match
// @access  Private
const matchWithJob = async (req, res) => {
  const { id } = req.params;
  const { jobDescription } = req.body;

  if (!jobDescription || jobDescription.trim() === '') {
    return res.status(400).json({ success: false, message: 'Please provide a job description' });
  }

  try {
    let resume;

    if (process.env.USE_MOCK_DB === 'true') {
      resume = global.mockResumes.find(r => r._id.toString() === id);
    } else {
      resume = await Resume.findById(id);
    }

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    // Trigger match
    const matchingResult = await matchJob(resume.parsedText, jobDescription);

    const matchSnapshot = {
      jobDescription,
      matchPercentage: matchingResult.matchPercentage,
      missingSkills: matchingResult.missingSkills,
      suggestedKeywords: matchingResult.suggestedKeywords,
      recommendedCertifications: matchingResult.recommendedCertifications,
      checkedAt: new Date()
    };

    if (process.env.USE_MOCK_DB === 'true') {
      const idx = global.mockResumes.findIndex(r => r._id.toString() === id);
      if (idx !== -1) {
        if (!global.mockResumes[idx].jobMatches) {
          global.mockResumes[idx].jobMatches = [];
        }
        global.mockResumes[idx].jobMatches.unshift(matchSnapshot);
        resume = global.mockResumes[idx];
      }
    } else {
      resume.jobMatches.unshift(matchSnapshot);
      await resume.save();
    }

    res.json({
      success: true,
      message: 'Job description comparison finished',
      data: matchSnapshot
    });
  } catch (error) {
    console.error('[Resume Controller] Job matching error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during job matching' });
  }
};

module.exports = { uploadAndAnalyze, getUserResumes, getResumeDetails, matchWithJob };
