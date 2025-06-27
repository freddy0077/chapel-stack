"use client";
import { useFilteredBaptismRecords, SacramentalRecord } from "@/graphql/hooks/useFilteredSacramentalRecords";
import { useOrganizationBranchFilter } from "@/hooks";

interface BaptismRecordsLoaderProps {
  children: (records: SacramentalRecord[], loading: boolean, error: unknown) => React.ReactNode;
}

export function BaptismRecordsLoader({ children }: BaptismRecordsLoaderProps) {
  const orgBranchFilter = useOrganizationBranchFilter();
  const { records, loading, error } = useFilteredBaptismRecords(orgBranchFilter);
  return children(records, loading, error);
}
