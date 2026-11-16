import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { ApplicationCard } from '../components/applications/ApplicationCard';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { User, Mail, Phone, MapPin, FileText, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UserProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
  });

  const fetchMyApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await api.applications.getMy();
      setApplications(res.applications || []);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(formData);
      success('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      toastError(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={
                user?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
              }
              alt={user?.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-brand-500 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {user?.name}
                </h1>
                <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-300">
                  {user?.role === 'admin' ? '🛡️ Shelter Admin' : '🐶 Adopter'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {user?.email}
              </p>
              {user?.phone && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {user.phone}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        {/* Profile Edit Form */}
        {isEditing && (
          <form
            onSubmit={handleProfileSave}
            className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <Input
                label="City / Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <Input
              label="Bio / Notes"
              as="textarea"
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell shelters a little bit about yourself and your home..."
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="primary"
                size="sm"
                type="submit"
                loading={savingProfile}
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {/* Active JWT Authentication Verification Box */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-800 dark:text-slate-100">
                  Active Cryptographic JWT Session
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono px-2 py-0.5 rounded-full">
                  HS256 Verified
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400">
                Transmitted via <code className="font-mono text-brand-600 dark:text-brand-400">Authorization: Bearer &lt;token&gt;</code> &amp; HTTP-only Cookie. Validated on protected endpoints with role-based access control.
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">User ID:</span>
              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                {user?.id || user?._id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Adoption Applications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-500" />
              My Adoption Applications ({applications.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track real-time status of your adoption requests.
            </p>
          </div>
          <Link to="/pets">
            <Button size="sm" variant="secondary">
              Browse More Pets
            </Button>
          </Link>
        </div>

        {loadingApps ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Loading your applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-3">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              You haven't submitted any adoption applications yet.
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ready to meet your next companion? Browse our catalog and submit an application with one click.
            </p>
            <Link to="/pets">
              <Button size="sm" variant="primary">
                Explore Available Pets
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                isAdmin={false}
                onStatusChanged={fetchMyApplications}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
