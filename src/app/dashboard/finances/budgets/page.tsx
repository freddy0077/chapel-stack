"use client";

import React, { useState } from "react";
import {
  BuildingOfficeIcon,
  ArrowLeftIcon,
  PencilIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

// Types
interface Branch {
  id: string;
  name: string;
}
interface BudgetCategory {
  id: string;
  name: string;
}
interface BudgetAllocation {
  id: string;
  branchId: string;
  categoryId: string;
  year: number;
  quarter: number;
  amount: number;
  spentAmount: number;
  remainingAmount: number;
}

// Mock data
const mockBranches: Branch[] = [
  { id: "all", name: "All Branches" },
  { id: "b1", name: "Main Campus" },
  { id: "b2", name: "East Side" },
  { id: "b3", name: "West End" },
  { id: "b4", name: "South Chapel" },
];
const mockBudgetCategories: BudgetCategory[] = [
  { id: "bc1", name: "Facilities" },
  { id: "bc2", name: "Staff" },
  { id: "bc3", name: "Ministry" },
  { id: "bc4", name: "Missions" },
  { id: "bc5", name: "Operations" },
  { id: "bc6", name: "Worship" },
];
const mockBudgetAllocations: BudgetAllocation[] = [
  {
    id: "ba1",
    branchId: "b1",
    categoryId: "bc1",
    year: 2025,
    quarter: 2,
    amount: 28000,
    spentAmount: 12500,
    remainingAmount: 15500,
  },
  {
    id: "ba2",
    branchId: "b1",
    categoryId: "bc2",
    year: 2025,
    quarter: 2,
    amount: 65000,
    spentAmount: 32500,
    remainingAmount: 32500,
  },
  {
    id: "ba3",
    branchId: "b1",
    categoryId: "bc3",
    year: 2025,
    quarter: 2,
    amount: 18000,
    spentAmount: 9200,
    remainingAmount: 8800,
  },
  {
    id: "ba4",
    branchId: "b1",
    categoryId: "bc4",
    year: 2025,
    quarter: 2,
    amount: 25000,
    spentAmount: 8750,
    remainingAmount: 16250,
  },
  {
    id: "ba5",
    branchId: "b1",
    categoryId: "bc5",
    year: 2025,
    quarter: 2,
    amount: 12000,
    spentAmount: 7800,
    remainingAmount: 4200,
  },
  {
    id: "ba6",
    branchId: "b1",
    categoryId: "bc6",
    year: 2025,
    quarter: 2,
    amount: 10000,
    spentAmount: 5500,
    remainingAmount: 4500,
  },
  {
    id: "ba7",
    branchId: "b2",
    categoryId: "bc1",
    year: 2025,
    quarter: 2,
    amount: 18000,
    spentAmount: 7200,
    remainingAmount: 10800,
  },
  {
    id: "ba8",
    branchId: "b2",
    categoryId: "bc2",
    year: 2025,
    quarter: 2,
    amount: 42000,
    spentAmount: 21000,
    remainingAmount: 21000,
  },
  {
    id: "ba9",
    branchId: "b2",
    categoryId: "bc3",
    year: 2025,
    quarter: 2,
    amount: 12000,
    spentAmount: 5400,
    remainingAmount: 6600,
  },
];

export default function BudgetsPage() {
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [selectedQuarter, setSelectedQuarter] = useState<number>(2);

  // Filter allocations by branch, year, quarter
  const filteredAllocations = mockBudgetAllocations.filter(
    (a) =>
      (selectedBranch === "all" || a.branchId === selectedBranch) &&
      a.year === selectedYear &&
      a.quarter === selectedQuarter,
  );
  // Build category budgets
  const categoryBudgets = mockBudgetCategories.map((cat) => {
    const allocations = filteredAllocations.filter(
      (a) => a.categoryId === cat.id,
    );
    const allocated = allocations.reduce((sum, a) => sum + a.amount, 0);
    const spent = allocations.reduce((sum, a) => sum + a.spentAmount, 0);
    const remaining = allocations.reduce(
      (sum, a) => sum + a.remainingAmount,
      0,
    );
    const percentUsed =
      allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
    return {
      categoryId: cat.id,
      categoryName: cat.name,
      allocated,
      spent,
      remaining,
      percentUsed,
    };
  });
  const totalAllocated = categoryBudgets.reduce(
    (sum, c) => sum + c.allocated,
    0,
  );
  const totalSpent = categoryBudgets.reduce((sum, c) => sum + c.spent, 0);
  const totalRemaining = categoryBudgets.reduce(
    (sum, c) => sum + c.remaining,
    0,
  );
  const overallPercentUsed =
    totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

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
        <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
        <div className="p-6">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div>
              <label
                htmlFor="branch-select"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Branch
              </label>
              <div className="flex rounded-md shadow-sm max-w-xs">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-indigo-200 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                  <BuildingOfficeIcon className="h-4 w-4" />
                </span>
                <select
                  id="branch-select"
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="block w-full rounded-none rounded-r-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
                >
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
                htmlFor="year-select"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Year
              </label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="block w-full rounded-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
              >
                {[2024, 2025, 2026].map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="quarter-select"
                className="block text-sm font-medium text-indigo-800 mb-1"
              >
                Quarter
              </label>
              <select
                id="quarter-select"
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(Number(e.target.value))}
                className="block w-full rounded-md border-indigo-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
              >
                {[1, 2, 3, 4].map((q) => (
                  <option key={q} value={q}>{`Q${q}`}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-50">
              <p className="text-sm text-gray-500">Total Allocated</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(totalAllocated)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-50">
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(totalSpent)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-50">
              <p className="text-sm text-gray-500">Total Remaining</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(totalRemaining)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-50">
              <p className="text-sm text-indigo-700">% Used</p>
              <p className="text-xl font-semibold text-indigo-800">
                {overallPercentUsed}%
              </p>
            </div>
          </div>
          {/* Category Budgets Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-indigo-100">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Allocated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Remaining
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    % Used
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-indigo-50">
                {categoryBudgets.map((budget) => (
                  <tr key={budget.categoryId} className="hover:bg-indigo-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {budget.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(budget.allocated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(budget.spent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {formatCurrency(budget.remaining)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-2 flex-grow max-w-[100px]">
                          <div
                            className={`h-2 rounded-full ${
                              budget.percentUsed > 90
                                ? "bg-red-600"
                                : budget.percentUsed > 75
                                  ? "bg-yellow-500"
                                  : "bg-green-600"
                            }`}
                            style={{ width: `${budget.percentUsed}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{budget.percentUsed}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        <button
                          type="button"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <Link
                          href={`/dashboard/finances/expenses?category=${budget.categoryId}&branch=${selectedBranch}`}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <ArrowTopRightOnSquareIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-indigo-50">
                <tr>
                  <th
                    scope="row"
                    className="px-6 py-3 text-left text-sm font-medium text-gray-900"
                  >
                    Total
                  </th>
                  <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                    {formatCurrency(totalAllocated)}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                    {formatCurrency(totalSpent)}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                    {formatCurrency(totalRemaining)}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                    {overallPercentUsed}%
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
