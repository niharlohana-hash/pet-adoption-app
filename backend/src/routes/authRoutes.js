const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
} = require('../middleware/validate');

// Public Auth Endpoints
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

// Protected Auth Endpoints (JWT Verification Required)
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
