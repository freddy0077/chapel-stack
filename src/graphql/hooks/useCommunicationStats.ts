import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";

// Define a GraphQL query for communication stats (mocked for now)
export const GET_COMMUNICATION_STATS = gql`
  query GetCommunicationStats {
    communicationStats {
      totalEmailsSent
      totalSmsSent
      totalNotifications
      deliveryRate
      emailStatusCounts {
        status
        count
      }
      smsStatusCounts {
        status
        count
      }
      messagesByDate {
        date
        count
      }
      activeTemplates
    }
  }
`;

export interface StatusCount {
  status: string;
  count: number;
}

export interface MessageByDate {
  date: string;
  count: number;
}

export interface CommunicationStatsData {
  totalEmailsSent: number;
  totalSmsSent: number;
  totalNotifications: number;
  deliveryRate: number;
  emailStatusCounts: StatusCount[];
  smsStatusCounts: StatusCount[];
  messagesByDate: MessageByDate[];
  activeTemplates: number;
}

export function useCommunicationStats() {
  const { data, loading, error, refetch } = useQuery<{
    communicationStats: CommunicationStatsData;
  }>(GET_COMMUNICATION_STATS, {
    fetchPolicy: "cache-and-network",
  });

  return {
    stats: data?.communicationStats ?? null,
    loading,
    error,
    refetch,
  };
}
