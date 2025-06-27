"use client";

import React, { useState, useMemo } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useAttendanceAnalytics } from '@/graphql/hooks/useAttendanceAnalytics';
import { useAuth } from '@/graphql/hooks/useAuth';
import { useOrganizationBranchFilter } from '@/graphql/hooks/useOrganizationBranchFilter';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AttendanceAnalytics() {
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const { user } = useAuth();
  const { organisationId, branchId } = useOrganizationBranchFilter();

  // Compute date range based on timeFrame
  // Use the current local time as the source of truth for 'now' (2025-06-08T16:35:08Z)
  const now = useMemo(() => new Date('2025-06-08T16:39:28Z'), []);
  const [startDate, endDate] = useMemo(() => {
    const start = new Date(now.getTime());
    const end = new Date(now.getTime());
    if (timeFrame === 'week') {
      // Set start to previous Sunday 00:00:00.000Z
      const day = now.getUTCDay();
      start.setUTCDate(now.getUTCDate() - day);
      start.setUTCHours(0, 0, 0, 0);
      // Set end to current Sunday 23:59:59.999Z
      end.setUTCDate(start.getUTCDate() + 6);
      end.setUTCHours(23, 59, 59, 999);
    } else if (timeFrame === 'month') {
      // Set start to first of the month 00:00:00.000Z
      start.setUTCDate(1);
      start.setUTCHours(0, 0, 0, 0);
      // Set end to last day of the month 23:59:59.999Z
      end.setUTCMonth(now.getUTCMonth() + 1, 0); // last day of this month
      end.setUTCHours(23, 59, 59, 999);
    } else if (timeFrame === 'quarter') {
      // Set start to first day of the quarter 00:00:00.000Z
      const currentQuarter = Math.floor(now.getUTCMonth() / 3);
      start.setUTCMonth(currentQuarter * 3, 1);
      start.setUTCHours(0, 0, 0, 0);
      // Set end to last day of the quarter 23:59:59.999Z
      end.setUTCMonth(currentQuarter * 3 + 3, 0);
      end.setUTCHours(23, 59, 59, 999);
    } else {
      // year
      start.setUTCMonth(0, 1);
      start.setUTCHours(0, 0, 0, 0);
      end.setUTCMonth(11, 31);
      end.setUTCHours(23, 59, 59, 999);
    }
    return [start, end];
  }, [now, timeFrame]);

  const startDateStr = useMemo(() => startDate.toISOString(), [startDate]);
  const endDateStr = useMemo(() => endDate.toISOString(), [endDate]);

  const statsTypes = useMemo(() => [
    'TOTAL_ATTENDANCE',
    'UNIQUE_MEMBERS',
    'VISITORS',
    'FIRST_TIME_VISITORS',
    'GROWTH_RATE',
    'RETENTION_RATE',
  ], []);

  const period = useMemo(() => {
    if (timeFrame === 'week') return 'WEEKLY';
    if (timeFrame === 'month') return 'MONTHLY';
    if (timeFrame === 'quarter') return 'QUARTERLY';
    return 'YEARLY';
  }, [timeFrame]);

  const analyticsInput = useMemo(() => ({
    branchId,
    organisationId,
    startDate: startDateStr,
    endDate: endDateStr,
    period: period as 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY',
    statsTypes,
  }), [branchId, organisationId, startDateStr, endDateStr, period, statsTypes]);

  // Debug: Log the computed date strings to verify ISO format
  console.log('attendance analytics input', { startDateStr, endDateStr, analyticsInput });

  const { analytics, loading, error } = useAttendanceAnalytics(analyticsInput, !branchId && !organisationId);

  // Helper: get chart data from analytics


  // Helper: get breakdown data
  const getBreakdownData = (field: keyof typeof analytics, labelKey: string, valueKey: string) => {
    const arr = analytics?.[field] || [];
    return {
      labels: arr.map((d: Record<string, string>) => d[labelKey]),
      datasets: [
        {
          label: typeof field === 'string' ? field.replace(/_/g, ' ') : String(field),
          data: arr.map((d: Record<string, number>) => d[valueKey]),
          backgroundColor: [
            'rgba(79, 70, 229, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)',
            'rgba(59, 130, 246, 0.8)',
            'rgba(34, 197, 94, 0.8)',
            'rgba(250, 204, 21, 0.8)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Metrics (only show if present in analytics)
  const totalAttendees = analytics?.TOTAL_ATTENDANCE?.reduce((sum: number, d: { total?: number }) => sum + (d.total || 0), 0) || 0;
  const uniqueMembers = analytics?.UNIQUE_MEMBERS?.reduce((sum: number, d: { unique_members?: number }) => sum + (d.unique_members || 0), 0) || 0;
  const visitors = analytics?.VISITORS?.reduce((sum: number, d: { visitors?: number }) => sum + (d.visitors || 0), 0) || 0;
  const firstTimeVisitors = analytics?.FIRST_TIME_VISITORS?.reduce((sum: number, d: { first_time_visitors?: number }) => sum + (d.first_time_visitors || 0), 0) || 0;



  // Prepare attendance trend data from API, fallback to mock data if unavailable
  const attendanceTrendData = useMemo(() => {
    if (analytics?.TOTAL_ATTENDANCE && Array.isArray(analytics.TOTAL_ATTENDANCE) && analytics.TOTAL_ATTENDANCE.length > 0) {
      return {
        labels: analytics.TOTAL_ATTENDANCE.map((d: any) => d.period ?? ''),
        datasets: [
          {
            label: 'Attendance',
            data: analytics.TOTAL_ATTENDANCE.map((d: any) => typeof d.total === 'number' ? d.total : 0),
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: 'rgba(79, 70, 229, 0.5)',
            tension: 0.3
          }
        ]
      };
    }
    // fallback mock data
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Attendance',
          data: [150, 162, 170, 165, 172, 185],
          borderColor: 'rgb(79, 70, 229)',
          backgroundColor: 'rgba(79, 70, 229, 0.5)',
          tension: 0.3
        }
      ]
    };
  }, [analytics?.TOTAL_ATTENDANCE]);

  // Prepare attendance by method data
  const attendanceByMethodData = {
    labels: ['Card Scan', 'Manual Entry', 'Mobile App', 'QR Code'],
    datasets: [
      {
        label: 'Check-in Method',
        data: [65, 15, 12, 8],
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 1
      }
    ]
  };

  // Prepare attendance by day of week data from analytics
  const attendanceByDayData = getBreakdownData('BY_DAY', 'group', 'count');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ArrowPathIcon className="h-8 w-8 text-gray-400 animate-spin" />
        <span className="ml-2 text-gray-600">Loading analytics data...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <span>Error loading analytics: {error.message}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 md:mb-0">Attendance Analytics</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div>
            <select
              className="border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {typeof totalAttendees === 'number' && (
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Attendees</dt>
                    <dd>
                      <div className="text-2xl font-semibold text-gray-900">{totalAttendees}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
        {typeof uniqueMembers === 'number' && (
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.21 0-4 1.79-4 4v4h8v-4c0-2.21-1.79-4-4-4z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Unique Members</dt>
                    <dd>
                      <div className="text-2xl font-semibold text-gray-900">{uniqueMembers}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
        {typeof visitors === 'number' && (
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Visitors</dt>
                    <dd>
                      <div className="text-2xl font-semibold text-gray-900">{visitors}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
        {typeof firstTimeVisitors === 'number' && (
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7a4 4 0 018 0v4a4 4 0 01-8 0V7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">First Time Visitors</dt>
                    <dd>
                      <div className="text-2xl font-semibold text-gray-900">{firstTimeVisitors}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Attendance Trend</h3>
          <div className="h-80">
            <Line 
              data={attendanceTrendData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: false,
                    min: 100
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Attendance by Day</h3>
          <div className="h-80">
            <Bar 
              data={attendanceByDayData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Check-in Methods</h3>
          <div className="h-80 flex items-center justify-center">
            <div style={{ maxWidth: '300px', maxHeight: '300px' }}>
              <Doughnut 
                data={attendanceByMethodData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  plugins: {
                    legend: {
                      position: 'bottom'
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Absence Alerts</h3>
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Attendance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weeks Absent
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">David Williams</div>
                    <div className="text-sm text-gray-500">mem_006</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Mar 23, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    3
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Follow-up
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">William Taylor</div>
                    <div className="text-sm text-gray-500">mem_009</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Dec 25, 2024
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    15
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Critical
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">Karen Johnson</div>
                    <div className="text-sm text-gray-500">mem_012</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    Mar 16, 2025
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    4
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                      Follow-up
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
