import React from "react";
import { useCommunionRecords, CommunionRecord } from "@/graphql/hooks/useCommunionRecords";

interface CommunionRecordsLoaderProps {
  children: (records: CommunionRecord[], loading: boolean, error: unknown) => React.ReactNode;
}

export function CommunionRecordsLoader({ children }: CommunionRecordsLoaderProps) {
  const { records, loading, error } = useCommunionRecords();
  return <>{children(records, loading, error)}</>;
}
