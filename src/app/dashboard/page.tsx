"use client";

import { ArrowTrendingUpIcon, UserGroupIcon, InboxArrowDownIcon, DocumentTextIcon, EnvelopeIcon, ChatBubbleLeftRightIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useDashboardData } from "../../graphql/hooks/useDashboardData";
import { useAuth } from "../../graphql/hooks/useAuth";
import ChartContainer from "./components/ChartContainer";
import { useEffect } from "react";

export default function DashboardPage() {
  // Get current user and branchId
  const { user } = useAuth();
  const branchId = user?.userBranches?.[0]?.branch?.id;
  const role = user?.roles?.[0]?.name;
  // Use dashboardType 'ADMIN' for admin dashboard
  const dashboardType = role;
  
  const { data, loading, error } = useDashboardData(branchId, dashboardType);
  const dashboardData = data?.dashboardData;

  // Type for KPI cards
  interface KpiCard {
    title: string;
    value: string;
    icon?: string;
    widgetType?: string;
  }

  // Type for Chart data (copied from ChartContainer usage)
  interface ChartData {
    title: string;
    chartType: string;
    data: any;
    config?: Record<string, any>;
    description?: string;
  }

  // Enhanced utility to transform backend chart data to Chart.js format
  function transformChartData(chart: ChartData): ChartData {
    if (!chart || !Array.isArray(chart.data)) return chart;
    const type = chart.chartType.toLowerCase();
    const dataArr = chart.data;

    // PIE/DONUT
    if (type === 'pie' || type === 'donut' || type === 'doughnut') {
      if (dataArr.length === 0) {
        return {
          ...chart,
          data: { labels: [], datasets: [{ data: [] }] },
        };
      }
      return {
        ...chart,
        data: {
          labels: dataArr.map((item: any) => item.status || item.name || item.label || ''),
          datasets: [
            {
              data: dataArr.map((item: any) => item.count || item.value || 0),
              backgroundColor: [
                '#6366F1', '#F59E42', '#10B981', '#F472B6', '#60A5FA', '#FBBF24', '#34D399', '#F87171', '#A78BFA', '#FCD34D'
              ],
            },
          ],
        },
      };
    }

    // BAR/COLUMN (single or multi-dataset)
    if (type === 'bar' || type === 'column') {
      if (dataArr.length === 0) {
        return {
          ...chart,
          data: { labels: [], datasets: [] },
        };
      }
      const labelField = 'name';
      // Find all numeric keys except for the label field
      const numericKeys = Object.keys(dataArr[0] || {}).filter(
        k => k !== labelField && typeof dataArr[0][k] === 'number'
      );
      // If only one numeric key (e.g., count), use single dataset
      if (numericKeys.length === 1) {
        const key = numericKeys[0];
        return {
          ...chart,
          data: {
            labels: dataArr.map((item: any) => item[labelField] || item.label || ''),
            datasets: [
              {
                label: chart.title,
                data: dataArr.map((item: any) => item[key] || 0),
                backgroundColor: '#6366F1',
              },
            ],
          },
        };
      } else if (numericKeys.length > 1) {
        // Multi-dataset (e.g., budgeted vs actual)
        return {
          ...chart,
          data: {
            labels: dataArr.map((item: any) => item[labelField] || item.label || ''),
            datasets: numericKeys.map((key, i) => ({
              label: key.charAt(0).toUpperCase() + key.slice(1),
              data: dataArr.map((item: any) => item[key] || 0),
              backgroundColor: i === 0 ? '#6366F1' : '#F59E42',
            })),
          },
        };
      }
    }

    // LINE
    if (type === 'line') {
      if (dataArr.length === 0) {
        return {
          ...chart,
          data: { labels: [], datasets: [] },
        };
      }
      // Try to find label and value keys
      const labelField = 'name';
      const valueField = 'value';
      // If all items have valueField, use as single dataset
      if (dataArr.every((item: any) => valueField in item)) {
        return {
          ...chart,
          data: {
            labels: dataArr.map((item: any) => item[labelField] || item.label || ''),
            datasets: [
              {
                label: chart.title,
                data: dataArr.map((item: any) => item[valueField] || 0),
                fill: false,
                borderColor: '#6366F1',
                backgroundColor: '#6366F1',
              },
            ],
          },
        };
      }
      // If multi-dataset, similar logic as bar
      const numericKeys = Object.keys(dataArr[0] || {}).filter(
        k => k !== labelField && typeof dataArr[0][k] === 'number'
      );
      if (numericKeys.length > 0) {
        return {
          ...chart,
          data: {
            labels: dataArr.map((item: any) => item[labelField] || item.label || ''),
            datasets: numericKeys.map((key, i) => ({
              label: key.charAt(0).toUpperCase() + key.slice(1),
              data: dataArr.map((item: any) => item[key] || 0),
              fill: false,
              borderColor: i === 0 ? '#6366F1' : '#F59E42',
              backgroundColor: i === 0 ? '#6366F1' : '#F59E42',
            })),
          },
        };
      }
    }

    // For other chart types, return as is
    return chart;
  }

  // Helper to extract stats from kpiCards by title
  function getStat(title: string): string {
    return (
      (dashboardData?.kpiCards?.find((card: KpiCard) => card.title === title)?.value as string) ?? '--'
    );
  }

  // Map stats for UI based on available API titles
  const stats = {
    totalMembers: getStat('Total Members'),
    totalBranches: getStat('Total Branches'),
    newMembers: getStat('New Members'),
    formSubmissions: getStat('Form Submissions'),
    totalSermons: getStat('Total Sermons'),
    totalMediaItems: getStat('Total Media Items'),
    emailsSent30d: getStat('Emails Sent (30d)'),
    smsSent30d: getStat('SMS Sent (30d)'),
    // No recentMembers or onboarding steps present in API response
  };

  console.log("User", user)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100/80 to-white px-2 md:px-8 py-8">
      {/* Modern Header */}
      <header className="relative mb-12">
        <div className="rounded-3xl bg-indigo-600/90 shadow-xl p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-4 overflow-hidden">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 drop-shadow">Welcome back, {user?.firstName}!</h1>
            <p className="text-indigo-100 text-lg md:text-xl font-medium flex items-center gap-2">
              <span>Here’s what’s happening at</span>
              <span className="inline-block px-3 py-1 bg-white/20 rounded-lg font-semibold text-white ml-1">
                {user?.userBranches?.[0]?.branch?.name ?? 'your branch'}
              </span>
              <span className="ml-2 text-xs bg-white/10 px-2 py-1 rounded-full text-white/80">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</span>
            </p>
          </div>
          <div className="hidden md:flex gap-3">
            <button className="bg-white/90 text-indigo-700 px-5 py-2 rounded-lg font-semibold shadow hover:bg-indigo-100 transition">Add Member</button>
            <button className="bg-indigo-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-indigo-800 transition">New Event</button>
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      {!loading && dashboardData?.kpiCards && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {dashboardData.kpiCards.map((card: KpiCard, idx: number) => (
            <div
              key={card.title + idx}
              className="bg-white rounded-2xl shadow-lg p-7 flex items-center gap-5 hover:shadow-xl transition min-h-[110px] border border-indigo-50 group"
            >
              <UserGroupIcon className="w-10 h-10 text-indigo-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-3xl font-extrabold text-indigo-900 group-hover:text-indigo-700 transition-colors">{card.value}</div>
                <div className="text-gray-500 text-base font-medium">{card.title}</div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Stats Details */}
        <section className="col-span-2 bg-white rounded-2xl shadow-lg p-8 flex flex-col min-h-[340px] border border-indigo-50">
          <h2 className="text-xl font-bold mb-6 text-indigo-800">Stats Details</h2>
          <div className="grid grid-cols-2 gap-6 mt-2">
            <div className="bg-green-50 rounded-lg p-5 flex items-center gap-4 min-h-[80px]">
              <InboxArrowDownIcon className="w-7 h-7 text-green-600" />
              <div>
                <div className="font-semibold">Sermons</div>
                <div className="text-lg">{stats.totalSermons}</div>
              </div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-5 flex items-center gap-4 min-h-[80px]">
              <DocumentTextIcon className="w-7 h-7 text-yellow-600" />
              <div>
                <div className="font-semibold">Media Items</div>
                <div className="text-lg">{stats.totalMediaItems}</div>
              </div>
            </div>
            <div className="bg-blue-50 rounded-lg p-5 flex items-center gap-4 min-h-[80px]">
              <EnvelopeIcon className="w-7 h-7 text-blue-600" />
              <div>
                <div className="font-semibold">Emails Sent (30d)</div>
                <div className="text-lg">{stats.emailsSent30d}</div>
              </div>
            </div>
            <div className="bg-pink-50 rounded-lg p-5 flex items-center gap-4 min-h-[80px]">
              <ChatBubbleLeftRightIcon className="w-7 h-7 text-pink-600" />
              <div>
                <div className="font-semibold">SMS Sent (30d)</div>
                <div className="text-lg">{stats.smsSent30d}</div>
              </div>
            </div>
          </div>
          {/* Empty state */}
          {Object.values(stats).every(val => val === '--') && (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="text-6xl mb-2">🪟</span>
              <span className="text-gray-400 text-lg">No stats available yet. Data will appear here as your church grows.</span>
            </div>
          )}
        </section>
        {/* Charts Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 flex flex-col min-h-[340px] border border-indigo-50">
          <h2 className="text-xl font-bold mb-6 text-indigo-800">Dashboard Charts</h2>
          {dashboardData?.charts && dashboardData.charts.length > 0 ? (
            <div className="flex flex-col gap-8">
              {dashboardData.charts.map((chart: ChartData, idx: number) => {
                const transformedChart = transformChartData(chart);
                return <ChartContainer key={chart.title + idx} chart={transformedChart} />;
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <span className="text-6xl mb-2">📊</span>
              <span className="text-gray-400 text-lg">No charts available yet.</span>
            </div>
          )}
        </section>
      </div>

      {/* Announcements or Activity Feed Placeholder */}
      <section className="mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center min-h-[120px] border border-indigo-50">
            <ExclamationTriangleIcon className="w-7 h-7 text-indigo-400 mb-2" />
            <div className="text-gray-500 text-lg font-medium">No announcements or recent activity yet. This space will show important updates and notifications.</div>
          </div>
        </div>
      </section>
    </div>
  );
}
