import { useQuery } from '@apollo/client';
import { GET_BRANCHES } from '../queries/branchQueries';
import { BranchFilterInput, PaginationInput, Branch } from './useBranches';

export interface BranchesFilter {
  organisationId?: string;
  [key: string]: unknown;
}

interface UseFilteredBranchesResult {
  branches: Branch[];
  totalCount: number;
  hasNextPage: boolean;
  loading: boolean;
  error?: Error;
  refetch: () => void;
  fetchMore: unknown;
}

export function useFilteredBranches(
  filters?: BranchesFilter,
  pagination?: PaginationInput
): UseFilteredBranchesResult {
  // Prepare variables, omitting properties with empty values
  const variables: { 
    filter?: { organisationId?: string; [key: string]: unknown }; 
    pagination?: PaginationInput 
  } = {};
  
  // Only add filter if we have any filter values
  if (filters) {
    variables.filter = {};
    
    // Only add non-empty filter values
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        variables.filter![key] = value;
      }
    });
  }
  
  // Add pagination if provided
  if (pagination) {
    variables.pagination = pagination;
  }

  const { data, loading, error, refetch, fetchMore } = useQuery(GET_BRANCHES, {
    variables,
    fetchPolicy: 'cache-and-network',
    // Skip the query if we don't have any filtering parameters
    skip: !filters?.organisationId,
  });
  
  return {
    branches: data?.branches?.items ?? [],
    totalCount: data?.branches?.totalCount ?? 0,
    hasNextPage: data?.branches?.hasNextPage ?? false,
    loading,
    error,
    refetch,
    fetchMore,
  };
}
