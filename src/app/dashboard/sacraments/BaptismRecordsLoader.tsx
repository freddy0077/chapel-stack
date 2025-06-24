"use client";
import { useBaptismRecords, BaptismRecord } from "@/graphql/hooks/useBaptismRecords";

interface BaptismRecordsLoaderProps {
  children: (records: BaptismRecord[], loading: boolean, error: unknown) => React.ReactNode;
}

export function BaptismRecordsLoader({ children }: BaptismRecordsLoaderProps) {
  const { records, loading, error } = useBaptismRecords();
  return children(records, loading, error);
}
