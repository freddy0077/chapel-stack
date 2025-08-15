'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon,
  UserGroupIcon,
  ArrowRightIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
  UserMinusIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';
import { BulkActionType } from '../types/member.types';

interface BulkActionsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAction: (action: BulkActionType, data?: any) => void;
  className?: string;
}

interface BulkActionOption {
  type: BulkActionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'orange' | 'red' | 'purple';
  requiresConfirmation?: boolean;
  description: string;
}

const bulkActions: BulkActionOption[] = [
  {
    type: 'updateStatus',
    label: 'Update Status',
    icon: UserGroupIcon,
    color: 'blue',
    description: 'Change membership status for selected members'
  },
  {
    type: 'addToGroup',
    label: 'Add to Group',
    icon: UserPlusIcon,
    color: 'green',
    description: 'Add selected members to a group'
  },
  {
    type: 'removeFromGroup',
    label: 'Remove from Group',
    icon: UserMinusIcon,
    color: 'green',
    description: 'Remove selected members from a group'
  },
  {
    type: 'addToMinistry',
    label: 'Add to Ministry',
    icon: UserPlusIcon,
    color: 'purple',
    description: 'Add selected members to a ministry'
  },
  {
    type: 'removeFromMinistry',
    label: 'Remove from Ministry',
    icon: UserMinusIcon,
    color: 'purple',
    description: 'Remove selected members from a ministry'
  },
  {
    type: 'recordSacrament',
    label: 'Record Sacrament',
    icon: BookOpenIcon,
    color: 'blue',
    description: 'Record sacrament for selected members'
  },
  {
    type: 'export',
    label: 'Export Data',
    icon: DocumentArrowDownIcon,
    color: 'orange',
    description: 'Export member data to CSV/Excel'
  },
  {
    type: 'deactivate',
    label: 'Deactivate Members',
    icon: TrashIcon,
    color: 'red',
    requiresConfirmation: true,
    description: 'Deactivate selected members'
  }
];

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClearSelection,
  onBulkAction,
  className = ""
}) => {
  const [showConfirmation, setShowConfirmation] = useState<BulkActionType | null>(null);

  const handleActionClick = (action: BulkActionOption) => {
    if (action.requiresConfirmation) {
      setShowConfirmation(action.type);
    } else {
      onBulkAction(action.type);
    }
  };

  const handleConfirmAction = () => {
    if (showConfirmation) {
      onBulkAction(showConfirmation);
      setShowConfirmation(null);
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      green: 'bg-green-100 text-green-700 hover:bg-green-200',
      purple: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      orange: 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      red: 'bg-red-100 text-red-700 hover:bg-red-200'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-white rounded-2xl shadow-lg border border-blue-200 ${className}`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserGroupIcon className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {selectedCount} member{selectedCount !== 1 ? 's' : ''} selected
                </h3>
                <p className="text-sm text-gray-600">Choose an action to perform</p>
              </div>
            </div>
            
            <button
              onClick={onClearSelection}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear selection"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            {bulkActions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.type}
                  onClick={() => handleActionClick(action)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${getColorClasses(action.color)}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={action.description}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">
                  Are you sure you want to{' '}
                  <span className="font-medium text-red-600">
                    {showConfirmation === 'deactivate' ? 'deactivate' : 'perform this action on'}
                  </span>{' '}
                  {selectedCount} selected member{selectedCount !== 1 ? 's' : ''}?
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmation(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BulkActionsBar;
