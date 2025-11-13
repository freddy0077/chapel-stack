"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@apollo/client";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useOrganizationBranchFilter } from "@/hooks";
import {
  COMPARATIVE_PERIOD_ANALYSIS,
  ComparativePeriodAnalysisInput,
  ComparativePeriodAnalysisResult,
} from "../../graphql/queries/analytics";

// Dynamically import Recharts components to prevent SSR issues
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false },
);

const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), {
  ssr: false,
});

const LineChart = dynamic(
  () => import("recharts").then((mod) => mod.LineChart),
  { ssr: false },
);

const ComposedChart = dynamic(
  () => import("recharts").then((mod) => mod.ComposedChart),
  { ssr: false },
);

const CartesianGrid = dynamic(
  () => import("recharts").then((mod) => mod.CartesianGrid),
  { ssr: false },
);

const XAxis = dynamic(() => import("recharts").then((mod) => mod.XAxis), {
  ssr: false,
});

const YAxis = dynamic(() => import("recharts").then((mod) => mod.YAxis), {
  ssr: false,
});

const Tooltip = dynamic(() => import("recharts").then((mod) => mod.Tooltip), {
  ssr: false,
});

const Legend = dynamic(() => import("recharts").then((mod) => mod.Legend), {
  ssr: false,
});

const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), {
  ssr: false,
});

const Line = dynamic(() => import("recharts").then((mod) => mod.Line), {
  ssr: false,
});

interface ComparativePeriodAnalysisProps {
  fundId?: string;
}

