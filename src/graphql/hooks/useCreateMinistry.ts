import { useMutation } from "@apollo/client";
import { CREATE_MINISTRY } from "@/graphql/queries/ministryQueries";

export function useCreateMinistry() {
  const [createMinistry, { data, loading, error }] = useMutation(CREATE_MINISTRY);
  return {
    createMinistry,
    data,
    loading,
    error,
  };
}
