import React, { useState, useEffect } from 'react';
import {
  PawPrint,
  FileText,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Edit,
  BarChart3,
  Users,
  Search,
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { PetFormModal } from '../components/pets/PetFormModal';
import { ApplicationCard } from '../components/applications/ApplicationCard';

export const AdminDashboardPage = () => {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState('pets'); // 'pets' | 'applications' | 'stats'

  // Stats
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Pets
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [petSearch, setPetSearch] = useState('');
  const [selectedPetForEdit, setSelectedPetForEdit] = useState(null);
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);

  // Applications
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [appStatusFilter, setAppStatusFilter] = useState('All');

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.stats.getAdminStats();
      setStats(res.stats);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchPets = async () => {
    setLoadingPets(true);
    try {
      const res = await api.pets.getAll({ limit: 100, status: 'All' });
      setPets(res.pets || []);
    } catch (err) {
      console.error('Failed to load pets:', err);
    } finally {
      setLoadingPets(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await api.applications.getAll({ status: appStatusFilter });
      setApplications(res.applications || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPets();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [appStatusFilter]);

  const handleDeletePet = async (petId, petName) => {
    if (!window.confirm(`Are you sure you want to remove ${petName}? This will also remove any pending applications.`)) {
      return;
    }
    try {
      await api.pets.delete(petId);
      success(`${petName} removed successfully`);
      fetchPets();
      fetchStats();
    } catch (err) {
      toastError(err.message || 'Failed to delete pet');
    }
  };

  const filteredPets = pets.filter((p) => {
    if (!petSearch.trim()) return true;
    const q = petSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.breed.toLowerCase().includes(q) ||
      p.species.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold px-2.5 py-1 rounded-full bg-brand-500 text-white shadow-sm">
              Admin Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Shelter Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage rescues, review adoption applications, and analyze shelter performance.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setSelectedPetForEdit(null);
            setIsPetModalOpen(true);
          }}
          className="shadow-md shadow-brand-500/20"
        >
          Add New Pet Listing
        </Button>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Rescues</span>
            <PawPrint className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats?.totalPets || 0}
          </p>
          <p className="text-[11px] text-slate-500">
            {stats?.availablePets || 0} available for adoption
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Pending Reviews</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-amber-500">
            {stats?.pendingApplications || 0}
          </p>
          <p className="text-[11px] text-slate-500">
            Awaiting shelter approval
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Successfully Adopted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-500">
            {stats?.adoptedPets || 0}
          </p>
          <p className="text-[11px] text-slate-500">
            Forever homes matched
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Applications</span>
            <FileText className="w-4 h-4 text-sky-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {stats?.totalApplications || 0}
          </p>
          <p className="text-[11px] text-slate-500">
            From {stats?.totalUsers || 0} registered adopters
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-6">
        <button
          onClick={() => setActiveTab('pets')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'pets'
              ? 'border-brand-500 text-brand-500'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <PawPrint className="w-4 h-4" />
          Manage Pets ({pets.length})
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 relative ${
            activeTab === 'applications'
              ? 'border-brand-500 text-brand-500'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Adoption Applications ({applications.length})
          {(stats?.pendingApplications || 0) > 0 && (
            <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-bold">
              {stats.pendingApplications}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 border-b-2 ${
            activeTab === 'stats'
              ? 'border-brand-500 text-brand-500'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Analytics Breakdown
        </button>
      </div>

      {/* Tab 1: Pets Management */}
      {activeTab === 'pets' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search pets by name or breed..."
                value={petSearch}
                onChange={(e) => setPetSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-brand-400"
              />
            </div>

            <span className="text-xs text-slate-400">
              Showing {filteredPets.length} pets
            </span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Pet</th>
                    <th className="px-5 py-3.5">Species / Breed</th>
                    <th className="px-5 py-3.5">Age & Size</th>
                    <th className="px-5 py-3.5">Fee</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loadingPets ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                        Loading pets list...
                      </td>
                    </tr>
                  ) : filteredPets.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-slate-400">
                        No pets found.
                      </td>
                    </tr>
                  ) : (
                    filteredPets.map((pet) => (
                      <tr key={pet._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/50 transition-colors">
                        <td className="px-5 py-3.5 flex items-center gap-3">
                          <img
                            src={pet.photos?.[0]}
                            alt={pet.name}
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-slate-100">
                              {pet.name}
                            </span>
                            <span className="block text-[11px] text-slate-400">{pet.location}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {pet.species}
                          </span>
                          <span className="block text-[11px] text-slate-400">{pet.breed}</span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">
                          {pet.age} {pet.ageUnit || 'yrs'} • {pet.size}
                        </td>
                        <td className="px-5 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                          ${pet.adoptionFee}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge
                            variant={
                              pet.status === 'Available'
                                ? 'success'
                                : pet.status === 'Pending'
                                ? 'warning'
                                : 'neutral'
                            }
                            size="sm"
                            dot
                          >
                            {pet.status}
                          </Badge>
                        </td>
                        <td className="px-5 py-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedPetForEdit(pet);
                              setIsPetModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Edit Pet"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePet(pet._id, pet.name)}
                            className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-600 transition-colors"
                            title="Delete Pet"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Applications Review */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {['All', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setAppStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  appStatusFilter === status
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {loadingApps ? (
            <div className="p-12 text-center text-xs text-slate-400">
              Loading applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs">
              No applications in {appStatusFilter} status.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {applications.map((app) => (
                <ApplicationCard
                  key={app._id}
                  application={app}
                  isAdmin={true}
                  onStatusChanged={() => {
                    fetchApplications();
                    fetchStats();
                    fetchPets();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Analytics Breakdown */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Species Distribution
            </h3>
            <div className="space-y-3 text-xs">
              {stats?.speciesStats?.map((s) => (
                <div key={s._id} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-700 dark:text-slate-300">{s._id}s</span>
                    <span className="text-slate-500">{s.count} total ({s.adopted} adopted)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.round((s.count / (stats.totalPets || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Adoption Funnel Performance
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500">Applications Approved Rate</span>
                <span className="font-bold text-emerald-500">
                  {stats?.totalApplications
                    ? Math.round(
                        (stats.approvedApplications / stats.totalApplications) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500">Pending Review Queue</span>
                <span className="font-bold text-amber-500">
                  {stats?.pendingApplications || 0} applications
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500">Available Adoption Capacity</span>
                <span className="font-bold text-brand-500">
                  {stats?.availablePets || 0} slots
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pet Create/Edit Modal */}
      <PetFormModal
        isOpen={isPetModalOpen}
        onClose={() => setIsPetModalOpen(false)}
        pet={selectedPetForEdit}
        onSaved={() => {
          fetchPets();
          fetchStats();
        }}
      />
    </div>
  );
};