const ComparativePeriodAnalysis: React.FC<ComparativePeriodAnalysisProps> = ({
  fundId,
}) => {
  const [comparisonType, setComparisonType] = useState<
    "YEAR_OVER_YEAR" | "MONTH_OVER_MONTH" | "QUARTER_OVER_QUARTER"
  >("YEAR_OVER_YEAR");
  const [periods, setPeriods] = useState(12);
  const [isClient, setIsClient] = useState(false);

  // Get organisationId and branchId using the same pattern as branch-finances page
  const { state } = useAuth();
  const user = state.user;
  const { organisationId, branchId: defaultBranchId } =
    useOrganizationBranchFilter();
  console.log("ComparativePeriodAnalysis OrganisationId", organisationId);

  // Use the same super admin logic as the branch-finances page
  const isSuperAdmin = user?.roles?.some((role) => role.name === "ADMIN");
  const effectiveBranchId = isSuperAdmin ? undefined : defaultBranchId; // For super admin, don't restrict by branch

  // Memoize GraphQL input to prevent unnecessary re-renders - only when we have valid data
  const comparativeInput: ComparativePeriodAnalysisInput | null =
    useMemo(() => {
      if (!organisationId) {
        return null;
      }
      return {
        organisationId,
        branchId: effectiveBranchId,
        comparisonType,
        periods,
        fundId,
      };
    }, [organisationId, effectiveBranchId, comparisonType, periods, fundId]);

  // GraphQL query for comparative period analysis
  const { data, loading, error } = useQuery<{
    comparativePeriodAnalysis: ComparativePeriodAnalysisResult;
  }>(COMPARATIVE_PERIOD_ANALYSIS, {
    variables: { input: comparativeInput },
    skip: !organisationId || !comparativeInput, // Skip if organisationId is undefined or input is null
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug logging
  console.log("ComparativePeriodAnalysis Debug:", {
    organisationId,
    branchId: effectiveBranchId,
    fundId,
    hasOrganisationId: !!organisationId,
    inputValid: !!comparativeInput,
    querySkipped: !organisationId || !comparativeInput,
  });

  // Show loading state
  if (!organisationId) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading organization data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Comparative Period Analysis
          </h3>
          <div className="animate-pulse bg-gray-200 h-8 w-40 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="h-80 bg-gray-100 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error("Comparative Period Analysis Error:", error);
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Comparative Period Analysis
          </h3>
          <select
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="YEAR_OVER_YEAR">Year over Year</option>
            <option value="MONTH_OVER_MONTH">Month over Month</option>
            <option value="QUARTER_OVER_QUARTER">Quarter over Quarter</option>
          </select>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            ⚠️ Error loading comparative analysis
          </div>
          <p className="text-gray-500 text-sm">
            {error.message ||
              "Unable to load comparative period analysis. Please try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const analysisData = data?.comparativePeriodAnalysis;

  if (!analysisData || !analysisData.data.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Comparative Period Analysis
          </h3>
          <select
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="YEAR_OVER_YEAR">Year over Year</option>
            <option value="MONTH_OVER_MONTH">Month over Month</option>
            <option value="QUARTER_OVER_QUARTER">Quarter over Quarter</option>
          </select>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            📊 No comparative data available
          </div>
          <p className="text-gray-500 text-sm">
            No financial data found for comparative analysis.
          </p>
        </div>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  // Get trend color
  const getTrendColor = (value: number) => {
    if (value > 5) return "text-green-600";
    if (value < -5) return "text-red-600";
    return "text-gray-600";
  };

  const getTrendIcon = (value: number) => {
    if (value > 5) return <ArrowTrendingUpIcon className="h-4 w-4" />;
    if (value < -5) return <ArrowTrendingDownIcon className="h-4 w-4" />;
    return <ChartBarIcon className="h-4 w-4" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Comparative Period Analysis
        </h3>
        <div className="flex items-center gap-3">
          <select
            value={periods}
            onChange={(e) => setPeriods(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={6}>6 Periods</option>
            <option value={12}>12 Periods</option>
            <option value={24}>24 Periods</option>
          </select>
          <select
            value={comparisonType}
            onChange={(e) => setComparisonType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="YEAR_OVER_YEAR">Year over Year</option>
            <option value="MONTH_OVER_MONTH">Month over Month</option>
            <option value="QUARTER_OVER_QUARTER">Quarter over Quarter</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-blue-800">
                Avg Income Growth
              </span>
              <p className="text-xl font-bold text-blue-900 mt-1">
                {formatPercentage(analysisData.averageIncomeGrowthRate)}
              </p>
            </div>
            <div
              className={`${getTrendColor(analysisData.averageIncomeGrowthRate)}`}
            >
              {getTrendIcon(analysisData.averageIncomeGrowthRate)}
            </div>
          </div>
        </div>

        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-orange-800">
                Avg Expense Growth
              </span>
              <p className="text-xl font-bold text-orange-900 mt-1">
                {formatPercentage(analysisData.averageExpenseGrowthRate)}
              </p>
            </div>
            <div
              className={`${getTrendColor(analysisData.averageExpenseGrowthRate)}`}
            >
              {getTrendIcon(analysisData.averageExpenseGrowthRate)}
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-purple-800">
                Avg Net Growth
              </span>
              <p className="text-xl font-bold text-purple-900 mt-1">
                {formatPercentage(analysisData.averageNetGrowthRate)}
              </p>
            </div>
            <div
              className={`${getTrendColor(analysisData.averageNetGrowthRate)}`}
            >
              {getTrendIcon(analysisData.averageNetGrowthRate)}
            </div>
          </div>
        </div>
      </div>

      {/* Trend Indicator */}
      {analysisData.trend && (
        <div
          className={`mb-6 p-4 rounded-lg border ${
            analysisData.trend === "IMPROVING"
              ? "bg-green-50 border-green-200"
              : analysisData.trend === "DECLINING"
                ? "bg-red-50 border-red-200"
                : "bg-gray-50 border-gray-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <InformationCircleIcon
              className={`h-5 w-5 mt-0.5 ${
                analysisData.trend === "IMPROVING"
                  ? "text-green-600"
                  : analysisData.trend === "DECLINING"
                    ? "text-red-600"
                    : "text-gray-600"
              }`}
            />
            <div>
              <h4
                className={`font-medium ${
                  analysisData.trend === "IMPROVING"
                    ? "text-green-800"
                    : analysisData.trend === "DECLINING"
                      ? "text-red-800"
                      : "text-gray-800"
                }`}
              >
                Financial Trend: {analysisData.trend}
              </h4>
              {analysisData.insights && (
                <p
                  className={`text-sm mt-1 ${
                    analysisData.trend === "IMPROVING"
                      ? "text-green-700"
                      : analysisData.trend === "DECLINING"
                        ? "text-red-700"
                        : "text-gray-700"
                  }`}
                >
                  {analysisData.insights}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {isClient && (
        <div className="space-y-6">
          {/* Growth Rate Comparison Chart */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Growth Rate Comparison
            </h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={analysisData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name.includes("Growth")) {
                        return [formatPercentage(value), name];
                      }
                      return [formatCurrency(value), name];
                    }}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="incomeGrowthRate"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Income Growth %"
                  />
                  <Line
                    type="monotone"
                    dataKey="expenseGrowthRate"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Expense Growth %"
                  />
                  <Line
                    type="monotone"
                    dataKey="netGrowthRate"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    name="Net Growth %"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Period Comparison Chart */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Period-over-Period Comparison
            </h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysisData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), ""]}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="currentIncome"
                    fill="#10b981"
                    name="Current Income"
                  />
                  <Bar
                    dataKey="previousIncome"
                    fill="#86efac"
                    name="Previous Income"
                  />
                  <Bar
                    dataKey="currentExpenses"
                    fill="#ef4444"
                    name="Current Expenses"
                  />
                  <Bar
                    dataKey="previousExpenses"
                    fill="#fca5a5"
                    name="Previous Expenses"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Fallback for SSR */}
      {!isClient && (
        <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-2">📊 Loading charts...</div>
            <p className="text-gray-500 text-sm">
              Charts will appear once the page loads.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComparativePeriodAnalysis;
