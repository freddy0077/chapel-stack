"use client";

import React, { useState } from "react";
import {
  BuildingOfficeIcon,
  ArrowPathIcon,
  DocumentChartBarIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

// Types
interface Branch {
  id: string;
  name: string;
}
interface FinancialReport {
  id: string;
  title: string;
  type: "donation" | "expense" | "budget" | "consolidated";
  period: string;
  branchId: string;
  createdAt: string;
  totalAmount: number;
  status: "generated" | "pending" | "error";
  downloadUrl?: string;
}

// Mock data
const mockBranches: Branch[] = [
  { id: "all", name: "All Branches" },
  { id: "b1", name: "Main Campus" },
  { id: "b2", name: "East Side" },
  { id: "b3", name: "West End" },
  { id: "b4", name: "South Chapel" },
];
const mockReports: FinancialReport[] = [
  {
    id: "r1",
    title: "Monthly Donation Summary",
    type: "donation",
    period: "April 2025",
    branchId: "b1",
    createdAt: "2025-04-05",
    totalAmount: 45632.5,
    status: "generated",
    downloadUrl: "/reports/donations-april-2025-b1.pdf",
  },
  {
    id: "r2",
    title: "Quarterly Expense Report",
    type: "expense",
    period: "Q1 2025",
    branchId: "b1",
    createdAt: "2025-04-02",
    totalAmount: 32150.75,
    status: "generated",
    downloadUrl: "/reports/expenses-q1-2025-b1.pdf",
  },
  {
    id: "r3",
    title: "Annual Budget Report",
    type: "budget",
    period: "2025",
    branchId: "b1",
    createdAt: "2025-01-15",
    totalAmount: 250000.0,
    status: "generated",
    downloadUrl: "/reports/budget-2025-b1.pdf",
  },
  {
    id: "r4",
    title: "Monthly Donation Summary",
    type: "donation",
    period: "April 2025",
    branchId: "b2",
    createdAt: "2025-04-05",
    totalAmount: 28456.75,
    status: "generated",
    downloadUrl: "/reports/donations-april-2025-b2.pdf",
  },
  {
    id: "r5",
    title: "Quarterly Expense Report",
    type: "expense",
    period: "Q1 2025",
    branchId: "b2",
    createdAt: "2025-04-02",
    totalAmount: 19875.25,
    status: "generated",
    downloadUrl: "/reports/expenses-q1-2025-b2.pdf",
  },
  {
    id: "r6",
    title: "Organization-wide Financial Summary",
    type: "consolidated",
    period: "Q1 2025",
    branchId: "all",
    createdAt: "2025-04-03",
    totalAmount: 178965.5,
    status: "generated",
    downloadUrl: "/reports/consolidated-q1-2025.pdf",
  },
];

export default function FinancialReportsPage() {
  const [selectedBranch, setSelectedBranch] = useState<string>("all");

  const filteredReports =
    selectedBranch === "all"
      ? mockReports
      : mockReports.filter((r) => r.branchId === selectedBranch);

  // Summary
  const summary = {
    totalReports: filteredReports.length,
    totalAmount: filteredReports.reduce((sum, r) => sum + r.totalAmount, 0),
    donationReports: filteredReports.filter((r) => r.type === "donation")
      .length,
    expenseReports: filteredReports.filter((r) => r.type === "expense").length,
    budgetReports: filteredReports.filter((r) => r.type === "budget").length,
    consolidatedReports: filteredReports.filter(
      (r) => r.type === "consolidated",
    ).length,
  };
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto">
      {/* Sticky header with navigation */}
      <div className="mb-8 sticky top-0 z-10 bg-gradient-to-br from-indigo-50 to-white/80 backdrop-blur border-b border-indigo-100 py-4 px-2 flex items-center gap-3 shadow-sm">
        <a
          href="/dashboard/finances"
          className="rounded-full bg-white p-1 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label="Back to Finances"
        >
          <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
        </a>
        <h1 className="text-2xl font-bold text-gray-900">Finance Reports</h1>
      </div>
      <div className="bg-gradient-to-br from-indigo-50 to-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
        <div className="p-6">
          {/* Branch Filter */}
          <div className="mb-8">
            <label
              htmlFor="branch-select"
              className="block text-sm font-medium text-indigo-800 mb-1"
            >
              Branch
            </label>
            <div className="mt-1 flex rounded-md shadow-sm max-w-xs">
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
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-50">
              <p className="text-sm text-gray-500">Total Reports</p>
              <p className="text-xl font-semibold text-gray-900">
                {summary.totalReports}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-50">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(summary.totalAmount)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-50">
              <p className="text-sm text-indigo-700">Donation Reports</p>
              <p className="text-xl font-semibold text-indigo-800">
                {summary.donationReports}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-4 border border-indigo-50">
              <p className="text-sm text-indigo-700">Expense Reports</p>
              <p className="text-xl font-semibold text-indigo-800">
                {summary.expenseReports}
              </p>
            </div>
          </div>
          {/* Report List */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-indigo-100">
              <thead className="bg-indigo-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-indigo-50">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-indigo-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium flex items-center gap-2">
                      <DocumentChartBarIcon className="h-5 w-5 text-indigo-500" />
                      {report.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                      {report.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {report.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      {formatCurrency(report.totalAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {report.status === "generated" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-800 border border-green-100">
                          Generated
                        </span>
                      )}
                      {report.status === "pending" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-800 border border-yellow-100">
                          Pending
                        </span>
                      )}
                      {report.status === "error" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-800 border border-red-100">
                          Error
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {report.downloadUrl ? (
                        <a
                          href={report.downloadUrl}
                          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          download
                        >
                          <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                          Download
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
