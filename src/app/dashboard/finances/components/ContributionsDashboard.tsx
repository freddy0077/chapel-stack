"use client";

import { useState } from "react";
import { PlusIcon, ArrowDownTrayIcon, ChartBarIcon, CurrencyDollarIcon, UsersIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Badge } from "@tremor/react";

// Placeholder widgets data
const widgets = [
  {
    label: "Total Tithes This Month",
    value: "$12,500",
    icon: <CurrencyDollarIcon className="h-6 w-6 text-emerald-500" />,
    color: "from-emerald-100 to-emerald-50",
  },
  {
    label: "Total Offerings",
    value: "$7,300",
    icon: <ChartBarIcon className="h-6 w-6 text-indigo-500" />,
    color: "from-indigo-100 to-indigo-50",
  },
  {
    label: "Donations Received",
    value: "$3,800",
    icon: <UsersIcon className="h-6 w-6 text-purple-500" />,
    color: "from-purple-100 to-purple-50",
  },
  {
    label: "Pending Pledges",
    value: "$1,200",
    icon: <ClockIcon className="h-6 w-6 text-amber-500" />,
    color: "from-amber-100 to-amber-50",
  },
];

const quickActions = [
  {
    label: "Add Contribution",
    icon: <PlusIcon className="h-5 w-5" />, 
    href: "#",
    color: "from-emerald-500 to-green-400"
  },
  {
    label: "Import from Excel",
    icon: <ArrowDownTrayIcon className="h-5 w-5" />, 
    href: "#",
    color: "from-indigo-500 to-blue-400"
  },
  {
    label: "View Giving Statement",
    icon: <CurrencyDollarIcon className="h-5 w-5" />, 
    href: "#",
    color: "from-purple-500 to-indigo-400"
  },
];

export default function ContributionsDashboard() {
  // Placeholder for chart data
  // TODO: Replace with real chart components and data
  return (
    <div className="space-y-10">
      {/* Top Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map((w) => (
          <div key={w.label} className={`bg-gradient-to-br ${w.color} rounded-2xl shadow-xl p-6 flex flex-col items-start relative overflow-hidden backdrop-blur-xl`}> 
            <div className="absolute right-4 top-4 opacity-10">{w.icon}</div>
            <span className="text-xs font-semibold text-gray-500 mb-2">{w.label}</span>
            <span className="text-2xl font-bold text-gray-900 mb-1">{w.value}</span>
          </div>
        ))}
      </div>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        {quickActions.map((a) => (
          <a key={a.label} href={a.href} className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-br ${a.color} px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.03] transition-transform`}>
            {a.icon}
            {a.label}
          </a>
        ))}
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart Placeholder */}
        <div className="bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <ChartBarIcon className="h-5 w-5 text-indigo-400" />
            <span className="font-semibold text-indigo-900">Monthly Giving Trends</span>
          </div>
          <div className="flex-1 flex items-center justify-center text-indigo-300 text-lg font-bold h-40">
            {/* TODO: Insert Line Chart */}
            Line Chart Here
          </div>
        </div>
        {/* Pie Chart Placeholder */}
        <div className="bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <CurrencyDollarIcon className="h-5 w-5 text-emerald-400" />
            <span className="font-semibold text-emerald-900">Contribution Breakdown</span>
          </div>
          <div className="flex-1 flex items-center justify-center text-emerald-300 text-lg font-bold h-40">
            {/* TODO: Insert Pie Chart */}
            Pie Chart Here
          </div>
        </div>
      </div>
    </div>
  );
}
