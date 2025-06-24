"use client";

import { 
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  ArchiveBoxIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  CalendarDaysIcon,
  PlusIcon
} from "@heroicons/react/24/outline";
import { 
  SparkLineChart,
  BarChart,
  AreaChart,
  DonutChart // Check if DonutChart is available in @tremor/react
} from "@tremor/react";

interface FinancialOverviewProps {
  totalDonations: string;
  totalExpenses: string;
  currentBalance: string;
  budgetProgress: number;
  monthlyChange: string;
  donationTrends?: number[];
  expenseTrends?: number[];
  balanceTrends?: number[];
  selectedBranch: string;
  onBranchChange: (branch: string) => void;
  branches: { id: string; name: string }[];
}

const FinancialOverview: React.FC<FinancialOverviewProps> = (props: FinancialOverviewProps) => {
  const {
    totalDonations,
    totalExpenses,
    currentBalance,
    budgetProgress,
    monthlyChange,
    donationTrends = [],
    expenseTrends = [],
    balanceTrends = [],
    selectedBranch,
    onBranchChange,
    branches
  } = props;

  // Placeholder/mock data for new sections
  const pledgesOutstanding = "GHS 5,000";
  const numTransactionsThisWeek = 42;
  const accountBalances = [
    { name: "Cash", balance: "GHS 2,500", last: "2025-06-20" },
    { name: "Bank Account", balance: "GHS 12,000", last: "2025-06-18" },
    { name: "Mobile Money", balance: "GHS 4,800", last: "2025-06-19" },
  ];
  const incomeBreakdown = [
    { name: "Tithes", value: 45 },
    { name: "Offerings", value: 28 },
    { name: "Special Donations", value: 12 },
    { name: "Fundraising", value: 10 },
    { name: "Other", value: 5 },
  ];
  const expenseBreakdown = [
    { name: "Salaries & Staff", value: 38 },
    { name: "Utilities", value: 17 },
    { name: "Missions", value: 15 },
    { name: "Maintenance", value: 12 },
    { name: "Events", value: 10 },
    { name: "Others", value: 8 },
  ];
  const topDonors = [
    { name: "John Smith", amount: "GHS 2,500", last: "2025-06-18" },
    { name: "Sarah Brown", amount: "GHS 2,100", last: "2025-06-16" },
    { name: "Michael Wilson", amount: "GHS 1,800", last: "2025-06-15" },
    { name: "Emily Davis", amount: "GHS 1,500", last: "2025-06-14" },
    { name: "Anonymous", amount: "GHS 1,200", last: "2025-06-13" },
  ];
  const latestTransactions = [
    { date: "2025-06-20", type: "Income", category: "Tithes", amount: "+GHS 500", reference: "TRX123", notes: "Sunday Service" },
    { date: "2025-06-19", type: "Expense", category: "Utilities", amount: "-GHS 200", reference: "TRX124", notes: "Electricity" },
    { date: "2025-06-18", type: "Income", category: "Offerings", amount: "+GHS 300", reference: "TRX125", notes: "Midweek" },
    { date: "2025-06-17", type: "Expense", category: "Events", amount: "-GHS 150", reference: "TRX126", notes: "Youth Event" },
    { date: "2025-06-16", type: "Income", category: "Special Donations", amount: "+GHS 400", reference: "TRX127", notes: "Anniversary" },
  ];
  const alerts = [
    { type: "pledge", message: "3 pledges pending fulfillment" },
    { type: "budget", message: "Missions budget overspent by 10%" },
    { type: "low_balance", message: "Cash account below GHS 500" },
    { type: "unreconciled", message: "2 transactions need reconciliation" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6 space-y-10">
      {/* Filters & Branch Switcher */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-2">
        <div className="flex gap-2 items-center">
          <FunnelIcon className="h-5 w-5 text-indigo-400" />
          <select className="rounded-lg border px-2 py-1 text-sm" defaultValue="this_month">
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>
          <CalendarDaysIcon className="h-5 w-5 text-indigo-400 ml-2" />
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-medium text-sm text-gray-500">Branch:</span>
          <select className="rounded-lg border px-2 py-1 text-sm" value={selectedBranch} onChange={e => onBranchChange(e.target.value)}>
            <option value="all">All Branches</option>
            {branches.map(branch => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
          </select>
        </div>
      </div>
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-emerald-100 to-green-50 p-4 flex flex-col items-start shadow">
          <span className="text-xs font-semibold text-emerald-700 mb-1">Total Income</span>
          <span className="text-2xl font-bold text-emerald-900">{totalDonations}</span>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-rose-100 to-red-50 p-4 flex flex-col items-start shadow">
          <span className="text-xs font-semibold text-rose-700 mb-1">Total Expenses</span>
          <span className="text-2xl font-bold text-rose-900">{totalExpenses}</span>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-orange-100 to-yellow-50 p-4 flex flex-col items-start shadow">
          <span className="text-xs font-semibold text-orange-700 mb-1">Net Balance</span>
          <span className="text-2xl font-bold text-orange-900">{currentBalance}</span>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-indigo-100 to-purple-50 p-4 flex flex-col items-start shadow">
          <span className="text-xs font-semibold text-indigo-700 mb-1">Outstanding Pledges</span>
          <span className="text-2xl font-bold text-indigo-900">{pledgesOutstanding}</span>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-blue-100 to-sky-50 p-4 flex flex-col items-start shadow">
          <span className="text-xs font-semibold text-blue-700 mb-1">Accounts Balance</span>
          <span className="text-2xl font-bold text-blue-900">GHS 19,300</span>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-100 to-pink-50 p-4 flex flex-col items-start shadow">
          <span className="text-xs font-semibold text-purple-700 mb-1">Transactions (This Week)</span>
          <span className="text-2xl font-bold text-purple-900">{numTransactionsThisWeek}</span>
        </div>
      </div>
      {/* 2. Income vs Expense Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-2">Income vs Expense</h3>
        <BarChart
          data={[
            { name: "Week 1", Income: 1200, Expense: 800 },
            { name: "Week 2", Income: 1500, Expense: 950 },
            { name: "Week 3", Income: 1100, Expense: 1200 },
            { name: "Week 4", Income: 1700, Expense: 1300 },
          ]}
          categories={["Income", "Expense"]}
          index="name"
          colors={["emerald", "rose"]}
          yAxisWidth={48}
        />
      </div>
      {/* 3. Income Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-2">Income Breakdown</h3>
          <DonutChart
            data={incomeBreakdown}
            category="value"
            index="name"
            colors={["emerald", "indigo", "purple", "yellow", "gray"]}
            valueFormatter={(v) => `${v}%`}
          />
        </div>
        {/* 4. Expense Breakdown */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-2">Expense Breakdown</h3>
          <DonutChart
            data={expenseBreakdown}
            category="value"
            index="name"
            colors={["rose", "blue", "indigo", "yellow", "purple", "gray"]}
            valueFormatter={(v) => `${v}%`}
          />
        </div>
      </div>
      {/* 5. Account Balances Overview */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Account Balances</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accountBalances.map(acc => (
            <div key={acc.name} className="rounded-lg border p-4 flex flex-col gap-2 bg-gradient-to-br from-blue-50 to-sky-50">
              <div className="flex items-center gap-2">
                <BanknotesIcon className="h-6 w-6 text-blue-400" />
                <span className="font-semibold text-blue-900">{acc.name}</span>
              </div>
              <span className="text-xl font-bold text-blue-800">{acc.balance}</span>
              <span className="text-xs text-gray-500">Last: {acc.last}</span>
              <div className="flex gap-2 mt-2">
                <button className="rounded bg-indigo-100 text-indigo-700 px-3 py-1 text-xs font-semibold hover:bg-indigo-200">View Details</button>
                <button className="rounded bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold hover:bg-emerald-200">Transfer Funds</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 6. Giving Trends */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-2">Giving Trends (Monthly)</h3>
        <AreaChart
          data={[
            { month: "Jan", Tithe: 1200, Offering: 900 },
            { month: "Feb", Tithe: 1300, Offering: 950 },
            { month: "Mar", Tithe: 1250, Offering: 1000 },
            { month: "Apr", Tithe: 1400, Offering: 1100 },
            { month: "May", Tithe: 1350, Offering: 1050 },
            { month: "Jun", Tithe: 1500, Offering: 1200 },
          ]}
          index="month"
          categories={["Tithe", "Offering"]}
          colors={["emerald", "indigo"]}
          yAxisWidth={48}
        />
      </div>
      {/* 7. Top Donors — Modern Card List */}
      <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/80 rounded-xl shadow p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Top Donors</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {topDonors.map(donor => (
            <div key={donor.name} className="flex items-center gap-4 bg-white/80 rounded-2xl shadow hover:shadow-xl p-4 transition group">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                {donor.name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-indigo-900 group-hover:text-purple-700 transition">{donor.name}</span>
                  {donor.name === 'Anonymous' && <span className="ml-1 px-2 py-0.5 rounded bg-gray-200 text-xs text-gray-600">Anonymous</span>}
                </div>
                <div className="text-xs text-gray-500">Last: {donor.last}</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold text-emerald-700 text-lg">{donor.amount}</span>
                <span className="text-xs text-indigo-400">YTD</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 8. Latest Transactions Table — Modern Carded Rows */}
      <div className="bg-gradient-to-br from-white/80 to-indigo-50/60 rounded-xl shadow p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Latest Transactions</h3>
        <div className="flex flex-col gap-3">
          {latestTransactions.map(txn => (
            <div key={txn.reference} className="flex flex-col md:flex-row md:items-center gap-2 bg-white/90 rounded-xl shadow hover:shadow-lg p-4 transition border-l-4 border-emerald-300 md:gap-6">
              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 w-20">{txn.date}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${txn.type === 'Income' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{txn.type}</span>
                <span className="inline-block px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-medium">{txn.category}</span>
                <span className={`font-bold text-lg ${txn.amount.startsWith('-') ? 'text-rose-600' : 'text-emerald-600'}`}>{txn.amount}</span>
                <span className="text-xs text-gray-400 w-24">{txn.reference}</span>
                <span className="text-xs text-gray-500 flex-1">{txn.notes}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 9. Pending Actions / Alerts — Modern Alert List */}
      <div className="bg-gradient-to-br from-orange-50/80 to-yellow-50/80 rounded-xl shadow p-6">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Pending Actions & Alerts</h3>
        <div className="flex flex-col gap-3">
          {alerts.map((alert, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/90 rounded-xl shadow p-3 border-l-4 border-orange-300">
              <ExclamationTriangleIcon className="h-5 w-5 text-orange-400" />
              <span className="font-medium text-gray-700">{alert.message}</span>
            </div>
          ))}
        </div>
      </div>
      {/* 10. Quick Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-end items-center">
        <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-400 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform">
          <PlusIcon className="h-5 w-5 mr-2" /> Add Contribution
        </button>
        <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform">
          <PlusIcon className="h-5 w-5 mr-2" /> Add Expense
        </button>
        <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform">
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" /> Export Dashboard
        </button>
      </div>
    </div>
  );
};

export default FinancialOverview;
