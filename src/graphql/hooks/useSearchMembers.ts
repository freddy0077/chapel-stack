import { useQuery } from "@apollo/client";
import { SEARCH_MEMBERS } from "../queries/memberQueries";
import { useEffect } from "react";

export interface SearchMember {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
}

// Accepts search string and optionally a limit, returns { data: members, loading, error }
export function useSearchMembers(
  searchTerm: string,
  organisationId: string,
  branchId?: string,
) {
  const { data, loading, error } = useQuery(SEARCH_MEMBERS, {
    variables: { query: searchTerm, branchId },
    skip: !searchTerm || searchTerm.trim().length < 2, // Only search when we have at least 2 characters
  });

  return {
    data: data?.searchMembers || [],
    loading,
    error,
  };
}
