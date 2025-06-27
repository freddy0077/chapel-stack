"use client";
import { useFilteredMinistries } from "@/graphql/hooks/useFilteredMinistries";
import { useOrganizationBranchFilter } from "@/hooks";
import type { Ministry } from "@/types/ministry";

interface MinistryLoaderProps {
  children: (ministries: Ministry[], loading: boolean, error: unknown, refetch: () => void) => React.ReactNode;
}

export function MinistryLoader({ children }: MinistryLoaderProps) {
  const orgBranchFilter = useOrganizationBranchFilter();
  
  const { ministries, loading, error, refetch } = useFilteredMinistries(orgBranchFilter);
  
  return children(ministries, loading, error, refetch);
}
