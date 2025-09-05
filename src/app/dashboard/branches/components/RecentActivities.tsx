import { useQuery } from "@apollo/client";
import { GET_BRANCH_ACTIVITIES } from "@/graphql/queries/branchQueries";
import { formatDistanceToNow } from "date-fns";
import { ClockIcon } from "@heroicons/react/24/outline";
import { usePermissions } from "@/hooks/usePermissions";

interface RecentActivitiesProps {
  branchId: string;
  limit?: number;
}

interface ActivityUser {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
}

interface ActivityMetadata {
  entityId?: string;
  entityType?: string;
  details?: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user?: ActivityUser;
  metadata?: ActivityMetadata;
}

const getActivityIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "member_added":
      return (
        <div className="p-2 bg-green-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-green-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
          </svg>
        </div>
      );
    case "member_updated":
      return (
        <div className="p-2 bg-blue-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
      );
    case "event_created":
      return (
        <div className="p-2 bg-purple-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-purple-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    case "contribution_received":
      return (
        <div className="p-2 bg-yellow-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-yellow-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path
              fillRule="evenodd"
              d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
    default:
      return (
        <div className="p-2 bg-gray-100 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      );
  }
};

export default function RecentActivities({
  branchId,
  limit = 5,
}: RecentActivitiesProps) {
  const { isSuperAdmin, isBranchAdmin } = usePermissions();
  const { loading, error, data, refetch } = useQuery(GET_BRANCH_ACTIVITIES, {
    variables: { branchId, limit },
    fetchPolicy: "cache-and-network",
  });

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-start space-x-3 animate-pulse">
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mx-auto text-gray-400"
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
        </div>
        <p>Failed to load activities</p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-sm text-indigo-600 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  const activities = data?.branchActivities || [];

  if (activities.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p>No recent activities found</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ul className="space-y-4">
        {activities.map((activity: Activity) => (
          <li key={activity.id} className="flex items-start space-x-3">
            {getActivityIcon(activity.type)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {activity.description}
                {(isSuperAdmin || isBranchAdmin) &&
                  activity.metadata?.entityId && (
                    <span className="ml-1 text-xs text-gray-500">
                      (ID: {activity.metadata.entityId})
                    </span>
                  )}
              </p>
              <div className="flex items-center mt-1">
                <ClockIcon className="h-3 w-3 text-gray-400 mr-1" />
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.timestamp), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            {activity.user && (
              <div className="flex-shrink-0">
                {activity.user.name ? (
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-indigo-600">
                      {activity.user.name}
                    </span>
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-indigo-600">
                      {activity.user.firstName[0]}
                      {activity.user.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
