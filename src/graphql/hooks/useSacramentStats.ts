import { useQuery } from "@apollo/client";
import { GET_SACRAMENT_STATS } from "../queries/sacramentStatsQueries";

export interface SacramentStats {
  sacramentType: string;
  count: number;
  trend?: "up" | "down" | "neutral";
  percentage?: number;
  period?: string;
}

export function useSacramentStats(period?: string, branchId?: string) {
  const { data, loading, error, refetch } = useQuery<{
    sacramentStats: SacramentStats[];
  }>(GET_SACRAMENT_STATS, {
    variables: { period, branchId },
    skip: !branchId,
    fetchPolicy: "cache-and-network",
  });

  return {
    stats: data?.sacramentStats ?? [],
    loading,
    error,
    refetch,
  };
}
