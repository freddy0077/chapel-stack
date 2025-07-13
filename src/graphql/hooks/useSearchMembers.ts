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

// Accepts search string and optionally a limit, returns { members, loading, error, searchMembers }
export function useSearchMembers(searchTerm: string, organisationId: string, branchId?: string) {
  const { data, loading, error } = useQuery(SEARCH_MEMBERS, {
    variables: { search: searchTerm, organisationId, branchId },
    skip: !searchTerm,
  });

  return { members: data?.members || [], loading, error };
}
