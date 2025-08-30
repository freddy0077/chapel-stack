import React from 'react';
import { 
  MapPinIcon, 
  CalendarIcon, 
  UsersIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { SmallGroup, SmallGroupStatus } from '../../../../graphql/hooks/useSmallGroups';

interface GroupsTableViewProps {
  groups: SmallGroup[];
  handleGroupClick: (groupId: string) => void;
}

// Helper function to get status badge styling
const getStatusBadge = (status: SmallGroupStatus) => {
  switch (status) {
    case SmallGroupStatus.ACTIVE:
      return 'bg-green-100 text-green-800';
    case SmallGroupStatus.INACTIVE:
      return 'bg-yellow-100 text-yellow-800';
    case SmallGroupStatus.ARCHIVED:
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
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

export default function GroupsTableView({ groups, handleGroupClick }: GroupsTableViewProps) {
  return (
    <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Group Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Members
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Schedule
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groups.map((group) => (
              <tr 
                key={group.id} 
                className="hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleGroupClick(group.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-700">
                          {group.name.split(' ').map(w => w[0]).join('').substring(0,2).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {group.name}
                      </div>
                      {group.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {group.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {formatGroupType(group.type || 'OTHER')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(group.status as SmallGroupStatus)}`}>
                    {group.status === SmallGroupStatus.ACTIVE ? 'Active' : 
                     group.status === SmallGroupStatus.INACTIVE ? 'Inactive' : 'Archived'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center">
                    <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                    {group.members?.length || 0}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center max-w-xs">
                    <CalendarIcon className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {group.meetingSchedule || <span className="italic text-gray-300">Not set</span>}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center max-w-xs">
                    <MapPinIcon className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {group.location || <span className="italic text-gray-300">Not set</span>}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGroupClick(group.id);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {groups.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No groups found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or create a new group.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
