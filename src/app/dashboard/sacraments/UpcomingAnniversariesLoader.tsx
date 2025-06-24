"use client";
import { useUpcomingSacramentAnniversaries, UpcomingSacramentAnniversary } from "@/graphql/hooks/useUpcomingSacramentAnniversaries";
import { useAuth } from "@/graphql/hooks/useAuth";

interface UpcomingAnniversariesLoaderProps {
  limit?: number;
  children: (anniversaries: UpcomingSacramentAnniversary[], loading: boolean, error: unknown) => React.ReactNode;
}

export function UpcomingAnniversariesLoader({ limit = 5, children }: UpcomingAnniversariesLoaderProps) {
  const { user } = useAuth();
  const branchId = user?.userBranches && user.userBranches.length > 0 ? user.userBranches[0].branch.id : undefined;
  const { anniversaries, loading, error } = useUpcomingSacramentAnniversaries(limit, branchId);
  return children(anniversaries, loading, error);
}
