'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  ClockIcon,
  UserIcon,
  CalendarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/Loading';

// Mock query - replace with actual query
const GET_MEMBER_HISTORY = `
  query MemberHistory($memberId: ID!, $skip: Int, $take: Int) {
    memberHistory(memberId: $memberId, skip: $skip, take: $take) {
      id
      action
      entityType
      entityId
      changes
      timestamp
      performedBy {
        id
        firstName
        lastName
      }
    }
    memberHistoryCount(memberId: $memberId)
  }
`;

interface ActivityTimelinePanelProps {
  memberId: string;
}

interface Activity {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  changes?: any;
  timestamp: string;
  performedBy?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

/**
 * ActivityTimelinePanel Component
 * 
 * Displays a timeline of member activities and profile changes
 * 
 * @param memberId - ID of the member
 */
export default function ActivityTimelinePanel({ memberId }: ActivityTimelinePanelProps) {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const { data, loading, error, fetchMore } = useQuery(GET_MEMBER_HISTORY, {
    variables: {
      memberId,
      skip: page * pageSize,
      take: pageSize,
    },
    skip: !memberId,
  });

  const activities: Activity[] = data?.memberHistory || [];
  const totalCount = data?.memberHistoryCount || 0;
  const hasMore = (page + 1) * pageSize < totalCount;

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    fetchMore({
      variables: {
        skip: (page + 1) * pageSize,
        take: pageSize,
      },
    });
  };

  if (loading && page === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600 text-sm">Failed to load activity timeline</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClockIcon className="w-6 h-6 text-blue-600" />
          Activity Timeline
        </h2>
        {totalCount > 0 && (
          <span className="text-sm text-gray-600">{totalCount} activities</span>
        )}
      </div>

      {/* Timeline */}
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              isLast={index === activities.length - 1}
            />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ArrowPathIcon className="w-4 h-4" />
                    Load More
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <ClockIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No activity history yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Your profile changes and activities will appear here
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * ActivityItem Component
 * Displays a single activity in the timeline
 */
interface ActivityItemProps {
  activity: Activity;
  isLast: boolean;
}

function ActivityItem({ activity, isLast }: ActivityItemProps) {
  const icon = getActivityIcon(activity.action, activity.entityType);
  const color = getActivityColor(activity.action);
  const description = getActivityDescription(activity);

  return (
    <div className="relative flex gap-4">
      {/* Timeline Line */}
      {!isLast && (
        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
      )}

      {/* Icon */}
      <div className={`relative z-10 w-10 h-10 rounded-full ${color.bg} flex items-center justify-center flex-shrink-0`}>
        {React.createElement(icon, { className: `w-5 h-5 ${color.text}` })}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{description.title}</p>
              {description.subtitle && (
                <p className="text-sm text-gray-600 mt-1">{description.subtitle}</p>
              )}
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
              {formatTimestamp(activity.timestamp)}
            </span>
          </div>

          {/* Changes */}
          {activity.changes && Object.keys(activity.changes).length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-600 mb-2">Changes:</p>
              <div className="space-y-1">
                {Object.entries(activity.changes).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex items-start gap-2 text-xs">
                    <span className="text-gray-500 font-medium">{formatFieldName(key)}:</span>
                    <span className="text-gray-700">{formatValue(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performed By */}
          {activity.performedBy && (
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <UserIcon className="w-3 h-3" />
              <span>
                by {activity.performedBy.firstName} {activity.performedBy.lastName}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Get icon for activity type
 */
function getActivityIcon(action: string, entityType: string) {
  if (entityType === 'PROFILE') return UserIcon;
  if (entityType === 'ATTENDANCE') return CalendarIcon;
  if (entityType === 'GROUP') return UserGroupIcon;
  if (entityType === 'MEMBERSHIP') return DocumentTextIcon;
  
  if (action === 'CREATE') return CheckCircleIcon;
  if (action === 'UPDATE') return DocumentTextIcon;
  if (action === 'DELETE') return XCircleIcon;
  
  return ClockIcon;
}

/**
 * Get color for activity type
 */
function getActivityColor(action: string) {
  switch (action) {
    case 'CREATE':
      return { bg: 'bg-green-100', text: 'text-green-600' };
    case 'UPDATE':
      return { bg: 'bg-blue-100', text: 'text-blue-600' };
    case 'DELETE':
      return { bg: 'bg-red-100', text: 'text-red-600' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600' };
  }
}

/**
 * Get activity description
 */
function getActivityDescription(activity: Activity) {
  const { action, entityType } = activity;
  
  const actionText = action.toLowerCase();
  const entityText = entityType.toLowerCase().replace('_', ' ');
  
  return {
    title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} ${entityText}`,
    subtitle: getSubtitle(activity),
  };
}

/**
 * Get subtitle for activity
 */
function getSubtitle(activity: Activity): string | null {
  if (activity.entityType === 'PROFILE' && activity.action === 'UPDATE') {
    const changeCount = activity.changes ? Object.keys(activity.changes).length : 0;
    return `${changeCount} field${changeCount !== 1 ? 's' : ''} updated`;
  }
  
  if (activity.entityType === 'ATTENDANCE') {
    return 'Service attendance recorded';
  }
  
  if (activity.entityType === 'GROUP') {
    return activity.action === 'CREATE' ? 'Joined group' : 'Left group';
  }
  
  return null;
}

/**
 * Format timestamp
 */
function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format field name
 */
function formatFieldName(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Format value
 */
function formatValue(value: any): string {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
