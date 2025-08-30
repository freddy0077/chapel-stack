"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  CurrencyDollarIcon,
  PlusIcon,
  ChartBarIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useTransactionMutations } from '@/graphql/hooks/useTransactionMutations';
import { useAuth } from '@/contexts/AuthContextEnhanced';
import { useQuery, gql, useMutation, useApolloClient } from '@apollo/client';
import { GET_MEMBERS_LIST } from '@/graphql/queries/memberQueries';
import { useTransactionsQuery, useTransactionStatsQuery } from '@/graphql/hooks/useTransactionQueries';
import DashboardHeader from "@/components/DashboardHeader";
import { useFinanceReferenceData } from '@/graphql/hooks/useFinanceReferenceData';
import { useBranchEvents } from '@/hooks/useBranchEvents';
import { EXPORT_TRANSACTIONS } from '@/graphql/queries/exportTransactionQueries';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { FundMappingConfiguration } from '@/components/finance/FundMappingConfiguration';
import MemberGivingHistory from '@/components/finance/MemberGivingHistory';
import FinancialAnalyticsSection from '@/components/finance/FinancialAnalyticsSection';

// Import modular components
import { ModalFormData, DateRange, BranchFinancesState } from '@/types/finance';
import { 
  formatCurrency, 
  formatDate, 
  validateTransactionForm,
  getTransactionTypeFromModal,
  buildTransactionFilters,
  getInitialModalForm,
  getTodayForInput,
  getDeleteConfirmationMessage,
  filterTransactionsBySearch
} from '@/utils/financeHelpers';
import TransactionModal from '@/components/finance/modals/TransactionModal';
import AddFundModal from '@/components/finance/modals/AddFundModal';
import BatchOfferingModal from '@/components/finance/modals/BatchOfferingModal';
import FinancialHealthIndicator from '@/components/finance/indicators/FinancialHealthIndicator';
import FundBalances from '@/components/finance/fund-management/FundBalances';

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

