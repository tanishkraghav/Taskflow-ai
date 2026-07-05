const Task = require('../models/Task');

/**
 * @desc    Get dashboard stats
 * @route   GET /api/stats
 * @access  Private
 */
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Start of today in local time
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Queries
    const totalTasks = await Task.countDocuments({ user: userId });
    const completedTasks = await Task.countDocuments({ user: userId, completed: true });
    
    const completedToday = await Task.countDocuments({
      user: userId,
      completed: true,
      updatedAt: { $gte: startOfToday },
    });

    const urgentCount = await Task.countDocuments({ user: userId, priority: 'urgent' });
    const importantCount = await Task.countDocuments({ user: userId, priority: 'important' });
    const lowCount = await Task.countDocuments({ user: userId, priority: 'low' });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      totalTasks,
      completedTasks,
      completedToday,
      completionRate,
      columns: {
        urgent: urgentCount,
        important: importantCount,
        low: lowCount,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStats,
};
