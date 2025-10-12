import { useQuery } from "@apollo/client";
import { GET_RECIPIENT_COUNT_QUERY } from "../queries/messageQueries";

interface RecipientBreakdown {
  source: string;
  name: string;
  count: number;
  id?: string;
}

interface RecipientCountData {
  totalMembers: number;
  uniqueMembers: number;
  duplicateCount: number;
  breakdown: RecipientBreakdown[];
  message?: string;
}

interface GetRecipientCountInput {
  memberIds?: string[];
  groupIds?: string[];
  filters?: string[];
  birthdayRange?: string;
  branchId?: string;
  organisationId?: string;
}

export function useRecipientCount(input: GetRecipientCountInput) {
  const { data, loading, error, refetch } = useQuery<{
    getRecipientCount: RecipientCountData;
  }>(GET_RECIPIENT_COUNT_QUERY, {
    variables: { input },
    skip:
      !input.memberIds?.length &&
      !input.groupIds?.length &&
      !input.filters?.length &&
      !input.birthdayRange,
    fetchPolicy: "network-only", // Always get fresh data
  });

  return {
    recipientCount: data?.getRecipientCount,
    loading,
    error,
    refetch,
  };
}
