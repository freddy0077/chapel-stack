import React from "react";
import { 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartPieIcon 
} from "@heroicons/react/24/outline";
import { formatCurrencyWhole } from "@/utils/currency";

interface FinanceStats {
  totalContributions: number;
  tithes: number;
  offering: number;
  donation: number;
  pledge: number;
  specialContribution: number;
  expenses: number;
}

interface FinancialBreakdownProps {
  financeStats: FinanceStats;
}

export function FinancialBreakdown({ financeStats }: FinancialBreakdownProps) {
  const netIncome = financeStats.totalContributions - financeStats.expenses;
  const isPositive = netIncome >= 0;

  const contributionBreakdown = [
    { label: "Tithes", value: financeStats.tithes, color: "bg-blue-500" },
    { label: "Offerings", value: financeStats.offering, color: "bg-green-500" },
    { label: "Donations", value: financeStats.donation, color: "bg-purple-500" },
    { label: "Pledges", value: financeStats.pledge, color: "bg-yellow-500" },
    { label: "Special Contributions", value: financeStats.specialContribution, color: "bg-pink-500" },
  ];

  const total = contributionBreakdown.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
          <CurrencyDollarIcon className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Income</h3>
              <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrencyWhole(financeStats.totalContributions)}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Total Expenses</h3>
              <ArrowTrendingDownIcon className="w-6 h-6 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-red-600">
              {formatCurrencyWhole(financeStats.expenses)}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Net Income</h3>
              {isPositive ? (
                <ArrowTrendingUpIcon className="w-6 h-6 text-green-500" />
              ) : (
                <ArrowTrendingDownIcon className="w-6 h-6 text-red-500" />
              )}
            </div>
            <div className={`text-3xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrencyWhole(Math.abs(netIncome))}
            </div>
          </div>
        </div>

        {/* Contribution Breakdown */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <ChartPieIcon className="w-6 h-6 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Contribution Breakdown</h3>
            </div>

            <div className="space-y-4">
              {contributionBreakdown.map((item) => {
                const percentage = total > 0 ? (item.value / total) * 100 : 0;
                return (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full ${item.color}`} />
                          <span className="font-medium text-gray-700">{item.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-gray-900">
                            {formatCurrencyWhole(item.value)}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
