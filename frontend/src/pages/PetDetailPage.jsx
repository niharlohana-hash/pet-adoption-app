import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Calendar,
  ShieldCheck,
  Tag,
  Check,
  MessageSquare,
  ArrowLeft,
  Share2,
  AlertCircle,
  Edit,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ApplicationModal } from '../components/applications/ApplicationModal';
import { PetFormModal } from '../components/pets/PetFormModal';
import { ChatWidget } from '../components/chat/ChatWidget';

export const PetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const fetchPet = async () => {
    setLoading(true);
    try {
      const res = await api.pets.getById(id);
      setPet(res.pet);
    } catch (err) {
      toastError(err.message || 'Pet not found');
      navigate('/pets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPet();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Adopt ${pet.name}`,
        text: `Meet ${pet.name} on Pawsome Haven!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      success('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-xs text-slate-400">
        Loading pet profile...
      </div>
    );
  }

  if (!pet) return null;

  const statusVariants = {
    Available: 'success',
    Pending: 'warning',
    Adopted: 'neutral',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back Button */}
      <div className="flex items-center justify-between">
        <Link
          to="/pets"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all companions
        </Link>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <Button
              variant="outline"
              size="sm"
              icon={Edit}
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Pet
            </Button>
          )}
          <button
            onClick={handleShare}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Share Pet Profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Photos Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-md">
            <img
              src={pet.photos[selectedPhotoIndex] || pet.photos[0]}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <Badge
                variant={statusVariants[pet.status] || 'neutral'}
                size="lg"
                dot
                className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-md"
              >
                {pet.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Photo Thumbnails */}
          {pet.photos.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {pet.photos.map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedPhotoIndex === idx
                      ? 'border-brand-500 ring-2 ring-brand-200 dark:ring-brand-900 scale-95'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pet Details & Adoption CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400">
                  {pet.species} • {pet.breed}
                </span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {pet.adoptionFee === 0 ? 'Free Adoption' : `$${pet.adoptionFee} Fee`}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                {pet.name}
              </h1>
              <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <MapPin className="w-4 h-4 text-brand-500" />
                {pet.location || 'San Francisco, CA'}
              </p>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-150 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Age</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {pet.age} {pet.ageUnit || 'yrs'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-150 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Gender</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {pet.gender}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-150 dark:border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Size</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  {pet.size}
                </span>
              </div>
            </div>

            {/* Medical & Health Check */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
                Health & Wellness
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Vaccinated</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Spayed/Neutered</span>
                </div>
              </div>
              {pet.healthStatus && (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  Note: {pet.healthStatus}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {pet.status === 'Adopted' ? (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                  🎉 {pet.name} has already found their forever home!
                </div>
              ) : (
                <Button
                  size="lg"
                  variant="primary"
                  fullWidth
                  onClick={() => setIsApplyModalOpen(true)}
                  icon={Heart}
                  className="shadow-lg shadow-brand-500/25"
                >
                  Meet & Adopt {pet.name}
                </Button>
              )}

              {/* Real-time Shelter Chat Button */}
              {isAuthenticated ? (
                <Button
                  size="md"
                  variant="secondary"
                  fullWidth
                  icon={MessageCircle}
                  onClick={() => setIsChatOpen(true)}
                >
                  Ask Shelter Caregivers (Live Chat)
                </Button>
              ) : (
                <p className="text-[11px] text-center text-slate-400">
                  Sign in to chat directly with shelter caregivers.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          About {pet.name}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
          {pet.description}
        </p>
      </div>

      {/* Adoption Application Modal */}
      <ApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        pet={pet}
        onSubmitted={fetchPet}
      />

      {/* Edit Pet Modal (Admin) */}
      {isAdmin && (
        <PetFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          pet={pet}
          onSaved={fetchPet}
        />
      )}

      {/* Floating Live Chat Widget */}
      <ChatWidget
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        selectedPet={pet}
      />
    </div>
  );
};
