import { useQuery } from "@apollo/client";
import { GET_UPCOMING_SACRAMENT_ANNIVERSARIES } from "../queries/upcomingSacramentAnniversariesQueries";

export interface UpcomingSacramentAnniversary {
  name: string;
  sacramentType: string;
  anniversaryType: string;
  date: string;
  isSpecial: boolean;
  timeUntil: string;
}

export function useUpcomingSacramentAnniversaries(
  limit?: number,
  branchId?: string,
) {
  const { data, loading, error, refetch } = useQuery<{
    upcomingSacramentAnniversaries: UpcomingSacramentAnniversary[];
  }>(GET_UPCOMING_SACRAMENT_ANNIVERSARIES, {
    variables: { limit, branchId },
    skip: !branchId,
    fetchPolicy: "cache-and-network",
  });

  return {
    anniversaries: data?.upcomingSacramentAnniversaries ?? [],
    loading,
    error,
    refetch,
  };
}
