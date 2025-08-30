import React from 'react';
import {
  BellIcon,
  CalendarDaysIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { useAnniversaryNotifications } from '@/hooks/useAnniversaryNotifications';
import { AnySacramentRecord } from '@/types/sacraments';

interface AnniversaryWidgetProps {
  records: AnySacramentRecord[];
  onViewAll?: () => void;
  className?: string;
}

/**
 * Compact Anniversary Widget for Dashboard
 * Shows a summary of today's and upcoming anniversaries
 */
export const AnniversaryWidget: React.FC<AnniversaryWidgetProps> = ({
  records,
  onViewAll,
  className = '',
}) => {
  const {
    todayNotifications,
    upcomingNotifications,
    totalCount,
  } = useAnniversaryNotifications({
    records,
    lookAheadDays: 7, // Only show next 7 days in widget
    lookBackDays: 0,  // Don't show past in widget
  });

  if (totalCount === 0) {
    return null; // Don't show widget if no anniversaries
  }

  return (
    <div className={`bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-indigo-100 rounded-lg">
            <BellIcon className="h-4 w-4 text-indigo-600" />
          </div>
          <h3 className="text-sm font-medium text-gray-900">Anniversary Reminders</h3>
          {totalCount > 0 && (
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {totalCount}
            </span>
          )}
        </div>
        
        {onViewAll && totalCount > 3 && (
          <button
            onClick={onViewAll}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
          >
            View All
            <ChevronRightIcon className="h-3 w-3 ml-1" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {/* Today's anniversaries */}
        {todayNotifications.slice(0, 2).map((notification) => (
          <div key={notification.id} className="flex items-center space-x-2 p-2 bg-white rounded-md border border-green-200">
            <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {notification.memberName}
              </p>
              <p className="text-xs text-green-700">
                {notification.yearsAgo} year{notification.yearsAgo !== 1 ? 's' : ''} today!
              </p>
            </div>
            <span className="text-xs text-green-600 font-medium">Today</span>
          </div>
        ))}

        {/* Upcoming anniversaries */}
        {upcomingNotifications.slice(0, todayNotifications.length > 0 ? 1 : 3).map((notification) => (
          <div key={notification.id} className="flex items-center space-x-2 p-2 bg-white rounded-md border border-blue-200">
            <CalendarDaysIcon className="h-3 w-3 text-blue-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {notification.memberName}
              </p>
              <p className="text-xs text-blue-700">
                {notification.yearsAgo} year{notification.yearsAgo !== 1 ? 's' : ''} in {notification.daysUntil} day{notification.daysUntil !== 1 ? 's' : ''}
              </p>
            </div>
            <span className="text-xs text-blue-600 font-medium">
              {notification.daysUntil}d
            </span>
          </div>
        ))}

        {/* Show more indicator */}
        {totalCount > 3 && (
          <div className="text-center pt-1">
            <button
              onClick={onViewAll}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
            >
              +{totalCount - 3} more anniversaries
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnniversaryWidget;
