import React from 'react';
import { 
  MapPinIcon, 
  CalendarIcon, 
  UsersIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { SmallGroup, SmallGroupStatus } from '../../../../graphql/hooks/useSmallGroups';

interface GroupsGridViewProps {
  groups: SmallGroup[];
  handleGroupClick: (groupId: string) => void;
}

// Helper function to get status presentation details
const getStatusPresentation = (status: SmallGroupStatus) => {
  switch (status) {
    case SmallGroupStatus.ACTIVE:
      return {
        badgeColor: 'bg-green-600',
        textColor: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-600'
      };
    case SmallGroupStatus.INACTIVE:
      return {
        badgeColor: 'bg-amber-500',
        textColor: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-600'
      };
    case SmallGroupStatus.ARCHIVED:
      return {
        badgeColor: 'bg-gray-400',
        textColor: 'text-gray-700',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-600'
      };
    default:
      return {
        badgeColor: 'bg-indigo-600',
        textColor: 'text-indigo-700',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-600'
      };
  }
};

// Helper function to get group type presentation
const getGroupTypeIcon = (type: string) => {
  switch (type) {
    case 'CELL':
      return 'bg-purple-100 text-purple-700';
    case 'BIBLE_STUDY':
      return 'bg-blue-100 text-blue-700';
    case 'MINISTRY':
      return 'bg-emerald-100 text-emerald-700';
    case 'COMMITTEE':
      return 'bg-amber-100 text-amber-700';
    case 'OTHER':
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

// Format group type for display
const formatGroupType = (type: string) => {
  switch (type) {
    case 'CELL': return 'Cell Group';
    case 'BIBLE_STUDY': return 'Bible Study';
    case 'MINISTRY': return 'Ministry';
    case 'COMMITTEE': return 'Committee';
    case 'OTHER':
    default: return 'Other';
  }
};

export default function GroupsGridView({ groups, handleGroupClick }: GroupsGridViewProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => {
        const { badgeColor, textColor, borderColor } = getStatusPresentation(group.status as SmallGroupStatus);
        const typeColorClass = getGroupTypeIcon(group.type || 'OTHER');
        
        return (
          <div 
            key={group.id} 
            className={`flex flex-col bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 ${borderColor} overflow-hidden cursor-pointer`}
            onClick={() => handleGroupClick(group.id)}
          >
            <div className="p-5 flex flex-col flex-grow">
              {/* Header Section with Group Name and Status */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center bg-indigo-50 ${textColor}`}>
                    <UserGroupIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 truncate">{group.name}</h3>
                    <div className="flex items-center mt-0.5">
                      <div className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeColorClass}`}>
                        {formatGroupType(group.type || 'OTHER')}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Status Indicator */}
                <div className="flex-shrink-0 relative">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${textColor} ${badgeColor}`}
                  >
                    {group.status === SmallGroupStatus.ACTIVE ? 'Active' : 
                     group.status === SmallGroupStatus.INACTIVE ? 'Inactive' : 'Archived'}
                  </span>
                </div>
              </div>
              
              {/* Description */}
              {group.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{group.description}</p>
              )}
              
              {/* Details Section */}
              <div className="space-y-3 text-sm mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center text-gray-600">
                  <UsersIcon className="h-4 w-4 mr-2.5 text-gray-400 flex-shrink-0" />
                  <span className="font-medium">{group.members?.length || 0} members</span>
                </div>
                
                {group.meetingSchedule && (
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2.5 text-gray-400 flex-shrink-0" />
                    <span>{group.meetingSchedule}</span>
                  </div>
                )}
                
                {group.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{group.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
