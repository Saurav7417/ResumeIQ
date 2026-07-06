const User = require('../models/User');
const Resume = require('../models/Resume');

// @desc    Get dashboard telemetry and analytics for Admins
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    let totalUsers = 0;
    let totalAnalyses = 0;
    let averageAtsScore = 0;
    let usersList = [];
    
    if (process.env.USE_MOCK_DB === 'true') {
      usersList = global.mockUsers.map(u => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        profileCompletion: u.profileCompletion,
        createdAt: u.createdAt
      }));
      
      totalUsers = usersList.length;
      totalAnalyses = global.mockResumes.length;
      
      if (totalAnalyses > 0) {
        const sum = global.mockResumes.reduce((acc, r) => acc + r.atsScore, 0);
        averageAtsScore = Math.round(sum / totalAnalyses);
      } else {
        averageAtsScore = 75; // Default display for clean visual layout
      }
    } else {
      totalUsers = await User.countDocuments();
      totalAnalyses = await Resume.countDocuments();
      
      const avgAggregate = await Resume.aggregate([
        { $group: { _id: null, avgScore: { $avg: '$atsScore' } } }
      ]);
      
      averageAtsScore = avgAggregate.length > 0 ? Math.round(avgAggregate[0].avgScore) : 0;
      
      usersList = await User.find({}).select('-password').sort({ createdAt: -1 });
    }

    // Generate mock API telemetry charts data over recent months
    const apiUsageTrend = [
      { month: 'Jan', requests: 120, tokens: 45000 },
      { month: 'Feb', requests: 280, tokens: 98000 },
      { month: 'Mar', requests: 450, tokens: 180000 },
      { month: 'Apr', requests: 790, tokens: 320000 },
      { month: 'May', requests: 1200, tokens: 490000 },
      { month: 'Jun', requests: 1850, tokens: 780000 },
      { month: 'Jul', requests: 2400, tokens: 990000 }
    ];

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAnalyses,
        averageAtsScore,
        apiUsage: {
          totalRequests: apiUsageTrend.reduce((acc, item) => acc + item.requests, 0),
          totalTokens: apiUsageTrend.reduce((acc, item) => acc + item.tokens, 0),
          trend: apiUsageTrend
        }
      },
      users: usersList
    });
  } catch (error) {
    console.error('[Admin Controller] Admin telemetry failed:', error.message);
    res.status(500).json({ success: false, message: 'Server error retrieving telemetry stats' });
  }
};

module.exports = { getAdminStats };
