import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Calendar, Home, CheckCircle2, XCircle, Phone, Mail, User, Info } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const ApplicationCard = ({ application, isAdmin = false, onStatusChanged }) => {
  const { success, error: toastError } = useToast();
  const [loading, setLoading] = useState(false);
  const [showNotesPrompt, setShowNotesPrompt] = useState(false);
  const [actionType, setActionType] = useState(null); // 'approved' or 'rejected'
  const [reviewNotes, setReviewNotes] = useState('');

  const statusVariants = {
    pending: 'warning',
    approved: 'success',
    rejected: 'error',
  };

  const handleAction = async (status) => {
    setActionType(status);
    setShowNotesPrompt(true);
  };

  const submitStatusUpdate = async () => {
    setLoading(true);
    try {
      await api.applications.updateStatus(application._id, {
        status: actionType,
        reviewNotes,
      });

      success(`Application marked as ${actionType}!`);
      setShowNotesPrompt(false);
      if (onStatusChanged) onStatusChanged();
    } catch (err) {
      toastError(err.message || 'Failed to update application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <img
            src={
              application.pet?.photos?.[0] ||
              'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
            }
            alt={application.pet?.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {application.pet?.name || 'Pet'} ({application.pet?.breed || 'Rescue'})
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Species: {application.pet?.species} • Fee: ${application.pet?.adoptionFee || 0}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={statusVariants[application.status] || 'neutral'}
            size="md"
            dot
          >
            {application.status.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Applicant Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-brand-500" /> Applicant
          </span>
          <p className="font-semibold text-slate-800 dark:text-slate-200">
            {application.fullName}
          </p>
          <p className="text-slate-500 flex items-center gap-1">
            <Mail className="w-3 h-3" /> {application.email}
          </p>
          <p className="text-slate-500 flex items-center gap-1">
            <Phone className="w-3 h-3" /> {application.phone}
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Home className="w-3.5 h-3.5 text-brand-500" /> Living Setup
          </span>
          <p className="text-slate-800 dark:text-slate-200">
            {application.housingType} {application.hasYard ? '(Fenced Yard)' : '(No Yard)'}
          </p>
          <p className="text-slate-500">
            Experience: {application.petExperience}
          </p>
          <p className="text-slate-500">
            Household: {application.householdMembers} member(s)
          </p>
        </div>

        <div className="space-y-1">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-brand-500" /> Submission Date
          </span>
          <p className="text-slate-800 dark:text-slate-200">
            {new Date(application.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          {application.hasOtherPets && (
            <p className="text-slate-500">
              Other Pets: {application.otherPetsDetails || 'Yes'}
            </p>
          )}
        </div>
      </div>

      {/* Reason for Adoption */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-xs space-y-1">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Reason for Adoption:
        </span>
        <p className="text-slate-600 dark:text-slate-300 italic">
          "{application.reasonForAdoption}"
        </p>
      </div>

      {/* Review Notes (if already reviewed) */}
      {application.reviewNotes && (
        <div className="bg-brand-50/50 dark:bg-brand-950/20 p-3 rounded-xl border border-brand-100 dark:border-brand-900 text-xs">
          <span className="font-semibold text-brand-700 dark:text-brand-300">
            Shelter Reviewer Notes:
          </span>
          <p className="text-slate-600 dark:text-slate-300 mt-0.5">
            {application.reviewNotes}
          </p>
        </div>
      )}

      {/* Admin Action Buttons */}
      {isAdmin && application.status === 'pending' && !showNotesPrompt && (
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleAction('rejected')}
            icon={XCircle}
          >
            Reject Application
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleAction('approved')}
            icon={CheckCircle2}
          >
            Approve Adoption
          </Button>
        </div>
      )}

      {/* Admin Notes Dialog prompt */}
      {showNotesPrompt && (
        <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-850 space-y-2">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Confirm {actionType.toUpperCase()}: Add review notes for the applicant
          </p>
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            placeholder="Add comments or next steps (meet & greet instructions, background check status)..."
            rows={2}
            className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-brand-400"
          />
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNotesPrompt(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant={actionType === 'approved' ? 'primary' : 'danger'}
              onClick={submitStatusUpdate}
              loading={loading}
            >
              Confirm {actionType}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
