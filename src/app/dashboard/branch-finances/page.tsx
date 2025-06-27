"use client";

import React, { useState, useMemo } from "react";
import {
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  PlusIcon,
  XCircleIcon,
  ClockIcon,
  CalendarDaysIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from "@heroicons/react/24/outline";
import { BanknotesIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { useBranchFinances } from '@/hooks/useBranchFinances';
import { useAuth } from '@/graphql/hooks/useAuth';

// Recent activity for notification feed
const recentActivity = [
  { id: 1, message: "New tithe recorded", timestamp: "10 minutes ago" },
  { id: 2, message: "Collection report generated", timestamp: "2 hours ago" },
  { id: 3, message: "Pledge reminder sent", timestamp: "Yesterday" },
];

// Simple Modal component
function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl border border-indigo-100 shadow-2xl w-full max-w-lg mx-2 p-0 relative animate-fadeIn">
        <div className="flex items-center justify-between px-6 pt-6 pb-2 border-b border-gray-100 rounded-t-2xl bg-gradient-to-br from-indigo-50 to-white">
          <h3 className="text-lg font-bold text-indigo-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-indigo-500 transition">
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  );
}

import DashboardHeader from "@/components/DashboardHeader";
import Link from "next/link";

export default function BranchFinancesPage() {
  const { user } = useAuth();
  const {
    summary,
    transactions,
    funds,
    contributionTypes,
    paymentMethods,
    loading,
    error,
    createContribution,
    creationLoading,
  } = useBranchFinances();

  const [activeTab, setActiveTab] = useState("All");
  const [dateFilter, setDateFilter] = useState("This Month");
  const [showFilters, setShowFilters] = useState(false);
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

  const tabOptions = useMemo(() => {
    if (!contributionTypes) return ["All"];
    return ["All", ...contributionTypes.map(ct => ct.name)];
  }, [contributionTypes]);

  const handleOpenModal = (typeName: string) => {
    const contributionType = contributionTypes.find(ct => ct.name === typeName);
    setOpenModal(typeName);
    setModalForm({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: '',
      contributionTypeId: contributionType?.id || '',
      fundId: funds.length > 0 ? funds[0].id : '',
      paymentMethodId: paymentMethods.length > 0 ? paymentMethods[0].id : '',
    });
  };
  const handleCloseModal = () => setOpenModal(null);

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.organisationId || !user.userBranches?.[0]?.branch?.id) {
      console.error("User organisation or branch not found");
      return;
    }

    try {
      await createContribution({
        variables: {
          createContributionInput: {
            amount: parseFloat(modalForm.amount),
            date: modalForm.date,
            notes: modalForm.note,
            contributionTypeId: modalForm.contributionTypeId,
            fundId: modalForm.fundId,
            paymentMethodId: modalForm.paymentMethodId,
            organisationId: user.organisationId,
            branchId: user?.userBranches[0].branch.id,
          },
        },
      });
      handleCloseModal();
    } catch (err) {
      console.error("Failed to create contribution", err);
    }
  };
  
  const monthlyChangePercent = 0; // Placeholder for now
  const isPositiveChange = monthlyChangePercent >= 0;
  
  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    let result = [...transactions];
    
    if (activeTab !== "All") {
      result = result.filter(tx => tx.contributionType.name === activeTab);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tx => 
        tx.notes?.toLowerCase().includes(query) || 
        tx.fund.name.toLowerCase().includes(query) ||
        tx.contributionType.name.toLowerCase().includes(query) ||
        (tx.member && `${tx.member.firstName} ${tx.member.lastName}`.toLowerCase().includes(query))
      );
    }
    
    return result;
  }, [activeTab, searchQuery, transactions]);
  
  if (loading) return <div className="p-8">Loading financial data...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading data: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white pb-16">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Branch Finances"
        subtitle={`Financial overview for ${user?.userBranches?.[0]?.branch?.name}`}
        icon={
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-tr from-green-400 to-emerald-500 shadow-md">
            <CurrencyDollarIcon className="h-7 w-7 text-white" />
          </span>
        }
        action={
          <Link href="/dashboard/finances/new-transaction" passHref legacyBehavior>
            <a className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              New Transaction
            </a>
          </Link>
        }
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-10">
        {/* Header with Context and Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-green-400 to-emerald-500 p-3 rounded-xl shadow-md">
              <CurrencyDollarIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Branch Finances</h1>
              <div className="text-sm text-gray-500 mt-1">
                {user?.userBranches?.[0]?.branch?.name} &mdash;
                <span className="inline-flex items-center">
                  {isPositiveChange ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 ml-1 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 ml-1 mr-1" />
                  )}
                  <span className={`${isPositiveChange ? 'text-green-600' : 'text-red-600'} font-medium`}>
                    {isPositiveChange ? '+' : ''}{monthlyChangePercent}%
                  </span>
                  <span className="ml-1">from last month</span>
                </span>
              </div>
            </div>
          </div>
          
          {/* Date Filter */}
          <div className="flex items-center space-x-2">
            <CalendarDaysIcon className="h-5 w-5 text-gray-500" />
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="text-sm border-none bg-white rounded-lg shadow-sm py-1 px-3 text-gray-700 focus:ring-2 focus:ring-indigo-500"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>Year to Date</option>
              <option>Custom Range</option>
            </select>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex items-center border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
          {tabOptions.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-5 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <SummaryCard
            icon={<ArrowTrendingUpIcon className="h-7 w-7 text-green-600" />}
            label="Collections"
            value={summary?.collections || 0}
            gradient="from-green-50 to-emerald-100"
          />
          <SummaryCard
            icon={<BanknotesIcon className="h-7 w-7 text-blue-600" />}
            label="Tithes"
            value={summary?.tithes || 0}
            gradient="from-blue-50 to-indigo-100"
          />
          <SummaryCard
            icon={<UserGroupIcon className="h-7 w-7 text-yellow-500" />}
            label="Pledges"
            value={summary?.pledges || 0}
            gradient="from-yellow-50 to-amber-100"
          />
          <SummaryCard
            icon={<ArrowTrendingDownIcon className="h-7 w-7 text-gray-500" />}
            label="Other Income"
            value={summary?.other || 0}
            gradient="from-gray-50 to-gray-100"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-10">
          {(contributionTypes || []).map(type => (
            <button
              key={type.id}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg px-5 py-2 font-semibold shadow hover:from-blue-600 hover:to-indigo-700 transition"
              onClick={() => handleOpenModal(type.name)}
            >
              Record {type.name}
            </button>
          ))}
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
                {funds.map(fund => <option key={fund.id} value={fund.id}>{fund.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">Payment Method <span className="text-red-500">*</span></label>
              <select required className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" value={modalForm.paymentMethodId} onChange={e => setModalForm(f => ({ ...f, paymentMethodId: e.target.value }))}>
                {paymentMethods.map(pm => <option key={pm.id} value={pm.id}>{pm.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-800 mb-1">Note</label>
              <input type="text" className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" value={modalForm.note} onChange={e => setModalForm(f => ({ ...f, note: e.target.value }))} placeholder="Optional note" />
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 text-base shadow transition" disabled={creationLoading}>{creationLoading ? 'Saving...' : `Save ${openModal}`}</button>
            </div>
          </form>
        </Modal>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-auto flex items-center bg-white rounded-lg shadow-sm px-3 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 mr-2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions..."
              className="border-none focus:ring-0 text-sm w-full sm:w-64 bg-transparent"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 text-gray-500 hover:text-gray-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="h-4 w-4" />
              <span>Filters</span>
              {showFilters && <ChevronRightIcon className="h-4 w-4 rotate-90" />}
            </button>
            
            <button className="flex items-center space-x-1 text-gray-500 hover:text-gray-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              <span>Sort</span>
            </button>
            
            <button className="flex items-center space-x-1 bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
              <PlusIcon className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
        
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Amount Range</label>
              <div className="flex items-center space-x-2">
                <input type="text" placeholder="Min" className="w-full border-gray-300 rounded-md text-sm" />
                <span className="text-gray-400">-</span>
                <input type="text" placeholder="Max" className="w-full border-gray-300 rounded-md text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
              <select className="w-full border-gray-300 rounded-md text-sm">
                <option>All Statuses</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select className="w-full border-gray-300 rounded-md text-sm">
                <option>All Categories</option>
                <option>Weekly Offering</option>
                <option>Member Tithes</option>
                <option>Capital Campaign</option>
                <option>Youth Ministry</option>
              </select>
            </div>
          </div>
        )}

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
            <div className="text-xs text-gray-500">{filteredTransactions.length} results</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-2 px-3 text-left font-medium text-gray-600">Date</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-600">Type</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-600">Category</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-600">Amount</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-600">Note</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map(tx => (
                    <tr key={tx.id} className="border-b border-gray-50 last:border-none hover:bg-indigo-50/30 transition">
                      <td className="py-3 px-3 whitespace-nowrap">{tx.date}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="inline-flex items-center">
                          {tx.contributionType.name === "Collection" && <BanknotesIcon className="h-4 w-4 text-green-500 mr-1" />}
                          {tx.contributionType.name === "Tithe" && <ArrowTrendingUpIcon className="h-4 w-4 text-blue-500 mr-1" />}
                          {tx.contributionType.name === "Pledge" && <UserGroupIcon className="h-4 w-4 text-yellow-500 mr-1" />}
                          {tx.contributionType.name === "Other" && <ArrowTrendingDownIcon className="h-4 w-4 text-gray-500 mr-1" />}
                          {tx.contributionType.name}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-gray-600">{tx.fund.name}</td>
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-gray-900">${tx.amount.toFixed(2)}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-gray-600">{tx.notes || 'No note'}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        {tx.status === "completed" ? (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            <CheckBadgeIcon className="h-3 w-3 mr-1" />
                            Completed
                          </span>
                        ) : tx.status === "pending" ? (
                          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-700">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            Pending
                          </span>
                        ) : null}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No transactions found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

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
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-gray-50 last:border-none">
                  <div className="bg-indigo-100 p-1.5 rounded-full">
                    <CurrencyDollarIcon className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-sm">{activity.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{activity.timestamp}</div>
                  </div>
                </div>
              ))}
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
      <div className="text-2xl font-bold text-gray-900">${value.toLocaleString()}</div>
    </div>
  );
}
