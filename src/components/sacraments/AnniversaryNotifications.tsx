import React, { useState, useEffect } from 'react';
import {
  BellIcon,
  CalendarDaysIcon,
  HeartIcon,
  SparklesIcon,
  GiftIcon,
  UserGroupIcon,
  AcademicCapIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { SACRAMENT_TYPES, SACRAMENT_DISPLAY_NAMES, SACRAMENT_COLORS } from '@/constants/sacramentTypes';
import { AnySacramentRecord, SacramentType } from '@/types/sacraments';
import { formatSacramentType } from '@/utils/sacramentHelpers';

interface AnniversaryNotification {
  id: string;
  recordId: string;
  sacramentType: SacramentType;
  memberName: string;
  memberEmail?: string;
  anniversaryDate: string;
  yearsAgo: number;
  daysUntil: number;
  isToday: boolean;
  isUpcoming: boolean;
  isPast: boolean;
  notificationSent: boolean;
  record: AnySacramentRecord;
}

interface AnniversaryNotificationsProps {
  records: AnySacramentRecord[];
  onSendNotification?: (notification: AnniversaryNotification) => Promise<void>;
  onMarkAsSent?: (notificationId: string) => Promise<void>;
  onDismiss?: (notificationId: string) => void;
  className?: string;
}

/**
 * Anniversary Notifications Component
 * Displays upcoming and current sacrament anniversaries
 */
export const AnniversaryNotifications: React.FC<AnniversaryNotificationsProps> = ({
  records,
  onSendNotification,
  onMarkAsSent,
  onDismiss,
  className = '',
}) => {
  const [notifications, setNotifications] = useState<AnniversaryNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [loading, setLoading] = useState(false);

  // Calculate anniversary notifications
  useEffect(() => {
    const calculateAnniversaries = () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      const anniversaries: AnniversaryNotification[] = [];

      records.forEach((record) => {
        const sacramentDate = new Date(record.dateOfSacrament);
        const yearsAgo = currentYear - sacramentDate.getFullYear();
        
        // Only calculate for records that are at least 1 year old
        if (yearsAgo >= 1) {
          // Calculate this year's anniversary date
          const anniversaryThisYear = new Date(
            currentYear,
            sacramentDate.getMonth(),
            sacramentDate.getDate()
          );

          // Calculate days until anniversary
          const timeDiff = anniversaryThisYear.getTime() - today.getTime();
          const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));

          // Only include anniversaries within 30 days (past or future)
          if (Math.abs(daysUntil) <= 30) {
            const memberName = record.memberName || 
              (record.member ? `${record.member.firstName} ${record.member.lastName}` : 'Unknown Member');

            anniversaries.push({
              id: `${record.id}-${currentYear}`,
              recordId: record.id,
              sacramentType: record.sacramentType,
              memberName,
              memberEmail: record.member?.email,
              anniversaryDate: anniversaryThisYear.toISOString().split('T')[0],
              yearsAgo,
              daysUntil,
              isToday: daysUntil === 0,
              isUpcoming: daysUntil > 0 && daysUntil <= 7,
              isPast: daysUntil < 0 && daysUntil >= -7,
              notificationSent: false, // This would come from backend in real implementation
              record,
            });
          }
        }
      });

      // Sort by days until anniversary
      anniversaries.sort((a, b) => a.daysUntil - b.daysUntil);
      setNotifications(anniversaries);
    };

    calculateAnniversaries();
  }, [records]);

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case 'today':
        return notification.isToday;
      case 'upcoming':
        return notification.isUpcoming;
      case 'past':
        return notification.isPast;
      default:
        return true;
    }
  });

  // Get icon for sacrament type
  const getSacramentIcon = (sacramentType: SacramentType) => {
    switch (sacramentType) {
      case SACRAMENT_TYPES.BAPTISM:
        return SparklesIcon;
      case SACRAMENT_TYPES.COMMUNION:
        return GiftIcon;
      case SACRAMENT_TYPES.CONFIRMATION:
        return HeartIcon;
      case SACRAMENT_TYPES.MARRIAGE:
        return UserGroupIcon;
      case SACRAMENT_TYPES.DIACONATE:
      case SACRAMENT_TYPES.PRIESTHOOD:
        return AcademicCapIcon;
      default:
        return CalendarDaysIcon;
    }
  };

  // Get color for sacrament type
  const getSacramentColor = (sacramentType: SacramentType) => {
    const colorMap: Record<SacramentType, string> = {
      [SACRAMENT_TYPES.BAPTISM]: 'text-blue-600 bg-blue-50',
      [SACRAMENT_TYPES.COMMUNION]: 'text-amber-600 bg-amber-50',
      [SACRAMENT_TYPES.CONFIRMATION]: 'text-purple-600 bg-purple-50',
      [SACRAMENT_TYPES.MARRIAGE]: 'text-rose-600 bg-rose-50',
      [SACRAMENT_TYPES.RECONCILIATION]: 'text-green-600 bg-green-50',
      [SACRAMENT_TYPES.ANOINTING]: 'text-indigo-600 bg-indigo-50',
      [SACRAMENT_TYPES.DIACONATE]: 'text-violet-600 bg-violet-50',
      [SACRAMENT_TYPES.PRIESTHOOD]: 'text-violet-700 bg-violet-50',
      [SACRAMENT_TYPES.RCIA]: 'text-teal-600 bg-teal-50',
    };
    return colorMap[sacramentType] || 'text-gray-600 bg-gray-50';
  };

  // Format anniversary message
  const getAnniversaryMessage = (notification: AnniversaryNotification) => {
    const { yearsAgo, daysUntil, isToday, sacramentType } = notification;
    const sacramentName = formatSacramentType(sacramentType);
    
    if (isToday) {
      return `Today marks ${yearsAgo} ${yearsAgo === 1 ? 'year' : 'years'} since their ${sacramentName}`;
    } else if (daysUntil > 0) {
      return `${daysUntil} ${daysUntil === 1 ? 'day' : 'days'} until ${yearsAgo} ${yearsAgo === 1 ? 'year' : 'years'} ${sacramentName} anniversary`;
    } else {
      return `${Math.abs(daysUntil)} ${Math.abs(daysUntil) === 1 ? 'day' : 'days'} ago was ${yearsAgo} ${yearsAgo === 1 ? 'year' : 'years'} ${sacramentName} anniversary`;
    }
  };

  // Handle sending notification
  const handleSendNotification = async (notification: AnniversaryNotification) => {
    if (!onSendNotification) return;
    
    setLoading(true);
    try {
      await onSendNotification(notification);
      // Update local state to mark as sent
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id 
            ? { ...n, notificationSent: true }
            : n
        )
      );
    } catch (error) {
      console.error('Failed to send notification:', error);
    } finally {
      setLoading(false);
    }
  };

  if (notifications.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center">
          <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Anniversary Notifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            No upcoming sacrament anniversaries in the next 30 days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BellIcon className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-medium text-gray-900">Anniversary Notifications</h3>
            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {filteredNotifications.length}
            </span>
          </div>
          
          {/* Filter buttons */}
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'today', label: 'Today' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'past', label: 'Recent' },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as any)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filter === filterOption.key
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications list */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredNotifications.map((notification) => {
          const Icon = getSacramentIcon(notification.sacramentType);
          const colorClasses = getSacramentColor(notification.sacramentType);
          
          return (
            <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3">
                {/* Sacrament icon */}
                <div className={`flex-shrink-0 p-2 rounded-lg ${colorClasses}`}>
                  <Icon className="h-5 w-5" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {notification.memberName}
                    </p>
                    <div className="flex items-center space-x-2">
                      {notification.isToday && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                          Today
                        </span>
                      )}
                      {notification.isUpcoming && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <ClockIcon className="w-3 h-3 mr-1" />
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {getAnniversaryMessage(notification)}
                  </p>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Anniversary Date: {new Date(notification.anniversaryDate).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Actions */}
                <div className="flex-shrink-0 flex items-center space-x-2">
                  {!notification.notificationSent && onSendNotification && (
                    <button
                      onClick={() => handleSendNotification(notification)}
                      disabled={loading}
                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      <BellIcon className="w-3 h-3 mr-1" />
                      Notify
                    </button>
                  )}
                  
                  {notification.notificationSent && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                      <CheckIcon className="w-3 h-3 mr-1" />
                      Sent
                    </span>
                  )}
                  
                  {onDismiss && (
                    <button
                      onClick={() => onDismiss(notification.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredNotifications.length === 0 && (
        <div className="p-6 text-center">
          <p className="text-sm text-gray-500">
            No {filter === 'all' ? '' : filter} anniversary notifications.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnniversaryNotifications;
