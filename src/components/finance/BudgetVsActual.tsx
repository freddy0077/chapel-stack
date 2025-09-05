"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  BUDGET_VS_ACTUAL_QUERY,
  BudgetVsActual as BudgetVsActualType,
  BudgetVsActualInput,
} from "@/graphql/queries/budgetVsActual";
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline";

interface BudgetVsActualProps {
  organisationId: string;
  branchId?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

const BudgetVsActual: React.FC<BudgetVsActualProps> = ({
  organisationId,
  branchId,
  dateRange,
}) => {
  const [selectedPeriodType, setSelectedPeriodType] = useState<
    "MONTHLY" | "QUARTERLY" | "YEARLY"
  >("MONTHLY");

  // Construct GraphQL input
  const budgetInput: BudgetVsActualInput = useMemo(() => {
    const now = new Date();
    const defaultStartDate = new Date(now.getFullYear(), 0, 1); // Start of current year
    const defaultEndDate = new Date(now.getFullYear(), 11, 31); // End of current year

    return {
      organisationId,
      branchId,
      dateRange: {
        startDate: (dateRange?.startDate || defaultStartDate).toISOString(),
        endDate: (dateRange?.endDate || defaultEndDate).toISOString(),
      },
      periodType: selectedPeriodType,
    };
  }, [organisationId, branchId, dateRange, selectedPeriodType]);

  const { data, loading, error } = useQuery(BUDGET_VS_ACTUAL_QUERY, {
    variables: { input: budgetInput },
    skip: !organisationId,
    errorPolicy: "all",
    fetchPolicy: "cache-and-network", // Always fetch fresh data
    notifyOnNetworkStatusChange: true, // Re-render on network status changes
  });

  console.log("BudgetVsActual Query Debug:", {
    budgetInput,
    loading,
    error: error?.message,
    dataReceived: !!data,
    totalActual: data?.budgetVsActual?.summary?.totalActual,
    queryTimestamp: new Date().toISOString(),
  });

  const budgetData: BudgetVsActualType | undefined = data?.budgetVsActual;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (percent: number): string => {
    return `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on_target":
        return "text-green-600 bg-green-100";
      case "under_budget":
        return "text-blue-600 bg-blue-100";
      case "over_budget":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on_target":
        return <CheckCircleIcon className="h-4 w-4" />;
      case "under_budget":
        return <ArrowDownIcon className="h-4 w-4" />;
      case "over_budget":
        return <ArrowUpIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) {
      return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />;
    } else if (variance < 0) {
      return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />;
    } else {
      return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            Error Loading Budget Analysis
          </h3>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!budgetData) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-gray-500 text-center">
          <ChartBarIcon className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Budget Data Available</h3>
          <p className="text-sm">
            Budget vs Actual analysis will appear here when data is available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ChartBarIcon className="h-6 w-6 mr-2 text-blue-600" />
              Budget vs Actual Analysis
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Compare budgeted amounts with actual spending and revenue
            </p>
          </div>

          {/* Period Type Selector */}
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedPeriodType}
              onChange={(e) =>
                setSelectedPeriodType(
                  e.target.value as "MONTHLY" | "QUARTERLY" | "YEARLY",
                )
              }
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Budgeted */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">
                  Total Budgeted
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(budgetData.summary.totalBudgeted)}
                </p>
              </div>
            </div>
          </div>

          {/* Total Actual */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">
                  Total Actual
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(budgetData.summary.totalActual)}
                </p>
              </div>
            </div>
          </div>

          {/* Variance */}
          <div
            className={`rounded-lg p-4 ${budgetData.summary.totalVariance >= 0 ? "bg-green-50" : "bg-red-50"}`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {getVarianceIcon(budgetData.summary.totalVariance)}
              </div>
              <div className="ml-4">
                <p
                  className={`text-sm font-medium ${budgetData.summary.totalVariance >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  Variance
                </p>
                <p
                  className={`text-2xl font-bold ${budgetData.summary.totalVariance >= 0 ? "text-green-900" : "text-red-900"}`}
                >
                  {formatCurrency(budgetData.summary.totalVariance)}
                </p>
                <p
                  className={`text-xs ${budgetData.summary.totalVariance >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatPercentage(budgetData.summary.totalVariancePercent)}
                </p>
              </div>
            </div>
          </div>

          {/* Budget Utilization */}
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">
                  Budget Utilization
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {budgetData.summary.budgetUtilization.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue vs Budget */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Revenue Analysis
          </h3>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budgeted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgetData.revenueItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.budgetedAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.actualAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        {getVarianceIcon(item.variance)}
                        <span
                          className={`ml-1 ${item.variance >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatCurrency(item.variance)} (
                          {formatPercentage(item.variancePercent)})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                      >
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">
                          {item.status.replace("_", " ")}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expense vs Budget */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Expense Analysis
          </h3>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budgeted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actual
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Variance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {budgetData.expenseItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.budgetedAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(item.actualAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        {getVarianceIcon(item.variance)}
                        <span
                          className={`ml-1 ${item.variance >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {formatCurrency(Math.abs(item.variance))} (
                          {formatPercentage(Math.abs(item.variancePercent))})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                      >
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">
                          {item.status.replace("_", " ")}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        {budgetData.notes && (
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">{budgetData.notes}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetVsActual;
