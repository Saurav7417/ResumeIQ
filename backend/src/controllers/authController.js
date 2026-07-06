const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

// Seed mock database with an admin user if in-memory
const seedMockAdmin = async () => {
  if (!global.mockUsers) global.mockUsers = [];
  const adminExists = global.mockUsers.some(u => u.email === 'admin@resumeiq.com');
  
  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('AdminPass123!', salt);
    
    global.mockUsers.push({
      _id: '507f1f77bcf86cd799439011',
      name: 'System Administrator',
      email: 'admin@resumeiq.com',
      password: hashedPassword,
      role: 'admin',
      profileCompletion: 100,
      skills: ['Security Auditing', 'Systems Administration', 'Telemetry Orchestration'],
      experienceLevel: 'Executive',
      createdAt: new Date()
    });
    console.log('[Mock DB] Seeded default mock admin account: admin@resumeiq.com / AdminPass123!');
  }
};

// Auto seed on startup if using mock DB
seedMockAdmin();

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide all details' });
  }

  try {
    if (process.env.USE_MOCK_DB === 'true') {
      const exists = global.mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const mockId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      const newUser = {
        _id: mockId,
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'user',
        profileCompletion: 30,
        skills: [],
        experienceLevel: 'Not Specified',
        createdAt: new Date()
      };

      global.mockUsers.push(newUser);
      
      return res.status(201).json({
        success: true,
        token: generateToken(mockId),
        user: {
          id: mockId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          profileCompletion: newUser.profileCompletion,
          skills: newUser.skills,
          experienceLevel: newUser.experienceLevel
        }
      });
    }

    // Real DB save
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    
    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileCompletion: user.profileCompletion,
        skills: user.skills,
        experienceLevel: user.experienceLevel
      }
    });
  } catch (error) {
    console.error('[Auth Controller] Signup error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please enter email and password' });
  }

  try {
    if (process.env.USE_MOCK_DB === 'true') {
      const user = global.mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }

      return res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileCompletion: user.profileCompletion,
          skills: user.skills,
          experienceLevel: user.experienceLevel
        }
      });
    }

    // Real DB fetch
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileCompletion: user.profileCompletion,
          skills: user.skills,
          experienceLevel: user.experienceLevel
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('[Auth Controller] Login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Get user profile data
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: {
        id: req.user._id || req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profileCompletion: req.user.profileCompletion,
        skills: req.user.skills,
        experienceLevel: req.user.experienceLevel,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('[Auth Controller] Profile retrieval error:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  const { name, skills, experienceLevel } = req.body;

  try {
    // Calculate profile completeness score
    let score = 30;
    if (name) score += 20;
    if (skills && skills.length > 0) score += 30;
    if (experienceLevel && experienceLevel !== 'Not Specified') score += 20;

    if (process.env.USE_MOCK_DB === 'true') {
      const idx = global.mockUsers.findIndex(u => u._id.toString() === req.user._id.toString());
      if (idx !== -1) {
        if (name) global.mockUsers[idx].name = name;
        if (skills) global.mockUsers[idx].skills = skills;
        if (experienceLevel) global.mockUsers[idx].experienceLevel = experienceLevel;
        global.mockUsers[idx].profileCompletion = score;

        return res.json({
          success: true,
          user: {
            id: global.mockUsers[idx]._id,
            name: global.mockUsers[idx].name,
            email: global.mockUsers[idx].email,
            role: global.mockUsers[idx].role,
            profileCompletion: global.mockUsers[idx].profileCompletion,
            skills: global.mockUsers[idx].skills,
            experienceLevel: global.mockUsers[idx].experienceLevel
          }
        });
      }
      return res.status(404).json({ success: false, message: 'Mock user not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (skills) user.skills = skills;
    if (experienceLevel) user.experienceLevel = experienceLevel;
    user.profileCompletion = score;

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileCompletion: updatedUser.profileCompletion,
        skills: updatedUser.skills,
        experienceLevel: updatedUser.experienceLevel
      }
    });
  } catch (error) {
    console.error('[Auth Controller] Profile update error:', error.message);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};

module.exports = { signup, login, getProfile, updateProfile, seedMockAdmin };
