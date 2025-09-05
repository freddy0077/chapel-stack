import React from "react";
import {
  UserPlusIcon,
  CurrencyDollarIcon,
  HeartIcon,
  CalendarDaysIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "@/utils/currency";

interface RecentMember {
  id: string;
  name: string;
  joinedAt: string;
}

interface RecentContribution {
  id: string;
  amount: number;
  date: string;
  type: string;
}

interface RecentSacrament {
  id: string;
  type: string;
  date: string;
  memberName: string;
}

interface ActivitySummary {
  newMembersCount: number;
  contributionsCount: number;
  sacramentsCount: number;
  attendanceRecordsCount: number;
  totalActivities: number;
}

interface BranchActivityFeedProps {
  recentMembers: RecentMember[];
  recentContributions: RecentContribution[];
  recentSacraments: RecentSacrament[];
  activitySummary: ActivitySummary;
}

// Helper function to format relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString();
};

// Helper function to get sacrament emoji
const getSacramentEmoji = (type: string) => {
  const emojiMap: { [key: string]: string } = {
    BAPTISM: "💧",
    CONFIRMATION: "✋",
    COMMUNION: "🍞",
    MARRIAGE: "💒",
    ORDINATION: "🙏",
    ANOINTING: "🛡️",
    RECONCILIATION: "🕊️",
  };
  return emojiMap[type.toUpperCase()] || "⛪";
};

export function BranchActivityFeed({
  recentMembers,
  recentContributions,
  recentSacraments,
  activitySummary,
}: BranchActivityFeedProps) {
  // Combine and sort all activities by date
  const allActivities = [
    ...recentMembers.map((member) => ({
      id: `member-${member.id}`,
      type: "member" as const,
      date: member.joinedAt,
      data: member,
    })),
    ...recentContributions.map((contribution) => ({
      id: `contribution-${contribution.id}`,
      type: "contribution" as const,
      date: contribution.date,
      data: contribution,
    })),
    ...recentSacraments.map((sacrament) => ({
      id: `sacrament-${sacrament.id}`,
      type: "sacrament" as const,
      date: sacrament.date,
      data: sacrament,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-6">
      {/* Activity Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <UserPlusIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-700">
                {activitySummary.newMembersCount}
              </div>
              <div className="text-sm text-blue-600">New Members</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <CurrencyDollarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">
                {activitySummary.contributionsCount}
              </div>
              <div className="text-sm text-green-600">Contributions</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 border border-pink-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
              <HeartIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-700">
                {activitySummary.sacramentsCount}
              </div>
              <div className="text-sm text-pink-600">Sacraments</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700">
                {activitySummary.totalActivities}
              </div>
              <div className="text-sm text-purple-600">Total Activities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🔥 Recent Activities (Past 7 Days)
          </h3>
        </div>

        <div className="p-6">
          {allActivities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ClockIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activities to display</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allActivities.slice(0, 10).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                >
                  {/* Activity Icon */}
                  <div className="flex-shrink-0">
                    {activity.type === "member" && (
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <UserPlusIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {activity.type === "contribution" && (
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <CurrencyDollarIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {activity.type === "sacrament" && (
                      <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white text-lg">
                        {getSacramentEmoji(
                          (activity.data as RecentSacrament).type,
                        )}
                      </div>
                    )}
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    {activity.type === "member" && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          <span className="font-semibold text-blue-600">
                            {(activity.data as RecentMember).name}
                          </span>{" "}
                          joined the branch
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          New member registration
                        </p>
                      </div>
                    )}

                    {activity.type === "contribution" && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          <span className="font-semibold text-green-600">
                            {formatCurrency(
                              (activity.data as RecentContribution).amount,
                            )}
                          </span>{" "}
                          {(
                            activity.data as RecentContribution
                          ).type.toLowerCase()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Financial contribution
                        </p>
                      </div>
                    )}

                    {activity.type === "sacrament" && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          <span className="font-semibold text-pink-600">
                            {(activity.data as RecentSacrament).type}
                          </span>{" "}
                          sacrament for{" "}
                          <span className="font-semibold">
                            {(activity.data as RecentSacrament).memberName}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Sacramental record
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Time */}
                  <div className="flex-shrink-0 text-xs text-gray-400">
                    {formatRelativeTime(activity.date)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
