"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XCircleIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { useTransactionMutations } from '@/graphql/hooks/useTransactionMutations';
import { useAuth } from '@/graphql/hooks/useAuth';
import { useSearchMembers } from '@/graphql/hooks/useSearchMembers';
import { useTransactionsQuery } from '@/graphql/hooks/useTransactionQueries';
import { useQuery, gql, useMutation } from '@apollo/client';
import DashboardHeader from "@/components/DashboardHeader";
import { useFinanceReferenceData } from '@/graphql/hooks/useFinanceReferenceData';
import { useTransactionStatsQuery } from '@/graphql/hooks/useTransactionQueries';

// Simple Modal component
function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xl w-full max-w-2xl mx-2 p-0 relative animate-fadeIn">
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-100 rounded-t-2xl bg-gradient-to-br from-indigo-50 to-white">
          <h3 className="text-lg font-bold text-indigo-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-indigo-500 transition">
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

const GET_FUNDS = gql`
  query GetFunds($organisationId: String!, $branchId: String) {
    funds(organisationId: $organisationId, branchId: $branchId) {
      id
      name
      description
      branchId
    }
  }
`;

const CREATE_FUND = gql`
  mutation CreateFund($createFundInput: CreateFundInput!) {
    createFund(createFundInput: $createFundInput) {
      id
      name
      description
      organisationId
      branchId
    }
  }
`;

