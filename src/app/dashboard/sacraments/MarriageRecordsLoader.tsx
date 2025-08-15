"use client";
import React from "react";
import { useFilteredMarriageRecords, SacramentalRecord } from "@/graphql/hooks/useFilteredSacramentalRecords";
import { useOrganizationBranchFilter } from "@/hooks";

interface MarriageRecordsLoaderProps {
  children: (records: SacramentalRecord[], loading: boolean, error: unknown, refetch: () => void) => React.ReactNode;
}

export function MarriageRecordsLoader({ children }: MarriageRecordsLoaderProps) {
  const orgBranchFilter = useOrganizationBranchFilter();
  const { records, loading, error, refetch } = useFilteredMarriageRecords(orgBranchFilter);
  return <>{children(records, loading, error, refetch)}</>;
}
