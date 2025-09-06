import { useQuery } from "@apollo/client";
import { GET_PASTORAL_CARE_STATS, PastoralCareStats } from "@/graphql/pastoral-care";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";

interface UsePastoralCareStatsOptions {
  skip?: boolean;
}

interface UsePastoralCareStatsReturn {
  loading: boolean;
  error: any;
  data: PastoralCareStats | undefined;
  refetch: () => void;
}

/**
 * Custom hook to fetch pastoral care statistics
 * ALWAYS includes organisationId and branchId parameters from user context
 * Following the same pattern as members queries in the codebase
 */
export const usePastoralCareStats = ({
  skip = false,
}: UsePastoralCareStatsOptions = {}): UsePastoralCareStatsReturn => {
  const { organisationId, branchId, hasAccess } = useOrganisationBranch();


  const { loading, error, data, refetch } = useQuery<{
    pastoralCareStats: PastoralCareStats;
  }>(GET_PASTORAL_CARE_STATS, {
    variables: organisationId ? {
      organisationId,
      branchId,
    } : undefined,
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    skip: skip || !organisationId, // Skip if no organisationId or explicitly skipped
    errorPolicy: "all", // Continue even if there are GraphQL errors
  });

  return {
    loading,
    error,
    data: data?.pastoralCareStats,
    refetch,
  };
};

export default usePastoralCareStats;
