import React from 'react';
import { MapPinIcon, CalendarIcon, UsersIcon } from '@heroicons/react/20/solid';
import { SmallGroup } from '../../../../graphql/hooks/useSmallGroups';

interface GroupsListViewProps {
  groups: SmallGroup[];
  handleGroupClick: (groupId: string) => void;
}

export default function GroupsListView({ groups, handleGroupClick }: GroupsListViewProps) {
  return (
    <ul className="space-y-4">
      {groups.map((group) => (
        <li
          key={group.id}
          onClick={() => handleGroupClick(group.id)}
          className="group relative flex flex-col md:flex-row items-start md:items-center gap-4 rounded-xl border border-gray-100 bg-white/90 shadow-sm hover:shadow-lg hover:bg-indigo-50 transition cursor-pointer p-6 focus-within:ring-2 focus-within:ring-indigo-500"
          tabIndex={0}
          aria-label={`View details for group ${group.name}`}
        >
          {/* Status badge */}
          <span className={`absolute top-4 right-4 md:static md:ml-auto inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
            group.status === 'ACTIVE'
              ? 'bg-green-50 text-green-700 ring-green-200'
              : 'bg-gray-100 text-gray-500 ring-gray-300'
          }`}>
            {group.status === 'ACTIVE' ? 'Active' : 'Inactive'}
          </span>

          {/* Main info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
              {group.name}
              <span className="ml-2 text-xs font-medium text-indigo-500 bg-indigo-50 rounded px-2 py-0.5">
                {group.type}
              </span>
            </h3>
            {group.description && (
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{group.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <UsersIcon className="h-4 w-4 text-gray-400" />
                <span>{group.members?.length || 0} member{(group.members?.length || 0) === 1 ? '' : 's'}</span>
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span>{group.meetingSchedule ? group.meetingSchedule : <span className="italic text-gray-300">No schedule</span>}</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPinIcon className="h-4 w-4 text-gray-400" />
                <span>{group.location ? group.location : <span className="italic text-gray-300">No location</span>}</span>
              </span>
            </div>
          </div>
          {/* Optional: Add a right arrow or action button for affordance */}
          <div className="hidden md:flex items-center">
            <button
              className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
              tabIndex={-1}
            >
              View
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
