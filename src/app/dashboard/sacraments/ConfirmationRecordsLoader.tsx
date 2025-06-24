import React from "react";
import { useConfirmationRecords, ConfirmationRecord } from "@/graphql/hooks/useConfirmationRecords";

interface ConfirmationRecordsLoaderProps {
  children: (records: ConfirmationRecord[], loading: boolean, error: unknown) => React.ReactNode;
}

export function ConfirmationRecordsLoader({ children }: ConfirmationRecordsLoaderProps) {
  const { records, loading, error } = useConfirmationRecords();
  return <>{children(records, loading, error)}</>;
}
