import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Heart, Calendar, Tag, Info, Sparkles } from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const PetCard = ({ pet, onMeetPet }) => {
  const statusVariants = {
    Available: 'success',
    Pending: 'warning',
    Adopted: 'neutral',
  };

  const photo =
    pet.photos && pet.photos.length > 0
      ? pet.photos[0]
      : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80';

  const isAdopted = pet.status === 'Adopted';

  return (
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
      {/* Photo Container */}
      <Link to={`/pets/${pet._id}`} className="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 block cursor-pointer">
        <img
          src={photo}
          alt={pet.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={statusVariants[pet.status] || 'neutral'}
            size="md"
            dot
            className="shadow-sm backdrop-blur-md bg-white/90 dark:bg-slate-900/90"
          >
            {pet.status}
          </Badge>
        </div>

        {/* Species Pill */}
        <div className="absolute top-3 right-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-900/60 text-white backdrop-blur-md">
            {pet.species}
          </span>
        </div>

        {/* Price / Fee Overlay */}
        <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-100 shadow-sm flex items-center gap-1">
          <Tag className="w-3 h-3 text-brand-500" />
          {pet.adoptionFee === 0 ? 'Free Adoption' : `$${pet.adoptionFee} Fee`}
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <Link to={`/pets/${pet._id}`} className="hover:text-brand-500 transition-colors">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {pet.name}
              </h3>
            </Link>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {pet.gender} • {pet.size}
            </span>
          </div>

          <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mt-0.5">
            {pet.breed}
          </p>

          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            {pet.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />
            <span className="truncate">{pet.location || 'San Francisco, CA'}</span>
          </span>
          <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300 flex-shrink-0">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {pet.age} {pet.ageUnit || (pet.age === 1 ? 'yr' : 'yrs')} old
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {isAdopted ? (
            <div className="col-span-2 text-center py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500">
              Adopted Home 🎉
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onMeetPet ? onMeetPet(pet) : null}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-brand-500 hover:bg-brand-600 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Meet {pet.name}</span>
              </button>

              <Link
                to={`/pets/${pet._id}`}
                className="w-full flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Details</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
