import { useQuery } from "@apollo/client";
import { GET_RECIPIENT_FILTER_COUNTS } from "../queries/recipientQueries";
import { useAuth } from "@/contexts/AuthContextEnhanced";

export interface RecipientCountInput {
  filters: string[];
  branchId?: string;
  organisationId?: string;
  contactType?: "id" | "email" | "phone";
}

export interface RecipientCountResult {
  filter: string;
  count: number;
}

export function useRecipientFilterCounts(
  filters: string[],
  options?: {
    branchId?: string;
    organisationId?: string;
    contactType?: "id" | "email" | "phone";
    skip?: boolean;
  },
) {
  const { user } = useAuth();

  // Use provided values or fallback to user context
  const organisationId = options?.organisationId || user?.organisationId;
  const branchId = options?.branchId || user?.userBranches?.[0]?.branch?.id;

  const { data, loading, error, refetch } = useQuery<{
    recipientFilterCounts: RecipientCountResult[];
  }>(GET_RECIPIENT_FILTER_COUNTS, {
    variables: {
      input: {
        filters,
        branchId,
        organisationId,
        contactType: options?.contactType,
      },
    },
    skip: options?.skip || !organisationId || filters.length === 0,
    fetchPolicy: "cache-and-network",
  });

  // Transform the array response into a more convenient object format
  const counts =
    data?.recipientFilterCounts?.reduce(
      (acc, item) => {
        acc[item.filter] = item.count;
        return acc;
      },
      {} as Record<string, number>,
    ) || {};

  return {
    counts,
    countsArray: data?.recipientFilterCounts || [],
    loading,
    error,
    refetch,
  };
}
