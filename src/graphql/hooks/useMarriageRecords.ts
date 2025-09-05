import { useQuery } from "@apollo/client";
import { GET_MARRIAGE_RECORDS } from "@/graphql/queries/sacramentalRecordsQueries";
import { useAuth } from "@/contexts/AuthContextEnhanced";

export interface MarriageRecord {
  id: string;
  memberId: string;
  sacramentType: string;
  dateOfSacrament: string;
  locationOfSacrament: string;
  officiantName: string;
  witness1Name?: string;
  witness2Name?: string;
  certificateNumber?: string;
  certificateUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export function useMarriageRecords() {
  const { user } = useAuth();
  const branchId =
    user?.userBranches && user.userBranches.length > 0
      ? user.userBranches[0].branch.id
      : undefined;
  const { data, loading, error } = useQuery<{
    sacramentalRecords: MarriageRecord[];
  }>(GET_MARRIAGE_RECORDS, {
    variables: { branchId },
    fetchPolicy: "cache-and-network",
  });
  return {
    records: data?.sacramentalRecords || [],
    loading,
    error,
  };
}
