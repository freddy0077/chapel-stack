"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { ProgressBar, AreaChart, BarChart, DonutChart } from "@tremor/react";

// Types
interface Branch {
  id: string;
  name: string;
  location: string;
  region: string;
}

interface FinancialSummary {
  totalDonations: number;
  totalExpenses: number;
  currentBalance: number;
  budgetProgress: number;
  donationsByBranch: { branch: string; value: number }[];
  expensesByBranch: { branch: string; value: number }[];
  monthlyTrends: {
    month: string;
    donations: number;
    expenses: number;
    balance: number;
  }[];
  expensesByCategory: { category: string; value: number }[];
  donationsByFund: { fund: string; value: number }[];
}

// Mock Data
const mockBranches: Branch[] = [
  {
    id: "all",
    name: "All Branches",
    location: "Organization-wide",
    region: "All",
  },
  {
    id: "b1",
    name: "Main Campus",
    location: "123 Main St, Cityville",
    region: "North",
  },
  {
    id: "b2",
    name: "East Side",
    location: "456 East Blvd, Cityville",
    region: "East",
  },
  {
    id: "b3",
    name: "West End",
    location: "789 West Ave, Cityville",
    region: "West",
  },
  {
    id: "b4",
    name: "South Chapel",
    location: "321 South Rd, Cityville",
    region: "South",
  },
];

const mockFinancialData: FinancialSummary = {
  totalDonations: 875250.0,
  totalExpenses: 723480.0,
  currentBalance: 151770.0,
  budgetProgress: 68,
  donationsByBranch: [
    { branch: "Main Campus", value: 398450.0 },
    { branch: "East Side", value: 178520.0 },
    { branch: "West End", value: 156780.0 },
    { branch: "South Chapel", value: 141500.0 },
  ],
  expensesByBranch: [
    { branch: "Main Campus", value: 342300.0 },
    { branch: "East Side", value: 152630.0 },
    { branch: "West End", value: 136450.0 },
    { branch: "South Chapel", value: 92100.0 },
  ],
  monthlyTrends: [
    { month: "Jan", donations: 65420, expenses: 58350, balance: 7070 },
    { month: "Feb", donations: 72140, expenses: 61240, balance: 10900 },
    { month: "Mar", donations: 68930, expenses: 59870, balance: 9060 },
    { month: "Apr", donations: 78650, expenses: 63250, balance: 15400 },
    { month: "May", donations: 71280, expenses: 57930, balance: 13350 },
    { month: "Jun", donations: 74560, expenses: 61740, balance: 12820 },
    { month: "Jul", donations: 69840, expenses: 58670, balance: 11170 },
    { month: "Aug", donations: 76320, expenses: 64980, balance: 11340 },
    { month: "Sep", donations: 83750, expenses: 72140, balance: 11610 },
    { month: "Oct", donations: 79120, expenses: 65840, balance: 13280 },
    { month: "Nov", donations: 67590, expenses: 52780, balance: 14810 },
    { month: "Dec", donations: 67650, expenses: 46690, balance: 20960 },
  ],
  expensesByCategory: [
    { category: "Facilities", value: 234560 },
    { category: "Personnel", value: 286750 },
    { category: "Missions", value: 98670 },
    { category: "Programs", value: 65470 },
    { category: "Administration", value: 38030 },
  ],
  donationsByFund: [
    { fund: "General Fund", value: 586920 },
    { fund: "Building Fund", value: 143860 },
    { fund: "Missions Fund", value: 87650 },
    { fund: "Youth Fund", value: 34580 },
    { fund: "Benevolence", value: 22240 },
  ],
};

// Date range options
const dateRangeOptions = [
  { id: "ytd", name: "Year to Date" },
  { id: "q1", name: "Q1 (Jan-Mar)" },
  { id: "q2", name: "Q2 (Apr-Jun)" },
  { id: "q3", name: "Q3 (Jul-Sep)" },
  { id: "q4", name: "Q4 (Oct-Dec)" },
  { id: "last-12", name: "Last 12 Months" },
  { id: "custom", name: "Custom Range" },
];

export default function ConsolidatedDashboard() {
  const [selectedDateRange, setSelectedDateRange] = useState("ytd");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Consolidated Financial Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Organization-wide financial overview across all branches.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex space-x-3">
          <select
            id="date-range"
            name="date-range"
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {dateRangeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <ArrowDownTrayIcon
              className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Export
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingUpIcon
                  className="h-6 w-6 text-green-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">
                    Total Donations
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(mockFinancialData.totalDonations)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/finances/reports?type=donation"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                View donation reports
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingDownIcon
                  className="h-6 w-6 text-rose-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">
                    Total Expenses
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(mockFinancialData.totalExpenses)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/finances/reports?type=expense"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                View expense reports
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon
                  className="h-6 w-6 text-indigo-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500">
                    Current Balance
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {formatCurrency(mockFinancialData.currentBalance)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link
                href="/dashboard/finances/reports?type=consolidated"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                View consolidated reports
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Progress */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Annual Budget Progress
            </h3>
            <Link
              href="/dashboard/finances/budgets"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              View Budget Details
            </Link>
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-center mb-2">
            <div className="text-sm text-gray-500">
              Budget Completion: {mockFinancialData.budgetProgress}%
            </div>
            <div className="text-sm font-medium text-gray-900">
              Spent: {formatCurrency(mockFinancialData.totalExpenses)} of{" "}
              {formatCurrency(
                mockFinancialData.totalExpenses /
                  (mockFinancialData.budgetProgress / 100),
              )}
            </div>
          </div>
          <ProgressBar
            percentageValue={mockFinancialData.budgetProgress}
            color="indigo"
          />
        </div>
      </div>

      {/* Financial Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Trends */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Monthly Financial Trends
            </h3>
          </div>
          <div className="p-5">
            <AreaChart
              className="h-72"
              data={mockFinancialData.monthlyTrends}
              index="month"
              categories={["donations", "expenses", "balance"]}
              colors={["emerald", "rose", "indigo"]}
              valueFormatter={formatCurrency}
              yAxisWidth={70}
            />
          </div>
        </div>

        {/* Branch Comparison */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Branch Comparison
            </h3>
          </div>
          <div className="p-5">
            <BarChart
              className="h-72"
              data={mockFinancialData.donationsByBranch.map((item, index) => ({
                branch: item.branch,
                donations: item.value,
                expenses: mockFinancialData.expensesByBranch[index].value,
              }))}
              index="branch"
              categories={["donations", "expenses"]}
              colors={["emerald", "rose"]}
              valueFormatter={formatCurrency}
              yAxisWidth={70}
            />
          </div>
        </div>
      </div>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Expenses by Category
            </h3>
          </div>
          <div className="p-5">
            <div className="h-72">
              <DonutChart
                className="h-72"
                data={mockFinancialData.expensesByCategory}
                category="value"
                index="category"
                valueFormatter={formatCurrency}
                colors={["emerald", "blue", "amber", "indigo", "rose"]}
              />
            </div>
          </div>
        </div>

        {/* Donations by Fund */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Donations by Fund
            </h3>
          </div>
          <div className="p-5">
            <div className="h-72">
              <DonutChart
                className="h-72"
                data={mockFinancialData.donationsByFund}
                category="value"
                index="fund"
                valueFormatter={formatCurrency}
                colors={["indigo", "cyan", "amber", "emerald", "violet"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
