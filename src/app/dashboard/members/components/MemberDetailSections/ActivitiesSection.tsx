import React from 'react';
import { 
  ClockIcon, 
  CalendarDaysIcon, 
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { Member } from '../../types/member.types';

interface ActivitiesSectionProps {
  member: Member;
}

interface Activity {
  id: string;
  type: 'attendance' | 'contribution' | 'prayer_request' | 'counseling' | 'pastoral_visit' | 'care_request';
  title: string;
  description?: string;
  date: string;
  status?: string;
  amount?: number;
  priority?: string;
}

const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ member }) => {
  // Mock data - in real implementation, this would come from GraphQL queries
  const recentActivities: Activity[] = [];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <CalendarDaysIcon className="h-4 w-4 text-green-500" />;
      case 'contribution':
        return <CurrencyDollarIcon className="h-4 w-4 text-blue-500" />;
      case 'prayer_request':
        return <HeartIcon className="h-4 w-4 text-purple-500" />;
      case 'counseling':
        return <ChatBubbleLeftRightIcon className="h-4 w-4 text-orange-500" />;
      case 'pastoral_visit':
        return <CalendarDaysIcon className="h-4 w-4 text-indigo-500" />;
      case 'care_request':
        return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <ClockIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'attendance':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'contribution':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'prayer_request':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'counseling':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'pastoral_visit':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'care_request':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatActivityType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS'
    }).format(amount);
  };

  // Group activities by type for summary
  const activitySummary = recentActivities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-100 rounded-lg">
          <ClockIcon className="h-5 w-5 text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
      </div>

      {/* Activity Summary Cards */}
      {Object.keys(activitySummary).length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {Object.entries(activitySummary).map(([type, count]) => (
            <div key={type} className={`p-3 rounded-lg border ${getActivityColor(type)}`}>
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

      {/* Recent Activities List */}
      {recentActivities.length > 0 ? (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity Timeline</h4>
          {recentActivities.slice(0, 10).map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-gray-900 truncate">
                    {activity.title}
                  </h5>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getActivityColor(activity.type)}`}>
                    {formatActivityType(activity.type)}
                  </span>
                  {activity.priority && (
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(activity.priority)}`}>
                      {activity.priority}
                    </span>
                  )}
                </div>
                
                {activity.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {activity.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <CalendarDaysIcon className="h-3 w-3" />
                    {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString()}
                  </span>
                  
                  {activity.amount && (
                    <span className="font-medium text-green-600">
                      {formatCurrency(activity.amount)}
                    </span>
                  )}
                  
                  {activity.status && (
                    <span className="capitalize">
                      {activity.status.replace('_', ' ').toLowerCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {recentActivities.length > 10 && (
            <div className="text-center pt-4">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Activities ({recentActivities.length})
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No recent activities</p>
          <p className="text-gray-400 text-xs mt-1">
            Member activities will appear here when recorded
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last Activity:</span>
            <span className="text-gray-900">
              {member.lastActivityDate 
                ? new Date(member.lastActivityDate).toLocaleDateString()
                : 'No activity'
              }
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last Attendance:</span>
            <span className="text-gray-900">
              {member.lastAttendanceDate 
                ? new Date(member.lastAttendanceDate).toLocaleDateString()
                : 'No attendance'
              }
            </span>
          </div>
        </div>
        
        {member.isRegularAttendee && (
          <div className="mt-3 flex items-center justify-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
              Regular Attendee
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitiesSection;
