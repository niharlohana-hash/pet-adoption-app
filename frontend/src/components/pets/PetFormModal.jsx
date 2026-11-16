import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export const PetFormModal = ({ isOpen, onClose, pet, onSaved }) => {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    ageUnit: 'years',
    gender: 'Male',
    size: 'Medium',
    photosText: '',
    description: '',
    healthStatus: 'Healthy, vaccinated, and microchipped',
    vaccinated: true,
    spayedNeutered: true,
    adoptionFee: 100,
    status: 'Available',
    location: 'San Francisco, CA',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name || '',
        species: pet.species || 'Dog',
        breed: pet.breed || '',
        age: pet.age !== undefined ? pet.age : '',
        ageUnit: pet.ageUnit || 'years',
        gender: pet.gender || 'Male',
        size: pet.size || 'Medium',
        photosText: pet.photos ? pet.photos.join('\n') : '',
        description: pet.description || '',
        healthStatus: pet.healthStatus || 'Healthy, vaccinated, and microchipped',
        vaccinated: pet.vaccinated !== undefined ? pet.vaccinated : true,
        spayedNeutered: pet.spayedNeutered !== undefined ? pet.spayedNeutered : true,
        adoptionFee: pet.adoptionFee !== undefined ? pet.adoptionFee : 100,
        status: pet.status || 'Available',
        location: pet.location || 'San Francisco, CA',
      });
    } else {
      setFormData({
        name: '',
        species: 'Dog',
        breed: '',
        age: '',
        ageUnit: 'years',
        gender: 'Male',
        size: 'Medium',
        photosText: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
        description: '',
        healthStatus: 'Healthy, vaccinated, and microchipped',
        vaccinated: true,
        spayedNeutered: true,
        adoptionFee: 100,
        status: 'Available',
        location: 'San Francisco, CA',
      });
    }
    setErrors({});
  }, [pet, isOpen]);

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
    if (!formData.name.trim()) errs.name = 'Pet name is required';
    if (!formData.breed.trim()) errs.breed = 'Breed is required';
    if (formData.age === '' || isNaN(Number(formData.age)) || Number(formData.age) < 0) {
      errs.age = 'Valid age is required (0 or greater)';
    }
    if (!formData.description.trim()) {
      errs.description = 'Detailed description is required';
    }
    const photos = formData.photosText
      .split('\n')
      .map((url) => url.trim())
      .filter(Boolean);
    if (photos.length === 0) {
      errs.photosText = 'At least one photo URL is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const photos = formData.photosText
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean);

      const payload = {
        name: formData.name.trim(),
        species: formData.species,
        breed: formData.breed.trim(),
        age: Number(formData.age),
        ageUnit: formData.ageUnit,
        gender: formData.gender,
        size: formData.size,
        photos,
        description: formData.description.trim(),
        healthStatus: formData.healthStatus,
        vaccinated: Boolean(formData.vaccinated),
        spayedNeutered: Boolean(formData.spayedNeutered),
        adoptionFee: Number(formData.adoptionFee),
        status: formData.status,
        location: formData.location.trim(),
      };

      if (pet) {
        await api.pets.update(pet._id, payload);
        success(`Pet ${payload.name} updated successfully!`);
      } else {
        await api.pets.create(payload);
        success(`Pet ${payload.name} created and listed successfully!`);
      }

      onSaved();
      onClose();
    } catch (err) {
      toastError(err.message || 'Failed to save pet listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={pet ? `Edit Pet: ${pet.name}` : 'Add New Rescue Pet'}
      subtitle="Fill in pet details for adoption catalog"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Pet Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Buster"
            error={errors.name}
            required
          />

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Species *
            </label>
            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-brand-400"
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Bird">Bird</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
            placeholder="e.g. Golden Retriever"
            error={errors.breed}
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 2"
              error={errors.age}
              required
            />
            <div>
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
                Unit
              </label>
              <select
                name="ageUnit"
                value={formData.ageUnit}
                onChange={handleChange}
                className="w-full py-2.5 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Size *
            </label>
            <select
              name="size"
              value={formData.size}
              onChange={handleChange}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
              <option value="Extra Large">Extra Large</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1">
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs"
            >
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Adopted">Adopted</option>
            </select>
          </div>

          <Input
            label="Adoption Fee ($)"
            type="number"
            name="adoptionFee"
            value={formData.adoptionFee}
            onChange={handleChange}
            placeholder="0"
          />
        </div>

        <Input
          label="Photo URLs (One per line)"
          as="textarea"
          name="photosText"
          value={formData.photosText}
          onChange={handleChange}
          rows={3}
          placeholder="https://images.unsplash.com/...&#10;https://images.unsplash.com/..."
          error={errors.photosText}
          required
        />

        <Input
          label="Description & Bio"
          as="textarea"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Tell prospective adopters about this pet's temperament, favorite activities, and quirks..."
          error={errors.description}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Health Status"
            name="healthStatus"
            value={formData.healthStatus}
            onChange={handleChange}
            placeholder="e.g. Vaccinated, Dewormed, Clean bill of health"
          />

          <Input
            label="Location / Shelter City"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. San Francisco, CA"
          />
        </div>

        {/* Checkboxes */}
        <div className="flex items-center gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="vaccinated"
              checked={formData.vaccinated}
              onChange={handleChange}
              className="rounded text-brand-500 focus:ring-brand-400"
            />
            <span className="text-slate-700 dark:text-slate-300">Vaccinated</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="spayedNeutered"
              checked={formData.spayedNeutered}
              onChange={handleChange}
              className="rounded text-brand-500 focus:ring-brand-400"
            />
            <span className="text-slate-700 dark:text-slate-300">Spayed / Neutered</span>
          </label>
        </div>

        {/* Form Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {pet ? 'Save Changes' : 'Create Listing'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
