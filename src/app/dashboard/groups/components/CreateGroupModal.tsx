import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSmallGroupMutations, SmallGroupStatus } from '../../../../graphql/hooks/useSmallGroups';

interface CreateGroupModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  branchId: string | undefined;
}

export default function CreateGroupModal({ isOpen, setIsOpen, branchId }: CreateGroupModalProps) {
  const { createSmallGroup } = useSmallGroupMutations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'CELL',
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
      setError("Cannot create group: No branch ID available");
      setLoading(false);
      return;
    }
    try {
      await createSmallGroup({
        ...formData,
        branchId
      });
      setFormData({
        name: '',
        description: '',
        type: 'CELL',
        meetingSchedule: '',
        meetingLocation: '',
        status: SmallGroupStatus.ACTIVE
      });
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
          <Dialog.Panel className="relative w-full max-w-xl mx-auto rounded-3xl bg-white px-0 pb-0 pt-0 text-left shadow-2xl transition-all">
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
                  <label htmlFor="type" className="block text-sm font-medium text-gray-900 mb-1">Group Type *</label>
                  <select
                    id="type"
                    name="type"
                    className="block w-full rounded-lg border border-gray-200 py-2 px-3 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="CELL">Cell Group</option>
                    <option value="BIBLE_STUDY">Bible Study</option>
                    <option value="MINISTRY">Ministry</option>
                    <option value="COMMITTEE">Committee</option>
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
