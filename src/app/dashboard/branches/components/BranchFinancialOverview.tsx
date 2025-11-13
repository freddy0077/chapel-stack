"use client";

import { useQuery } from "@apollo/client";
import { GET_BRANCH_FINANCIAL_SUMMARY } from "@/graphql/queries/branchFinancialQueries";
import Link from "next/link";

interface BranchFinancialOverviewProps {
  branchId: string;
}

export default function BranchFinancialOverview({ branchId }: BranchFinancialOverviewProps) {
  const { data, loading, error } = useQuery(GET_BRANCH_FINANCIAL_SUMMARY, {
    variables: { branchId },
    skip: !branchId,
  });

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-5 border border-slate-200 dark:border-gray-700">
        <div className="animate-pulse space-y-3">
          <div className="h-3 bg-slate-300 dark:bg-gray-600 rounded w-24"></div>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-300 dark:bg-gray-600 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  const stats = data?.branchFinancialSummary || {};
  const {
    totalIncome = 0,
    totalExpenses = 0,
    balance = 0,
    incomeChange = 0,
    expensesChange = 0,
    balanceChange = 0,
  } = stats;

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `GHS ${(value / 1000000).toFixed(1)}M`;
    }
    if (absValue >= 1000) {
      return `GHS ${(value / 1000).toFixed(1)}K`;
    }
    return `GHS ${value.toFixed(0)}`;
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return "↑";
    if (change < 0) return "↓";
    return "→";
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-emerald-600 dark:text-emerald-400";
    if (change < 0) return "text-rose-600 dark:text-rose-400";
    return "text-slate-500 dark:text-slate-400";
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-5 border border-slate-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">
          Financials
        </h3>
        <Link
          href={`/dashboard/report-builder?branch=${branchId}&type=financial`}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
        >
          View Report →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {/* Income */}
        <div className="bg-white dark:bg-gray-700/50 rounded-md p-3 border border-slate-200 dark:border-gray-600">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Income</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            {formatCurrency(totalIncome)}
          </p>
          <p className={`text-xs font-semibold ${getTrendColor(incomeChange)}`}>
            {getTrendIcon(incomeChange)} {Math.abs(incomeChange).toFixed(1)}%
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-white dark:bg-gray-700/50 rounded-md p-3 border border-slate-200 dark:border-gray-600">
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-1">Expenses</p>
          <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            {formatCurrency(totalExpenses)}
          </p>
          <p className={`text-xs font-semibold ${getTrendColor(expensesChange)}`}>
            {getTrendIcon(expensesChange)} {Math.abs(expensesChange).toFixed(1)}%
          </p>
        </div>

        {/* Balance */}
        <div className={`rounded-md p-3 border ${
          balance >= 0
            ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700"
            : "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700"
        }`}>
          <p className={`text-xs font-medium mb-1 ${
            balance >= 0
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-rose-700 dark:text-rose-400"
          }`}>
            Balance
          </p>
          <p className={`text-lg font-bold mb-1 ${
            balance >= 0
              ? "text-emerald-900 dark:text-emerald-100"
              : "text-rose-900 dark:text-rose-100"
          }`}>
            {formatCurrency(balance)}
          </p>
          <p className={`text-xs font-semibold ${getTrendColor(balanceChange)}`}>
            {getTrendIcon(balanceChange)} {Math.abs(balanceChange).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
}
