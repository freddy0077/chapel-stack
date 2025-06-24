import React from "react";
import { useMarriageRecords, MarriageRecord } from "@/graphql/hooks/useMarriageRecords";

interface MarriageRecordsLoaderProps {
  children: (records: MarriageRecord[], loading: boolean, error: unknown) => React.ReactNode;
}

export function MarriageRecordsLoader({ children }: MarriageRecordsLoaderProps) {
  const { records, loading, error } = useMarriageRecords();
  return <>{children(records, loading, error)}</>;
}
