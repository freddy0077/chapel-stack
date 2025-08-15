import { useQuery } from '@apollo/client';
import { GET_MEMBER_STATISTICS_ENHANCED } from '../queries/memberStatisticsQueries';
import type { MemberStatistics } from '../queries/memberStatisticsQueries';

export interface MemberStatisticsData {
  memberStatistics: MemberStatistics;
}

export const useMemberStatistics = (branchId?: string, organisationId?: string) => {
  const { data, loading, error, refetch } = useQuery<MemberStatisticsData>(GET_MEMBER_STATISTICS_ENHANCED, {
    variables: { branchId, organisationId },
    skip: !branchId && !organisationId,
    fetchPolicy: 'cache-and-network', // Ensure fresh data while using cache
  });

  return {
    stats: data?.memberStatistics,
    loading,
    error,
    refetch,
  };
};

// Hook for individual member dashboard
export const useMemberDashboard = (memberId: string) => {
  const { data, loading, error, refetch } = useQuery(GET_MEMBER_DASHBOARD, {
    variables: { memberId },
    skip: !memberId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    dashboard: data?.memberDashboard,
    loading,
    error,
    refetch,
  };
};
