import React from "react";
import { useQuery } from "@apollo/client";
import { GET_MEMBER_ACTIVITIES } from "@/graphql/queries/memberQueries";
import {
  ClockIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  SparklesIcon,
  UserGroupIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { Member } from "../../types/member.types";

interface ActivitiesSectionProps {
  member: Member;
}

interface Activity {
  id: string;
  type:
    | "ATTENDANCE"
    | "CONTRIBUTION"
    | "PRAYER_REQUEST"
    | "COUNSELING"
    | "PASTORAL_VISIT"
    | "CARE_REQUEST"
    | "SACRAMENT"
    | "GROUP_MEMBERSHIP";
  title: string;
  description?: string;
  date: string;
  status?: string;
  amount?: number;
  priority?: string;
  relatedEntityId?: string;
}

const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ member }) => {
  const { data, loading, error, refetch } = useQuery(GET_MEMBER_ACTIVITIES, {
    variables: {
      memberId: member.id,
      limit: 20,
    },
    fetchPolicy: "cache-and-network",
  });

  const recentActivities: Activity[] = data?.memberActivities || [];

  const getActivityIcon = (type: string) => {
    const normalizedType = type.toUpperCase();
    switch (normalizedType) {
      case "ATTENDANCE":
        return <CalendarDaysIcon className="h-4 w-4 text-green-500" />;
      case "CONTRIBUTION":
        return <CurrencyDollarIcon className="h-4 w-4 text-blue-500" />;
      case "PRAYER_REQUEST":
        return <HeartIcon className="h-4 w-4 text-purple-500" />;
      case "COUNSELING":
        return <ChatBubbleLeftRightIcon className="h-4 w-4 text-orange-500" />;
      case "PASTORAL_VISIT":
        return <CalendarDaysIcon className="h-4 w-4 text-indigo-500" />;
      case "CARE_REQUEST":
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      case "SACRAMENT":
        return <SparklesIcon className="h-4 w-4 text-yellow-500" />;
      case "GROUP_MEMBERSHIP":
        return <UserGroupIcon className="h-4 w-4 text-teal-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    const normalizedType = type.toUpperCase();
    switch (normalizedType) {
      case "ATTENDANCE":
        return "bg-green-50 text-green-700 border-green-200";
      case "CONTRIBUTION":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PRAYER_REQUEST":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "COUNSELING":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "PASTORAL_VISIT":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "CARE_REQUEST":
        return "bg-red-50 text-red-700 border-red-200";
      case "SACRAMENT":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "GROUP_MEMBERSHIP":
        return "bg-teal-50 text-teal-700 border-teal-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatActivityType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(amount);
  };

  // Group activities by type for summary
  const activitySummary = recentActivities.reduce(
    (acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <ClockIcon className="h-5 w-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activities
          </h3>
        </div>
        <button
          onClick={() => refetch()}
          disabled={loading}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh activities"
        >
          <ArrowPathIcon
            className={`h-4 w-4 text-gray-600 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Loading State */}
      {loading && recentActivities.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-300 mx-auto mb-3" />
          <p className="text-red-500 text-sm mb-2">Error loading activities</p>
          <button
            onClick={() => refetch()}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Activity Summary Cards */}
      {!loading && !error && Object.keys(activitySummary).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {Object.entries(activitySummary).map(([type, count]) => (
            <div
              key={type}
              className={`p-3 rounded-lg border ${getActivityColor(type)}`}
            >
              <div className="flex items-center gap-2">
                {getActivityIcon(type)}
                <div>
                  <div className="text-lg font-semibold">{count}</div>
                  <div className="text-xs">{formatActivityType(type)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activities Timeline Graph */}
      {!loading && !error && recentActivities.length > 0 ? (
        <div className="relative">
          <h4 className="text-sm font-medium text-gray-700 mb-6">
            Recent Activity Timeline
          </h4>
          
          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>
            
            {/* Timeline items */}
            <div className="space-y-8">
              {recentActivities.slice(0, 10).map((activity, index) => {
                const isLast = index === Math.min(9, recentActivities.length - 1);
                
                return (
                  <div key={activity.id} className="relative flex items-start gap-6 group">
                    {/* Timeline node */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border-4 border-indigo-500 shadow-lg group-hover:scale-110 transition-transform">
                        {getActivityIcon(activity.type)}
                      </div>
                      
                      {/* Pulse animation for recent items */}
                      {index === 0 && (
                        <span className="absolute inset-0 rounded-full bg-indigo-400 animate-ping opacity-75"></span>
                      )}
                    </div>

                    {/* Content card */}
                    <div className="flex-1 pb-8">
                      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all p-4">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-semibold text-gray-900">
                                {activity.title}
                              </h5>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getActivityColor(activity.type)}`}
                              >
                                {formatActivityType(activity.type)}
                              </span>
                            </div>
                            
                            {activity.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {activity.description}
                              </p>
                            )}
                          </div>

                          {activity.priority && (
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(activity.priority)}`}
                            >
                              {activity.priority}
                            </span>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-gray-100">
                          <span className="flex items-center gap-1 text-gray-500">
                            <CalendarDaysIcon className="h-3.5 w-3.5" />
                            {new Date(activity.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })} at{" "}
                            {new Date(activity.date).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>

                          <div className="flex items-center gap-3">
                            {activity.amount && (
                              <span className="font-semibold text-green-600">
                                {formatCurrency(activity.amount)}
                              </span>
                            )}

                            {activity.status && (
                              <span className="px-2 py-1 bg-gray-100 rounded-full text-gray-700 capitalize">
                                {activity.status.replace("_", " ").toLowerCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {recentActivities.length > 10 && (
            <div className="text-center pt-6 mt-6 border-t border-gray-200">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors">
                <ClockIcon className="h-4 w-4" />
                View All {recentActivities.length} Activities
              </button>
            </div>
          )}
        </div>
      ) : !loading && !error ? (
        <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border-2 border-dashed border-gray-300">
          <div className="relative">
            <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border-4 border-gray-200 border-t-indigo-300 rounded-full animate-spin opacity-20"></div>
            </div>
          </div>
          <p className="text-gray-600 text-base font-medium">No recent activities</p>
          <p className="text-gray-400 text-sm mt-2">
            Member activities will appear here when recorded
          </p>
        </div>
      ) : null}

      {/* Quick Stats */}
      <div className="mt-8 pt-6 border-t-2 border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">
          Activity Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Last Activity */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <ClockIcon className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-medium text-indigo-700">Last Activity</span>
            </div>
            <div className="text-sm font-semibold text-indigo-900">
              {recentActivities.length > 0
                ? new Date(recentActivities[0].date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                : "No activity"}
            </div>
            {recentActivities.length > 0 && (
              <div className="text-xs text-indigo-600 mt-1">
                {recentActivities[0].title}
              </div>
            )}
          </div>

          {/* Last Attendance */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CalendarDaysIcon className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Last Attendance</span>
            </div>
            <div className="text-sm font-semibold text-green-900">
              {(() => {
                const attendanceActivity = recentActivities.find(
                  (activity) => activity.type === "ATTENDANCE"
                );
                return attendanceActivity
                  ? new Date(attendanceActivity.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : "No attendance";
              })()}
            </div>
            {(() => {
              const attendanceActivity = recentActivities.find(
                (activity) => activity.type === "ATTENDANCE"
              );
              return attendanceActivity ? (
                <div className="text-xs text-green-600 mt-1">
                  {attendanceActivity.title}
                </div>
              ) : null;
            })()}
          </div>

          {/* Last Contribution */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <CurrencyDollarIcon className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">Last Contribution</span>
            </div>
            <div className="text-sm font-semibold text-blue-900">
              {(() => {
                const contributionActivity = recentActivities.find(
                  (activity) => activity.type === "CONTRIBUTION"
                );
                return contributionActivity
                  ? new Date(contributionActivity.date).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : "No contribution";
              })()}
            </div>
            {(() => {
              const contributionActivity = recentActivities.find(
                (activity) => activity.type === "CONTRIBUTION"
              );
              return contributionActivity?.amount ? (
                <div className="text-xs text-blue-600 mt-1 font-semibold">
                  {formatCurrency(contributionActivity.amount)}
                </div>
              ) : null;
            })()}
          </div>

          {/* Total Activities */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <ChartBarIcon className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">Total Activities</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {recentActivities.length}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              Recorded activities
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivitiesSection;
