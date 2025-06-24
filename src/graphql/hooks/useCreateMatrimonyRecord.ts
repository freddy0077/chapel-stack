import { useMutation } from "@apollo/client";
import { CREATE_MATRIMONY_RECORD } from "../queries/sacramentalRecordsMutations";

export function useCreateMatrimonyRecord() {
  const [createMatrimonyRecord, { data, loading, error }] = useMutation(CREATE_MATRIMONY_RECORD);
  return { createMatrimonyRecord, data, loading, error };
}
