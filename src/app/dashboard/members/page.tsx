'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  MagnifyingGlassIcon, 
  PlusIcon, 
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

// Components
import MemberList from './components/MemberList';
import MemberStats from './components/MemberStats';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import AddMemberModal from './components/AddMemberModal';
import MemberDetailModal from './components/MemberDetailModal';
import EditMemberModal from './components/EditMemberModal';
import AddSacramentModal from './components/AddSacramentModal';
import BulkActionsBar from './components/BulkActionsBar';
import ViewModeToggle from './components/ViewModeToggle';
import BulkActionSelectionDialog from './components/BulkActionSelectionDialog';

// Hooks
import { useMembers } from './hooks/useMembers';
import { 
  useMemberStatistics, 
  useSearchMembers,
  useUpdateMember,
  useRemoveMember,
  useTransferMember,
  useUpdateMemberStatus,
  useRfidOperations
} from './hooks/useMemberOperations';
import { useOrganisationBranch } from '../../../hooks/useOrganisationBranch';
import { useMemberManagement } from '../../../hooks/useMemberManagement';
import { GET_ALL_SMALL_GROUPS } from '@/graphql/queries/groupQueries';
import { LIST_MINISTRIES } from '@/graphql/queries/ministryQueries';
import { GET_MEMBER } from '@/graphql/queries/memberQueries';

// Types
import { ViewMode, MemberFilters, Member, BulkActionType } from './types/member.types';

