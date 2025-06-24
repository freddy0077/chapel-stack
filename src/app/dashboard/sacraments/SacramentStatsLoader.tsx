"use client";
import { useSacramentStats } from "@/graphql/hooks/useSacramentStats";
import { useAuth } from "@/graphql/hooks/useAuth";

import type { SacramentStats } from "@/graphql/hooks/useSacramentStats";

interface SacramentStatsLoaderProps {
  period?: string;
  children: (stats: SacramentStats[], loading: boolean, error: unknown) => React.ReactNode;
}

export function SacramentStatsLoader({ period, children }: SacramentStatsLoaderProps) {
  const { user } = useAuth();
  const branchId = user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id : undefined;
  const { stats, loading, error } = useSacramentStats(period, branchId);
  return children(stats, loading, error);
}
