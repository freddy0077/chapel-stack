"use client";

import { useState } from "react";
import {
  ArrowDownTrayIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const tabs = [
  {
    label: "Income Report",
    icon: <CurrencyDollarIcon className="h-5 w-5 text-emerald-500" />,
  },
  {
    label: "Expense Report",
    icon: <BanknotesIcon className="h-5 w-5 text-rose-500" />,
  },
  {
    label: "Budget Report",
    icon: <ChartBarIcon className="h-5 w-5 text-blue-500" />,
  },
  {
    label: "Giving by Member",
    icon: <UsersIcon className="h-5 w-5 text-indigo-500" />,
  },
  {
    label: "Giving by Fund",
    icon: <CurrencyDollarIcon className="h-5 w-5 text-purple-500" />,
  },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState(0);
  // TODO: Filter state and report content
  return (
    <div className="bg-white/80 rounded-2xl shadow-xl p-6 mt-8">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end mb-6">
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-blue-500 mb-1 ml-1">
            Date Range
          </label>
          <input
            type="date"
            className="rounded-xl border border-blue-100 px-3 py-2 bg-white/90 shadow focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-blue-500 mb-1 ml-1">
            Branch
          </label>
          <input
            type="text"
            className="rounded-xl border border-blue-100 px-3 py-2 bg-white/90 shadow focus:ring-2 focus:ring-blue-300"
            placeholder="Branch"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-blue-500 mb-1 ml-1">
            Category
          </label>
          <input
            type="text"
            className="rounded-xl border border-blue-100 px-3 py-2 bg-white/90 shadow focus:ring-2 focus:ring-blue-300"
            placeholder="Category"
          />
        </div>
        <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-blue-50 to-white py-2 px-5 text-sm font-semibold text-blue-700 shadow-lg hover:bg-blue-100 border border-blue-100 transition mt-2">
          <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Export Excel
        </button>
        <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-blue-50 to-white py-2 px-5 text-sm font-semibold text-blue-700 shadow-lg hover:bg-blue-100 border border-blue-100 transition mt-2">
          <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Export PDF
        </button>
        <button className="inline-flex items-center rounded-xl bg-gradient-to-br from-blue-50 to-white py-2 px-5 text-sm font-semibold text-blue-700 shadow-lg hover:bg-blue-100 border border-blue-100 transition mt-2">
          <ArrowDownTrayIcon className="h-4 w-4 mr-1" /> Print
        </button>
      </div>
      {/* Tabs */}
      <div className="flex gap-3 mb-6 border-b border-blue-100">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`flex items-center gap-2 px-5 py-2 font-semibold rounded-t-xl transition ${activeTab === i ? "bg-gradient-to-br from-blue-100 to-white text-blue-800 shadow" : "text-blue-400 hover:text-blue-700"}`}
            onClick={() => setActiveTab(i)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      {/* Report Content Placeholder */}
      <div className="text-blue-300 text-lg font-bold h-40 flex items-center justify-center">
        Report Content Here
      </div>
    </div>
  );
}
