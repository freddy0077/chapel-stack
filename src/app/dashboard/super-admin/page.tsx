"use client";

import React from "react";
import { RoleRoute } from "@/components/auth/RoleRoute";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { OverviewWidgets } from "@/components/dashboard/OverviewWidgets";
import { FinancesSummary } from "@/components/dashboard/FinancesSummary";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { BranchPerformance } from "@/components/dashboard/BranchPerformance";
import { AdminTools } from "@/components/dashboard/AdminTools";
import { SuperAdminSubscriptionManagement } from "@/components/dashboard/SuperAdminSubscriptionManagement";
import { useOrganizationBranchFilter } from "@/graphql/hooks/useOrganizationBranchFilter";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useQuery } from "@apollo/client";
import { GET_SUPER_ADMIN_DASHBOARD } from "@/graphql/queries/dashboardQueries";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";

export default function SuperAdminDashboard() {
  const { organisationId } = useOrganisationBranch();
  const { state } = useAuth();
  const user = state.user;

  // Debug authentication state

  const { data, loading, error } = useQuery(GET_SUPER_ADMIN_DASHBOARD, {
    variables: { organisationId },
  });
  const dashboard = data?.superAdminDashboardData;

  return (
    <RoleRoute requiredRole="SUPER_ADMIN">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex">
        {/* Main content */}
        <main className="flex-1 flex flex-col p-4 lg:p-10 max-w-full">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-3">
            <div>
              <h1 className="text-3xl font-extrabold text-blue-900 mb-1 drop-shadow-sm">
                Super Admin Dashboard -{" "}
                {dashboard?.organisationOverview.organisations?.[0]?.name}
              </h1>
              <p className="text-blue-700 text-lg">
                Manage all organizations and system settings
              </p>
            </div>
          </header>

          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="h-12 w-12 rounded-full border-4 border-t-indigo-600 border-indigo-200 animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading dashboard...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">
                Error loading dashboard: {error.message}
              </p>
            </div>
          )}

          {dashboard && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left column - Main widgets */}
              <div className="xl:col-span-2 space-y-8">
                <OverviewWidgets dashboard={dashboard} />
                <FinancesSummary dashboard={dashboard} />
                <BranchPerformance dashboard={dashboard} />
              </div>

              {/* Right column - Secondary widgets */}
              <div className="space-y-8">
                <SuperAdminSubscriptionManagement
                  organizationId={user?.organisationId || organisationId}
                />
                <UpcomingEvents dashboard={dashboard} />
                <AdminTools />
              </div>
            </div>
          )}
        </main>
      </div>
    </RoleRoute>
  );
}
