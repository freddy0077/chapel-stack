import React from "react";
import { motion } from "framer-motion";
import {
  UsersIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { SmallGroup } from "../../../../graphql/hooks/useSmallGroups";

interface GroupsStatsProps {
  groups: SmallGroup[];
  loading?: boolean;
}

export default function GroupsStats({ groups = [], loading }: GroupsStatsProps) {
  // Validate input is array
  if (!Array.isArray(groups)) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading statistics...
      </div>
    );
  }

  // Calculate statistics
  const totalGroups = groups.length;
  const activeGroups = groups.filter(
    (group) => group.status === "ACTIVE",
  ).length;
  const inactiveGroups = groups.filter(
    (group) => group.status === "INACTIVE",
  ).length;
  const archivedGroups = groups.filter(
    (group) => group.status === "ARCHIVED",
  ).length;

  // Calculate total members across all groups
  const totalMembers = groups.reduce(
    (sum, group) => sum + (group.members?.length || 0),
    0,
  );

  // Calculate average group size
  const averageGroupSize =
    totalGroups > 0 ? Math.round((totalMembers / totalGroups) * 10) / 10 : 0;

  const stats = [
    {
      id: "total-groups",
      name: "Total Groups",
      value: totalGroups,
      icon: UserGroupIcon,
      color: "indigo",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
      textColor: "text-indigo-900",
    },
    {
      id: "active-groups",
      name: "Active Groups",
      value: activeGroups,
      icon: CheckCircleIcon,
      color: "green",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      textColor: "text-green-900",
    },
    {
      id: "total-members",
      name: "Total Members",
      value: totalMembers,
      icon: UsersIcon,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      textColor: "text-blue-900",
    },
    {
      id: "average-size",
      name: "Avg Group Size",
      value: averageGroupSize,
      icon: ChartBarIcon,
      color: "purple",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      textColor: "text-purple-900",
    },
  ];

  // Additional status breakdown stats
  const statusStats = [
    {
      id: "inactive-groups",
      name: "Inactive",
      value: inactiveGroups,
      icon: XCircleIcon,
      color: "yellow",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
      textColor: "text-yellow-900",
    },
    {
      id: "archived-groups",
      name: "Archived",
      value: archivedGroups,
      icon: ArchiveBoxIcon,
      color: "gray",
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      textColor: "text-gray-900",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-200 rounded-md animate-pulse" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-8">
      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`${stat.bgColor} overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow`}
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon
                    className={`h-8 w-8 ${stat.iconColor}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt
                      className={`text-sm font-medium ${stat.textColor} truncate opacity-75`}
                    >
                      {stat.name}
                    </dt>
                    <dd>
                      <div className={`text-2xl font-bold ${stat.textColor}`}>
                        {stat.value.toLocaleString()}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Status Breakdown - Only show if there are inactive or archived groups */}
      {(inactiveGroups > 0 || archivedGroups > 0) && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {statusStats.map(
            (stat, index) =>
              stat.value > 0 && (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: (index + 4) * 0.1 }}
                  className={`${stat.bgColor} overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow`}
                >
                  <div className="p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <stat.icon
                          className={`h-6 w-6 ${stat.iconColor}`}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3 w-0 flex-1">
                        <dl>
                          <dt
                            className={`text-xs font-medium ${stat.textColor} truncate opacity-75`}
                          >
                            {stat.name}
                          </dt>
                          <dd>
                            <div
                              className={`text-lg font-bold ${stat.textColor}`}
                            >
                              {stat.value}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ),
          )}
        </div>
      )}
    </div>
  );
}
