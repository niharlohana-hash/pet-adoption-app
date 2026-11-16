const Pet = require('../models/Pet');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get dashboard metrics & stats for admin
// @route   GET /api/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const totalPets = await Pet.countDocuments();
    const availablePets = await Pet.countDocuments({ status: 'Available' });
    const pendingPets = await Pet.countDocuments({ status: 'Pending' });
    const adoptedPets = await Pet.countDocuments({ status: 'Adopted' });

    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const approvedApplications = await Application.countDocuments({ status: 'approved' });
    const rejectedApplications = await Application.countDocuments({ status: 'rejected' });

    const totalUsers = await User.countDocuments({ role: 'user' });

    // Species breakdown
    const speciesStats = await Pet.aggregate([
      {
        $group: {
          _id: '$species',
          count: { $sum: 1 },
          adopted: {
            $sum: { $cond: [{ $eq: ['$status', 'Adopted'] }, 1, 0] },
          },
        },
      },
    ]);

    // Recent applications
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('pet', 'name species photos')
      .populate('applicant', 'name email avatar');

    res.status(200).json({
      success: true,
      stats: {
        totalPets,
        availablePets,
        pendingPets,
        adoptedPets,
        totalApplications,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        totalUsers,
        speciesStats,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
};
