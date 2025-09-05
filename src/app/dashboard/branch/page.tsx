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
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  SunIcon,
  MoonIcon,
  ChevronRightIcon,
  PlusIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

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

// Modern Loading Component
const ModernLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto mb-6"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-blue-400 mx-auto"></div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Loading Dashboard
      </h3>
      <p className="text-gray-500">Preparing your branch insights...</p>
    </div>
  </div>
);

// Modern Error Component
const ModernError = ({ error }: { error: any }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-8">
      <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <span className="text-white text-3xl">⚠</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        Oops! Something went wrong
      </h3>
      <p className="text-gray-600 mb-6">
        We're having trouble loading your dashboard. Please try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        <ArrowPathIcon className="w-5 h-5 inline mr-2" />
        Retry
      </button>
      <p className="text-xs text-gray-400 mt-4">{error.message}</p>
    </div>
  </div>
);

// Modern No Data Component
const ModernNoData = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-zinc-50 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-8">
      <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-slate-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <ChartBarIcon className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">
        No Data Available
      </h3>
      <p className="text-gray-600 mb-6">
        We couldn't find any data for this branch. Please check your permissions
        or contact support.
      </p>
      <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
        Contact Support
      </button>
    </div>
  </div>
);

// Quick Action Button Component
const QuickActionButton = ({
  icon: Icon,
  label,
  onClick,
  href,
  color = "blue",
}: any) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    green:
      "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    purple:
      "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    orange:
      "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
  };

  const buttonClasses = `bg-gradient-to-r ${colorClasses[color]} text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2`;

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={buttonClasses}>
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </button>
  );
};

export default function UltraModernBranchDashboard() {
  const { state } = useAuth();
  const user = state.user;
  const { organisationId, branchId } = useOrganisationBranch();
  const userName = user?.firstName || user?.lastName;
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const { data, loading, error } = useQuery(BRANCH_DASHBOARD_QUERY, {
    variables: { branchId },
    skip: !branchId,
  });

  // Fetch funds for this branch
  const { data: fundsData } = useQuery(
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

  if (loading) return <ModernLoader />;
  if (error) return <ModernError error={error} />;

  const branchDashboard = data?.branchDashboard;
  if (!branchDashboard) return <ModernNoData />;

  const timeOfDay = currentTime.getHours();
  const greeting =
    timeOfDay < 12
      ? "Good morning"
      : timeOfDay < 18
        ? "Good afternoon"
        : "Good evening";
  const timeIcon = timeOfDay < 18 ? SunIcon : MoonIcon;

  return (
    <RoleRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Ultra Modern Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-lg shadow-blue-500/5">
          <div className="px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              {/* Brand & Welcome Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/25 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                    <ChartBarIcon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>

                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      {branchDashboard.branchInfo.name}
                    </h1>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <timeIcon className="w-4 h-4" />
                    <span>
                      {greeting}, {userName}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span>
                      {currentTime.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Center */}
              <div className="flex items-center space-x-4">
                {/* Quick Actions */}
                <div className="hidden lg:flex items-center space-x-3">
                  <QuickActionButton
                    icon={PlusIcon}
                    label="Add Member"
                    href="/dashboard/members"
                    color="blue"
                  />
                  <QuickActionButton
                    icon={CurrencyDollarIcon}
                    label="Record Offering"
                    href="/dashboard/finances/"
                    color="green"
                  />
                  <QuickActionButton
                    icon={CalendarDaysIcon}
                    label="New Event"
                    href="/dashboard/calendar/new"
                    color="purple"
                  />
                </div>

                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 w-64"
                  />
                </div>

                {/* Notifications & Settings */}
                <div className="flex items-center space-x-2">
                  <button className="relative p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200 group">
                    <BellIcon className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      3 new notifications
                    </span>
                  </button>

                  <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <Cog6ToothIcon className="w-5 h-5" />
                  </button>

                  <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200">
                    <EllipsisHorizontalIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="px-6 lg:px-8 py-8">
          {/* Quick Stats with Enhanced Design */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Dashboard Overview
              </h2>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-all duration-200">
                  <FunnelIcon className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200">
                  <ArrowPathIcon className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className="transform transition-all duration-500 hover:scale-[1.01]">
              <BranchOverviewWidgets
                branchName={branchDashboard.branchInfo.name}
                memberStats={branchDashboard.memberStats}
                attendanceStats={branchDashboard.attendanceStats}
                financeStats={branchDashboard.financeStats}
                sacramentStats={branchDashboard.sacramentStats}
                activityStats={branchDashboard.activityStats}
              />
            </div>
          </section>

          {/* Analytics Section with Modern Cards */}
          <section className="mb-10">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl shadow-blue-500/5 border border-white/20">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Analytics & Insights
                    </h2>
                    <p className="text-gray-500">
                      Track your branch performance and growth
                    </p>
                  </div>
                </div>

                <button className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                  <EyeIcon className="w-5 h-5" />
                  <span>View Detailed Report</span>
                  <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              </div>

              <BranchAnalyticsTrends
                memberTrends={branchDashboard.memberStats.monthlyTrends}
                financeTrends={branchDashboard.financeStats.monthlyTrends}
                attendanceTrends={branchDashboard.attendanceStats.monthlyTrends}
                sacramentBreakdown={branchDashboard.sacramentStats.breakdown}
                sacramentTrends={branchDashboard.sacramentStats.monthlyTrends}
              />
            </div>
          </section>

          {/* Enhanced Two-Column Layout */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
            {/* Recent Activity Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl shadow-blue-500/5 border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <ClockIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Recent Activity
                  </h3>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  Live
                </span>
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

            {/* Financial Overview Card */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl shadow-green-500/5 border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <CurrencyDollarIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Financial Overview
                  </h3>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Updated
                </span>
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

          {/* Bottom Section with Enhanced Cards */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upcoming Events */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-purple-500/5 border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg flex items-center justify-center">
                  <CalendarDaysIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Upcoming Events
                </h3>
              </div>
              <UpcomingEvents
                events={branchDashboard.activityStats.upcomingEvents}
              />
            </div>

            {/* Announcements */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-yellow-500/5 border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <BellIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Announcements
                </h3>
              </div>
              <BranchAnnouncements
                branchAnnouncements={branchDashboard.branchAnnouncements}
              />
            </div>

            {/* Admin Tools */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl shadow-gray-500/5 border border-white/20 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg flex items-center justify-center">
                  <Cog6ToothIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Admin Tools</h3>
              </div>
              <BranchAdminTools branchInfo={branchDashboard.branchInfo} />
            </div>
          </section>
        </main>
      </div>
    </RoleRoute>
  );
}
