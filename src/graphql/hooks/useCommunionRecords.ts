import { useQuery } from "@apollo/client";
import { GET_COMMUNION_RECORDS } from "@/graphql/queries/sacramentalRecordsQueries";
import { useAuth } from "@/contexts/AuthContextEnhanced";

export interface CommunionRecord {
  id: string;
  memberId: string;
  sacramentType: string;
  dateOfSacrament: string;
  officiantName: string;
  locationOfSacrament: string;
  certificateUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export function useCommunionRecords() {
  const { user } = useAuth();
  const branchId = user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id : undefined;
  const { data, loading, error } = useQuery<{ sacramentalRecords: CommunionRecord[] }>(GET_COMMUNION_RECORDS, {
    variables: { branchId },
    fetchPolicy: "cache-and-network",
  });
  return {
    records: data?.sacramentalRecords || [],
    loading,
    error,
  };
}
