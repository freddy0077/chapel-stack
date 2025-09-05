"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  GET_BRANCH,
  GET_BRANCH_ACTIVITIES,
} from "@/graphql/queries/branchQueries";
import DashboardHeader from "@/components/DashboardHeader";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { usePermissions } from "@/hooks/usePermissions";

export default function BranchActivitiesPage() {
  const params = useParams();
  const branchId = params?.id as string;
  const { isSuperAdmin, isBranchAdmin } = usePermissions();

  const { data: branchData, loading: branchLoading } = useQuery(GET_BRANCH, {
    variables: { id: branchId },
    skip: !branchId,
  });

  const {
    data: activitiesData,
    loading: activitiesLoading,
    error,
    refetch,
  } = useQuery(GET_BRANCH_ACTIVITIES, {
    variables: { branchId, limit: 50 },
    skip: !branchId,
    fetchPolicy: "cache-and-network",
  });

  const branch = branchData?.branch;
  const activities = activitiesData?.branchActivities || [];

  // Function to get appropriate icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "member_added":
        return (
          <div className="p-2 bg-green-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
        );
      case "member_removed":
        return (
          <div className="p-2 bg-red-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"
              />
            </svg>
          </div>
        );
      case "event_created":
        return (
          <div className="p-2 bg-blue-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        );
      case "donation":
        return (
          <div className="p-2 bg-yellow-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-2 bg-gray-100 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
    }
  };

  // Function to render user avatar
  const renderUserAvatar = (user: any) => {
    if (!user) return null;

    return (
      <div className="flex-shrink-0">
        {user.name ? (
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-sm font-medium text-indigo-600">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>
        ) : (
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-sm font-medium text-indigo-600">
              {user.firstName?.[0] || ""}
              {user.lastName?.[0] || ""}
            </span>
          </div>
        )}
      </div>
    );
  };

  if (branchLoading || activitiesLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <DashboardHeader />
        <div className="px-4 sm:px-6 lg:px-8 py-6 flex-grow max-w-7xl mx-auto w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <DashboardHeader />
        <div className="px-4 sm:px-6 lg:px-8 py-6 flex-grow max-w-7xl mx-auto w-full">
          <div className="text-center py-12">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900">
              Failed to load branch activities
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              There was an error loading the activities for this branch.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <DashboardHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-6 flex-grow max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Branch Activities
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {branch?.name} - Recent activities and changes
            </p>
          </div>
          <Link
            href={`/dashboard/branches/${branchId}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Branch
          </Link>
        </div>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {activities.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900">
                No activities yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                This branch doesn't have any recorded activities yet.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {activities.map((activity: any) => (
                <li key={activity.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start space-x-4">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.description}
                        {(isSuperAdmin || isBranchAdmin) &&
                          activity.metadata?.entityId && (
                            <span className="ml-1 text-xs text-gray-500">
                              (ID: {activity.metadata.entityId})
                            </span>
                          )}
                      </p>
                      <div className="flex items-center mt-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-gray-400 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(activity.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {activity.metadata && activity.metadata.details && (
                        <p className="mt-1 text-xs text-gray-500">
                          {activity.metadata.details}
                        </p>
                      )}
                    </div>
                    {activity.user && (
                      <div className="flex items-center space-x-3">
                        {renderUserAvatar(activity.user)}
                        <span className="ml-2 text-xs text-gray-500">
                          {activity.user.firstName} {activity.user.lastName}
                        </span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
