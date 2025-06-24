import { useLazyQuery } from "@apollo/client";
import { SEARCH_MEMBERS } from "../queries/memberQueries";
import { useEffect } from "react";

export interface SearchMember {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
}

// Accepts search string and optionally a limit, returns { members, loading, error, searchMembers }
export function useSearchMembers(query: string, limit = 8) {
  const [searchMembers, { data, loading, error }] = useLazyQuery<{ members: SearchMember[] }>(SEARCH_MEMBERS);

  useEffect(() => {
    if (query && query.length >= 2) {
      searchMembers({ variables: { search: query } });
    }
  }, [query, searchMembers]);

  return {
    members: data?.members?.slice(0, limit) ?? [],
    loading,
    error,
    searchMembers,
  };
}
