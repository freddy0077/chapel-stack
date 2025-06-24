import { useMutation } from "@apollo/client";
import { CREATE_FIRST_COMMUNION_RECORD } from "../queries/sacramentalRecordsMutations";

export function useCreateFirstCommunionRecord() {
  const [createFirstCommunionRecord, { data, loading, error }] = useMutation(CREATE_FIRST_COMMUNION_RECORD);
  return { createFirstCommunionRecord, data, loading, error };
}
