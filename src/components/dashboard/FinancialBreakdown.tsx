import React from "react";
import { 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartPieIcon,
  BanknotesIcon,
  MinusCircleIcon
} from "@heroicons/react/24/outline";
import { formatCurrencyWhole } from "@/utils/currency";

interface FinanceStats {
  totalContributions: number;
  totalExpenses: number;
  tithes: number;
  offering: number;
  donation: number;
  pledge: number;
  specialContribution: number;
  growthRate: number;
  netIncome: number;
}

interface FinancialBreakdownProps {
  financeStats: FinanceStats;
}

export function FinancialBreakdown({ financeStats }: FinancialBreakdownProps) {
  const isPositive = financeStats.netIncome >= 0;

  const contributionBreakdown = [
    { label: "Tithes", value: financeStats.tithes, color: "bg-blue-500", percentage: financeStats.totalContributions > 0 ? (financeStats.tithes / financeStats.totalContributions) * 100 : 0 },
    { label: "Offerings", value: financeStats.offering, color: "bg-green-500", percentage: financeStats.totalContributions > 0 ? (financeStats.offering / financeStats.totalContributions) * 100 : 0 },
    { label: "Donations", value: financeStats.donation, color: "bg-purple-500", percentage: financeStats.totalContributions > 0 ? (financeStats.donation / financeStats.totalContributions) * 100 : 0 },
    { label: "Pledges", value: financeStats.pledge, color: "bg-yellow-500", percentage: financeStats.totalContributions > 0 ? (financeStats.pledge / financeStats.totalContributions) * 100 : 0 },
    { label: "Special Contributions", value: financeStats.specialContribution, color: "bg-pink-500", percentage: financeStats.totalContributions > 0 ? (financeStats.specialContribution / financeStats.totalContributions) * 100 : 0 },
  ];

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
          {/* Total Contributions Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600">
                  <BanknotesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">Total Contributions</h3>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
              </div>
              {financeStats.growthRate !== 0 && (
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  financeStats.growthRate > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {financeStats.growthRate > 0 ? (
                    <ArrowTrendingUpIcon className="w-3 h-3" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-3 h-3" />
                  )}
                  {Math.abs(financeStats.growthRate)}%
                </div>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrencyWhole(financeStats.totalContributions)}
            </div>
          </div>

          {/* Total Expenses Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600">
                <MinusCircleIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Total Expenses</h3>
                <p className="text-sm text-gray-600">This month</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrencyWhole(financeStats.totalExpenses)}
            </div>
          </div>

          {/* Net Income Card */}
          <div className={`rounded-xl shadow-lg p-6 border transition-shadow hover:shadow-xl ${
            isPositive 
              ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-200' 
              : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                isPositive 
                  ? 'bg-gradient-to-br from-green-500 to-green-600' 
                  : 'bg-gradient-to-br from-red-500 to-red-600'
              }`}>
                {isPositive ? (
                  <ArrowTrendingUpIcon className="w-5 h-5 text-white" />
                ) : (
                  <ArrowTrendingDownIcon className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className={`font-semibold ${isPositive ? 'text-green-800' : 'text-red-800'}`}>
                  Net Income
                </h3>
                <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? 'Surplus' : 'Deficit'}
                </p>
              </div>
            </div>
            <div className={`text-2xl font-bold ${isPositive ? 'text-green-800' : 'text-red-800'}`}>
              {formatCurrencyWhole(financeStats.netIncome)}
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
              {contributionBreakdown.map((item, index) => (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                      <span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-800">
                        {formatCurrencyWhole(item.value)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 group-hover:opacity-80 ${item.color}`}
                      style={{ width: `${Math.max(item.percentage, 2)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {financeStats.totalContributions === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ChartPieIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No contributions recorded this month</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
