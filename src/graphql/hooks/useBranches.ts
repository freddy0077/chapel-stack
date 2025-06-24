import { useQuery } from "@apollo/client";
import { GET_BRANCHES } from "../queries/branchQueries";

// Minimal types for the branch query
export interface BranchSetting {
  id: string;
  branchId: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface BranchStatistics {
  activeMembers: number;
  inactiveMembers: number;
  totalMembers: number;
}

export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  email?: string;
  phoneNumber?: string;
  website?: string;
  isActive: boolean;
  establishedAt?: string;
  createdAt: string;
  updatedAt: string;
  settings?: BranchSetting[];
  statistics?: BranchStatistics;
}

export interface BranchFilterInput {
  [key: string]: any;
}
export interface PaginationInput {
  page?: number;
  pageSize?: number;
}

interface UseBranchesResult {
  branches: Branch[];
  totalCount: number;
  hasNextPage: boolean;
  loading: boolean;
  error?: Error;
  refetch: () => void;
  fetchMore: any;
}

export const useBranches = (
  filter?: BranchFilterInput,
  pagination?: PaginationInput
): UseBranchesResult => {
  const { data, loading, error, refetch, fetchMore } = useQuery(GET_BRANCHES, {
    variables: {
      filter,
      pagination,
    },
    fetchPolicy: "cache-and-network",
  });

  return {
    branches: data?.branches?.items ?? [],
    totalCount: data?.branches?.totalCount ?? 0,
    hasNextPage: data?.branches?.hasNextPage ?? false,
    loading,
    error,
    refetch,
    fetchMore,
  };
};
