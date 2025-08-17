'use client';

import React from 'react';
import { 
  ExclamationTriangleIcon, 
  XMarkIcon,
  TrashIcon 
} from '@heroicons/react/24/outline';
import { DeathRegister } from '../../types/deathRegister';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  record: DeathRegister | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  record,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!isOpen || !record) return null;

  const memberName = record.member 
    ? `${record.member.firstName} ${record.member.lastName}`
    : 'Unknown Member';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Death Record
                </h3>
                <p className="text-sm text-gray-500">
                  This action cannot be undone
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete the death record for:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-400">
              <div className="flex items-center space-x-3">
                {record.member?.profileImageUrl ? (
                  <img
                    src={record.member.profileImageUrl}
                    alt={memberName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-lg">
                      {memberName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{memberName}</p>
                  <p className="text-sm text-gray-600">
                    Date of Death: {new Date(record.dateOfDeath).toLocaleDateString()}
                  </p>
                  {record.placeOfDeath && (
                    <p className="text-sm text-gray-600">
                      Place: {record.placeOfDeath}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <div className="flex items-start space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Warning:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>This will permanently delete all death record information</li>
                  <li>Associated documents and files will also be removed</li>
                  <li>Family notification history will be lost</li>
                  <li>This action cannot be reversed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <TrashIcon className="h-4 w-4" />
                <span>Delete Record</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
