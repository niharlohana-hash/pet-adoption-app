const express = require('express');
const router = express.Router();
const {
  getAllPets,
  getFeaturedPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} = require('../controllers/petController');
const { protect, authorize } = require('../middleware/auth');
const { validatePet } = require('../middleware/validate');

router.get('/', getAllPets);
router.get('/featured', getFeaturedPets);
router.get('/:id', getPetById);

// Admin-only endpoints
router.post('/', protect, authorize('admin'), validatePet, createPet);
router.put('/:id', protect, authorize('admin'), updatePet);
router.delete('/:id', protect, authorize('admin'), deletePet);

module.exports = router;
