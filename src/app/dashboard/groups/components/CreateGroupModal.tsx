import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSmallGroupMutations, SmallGroupStatus } from '../../../../graphql/hooks/useSmallGroups';
import { useQuery } from '@apollo/client';
import { GET_BRANCHES } from '@/graphql/queries/branchQueries';
import { useAuth } from '@/contexts/AuthContext';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';

interface CreateGroupModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  branchId: string | undefined;
  afterCreate?: () => void;
}

export default function CreateGroupModal({ isOpen, setIsOpen, branchId: propBranchId, afterCreate }: CreateGroupModalProps) {
  const { user } = useAuth();
  const { organisationId, branchId: defaultBranchId } = useOrganisationBranch();
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const branchId = user?.primaryRole === "super_admin" ? selectedBranchId : (propBranchId || defaultBranchId);

  // Fetch branches for super admin
  const { data: branchesData } = useQuery(GET_BRANCHES, {
    variables: { filter: organisationId ? { organisationId } : undefined },
    skip: user?.primaryRole !== "super_admin"
  });

  const { createSmallGroup } = useSmallGroupMutations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'BIBLE_STUDY',
    meetingSchedule: '',
    meetingLocation: '',
    status: SmallGroupStatus.ACTIVE
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!branchId) {
      setError("Cannot create group: No branch selected");
      setLoading(false);
      return;
    }
    try {
      await createSmallGroup({
        ...formData,
        branchId,
        organisationId,
      });
      setFormData({
        name: '',
        description: '',
        type: 'BIBLE_STUDY',
        meetingSchedule: '',
        meetingLocation: '',
        status: SmallGroupStatus.ACTIVE
      });
      if (afterCreate) afterCreate();
      toast.success('Group created successfully!');
      setIsOpen(false);
    } catch (err: any) {
      setError(err?.message || 'Error creating group');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog as="div" className="relative z-50" open={isOpen} onClose={() => setIsOpen(false)}>
      <div className="fixed inset-0 z-50 bg-gray-700 bg-opacity-70 transition-opacity" />
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6">
            {/* Close button */}
            <button
              type="button"
              className="absolute right-6 top-6 z-10 rounded-full bg-white text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            {/* Header */}
            <div className="px-8 pt-8 pb-4 border-b border-gray-100 bg-gradient-to-br from-indigo-50 to-white rounded-t-3xl">
              <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-1">
                Create New Group
              </Dialog.Title>
              <p className="text-sm text-gray-500">Fill in the details below to create a new small group for your branch.</p>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-8">
              {error && (
                <div className="rounded-md bg-red-50 p-4 mb-4">
                  <div className="text-sm text-red-700">
                    Error creating group: {error}
                  </div>
                </div>
              )}
              {/* Branch Selector for Super Admin */}
              {user?.primaryRole === "super_admin" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-900 mb-1">Branch<span className="text-red-500">*</span></label>
                  <select
                    name="branchId"
                    value={selectedBranchId}
                    onChange={e => setSelectedBranchId(e.target.value)}
                    className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branchesData?.branches?.items?.map((branch: any) => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-1">Group Name *</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm"
                    placeholder="Enter group name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/70 shadow-sm"
                  >
                    <option value="BIBLE_STUDY">Bible Study</option>
                    <option value="PRAYER">Prayer</option>
                    <option value="INTEREST_BASED">Interest-based</option>
                    <option value="DISCIPLESHIP">Discipleship</option>
                    <option value="SUPPORT">Support</option>
                    <option value="FELLOWSHIP">Fellowship</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">Description</label>
                  <textarea
                    name="description"
                    id="description"
                    rows={2}
                    className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm"
                    placeholder="Brief description of the group"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-1">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-1">Status *</label>
                  <select
                    id="status"
                    name="status"
                    className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <option value={SmallGroupStatus.ACTIVE}>Active</option>
                    <option value={SmallGroupStatus.INACTIVE}>Inactive</option>
                    <option value={SmallGroupStatus.ARCHIVED}>Archived</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label htmlFor="meetingSchedule" className="block text-sm font-medium text-gray-900 mb-1">Meeting Schedule</label>
                  <input
                    type="text"
                    name="meetingSchedule"
                    id="meetingSchedule"
                    placeholder="e.g., Every Sunday, 4:00 PM"
                    className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm"
                    value={formData.meetingSchedule}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="meetingLocation" className="block text-sm font-medium text-gray-900 mb-1">Meeting Location</label>
                  <input
                    type="text"
                    name="meetingLocation"
                    id="meetingLocation"
                    placeholder="e.g., Church Hall, Room 101"
                    className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm"
                    value={formData.meetingLocation}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col md:flex-row items-center justify-end gap-3">
                <button
                  type="button"
                  className="inline-flex items-center rounded-lg bg-white px-5 py-2 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2 text-base font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
