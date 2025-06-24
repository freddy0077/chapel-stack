"use client";

import { useState, useEffect } from "react";
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
import ContributionsDashboard from "./components/ContributionsDashboard";
import ContributionsList from "./components/ContributionsList";
import ContributionModal from "./components/ContributionModal";
import DonorDetails from "./components/DonorDetails";
import ExpensesDashboard from "./components/ExpensesDashboard";
import ExpensesList from "./components/ExpensesList";
import ExpenseModal from "./components/ExpenseModal";
import ReportsPage from "./components/ReportsPage";
import BudgetsPage from "./components/BudgetsPage";
import AccountsPage from "./components/AccountsPage";
import SettingsPage from "./components/SettingsPage";
import ImportFromExcelModal from "./components/ImportFromExcelModal";
import GivingStatementModal from "./components/GivingStatementModal";
import AddAccountModal from "./components/AddAccountModal";
import AddBudgetModal from "./components/AddBudgetModal";

import { useFinanceDashboardData } from "../../../graphql/hooks/useFinanceDashboardData";
import { mapKpiCardsToOverview } from "./FinanceKpiMapper";
import { useContributionsStats } from "../../../graphql/hooks/useContributionsStats";
import { useRouter } from "next/navigation";
import { useBranches } from "../../../graphql/hooks/useBranches";
import DashboardHeader from "@/components/DashboardHeader";

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

export default function Finances() {
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [contributionModalOpen, setContributionModalOpen] = useState(false);
  const [importExcelModalOpen, setImportExcelModalOpen] = useState(false);
  const [givingStatementModalOpen, setGivingStatementModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [addAccountModalOpen, setAddAccountModalOpen] = useState(false);
  const [addBudgetModalOpen, setAddBudgetModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("dashboard"); // dashboard, contributions, expenses, reports, budgets, accounts, settings
  const router = useRouter();
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

  const navLinks = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Contributions", key: "contributions" },
    { label: "Expenses", key: "expenses" },
    { label: "Reports", key: "reports" },
    { label: "Budgets", key: "budgets" },
    { label: "Accounts", key: "accounts" },
    { label: "Settings", key: "settings" },
  ];

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

        {/* --- SECTION NAVIGATION --- */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {navLinks.map(link => (
            <button
              key={link.key}
              className={`px-4 py-2 rounded-xl font-semibold shadow transition text-sm ${activeSection === link.key ? 'bg-gradient-to-br from-indigo-500 to-purple-400 text-white scale-105' : 'bg-white/70 text-indigo-700 hover:bg-indigo-100'}`}
              onClick={() => setActiveSection(link.key)}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* --- SECTION CONTENT --- */}
        {activeSection === "dashboard" && (
          <>
            {/* Quick Actions */}
         
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

            {/* Active Campaigns */}
            <div className="mb-8">
              <div className="rounded-2xl bg-gradient-to-tr from-purple-50/80 to-indigo-50/80 shadow-xl p-6">
                <CampaignCards campaigns={activeCampaigns} />
              </div>
            </div>
            <ContributionModal open={contributionModalOpen} onClose={() => setContributionModalOpen(false)} />
          </>
        )}
        {activeSection === "contributions" && (
          <>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-indigo-900">Contributions</h2>
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-400 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform" onClick={() => setContributionModalOpen(true)}>
                  <PlusIcon className="h-5 w-5 mr-2" /> Add Contribution
                </button>
                <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform" onClick={() => setImportExcelModalOpen(true)}>
                  <ArrowsUpDownIcon className="h-5 w-5 mr-2" /> Import from Excel
                </button>
                <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform" onClick={() => setGivingStatementModalOpen(true)}>
                  <ChartBarIcon className="h-5 w-5 mr-2" /> View Giving Statement
                </button>
              </div>
            </div>
            <ContributionsDashboard />
            <div className="mt-8">
              <ContributionsList />
            </div>
            <ContributionModal open={contributionModalOpen} onClose={() => setContributionModalOpen(false)} />
            <ImportFromExcelModal open={importExcelModalOpen} onClose={() => setImportExcelModalOpen(false)} />
            <GivingStatementModal open={givingStatementModalOpen} onClose={() => setGivingStatementModalOpen(false)} />
          </>
        )}
        {activeSection === "expenses" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-rose-900">Expenses</h2>
              <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform" onClick={() => setExpenseModalOpen(true)}>
                <PlusIcon className="h-5 w-5 mr-2" /> Add Expense
              </button>
            </div>
            <ExpensesDashboard />
            <div className="mt-8">
              <ExpensesList />
            </div>
            <ExpenseModal open={expenseModalOpen} onClose={() => setExpenseModalOpen(false)} />
          </>
        )}
        {activeSection === "reports" && (
          <ReportsPage />
        )}
        {activeSection === "budgets" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-900">Budgets</h2>
              <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-400 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform" onClick={() => setAddBudgetModalOpen(true)}>
                <span className="mr-2">+</span> Add Budget
              </button>
            </div>
            <BudgetsPage />
            <AddBudgetModal open={addBudgetModalOpen} onClose={() => setAddBudgetModalOpen(false)} />
          </>
        )}
        {activeSection === "accounts" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900">Accounts</h2>
              <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform" onClick={() => setAddAccountModalOpen(true)}>
                <span className="mr-2">+</span> Add Account
              </button>
            </div>
            <AccountsPage />
            <AddAccountModal open={addAccountModalOpen} onClose={() => setAddAccountModalOpen(false)} />
          </>
        )}
        {activeSection === "settings" && (
          <SettingsPage />
        )}
      </div>
    </div>
  );
}
