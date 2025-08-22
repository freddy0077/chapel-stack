"use client";

import React from 'react';
import { XMarkIcon, PencilIcon, CalendarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { Budget } from '@/graphql/queries/budget';

interface BudgetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  budget: Budget;
  onEdit: () => void;
}

const BudgetDetailModal: React.FC<BudgetDetailModalProps> = ({
  isOpen,
  onClose,
  budget,
  onEdit
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = () => {
    if (budget.totalAmount === 0) return 0;
    return (budget.totalSpent / budget.totalAmount) * 100;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        ></div>
        
        {/* Modal positioning */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        {/* Modal content */}
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-white">{budget.name}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onEdit}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={onClose}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4 bg-white">
            {/* Budget Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Total Budget</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatCurrency(budget.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Total Spent</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(budget.totalSpent)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center">
                  <CalendarIcon className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Progress</p>
                    <p className="text-2xl font-bold text-purple-900">
                      {calculateProgress().toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Budget Information</h4>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fund</dt>
                    <dd className="text-sm text-gray-900">{budget.fund?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Fiscal Year</dt>
                    <dd className="text-sm text-gray-900">{budget.fiscalYear}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="text-sm text-gray-900 capitalize">{budget.status.toLowerCase()}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Period</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-3">Description</h4>
                <p className="text-sm text-gray-600">
                  {budget.description || 'No description provided.'}
                </p>
                {budget.notes && (
                  <>
                    <h4 className="text-lg font-medium text-gray-900 mb-3 mt-4">Notes</h4>
                    <p className="text-sm text-gray-600">{budget.notes}</p>
                  </>
                )}
              </div>
            </div>

            {/* Budget Items */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-3">Budget Items</h4>
              {budget.budgetItems && budget.budgetItems.length > 0 ? (
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {budget.budgetItems.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.description || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.expenseCategory?.name || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No budget items found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Edit Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDetailModal;
