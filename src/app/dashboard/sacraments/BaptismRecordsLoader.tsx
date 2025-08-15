"use client";
import { useFilteredBaptismRecords, SacramentalRecord } from "@/graphql/hooks/useFilteredSacramentalRecords";
import { useOrganizationBranchFilter } from "@/hooks";

interface BaptismRecordsLoaderProps {
  children: (records: SacramentalRecord[], loading: boolean, error: unknown, refetch: () => void) => React.ReactNode;
}

export function BaptismRecordsLoader({ children }: BaptismRecordsLoaderProps) {
  const orgBranchFilter = useOrganizationBranchFilter();
  const { records, loading, error, refetch } = useFilteredBaptismRecords(orgBranchFilter);
  return children(records, loading, error, refetch);
}
