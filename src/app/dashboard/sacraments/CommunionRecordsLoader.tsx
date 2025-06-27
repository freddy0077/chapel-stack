"use client";
import React from "react";
import { useFilteredCommunionRecords, SacramentalRecord } from "@/graphql/hooks/useFilteredSacramentalRecords";
import { useOrganizationBranchFilter } from "@/hooks";

interface CommunionRecordsLoaderProps {
  children: (records: SacramentalRecord[], loading: boolean, error: unknown) => React.ReactNode;
}

export function CommunionRecordsLoader({ children }: CommunionRecordsLoaderProps) {
  const orgBranchFilter = useOrganizationBranchFilter();
  const { records, loading, error } = useFilteredCommunionRecords(orgBranchFilter);
  return <>{children(records, loading, error)}</>;
}
