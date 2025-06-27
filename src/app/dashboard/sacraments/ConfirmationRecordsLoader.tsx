"use client";
import React from "react";
import { useFilteredConfirmationRecords, SacramentalRecord } from "@/graphql/hooks/useFilteredSacramentalRecords";
import { useOrganizationBranchFilter } from "@/hooks";

interface ConfirmationRecordsLoaderProps {
  children: (records: SacramentalRecord[], loading: boolean, error: unknown) => React.ReactNode;
}

export function ConfirmationRecordsLoader({ children }: ConfirmationRecordsLoaderProps) {
  const orgBranchFilter = useOrganizationBranchFilter();
  const { records, loading, error } = useFilteredConfirmationRecords(orgBranchFilter);
  return <>{children(records, loading, error)}</>;
}
