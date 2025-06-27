import { useQuery } from '@apollo/client';
import { GET_MEMBER_STATISTICS } from '../queries/memberQueries';

export interface MemberStatisticsPeriod {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembersInPeriod: number;
  visitorsInPeriod: number;
}

export interface MemberStatisticsData {
  memberStatistics: {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    newMembersInPeriod: number;
    visitorsInPeriod: number;
    lastMonth?: MemberStatisticsPeriod;
  };
}

export const useMemberStatistics = (branchId?: string, organisationId?: string) => {
  const { data, loading, error, refetch } = useQuery<MemberStatisticsData>(GET_MEMBER_STATISTICS, {
    variables: { branchId, organisationId },
    skip: !branchId && !organisationId,
  });

  return {
    stats: data?.memberStatistics,
    loading,
    error,
    refetch,
  };
};
