const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');
const { validateApplication } = require('../middleware/validate');

// Adopter Meet & Adoption request submission (accessible to both logged-in users and new adopters)
router.post('/', optionalAuth, validateApplication, createApplication);

// User's personal applications
router.get('/my', protect, getMyApplications);

// Admin view all applications
router.get('/', protect, authorize('admin'), getAllApplications);

// Application details
router.get('/:id', protect, getApplicationById);

// Admin approve/reject
router.patch('/:id/status', protect, authorize('admin'), updateApplicationStatus);

module.exports = router;
