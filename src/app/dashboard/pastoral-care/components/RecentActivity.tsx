"use client";

import React from 'react';
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  ExclamationTriangleIcon, 
  BellIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { PastoralCareActivity } from '@/graphql/hooks/usePastoralCare';

interface RecentActivityProps {
  activity?: PastoralCareActivity[];
  loading: boolean;
}

function getActivityIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'pastoral_visit':
    case 'visit':
      return <HomeIcon className="h-5 w-5 text-blue-600" />;
    case 'counseling_session':
    case 'counseling':
      return <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-600" />;
    case 'care_request':
    case 'request':
      return <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />;
    case 'follow_up':
    case 'reminder':
      return <BellIcon className="h-5 w-5 text-purple-600" />;
    default:
      return <ClockIcon className="h-5 w-5 text-gray-600" />;
  }
}

function getActivityColor(type: string) {
  switch (type.toLowerCase()) {
    case 'pastoral_visit':
    case 'visit':
      return 'border-blue-200 bg-blue-50';
    case 'counseling_session':
    case 'counseling':
      return 'border-green-200 bg-green-50';
    case 'care_request':
    case 'request':
      return 'border-orange-200 bg-orange-50';
    case 'follow_up':
    case 'reminder':
      return 'border-purple-200 bg-purple-50';
    default:
      return 'border-gray-200 bg-gray-50';
  }
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

function ActivityItem({ activity }: { activity: PastoralCareActivity }) {
  return (
    <div className={`border-l-4 pl-4 py-3 ${getActivityColor(activity.type)}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 truncate">
              {activity.title}
            </p>
            <p className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatRelativeTime(activity.date)}
            </p>
          </div>
          {activity.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {activity.description}
            </p>
          )}
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            {activity.memberName && (
              <span className="flex items-center">
                <UserIcon className="h-3 w-3 mr-1" />
                {activity.memberName}
              </span>
            )}
            {activity.pastorName && (
              <span className="flex items-center">
                Pastor: {activity.pastorName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="border-l-4 border-gray-200 bg-gray-50 pl-4 py-3 animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <div className="h-5 w-5 bg-gray-300 rounded"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="h-3 bg-gray-300 rounded w-3/4 mt-2"></div>
          <div className="flex items-center space-x-4 mt-2">
            <div className="h-3 bg-gray-300 rounded w-20"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecentActivity({ activity, loading }: RecentActivityProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <ActivitySkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!activity || activity.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No recent pastoral care activity</p>
          <p className="text-sm text-gray-400 mt-1">
            Activity will appear here as visits, sessions, and care requests are created
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <span className="text-sm text-gray-500">
          Last 7 days
        </span>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activity.map((item) => (
          <ActivityItem key={item.id} activity={item} />
        ))}
      </div>
      
      {activity.length >= 10 && (
        <div className="mt-4 text-center">
          <button className="text-sm text-indigo-600 hover:text-indigo-500 font-medium">
            View all activity
          </button>
        </div>
      )}
    </div>
  );
}