const MembersPage: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [filters, setFilters] = useState<MemberFilters>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSacramentModal, setShowSacramentModal] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showMemberDetailModal, setShowMemberDetailModal] = useState(false);
  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isSelectionDialogOpen, setIsSelectionDialogOpen] = useState(false);
  const [selectionDialogData, setSelectionDialogData] = useState<{
    actionType: BulkActionType | null;
    options: { id: string; name: string }[];
    title: string;
    label: string;
  }>({ actionType: null, options: [], title: '', label: '' });

  // Organisation and branch context
  const { organisationId, branchId } = useOrganisationBranch();

  // Members data with enhanced filtering
  const {
    members,
    loading,
    error,
    pageInfo,
    refetch,
    loadMore,
    goToNextPage,
    goToPreviousPage,
  } = useMembers({
    search: searchQuery,
    filters: {
      ...filters,
      organisationId,
      branchId
    },
    pageSize: 20
  });

  // Member operations hooks
  const { statistics, loading: statsLoading } = useMemberStatistics(branchId, organisationId);
  const { searchMembers, members: searchResults, loading: searchLoading } = useSearchMembers();
  const { updateMember, loading: updateLoading } = useUpdateMember();
  const { removeMember, loading: removeLoading } = useRemoveMember();
  const { transferMember, loading: transferLoading } = useTransferMember();
  const { updateMemberStatus, loading: statusUpdateLoading } = useUpdateMemberStatus();
  const { assignRfidCard, removeRfidCard, getMemberByRfid, loading: rfidLoading } = useRfidOperations();
  const {
    bulkUpdateMemberStatus,
    bulkDeactivateMembers,
    bulkExportMembers,
    bulkAddToGroup,
    bulkRemoveFromGroup,
    bulkAddToMinistry,
    bulkRemoveFromMinistry,
    loading: bulkLoading,
  } = useMemberManagement();

  // Group and Ministry queries
  const { data: groupsData } = useQuery(GET_ALL_SMALL_GROUPS);
  const { data: ministriesData } = useQuery(LIST_MINISTRIES);

  // Lazy query to fetch full member details on demand for the detail modal
  const [fetchMember, { data: memberDetailData, loading: memberDetailLoading, error: memberDetailError }] = useLazyQuery(GET_MEMBER);

  // Computed values
  const isLoading = loading || statsLoading;

  // Member management functions
  const handleUpdateMember = async (id: string, memberData: any) => {
    try {
      await updateMember(id, memberData);
      // Refresh data
      refetch?.();
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  // Open Edit modal with a member
  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setShowEditMemberModal(true);
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await removeMember(id);
        // Refresh data
        refetch?.();
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const handleTransferMember = async (id: string, fromBranchId: string, toBranchId: string, reason?: string) => {
    try {
      await transferMember(id, fromBranchId, toBranchId, reason);
      // Refresh data
      refetch?.();
    } catch (error) {
      console.error('Error transferring member:', error);
    }
  };

  const handleStatusUpdate = async (id: string, status: string, reason?: string) => {
    try {
      await updateMemberStatus(id, status, reason);
      // Refresh data
      refetch?.();
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };

  const handleRfidAssign = async (memberId: string, rfidCardId: string) => {
    try {
      await assignRfidCard({ memberId, rfidCardId });
      // Refresh data
      refetch?.();
    } catch (error) {
      console.error('Error assigning RFID card:', error);
    }
  };

  const handleRfidRemove = async (memberId: string) => {
    try {
      await removeRfidCard(memberId);
      // Refresh data
      refetch?.();
    } catch (error) {
      console.error('Error removing RFID card:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      try {
        await searchMembers(query, {
          branchId,
          ...filters
        });
      } catch (error) {
        console.error('Error searching members:', error);
      }
    }
  };

  // Search effect - trigger search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const selectedCount = selectedMembers.length;
  const hasSelection = selectedCount > 0;

  // Handlers
  const handleFilterChange = (newFilters: Partial<MemberFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setSelectedMembers([]); // Clear selection on filter change
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCount === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map(member => member.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedMembers([]);
  };

  const handleBulkAction = async (actionType: BulkActionType, data?: any) => {
    if (selectedMembers.length === 0) {
      toast.error('Please select at least one member.');
      return;
    }

    try {
      switch (actionType) {
        case 'recordSacrament':
          setShowSacramentModal(true);
          break;
        case 'addToGroup':
          setSelectionDialogData({
            actionType,
            options: groupsData?.smallGroups.map((g: any) => ({ id: g.id, name: g.name })) || [],
            title: 'Add Members to Group',
            label: 'Select a group',
          });
          setIsSelectionDialogOpen(true);
          break;
        case 'removeFromGroup':
          setSelectionDialogData({
            actionType,
            options: groupsData?.smallGroups.map((g: any) => ({ id: g.id, name: g.name })) || [],
            title: 'Remove Members from Group',
            label: 'Select a group',
          });
          setIsSelectionDialogOpen(true);
          break;
        case 'addToMinistry':
          setSelectionDialogData({
            actionType,
            options: ministriesData?.ministries.map((m: any) => ({ id: m.id, name: m.name })) || [],
            title: 'Add Members to Ministry',
            label: 'Select a ministry',
          });
          setIsSelectionDialogOpen(true);
          break;
        case 'removeFromMinistry':
          setSelectionDialogData({
            actionType,
            options: ministriesData?.ministries.map((m: any) => ({ id: m.id, name: m.name })) || [],
            title: 'Remove Members from Ministry',
            label: 'Select a ministry',
          });
          setIsSelectionDialogOpen(true);
          break;
        case 'updateStatus':
          const newStatus = data?.newStatus;
          if (!newStatus) {
            toast.error('Please select a new status.');
            return;
          }
          await bulkUpdateMemberStatus({
            variables: {
              bulkUpdateStatusInput: { memberIds: selectedMembers, status: newStatus },
            },
          });
          break;
        case 'export': {
          const result = await bulkExportMembers({
            variables: {
              bulkExportInput: {
                memberIds: selectedMembers,
                format: data?.format || 'CSV', // Default to CSV
              },
            },
          });

          const downloadUrl: string | undefined = result?.data?.bulkExportMembers;
          if (downloadUrl) {
            // Some backends may return the CSV content directly (not a URL). Detect and handle.
            const looksLikeUrl = /^(https?:)?\/\//i.test(downloadUrl) || downloadUrl.startsWith('/');
            const looksLikeCsv = /,/.test(downloadUrl) || /\n/.test(downloadUrl);
            if (!looksLikeUrl && looksLikeCsv) {
              try {
                // If the string is URL-encoded, decode it safely
                const maybeDecoded = decodeURIComponent(downloadUrl);
                const csvText = maybeDecoded;
                const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const inferredExt = (data?.format || 'CSV').toLowerCase();
                link.href = url;
                link.download = `members-export.${inferredExt}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                break;
              } catch {
                // Fall through to URL-based handling below
              }
            }
            try {
              // Normalize relative URLs
              const finalUrl = new URL(downloadUrl, window.location.origin).toString();

              // If the URL was constructed but actually contains CSV in the path (e.g., http://host/ID,Name,...),
              // treat it as CSV content instead of fetching.
              try {
                const u = new URL(finalUrl);
                const path = u.pathname || '';
                const pathLooksLikeCsv = /,/.test(path) || /%2C/i.test(path) || /\n/.test(path);
                if (pathLooksLikeCsv && path.length > 1) {
                  const csvText = decodeURIComponent(path.slice(1));
                  const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  const inferredExt = (data?.format || 'CSV').toLowerCase();
                  link.href = url;
                  link.download = `members-export.${inferredExt}`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  break;
                }
              } catch {}

              // Try authenticated fetch (covers protected endpoints and preserves cookies)
              const headers: Record<string, string> = {};
              // Attempt to include a bearer token if your app uses one
              const token =
                (typeof window !== 'undefined' && (localStorage.getItem('authToken') || localStorage.getItem('accessToken'))) ||
                undefined;
              if (token) headers['Authorization'] = `Bearer ${token}`;

              const resp = await fetch(finalUrl, {
                method: 'GET',
                headers,
                credentials: 'include',
              });

              if (resp.ok) {
                const blob = await resp.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                // Try to infer filename from Content-Disposition header
                const cd = resp.headers.get('Content-Disposition') || '';
                const match = cd.match(/filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i);
                const inferredExt = (data?.format || 'CSV').toLowerCase();
                const fallbackName = `members-export.${inferredExt}`;
                const filename = decodeURIComponent(match?.[1] || match?.[2] || fallbackName);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
              } else {
                // If direct fetch fails (CORS/protection), fall back to opening the URL
                window.open(finalUrl, '_blank', 'noopener');
              }
            } catch (err) {
              // As a last resort, attempt a simple anchor click
              const link = document.createElement('a');
              link.href = downloadUrl;
              const inferredExt = (data?.format || 'CSV').toLowerCase();
              link.download = `members-export.${inferredExt}`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          } else {
            toast.error('Export succeeded but no download URL was returned.');
          }
          break;
        }
        case 'deactivate':
          await bulkDeactivateMembers({ variables: { memberIds: selectedMembers } });
          break;
        default:
          toast.error('This bulk action is not yet implemented.');
      }

      if (['updateStatus', 'export', 'deactivate'].includes(actionType)) {
        toast.success('Bulk action completed successfully!');
        refetch();
        setSelectedMembers([]);
      }
    } catch (e: any) {
      toast.error(e.message || 'An error occurred.');
    }
  };

  const handleSelectionConfirm = async (selectedId: string) => {
    if (!selectionDialogData.actionType) return;

    try {
      switch (selectionDialogData.actionType) {
        case 'addToGroup':
          await bulkAddToGroup({
            variables: { bulkAddToGroupInput: { memberIds: selectedMembers, groupId: selectedId } },
          });
          break;
        case 'removeFromGroup':
          await bulkRemoveFromGroup({
            variables: { bulkRemoveFromGroupInput: { memberIds: selectedMembers, groupId: selectedId } },
          });
          break;
        case 'addToMinistry':
          await bulkAddToMinistry({
            variables: { bulkAddToMinistryInput: { memberIds: selectedMembers, ministryId: selectedId } },
          });
          break;
        case 'removeFromMinistry':
          await bulkRemoveFromMinistry({
            variables: { bulkRemoveFromMinistryInput: { memberIds: selectedMembers, ministryId: selectedId } },
          });
          break;
      }
      toast.success('Bulk action completed successfully!');
      refetch();
      setSelectedMembers([]);
    } catch (e: any) {
      toast.error(e.message || 'An error occurred during the bulk action.');
    } finally {
      setIsSelectionDialogOpen(false);
    }
  };

  const handleViewMember = (member: Member) => {
    // Open modal immediately with existing lightweight data
    setSelectedMember(member);
    setShowMemberDetailModal(true);
    // Fetch full details in the background
    if (member?.id) {
      fetchMember({ variables: { memberId: member.id } });
    }
  };

  // When full member details arrive, update the selected member in state
  useEffect(() => {
    if (memberDetailData?.member) {
      setSelectedMember(memberDetailData.member);
    }
  }, [memberDetailData]);

  // Optionally surface errors from the detail fetch
  useEffect(() => {
    if (memberDetailError) {
      console.error('Error fetching member details:', memberDetailError);
    }
  }, [memberDetailError]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Members</h3>
            <p className="text-gray-600 mb-4">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full max-w-7xl">
        {/* Header */}
        <motion.div 
          className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40"
          variants={itemVariants}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Members
                </h1>
                <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                  <span>{pageInfo.totalCount} total</span>
                  {Object.keys(filters).some(key => filters[key as keyof MemberFilters]) && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Filtered
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* View Mode Toggle */}
                <ViewModeToggle 
                  currentMode={viewMode} 
                  onModeChange={setViewMode} 
                />

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    showFilterPanel || Object.keys(filters).some(key => filters[key as keyof MemberFilters])
                      ? 'bg-blue-100 text-blue-700 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FunnelIcon className="w-5 h-5" />
                </button>

                {/* Add Member Button */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Add Member</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div variants={itemVariants}>
          <MemberStats 
            totalMembers={pageInfo.totalCount} 
            isLoading={isLoading} 
            statistics={statistics} 
          />
        </motion.div>

        {/* Main Content */}
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar - Filters */}
            <AnimatePresence>
              {showFilterPanel && (
                <motion.div
                  initial={{ opacity: 0, x: -300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -300 }}
                  className="lg:w-80 flex-shrink-0"
                >
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={handleFilterChange}
                    members={members}
                    statistics={statistics}
                    onClose={() => setShowFilterPanel(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Content Area */}
            <motion.div 
              className="flex-1 space-y-6"
              variants={itemVariants}
            >
              {/* Search and Actions Bar */}
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <SearchBar 
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search members..."
                  loading={searchLoading}
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <AdjustmentsHorizontalIcon className="h-5 w-5" />
                    Filters
                    {Object.keys(filters).some(key => filters[key as keyof MemberFilters]) && (
                      <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                        {Object.values(filters).filter(Boolean).length}
                      </span>
                    )}
                  </button>
                  
                  <ViewModeToggle 
                    currentMode={viewMode} 
                    onModeChange={setViewMode} 
                  />
                </div>
              </motion.div>

              {/* Bulk Actions Bar */}
              <AnimatePresence>
                {hasSelection && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <BulkActionsBar
                      selectedCount={selectedCount}
                      onClearSelection={handleClearSelection}
                      onBulkAction={handleBulkAction}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Member List */}
              <motion.div variants={itemVariants}>
                <MemberList
                  members={members}
                  loading={isLoading}
                  viewMode={viewMode}
                  selectedMembers={selectedMembers}
                  onSelectMember={handleSelectMember}
                  onSelectAll={handleSelectAll}
                  onViewMember={handleViewMember}
                  onEditMember={handleEditMember}
                  totalCount={pageInfo.totalCount}
                  onLoadMore={loadMore}
                  hasNextPage={pageInfo.hasNextPage}
                  hasPreviousPage={pageInfo.hasPreviousPage}
                  onNextPage={goToNextPage}
                  onPreviousPage={goToPreviousPage}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {showAddModal && (
            <AddMemberModal
              isOpen={showAddModal}
              onClose={() => setShowAddModal(false)}
              onSuccess={() => {
                refetch();
                setShowAddModal(false);
              }}
              organisationId={organisationId}
              branchId={branchId}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSacramentModal && (
            <AddSacramentModal 
              isOpen={showSacramentModal} 
              onClose={() => setShowSacramentModal(false)} 
              selectedMemberIds={selectedMembers} 
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showMemberDetailModal && selectedMember && (
            <MemberDetailModal
              isOpen={showMemberDetailModal}
              onClose={() => setShowMemberDetailModal(false)}
              member={selectedMember}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showEditMemberModal && selectedMember && (
            <EditMemberModal
              isOpen={showEditMemberModal}
              onClose={() => setShowEditMemberModal(false)}
              member={selectedMember}
              onSuccess={() => {
                refetch?.();
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isSelectionDialogOpen && (
            <BulkActionSelectionDialog
              isOpen={isSelectionDialogOpen}
              onClose={() => setIsSelectionDialogOpen(false)}
              onConfirm={handleSelectionConfirm}
              title={selectionDialogData.title}
              label={selectionDialogData.label}
              options={selectionDialogData.options}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MembersPage;
