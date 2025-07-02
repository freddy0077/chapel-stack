import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../queries/transactionQueries";

export interface Transaction {
  id: string;
  type: string;
  category?: string;
  amount: number;
  date: string;
  donor?: string;
  vendor?: string;
  status?: string;
  branchId?: string;
  organisationId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionsFilters {
  type?: string; // INCOME | EXPENSE | ...
  branchId?: string;
  organisationId?: string;
}

export function useTransactions(filters: TransactionsFilters = {}) {
  const { type, branchId, organisationId } = filters;
  const { data, loading, error, refetch } = useQuery(GET_TRANSACTIONS, {
    variables: {
      type,
      branchId,
      organisationId,
    },
    fetchPolicy: "cache-and-network",
    skip: !branchId && !organisationId, // require at least one filter
  });

  return {
    transactions: data?.transactions || [],
    loading,
    error,
    refetch,
  };
}
