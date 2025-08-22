"use client";

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { CreateBudgetInput, CreateBudgetItemInput } from '@/graphql/queries/budget';
import { GET_FUNDS_QUERY } from '@/graphql/queries/funds';
import { GET_EXPENSE_CATEGORIES_QUERY } from '@/graphql/queries/expenseCategories';

interface CreateBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateBudgetInput) => Promise<void>;
  loading: boolean;
  organisationId: string;
  branchId?: string;
}

export default function CreateBudgetModal({
  isOpen,
  onClose,
  onSubmit,
  loading,
  organisationId,
  branchId
}: CreateBudgetModalProps) {
  console.log('CreateBudgetModal render:', { isOpen, organisationId, branchId });

  const [formData, setFormData] = useState<CreateBudgetInput>({
    name: '',
    description: '',
    fiscalYear: new Date().getFullYear(),
    startDate: `${new Date().getFullYear()}-01-01`,
    endDate: `${new Date().getFullYear()}-12-31`,
    totalAmount: 0,
    status: 'DRAFT',
    notes: '',
    fundId: '',
    organisationId,
  });

  // Fetch funds and expense categories
  const { data: fundsData, loading: fundsLoading } = useQuery(GET_FUNDS_QUERY, {
    variables: { organisationId, branchId },
  });

  const { data: expenseCategoriesData, loading: expenseCategoriesLoading } = useQuery(GET_EXPENSE_CATEGORIES_QUERY, {
    variables: { organisationId },
  });

  const funds = fundsData?.funds || [];
  const expenseCategories = expenseCategoriesData?.expenseCategories || [];

  console.log('Modal data:', { funds, expenseCategories, formData });

  const handleInputChange = (field: keyof CreateBudgetInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create clean input object, filtering out empty optional fields
    const cleanInput = {
      name: formData.name,
      fiscalYear: formData.fiscalYear,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalAmount: formData.totalAmount,
      status: formData.status,
      fundId: formData.fundId,
      organisationId: formData.organisationId,
      ...(formData.description && { description: formData.description }),
      ...(formData.notes && { notes: formData.notes }),
      ...(branchId && { branchId }),
    };
    
    await onSubmit(cleanInput);
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
          <form onSubmit={handleSubmit}>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Create New Budget</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-blue-200 hover:text-white transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4 max-h-96 overflow-y-auto bg-white">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2024 Ministry Budget"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fund *
                  </label>
                  <select
                    required
                    value={formData.fundId}
                    onChange={(e) => handleInputChange('fundId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a fund</option>
                    {funds.map((fund: any) => (
                      <option key={fund.id} value={fund.id}>
                        {fund.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiscal Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.fiscalYear}
                    onChange={(e) => handleInputChange('fiscalYear', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="2020"
                    max="2030"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Budget description..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Amount *
                </label>
                <input
                  type="number"
                  required
                  value={formData.totalAmount}
                  onChange={(e) => handleInputChange('totalAmount', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
                disabled={loading}
              >
                Create Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
