import { useMutation } from "@apollo/client";
import { CREATE_EXPENSE } from "../mutations/expenseMutations";

export function useExpenseMutations() {
  const [mutate, { data, loading, error }] = useMutation(CREATE_EXPENSE);

  return {
    createExpense: mutate,
    data,
    loading,
    error,
  };
}
