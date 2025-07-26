import { useQuery } from "@apollo/client";
import { GET_CONFIRMATION_RECORDS } from "@/graphql/queries/sacramentalRecordsQueries";
import { useAuth } from "@/contexts/AuthContextEnhanced";

export interface ConfirmationRecord {
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

export function useConfirmationRecords() {
  const { user } = useAuth();
  const branchId = user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id : undefined;
  const { data, loading, error } = useQuery<{ sacramentalRecords: ConfirmationRecord[] }>(GET_CONFIRMATION_RECORDS, {
    variables: { branchId },
    fetchPolicy: "cache-and-network",
  });
  return {
    records: data?.sacramentalRecords || [],
    loading,
    error,
  };
}
