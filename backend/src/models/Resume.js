const mongoose = require('mongoose');

const GrammarSuggestionSchema = new mongoose.Schema({
  original: String,
  suggested: String,
  explanation: String
});

const JobMatchSchema = new mongoose.Schema({
  jobDescription: String,
  matchPercentage: {
    type: Number,
    default: 0
  },
  missingSkills: [String],
  suggestedKeywords: [String],
  recommendedCertifications: [String],
  checkedAt: {
    type: Date,
    default: Date.now
  }
});

const ResumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  parsedText: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    default: 0
  },
  predictedRole: {
    type: String,
    default: 'Unknown'
  },
  experienceLevel: {
    type: String,
    default: 'Entry Level'
  },
  technicalSkills: {
    type: [String],
    default: []
  },
  softSkills: {
    type: [String],
    default: []
  },
  strengths: {
    type: [String],
    default: []
  },
  weaknesses: {
    type: [String],
    default: []
  },
  improvements: {
    type: [String],
    default: []
  },
  missingKeywords: {
    type: [String],
    default: []
  },
  grammarSuggestions: [GrammarSuggestionSchema],
  jobMatches: [JobMatchSchema], // Track multiple matches or the latest
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', ResumeSchema);