function AddFundModal({ open, onClose, organisationId, onFundCreated, branchId }: { open: boolean, onClose: () => void, organisationId: string, onFundCreated: () => void, branchId: string }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [createFund, { loading, error }] = useMutation(CREATE_FUND);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createFund({
      variables: { createFundInput: { name, description, isActive, organisationId, branchId: branchId } },
      refetchQueries: [
        {
          query: GET_FUNDS,
          variables: { organisationId, branchId },
        },
      ],
      awaitRefetchQueries: true,
    });
    setName("");
    setDescription("");
    setIsActive(true);
    onFundCreated();
    onClose();
  };
  return (
    <Modal open={open} title="Add Fund" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Fund Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="flex items-center">
          <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} id="fund-active" className="mr-2" />
          <label htmlFor="fund-active">Active</label>
        </div>
        {error && <div className="text-red-500">{error.message}</div>}
        <div className="flex justify-end">
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50" disabled={loading}>{loading ? "Adding..." : "Add Fund"}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function BranchFinancesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [openModal, setOpenModal] = useState<string | null>(null);

  const [modalForm, setModalForm] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    contributionTypeId: '',
    fundId: '',
    paymentMethodId: '',
  });

  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const [transactionForm, setTransactionForm] = useState({
    type: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    fundId: '',
    paymentMethodId: '',
    reference: '',
    contributionTypeId: '', // Only for CONTRIBUTION
  });

  const [memberSearch, setMemberSearch] = useState('');
  const branchId = user?.userBranches?.[0]?.branch?.id;

  const organisationId = user?.organisationId;

  const [addFundOpen, setAddFundOpen] = useState(false);
  const [fundsRefreshKey, setFundsRefreshKey] = useState(0);
  const handleFundCreated = () => setFundsRefreshKey(k => k + 1);

  const { data: fundsData, loading: fundsLoading, error: fundsError } = useQuery(GET_FUNDS, {
    variables: { organisationId, branchId },
    skip: !organisationId,
  });
  const funds = fundsData?.funds || [];

  const { data: memberResults, loading: memberLoading } = useSearchMembers(memberSearch, organisationId, branchId);

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyDateFilter = () => {
    // Reset pagination when applying new filters
    setCurrentPage(1);
    refetch();
  };

  const handleClearDateFilter = () => {
    setDateRange({
      startDate: '',
      endDate: '',
    });
    // Reset pagination and refetch
    setCurrentPage(1);
    refetch();
  };

  const {
    loading: transactionsLoading,
    data: transactionsData,
    error: transactionsError,
    fetchMore,
    refetch,
  } = useTransactionsQuery({
    organisationId,
    ...(branchId && { branchId }),
    type: activeTab === 'all' ? undefined : activeTab.toUpperCase(),
    fundId: selectedFund || undefined,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    startDate: dateRange.startDate || undefined,
    endDate: dateRange.endDate || undefined,
  });

  const stats = transactionsData?.transactions?.stats;

  const transactions = transactionsData?.transactions?.items || [];
  const hasNextPage = transactionsData?.transactions?.hasNextPage || false;

  const handleLoadMore = () => {
    if (hasNextPage) {
      fetchMore({
        variables: {
          paginationInput: {
            skip: transactions.length,
            take: 10,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            transactions: {
              ...fetchMoreResult.transactions,
              items: [
                ...prev.transactions.items,
                ...fetchMoreResult.transactions.items,
              ],
            },
          };
        },
      });
    }
  };

  const displayedTransactions = useMemo(() => {
    if (!transactionsData?.transactions) return [];
    let result = transactions;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tx) =>
          (tx.description && tx.description.toLowerCase().includes(query)) ||
          tx.type.toLowerCase().includes(query) ||
          tx.amount.toString().includes(query),
      );
    }
    return result;
  }, [transactionsData, searchQuery]);

  useEffect(() => {
    if (transactionForm.type !== 'CONTRIBUTION' && transactionForm.contributionTypeId) {
      setTransactionForm(f => ({ ...f, contributionTypeId: '' }));
    }
  }, [transactionForm.type]);

  const { createTransaction, loading: creating, error: createError } = useTransactionMutations();

  const handleOpenModal = (typeName: string) => {
    // const contributionType = contributionTypes.find(ct => ct.name === typeName);
    setOpenModal(typeName);
    setModalForm({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
      contributionTypeId: '',
      fundId: '',
      paymentMethodId: '',
    });
  };
  const handleCloseModal = () => setOpenModal(null);

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {

      handleCloseModal();
    } catch (err) {
      console.error("Failed to create contribution", err);
    }
  };

  const handleOpenTransactionModal = () => setShowTransactionModal(true);
  const handleCloseTransactionModal = () => setShowTransactionModal(false);

  const handleTransactionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate type
    const validTypes = ['CONTRIBUTION', 'EXPENSE', 'TRANSFER', 'FUND_ALLOCATION'];
    if (!transactionForm.type || !validTypes.includes(transactionForm.type)) {
      alert('Please select a valid transaction type.');
      return;
    }
    // Compose input for mutation
    const input: any = {
      organisationId,
      ...(branchId && { branchId }),
      fundId: transactionForm.fundId || null,
      userId: user.id,
      type: (transactionForm.type as 'CONTRIBUTION' | 'EXPENSE' | 'TRANSFER' | 'FUND_ALLOCATION'),
      amount: parseFloat(transactionForm.amount),
      date: transactionForm.date,
      description: transactionForm.description,
      reference: transactionForm.reference || null,
      metadata: {},
    };
    // Double-check type is present
    if (!input.type) {
      alert('Transaction type is required.');
      return;
    }
    if (transactionForm.type === 'CONTRIBUTION') {
      input.metadata = {
        contributionTypeId: transactionForm.contributionTypeId,
        paymentMethodId: transactionForm.paymentMethodId || null,
        memberId: selectedMemberId,
        // Add more fields as needed (e.g., isAnonymous)
      };
    } else {
      // For other transaction types, include paymentMethodId in metadata if present
      if (transactionForm.paymentMethodId) {
        input.metadata.paymentMethodId = transactionForm.paymentMethodId;
      }
    }

    try {
      await createTransaction({ 
        variables: { createTransactionInput: input },
        refetchQueries: [
          {
            query: GET_FUNDS,
            variables: { organisationId, branchId },
          },
        ],
        awaitRefetchQueries: true,
      });
      refetch();
      handleCloseTransactionModal();
      // Reset form
      setTransactionForm({
        type: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        fundId: '',
        paymentMethodId: '',
        reference: '',
        contributionTypeId: '',
      });
      setSelectedMemberId(null);
      setMemberSearch('');
    } catch (error) {
      console.error('Error creating transaction:', error);
      alert('Failed to create transaction. Please check all required fields and try again.');
    }
  };


  // Only run hooks and render content if organisationId is available
  const { contributionTypes, paymentMethods, loading: refDataLoading } = useFinanceReferenceData(organisationId);

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white pb-16">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Branch Finances"
        subtitle="Manage your branch's financial transactions"
        icon={
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-tr from-green-400 to-emerald-500 shadow-md">
            <CurrencyDollarIcon className="h-7 w-7 text-white" />
          </span>
        }
        action={
          <div className="flex gap-2">
            <button
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleOpenTransactionModal}
              type="button"
            >
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Transaction
            </button>
            <button
              onClick={() => setAddFundOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" /> Add Fund
            </button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Range Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center">
            <CalendarDaysIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-sm font-medium text-gray-500">Filter by Date:</span>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div>
              <label htmlFor="startDate" className="sr-only">Start Date</label>
              <input
                type="date"
                id="startDate"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={dateRange.startDate}
                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
              />
            </div>
            <span className="text-gray-500">to</span>
            <div>
              <label htmlFor="endDate" className="sr-only">End Date</label>
              <input
                type="date"
                id="endDate"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={dateRange.endDate}
                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
              />
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleApplyDateFilter}
            >
              Apply
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={handleClearDateFilter}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Income Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Income</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">₵{stats?.totalIncome?.toLocaleString() ?? '0'}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">₵{stats?.totalExpenses?.toLocaleString() ?? '0'}</p>
              </div>
              <div className="rounded-full bg-red-100 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Net Balance Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Net Balance</p>
                <p className="mt-1 text-3xl font-bold text-gray-900">₵{stats?.netBalance?.toLocaleString() ?? '0'}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Tithes Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Tithes</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">₵{stats?.totalTithes?.toLocaleString() ?? '0'}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pledges Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Pledges</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">₵{stats?.totalPledges?.toLocaleString() ?? '0'}</p>
              </div>
              <div className="rounded-full bg-amber-100 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Offerings Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Offerings</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">₵{stats?.totalOfferings?.toLocaleString() ?? '0'}</p>
              </div>
              <div className="rounded-full bg-teal-100 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Fund Balances Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-indigo-100">
          <h2 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
            <svg className="h-6 w-6 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Fund Balances
          </h2>
          {fundsLoading ? (
            <div className="text-gray-500">Loading funds...</div>
          ) : fundsError ? (
            <div className="text-red-500">Error loading funds.</div>
          ) : organisationId && (
            <FundBalances organisationId={organisationId} funds={funds} />
          )}
        </div>

        {/* SEARCH AND FILTERS TOOLBAR */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 px-1 mb-6">
          <div className="flex-1 flex items-center bg-white rounded-lg shadow-sm px-3 py-2 border border-gray-200">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full outline-none bg-transparent text-base"
              aria-label="Search transactions"
            />
          </div>
          <button
            onClick={handleOpenTransactionModal}
            className="hidden md:inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Transaction
          </button>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fund</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedTransactions.length === 0 && !transactionsLoading && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">No transactions found.</td>
                  </tr>
                )}
                {transactionsLoading && displayedTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      <div className="flex justify-center items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading transactions...
                      </div>
                    </td>
                  </tr>
                )}
                {displayedTransactions.map((tx, idx) => (
                  <tr key={tx.id} className={idx % 2 === 0 ? 'bg-white hover:bg-indigo-50' : 'bg-gray-50 hover:bg-indigo-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(tx.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.type === 'CONTRIBUTION' ? 'bg-green-100 text-green-800' :
                        tx.type === 'EXPENSE' ? 'bg-red-100 text-red-800' :
                        tx.type === 'TRANSFER' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tx.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₵{tx.amount?.toLocaleString?.() ?? '0'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={tx.description}>{tx.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{funds?.find(f => f.id === tx.fundId)?.name || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {hasNextPage && (
            <div className="text-center py-4">
              <button 
                onClick={handleLoadMore} 
                disabled={transactionsLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
              >
                {transactionsLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : 'Load More'}
              </button>
            </div>
          )}
        </div>

        {/* FLOATING ADD TRANSACTION BUTTON (MOBILE) */}
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <button
            onClick={handleOpenTransactionModal}
            className="inline-flex items-center justify-center p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Modals for each action */}
        <Modal open={!!openModal} title={`Record ${openModal}`} onClose={handleCloseModal}>
          <form onSubmit={handleModalSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">Amount <span className="text-red-500">*</span></label>
              <input type="number" min="0" required className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" value={modalForm.amount} onChange={e => setModalForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">Date <span className="text-red-500">*</span></label>
              <input type="date" required className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" value={modalForm.date} onChange={e => setModalForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">Fund <span className="text-red-500">*</span></label>
              <select required className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" value={modalForm.fundId} onChange={e => setModalForm(f => ({ ...f, fundId: e.target.value }))}>
                <option value="">Select fund</option>
                {funds?.map((fund: any) => (
                  <option key={fund.id} value={fund.id}>{fund.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">Payment Method <span className="text-red-500">*</span></label>
              <select required className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" value={modalForm.paymentMethodId} onChange={e => setModalForm(f => ({ ...f, paymentMethodId: e.target.value }))}>
                <option value="">Select payment method</option>
                {/* {paymentMethods?.map((pm: any) => (
                  <option key={pm.id} value={pm.id}>{pm.name}</option>
                ))} */}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">Note</label>
              <input type="text" className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" value={modalForm.note} onChange={e => setModalForm(f => ({ ...f, note: e.target.value }))} placeholder="Optional note" />
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 text-base shadow transition" disabled={false}>{false ? 'Saving...' : `Save ${openModal}`}</button>
            </div>
          </form>
        </Modal>

        {showTransactionModal && (
          <Modal open={showTransactionModal} title="Add Transaction" onClose={handleCloseTransactionModal}>
            <form onSubmit={handleTransactionSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">Type <span className="text-red-500">*</span></label>
                <select
                  required
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={transactionForm.type}
                  onChange={e => setTransactionForm(f => ({ ...f, type: e.target.value }))}
                >
                  <option value="">Select type</option>
                  <option value="CONTRIBUTION">Contribution</option>
                  <option value="EXPENSE">Expense</option>
                  <option value="TRANSFER">Transfer</option>
                  <option value="FUND_ALLOCATION">Fund Allocation</option>
                </select>
                {!transactionForm.type && (
                  <div className="text-red-500 text-xs mt-1">Transaction type is required.</div>
                )}
              </div>
              {/* Show Contribution Type dropdown if type is CONTRIBUTION */}
              {transactionForm.type === 'CONTRIBUTION' && (
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1">Contribution Type <span className="text-red-500">*</span></label>
                  <select
                    required
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    value={transactionForm.contributionTypeId}
                    onChange={e => setTransactionForm(f => ({ ...f, contributionTypeId: e.target.value }))}
                  >
                    <option value="">{refDataLoading ? 'Loading...' : 'Select contribution type'}</option>
                    {contributionTypes?.map((ct: any) => (
                      <option key={ct.id} value={ct.id}>{ct.name}</option>
                    ))}
                  </select>
                </div>
              )}
              {/* Member search for CONTRIBUTION type */}
              {transactionForm.type === 'CONTRIBUTION' && (
                <div className="mb-4">
                  <label htmlFor="memberSearch" className="block text-sm font-medium text-indigo-800 mb-1">Member <span className="text-red-500">*</span></label>
                  <input
                    id="memberSearch"
                    type="text"
                    value={memberSearch}
                    onChange={e => setMemberSearch(e.target.value)}
                    className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                    placeholder="Search for member by name, email, or phone"
                    required
                  />
                  {memberLoading && <div className="text-xs text-gray-400 mt-1">Searching...</div>}
                  {memberResults && memberSearch && (
                    <ul className="border rounded bg-white mt-1 max-h-40 overflow-y-auto">
                      {memberResults.length === 0 ? (
                        <li className="p-2 text-gray-500 text-sm">No members found</li>
                      ) : (
                        memberResults.map((m: any) => (
                          <li
                            key={m.id}
                            className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedMemberId === m.id ? 'bg-indigo-100' : ''}`}
                            onClick={() => {
                              setSelectedMemberId(m.id);
                              setMemberSearch(`${m.firstName} ${m.lastName}`);
                            }}
                          >
                            {m.firstName} {m.lastName} {m.email ? `(${m.email})` : ''}
                          </li>
                        ))
                      )}
                    </ul>
                  )}
                  {/* Show selected member below the input if set */}
                  {selectedMemberId && memberResults && (
                    <div className="mt-1 text-xs text-indigo-700">
                      Selected: {memberResults.find((m: any) => m.id === selectedMemberId)?.firstName} {memberResults.find((m: any) => m.id === selectedMemberId)?.lastName}
                    </div>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">Amount <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={transactionForm.amount}
                  onChange={e => setTransactionForm(f => ({ ...f, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  required
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={transactionForm.date}
                  onChange={e => setTransactionForm(f => ({ ...f, date: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">Description</label>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={transactionForm.description}
                  onChange={e => setTransactionForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">Fund</label>
                <select
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={transactionForm.fundId}
                  onChange={e => setTransactionForm(f => ({ ...f, fundId: e.target.value }))}
                >
                  <option value="">Select fund</option>
                  {funds?.map((fund: any) => (
                    <option key={fund.id} value={fund.id}>{fund.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">Payment Method</label>
                <select
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={transactionForm.paymentMethodId}
                  onChange={e => setTransactionForm(f => ({ ...f, paymentMethodId: e.target.value }))}
                >
                  <option value="">Select payment method</option>
                  {paymentMethods?.map((pm: any) => (
                    <option key={pm.id} value={pm.id}>{pm.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-indigo-800 mb-1">Reference</label>
                <input
                  type="text"
                  className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  value={transactionForm.reference}
                  onChange={e => setTransactionForm(f => ({ ...f, reference: e.target.value }))}
                  placeholder="Reference number"
                />
              </div>
              {createError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  Error: {createError.message || 'Failed to create transaction. Please check all required fields.'}
                </div>
              )}
              <div className="pt-2 flex space-x-3">
                <button 
                  type="button" 
                  onClick={handleCloseTransactionModal}
                  className="flex-1 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 text-base shadow transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 text-base shadow transition flex justify-center items-center"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Save Transaction'}
                </button>
              </div>
            </form>
          </Modal>
        )}
        <AddFundModal open={addFundOpen} onClose={() => setAddFundOpen(false)} organisationId={organisationId} onFundCreated={handleFundCreated} branchId={branchId} />
        {/* Trends and Activity Feed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Trends Chart */}
          <div className="md:col-span-2 bg-gradient-to-tr from-indigo-50 to-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Giving Trends <span className="text-xs text-gray-400 font-normal">(Coming Soon)</span></h2>
            <div className="h-48 flex items-center justify-center text-gray-400">
              [Trend Chart Placeholder]
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Recent Activity</h2>
            <div className="space-y-4">

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value, gradient }: { icon: React.ReactNode; label: string; value: number; gradient: string }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-5 shadow flex flex-col gap-2 items-start border border-gray-100`}>
      <div className="bg-white rounded-lg p-2 shadow-sm mb-1">{icon}</div>
      <div className="text-xs text-gray-500 mb-1 font-medium">{label}</div>
      <div className="text-2xl font-bold text-gray-900">₵{value.toLocaleString()}</div>
    </div>
  );
}

function FundBalances({ organisationId, funds }: { organisationId: string, funds: any[] }) {
  if (!funds?.length) return <div className="text-gray-500">No funds found.</div>;
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fund</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
          </tr>
        </thead>
        <tbody>
          {funds.map(fund => (
            <FundBalanceRow key={fund.id} organisationId={organisationId} fund={fund} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FundBalanceRow({ organisationId, fund }: { organisationId: string, fund: any }) {
  const { data, loading, error } = useTransactionStatsQuery({ organisationId, fundId: fund.id, branchId: fund.branchId });
  return (
    <tr>
      <td className="px-4 py-2 text-sm text-gray-900">{fund.name}</td>
      <td className="px-4 py-2 text-sm font-semibold text-indigo-700">
        {loading ? 'Loading...' : error ? 'Error' : `₵${data?.transactionStats?.netBalance?.toLocaleString?.() ?? '0'}`}
      </td>
    </tr>
  );
}
