"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "@apollo/client";
import {
  CalendarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import {
  CASH_FLOW_ANALYSIS,
  CashFlowAnalysisInput,
  CashFlowAnalysisResult,
} from "../../graphql/queries/analytics";
import { useOrganizationBranchFilter } from "@/hooks";

// Dynamically import Recharts components to prevent SSR issues
const ResponsiveContainer = dynamic(
  () => import("recharts").then((mod) => mod.ResponsiveContainer),
  { ssr: false },
);

const AreaChart = dynamic(
  () => import("recharts").then((mod) => mod.AreaChart),
  { ssr: false },
);

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

const Area = dynamic(() => import("recharts").then((mod) => mod.Area), {
  ssr: false,
});

const Line = dynamic(() => import("recharts").then((mod) => mod.Line), {
  ssr: false,
});

const Bar = dynamic(() => import("recharts").then((mod) => mod.Bar), {
  ssr: false,
});

interface CashFlowAnalysisProps {
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  fundId?: string;
}

const CashFlowAnalysis: React.FC<CashFlowAnalysisProps> = ({
  dateRange,
  fundId,
}) => {
  const [periodType, setPeriodType] = useState<
    "MONTHLY" | "QUARTERLY" | "YEARLY"
  >("MONTHLY");
  const [isClient, setIsClient] = useState(false);

  // Get organisationId and branchId using the same pattern as branch-finances page
  const { state } = useAuth();
  const user = state.user;
  const { organisationId, branchId: defaultBranchId } =
    useOrganizationBranchFilter();
  console.log("CashFlowAnalysis OrganisationId", organisationId);

  // Use the same super admin logic as the branch-finances page
  const isSuperAdmin = user?.roles?.some((role) => role.name === "SUPER_ADMIN");
  const effectiveBranchId = isSuperAdmin ? undefined : defaultBranchId; // For super admin, don't restrict by branch

  // Memoize the effective date range to prevent infinite loops
  const effectiveDateRange = useMemo(() => {
    if (dateRange) {
      return {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };
    }
    // Default date range if not provided
    return {
      startDate: new Date(new Date().getFullYear(), 0, 1), // Start of current year
      endDate: new Date(), // Today
    };
  }, [dateRange]);

  // Memoize GraphQL input to prevent unnecessary re-renders - only when we have valid data
  const cashFlowInput: CashFlowAnalysisInput | null = useMemo(() => {
    if (!organisationId) {
      return null;
    }
    const input = {
      organisationId,
      branchId: effectiveBranchId,
      dateRange: effectiveDateRange,
      periodType,
      fundId,
    };
    console.log(
      "CashFlowAnalysis - GraphQL Input:",
      JSON.stringify(input, null, 2),
    );
    return input;
  }, [
    organisationId,
    effectiveBranchId,
    effectiveDateRange,
    periodType,
    fundId,
  ]);

  // GraphQL query for cash flow analysis
  const { data, loading, error } = useQuery<{
    cashFlowAnalysis: CashFlowAnalysisResult;
  }>(CASH_FLOW_ANALYSIS, {
    variables: { input: cashFlowInput },
    skip: !organisationId || !cashFlowInput, // Skip if organisationId is undefined or input is null
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Debug logging
  console.log("CashFlowAnalysis Debug:", {
    organisationId,
    branchId: effectiveBranchId,
    dateRange,
    fundId,
    hasOrganisationId: !!organisationId,
    inputValid: !!cashFlowInput,
    querySkipped: !organisationId || !cashFlowInput,
  });

  // Show loading state when organizationId is not available
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
            Cash Flow Analysis
          </h3>
          <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
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
    console.error("Cash Flow Analysis Error:", error);
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Cash Flow Analysis
          </h3>
          <select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            ⚠️ Error loading cash flow data
          </div>
          <p className="text-gray-500 text-sm">
            {error.message ||
              "Unable to load cash flow analysis. Please try again."}
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

  const cashFlowData = data?.cashFlowAnalysis;

  if (!cashFlowData || !cashFlowData.data.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Cash Flow Analysis
          </h3>
          <select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
          </select>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            📊 No cash flow data available
          </div>
          <p className="text-gray-500 text-sm">
            No financial data found for the selected period and filters.
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

  // Calculate trend indicators
  const netFlowTrend = cashFlowData.totalNetFlow >= 0 ? "positive" : "negative";
  const avgMonthlyNet =
    cashFlowData.averageMonthlyIncome - cashFlowData.averageMonthlyExpenses;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Cash Flow Analysis
        </h3>
        <select
          value={periodType}
          onChange={(e) => setPeriodType(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="MONTHLY">Monthly</option>
          <option value="QUARTERLY">Quarterly</option>
          <option value="YEARLY">Yearly</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-800">
              Total Income
            </span>
          </div>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {formatCurrency(cashFlowData.totalIncome)}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Avg: {formatCurrency(cashFlowData.averageMonthlyIncome)}/month
          </p>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center">
            <ArrowTrendingDownIcon className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-sm font-medium text-red-800">
              Total Expenses
            </span>
          </div>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {formatCurrency(cashFlowData.totalExpenses)}
          </p>
          <p className="text-xs text-red-600 mt-1">
            Avg: {formatCurrency(cashFlowData.averageMonthlyExpenses)}/month
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            netFlowTrend === "positive"
              ? "bg-blue-50 border-blue-200"
              : "bg-orange-50 border-orange-200"
          }`}
        >
          <div className="flex items-center">
            <CurrencyDollarIcon
              className={`h-5 w-5 mr-2 ${
                netFlowTrend === "positive"
                  ? "text-blue-600"
                  : "text-orange-600"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                netFlowTrend === "positive"
                  ? "text-blue-800"
                  : "text-orange-800"
              }`}
            >
              Net Cash Flow
            </span>
          </div>
          <p
            className={`text-2xl font-bold mt-1 ${
              netFlowTrend === "positive" ? "text-blue-900" : "text-orange-900"
            }`}
          >
            {formatCurrency(cashFlowData.totalNetFlow)}
          </p>
          <p
            className={`text-xs mt-1 ${
              netFlowTrend === "positive" ? "text-blue-600" : "text-orange-600"
            }`}
          >
            Avg: {formatCurrency(avgMonthlyNet)}/month
          </p>
        </div>
      </div>

      {/* Charts */}
      {isClient && (
        <div className="space-y-6">
          {/* Cash Flow Chart */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Cash Flow Over Time
            </h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={cashFlowData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), ""]}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="income" fill="#10b981" name="Income" />
                  <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                  <Line
                    type="monotone"
                    dataKey="netFlow"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    name="Net Flow"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Cumulative Flow Chart */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-3">
              Cumulative Cash Flow
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={cashFlowData.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), ""]}
                    labelFormatter={(label) => `Period: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="cumulativeFlow"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                    name="Cumulative Flow"
                  />
                </AreaChart>
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

export default CashFlowAnalysis;
