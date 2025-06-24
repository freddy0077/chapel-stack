import { useMutation } from "@apollo/client";
import { CREATE_BAPTISM_RECORD } from "@/graphql/mutations/sacramentalRecordsMutations";

export function useCreateBaptismRecord() {
  const [createBaptismRecord, { data, loading, error }] = useMutation(CREATE_BAPTISM_RECORD);
  return { createBaptismRecord, data, loading, error };
}
