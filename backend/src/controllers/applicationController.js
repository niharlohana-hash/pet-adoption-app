const Application = require('../models/Application');
const Pet = require('../models/Pet');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Submit an adoption application
// @route   POST /api/applications
// @access  Private
const createApplication = async (req, res, next) => {
  try {
    const {
      petId,
      fullName,
      email,
      phone,
      address,
      housingType,
      hasYard,
      hasOtherPets,
      otherPetsDetails,
      householdMembers,
      petExperience,
      reasonForAdoption,
    } = req.body;

    // Check pet exists and is available
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
      });
    }

    if (pet.status === 'Adopted') {
      return res.status(400).json({
        success: false,
        message: 'This pet has already been adopted',
      });
    }

    // Check if user already submitted a pending application for this pet
    const existing = await Application.findOne({
      pet: petId,
      applicant: req.user._id,
      status: 'pending',
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active pending application for this pet.',
      });
    }

    const application = await Application.create({
      pet: petId,
      applicant: req.user._id,
      fullName: fullName || req.user.name,
      email: email || req.user.email,
      phone,
      address,
      housingType,
      hasYard: Boolean(hasYard),
      hasOtherPets: Boolean(hasOtherPets),
      otherPetsDetails: otherPetsDetails || '',
      householdMembers: Number(householdMembers) || 1,
      petExperience,
      reasonForAdoption,
    });

    // Optionally update pet status to 'Pending' if currently Available
    if (pet.status === 'Available') {
      pet.status = 'Pending';
      await pet.save();
    }

    // Populate for response
    const populatedApp = await Application.findById(application._id)
      .populate('pet', 'name species breed photos status adoptionFee')
      .populate('applicant', 'name email avatar');

    // Notify admins
    const admins = await User.find({ role: 'admin' });
    const io = req.app.get('io');

    for (const admin of admins) {
      const notif = await Notification.create({
        recipient: admin._id,
        sender: req.user._id,
        type: 'new_application',
        title: 'New Adoption Application',
        message: `${req.user.name} applied to adopt ${pet.name}`,
        data: { applicationId: application._id, petId: pet._id },
      });

      if (io) {
        io.to(`user_${admin._id}`).emit('notification', notif);
      }
    }

    if (io) {
      io.emit('pet_updated', { pet });
    }

    res.status(201).json({
      success: true,
      message: 'Adoption application submitted successfully! Our shelter team will review it shortly.',
      application: populatedApp,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's adoption applications
// @route   GET /api/applications/my
// @access  Private
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('pet', 'name species breed photos status adoptionFee location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all adoption applications (Admin only)
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = async (req, res, next) => {
  try {
    const { status, petId, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (petId) {
      query.pet = petId;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate('pet', 'name species breed photos status adoptionFee')
      .populate('applicant', 'name email avatar phone address')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      count: applications.length,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('pet')
      .populate('applicant', 'name email avatar phone address bio')
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Ensure applicant can only view their own, unless admin
    if (
      req.user.role !== 'admin' &&
      application.applicant._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this application',
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Approve / Reject)
// @route   PATCH /api/applications/:id/status
// @access  Private/Admin
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, reviewNotes } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be pending, approved, or rejected',
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('pet')
      .populate('applicant', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.status = status;
    application.reviewNotes = reviewNotes || application.reviewNotes;
    application.reviewedBy = req.user._id;
    application.reviewedAt = new Date();
    await application.save();

    const pet = await Pet.findById(application.pet._id);

    if (pet) {
      if (status === 'approved') {
        pet.status = 'Adopted';
        await pet.save();

        // Reject other pending applications for this pet
        await Application.updateMany(
          {
            pet: pet._id,
            _id: { $ne: application._id },
            status: 'pending',
          },
          {
            status: 'rejected',
            reviewNotes: 'Pet was successfully adopted by another qualified applicant.',
            reviewedBy: req.user._id,
            reviewedAt: new Date(),
          }
        );
      } else if (status === 'rejected') {
        // Check if there are other pending applications
        const remainingPending = await Application.countDocuments({
          pet: pet._id,
          status: 'pending',
        });
        if (remainingPending === 0) {
          pet.status = 'Available';
          await pet.save();
        }
      }
    }

    // Create persistent notification for the applicant
    const notificationTitle =
      status === 'approved'
        ? `🎉 Application Approved: ${application.pet.name}`
        : `Update on your application for ${application.pet.name}`;

    const notificationMessage =
      status === 'approved'
        ? `Congratulations! Your adoption application for ${application.pet.name} has been approved. Please review details in your dashboard.`
        : `Your application for ${application.pet.name} was reviewed: ${reviewNotes || 'Status updated to ' + status}.`;

    const notification = await Notification.create({
      recipient: application.applicant._id,
      sender: req.user._id,
      type: 'application_status',
      title: notificationTitle,
      message: notificationMessage,
      data: {
        applicationId: application._id,
        petId: application.pet._id,
        status,
      },
    });

    // Real-time notification and status broadcast
    const io = req.app.get('io');
    if (io) {
      // Send real-time notification to applicant
      io.to(`user_${application.applicant._id}`).emit('notification', notification);
      io.to(`user_${application.applicant._id}`).emit('application_status_updated', {
        applicationId: application._id,
        status,
        pet,
      });

      // Broadcast pet status change to all connected clients
      if (pet) {
        io.emit('pet_updated', { pet });
      }
    }

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
};
