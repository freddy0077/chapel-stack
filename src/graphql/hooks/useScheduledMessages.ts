import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { useOrganizationBranchFilter } from "./useOrganizationBranchFilter";

// GraphQL query to fetch scheduled messages
const GET_SCHEDULED_MESSAGES = gql`
  query GetScheduledMessages($filter: ScheduledMessageFilterInput!) {
    scheduledMessages(filter: $filter) {
      id
      messageType
      subject
      content
      scheduledFor
      status
      recipientCount
      createdAt
      updatedAt
    }
  }
`;

// Interface for scheduled message
export interface ScheduledMessage {
  id: string;
  messageType: "EMAIL" | "SMS" | "NOTIFICATION";
  subject?: string;
  content: string;
  scheduledFor: string;
  status: "PENDING" | "SENT" | "CANCELLED" | "FAILED";
  recipientCount: number;
  createdAt: string;
  updatedAt: string;
}

// Interface for filter options
export interface ScheduledMessageFilter {
  messageType?: "EMAIL" | "SMS" | "NOTIFICATION";
  status?: "PENDING" | "SENT" | "CANCELLED" | "FAILED";
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export function useScheduledMessages(filter: ScheduledMessageFilter = {}) {
  const { organisationId, branchId } = useOrganizationBranchFilter();

  const { data, loading, error, refetch } = useQuery(GET_SCHEDULED_MESSAGES, {
    variables: {
      filter: {
        organisationId,
        branchId,
        ...filter,
      },
    },
    skip: !organisationId,
    fetchPolicy: "network-only",
  });

  // Cancel scheduled message mutation
  const [cancelScheduledMessage, { loading: cancelling }] = useMutation(gql`
    mutation CancelScheduledMessage($id: ID!) {
      cancelScheduledMessage(id: $id)
    }
  `);

  // Function to cancel a scheduled message
  const cancelMessage = async (id: string) => {
    try {
      await cancelScheduledMessage({
        variables: { id },
      });
      await refetch();
      return true;
    } catch (error) {
      console.error("Error cancelling scheduled message:", error);
      return false;
    }
  };

  return {
    scheduledMessages: data?.scheduledMessages || [],
    loading,
    error,
    refetch,
    cancelMessage,
    cancelling,
  };
}
