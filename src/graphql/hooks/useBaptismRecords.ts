import { useQuery } from "@apollo/client";
import { GET_BAPTISM_RECORDS } from "@/graphql/queries/sacramentalRecordsQueries";
import { useAuth } from "@/contexts/AuthContextEnhanced";

export interface BaptismRecord {
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

export function useBaptismRecords() {
  const { user } = useAuth();
  const branchId = user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id : undefined;
  const { data, loading, error } = useQuery<{ sacramentalRecords: BaptismRecord[] }>(GET_BAPTISM_RECORDS, {
    variables: { branchId },
    fetchPolicy: "cache-and-network",
  });
  return {
    records: data?.sacramentalRecords || [],
    loading,
    error,
  };
}
