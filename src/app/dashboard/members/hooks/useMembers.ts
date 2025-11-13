import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
  GET_MEMBERS_LIST,
  GET_MEMBER_STATISTICS,
  SEARCH_MEMBERS_ENHANCED,
} from "@/graphql/queries/memberQueries";
import {
  Member,
  MemberFilters,
  MemberSearchParams,
  MemberQueryResult,
  PaginationInfo,
  SortConfig,
} from "../types/member.types";
import { useOrganisationBranch } from "../../../../hooks/useOrganisationBranch";
import { MemberFilterService } from "../services/memberFilterService";

interface UseMembersOptions {
  search?: string;
  filters?: MemberFilters;
  sort?: SortConfig;
  pageSize?: number;
  enabled?: boolean;
}

interface UseMembersReturn extends MemberQueryResult {
  refetch: () => void;
  loadMore: () => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;
  updateFilters: (filters: MemberFilters) => void;
  updateSort: (sort: SortConfig) => void;
  updateSearch: (search: string) => void;
  allMembers: Member[];
  filteredMembers: Member[];
  backendFilters: Partial<MemberFilters>;
  clientFilters: Partial<MemberFilters>;
}

export const useMembers = (
  options: UseMembersOptions = {},
): UseMembersReturn => {
  const {
    search = "",
    filters = {},
    sort = { field: "firstName", direction: "asc" },
    pageSize = 20,
    enabled = true,
  } = options;

  const { organisationId, branchId } = useOrganisationBranch();

  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [currentSearch, setCurrentSearch] = useState(search);
  const [currentFilters, setCurrentFilters] = useState(filters);
  const [currentSort, setCurrentSort] = useState(sort);

  // All filters are now backend-powered - no client-side filtering needed
  const backendFilters = useMemo(
    () => MemberFilterService.extractBackendFilters(currentFilters),
    [currentFilters],
  );

  // Build GraphQL variables for ALL filters (now all backend-supported)
  const variables = useMemo(() => {
    const vars: any = {
      organisationId,
      branchId: backendFilters.branchId || branchId,
      skip: (currentPage - 1) * currentPageSize,
      take: currentPageSize,
      ...backendFilters, // All filters are now sent to backend
    };

    // Remove undefined values to keep query clean
    Object.keys(vars).forEach((key) => {
      if (
        vars[key] === undefined ||
        vars[key] === null ||
        (Array.isArray(vars[key]) && vars[key].length === 0)
      ) {
        delete vars[key];
      }
    });

    return vars;
  }, [currentPage, currentPageSize, backendFilters, organisationId, branchId]);

  // Main query for members list
  const {
    data,
    loading,
    error,
    refetch: apolloRefetch,
    fetchMore,
  } = useQuery(GET_MEMBERS_LIST, {
    variables,
    skip: !enabled,
    notifyOnNetworkStatusChange: true,
    errorPolicy: "partial",
    fetchPolicy: "cache-and-network",
    // Ensure fresh data after mutations
    nextFetchPolicy: "cache-first",
  });

  // Search query for advanced search
  const [searchMembers, { data: searchData, loading: searchLoading }] =
    useLazyQuery(SEARCH_MEMBERS_ENHANCED, {
      errorPolicy: "partial",
    });

  // Extract all members from API (before client-side filtering)
  const allMembers = useMemo(() => {
    if (currentSearch && searchData?.searchMembers) {
      return searchData.searchMembers;
    }
    // Backend now returns paginated structure: { data, total, page, ... }
    return data?.members?.data || [];
  }, [data?.members, searchData?.searchMembers, currentSearch]);

  // Since all filtering is now server-side, members from API are the final result
  const members = allMembers;
  const filteredMembers = allMembers; // No client-side filtering needed

  const totalCount = useMemo(() => {
    if (currentSearch && searchData?.searchMembers) {
      return filteredMembers.length; // Use filtered count for search results
    }
    // Use total from paginated response, fallback to membersCount
    return data?.members?.total || data?.membersCount || 0;
  }, [
    data?.members?.total,
    data?.membersCount,
    searchData?.searchMembers,
    currentSearch,
    filteredMembers.length,
  ]);

  const pageInfo = useMemo(() => {
    const totalPages = Math.ceil(totalCount / currentPageSize);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
      currentPage,
      totalPages,
      pageSize: currentPageSize,
      totalCount,
      hasNextPage,
      hasPreviousPage,
      startCursor: ((currentPage - 1) * currentPageSize).toString(),
      endCursor: (currentPage * currentPageSize - 1).toString(),
    };
  }, [currentPage, currentPageSize, totalCount]);

  // Handlers
  const refetch = useCallback(async () => {
    // Force a fresh fetch from the server by using fetchPolicy: 'network-only'
    return await apolloRefetch(variables);
  }, [apolloRefetch, variables]);

  const loadMore = useCallback(async () => {
    if (pageInfo.hasNextPage && !loading) {
      try {
        await fetchMore({
          variables: {
            ...variables,
            skip: members.length,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              ...prev,
              members: [...prev.members, ...fetchMoreResult.members],
            };
          },
        });
      } catch (error) {
        console.error("Error loading more members:", error);
      }
    }
  }, [pageInfo.hasNextPage, loading, fetchMore, variables, members.length]);

  const goToNextPage = useCallback(() => {
    if (pageInfo.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [pageInfo.hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (pageInfo.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [pageInfo.hasPreviousPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= pageInfo.totalPages) {
        setCurrentPage(page);
      }
    },
    [pageInfo.totalPages],
  );

  const setPageSize = useCallback((size: number) => {
    setCurrentPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  }, []);

  const updateFilters = useCallback((newFilters: MemberFilters) => {
    setCurrentFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const updateSort = useCallback((newSort: SortConfig) => {
    setCurrentSort(newSort);
    setCurrentPage(1); // Reset to first page when sort changes
  }, []);

  const updateSearch = useCallback(
    (newSearch: string) => {
      setCurrentSearch(newSearch);
      setCurrentPage(1); // Reset to first page when search changes

      // If there's a search query, use the search endpoint
      if (newSearch.trim()) {
        searchMembers({
          variables: {
            query: newSearch,
            branchId: backendFilters.branchId || branchId,
            membershipStatus: currentFilters.membershipStatus?.[0],
            gender: currentFilters.gender?.[0],
            skip: 0,
            take: currentPageSize,
          },
        });
      }
    },
    [searchMembers, backendFilters, currentFilters, branchId, currentPageSize],
  );

  // Effect to update search when search prop changes
  useEffect(() => {
    if (search !== currentSearch) {
      updateSearch(search);
    }
  }, [search, currentSearch, updateSearch]);

  // Effect to update filters when filters prop changes
  useEffect(() => {
    if (JSON.stringify(filters) !== JSON.stringify(currentFilters)) {
      updateFilters(filters);
    }
  }, [filters, currentFilters, updateFilters]);

  return {
    members,
    allMembers,
    filteredMembers,
    loading: loading || searchLoading,
    error,
    totalCount,
    pageInfo,
    refetch,
    loadMore,
    hasNextPage: pageInfo.hasNextPage,
    hasPreviousPage: pageInfo.hasPreviousPage,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    setPageSize,
    updateFilters,
    updateSort,
    updateSearch,
    backendFilters,
    clientFilters: {}, // Empty since no client-side filtering
  };
};

// Hook for member statistics
export const useMemberStatistics = (
  branchId?: string,
  organisationId?: string,
) => {
  const { organisationId: currentOrganisationId, branchId: currentBranchId } =
    useOrganisationBranch();

  const { data, loading, error, refetch } = useQuery(GET_MEMBER_STATISTICS, {
    variables: {
      branchId: branchId || currentBranchId,
      organisationId: organisationId || currentOrganisationId,
    },
    pollInterval: 30000, // Refresh every 30 seconds
    errorPolicy: "partial",
  });

  return {
    statistics: data?.memberStatistics,
    loading,
    error,
    refetch,
  };
};

// Hook for single member
export const useMember = (memberId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_MEMBER_DETAILS, {
    variables: { id: memberId },
    skip: !memberId,
    errorPolicy: "partial",
  });

  return {
    member: data?.member,
    loading,
    error,
    refetch,
  };
};
