const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Pet ID is required'],
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Applicant ID is required'],
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Home address is required'],
      trim: true,
    },
    housingType: {
      type: String,
      enum: ['Own House', 'Rent Apartment', 'Rent House', 'Other'],
      default: 'Own House',
    },
    hasYard: {
      type: Boolean,
      default: false,
    },
    hasOtherPets: {
      type: Boolean,
      default: false,
    },
    otherPetsDetails: {
      type: String,
      default: '',
    },
    householdMembers: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 household member is required'],
    },
    petExperience: {
      type: String,
      enum: ['First-time owner', 'Some experience', 'Experienced pet owner'],
      default: 'Experienced pet owner',
    },
    reasonForAdoption: {
      type: String,
      required: [true, 'Please explain why you want to adopt this pet'],
      maxlength: [1000, 'Reason cannot exceed 1000 characters'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    reviewNotes: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate pending applications for the same pet by the same applicant
ApplicationSchema.index({ pet: 1, applicant: 1, status: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);
