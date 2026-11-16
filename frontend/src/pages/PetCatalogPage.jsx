import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePets } from '../hooks/usePets';
import { PetFilters } from '../components/pets/PetFilters';
import { PetCard } from '../components/pets/PetCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { Button } from '../components/common/Button';
import { ChevronLeft, ChevronRight, Frown, PawPrint } from 'lucide-react';

export const PetCatalogPage = () => {
  const [searchParams] = useSearchParams();
  const initialSpecies = searchParams.get('species') || 'All';

  const {
    pets,
    loading,
    error,
    totalPages,
    totalCount,
    filters,
    updateFilter,
    resetFilters,
  } = usePets({ species: initialSpecies });

  useEffect(() => {
    const urlSpecies = searchParams.get('species');
    if (urlSpecies && urlSpecies !== filters.species) {
      updateFilter('species', urlSpecies);
    }
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Intro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Adopt a Companion
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Discover lovable animals waiting for their forever homes. Updated in real-time.
          </p>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Showing <span className="font-bold text-slate-800 dark:text-slate-200">{pets.length}</span> of{' '}
          <span className="font-bold text-slate-800 dark:text-slate-200">{totalCount}</span> companions
        </div>
      </div>

      {/* Filter Component */}
      <PetFilters
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
      />

      {/* Error Notice */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Pet Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <SkeletonCard key={i} />
            ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center mx-auto text-2xl">
            <Frown className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            No companions found matching your criteria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, choosing a different species, or resetting your filters.
          </p>
          <Button variant="primary" size="sm" onClick={resetFilters}>
            Reset All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet._id} pet={pet} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-200 dark:border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilter('page', Math.max(1, filters.page - 1))}
            disabled={filters.page <= 1}
            icon={ChevronLeft}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1 text-xs font-semibold px-2">
            Page {filters.page} of {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilter('page', Math.min(totalPages, filters.page + 1))}
            disabled={filters.page >= totalPages}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 ml-1 inline" />
          </Button>
        </div>
      )}
    </div>
  );
};
