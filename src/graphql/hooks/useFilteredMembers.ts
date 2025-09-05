import { useLazyQuery } from "@apollo/client";
import { FILTERED_MEMBERS } from "../queries/recipientQueries";

export function useFilteredMembers() {
  const [fetchFiltered, { data, loading, error }] =
    useLazyQuery(FILTERED_MEMBERS);
  return {
    members: data?.filteredMembers || [],
    fetchFiltered,
    loading,
    error,
  };
}
