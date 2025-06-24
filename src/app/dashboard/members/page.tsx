"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useAuth } from "@/graphql/hooks/useAuth";
import { 
  useMembers, 
  MemberStatus, 
  Gender, 
  UserFilterInput, 
  PaginationInput,
  Member // This is the backend Member type
} from "@/graphql/hooks/useMember";
import { useBranchStatistics } from "@/graphql/hooks/useBranchStatistics";
import { useRouter, useSearchParams } from "next/navigation";

// Import our custom components
import PageHeader from "./components/PageHeader";
import SearchBar from "./components/SearchBar";
import { FilterButton } from "./components/AdvancedFilters";
import ExportButton from "./components/ExportButton";
import MembersStats from "./components/MembersStats";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import Pagination from "./components/Pagination";
import AddMemberModal from "./components/AddMemberModal";
import MemberDetailsModal from "./components/MemberDetailsModal";

import {
  ArrowPathIcon,
  FunnelIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";

// Interface for the UI display format

// Helper function to convert MemberStatus enum to display string
const formatMemberStatus = (status: MemberStatus): string => {
  switch (status) {
    case MemberStatus.ACTIVE: return "Active";
    case MemberStatus.INACTIVE: return "Inactive";
    case MemberStatus.PENDING: return "Pending";
    case MemberStatus.VISITOR: return "Visitor";
    case MemberStatus.FIRST_TIME_VISITOR: return "First Time Visitor";
    case MemberStatus.RETURNING_VISITOR: return "Returning Visitor";
    case MemberStatus.DECEASED: return "Deceased";
    case MemberStatus.TRANSFERRED_OUT: return "Transferred Out";
    case MemberStatus.EXCOMMUNICATED: return "Excommunicated";
    case MemberStatus.PROSPECTIVE: return "Prospective";
    default:
      return status; // Fallback, or consider 'Unknown'
  }
};
interface DisplayMember {
  id: string | number;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  memberSince: string;
  branch?: string;
  branchId?: string;
  profileImage?: string | null;
  role?: string;
  gender?: string;
  occupation?: string;
  dateOfBirth?: string;
  isActive: boolean;
  isVisitor?: boolean;
}

import DashboardHeader from '@/components/DashboardHeader';

export default function MembersRedesigned() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const memberIdFromUrl = searchParams.get("id");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(memberIdFromUrl);

  useEffect(() => {
    if (memberIdFromUrl) setSelectedMemberId(memberIdFromUrl);
  }, [memberIdFromUrl]);

  const openMemberModal = (id: string) => {
    setSelectedMemberId(id);
    router.push(`/dashboard/members?id=${id}`, { shallow: true });
  };
  const closeMemberModal = () => {
    setSelectedMemberId(null);
    router.replace(`/dashboard/members`, { shallow: true });
  };

  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const { user } = useAuth();
  const branchId = user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id : undefined;
  
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Increased to show more members in the modern grid
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Convert UI filters to GraphQL filter format
  const getGraphQLFilters = useCallback((): UserFilterInput => { // Corrected type
    const filters: UserFilterInput = { // Corrected type
      branchId,
      search: searchTerm || undefined
    };
    
    // Map status filters
    if (activeFilters.status && activeFilters.status.length > 0) {
      const statusMap: Record<string, MemberStatus> = {
        'active': MemberStatus.ACTIVE,
        'inactive': MemberStatus.INACTIVE,
        'visitor': MemberStatus.VISITOR,
        'first time visitor': MemberStatus.FIRST_TIME_VISITOR,
        'returning visitor': MemberStatus.RETURNING_VISITOR,
        'deceased': MemberStatus.DECEASED
      };
      
      // Use the first status filter (API doesn't support multiple status filters)
      const statusFilter = activeFilters.status[0].toLowerCase();
      if (statusMap[statusFilter]) {
        filters.status = statusMap[statusFilter];
      }
    }
    
    // Map gender filters
    if (activeFilters.gender && activeFilters.gender.length > 0) {
      const genderMap: Record<string, Gender> = {
        'male': Gender.MALE,
        'female': Gender.FEMALE,
        'other': Gender.OTHER,
        'prefer not to say': Gender.PREFER_NOT_TO_SAY
      };
      
      // Use the first gender filter (API doesn't support multiple gender filters)
      const genderFilter = activeFilters.gender[0].toLowerCase();
      if (genderMap[genderFilter]) {
        filters.gender = genderMap[genderFilter];
      }
    }
    
    return filters;
  }, [activeFilters, branchId, searchTerm]);
  
  // Create pagination input
  const paginationInput: PaginationInput = useMemo(() => ({
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage
  }), [itemsPerPage, currentPage]);

  // Use GraphQL hook to fetch members with server-side filtering
  const { 
    members, 
    totalCount,
    loading, 
    error, 
    refetch
  } = useMembers(
    getGraphQLFilters(),
    paginationInput
  );
  
  // Just use the members directly from the API
  const filteredMembers = useMemo(() => {
    return members || [];
  }, [members]);
  
  // Convert GraphQL members to display format - memoized to avoid recalculations
  const displayMembers: DisplayMember[] = useMemo(() => {
    if (!filteredMembers || filteredMembers.length === 0) return [];
    
    return filteredMembers.map((member: Member) => {
      const isActive = member.status === MemberStatus.ACTIVE;
      const isVisitor = member.status === MemberStatus.VISITOR || 
                        member.status === MemberStatus.FIRST_TIME_VISITOR || 
                        member.status === MemberStatus.RETURNING_VISITOR;
      
      return {
        id: member.id,
        name: `${member.firstName} ${member.lastName || ''}`.trim(),
        email: member.email || undefined,
        phone: member.phoneNumber || undefined,
        status: formatMemberStatus(member.status),
        memberSince: member.membershipDate || 'Unknown', // Corrected: use membershipDate
        branch: member.branch?.name || undefined, // Updated: use branch directly
        branchId: member.branchId || undefined, // Updated: use branchId directly
        profileImage: member.profileImageUrl || null,
        gender: member.gender,
        dateOfBirth: member.dateOfBirth,
        occupation: member.occupation,
        isActive,
        isVisitor,
      };
    });
  }, [filteredMembers]);

  // Handle search
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement> | string) => {
    const term = typeof e === 'string' ? e : e.target.value;
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page on new search
    // Server-side filtering will happen on the next render
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: Record<string, string[]>) => {
    setActiveFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
    // Server-side filtering will happen on the next render
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    setActiveFilters({});
    setSearchTerm('');
    setCurrentPage(1);
    // Server-side filtering will happen on the next render
  }, []);

  // Refresh data
  const refreshData = useCallback(() => {
    setIsRefreshing(true);
    refetch().then(() => {
      setIsRefreshing(false);
    }).catch(() => {
      setIsRefreshing(false);
    });
  }, [refetch]);

  // Fetch branch statistics from the API using our custom hook
  // If branchId is provided, it will return stats for that specific branch
  // Otherwise, it returns aggregated stats across all branches
  const { 
    selectedBranch, 
    totalStatistics: memberStats, 
    loading: statsLoading,
    error: statsError
  } = useBranchStatistics(branchId);
  
  // Use branch-specific stats if available, otherwise use aggregated stats
  const branchStats = useMemo(() => {
    if (selectedBranch) {
      return selectedBranch.statistics;
    }
    return memberStats;
  }, [selectedBranch, memberStats]);

  return (
    <>
      <DashboardHeader
        title="Members Dashboard"
        subtitle="Manage and explore all church members"
      />
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
      {/* Header section */}
      <PageHeader 
        title="Church Members" 
        description="Manage your church membership with comprehensive tools and insights"
        actionLink="/dashboard/members/new"
        actionLabel="Add member"
      />

      {/* Statistics Cards */}
      {statsLoading ? (
        <div className="mt-6 text-center">
          <p className="text-gray-500">Loading statistics...</p>
        </div>
      ) : statsError ? (
        <div className="mt-6 text-center">
          <p className="text-red-500">Error loading statistics</p>
        </div>
      ) : (
        <MembersStats 
          totalMembers={branchStats.totalMembers}
          activeMembers={branchStats.activeMembers}
          newMembersInPeriod={branchStats.newMembersInPeriod}
          inactiveMembers={branchStats.inactiveMembers}
          percentageChanges={branchStats.percentageChanges}
        />
      )}

      {/* Search and filters section */}
      <div className="mt-6 bg-white shadow-sm rounded-lg p-4 border border-gray-200">
        <div className="sm:flex sm:items-center sm:justify-between flex-wrap gap-4">
          <div className="flex-grow max-w-md">
            <SearchBar 
              value={searchTerm} 
              onChange={handleSearch} 
              placeholder="Search by name, email, or phone..."
            />
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <FilterButton 
              onFilterChange={handleFilterChange} 
              activeFilters={activeFilters} 
            />
            <ExportButton members={displayMembers} />
          </div>
        </div>

        {/* Active filters display */}
        {Object.keys(activeFilters).length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 flex items-center">
              <FunnelIcon className="h-4 w-4 mr-1" /> Active filters:
            </span>
            
            {Object.entries(activeFilters).map(([category, values]) => (
              values.map(value => (
                <span
                  key={`${category}-${value}`}
                  className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700"
                >
                  {`${category}: ${value}`}
                  <button
                    type="button"
                    className="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
                    onClick={() => {
                      const updatedFilters = { ...activeFilters };
                      updatedFilters[category] = updatedFilters[category].filter(v => v !== value);
                      if (updatedFilters[category].length === 0) {
                        delete updatedFilters[category];
                      }
                      handleFilterChange(updatedFilters);
                    }}
                  >
                    <span className="sr-only">Remove filter for {value}</span>
                    <XMarkIcon className="h-3 w-3" aria-hidden="true" />
                  </button>
                </span>
              ))
            ))}
            
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-medium text-gray-700 hover:text-indigo-600"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Status information */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{displayMembers.length}</span> of <span className="font-medium text-gray-900">{totalCount || 0}</span> {(totalCount || 0) === 1 ? 'member' : 'members'}
          {Object.keys(activeFilters).length > 0 && ' with applied filters'}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAddMemberOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            + Add Member
          </button>
          {/* Refresh button */}
          <button 
            onClick={refreshData} 
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-md border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={isRefreshing}
          >
            <ArrowPathIcon className={`h-4 w-4 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>
      
      {/* Loading state */}
      {(loading || isPageChanging) && !isRefreshing && <LoadingState />}
      
      {/* Error state */}
      {error && (
        <div className="mt-8 text-red-500 flex items-center justify-center p-4 bg-red-50 rounded-lg">
          <p>Error loading members: {error.message}</p>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && !isRefreshing && displayMembers.length === 0 && (
        <EmptyState onResetFilters={resetFilters} />
      )}
      
      {/* Members card grid view */}
      {!loading && displayMembers.length > 0 && (
        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
            {displayMembers.map((member, idx) => (
              <div key={member.id} className="">
                {/* Card UI for each member */}
                <div className="bg-white rounded-2xl shadow-lg border border-indigo-50 p-6 flex flex-col items-center hover:shadow-xl transition group">
                  {/* Profile image or initials */}
                  {member.profileImage ? (
                    <img
                      src={member.profileImage}
                      alt={member.name}
                      className="h-20 w-20 rounded-full object-cover border-4 border-indigo-100 mb-3 shadow"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700 mb-3 shadow">
                      {member.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                    </div>
                  )}
                  <div className="text-lg font-semibold text-indigo-900 group-hover:text-indigo-700 text-center">{member.name}</div>
                  <div className="text-xs text-gray-500 mb-2 text-center">{member.branch}</div>
                  <div className="flex flex-col items-center gap-1 mb-2">
                    <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-medium ${member.status === 'Active' ? 'bg-green-100 text-green-700' : member.status === 'Inactive' ? 'bg-gray-100 text-gray-500' : 'bg-indigo-50 text-indigo-700'}`}>{member.status}</span>
                    <span className="text-xs text-gray-400">Member since {member.memberSince}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className="text-indigo-500 hover:text-indigo-700 text-sm underline">Email</a>
                    )}
                    {member.phone && (
                      <a href={`tel:${member.phone}`} className="text-indigo-500 hover:text-indigo-700 text-sm underline">Call</a>
                    )}
                    <button
                      className="text-sm text-indigo-600 hover:text-indigo-900 underline ml-2"
                      onClick={() => openMemberModal(member.id)}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Pagination */}
      {!loading && displayMembers.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalItems={totalCount || 0}
            itemsPerPage={itemsPerPage}
            onPageChange={async (page) => {
              if (page === currentPage) return;
              setIsPageChanging(true);
              setCurrentPage(page);
              await refetch({
                skip: (page - 1) * itemsPerPage,
                take: itemsPerPage,
                branchId: branchId,
                ...(getGraphQLFilters() || {})
              });
              setIsPageChanging(false);
            }}
          />
        </div>
      )}
      {selectedMemberId && (
        <MemberDetailsModal memberId={selectedMemberId} onClose={closeMemberModal} />
      )}
      <AddMemberModal isOpen={addMemberOpen} onClose={() => setAddMemberOpen(false)} />
    </div>
    </>
  );
}
