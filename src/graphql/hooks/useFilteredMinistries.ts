import { useQuery } from '@apollo/client';
import { LIST_MINISTRIES } from '../queries/ministryQueries';
import { useAuth } from './useAuth';

export interface MinistryFilters {
  branchId?: string;
  organisationId?: string;
  [key: string]: unknown;
}

export function useFilteredMinistries(filters?: MinistryFilters) {
  // Prepare variables, omitting properties with empty values
  const variables: { filters: { branchId?: string; organisationId?: string } } = { 
    filters: {} 
  };
  
  // Only add non-empty filter values
  if (filters?.branchId) {
    variables.filters.branchId = filters.branchId;
  }
  
  if (filters?.organisationId) {
    variables.filters.organisationId = filters.organisationId;
  }
  
  // Add any additional filters
  Object.entries(filters || {}).forEach(([key, value]) => {
    if (key !== 'branchId' && key !== 'organisationId' && value !== undefined && value !== '') {
      variables.filters[key] = value;
    }
  });

  const { data, loading, error, refetch } = useQuery(LIST_MINISTRIES, {
    variables,
    fetchPolicy: 'cache-and-network',
    // Skip the query if we don't have any filtering parameters
    skip: !filters?.branchId && !filters?.organisationId,
  });
  
  return {
    ministries: data?.ministries || [],
    loading,
    error,
    refetch,
  };
}
