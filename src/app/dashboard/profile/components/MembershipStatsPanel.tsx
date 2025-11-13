'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import {
  ChartBarIcon,
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { GET_MEMBER_DASHBOARD } from '@/graphql/queries/memberQueries';
import Loading from '@/components/ui/Loading';

interface MembershipStatsPanelProps {
  memberId: string;
}

/**
 * MembershipStatsPanel Component
 * 
 * Displays membership statistics including attendance, giving, and group participation
 * 
 * @param memberId - ID of the member
 */
export default function MembershipStatsPanel({ memberId }: MembershipStatsPanelProps) {
  const { data, loading, error } = useQuery(GET_MEMBER_DASHBOARD, {
    variables: { memberId },
    skip: !memberId,
  });

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">Failed to load statistics</p>
      </div>
    );
  }

  const dashboard = data?.memberDashboard;

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <ChartBarIcon className="w-6 h-6 text-blue-600" />
        Membership Statistics
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Attendance Stats */}
        <StatCard
          icon={CalendarIcon}
          iconColor="text-blue-600"
          iconBg="bg-blue-100"
          title="Attendance"
          value={dashboard?.attendanceStats?.totalAttendance || 0}
          subtitle="Total services attended"
          trend={dashboard?.attendanceStats?.thisMonth || 0}
          trendLabel="This month"
        />

        {/* Groups */}
        <StatCard
          icon={UserGroupIcon}
          iconColor="text-purple-600"
          iconBg="bg-purple-100"
          title="Groups"
          value={dashboard?.groupMemberships?.length || 0}
          subtitle="Active group memberships"
        />

        {/* Giving */}
        <StatCard
          icon={CurrencyDollarIcon}
          iconColor="text-green-600"
          iconBg="bg-green-100"
          title="Giving"
          value={`$${dashboard?.givingStats?.totalGiving || 0}`}
          subtitle="Total contributions"
          trend={`$${dashboard?.givingStats?.thisYear || 0}`}
          trendLabel="This year"
        />

        {/* Attendance Rate */}
        <StatCard
          icon={TrophyIcon}
          iconColor="text-yellow-600"
          iconBg="bg-yellow-100"
          title="Attendance Rate"
          value={`${dashboard?.attendanceStats?.attendanceRate || 0}%`}
          subtitle="Average attendance"
        />

        {/* Member Since */}
        <StatCard
          icon={ClockIcon}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-100"
          title="Member Since"
          value={dashboard?.memberSince ? new Date(dashboard.memberSince).getFullYear() : 'N/A'}
          subtitle={dashboard?.memberSince ? `${calculateYears(dashboard.memberSince)} years` : 'No data'}
        />

        {/* Volunteer Hours */}
        <StatCard
          icon={ChartBarIcon}
          iconColor="text-pink-600"
          iconBg="bg-pink-100"
          title="Volunteer Hours"
          value={dashboard?.volunteerHours || 0}
          subtitle="Total hours served"
        />
      </div>

      {/* Group Memberships */}
      {dashboard?.groupMemberships && dashboard.groupMemberships.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Active Groups</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dashboard.groupMemberships.map((group: any) => (
              <div
                key={group.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserGroupIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{group.name}</p>
                  {group.role && (
                    <p className="text-sm text-gray-600">{group.role}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance Chart (Simple Bar Visualization) */}
      {dashboard?.attendanceStats?.monthlyAttendance && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Monthly Attendance</h3>
          <div className="space-y-2">
            {dashboard.attendanceStats.monthlyAttendance.slice(-6).map((month: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-20">
                  {new Date(month.month).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{ width: `${Math.min((month.count / 20) * 100, 100)}%` }}
                  >
                    <span className="text-xs text-white font-medium">{month.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestones */}
      {dashboard?.milestones && dashboard.milestones.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900">Recent Milestones</h3>
          <div className="space-y-2">
            {dashboard.milestones.map((milestone: any, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <TrophyIcon className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{milestone.title}</p>
                  <p className="text-sm text-gray-600">{milestone.description}</p>
                  {milestone.date && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(milestone.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!dashboard && (
        <div className="text-center py-8">
          <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No statistics available yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Statistics will appear as you participate in church activities
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * StatCard Component
 * Displays a single statistic with icon and optional trend
 */
interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  title: string;
  value: string | number;
  subtitle: string;
  trend?: string | number;
  trendLabel?: string;
}

function StatCard({
  icon: Icon,
  iconColor,
  iconBg,
  title,
  value,
  subtitle,
  trend,
  trendLabel,
}: StatCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          {trend !== undefined && trendLabel && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                <span className="font-medium text-blue-600">{trend}</span> {trendLabel}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Calculate years from a date
 */
function calculateYears(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const years = now.getFullYear() - date.getFullYear();
  return years;
}
