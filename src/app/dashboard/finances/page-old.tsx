"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  PlusIcon,
  CurrencyDollarIcon,
  ArrowsUpDownIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

// Import custom components
import FinancialOverview from "./components/FinancialOverview";
import TransactionsTable from "./components/TransactionsTable";
import CampaignCards from "./components/CampaignCards";
import QuickActions from "./components/QuickActions";

import { useFinanceDashboardData } from "../../../graphql/hooks/useFinanceDashboardData";
import { mapKpiCardsToOverview } from "./FinanceKpiMapper";
import { useContributionsStats } from "../../../graphql/hooks/useContributionsStats";

// Mock recent transactions
const recentTransactions = [
  { id: 1, type: "Income", category: "Tithe", amount: "$1,250.00", date: "April 6, 2025", donor: "John Smith", branchId: "b1" },
  { id: 2, type: "Income", category: "Building Fund", amount: "$500.00", date: "April 5, 2025", donor: "Emily Davis", branchId: "b2" },
  { id: 3, type: "Expense", category: "Utilities", amount: "-$345.67", date: "April 4, 2025", vendor: "Power Company", branchId: "b1" },
  { id: 4, type: "Income", category: "Missions", amount: "$750.00", date: "April 3, 2025", donor: "Michael Wilson", branchId: "b3" },
  { id: 5, type: "Expense", category: "Office Supplies", amount: "-$128.45", date: "April 2, 2025", vendor: "Office Store", branchId: "b4" },
  { id: 6, type: "Income", category: "General Fund", amount: "$2,000.00", date: "April 1, 2025", donor: "Anonymous", branchId: "b1" },
  { id: 7, type: "Expense", category: "Maintenance", amount: "-$550.00", date: "March 31, 2025", vendor: "Cleaning Service", branchId: "b2" },
  { id: 8, type: "Income", category: "Youth Ministry", amount: "$300.00", date: "March 30, 2025", donor: "Sarah Brown", branchId: "b3" },
];

// Mock campaigns/funds
const activeCampaigns = [
  { id: 1, name: "Building Fund", goal: "$50,000", raised: "$32,450", progress: 65, category: "Facilities", endDate: "June 30, 2025" },
  { id: 2, name: "Missions Trip", goal: "$15,000", raised: "$12,750", progress: 85, category: "Outreach", endDate: "May 15, 2025" },
  { id: 3, name: "Youth Retreat", goal: "$8,000", raised: "$3,200", progress: 40, category: "Youth", endDate: "July 1, 2025" },
];

import { useBranches } from "../../../graphql/hooks/useBranches";
import DashboardHeader from "@/components/DashboardHeader";

