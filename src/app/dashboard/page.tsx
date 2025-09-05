"use client";

import React from "react";
import { LazyDashboard } from "@/components/performance/LazyDashboard";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { useQuery } from "@apollo/client";
import { GET_SUPER_ADMIN_DASHBOARD } from "@/graphql/queries/dashboardQueries";

export default function DashboardPage() {
  const { organisationId } = useOrganisationBranch();
  const { data, loading, error } = useQuery(GET_SUPER_ADMIN_DASHBOARD, {
    variables: { organisationId },
    // Optimize query performance
    fetchPolicy: "cache-first",
    errorPolicy: "all",
    notifyOnNetworkStatusChange: false, // Reduce re-renders
  });
  const dashboard = data?.superAdminDashboardData;

  // Show loading state immediately
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex">
        <main className="flex-1 flex flex-col p-4 lg:p-10 max-w-full">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-3">
            <div>
              <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </header>

          {/* Dashboard skeleton */}
          <div className="space-y-6">
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
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex">
        <main className="flex-1 flex flex-col p-4 lg:p-10 max-w-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-red-800 font-semibold mb-2">
              Dashboard Loading Error
            </h2>
            <p className="text-red-600 mb-4">{error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex">
      <main className="flex-1 flex flex-col p-4 lg:p-10 max-w-full">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-1 drop-shadow-sm">
              Welcome back,{" "}
              {dashboard?.organisationOverview.organisations?.[0]?.name ||
                "Chapel Stack"}
            </h1>
            <p className="text-gray-500 text-base">
              Here's an overview of church operations across all branches.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full bg-white border shadow hover:bg-blue-100 transition">
              <svg width="22" height="22" fill="none" viewBox="0 0 22 22">
                <path
                  d="M11 3a5 5 0 0 1 5 5v2.5c0 .7.3 1.4.8 1.9l.2.2c.6.6.9 1.5.7 2.3-.3 1-1.2 1.6-2.2 1.6H6.5c-1 0-1.9-.6-2.2-1.6-.2-.8.1-1.7.7-2.3l.2-.2c.5-.5.8-1.2.8-1.9V8a5 5 0 0 1 5-5Z"
                  stroke="#2563eb"
                  strokeWidth="1.5"
                />
                <circle cx="11" cy="18" r="1.5" fill="#eab308" />
              </svg>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 border-2 border-white rounded-full animate-pulse" />
            </button>
          </div>
        </header>

        {/* Use optimized lazy dashboard */}
        <LazyDashboard dashboard={dashboard} />
      </main>
    </div>
  );
}
