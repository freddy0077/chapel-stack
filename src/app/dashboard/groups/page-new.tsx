"use client";

import React, { useState } from 'react';
import {
  Bars4Icon,
  Squares2X2Icon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../../lib/auth/authContext';
import {
  useFilteredSmallGroups,
  SmallGroupStatus,
  SmallGroup,
  SmallGroupFilterInput
} from '../../../graphql/hooks/useSmallGroups';

// Import components
import GroupFilters from './components/GroupFilters';
import GroupsGridView from './components/GroupsGridView';
import GroupsListView from './components/GroupsListView';
import CreateGroupModal from './components/CreateGroupModal';
import GroupDetailsModal from './components/GroupDetailsModal';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';

export default function Groups() {
  const { user } = useAuth();
  
  // Get branch ID from user object according to updated structure
  const branchId = user?.userBranches && user.userBranches.length > 0
    ? user.userBranches[0].branch.id
    : null;

  // State for filtering and view mode
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<SmallGroupStatus | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  
  // Prepare filters object
  const filters: SmallGroupFilterInput = { branchId: branchId || undefined };
  if (searchTerm) filters.search = searchTerm;
  if (selectedType !== 'ALL') filters.type = selectedType;
  if (selectedStatus !== 'ALL') filters.status = selectedStatus;

  // Fetch filtered groups
  const { smallGroups, loading, error } = useFilteredSmallGroups(filters);
  
  // Handle clicking on a group
  const handleGroupClick = (groupId: string) => {
    setSelectedGroupId(groupId);
  };
  
  // Close group details modal
  const handleCloseDetails = () => {
    setSelectedGroupId(null);
  };

  // Find selected group details
  const selectedGroup = selectedGroupId 
    ? smallGroups.find((group: SmallGroup) => group.id === selectedGroupId) || null 
    : null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Toolbar with filters */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <GroupFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex space-x-2">
          {/* View toggle */}
          <div className="bg-white rounded-md border border-gray-300 flex items-center">
            <button
              type="button"
              className={`p-1.5 rounded-l-md ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setViewMode('grid')}
            >
              <Squares2X2Icon className="h-5 w-5" />
              <span className="sr-only">Grid view</span>
            </button>
            <button
              type="button"
              className={`p-1.5 rounded-r-md ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              onClick={() => setViewMode('list')}
            >
              <Bars4Icon className="h-5 w-5" />
              <span className="sr-only">List view</span>
            </button>
          </div>
          
          {/* Add group button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <div className="flex items-center">
              <PlusIcon className="h-4 w-4 mr-1" />
              <span>Add Group</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {loading ? (
              <LoadingState />
            ) : error ? (
              <ErrorState error={error} />
            ) : smallGroups.length === 0 ? (
              <EmptyState setIsAddModalOpen={setIsAddModalOpen} />
            ) : viewMode === 'grid' ? (
              <GroupsGridView groups={smallGroups} handleGroupClick={handleGroupClick} />
            ) : (
              <GroupsListView groups={smallGroups} handleGroupClick={handleGroupClick} />
            )}
          </div>
        </div>
      </div>
      
      {/* Add group modal */}
      <CreateGroupModal 
        isOpen={isAddModalOpen} 
        setIsOpen={setIsAddModalOpen} 
        branchId={branchId} 
      />
      
      {/* Group details modal */}
      <GroupDetailsModal 
        isOpen={selectedGroupId !== null} 
        onClose={handleCloseDetails}
        group={selectedGroup}
      />
    </div>
  );
}
