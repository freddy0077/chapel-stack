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

// Mock data for a single branch
const branchName = "Main Branch";
const summary = {
  collections: 2450,
  tithes: 1100,
  pledges: 800,
  other: 210,
  totalTransactions: 47,
  thisMonth: 3560,
  lastMonth: 3100,
};

// Tab options for financial categories
const tabOptions = ["All", "Collections", "Tithes", "Pledges", "Other"];

// Mock transactions with more detail
const transactions = [
  { id: 1, type: "Collection", amount: 450, date: "2025-06-14", note: "Sunday Service", status: "completed", category: "Weekly Offering" },
  { id: 2, type: "Tithe", amount: 120, date: "2025-06-13", note: "John Doe", status: "completed", category: "Member Tithes" },
  { id: 3, type: "Pledge", amount: 300, date: "2025-06-12", note: "Building Fund", status: "pending", category: "Capital Campaign" },
  { id: 4, type: "Other", amount: 75, date: "2025-06-11", note: "Youth Event", status: "completed", category: "Youth Ministry" },
];

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
  const [activeTab, setActiveTab] = useState("All");
  const [dateFilter, setDateFilter] = useState("This Month");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state: null | 'collection' | 'tithe' | 'pledge' | 'other'
  const [openModal, setOpenModal] = useState<null | 'collection' | 'tithe' | 'pledge' | 'other'>(null);

  // Form state for modals (could be expanded per modal)
  const [modalForm, setModalForm] = useState({
    amount: '',
    date: '',
    note: '',
    category: '',
  });

  const handleOpenModal = (type: 'collection' | 'tithe' | 'pledge' | 'other') => {
    setOpenModal(type);
    setModalForm({ amount: '', date: '', note: '', category: '' });
  };
  const handleCloseModal = () => setOpenModal(null);

  // Example submit handler
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Integrate with backend
    handleCloseModal();
  };
  
  // Calculate % change from last month
  const monthlyChangePercent = Math.round((summary.thisMonth - summary.lastMonth) / summary.lastMonth * 100);
  const isPositiveChange = monthlyChangePercent >= 0;
  
  // Filter transactions based on active tab and other filters
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];
    
    // Filter by tab/category
    if (activeTab !== "All") {
      result = result.filter(tx => tx.type === activeTab);
    }
    
    // Filter by search query if present
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tx => 
        tx.note.toLowerCase().includes(query) || 
        tx.category.toLowerCase().includes(query) ||
        tx.type.toLowerCase().includes(query)
      );
    }
    
    return result;
  }, [activeTab, searchQuery]); // Remove transactions from dependency array
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white pb-16">
      {/* Dashboard Header */}
      <DashboardHeader
        title="Branch Finances"
        subtitle={`Financial overview for ${branchName}`}
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
                {branchName} &mdash; 
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
            value={summary.collections}
            gradient="from-green-50 to-emerald-100"
          />
          <SummaryCard
            icon={<BanknotesIcon className="h-7 w-7 text-blue-600" />}
            label="Tithes"
            value={summary.tithes}
            gradient="from-blue-50 to-indigo-100"
          />
          <SummaryCard
            icon={<UserGroupIcon className="h-7 w-7 text-yellow-500" />}
            label="Pledges"
            value={summary.pledges}
            gradient="from-yellow-50 to-amber-100"
          />
          <SummaryCard
            icon={<ArrowTrendingDownIcon className="h-7 w-7 text-gray-500" />}
            label="Other Income"
            value={summary.other}
            gradient="from-gray-50 to-gray-100"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg px-5 py-2 font-semibold shadow hover:from-green-600 hover:to-emerald-700 transition"
            onClick={() => handleOpenModal('collection')}
          >
            Record Collection
          </button>
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg px-5 py-2 font-semibold shadow hover:from-blue-600 hover:to-indigo-700 transition"
            onClick={() => handleOpenModal('tithe')}
          >
            Record Tithe
          </button>
          <button
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg px-5 py-2 font-semibold shadow hover:from-yellow-500 hover:to-yellow-600 transition"
            onClick={() => handleOpenModal('pledge')}
          >
            Record Pledge
          </button>
          <button
            className="bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-lg px-5 py-2 font-semibold shadow hover:from-gray-500 hover:to-gray-600 transition"
            onClick={() => handleOpenModal('other')}
          >
            Record Other
          </button>
        </div>

        {/* Modals for each action */}
        <Modal open={openModal === 'collection'} title="Record Collection" onClose={handleCloseModal}>
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
              <label className="block text-sm font-medium text-indigo-800 mb-1">Note</label>
              <input type="text" className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" value={modalForm.note} onChange={e => setModalForm(f => ({ ...f, note: e.target.value }))} placeholder="Optional note" />
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 text-base shadow transition">Save Collection</button>
            </div>
          </form>
        </Modal>
        <Modal open={openModal === 'tithe'} title="Record Tithe" onClose={handleCloseModal}>
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
              <label className="block text-sm font-medium text-indigo-800 mb-1">Note</label>
              <input type="text" className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" value={modalForm.note} onChange={e => setModalForm(f => ({ ...f, note: e.target.value }))} placeholder="Optional note" />
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 text-base shadow transition">Save Tithe</button>
            </div>
          </form>
        </Modal>
        <Modal open={openModal === 'pledge'} title="Record Pledge" onClose={handleCloseModal}>
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
              <label className="block text-sm font-medium text-indigo-800 mb-1">Note</label>
              <input type="text" className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" value={modalForm.note} onChange={e => setModalForm(f => ({ ...f, note: e.target.value }))} placeholder="Optional note" />
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 text-base shadow transition">Save Pledge</button>
            </div>
          </form>
        </Modal>
        <Modal open={openModal === 'other'} title="Record Other Income" onClose={handleCloseModal}>
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
              <label className="block text-sm font-medium text-indigo-800 mb-1">Note</label>
              <input type="text" className="block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" value={modalForm.note} onChange={e => setModalForm(f => ({ ...f, note: e.target.value }))} placeholder="Optional note" />
            </div>
            <div className="pt-2">
              <button type="submit" className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 text-base shadow transition">Save Other Income</button>
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
                          {tx.type === "Collection" && <BanknotesIcon className="h-4 w-4 text-green-500 mr-1" />}
                          {tx.type === "Tithe" && <ArrowTrendingUpIcon className="h-4 w-4 text-blue-500 mr-1" />}
                          {tx.type === "Pledge" && <UserGroupIcon className="h-4 w-4 text-yellow-500 mr-1" />}
                          {tx.type === "Other" && <ArrowTrendingDownIcon className="h-4 w-4 text-gray-500 mr-1" />}
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap text-gray-600">{tx.category}</td>
                      <td className="py-3 px-3 whitespace-nowrap font-medium text-gray-900">${tx.amount.toLocaleString()}</td>
                      <td className="py-3 px-3 whitespace-nowrap text-gray-600">{tx.note}</td>
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
