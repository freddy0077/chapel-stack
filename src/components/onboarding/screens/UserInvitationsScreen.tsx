import React, { useState, useEffect, useCallback } from 'react';
import { saveOnboardingStepData } from '../utils/onboardingStorage';
import { useCreateUsersWithRole } from '@/graphql/hooks/useUserInvitations';

interface Invitee {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface UserInvitationsScreenProps {
  onNext: (invitees: Invitee[]) => void;
  onBack?: () => void;
  onSkip?: () => void;
  isLoading?: boolean;
}

const ROLE_OPTIONS = [
  // 'SUPER_ADMIN',
  // 'ADMIN',
  'BRANCH_ADMIN',
  // 'MODERATOR',
  // 'USER',
  'MEMBER',
  'PASTOR',
  // 'FINANCE_MANAGER',
  // 'CONTENT_MANAGER',
];

const defaultInvitee = { email: '', firstName: '', lastName: '', role: '' };

const UserInvitationsScreen: React.FC<UserInvitationsScreenProps> = ({ onNext, onBack, onSkip, isLoading }) => {
  const [invitees, setInvitees] = useState<Invitee[]>([{ ...defaultInvitee }]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { createUsersWithRole, loading, error: mutationError } = useCreateUsersWithRole();

  const organisationId = typeof window !== 'undefined' ? localStorage.getItem('organisation_id') || '' : '';

  // Utility for localStorage tracking (shared with other screens)
  const COMPLETED_SCREENS_KEY = 'onboarding_completed_screens';
  const getCompletedScreens = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(COMPLETED_SCREENS_KEY) || '[]');
    } catch {
      return [];
    }
  }, []);
  const markScreenCompleted = useCallback((screen: string) => {
    const screens = getCompletedScreens();
    if (!screens.includes(screen)) {
      screens.push(screen);
      localStorage.setItem(COMPLETED_SCREENS_KEY, JSON.stringify(screens));
    }
  }, [getCompletedScreens]);

  const handleChange = (idx: number, field: keyof Invitee, value: string) => {
    const updated = invitees.map((inv, i) => i === idx ? { ...inv, [field]: value } : inv);
    setInvitees(updated);
  };

  const addInvitee = () => setInvitees([...invitees, { ...defaultInvitee }]);
  const removeInvitee = (idx: number) => setInvitees(invitees.filter((_, i) => i !== idx));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    // Validate all emails are non-empty and valid
    for (const inv of invitees) {
      if (!inv.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inv.email)) {
        setError('Please enter a valid email for every invitee.');
        return;
      }
      if (!inv.role) {
        setError('Please select a role for every invitee.');
        return;
      }
      if (!inv.firstName) {
        setError('Please enter a first name for every invitee.');
        return;
      }
      if (!inv.lastName) {
        setError('Please enter a last name for every invitee.');
        return;
      }
    }
    // Prepare input for mutation
    const users = invitees.map(inv => ({
      email: inv.email,
      password: Math.random().toString(36).slice(-8) + Date.now(), // temporary random password
      firstName: inv.firstName,
      lastName: inv.lastName,
      roleName: inv.role,
    }));
    try {
      console.log('Inviting users:', users);
      if (!organisationId) {
        setError('Organisation ID not found.');
        return;
      }
      const resp = await createUsersWithRole({ variables: { input: { users, organisationId } } });
      console.log('Mutation response:', resp);
      saveOnboardingStepData('UserInvitations', invitees);
      setSuccess('Invitations sent!');
      setTimeout(() => {
        setSuccess(null);
        onNext(invitees);
      }, 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send invitations.');
      console.error('Mutation error:', err);
    }
  };

  // Mark this screen as completed when successful
  useEffect(() => {
    if (success) {
      markScreenCompleted('UserInvitations');
    }
  }, [success, markScreenCompleted]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold mb-2 text-indigo-700">Invite Team Members</h2>
        <p className="mb-6 text-gray-600">Invite others to join your organization. You can add more later.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {invitees.map((invitee, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={invitee.email}
                    onChange={e => handleChange(idx, 'email', e.target.value)}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="user@email.com"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={invitee.firstName}
                    onChange={e => handleChange(idx, 'firstName', e.target.value)}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={invitee.lastName}
                    onChange={e => handleChange(idx, 'lastName', e.target.value)}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    placeholder="Last Name"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={invitee.role}
                    onChange={e => handleChange(idx, 'role', e.target.value)}
                    className="w-full border-2 border-indigo-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
                    required
                  >
                    <option value="">Select role</option>
                    {ROLE_OPTIONS.map(role => (
                      <option key={role} value={role}>{role.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                {invitees.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeInvitee(idx)}
                    className="ml-2 px-2 py-1 rounded bg-red-50 text-red-500 hover:bg-red-100 text-xs font-bold border border-red-200"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addInvitee}
            className="text-indigo-600 font-semibold hover:underline"
          >
            + Add another
          </button>
          {(error || mutationError) && <div className="text-red-500 text-sm mt-2">{error || mutationError.message}</div>}
          {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
          <div className="flex justify-between items-center mt-8 gap-2">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
                disabled={isLoading || loading}
              >
                Back
              </button>
            )}
            {onSkip && (
              <button
                type="button"
                onClick={onSkip}
                className="px-4 py-2 rounded-lg border border-transparent text-indigo-400 font-semibold hover:underline"
                disabled={isLoading || loading}
              >
                Skip
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
              disabled={isLoading || loading}
            >
              {(isLoading || loading) ? 'Sending...' : 'Send Invites'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInvitationsScreen;
