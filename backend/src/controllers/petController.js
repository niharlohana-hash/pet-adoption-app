const Pet = require('../models/Pet');
const Application = require('../models/Application');

// @desc    Get all pets with filtering, searching, sorting & pagination
// @route   GET /api/pets
// @access  Public
const getAllPets = async (req, res, next) => {
  try {
    const {
      search,
      species,
      gender,
      size,
      status,
      minAge,
      maxAge,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};

    // Filter by status (default to Available for regular users, or custom if requested)
    if (status) {
      if (status !== 'All') {
        query.status = status;
      }
    } else {
      // Default: show Available and Pending pets
      query.status = { $in: ['Available', 'Pending'] };
    }

    // Filter by species
    if (species && species !== 'All') {
      query.species = species;
    }

    // Filter by gender
    if (gender && gender !== 'All') {
      query.gender = gender;
    }

    // Filter by size
    if (size && size !== 'All') {
      query.size = size;
    }

    // Filter by age range
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }

    // Keyword search across name, breed, description
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { breed: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // newest first by default
    if (sort === 'age_asc') {
      sortOption = { age: 1 };
    } else if (sort === 'age_desc') {
      sortOption = { age: -1 };
    } else if (sort === 'fee_asc') {
      sortOption = { adoptionFee: 1 };
    } else if (sort === 'fee_desc') {
      sortOption = { adoptionFee: -1 };
    } else if (sort === 'name_asc') {
      sortOption = { name: 1 };
    }

    // Pagination
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Pet.countDocuments(query);
    const pets = await Pet.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email avatar');

    res.status(200).json({
      success: true,
      count: pets.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      pets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured pets for homepage
// @route   GET /api/pets/featured
// @access  Public
const getFeaturedPets = async (req, res, next) => {
  try {
    const pets = await Pet.find({ status: 'Available' })
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('createdBy', 'name email avatar');

    res.status(200).json({
      success: true,
      pets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pet by ID
// @route   GET /api/pets/:id
// @access  Public
const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id).populate(
      'createdBy',
      'name email avatar phone'
    );

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found with specified ID',
      });
    }

    res.status(200).json({
      success: true,
      pet,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new pet listing
// @route   POST /api/pets
// @access  Private/Admin
const createPet = async (req, res, next) => {
  try {
    const petData = {
      ...req.body,
      createdBy: req.user._id,
    };

    const pet = await Pet.create(petData);

    // Broadcast real-time event via Socket.IO
    const io = req.app.get('io');
    if (io) {
      io.emit('pet_created', { pet });
    }

    res.status(201).json({
      success: true,
      message: 'Pet listing created successfully',
      pet,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pet listing
// @route   PUT /api/pets/:id
// @access  Private/Admin
const updatePet = async (req, res, next) => {
  try {
    let pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found with specified ID',
      });
    }

    const previousStatus = pet.status;

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('createdBy', 'name email avatar');

    // If status changed or updated, notify connected clients
    const io = req.app.get('io');
    if (io) {
      io.emit('pet_updated', { pet, previousStatus });
    }

    res.status(200).json({
      success: true,
      message: 'Pet listing updated successfully',
      pet,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pet listing
// @route   DELETE /api/pets/:id
// @access  Private/Admin
const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Pet not found with specified ID',
      });
    }

    await pet.deleteOne();

    // Delete or mark associated applications
    await Application.deleteMany({ pet: req.params.id });

    // Broadcast real-time deletion
    const io = req.app.get('io');
    if (io) {
      io.emit('pet_deleted', { petId: req.params.id });
    }

    res.status(200).json({
      success: true,
      message: 'Pet and associated applications removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPets,
  getFeaturedPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
};
