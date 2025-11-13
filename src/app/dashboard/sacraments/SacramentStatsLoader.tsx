"use client";
import {
  useFilteredSacramentStats,
  SacramentStats,
} from "@/graphql/hooks/useFilteredSacramentStats";
import { useOrganizationBranchFilter } from "@/hooks";
import { useAuth } from "@/contexts/AuthContextEnhanced";

interface SacramentStatsLoaderProps {
  period?: string;
  children: (
    stats: SacramentStats[],
    loading: boolean,
    error: unknown,
  ) => React.ReactNode;
}

export function SacramentStatsLoader({
  period,
  children,
}: SacramentStatsLoaderProps) {
  const { user } = useAuth();
  const orgBranchFilter = useOrganizationBranchFilter();

  // Since the backend only supports branchId filtering for sacrament stats,
  // we need to ensure we always have a branchId to filter by
  const filter = {
    period,
    // For ADMIN users, we'll use their branchId if available
    // For regular users, we'll always use their branchId
    branchId: orgBranchFilter.branchId || undefined,
  };

  // If we don't have a branchId, we can't filter the stats
  // This will happen for ADMIN users who have selected an organisation but not a branch
  const skipQuery = !filter.branchId;

  const { stats, loading, error } = useFilteredSacramentStats({
    ...filter,
    // Pass the skip flag to the hook
    skip: skipQuery,
  });

  // If we're skipping the query, return empty stats
  if (skipQuery) {
    return children([], false, null);
  }

  return children(stats, loading, error);
}