export default function Finances() {
  const [selectedBranch, setSelectedBranch] = useState("all");
  const { branches, loading: branchesLoading, error: branchesError } = useBranches();

  // Get branchId for dashboard query (null/undefined for "all")
  const branchId = selectedBranch !== "all" ? selectedBranch : (branches[0]?.id || "");
  const { kpiCards, loading: dashboardLoading, error: dashboardError } = useFinanceDashboardData(branchId);
  const financialOverview = mapKpiCardsToOverview(kpiCards);

  // Fetch contributions (donations) stats for the branch
  const { stats: contributionsStats, loading: contributionsLoading, error: contributionsError } = useContributionsStats(branchId);


  // Handle branch change
  const handleBranchChange = (branchId: string) => {
    setSelectedBranch(branchId);
  };

  if (branchesLoading || dashboardLoading || contributionsLoading) {
    return <div>Loading dashboard...</div>;
  }
  if (branchesError) {
    return <div>Error loading branches.</div>;
  }
  if (dashboardError) {
    return <div>Error loading dashboard data.</div>;
  }
  if (contributionsError) {
    return <div>Error loading contributions data.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200/40 via-white/70 to-purple-100/40 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-indigo-400/90 to-purple-300/80 rounded-2xl p-4 shadow-xl backdrop-blur-xl">
              <CurrencyDollarIcon className="h-10 w-10 text-white drop-shadow" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight">Financial Dashboard</h1>
              <p className="mt-1 text-base text-gray-600">Comprehensive view of your church's financial health and activities</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/finances/new-transaction" passHref legacyBehavior>
              <a className="inline-flex items-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                New Transaction
              </a>
            </Link>
            <Link href="/dashboard/finances/reports" className="inline-flex items-center rounded-xl bg-white/80 px-4 py-2 text-sm font-semibold text-indigo-700 shadow hover:bg-indigo-50 border border-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              View Reports
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="rounded-2xl bg-white/60 shadow-lg backdrop-blur-xl p-6">
            <QuickActions />
          </div>
        </div>

        {/* Financial Overview */}
        <div className="mb-8">
          <div className="rounded-2xl bg-gradient-to-tr from-indigo-50/80 to-purple-50/80 shadow-xl p-6">
            <FinancialOverview 
              totalDonations={contributionsStats ? `$${contributionsStats.totalAmount?.toLocaleString()}` : financialOverview.totalDonations}
              totalExpenses={financialOverview.totalExpenses}
              currentBalance={financialOverview.currentBalance}
              budgetProgress={financialOverview.budgetProgress}
              monthlyChange={contributionsStats && contributionsStats.percentChangeFromPreviousPeriod !== undefined ? `${contributionsStats.percentChangeFromPreviousPeriod > 0 ? '+' : ''}${contributionsStats.percentChangeFromPreviousPeriod}%` : financialOverview.monthlyChange}
              donationTrends={contributionsStats?.trendData?.map(d => d.amount) || []}
              selectedBranch={selectedBranch}
              onBranchChange={handleBranchChange}
              branches={branches}
            />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-8">
          <div className="rounded-2xl bg-white/70 shadow-lg backdrop-blur-xl p-6">
            <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
              <ArrowsUpDownIcon className="h-6 w-6 text-indigo-400" /> Recent Transactions
            </h2>
            <TransactionsTable 
              transactions={recentTransactions}
              branches={branches}
            />
          </div>
        </div>

        {/* Active Campaigns */}
        <div className="mb-8">
          <div className="rounded-2xl bg-gradient-to-tr from-purple-50/80 to-indigo-50/80 shadow-xl p-6">
            <CampaignCards campaigns={activeCampaigns} />
          </div>
        </div>

        {/* Financial Quick Actions Grid */}
        <div className="mt-8 overflow-hidden rounded-2xl bg-white/70 shadow-xl backdrop-blur-xl">
          <div className="px-6 py-5">
            <h3 className="text-lg font-semibold leading-6 text-indigo-900 mb-4 flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-indigo-500" /> Financial Quick Actions
            </h3>
            <div className="border-t border-indigo-100 pt-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                <Link href="/dashboard/finances/reports/general">
                  <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-white px-3.5 py-2.5 text-center text-sm font-semibold text-indigo-800 shadow hover:bg-indigo-100 cursor-pointer transition">
                    Generate Report
                  </div>
                </Link>
                <Link href="/dashboard/finances/budget/view">
                  <div className="rounded-xl bg-gradient-to-br from-purple-50 to-white px-3.5 py-2.5 text-center text-sm font-semibold text-purple-800 shadow hover:bg-purple-100 cursor-pointer transition">
                    View Budget
                  </div>
                </Link>
                <Link href="/dashboard/finances/pledges">
                  <div className="rounded-xl bg-gradient-to-br from-emerald-50 to-white px-3.5 py-2.5 text-center text-sm font-semibold text-emerald-800 shadow hover:bg-emerald-100 cursor-pointer transition">
                    Manage Pledges
                  </div>
                </Link>
                <Link href="/dashboard/finances/recurring">
                  <div className="rounded-xl bg-gradient-to-br from-amber-50 to-white px-3.5 py-2.5 text-center text-sm font-semibold text-amber-800 shadow hover:bg-amber-100 cursor-pointer transition">
                    Recurring Giving
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
