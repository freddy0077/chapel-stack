import { useQuery } from "@apollo/client";
import {
  ALL_MESSAGES_QUERY,
  GET_MESSAGE_BY_ID,
} from "../queries/messageQueries";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useOrganizationBranchFilter } from "./useOrganizationBranchFilter";

export interface MessageFilterInput {
  organisationId?: string;
  branchId?: string;
  type?: "email" | "sms" | "notification";
  search?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  skip?: number;
  take?: number;
}

export interface Message {
  id: string;
  type: "email" | "sms" | "notification";
  subject?: string;
  preview: string;
  recipientCount: number;
  status: string;
  sentAt?: string;
  createdAt: string;
  recipients: any[];
  body: string;
  bodyHtml?: string;
  senderEmail?: string;
  senderNumber?: string;
  templateId?: string;
}

export function useMessages(filter: MessageFilterInput) {
  const { user } = useAuth();
  const { organisationId: orgFilter, branchId: branchFilter } =
    useOrganizationBranchFilter();

  // Use filter values if provided, otherwise use values from useOrganizationBranchFilter
  // Important: Convert empty strings to undefined to avoid sending them to GraphQL
  const effectiveOrgId =
    filter.organisationId !== undefined && filter.organisationId !== ""
      ? filter.organisationId
      : orgFilter !== ""
        ? orgFilter
        : undefined;

  const effectiveBranchId =
    filter.branchId !== undefined && filter.branchId !== ""
      ? filter.branchId
      : branchFilter !== ""
        ? branchFilter
        : undefined;

  // Create a clean filter object with only defined values
  const queryFilter: Record<string, any> = {};

  // Only add properties that have actual values (not empty strings)
  if (effectiveOrgId && effectiveOrgId.trim() !== "") {
    queryFilter.organisationId = effectiveOrgId;
  }

  if (effectiveBranchId && effectiveBranchId.trim() !== "") {
    queryFilter.branchId = effectiveBranchId;
  }

  // Add other filter properties
  if (filter.type) queryFilter.types = [filter.type];
  if (filter.startDate) queryFilter.startDate = filter.startDate;
  if (filter.endDate) queryFilter.endDate = filter.endDate;

  const { data, loading, error, refetch } = useQuery(ALL_MESSAGES_QUERY, {
    variables: { filter: queryFilter },
    skip: Object.keys(queryFilter).length === 0, // Skip if we have no filter parameters
    fetchPolicy: "network-only", // Don't use cache for this query
  });

  // Transform the raw message data into a consistent format
  const transformedMessages: Message[] = (data?.allMessages || []).map(
    (msg: any) => {
      // Determine message type
      let type: "email" | "sms" | "notification";
      if ("subject" in msg) {
        type = "email";
      } else if ("body" in msg) {
        type = "sms";
      } else {
        type = "notification";
      }

      // Create preview text
      let preview = "";
      if (type === "email") {
        preview = msg.bodyText || stripHtmlTags(msg.bodyHtml) || "";
      } else if (type === "sms") {
        preview = msg.body || "";
      } else {
        preview = msg.message || "";
      }

      // Truncate preview
      preview =
        preview.length > 100 ? `${preview.substring(0, 100)}...` : preview;

      return {
        id: msg.id,
        type,
        subject: msg.subject || msg.title,
        preview,
        recipientCount: Array.isArray(msg.recipients)
          ? msg.recipients.length
          : 0,
        status: msg.status || (msg.isRead ? "Read" : "Unread"),
        sentAt: msg.sentAt,
        createdAt: msg.createdAt,
        recipients: msg.recipients || [],
        body:
          type === "email"
            ? msg.bodyText || stripHtmlTags(msg.bodyHtml)
            : type === "sms"
              ? msg.body
              : msg.message,
        bodyHtml: msg.bodyHtml,
        senderEmail: msg.senderEmail,
        senderNumber: msg.senderNumber,
        templateId: msg.templateId,
      };
    },
  );

  // Count messages by type
  const emailCount = transformedMessages.filter(
    (msg) => msg.type === "email",
  ).length;
  const smsCount = transformedMessages.filter(
    (msg) => msg.type === "sms",
  ).length;
  const notificationCount = transformedMessages.filter(
    (msg) => msg.type === "notification",
  ).length;
  const totalCount = transformedMessages.length;

  // Apply client-side pagination if needed
  const paginatedMessages =
    filter.skip !== undefined && filter.take !== undefined
      ? transformedMessages.slice(filter.skip, filter.skip + filter.take)
      : transformedMessages;

  return {
    messages: paginatedMessages,
    loading,
    error,
    refetch,
    totalCount,
    emailCount,
    smsCount,
    notificationCount,
  };
}

export function useMessageById(id: string, type: string) {
  const { data, loading, error } = useQuery(GET_MESSAGE_BY_ID, {
    variables: { id, type },
    skip: !id || !type,
  });

  return {
    message: data?.messageById,
    loading,
    error,
  };
}

// Helper function to strip HTML tags
function stripHtmlTags(html?: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "");
}
