"use client";
import { gql, useQuery } from "@apollo/client";
import { RoleRoute } from "@/components/auth/RoleRoute";
import { BranchOverviewWidgets } from "@/components/dashboard/BranchOverviewWidgets";
import { BranchAnalyticsTrends } from "@/components/dashboard/BranchAnalyticsTrends";
import { BranchActivityFeed } from "@/components/dashboard/BranchActivityFeed";
import { FinancialBreakdown } from "@/components/dashboard/FinancialBreakdown";
import { UpcomingEvents } from "@/components/dashboard/UpcomingEvents";
import { BranchAnnouncements } from "@/components/dashboard/BranchAnnouncements";
import { BranchAdminTools } from "@/components/dashboard/BranchAdminTools";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import BranchFinanceStats from "@/components/BranchFinanceStats";
import {
  ChartBarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const BRANCH_DASHBOARD_QUERY = gql`
  query BranchDashboard($branchId: ID!) {
    branchDashboard(branchId: $branchId) {
      branchInfo {
        id
        name
        organisation
        isActive
        admins {
          id
          name
        }
      }
      memberStats {
        total
        newMembersThisMonth
        growthRate
        monthlyTrends {
          month
          year
          totalMembers
          newMembers
        }
      }
      financeStats {
        totalContributions
        totalExpenses
        tithes
        pledge
        offering
        donation
        specialContribution
        growthRate
        netIncome
        monthlyTrends {
          month
          year
          contributions
          expenses
          netIncome
        }
      }
      attendanceStats {
        totalAttendance
        uniqueAttendeesThisMonth
        averageAttendance
        growthRate
        monthlyTrends {
          month
          year
          totalAttendance
          uniqueAttendees
        }
      }
      sacramentStats {
        totalSacraments
        breakdown {
          type
          count
        }
        monthlyTrends {
          month
          count
        }
      }
      activityStats {
        recentEvents {
          id
          title
          startDate
        }
        upcomingEvents {
          id
          title
          startDate
        }
        recentMembers {
          id
          name
          joinedAt
        }
        recentContributions {
          id
          amount
          date
          type
        }
        recentSacraments {
          id
          type
          date
          memberName
        }
        activitySummary {
          newMembersCount
          contributionsCount
          sacramentsCount
          attendanceRecordsCount
          totalActivities
        }
      }
      systemStatus {
        timestamp
        database {
          status
          latency
        }
        system {
          totalMemory
          freeMemory
          memoryUsage {
            rss
            heapTotal
            heapUsed
            external
          }
          cpuUsage {
            user
            system
          }
          systemUptime
          processUptime
          platform
          nodeVersion
        }
      }
      branchAnnouncements {
        announcements {
          id
          title
          startDate
        }
      }
    }
  }
`;

export default function ModernBranchDashboardPage() {
  const { state } = useAuth();
  const user = state.user;
  const { organisationId, branchId } = useOrganisationBranch();
  const userName = user?.firstName || user?.lastName;

  const { data, loading, error } = useQuery(BRANCH_DASHBOARD_QUERY, {
    variables: { branchId },
    skip: !branchId,
  });

  // Fetch funds for this branch for the finance stats component
  const {
    data: fundsData,
    loading: fundsLoading,
    error: fundsError,
  } = useQuery(
    gql`
      query GetFunds($organisationId: String!, $branchId: String) {
        funds(organisationId: $organisationId, branchId: $branchId) {
          id
          name
          description
          branchId
        }
      }
    `,
    {
      variables: { organisationId, branchId },
      skip: !organisationId || !branchId,
    },
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠</span>
          </div>
          <p className="text-lg text-red-600">Error loading dashboard</p>
          <p className="text-sm text-gray-500 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  const branchDashboard = data?.branchDashboard;
  if (!branchDashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ChartBarIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-lg text-gray-600">
            No data available for this branch
          </p>
        </div>
      </div>
    );
  }

  return (
    <RoleRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Modern Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <ChartBarIcon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {branchDashboard.branchInfo.name}
                  </h1>
                  <p className="text-sm text-gray-500 flex items-center">
                    <SparklesIcon className="w-4 h-4 mr-1" />
                    Welcome back, {userName} •{" "}
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <BellIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                  <Cog6ToothIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Quick Stats Overview */}
          <section>
            <BranchOverviewWidgets
              branchName={branchDashboard.branchInfo.name}
              memberStats={branchDashboard.memberStats}
              attendanceStats={branchDashboard.attendanceStats}
              financeStats={branchDashboard.financeStats}
              sacramentStats={branchDashboard.sacramentStats}
              activityStats={branchDashboard.activityStats}
            />
          </section>

          {/* Analytics and Trends Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <ArrowTrendingUpIcon className="w-6 h-6 mr-3 text-green-600" />
                Analytics & Trends
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center px-3 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200">
                <EyeIcon className="w-4 h-4 mr-1" />
                View Details
              </button>
            </div>
            <BranchAnalyticsTrends
              memberTrends={branchDashboard.memberStats.monthlyTrends}
              financeTrends={branchDashboard.financeStats.monthlyTrends}
              attendanceTrends={branchDashboard.attendanceStats.monthlyTrends}
              sacramentBreakdown={branchDashboard.sacramentStats.breakdown}
              sacramentTrends={branchDashboard.sacramentStats.monthlyTrends}
            />
          </section>

          {/* Two Column Layout for Activity and Financial Data */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <ClockIcon className="w-6 h-6 mr-3 text-blue-600" />
                  Recent Activity
                </h2>
              </div>
              <BranchActivityFeed
                recentMembers={
                  branchDashboard.activityStats.recentMembers || []
                }
                recentContributions={
                  branchDashboard.activityStats.recentContributions || []
                }
                recentSacraments={
                  branchDashboard.activityStats.recentSacraments || []
                }
                activitySummary={branchDashboard.activityStats.activitySummary}
              />
            </div>

            {/* Financial Overview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <CurrencyDollarIcon className="w-6 h-6 mr-3 text-green-600" />
                  Financial Overview
                </h2>
              </div>
              <div className="space-y-6">
                <BranchFinanceStats
                  organisationId={organisationId}
                  branchId={branchId}
                  funds={fundsData?.funds || []}
                />
                <FinancialBreakdown
                  financeStats={branchDashboard.financeStats}
                />
              </div>
            </div>
          </section>

          {/* Bottom Section - Events, Announcements, and Admin Tools */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Events */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <CalendarDaysIcon className="w-5 h-5 mr-2 text-purple-600" />
                  Upcoming Events
                </h2>
              </div>
              <UpcomingEvents
                events={branchDashboard.activityStats.upcomingEvents}
              />
            </div>

            {/* Announcements */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <BellIcon className="w-5 h-5 mr-2 text-yellow-600" />
                  Announcements
                </h2>
              </div>
              <BranchAnnouncements
                branchAnnouncements={branchDashboard.branchAnnouncements}
              />
            </div>

            {/* Admin Tools */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                  <Cog6ToothIcon className="w-5 h-5 mr-2 text-gray-600" />
                  Admin Tools
                </h2>
              </div>
              <BranchAdminTools branchInfo={branchDashboard.branchInfo} />
            </div>
          </section>
        </main>
      </div>
    </RoleRoute>
  );
}
