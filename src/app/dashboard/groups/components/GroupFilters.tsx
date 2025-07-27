import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { SmallGroupStatus } from '../../../../graphql/hooks/useSmallGroups';
import { getGroupTypeOptions } from '@/utils/groupTypes';

interface GroupFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedType: string | 'ALL';
  setSelectedType: (type: string | 'ALL') => void;
  selectedStatus: SmallGroupStatus | 'ALL';
  setSelectedStatus: (status: SmallGroupStatus | 'ALL') => void;
}

export default function GroupFilters({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus
}: GroupFiltersProps) {
  return (
    <div className="w-full bg-white shadow-md rounded-xl px-4 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <h3 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">Small Groups</h3>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div className="relative w-full sm:w-72">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-gray-900 bg-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
        </div>
        <select
          id="type-filter"
          name="type-filter"
          className="w-full sm:w-44 rounded-lg border border-gray-200 py-2 pl-3 pr-10 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as string | 'ALL')}
        >
          <option value="ALL">All Types</option>
          {getGroupTypeOptions().map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <select
          id="status-filter"
          name="status-filter"
          className="w-full sm:w-44 rounded-lg border border-gray-200 py-2 pl-3 pr-10 text-gray-900 bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base shadow-sm"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as SmallGroupStatus | 'ALL')}
        >
          <option value="ALL">All Statuses</option>
          <option value={SmallGroupStatus.ACTIVE}>Active</option>
          <option value={SmallGroupStatus.INACTIVE}>Inactive</option>
          <option value={SmallGroupStatus.ARCHIVED}>Archived</option>
        </select>
      </div>
    </div>
  );
}
