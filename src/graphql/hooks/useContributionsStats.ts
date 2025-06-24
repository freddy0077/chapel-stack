import { useQuery } from "@apollo/client";
import { GET_CONTRIBUTIONS_STATS } from "../queries/contributionsQueries";

export interface TrendDataPoint {
  date: string;
  amount: number;
}

export interface FundBreakdownItem {
  fundName: string;
  amount: number;
}

export interface ContributionsStatsData {
  totalAmount: number;
  contributionCount: number;
  percentChangeFromPreviousPeriod?: number;
  trendData: TrendDataPoint[];
  fundBreakdown: FundBreakdownItem[];
}

export interface UseContributionsStatsResult {
  stats: ContributionsStatsData | null;
  loading: boolean;
  error: Error | undefined;
  refetch: () => void;
}

export const useContributionsStats = (
  branchId: string
): UseContributionsStatsResult => {
  const { data, loading, error, refetch } = useQuery(GET_CONTRIBUTIONS_STATS, {
    variables: { branchId },
    skip: !branchId,
    fetchPolicy: "cache-and-network",
  });

  return {
    stats: data?.contributionStats ?? null,
    loading,
    error,
    refetch,
  };
};
