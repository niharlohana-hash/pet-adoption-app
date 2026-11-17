import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { Heart, Calendar, Home, CheckCircle2 } from 'lucide-react';

export const ApplicationModal = ({ isOpen, onClose, pet, onSubmitted }) => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    housingType: 'Own House',
    hasYard: false,
    hasOtherPets: false,
    otherPetsDetails: '',
    householdMembers: '2',
    petExperience: 'Experienced pet owner',
    reasonForAdoption: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && pet) {
      setFormData({
        fullName: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || 'San Francisco, CA',
        housingType: 'Own House',
        hasYard: true,
        hasOtherPets: false,
        otherPetsDetails: '',
        householdMembers: '2',
        petExperience: 'Experienced pet owner',
        reasonForAdoption: `We are interested in meeting and adopting ${pet.name}! We have a welcoming home ready.`,
      });
      setErrors({});
    }
  }, [isOpen, pet, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.reasonForAdoption.trim() || formData.reasonForAdoption.trim().length < 10) {
      errs.reasonForAdoption = 'Please write at least 10 characters explaining your meet/adoption request';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        petId: pet._id,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        address: formData.address.trim() || 'Address to be verified at shelter visit',
        housingType: formData.housingType,
        hasYard: Boolean(formData.hasYard),
        hasOtherPets: Boolean(formData.hasOtherPets),
        otherPetsDetails: formData.otherPetsDetails.trim(),
        householdMembers: Number(formData.householdMembers) || 1,
        petExperience: formData.petExperience,
        reasonForAdoption: formData.reasonForAdoption.trim(),
      };

      await api.applications.create(payload);

      success(`Meet & Adoption request for ${pet.name} sent to Shelter Admin Board!`);
      if (onSubmitted) onSubmitted();
      onClose();
    } catch (err) {
      toastError(err.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (!pet) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Request to Meet & Adopt: ${pet.name}`}
      subtitle={`Submit your request to meet ${pet.name} (${pet.breed}). Your request will appear on the Shelter Admin Board.`}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Pet Header Card */}
        <div className="flex items-center gap-3 p-3 bg-brand-50/70 dark:bg-brand-950/30 rounded-2xl border border-brand-200 dark:border-brand-900">
          <img
            src={pet.photos?.[0]}
            alt={pet.name}
            className="w-14 h-14 rounded-xl object-cover"
          />
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>{pet.name}</span>
              <span className="text-xs font-normal text-slate-500">({pet.breed})</span>
            </h4>
            <p className="text-slate-600 dark:text-slate-400 mt-0.5">
              {pet.species} • {pet.age} {pet.ageUnit || 'yrs'} old • {pet.gender} • Adoption Fee: ${pet.adoptionFee}
            </p>
          </div>
        </div>

        {/* Applicant Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Your Full Name"
            name="fullName"
            placeholder="e.g. Alex Morgan"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />
          <Input
            label="Email Address"
            type="email"
            name="email"
            placeholder="alex@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(415) 555-0144"
            error={errors.phone}
            required
          />
          <Input
            label="City / Home Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="San Francisco, CA"
          />
        </div>

        {/* Living Environment */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Housing Type
            </label>
            <select
              name="housingType"
              value={formData.housingType}
              onChange={handleChange}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-brand-400"
            >
              <option value="Own House">Own House</option>
              <option value="Rent House">Rent House</option>
              <option value="Rent Apartment">Rent Apartment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Pet Experience
            </label>
            <select
              name="petExperience"
              value={formData.petExperience}
              onChange={handleChange}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-brand-400"
            >
              <option value="First-time owner">First-time owner</option>
              <option value="Some experience">Some experience</option>
              <option value="Experienced pet owner">Experienced pet owner</option>
            </select>
          </div>

          <Input
            label="Household Members"
            type="number"
            name="householdMembers"
            value={formData.householdMembers}
            onChange={handleChange}
            min="1"
          />
        </div>

        {/* Yard & Other pets */}
        <div className="flex flex-col sm:flex-row gap-4 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="hasYard"
              checked={formData.hasYard}
              onChange={handleChange}
              className="rounded text-brand-500 focus:ring-brand-400"
            />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Fenced yard or spacious patio available
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="hasOtherPets"
              checked={formData.hasOtherPets}
              onChange={handleChange}
              className="rounded text-brand-500 focus:ring-brand-400"
            />
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              Currently have other pets at home
            </span>
          </label>
        </div>

        {formData.hasOtherPets && (
          <Input
            label="Details of Current Pets"
            name="otherPetsDetails"
            value={formData.otherPetsDetails}
            onChange={handleChange}
            placeholder="e.g. 1 senior cat, friendly with dogs"
          />
        )}

        <Input
          label={`Why would you like to meet & adopt ${pet.name}?`}
          as="textarea"
          name="reasonForAdoption"
          value={formData.reasonForAdoption}
          onChange={handleChange}
          rows={3}
          placeholder={`Describe your daily routine, preferred meet & greet times, and how you will welcome ${pet.name}...`}
          error={errors.reasonForAdoption}
          required
        />

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} icon={Heart}>
            Submit Request to Admin Board
          </Button>
        </div>
      </form>
    </Modal>
  );
};
