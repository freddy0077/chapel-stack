import { useQuery } from "@apollo/client";
import { GET_RECIPIENT_GROUPS } from "../queries/recipientQueries";

interface RecipientGroupsFilter {
  organisationId?: string;
  branchId?: string;
}

export function useRecipientGroups(filter?: RecipientGroupsFilter) {
  const { data, loading, error } = useQuery(GET_RECIPIENT_GROUPS, {
    variables: {
      organisationId: filter?.organisationId,
      branchId: filter?.branchId,
    },
    skip: !filter?.organisationId || !filter?.branchId,
  });
  
  return {
    groups: data?.recipientGroups || [],
    loading,
    error,
  };
}