export default function BranchFinancesPage({ selectedBranch }: { selectedBranch?: string } = {}) {
  const { state } = useAuth();
  const user = state.user;
  const { organisationId, branchId: defaultBranchId } = useOrganisationBranch();
  const [activeTab, setActiveTab] = useState("all");
  const [mainView, setMainView] = useState<'transactions' | 'analytics'>('transactions');
  const [analyticsTab, setAnalyticsTab] = useState<'cash-flow' | 'comparative' | 'statements' | 'budget' | 'donors'>('cash-flow');
  const [searchQuery, setSearchQuery] = useState("");
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const [openModal, setOpenModal] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showTransactionDetailModal, setShowTransactionDetailModal] = useState(false);
  const [showEditTransactionModal, setShowEditTransactionModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [showMemberGivingHistory, setShowMemberGivingHistory] = useState(false);

  const [modalForm, setModalForm] = useState<ModalFormData>(getInitialModalForm());

  const [memberSearch, setMemberSearch] = useState('');
  const isSuperAdmin = user?.roles?.some(role => role.name === 'SUPER_ADMIN');
  const branchId = isSuperAdmin ? selectedBranch : (selectedBranch || defaultBranchId);

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: '',
    endDate: '',
  });

  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleDateRangeChange = (field: 'startDate' | 'endDate', value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyDateFilter = () => {
    setCurrentPage(1);
    refetch();
  };

  const handleClearDateFilter = () => {
    setDateRange({
      startDate: '',
      endDate: '',
    });
    setSelectedEvent(null);
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
    branchId,
    type: activeTab === 'all' ? undefined : 
          activeTab === 'contribution' ? 'CONTRIBUTION' : 
          activeTab === 'expense' ? 'EXPENSE' : 
          activeTab === 'transfer' ? 'TRANSFER' : 
          activeTab === 'fund_allocation' ? 'FUND_ALLOCATION' : undefined,
    fundId: selectedFund || undefined,
    eventId: selectedEvent || undefined,
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    startDate: dateRange.startDate || undefined,
    endDate: dateRange.endDate || undefined,
  });

  const stats = transactionsData?.transactions?.stats;
  const transactions = transactionsData?.transactions?.items || [];
  const hasNextPage = transactionsData?.transactions?.hasNextPage || false;

  const displayedTransactions = useMemo(() => {
    return filterTransactionsBySearch(transactions, searchQuery);
  }, [transactions, searchQuery]);

  // Transaction mutations (create, update, delete)
  const { createTransaction, updateTransaction, removeTransaction, createState } = useTransactionMutations();
  const creating = createState.loading;
  const createError = createState.error;

  // Inline form UX state
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });

  // Fetch reference data and events
  const { contributionTypes, paymentMethods, loading: refDataLoading } = useFinanceReferenceData();
  const { events, loading: eventsLoading, refetch: refetchEvents } = useBranchEvents(branchId, organisationId);
  
  // Apollo client for queries
  const client = useApolloClient();

  // Funds query
  const { data: fundsData, loading: fundsLoading, error: fundsError } = useQuery(GET_FUNDS, {
    variables: { organisationId, branchId },
    skip: !organisationId,
  });
  const funds = fundsData?.funds || [];

  // Members query
  const { data: memberResults, loading: memberLoading } = useQuery(GET_MEMBERS_LIST, {
    variables: {
      organisationId,
      branchId,
      search: memberSearch,
      take: 20,
    },
    skip: !memberSearch || memberSearch.trim().length < 2,
  });
  const members = memberResults?.members || [];

  // Additional state for funds and export
  const [addFundOpen, setAddFundOpen] = useState(false);
  const [fundsRefreshKey, setFundsRefreshKey] = useState(0);
  const [exportLoading, setExportLoading] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const handleFundCreated = () => setFundsRefreshKey(k => k + 1);

  // Modal handlers
  const handleOpenModal = (typeName: string) => {
    setOpenModal(typeName);
    setModalForm(getInitialModalForm());
    setSubmitAttempted(false);
    setFormMessage({ type: null, text: '' });
  };

  const handleCloseModal = () => {
    setOpenModal(null);
    setSubmitAttempted(false);
    setFormMessage({ type: null, text: '' });
  };

  const handleOpenTransactionModal = () => setShowTransactionModal(true);

  // Handle modal form submission
  const handleModalSubmit = async (formData: ModalFormData) => {
    setSubmitAttempted(true);
    setFormMessage({ type: null, text: '' });

    // Validate form data
    const validation = validateTransactionForm(formData);
    if (!validation.isValid) {
      setFormMessage({ type: 'error', text: validation.message });
      return;
    }

    try {
      // Prepare transaction data
      const transactionData = {
        organisationId,
        branchId,
        type: getTransactionTypeFromModal(formData.type),
        amount: parseFloat(formData.amount),
        description: formData.description,
        date: formData.date,
        fundId: formData.fundId,
        memberId: formData.memberId || null,
        eventId: formData.eventId || null,
        reference: formData.reference || null,
      };

      // Create transaction
      await createTransaction({
        variables: { input: transactionData },
        refetchQueries: [
          { query: GET_FUNDS, variables: { organisationId, branchId } },
        ],
        awaitRefetchQueries: true,
      });

      // Success - close modal and reset form
      setShowTransactionModal(false);
      setModalForm(getInitialModalForm());
      setSubmitAttempted(false);
      setFormMessage({ type: 'success', text: 'Transaction created successfully!' });
      
      // Refetch transactions to update the list
      refetch();
      
    } catch (error) {
      console.error('Error creating transaction:', error);
      setFormMessage({ 
        type: 'error', 
        text: 'Failed to create transaction. Please try again.' 
      });
    }
  };

  // Transaction CRUD handlers
  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowTransactionDetailModal(true);
  };

  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setModalForm({
      amount: transaction.amount.toString(),
      date: transaction.date.split('T')[0],
      note: transaction.description || '',
      category: '',
      fundId: transaction.fundId || '',
      memberId: transaction.memberId || '',
      batchEvents: [],
      paymentMethodId: transaction.metadata?.paymentMethodId || '',
      type: transaction.type,
      contributionTypeId: transaction.metadata?.contributionTypeId || '',
      eventId: transaction.eventId || '',
      reference: transaction.reference || '',
      description: transaction.description || '',
    });
    setShowEditTransactionModal(true);
    setShowTransactionDetailModal(false);
  };

  const handleDeleteTransaction = async (transaction: any) => {
    const confirmMessage = getDeleteConfirmationMessage(transaction);
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await removeTransaction({
        variables: { id: transaction.id },
        refetchQueries: [
          { query: GET_FUNDS, variables: { organisationId, branchId } },
        ],
        awaitRefetchQueries: true,
      });
      refetch();
      setShowTransactionDetailModal(false);
      alert('Transaction deleted successfully!');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  // Export handler
  const handleExport = async (type: "excel" | "csv") => {
    setExportLoading(true);
    setIsExportMenuOpen(false);
    try {
      const variables: any = {
        organisationId,
        branchId: branchId || undefined,
        fundId: selectedFund || undefined,
        eventId: selectedEvent || undefined,
        type: activeTab !== 'all' ? activeTab.toUpperCase() : undefined,
        dateRange: (dateRange.startDate || dateRange.endDate)
          ? {
              startDate: dateRange.startDate || null,
              endDate: dateRange.endDate || null
            }
          : undefined,
        searchTerm: searchQuery || undefined,
        exportFormat: type,
      };
      const { data } = await client.query({
        query: EXPORT_TRANSACTIONS,
        variables,
        fetchPolicy: 'no-cache',
      });
      const url = data?.exportTransactions;
      if (!url) throw new Error('Export failed');
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions.${type === 'excel' ? 'xlsx' : type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      alert('Export failed: ' + (e as Error).message);
    } finally {
      setExportLoading(false);
    }
  };

  // Computed values
  const monthlyExpenses = useMemo(() => {
    if (!transactions?.length) return 0;
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    return transactions.filter(t => t.type === 'EXPENSE' && new Date(t.date) >= lastMonth)
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [transactions]);

  const balance = stats?.currentBalance || 0;

  // Effects
  useEffect(() => {
    if (modalForm.type !== 'CONTRIBUTION' && modalForm.contributionTypeId) {
      setModalForm(f => ({ ...f, contributionTypeId: '' }));
    }
  }, [modalForm.type]);

  useEffect(() => {
    if (branchId && organisationId) {
      refetchEvents();
    }
  }, [branchId, organisationId, refetchEvents]);

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
              onClick={() => setShowMemberGivingHistory(true)}
              className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
              type="button"
            >
              <svg className="-ml-0.5 mr-1.5 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a9 9 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              Member History
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
        {/* Main View Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex">
              <button
                onClick={() => setMainView('transactions')}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  mainView === 'transactions'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <CurrencyDollarIcon className="h-5 w-5" />
                Transactions
              </button>
              <button
                onClick={() => setMainView('analytics')}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                  mainView === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <ChartBarIcon className="h-5 w-5" />
                Analytics & Reports
              </button>
            </div>
          </div>
        </div>

        {/* Analytics View */}
        {mainView === 'analytics' && (
          <FinancialAnalyticsSection 
            organisationId={organisationId}
            branchId={branchId}
          />
        )}

        {/* Transactions View */}
        {mainView === 'transactions' && (
          <>
            {/* MODERN UNIFIED FILTER BAR */}
            <div className="relative z-10 mb-8">
              <div className="backdrop-blur-md bg-white/70 border border-indigo-100 shadow-xl rounded-2xl p-6 flex flex-wrap gap-6 md:gap-4 lg:gap-6 lg:flex-nowrap items-end">
                {/* Date Range */}
                <div className="flex-1 min-w-[180px] flex flex-col">
                  <label className="block text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Date Range
                  </label>
                  <div className="flex gap-2 min-w-0">
                    <input
                      type="date"
                      value={dateRange.startDate}
                      onChange={e => handleDateRangeChange('startDate', e.target.value)}
                      className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 text-sm shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition w-full min-w-0"
                      placeholder="Start"
                    />
                    <span className="text-gray-400 font-bold">–</span>
                    <input
                      type="date"
                      value={dateRange.endDate}
                      onChange={e => handleDateRangeChange('endDate', e.target.value)}
                      className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 text-sm shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition w-full min-w-0"
                      placeholder="End"
                    />
                  </div>
                </div>
                {/* Event Filter */}
                <div className="flex-1 min-w-[160px] flex flex-col">
                  <label className="block text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 01-8 0 4 4 0 018 0zM12 14a9 9 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    Event
                  </label>
                  <div className="relative min-w-0 overflow-hidden">
                    <select
                      value={selectedEvent || ""}
                      onChange={e => setSelectedEvent(e.target.value || null)}
                      className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 text-sm shadow focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition w-full min-w-0 appearance-none"
                      disabled={eventsLoading}
                    >
                      <option value="">All Events</option>
                      {events && events.length > 0 ? (
                        events.map((event: any) => (
                          <option key={event.id} value={event.id}>{event.title} ({formatDate(event.startDate || event.date)})</option>
                        ))
                      ) : (
                        <option disabled>{eventsLoading ? 'Loading events...' : 'No events available'}</option>
                      )}
                    </select>
                    {selectedEvent && (
                      <button type="button" className="absolute right-2 top-2 text-gray-400 hover:text-pink-500" onClick={() => setSelectedEvent(null)} title="Clear">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                </div>
                {/* Fund Filter */}
                <div className="flex-1 min-w-[160px] flex flex-col">
                  <label className="block text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Fund
                  </label>
                  <div className="relative min-w-0 overflow-hidden">
                    <select
                      value={selectedFund || ""}
                      onChange={e => setSelectedFund(e.target.value || null)}
                      className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 text-sm shadow focus:ring-2 focus:ring-green-400 focus:border-green-400 transition w-full min-w-0 appearance-none"
                      disabled={fundsLoading}
                    >
                      <option value="">All Funds</option>
                      {funds && funds.length > 0 ? (
                        funds.map((fund: any) => (
                          <option key={fund.id} value={fund.id}>{fund.name}</option>
                        ))
                      ) : (
                        <option disabled>{fundsLoading ? 'Loading funds...' : 'No funds available'}</option>
                      )}
                    </select>
                    {selectedFund && (
                      <button type="button" className="absolute right-2 top-2 text-gray-400 hover:text-green-500" onClick={() => setSelectedFund(null)} title="Clear">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                </div>
                {/* Transaction Type Filter */}
                <div className="flex-1 min-w-[160px] flex flex-col">
                  <label className="block text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    Type
                  </label>
                  <select
                    value={activeTab}
                    onChange={e => setActiveTab(e.target.value)}
                    className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 text-sm shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition w-full min-w-0 appearance-none"
                  >
                    <option value="all">All Types</option>
                    <option value="contribution">Contributions</option>
                    <option value="expense">Expenses</option>
                    <option value="transfer">Transfers</option>
                    <option value="fund_allocation">Fund Allocations</option>
                  </select>
                </div>
                {/* Search Input */}
                <div className="flex-[2] min-w-[200px] md:ml-2 flex flex-col">
                  <label className="block text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    Search
                  </label>
                  <div className="relative min-w-0 overflow-hidden">
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 text-sm shadow focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition w-full min-w-0 pr-8"
                      aria-label="Search transactions"
                    />
                    {searchQuery && (
                      <button type="button" className="absolute right-2 top-2 text-gray-400 hover:text-indigo-500" onClick={() => setSearchQuery("")} title="Clear">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    )}
                  </div>
                </div>
                {/* Actions */}
                <div className="flex flex-col gap-2 md:ml-2 md:w-auto w-full mt-2 md:mt-0">
                  {/* Export Dropdown Button */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                      className="inline-flex items-center justify-center rounded-full bg-white/80 border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 shadow hover:bg-gray-50 transition w-full"
                    >
                      <svg className="w-4 h-4 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-8m0 8l-4-4m4 4l4-4M4 20h16" /></svg>
                      Export
                      <svg className="w-3 h-3 ml-2 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7l3-3 3 3m0 6l-3 3-3-3" /></svg>
                    </button>
                    {isExportMenuOpen && (
                      <div className="absolute right-0 mt-2 min-w-[120px] bg-white border border-gray-200 rounded-lg shadow-lg transition z-20">
                        <button
                          className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50"
                          onClick={() => handleExport("excel")}
                        >
                          <span className="inline-flex items-center">
                            <svg className="w-3 h-3 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-8-8v8m8-8H8m8 8h-8" /></svg>
                            Excel
                          </span>
                        </button>
                        <button
                          className="w-full text-left px-4 py-2 text-xs hover:bg-indigo-50 rounded-b-lg"
                          onClick={() => handleExport("csv")}
                        >
                          <span className="inline-flex items-center">
                            <svg className="w-3 h-3 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4zm4 4h8v8H8V8z" /></svg>
                            CSV
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full bg-white/80 border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 shadow hover:bg-gray-50 transition"
                    onClick={() => {
                      setDateRange({ startDate: '', endDate: '' });
                      setSelectedEvent(null);
                      setSelectedFund(null);
                      setActiveTab("all");
                      setSearchQuery("");
                      setCurrentPage(1);
                      refetch();
                    }}
                  >
                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    Clear All
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => {
                      setCurrentPage(1);
                      refetch();
                    }}
                  >
                    <svg className="w-4 h-4 mr-1 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Income Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Income</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalIncome ?? 0)}</p>
                  </div>
                  <div className="rounded-full bg-green-100 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2h3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Expenses Card */}
              <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(stats?.totalExpenses ?? 0)}</p>
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
                    <p className="mt-1 text-3xl font-bold text-gray-900">{formatCurrency(stats?.netBalance ?? 0)}</p>
                  </div>
                  <div className="rounded-full bg-blue-100 p-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5 5 0 0114.458 4 17 17 0 013.276 3.268" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Fund Balances Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-indigo-100">
              <h2 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
                <svg className="h-6 w-6 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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

            {/* Fund Mapping Configuration Section */}
            <div className="mb-8">
              <FundMappingConfiguration />
            </div>
          </>
        )}

        {/* Modals */}
        <TransactionModal
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)}
          modalForm={modalForm}
          setModalForm={setModalForm}
          onSubmit={handleModalSubmit}
          members={members}
          funds={funds}
          events={events}
          memberSearch={memberSearch}
          setMemberSearch={setMemberSearch}
          selectedMemberId={selectedMemberId}
          setSelectedMemberId={setSelectedMemberId}
          submitAttempted={submitAttempted}
          formMessage={formMessage}
          organisationId={organisationId}
          branchId={branchId}
        />

        <AddFundModal 
          open={addFundOpen} 
          onClose={() => setAddFundOpen(false)} 
          organisationId={organisationId} 
          onFundCreated={handleFundCreated} 
          branchId={branchId} 
        />

        <MemberGivingHistory
          isOpen={showMemberGivingHistory}
          onClose={() => setShowMemberGivingHistory(false)}
        />
      </div>
    </div>
  );
}