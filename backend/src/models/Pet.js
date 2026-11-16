const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add pet name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    species: {
      type: String,
      required: [true, 'Please select a species'],
      enum: ['Dog', 'Cat', 'Rabbit', 'Bird', 'Other'],
      index: true,
    },
    breed: {
      type: String,
      required: [true, 'Please add breed'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Please add age in years or months'],
      min: [0, 'Age cannot be negative'],
    },
    ageUnit: {
      type: String,
      enum: ['years', 'months'],
      default: 'years',
    },
    gender: {
      type: String,
      required: [true, 'Please select gender'],
      enum: ['Male', 'Female'],
    },
    size: {
      type: String,
      required: [true, 'Please select size'],
      enum: ['Small', 'Medium', 'Large', 'Extra Large'],
    },
    photos: {
      type: [String],
      required: [true, 'Please provide at least one photo URL'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A pet must have at least one photo',
      },
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    healthStatus: {
      type: String,
      default: 'Healthy & playful',
    },
    vaccinated: {
      type: Boolean,
      default: true,
    },
    spayedNeutered: {
      type: Boolean,
      default: true,
    },
    specialNeeds: {
      type: Boolean,
      default: false,
    },
    specialNeedsDetails: {
      type: String,
      default: '',
    },
    adoptionFee: {
      type: Number,
      default: 0,
      min: [0, 'Adoption fee cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Available', 'Pending', 'Adopted'],
      default: 'Available',
      index: true,
    },
    location: {
      type: String,
      default: 'San Francisco, CA',
    },
    shelterContact: {
      type: String,
      default: 'contact@pawsome.org',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
PetSchema.index({ name: 'text', breed: 'text', description: 'text' });
PetSchema.index({ species: 1, status: 1 });

module.exports = mongoose.model('Pet', PetSchema);
