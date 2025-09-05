import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client";
import {
  ADVANCED_MEMBERS_QUERY,
  SEARCH_MEMBERS_QUERY,
  MemberQueryVariables,
  SearchMemberQueryVariables,
  Member,
  MemberQueryResult,
  SearchMemberQueryResult,
} from "../queries/advancedPaginationQueries";

interface UseAdvancedPaginationProps {
  initialPageSize?: number;
  organisationId?: string;
  branchId?: string;
}

interface UseAdvancedPaginationReturn {
  // Data
  members: Member[];
  pageInfo: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  loading: boolean;
  error: any;

  // Pagination controls
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Filtering controls
  setSearch: (search: string) => void;
  clearFilters: () => void;

  // State
  currentFilters: Partial<MemberQueryVariables>;
  pageSize: number;

  // Actions
  refetch: () => void;
}

export const useAdvancedPagination = ({
  initialPageSize = 20,
  organisationId,
  branchId,
}: UseAdvancedPaginationProps = {}): UseAdvancedPaginationReturn => {
  // State management
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [currentFilters, setCurrentFilters] = useState<MemberQueryVariables>({
    organisationId,
    branchId,
  });
  const [searchQuery, setSearchQuery] = useState("");

  // Build query input
  const queryInput = useMemo(
    (): MemberQueryVariables => ({
      ...currentFilters,
      skip: 0,
      take: pageSize,
    }),
    [currentFilters, pageSize],
  );

  // Execute query
  const { data, loading, error, refetch } = useQuery<
    MemberQueryResult,
    MemberQueryVariables
  >(ADVANCED_MEMBERS_QUERY, {
    variables: queryInput,
    errorPolicy: "all",
  });

  // Execute search query
  const searchQueryInput = useMemo(
    (): SearchMemberQueryVariables => ({
      query: searchQuery,
      ...currentFilters,
      skip: 0,
      take: pageSize,
    }),
    [searchQuery, currentFilters, pageSize],
  );

  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
  } = useQuery<SearchMemberQueryResult, SearchMemberQueryVariables>(
    SEARCH_MEMBERS_QUERY,
    {
      variables: searchQueryInput,
      errorPolicy: "all",
      skip: !searchQuery,
    },
  );

  // Extract data
  const members = searchQuery
    ? searchData?.searchMembers || []
    : data?.members || [];
  const totalCount = data?.membersCount || 0;

  // Calculate pagination info based on skip/take
  const currentPage =
    Math.floor((queryInput.skip || 0) / (queryInput.take || 10)) + 1;
  const totalPages = Math.ceil(totalCount / (queryInput.take || 10));
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Pagination controls
  const goToNextPage = useCallback(() => {
    setPageSizeState(pageSize + 10);
  }, [pageSize]);

  const goToPreviousPage = useCallback(() => {
    setPageSizeState(pageSize - 10);
  }, [pageSize]);

  const goToPage = useCallback((page: number) => {
    setPageSizeState(page * 10);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
  }, []);

  // Filtering controls
  const setSearch = useCallback((search: string) => {
    setSearchQuery(search);
  }, []);

  const clearFilters = useCallback(() => {
    setCurrentFilters({
      organisationId,
      branchId,
    });
  }, [organisationId, branchId]);

  return {
    // Data
    members,
    pageInfo: {
      totalCount,
      currentPage,
      totalPages,
      hasNextPage,
      hasPreviousPage,
    },
    loading: loading || searchLoading,
    error: error || searchError,

    // Pagination controls
    goToNextPage,
    goToPreviousPage,
    goToPage,
    setPageSize,

    // Filtering controls
    setSearch,
    clearFilters,

    // State
    currentFilters,
    pageSize,

    // Actions
    refetch,
  };
};
