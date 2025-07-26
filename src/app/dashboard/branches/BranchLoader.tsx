"use client";
import { useFilteredBranches } from "@/graphql/hooks/useFilteredBranches";
import { useOrganizationBranchFilter } from "@/hooks";
import { Branch } from "@/graphql/hooks/useBranches";
import { useAuth } from "@/contexts/AuthContextEnhanced";

interface BranchLoaderProps {
  children: (
    branches: Branch[], 
    loading: boolean, 
    error: unknown, 
    refetch: () => void,
    totalCount: number,
    hasNextPage: boolean
  ) => React.ReactNode;
  pagination?: { take?: number; skip?: number };
}

export function BranchLoader({ children, pagination }: BranchLoaderProps) {
  const { user } = useAuth();
  const orgBranchFilter = useOrganizationBranchFilter();
  
  // For branches, we only need to filter by organisationId
  // SUPER_ADMIN users will see branches filtered by organisation
  // Regular users will see only their assigned branches
  const filters = {
    // Only use organisationId if it's available (for SUPER_ADMIN users)
    ...(orgBranchFilter.organisationId ? { organisationId: orgBranchFilter.organisationId } : {})
  };
  
  const { 
    branches, 
    loading, 
    error, 
    refetch,
    totalCount,
    hasNextPage
  } = useFilteredBranches(
    Object.keys(filters).length > 0 ? filters : undefined,
    pagination
  );
  
  return children(branches, loading, error, refetch, totalCount, hasNextPage);
}
