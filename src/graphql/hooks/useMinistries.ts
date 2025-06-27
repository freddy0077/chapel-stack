import { useQuery } from '@apollo/client';
import { LIST_MINISTRIES } from '../queries/ministryQueries';

import { useAuth } from './useAuth';

export interface MinistryFilters {
  branchId?: string;
  [key: string]: unknown;
}

export function useMinistries(filters?: MinistryFilters) {
  // Optionally get branchId from auth if not provided
  const { user } = useAuth();
  const branchId = filters?.branchId ?? (user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id : undefined);
  const mergedFilters = { ...filters, branchId };

  const { data, loading, error, refetch } = useQuery(LIST_MINISTRIES, {
    variables: { filters: mergedFilters },
    fetchPolicy: 'cache-and-network',
  });
  return {
    ministries: data?.ministries || [],
    loading,
    error,
    refetch,
  };
}
