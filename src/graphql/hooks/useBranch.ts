import { useQuery } from "@apollo/client";
import { GET_BRANCH } from "../queries/branchQueries";
import type { Branch } from "./useBranches";

interface UseBranchResult {
  branch?: Branch;
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export const useBranch = (branchId: string): UseBranchResult => {
  const { data, loading, error, refetch } = useQuery(GET_BRANCH, {
    variables: { branchId },
    skip: !branchId,
    fetchPolicy: "cache-and-network",
  });

  return {
    branch: data?.branch,
    loading,
    error,
    refetch,
  };
};
