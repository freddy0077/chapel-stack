"use client";

import React, { useState, useMemo } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContextEnhanced';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import {
  useFilteredSmallGroups,
  SmallGroupStatus,
  SmallGroup,
  SmallGroupFilterInput
} from '../../../graphql/hooks/useSmallGroups';

// Import components
import GroupFilters from './components/GroupFilters';
import GroupsListView from './components/GroupsListView';
import CreateGroupModal from './components/CreateGroupModal';
import GroupDetailsModal from './components/GroupDetailsModal';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import Pagination from './components/Pagination';

import DashboardHeader from '@/components/DashboardHeader';

export default function Groups() {
  const { state } = useAuth();
  const user = state.user;
  
  // Get organization/branch filter based on user role
  const orgBranchFilter = useOrganisationBranch();
  
  // State for filtering and view mode
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<SmallGroupStatus | 'ALL'>('ALL');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // 9 is good for a 3x3 grid
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [groupRefetch, setGroupRefetch] = useState<(() => void) | null>(null);

  // Prepare filters object
  const filters = useMemo(() => ({
    branchId: orgBranchFilter.branchId,
    organisationId: orgBranchFilter.organisationId,
    name: searchTerm,
    type: selectedType !== 'ALL' ? selectedType : undefined,
    status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
  }), [orgBranchFilter.branchId, orgBranchFilter.organisationId, searchTerm, selectedType, selectedStatus]);


  // Fetch filtered groups - don't skip the query, let backend handle empty filters
  const { smallGroups, loading, error, refetch } = useFilteredSmallGroups(
    filters, 
    false // Always run the query, let backend filter appropriately
  );
  
  // Save refetch for after create
  if (groupRefetch !== refetch) setGroupRefetch(() => refetch);

  // Log query results for debugging

  // Pagination calculations
  const totalGroups = smallGroups?.length || 0;
  const paginatedGroups = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return smallGroups?.slice(startIndex, endIndex) || [];
  }, [smallGroups, currentPage, itemsPerPage]);
  
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
    <>
      <DashboardHeader
        title="Groups Dashboard"
        subtitle="Manage and explore all church small groups"
      />
      <div className="max-w-7xl mx-auto py-10">
      {/* Sticky/Glassy Toolbar with Filters */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm rounded-xl px-6 py-4 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <GroupFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </div>
        <div className="flex items-center gap-3">
          {/* Add group button */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition"
          >
            <PlusIcon className="h-5 w-5" />
            Add Group
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreateGroupModal
        isOpen={isAddModalOpen}
        setIsOpen={setIsAddModalOpen}
        branchId={orgBranchFilter.branchId}
        afterCreate={() => groupRefetch && groupRefetch()}
      />
      <GroupDetailsModal isOpen={!!selectedGroupId} onClose={handleCloseDetails} group={selectedGroup} />

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
            ) : (
              <GroupsListView groups={paginatedGroups} handleGroupClick={handleGroupClick} />
            )}
          </div>
        </div>
      </div>
      
      {/* Pagination */}
      {!loading && smallGroups.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalGroups}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          hasNextPage={currentPage * itemsPerPage < totalGroups}
        />
      )}
    </div>
    </>
  );
}
