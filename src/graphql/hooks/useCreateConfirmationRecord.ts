import { useMutation } from "@apollo/client";
import { CREATE_CONFIRMATION_RECORD } from "../queries/sacramentalRecordsMutations";

export function useCreateConfirmationRecord() {
  const [createConfirmationRecord, { data, loading, error }] = useMutation(CREATE_CONFIRMATION_RECORD);
  return { createConfirmationRecord, data, loading, error };
}
