import React from 'react';
import { Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';

const speciesList = ['All', 'Dog', 'Cat', 'Rabbit', 'Bird', 'Other'];

export const PetFilters = ({ filters, updateFilter, resetFilters }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Species Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {speciesList.map((sp) => {
          const isSelected = filters.species === sp;
          return (
            <button
              key={sp}
              onClick={() => updateFilter('species', sp)}
              className={`
                px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all
                ${
                  isSelected
                    ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }
              `}
            >
              {sp === 'All' ? '🐾 All Pets' : sp === 'Dog' ? '🐶 Dogs' : sp === 'Cat' ? '🐱 Cats' : sp === 'Rabbit' ? '🐰 Rabbits' : sp === 'Bird' ? '🦜 Birds' : '✨ Other'}
            </button>
          );
        })}
      </div>

      {/* Search and Secondary Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
        {/* Search Bar */}
        <div className="lg:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search by pet name, breed, or location..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
          />
          {filters.search && (
            <button
              onClick={() => updateFilter('search', '')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Gender Filter */}
        <div>
          <select
            value={filters.gender}
            onChange={(e) => updateFilter('gender', e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Size Filter */}
        <div>
          <select
            value={filters.size}
            onChange={(e) => updateFilter('size', e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="All">All Sizes</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
            <option value="Extra Large">Extra Large</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="age_asc">Age: Youngest First</option>
            <option value="age_desc">Age: Oldest First</option>
            <option value="fee_asc">Adoption Fee: Low to High</option>
            <option value="fee_desc">Adoption Fee: High to Low</option>
          </select>
        </div>
      </div>

      {/* Active Filter Indicators & Reset Button */}
      {(filters.search ||
        filters.species !== 'All' ||
        filters.gender !== 'All' ||
        filters.size !== 'All' ||
        filters.sort !== 'newest') && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Filtered results active
          </span>
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:underline font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
};
