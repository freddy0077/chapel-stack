/**
 * Lazy Dashboard Component
 * Optimizes dashboard loading with progressive enhancement
 */

"use client";

import React, { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";

// Lazy load heavy dashboard components
const OverviewWidgets = lazy(() =>
  import("@/components/dashboard/OverviewWidgets").then((m) => ({
    default: m.OverviewWidgets,
  })),
);
const FinancesSummary = lazy(() =>
  import("@/components/dashboard/FinancesSummary").then((m) => ({
    default: m.FinancesSummary,
  })),
);
const UpcomingEvents = lazy(() =>
  import("@/components/dashboard/UpcomingEvents").then((m) => ({
    default: m.UpcomingEvents,
  })),
);
const AdminTools = lazy(() =>
  import("@/components/dashboard/AdminTools").then((m) => ({
    default: m.AdminTools,
  })),
);

// Lightweight loading skeleton
const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Overview widgets skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
        >
          <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>

    {/* Finances summary skeleton */}
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>

    {/* Events skeleton */}
    <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <h2 className="text-red-800 font-semibold mb-2">Dashboard Loading Error</h2>
    <p className="text-red-600 text-sm mb-3">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition"
    >
      Retry
    </button>
  </div>
);

interface LazyDashboardProps {
  dashboard: any;
}

export function LazyDashboard({ dashboard }: LazyDashboardProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="space-y-8">
        {/* Overview Widgets - Load first */}
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg p-6 animate-pulse"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          }
        >
          <OverviewWidgets
            branches={dashboard?.branchesSummary?.total}
            members={dashboard?.memberSummary?.total}
            attendance={dashboard?.attendanceOverview?.totalAttendance}
            newMembers={dashboard?.memberSummary?.newMembersThisMonth}
          />
        </Suspense>

        {/* Finances Summary - Load second */}
        <Suspense
          fallback={
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          }
        >
          <FinancesSummary
            totalContributions={
              dashboard?.financialOverview?.totalContributions
            }
            topBranches={
              dashboard?.financialOverview?.topGivingBranches?.map((b) => ({
                branchId: b?.branchId,
                branchName: b?.branchName,
                amount: b?.totalGiven,
              })) ?? []
            }
            expensesVsIncome={
              dashboard?.financialOverview
                ? {
                    labels:
                      dashboard.financialOverview.expensesVsIncome?.map(
                        (e) => e.label,
                      ) ?? [],
                    income:
                      dashboard.financialOverview.expensesVsIncome?.map(
                        (e) => e.income,
                      ) ?? [],
                    expenses:
                      dashboard.financialOverview.expensesVsIncome?.map(
                        (e) => e.expenses,
                      ) ?? [],
                  }
                : undefined
            }
            pendingApprovals={dashboard?.financialOverview?.pendingApprovals}
          />
        </Suspense>

        {/* Upcoming Events - Load third */}
        <Suspense
          fallback={
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          }
        >
          <UpcomingEvents
            events={dashboard?.activityEngagement?.upcomingEvents}
          />
        </Suspense>

        {/* Admin Tools - Load last */}
        <Suspense
          fallback={
            <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          }
        >
          <AdminTools />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
}
