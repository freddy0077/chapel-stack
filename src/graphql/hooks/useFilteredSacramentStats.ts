import { useQuery } from '@apollo/client';
import { GET_FILTERED_SACRAMENT_STATS } from '../queries/sacramentStatsQueries';

export interface SacramentStats {
  sacramentType: string;
  count: number;
  trend?: 'up' | 'down' | 'neutral';
  percentage?: number;
  period?: string;
}

export interface SacramentStatsFilter {
  period?: string;
  branchId?: string;
  organisationId?: string;
  skip?: boolean;
}

export function useFilteredSacramentStats(filter: SacramentStatsFilter) {
  // Prepare variables, omitting properties with empty values
  const variables: { period?: string; branchId?: string } = {};
  
  if (filter.period) {
    variables.period = filter.period;
  }
  
  // For SUPER_ADMIN users with organisationId, we need to handle this differently
  // since the backend doesn't support organisationId filtering for stats yet
  // For now, we'll just use branchId if available
  if (filter.branchId) {
    variables.branchId = filter.branchId;
  }
  
  const { data, loading, error, refetch } = useQuery<{ sacramentStats: SacramentStats[] }>(
    GET_FILTERED_SACRAMENT_STATS,
    {
      variables,
      // Skip the query if explicitly requested or if we don't have any filter parameters
      skip: filter.skip || (!filter.branchId && !filter.period),
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    stats: data?.sacramentStats ?? [],
    loading,
    error,
    refetch,
  };
}
