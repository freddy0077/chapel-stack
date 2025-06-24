import { useQuery } from "@apollo/client";
import { GET_BUDGETS } from "../queries/budgetQueries";

export function useBudgetReferenceData(branchId?: string, fiscalYear?: number) {
  const { data, loading, error } = useQuery(GET_BUDGETS, {
    variables: { branchId, fiscalYear },
    skip: !branchId,
  });

  return {
    budgets: data?.budgets ?? [],
    loading,
    error,
  };
}
