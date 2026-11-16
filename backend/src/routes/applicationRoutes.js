const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const { validateApplication } = require('../middleware/validate');

// User applications
router.post('/', protect, validateApplication, createApplication);
router.get('/my', protect, getMyApplications);

// Admin view all applications
router.get('/', protect, authorize('admin'), getAllApplications);

// Application details
router.get('/:id', protect, getApplicationById);

// Admin approve/reject
router.patch('/:id/status', protect, authorize('admin'), updateApplicationStatus);

module.exports = router;
