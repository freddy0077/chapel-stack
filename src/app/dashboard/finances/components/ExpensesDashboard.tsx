"use client";

import { PlusIcon, ChartBarIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";

const summary = [
  { label: "This Month’s Expenses", value: "$4,800", icon: <CurrencyDollarIcon className="h-6 w-6 text-rose-500" />, color: "from-rose-100 to-rose-50" },
  { label: "Staff Salaries", value: "$2,100", icon: <CurrencyDollarIcon className="h-6 w-6 text-blue-500" />, color: "from-blue-100 to-blue-50" },
  { label: "Outreach Cost", value: "$800", icon: <CurrencyDollarIcon className="h-6 w-6 text-indigo-500" />, color: "from-indigo-100 to-indigo-50" },
  { label: "Utilities", value: "$350", icon: <CurrencyDollarIcon className="h-6 w-6 text-amber-500" />, color: "from-amber-100 to-amber-50" },
];

export default function ExpensesDashboard() {
  return (
    <div className="space-y-10">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summary.map((w) => (
          <div key={w.label} className={`bg-gradient-to-br ${w.color} rounded-2xl shadow-xl p-6 flex flex-col items-start relative overflow-hidden backdrop-blur-xl`}>
            <div className="absolute right-4 top-4 opacity-10">{w.icon}</div>
            <span className="text-xs font-semibold text-gray-500 mb-2">{w.label}</span>
            <span className="text-2xl font-bold text-gray-900 mb-1">{w.value}</span>
          </div>
        ))}
      </div>
      {/* Expense vs. Budget Chart Placeholder */}
      <div className="bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <ChartBarIcon className="h-5 w-5 text-rose-400" />
          <span className="font-semibold text-rose-900">Expense vs. Budget</span>
        </div>
        <div className="flex-1 flex items-center justify-center text-rose-300 text-lg font-bold h-40">
          {/* TODO: Insert Bar/Donut Chart */}
          Chart Here
        </div>
      </div>
      <div className="flex justify-end">
        <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform">
          <PlusIcon className="h-5 w-5 mr-2" /> Add Expense
        </button>
      </div>
    </div>
  );
}
