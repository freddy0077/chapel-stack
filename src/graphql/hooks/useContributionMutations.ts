import { useMutation } from "@apollo/client";
import { CREATE_CONTRIBUTION } from "../mutations/contributionsMutations";

export function useContributionMutations() {
  const [createContribution, { data, loading, error }] = useMutation(CREATE_CONTRIBUTION);

  return {
    createContribution,
    data,
    loading,
    error,
  };
}
