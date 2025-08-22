"use client";

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_BUDGETS_QUERY, 
  CREATE_BUDGET_MUTATION, 
  UPDATE_BUDGET_MUTATION, 
  DELETE_BUDGET_MUTATION,
  Budget,
  CreateBudgetInput,
  UpdateBudgetInput 
} from '@/graphql/queries/budget';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import CreateBudgetModal from './modals/CreateBudgetModal';
import EditBudgetModal from './modals/EditBudgetModal';
import BudgetDetailModal from './modals/BudgetDetailModal';

interface BudgetManagementProps {
  organisationId: string;
  branchId?: string;
}

export default function BudgetManagement({ organisationId, branchId }: BudgetManagementProps) {
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<number>(new Date().getFullYear());
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // Fetch budgets
  const { data: budgetsData, loading, error, refetch } = useQuery(GET_BUDGETS_QUERY, {
    variables: { organisationId },
    fetchPolicy: 'cache-and-network',
  });

  // Filter budgets on the client side since the API doesn't support filtering
  const budgets = useMemo(() => {
    let filtered = budgetsData?.budgets || [];
    
    // Filter by branch if branchId is provided
    if (branchId) {
      filtered = filtered.filter((budget: Budget) => budget.branchId === branchId);
    }
    
    // Filter by fiscal year
    if (selectedFiscalYear) {
      filtered = filtered.filter((budget: Budget) => budget.fiscalYear === selectedFiscalYear);
    }
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((budget: Budget) => budget.status === selectedStatus);
    }
    
    return filtered;
  }, [budgetsData?.budgets, branchId, selectedFiscalYear, selectedStatus]);

  const [createBudget, { loading: createLoading }] = useMutation(CREATE_BUDGET_MUTATION, {
    onCompleted: () => {
      setIsCreateModalOpen(false);
      refetch();
    },
  });

  const [updateBudget, { loading: updateLoading }] = useMutation(UPDATE_BUDGET_MUTATION, {
    onCompleted: () => {
      setIsEditModalOpen(false);
      refetch();
    },
  });

  const [deleteBudget, { loading: deleteLoading }] = useMutation(DELETE_BUDGET_MUTATION, {
    onCompleted: () => {
      refetch();
    },
  });

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'draft':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'draft':
        return <ClockIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'cancelled':
        return <ExclamationTriangleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleCreateBudget = async (input: CreateBudgetInput) => {
    try {
      await createBudget({
        variables: { createBudgetInput: { ...input, organisationId, branchId } },
      });
    } catch (error) {
      console.error('Error creating budget:', error);
    }
  };

  const handleUpdateBudget = async (id: string, input: UpdateBudgetInput) => {
    try {
      await updateBudget({
        variables: { updateBudgetInput: { ...input, id } },
      });
    } catch (error) {
      console.error('Error updating budget:', error);
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget? This action cannot be undone.')) {
      try {
        await deleteBudget({
          variables: { id },
        });
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };

  const calculateBudgetProgress = (budget: Budget) => {
    if (budget.totalAmount === 0) return 0;
    return (budget.totalSpent / budget.totalAmount) * 100;
  };

  const fiscalYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Budgets</h3>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ChartBarIcon className="h-6 w-6 mr-2 text-blue-600" />
              Budget Management
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage budgets for your organization
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-3">
            {/* Fiscal Year Filter */}
            <select
              value={selectedFiscalYear}
              onChange={(e) => setSelectedFiscalYear(Number(e.target.value))}
              className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              {fiscalYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {/* Create Budget Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Budget
            </button>
          </div>
        </div>
      </div>

      {/* Budget Cards */}
      <div className="p-6">
        {budgets.length === 0 ? (
          <div className="text-center py-12">
            <ChartBarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Budgets Found</h3>
            <p className="text-gray-500 mb-4">
              Get started by creating your first budget for {selectedFiscalYear}.
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Create Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              const progress = calculateBudgetProgress(budget);
              return (
                <div
                  key={budget.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedBudget(budget)}
                >
                  <div className="p-6">
                    {/* Budget Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          {budget.name}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {budget.fund?.name}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                          {getStatusIcon(budget.status)}
                          <span className="ml-1 capitalize">{budget.status.toLowerCase()}</span>
                        </span>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditModalOpen(true);
                            setSelectedBudget(budget);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBudget(budget.id);
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          disabled={deleteLoading}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Budget Amount */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Budget Amount</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(budget.totalAmount)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Spent: {formatCurrency(budget.totalSpent)}</span>
                        <span>{progress.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className={`h-2 rounded-full ${
                            progress > 100 ? 'bg-red-500' : progress > 80 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Budget Period */}
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Budget Items Count */}
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      <span>
                        {budget.budgetItems?.length || 0} budget items
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateBudgetModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateBudget}
          loading={createLoading}
          organisationId={organisationId}
          branchId={branchId}
        />
      )}

      {isEditModalOpen && selectedBudget && (
        <EditBudgetModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(input) => handleUpdateBudget(selectedBudget.id, input)}
          loading={updateLoading}
          budget={selectedBudget}
        />
      )}

      {selectedBudget && (
        <BudgetDetailModal
          isOpen={!!selectedBudget}
          onClose={() => setSelectedBudget(null)}
          budget={selectedBudget}
          onEdit={() => {
            setIsEditModalOpen(true);
          }}
        />
      )}
    </div>
  );
};
