"use client";

import React, { useState } from "react";
import {
  BuildingOfficeIcon,
  ArrowLeftIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

// Types
interface Branch {
  id: string;
  name: string;
}
interface Fund {
  id: string;
  name: string;
}
interface Allocation {
  id: string;
  amount: number;
  sourceBranchId: string;
  destinationBranchId: string;
  fundId: string | null;
  date: string;
  status: "pending" | "completed" | "rejected";
  notes: string;
}

// Mock data
const mockBranches: Branch[] = [
  { id: "b1", name: "Main Campus" },
  { id: "b2", name: "East Side" },
  { id: "b3", name: "West End" },
  { id: "b4", name: "South Chapel" },
];
const mockFunds: Fund[] = [
  { id: "f1", name: "General Fund" },
  { id: "f2", name: "Building Fund" },
  { id: "f3", name: "Missions Fund" },
  { id: "f4", name: "Youth Ministry Fund" },
  { id: "f5", name: "Benevolence Fund" },
];
const mockAllocations: Allocation[] = [
  {
    id: "a1",
    amount: 5000,
    sourceBranchId: "b1",
    destinationBranchId: "b2",
    fundId: "f3",
    date: "2025-04-05",
    status: "completed",
    notes: "Monthly missions support for East Side branch",
  },
  {
    id: "a2",
    amount: 2500,
    sourceBranchId: "b1",
    destinationBranchId: "b3",
    fundId: "f4",
    date: "2025-04-06",
    status: "completed",
    notes: "Youth retreat funding support",
  },
  {
    id: "a3",
    amount: 7500,
    sourceBranchId: "b1",
    destinationBranchId: "b4",
    fundId: "f2",
    date: "2025-04-07",
    status: "pending",
    notes: "Emergency roof repair for South Chapel",
  },
  {
    id: "a4",
    amount: 1200,
    sourceBranchId: "b2",
    destinationBranchId: "b3",
    fundId: "f5",
    date: "2025-04-08",
    status: "pending",
    notes: "Benevolence support for West End community outreach",
  },
  {
    id: "a5",
    amount: 3000,
    sourceBranchId: "b1",
    destinationBranchId: "b3",
    fundId: null,
    date: "2025-04-02",
    status: "rejected",
    notes:
      "General operational support - rejected due to insufficient documentation",
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function getStatusBadge(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
    case "pending":
      return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    case "rejected":
      return <XCircleIcon className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
}

export default function AllocationsPage() {
  const [sourceBranch, setSourceBranch] = useState<string>("");
  const [destinationBranch, setDestinationBranch] = useState<string>("");
  const [fund, setFund] = useState<string>("");

  // Filter allocations
  const filteredAllocations = mockAllocations.filter(
    (a) =>
      (!sourceBranch || a.sourceBranchId === sourceBranch) &&
      (!destinationBranch || a.destinationBranchId === destinationBranch) &&
      (!fund || a.fundId === fund),
  );

  // Summary
  const totalAmount = filteredAllocations.reduce((sum, a) => sum + a.amount, 0);
  const totalCount = filteredAllocations.length;
  const completedCount = filteredAllocations.filter(
    (a) => a.status === "completed",
  ).length;
  const pendingCount = filteredAllocations.filter(
    (a) => a.status === "pending",
  ).length;
  const rejectedCount = filteredAllocations.filter(
    (a) => a.status === "rejected",
  ).length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Sticky header with back arrow */}
      <div className="mb-8 sticky top-0 z-10 bg-gradient-to-br from-indigo-50 to-white/80 backdrop-blur border-b border-indigo-100 py-4 px-2 flex items-center gap-3 shadow-sm">
        <a
          href="/dashboard/finances"
          className="rounded-full bg-white p-1 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label="Back to Finances"
        >
          <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
        </a>
        <h1 className="text-2xl font-bold text-gray-900">Allocations</h1>
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
        <div className="p-6">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div>
              <label
                htmlFor="source-branch-select"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Source Branch
              </label>
              <div className="flex rounded-md shadow-sm max-w-xs">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-indigo-200 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  <BuildingOfficeIcon className="h-4 w-4" />
                </span>
                <select
                  id="source-branch-select"
                  value={sourceBranch}
                  onChange={(e) => setSourceBranch(e.target.value)}
                  className="block w-full rounded-none rounded-r-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
                >
                  <option value="">All</option>
                  {mockBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="destination-branch-select"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Destination Branch
              </label>
              <div className="flex rounded-md shadow-sm max-w-xs">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-indigo-200 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  <BuildingOfficeIcon className="h-4 w-4" />
                </span>
                <select
                  id="destination-branch-select"
                  value={destinationBranch}
                  onChange={(e) => setDestinationBranch(e.target.value)}
                  className="block w-full rounded-none rounded-r-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
                >
                  <option value="">All</option>
                  {mockBranches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label
                htmlFor="fund-select"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Fund
              </label>
              <div className="flex rounded-md shadow-sm max-w-xs">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-indigo-200 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  <CurrencyDollarIcon className="h-4 w-4" />
                </span>
                <select
                  id="fund-select"
                  value={fund}
                  onChange={(e) => setFund(e.target.value)}
                  className="block w-full rounded-none rounded-r-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
                >
                  <option value="">All</option>
                  {mockFunds.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-50">
              <p className="text-sm text-gray-500">Total Allocations</p>
              <p className="text-xl font-semibold text-gray-900">
                {totalCount}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-50">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(totalAmount)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-50">
              <p className="text-sm text-green-700">Completed</p>
              <p className="text-xl font-semibold text-green-800">
                {completedCount}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-50">
              <p className="text-sm text-yellow-700">Pending</p>
              <p className="text-xl font-semibold text-yellow-800">
                {pendingCount}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-50">
              <p className="text-sm text-red-700">Rejected</p>
              <p className="text-xl font-semibold text-red-800">
                {rejectedCount}
              </p>
            </div>
          </div>
          {/* Allocations Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-indigo-100">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Fund
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-indigo-50">
                {filteredAllocations.map((a) => {
                  const source =
                    mockBranches.find((b) => b.id === a.sourceBranchId)?.name ||
                    "-";
                  const dest =
                    mockBranches.find((b) => b.id === a.destinationBranchId)
                      ?.name || "-";
                  const fundName = a.fundId
                    ? mockFunds.find((f) => f.id === a.fundId)?.name || "-"
                    : "General";
                  return (
                    <tr key={a.id} className="hover:bg-indigo-50/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {a.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dest}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(a.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {fundName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(a.status)}`}
                        >
                          <span className="mr-1">
                            {getStatusIcon(a.status)}
                          </span>
                          {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate"
                        title={a.notes}
                      >
                        {a.notes}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
