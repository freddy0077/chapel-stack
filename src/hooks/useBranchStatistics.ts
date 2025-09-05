import { useQuery } from "@apollo/client";
import { GET_BRANCH_STATISTICS } from "../graphql/branchStatistics";

export interface BranchStatistics {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembersInPeriod: number;
  averageWeeklyAttendance: number;
  totalFamilies?: number;
  totalMinistries?: number;
  baptismsYTD?: number;
  firstCommunionsYTD?: number;
  confirmationsYTD?: number;
  marriagesYTD?: number;
  annualBudget?: number;
  ytdIncome?: number;
  ytdExpenses?: number;
}

export interface UseBranchStatisticsProps {
  branchId: string;
}

export interface UseBranchStatisticsResult {
  statistics: BranchStatistics | undefined;
  loading: boolean;
  error: any;
  refetch: () => void;
  branchName: string | undefined;
}

export function useBranchStatistics({
  branchId,
}: UseBranchStatisticsProps): UseBranchStatisticsResult {
  const { data, loading, error, refetch } = useQuery<{
    branch: { id: string; name: string; statistics: BranchStatistics };
  }>(GET_BRANCH_STATISTICS, {
    variables: {
      branchId,
    },
    fetchPolicy: "cache-and-network",
    skip: !branchId,
  });

  return {
    statistics: data?.branch?.statistics,
    branchName: data?.branch?.name,
    loading,
    error,
    refetch,
  };
}
