import React from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  setIsAddModalOpen: (isOpen: boolean) => void;
}

export default function EmptyState({ setIsAddModalOpen }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No groups</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by creating a new group.</p>
      <div className="mt-6">
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <span>Create New Group</span>
        </button>
      </div>
    </div>
  );
}
