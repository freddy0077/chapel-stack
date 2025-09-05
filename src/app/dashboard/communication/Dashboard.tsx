import React, { useState, useEffect } from "react";
import { useQuery, useApolloClient } from "@apollo/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMessageStats } from "@/graphql/hooks/useMessageStats";
import { useMessages } from "@/graphql/hooks/useMessages";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import { format, subDays } from "date-fns";
import { Fragment } from "react";

// Icons
const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const SmsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
    />
  </svg>
);

const NotificationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const TemplateIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
    />
  </svg>
);

const ChartBarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

// Line chart component to show messages by date
const MessageLineChart = ({
  data,
}: {
  data: { date: string; count: number }[];
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-32 w-full flex items-center justify-center text-gray-400">
        No message data available
      </div>
    );
  }

  const maxCount = Math.max(...data.map((item) => item.count));
  const chartHeight = 80;

  return (
    <div className="relative h-32 w-full pt-2">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200 w-full"></div>
      <div className="flex items-end h-full justify-between gap-1 px-2">
        {data.slice(0, 7).map((item, index) => {
          const height = (item.count / maxCount) * chartHeight;
          const date = new Date(item.date);
          return (
            <div
              key={index}
              className="flex flex-col items-center relative"
              style={{ height: "100%", flex: "1" }}
            >
              <div
                className="w-full max-w-[24px] min-w-[12px] rounded-t-md bg-gradient-to-t from-violet-400 to-violet-600 transition-all hover:from-violet-500 hover:to-violet-700 group relative"
                style={{ height: `${height}px` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap transition-opacity z-10">
                  {item.count} messages
                </div>
              </div>
              <span className="text-[10px] text-gray-500 mt-1 truncate max-w-full">
                {format(date, "MMM d")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Status distribution component
const StatusDistribution = ({
  statusCounts,
  type,
}: {
  statusCounts: { status: string; count: number }[];
  type: "email" | "sms";
}) => {
  if (!statusCounts || statusCounts.length === 0) {
    return (
      <div className="text-gray-400 text-sm">No status data available</div>
    );
  }

  const total = statusCounts.reduce((sum, item) => sum + item.count, 0);

  // Color mapping for different status types
  const colorMap: Record<string, string> = {
    SENT: "bg-green-500",
    DELIVERED: "bg-blue-500",
    OPENED: "bg-violet-500",
    FAILED: "bg-red-500",
    BOUNCED: "bg-orange-500",
    QUEUED: "bg-yellow-500",
    SCHEDULED: "bg-indigo-500",
  };

  return (
    <div className="space-y-2">
      {statusCounts.map((item, index) => {
        const percentage =
          total > 0 ? Math.round((item.count / total) * 100) : 0;
        const bgColor = colorMap[item.status] || "bg-gray-500";

        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-gray-700">{item.status}</span>
              <span className="text-gray-600">
                {item.count} ({percentage}%)
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${bgColor}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Modal overlay and container
const Modal = ({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default function CommunicationDashboard({
  onCompose,
  onInbox,
}: {
  onCompose: () => void;
  onInbox: () => void;
}) {
  const { user } = useAuth();
  const { organisationId, branchId } = useOrganisationBranch();
  const { stats, loading: statsLoading } = useMessageStats();

  // Filter state for messages
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<string>("last7days");
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 7));
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Date filter handling
  useEffect(() => {
    const now = new Date();
    let start = new Date();
    let end = new Date();

    switch (dateFilter) {
      case "today":
        // Set to start of today
        start.setHours(0, 0, 0, 0);
        break;
      case "yesterday":
        // Set to start of yesterday
        start.setDate(start.getDate() - 1);
        start.setHours(0, 0, 0, 0);
        // Set to end of yesterday
        end.setDate(end.getDate() - 1);
        end.setHours(23, 59, 59, 999);
        break;
      case "last7days":
        // Set to 7 days ago
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        break;
      case "last30days":
      default:
        // Set to 30 days ago
        start.setDate(start.getDate() - 30);
        start.setHours(0, 0, 0, 0);
        break;
    }

    setStartDate(start);
    setEndDate(end);

    // Update the message filter for the API call
    setMessageFilter((prev) => ({
      ...prev,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    }));
  }, [dateFilter]);

  // Toggle filter items helper
  const toggleFilterItem = (
    item: string,
    selectedItems: string[],
    setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSearchQuery("");
    setDateFilter("last7days");
  };

  const hasActiveFilters =
    searchQuery ||
    selectedTypes.length > 0 ||
    selectedStatuses.length > 0 ||
    dateFilter !== "last7days";

  // Set up filter for recent messages
  const [messageFilter, setMessageFilter] = useState({
    organisationId,
    branchId,
    skip: 0,
    // take: 10, // Limit to 10 recent messages
    types: [] as string[],
    statuses: [] as string[],
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    searchQuery: "",
  });

  // Update message filter when filters change
  useEffect(() => {
    setMessageFilter((prev) => ({
      ...prev,
      types: selectedTypes,
      statuses: selectedStatuses,
      searchQuery,
    }));
  }, [selectedTypes, selectedStatuses, searchQuery]);

  const { messages, loading: messagesLoading } = useMessages(messageFilter);

  // Apply client-side filtering
  const filteredMessages = React.useMemo(() => {
    if (messagesLoading) return [];

    return messages.filter((message) => {
      // Filter by type
      if (selectedTypes.length > 0 && !selectedTypes.includes(message.type)) {
        return false;
      }

      // Filter by status
      if (
        selectedStatuses.length > 0 &&
        !selectedStatuses.includes(message.status)
      ) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const subject = message.subject?.toLowerCase() || "";
        const body = message.body?.toLowerCase() || "";
        const recipients = Array.isArray(message.recipients)
          ? message.recipients.join(" ").toLowerCase()
          : message.recipients?.toLowerCase() || "";

        if (
          !subject.includes(query) &&
          !body.includes(query) &&
          !recipients.includes(query)
        ) {
          return false;
        }
      }

      // Filter by date range
      if (message.createdAt) {
        const messageDate = new Date(message.createdAt);
        if (messageDate < startDate || messageDate > endDate) {
          return false;
        }
      }

      return true;
    });
  }, [
    messages,
    selectedTypes,
    selectedStatuses,
    searchQuery,
    startDate,
    endDate,
    messagesLoading,
  ]);

  // Pagination state for recent messages
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Messages per page

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedTypes, selectedStatuses, dateFilter, searchQuery]);

  // Compute paginated messages
  const paginatedMessages = filteredMessages.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Handler for changing page
  const handlePageChange = (page: number) => setCurrentPage(page);

  // Modal state
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = (msg: any) => {
    // Debug: Log the original message object

    // Create a copy of the message to avoid reference issues
    const messageWithType = {
      ...msg,
      // Ensure type is set based on the message properties if not already present
      type:
        msg.type ||
        (msg.__typename?.toLowerCase().includes("email")
          ? "email"
          : msg.__typename?.toLowerCase().includes("sms")
            ? "sms"
            : "notification"),
      // Ensure body is properly set based on message type
      body:
        msg.body ||
        msg.bodyText ||
        (msg.bodyHtml ? stripHtmlTags(msg.bodyHtml) : ""),
      // Make sure recipients is always an array, handling all possible cases
      recipients: Array.isArray(msg.recipients)
        ? msg.recipients
        : typeof msg.recipients === "string"
          ? [msg.recipients]
          : msg.recipientCount && !msg.recipients
            ? Array(msg.recipientCount).fill("Recipient")
            : [],
    };

    // Debug: Log the processed message object

    setSelectedMessage(messageWithType);
    setModalOpen(true);
  };

  // Helper function to strip HTML tags (similar to the one in useMessages.ts)
  const stripHtmlTags = (html?: string): string => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const client = useApolloClient();

  useEffect(() => {
    client.resetStore();
  }, [client]);

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMessage(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">
            Communication Dashboard
          </h2>
          <p className="text-gray-500 mt-1">
            Overview of your messaging activity and statistics
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={onCompose}
            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-sm hover:shadow transform hover:scale-105 transition-all"
          >
            <SendIcon /> <span className="ml-2">New Message</span>
          </Button>
          <Button
            onClick={onInbox}
            variant="outline"
            className="border-violet-300 hover:bg-violet-50 transition-colors"
          >
            View Inbox
          </Button>
        </div>
      </div>

      {/* Total Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {statsLoading ? (
          // Loading states for stats cards
          Array(3)
            .fill(0)
            .map((_, index) => (
              <Card
                key={index}
                className="p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded-full w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </Card>
            ))
        ) : (
          <>
            {/* Email Stats */}
            <Card className="relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-violet-500/10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-500 to-violet-500 rounded-full p-2.5 shadow-md">
                    <EmailIcon className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-600">
                      Email Messages
                    </h3>
                    <p className="text-3xl font-bold">
                      {stats?.totalEmailsSent?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Status Distribution
                  </h4>
                  <StatusDistribution
                    statusCounts={stats?.emailStatusCounts || []}
                    type="email"
                  />
                </div>
              </div>
            </Card>

            {/* SMS Stats */}
            <Card className="relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2.5 shadow-md">
                    <SmsIcon className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-600">
                      SMS Messages
                    </h3>
                    <p className="text-3xl font-bold">
                      {stats?.totalSmsSent?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700">
                    Status Distribution
                  </h4>
                  <StatusDistribution
                    statusCounts={stats?.smsStatusCounts || []}
                    type="sms"
                  />
                </div>
              </div>
            </Card>

            {/* Notification Stats */}
            <Card className="relative overflow-hidden group hover:shadow-md transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="relative p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-2.5 shadow-md">
                    <NotificationIcon className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-600">
                      Notifications
                    </h3>
                    <p className="text-3xl font-bold">
                      {stats?.totalNotifications?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700">
                        Active Templates
                      </h4>
                      <p className="text-2xl font-bold">
                        {stats?.activeTemplates || 0}
                      </p>
                    </div>
                    <div className="bg-amber-100 rounded-full p-2">
                      <TemplateIcon className="text-amber-600" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-2 overflow-hidden">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800">
            <ChartBarIcon className="text-violet-500" />
            Messages Over Time
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Distribution of messages sent over the past 7 days
          </p>

          {statsLoading ? (
            <div className="h-32 animate-pulse bg-gray-200 rounded"></div>
          ) : (
            <MessageLineChart data={stats?.messagesByDate || []} />
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Performance Metrics
          </h3>

          {statsLoading ? (
            <div className="space-y-6">
              {Array(2)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Delivery Rate */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium flex items-center gap-2">
                    <span className="bg-green-100 p-1 rounded-full">
                      <CheckIcon className="h-4 w-4 text-green-600" />
                    </span>
                    <span>Delivery Rate</span>
                  </h4>
                  <span className="text-lg font-bold text-gray-900">
                    {stats?.deliveryRate || 0}%
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                    style={{ width: `${stats?.deliveryRate || 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Percentage of messages successfully delivered
                </p>
              </div>

              {/* Average Response Time */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-medium flex items-center gap-2">
                    <span className="bg-blue-100 p-1 rounded-full">
                      <ClockIcon className="h-4 w-4 text-blue-600" />
                    </span>
                    <span>Avg. Response Time</span>
                  </h4>
                  <span className="text-lg font-bold text-gray-900">
                    {stats?.averageResponseTime
                      ? `${stats.averageResponseTime} min`
                      : "N/A"}
                  </span>
                </div>
                {stats?.averageResponseTime ? (
                  <>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 to-violet-600 rounded-full"
                        style={{
                          width: `${Math.min((stats?.averageResponseTime / 60) * 100, 100)}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Average time for recipients to respond
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-gray-500">
                    No response time data available
                  </p>
                )}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Recent Messages */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 w-1 h-8 rounded-full mr-3"></span>
            Recent Messages
          </h2>
          <Button
            onClick={onInbox}
            variant="outline"
            className="border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800 transition-all"
          >
            View all messages <span className="ml-1">→</span>
          </Button>
        </div>

        {/* Sophisticated Filter Card */}
        <Card className="mb-6 p-4 shadow border border-violet-100 bg-gradient-to-br from-white via-violet-50 to-white">
          <form
            className="flex flex-col gap-4 md:flex-row md:items-end md:gap-6"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            {/* Search */}
            <div className="flex-1 min-w-[180px]">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <span className="absolute left-2 top-2.5 text-gray-400">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subject or content..."
                  className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:ring-violet-500 focus:border-violet-500 text-sm bg-white shadow-sm"
                />
              </div>
            </div>

            {/* Type */}
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Type
              </label>
              <div className="flex flex-wrap gap-2">
                {["email", "sms", "notification"].map((type) => (
                  <Button
                    key={type}
                    type="button"
                    size="sm"
                    variant={
                      selectedTypes.includes(type) ? "default" : "outline"
                    }
                    className={
                      selectedTypes.includes(type)
                        ? `bg-gradient-to-r ${type === "email" ? "from-blue-500 to-violet-500" : type === "sms" ? "from-purple-500 to-pink-500" : "from-amber-500 to-orange-500"} text-white`
                        : "border-gray-300"
                    }
                    onClick={() =>
                      toggleFilterItem(type, selectedTypes, setSelectedTypes)
                    }
                  >
                    <span className="capitalize">{type}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {["SENT", "SCHEDULED", "FAILED", "DELIVERED"].map((status) => (
                  <Button
                    key={status}
                    type="button"
                    size="sm"
                    variant={
                      selectedStatuses.includes(status) ? "default" : "outline"
                    }
                    className={
                      selectedStatuses.includes(status)
                        ? `${status === "SENT" || status === "DELIVERED" ? "bg-gradient-to-r from-green-500 to-emerald-600" : status === "FAILED" ? "bg-gradient-to-r from-red-500 to-rose-600" : "bg-gradient-to-r from-violet-500 to-purple-600"} text-white`
                        : "border-gray-300"
                    }
                    onClick={() =>
                      toggleFilterItem(
                        status,
                        selectedStatuses,
                        setSelectedStatuses,
                      )
                    }
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="flex-1 min-w-[160px]">
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Date Range
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Today", value: "today" },
                  { label: "Yesterday", value: "yesterday" },
                  { label: "Last 7 Days", value: "last7days" },
                  { label: "Last 30 Days", value: "last30days" },
                ].map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    size="sm"
                    variant={
                      dateFilter === option.value ? "default" : "outline"
                    }
                    className={
                      dateFilter === option.value
                        ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
                        : "border-gray-300"
                    }
                    onClick={() => setDateFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex-none">
              <Button
                type="button"
                variant="outline"
                className={`border-gray-300 hover:bg-gray-50 ${hasActiveFilters ? "border-violet-300 text-violet-700" : ""}`}
                onClick={resetFilters}
              >
                <FilterIcon className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </form>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchQuery && (
                <Badge className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-3 py-1">
                  Search: {searchQuery}
                  <button
                    className="ml-2 hover:text-gray-200"
                    onClick={() => setSearchQuery("")}
                  >
                    ×
                  </button>
                </Badge>
              )}

              {selectedTypes.map((type) => (
                <Badge
                  key={type}
                  className={`bg-gradient-to-r ${
                    type === "email"
                      ? "from-blue-500 to-violet-500"
                      : type === "sms"
                        ? "from-purple-500 to-pink-500"
                        : "from-amber-500 to-orange-500"
                  } text-white px-3 py-1`}
                >
                  Type: {type.charAt(0).toUpperCase() + type.slice(1)}
                  <button
                    className="ml-2 hover:text-gray-200"
                    onClick={() =>
                      toggleFilterItem(type, selectedTypes, setSelectedTypes)
                    }
                  >
                    ×
                  </button>
                </Badge>
              ))}

              {selectedStatuses.map((status) => (
                <Badge
                  key={status}
                  className={`bg-gradient-to-r ${
                    status === "SENT" || status === "DELIVERED"
                      ? "from-green-500 to-emerald-600"
                      : status === "FAILED"
                        ? "from-red-500 to-rose-600"
                        : "from-violet-500 to-purple-600"
                  } text-white px-3 py-1`}
                >
                  Status: {status}
                  <button
                    className="ml-2 hover:text-gray-200"
                    onClick={() =>
                      toggleFilterItem(
                        status,
                        selectedStatuses,
                        setSelectedStatuses,
                      )
                    }
                  >
                    ×
                  </button>
                </Badge>
              ))}

              {dateFilter && (
                <Badge className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-3 py-1">
                  Date:{" "}
                  {dateFilter === "today"
                    ? "Today"
                    : dateFilter === "yesterday"
                      ? "Yesterday"
                      : dateFilter === "last7days"
                        ? "Last 7 Days"
                        : "Last 30 Days"}
                  <button
                    className="ml-2 hover:text-gray-200"
                    onClick={() => setDateFilter("last7days")}
                  >
                    ×
                  </button>
                </Badge>
              )}

              <Button
                size="sm"
                variant="ghost"
                className="text-violet-600 hover:text-violet-800 hover:bg-violet-50 px-2 py-1 h-auto"
                onClick={resetFilters}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </Card>

        {/* Messages Table Card */}
        <Card className="shadow-md overflow-hidden border border-gray-200 rounded-lg">
          {/* Table Header with Stats */}
          <div className="px-6 py-4 bg-gradient-to-r from-violet-50 to-indigo-50 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h3 className="font-medium text-gray-900">
                {!messagesLoading && filteredMessages.length > 0 && (
                  <span className="text-sm">
                    Showing{" "}
                    <span className="font-semibold">
                      {(currentPage - 1) * pageSize + 1}-
                      {Math.min(
                        currentPage * pageSize,
                        filteredMessages.length,
                      )}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">
                      {filteredMessages.length}
                    </span>{" "}
                    messages
                  </span>
                )}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-violet-200 text-violet-700 hover:bg-violet-50"
                onClick={() => setCurrentPage(1)}
              >
                <FilterIcon className="h-3.5 w-3.5 mr-1" />
                Reset View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-violet-200 text-violet-700 hover:bg-violet-50"
                onClick={onCompose}
              >
                <SendIcon className="h-3.5 w-3.5 mr-1" />
                New Message
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Subject/Content
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Channel
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sent At
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messagesLoading ? (
                  // Loading state for recent messages
                  Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <tr
                        key={index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="animate-pulse h-4 bg-gray-200 rounded w-3/4"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="animate-pulse h-6 bg-gray-200 rounded-full w-16"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="animate-pulse h-6 bg-gray-200 rounded w-14"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="animate-pulse h-4 bg-gray-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="animate-pulse h-8 bg-gray-200 rounded w-12 ml-auto"></div>
                        </td>
                      </tr>
                    ))
                ) : paginatedMessages.length > 0 ? (
                  paginatedMessages.map((message) => {
                    // Determine channel icon and color based on message type
                    let icon;
                    let iconBgClass;

                    if (message.type === "email") {
                      icon = <EmailIcon className="h-4 w-4 text-white" />;
                      iconBgClass =
                        "bg-gradient-to-br from-blue-500 to-violet-600";
                    } else if (message.type === "sms") {
                      icon = <SmsIcon className="h-4 w-4 text-white" />;
                      iconBgClass =
                        "bg-gradient-to-br from-purple-500 to-pink-600";
                    } else {
                      icon = (
                        <NotificationIcon className="h-4 w-4 text-white" />
                      );
                      iconBgClass =
                        "bg-gradient-to-br from-amber-500 to-orange-600";
                    }

                    // Set badge variant based on status
                    let badgeClass = "";
                    switch (message.status) {
                      case "SENT":
                      case "DELIVERED":
                        badgeClass =
                          "bg-gradient-to-r from-green-500 to-emerald-600 text-white";
                        break;
                      case "FAILED":
                      case "BOUNCED":
                        badgeClass =
                          "bg-gradient-to-r from-red-500 to-rose-600 text-white";
                        break;
                      case "SCHEDULED":
                        badgeClass =
                          "bg-gradient-to-r from-violet-500 to-purple-600 text-white";
                        break;
                      default:
                        badgeClass = "bg-gray-200 text-gray-800";
                    }

                    return (
                      <tr
                        key={message.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${iconBgClass}`}
                              >
                                {icon}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                {message.subject
                                  ? message.subject
                                  : message.body
                                    ? `${message.body.substring(0, 50)}...`
                                    : "No Subject"}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {message.recipients ? (
                                  <span>
                                    To:{" "}
                                    {Array.isArray(message.recipients)
                                      ? message.recipients.length
                                      : message.recipients
                                        ? 1
                                        : 0}{" "}
                                    recipient
                                    {Array.isArray(message.recipients)
                                      ? message.recipients.length !== 1
                                        ? "s"
                                        : ""
                                      : message.recipients
                                        ? ""
                                        : "s"}
                                  </span>
                                ) : message.recipientCount ? (
                                  <span>
                                    To: {message.recipientCount} recipient
                                    {message.recipientCount !== 1 ? "s" : ""}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 capitalize">
                              {message.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClass}`}
                          >
                            {message.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {message.createdAt &&
                            format(
                              new Date(message.createdAt),
                              "MMM dd, HH:mm",
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-violet-600 border-violet-200 hover:bg-violet-50 hover:scale-105 transition-all"
                            onClick={() => openModal(message)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <div className="h-16 w-16 rounded-full bg-violet-100 flex items-center justify-center mb-3">
                          <SendIcon className="h-8 w-8 text-violet-400" />
                        </div>
                        <p className="text-gray-600 font-medium">
                          No messages found
                        </p>
                        <p className="text-gray-500 text-sm mb-3">
                          Try adjusting your filters or create a new message
                        </p>
                        <Button
                          onClick={onCompose}
                          variant="default"
                          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                        >
                          Compose a new message
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {filteredMessages.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 mr-2"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from(
                  {
                    length: Math.min(
                      5,
                      Math.ceil(filteredMessages.length / pageSize),
                    ),
                  },
                  (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    const totalPages = Math.ceil(
                      filteredMessages.length / pageSize,
                    );

                    if (totalPages <= 5) {
                      // If 5 or fewer pages, show all
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // Near start
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // Near end
                      pageNum = totalPages - 4 + i;
                    } else {
                      // Middle
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        className={
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white w-8 h-8 p-0"
                            : "border-gray-300 text-gray-700 hover:bg-gray-100 w-8 h-8 p-0"
                        }
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  },
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage >= Math.ceil(filteredMessages.length / pageSize)
                }
              >
                Next
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() =>
                  handlePageChange(
                    Math.ceil(filteredMessages.length / pageSize),
                  )
                }
                disabled={
                  currentPage >= Math.ceil(filteredMessages.length / pageSize)
                }
              >
                Last
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Modal for message details */}
      <Modal open={modalOpen} onClose={closeModal}>
        {selectedMessage && (
          <Card className="overflow-hidden">
            {/* Modal Header with gradient background */}
            <div
              className={`p-6 ${
                selectedMessage.type === "email"
                  ? "bg-gradient-to-r from-blue-500 to-violet-600"
                  : selectedMessage.type === "sms"
                    ? "bg-gradient-to-r from-purple-500 to-pink-600"
                    : "bg-gradient-to-r from-amber-500 to-orange-600"
              } text-white`}
            >
              <div className="flex items-center gap-4">
                <div className="bg-white bg-opacity-20 p-2 rounded-full">
                  {selectedMessage.type === "email" ? (
                    <EmailIcon className="h-6 w-6" />
                  ) : selectedMessage.type === "sms" ? (
                    <SmsIcon className="h-6 w-6" />
                  ) : (
                    <NotificationIcon className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-white text-opacity-90 uppercase">
                    {selectedMessage.type}
                  </div>
                  <h3 className="text-xl font-bold">
                    {selectedMessage.subject || "No Subject"}
                  </h3>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Status and Timing */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge
                  className={`px-3 py-1 ${
                    selectedMessage.status === "SENT" ||
                    selectedMessage.status === "DELIVERED"
                      ? "bg-gradient-to-r from-green-500 to-emerald-600"
                      : selectedMessage.status === "FAILED" ||
                          selectedMessage.status === "BOUNCED"
                        ? "bg-gradient-to-r from-red-500 to-rose-600"
                        : "bg-gradient-to-r from-violet-500 to-purple-600"
                  } text-white`}
                >
                  {selectedMessage.status}
                </Badge>

                {selectedMessage.createdAt && (
                  <Badge
                    variant="outline"
                    className="px-3 py-1 flex items-center gap-1 border-gray-300"
                  >
                    <ClockIcon className="h-3 w-3" />
                    Sent: {format(new Date(selectedMessage.createdAt), "PPpp")}
                  </Badge>
                )}

                {selectedMessage.scheduledAt && (
                  <Badge
                    variant="outline"
                    className="px-3 py-1 flex items-center gap-1 border-gray-300"
                  >
                    <CalendarIcon className="h-3 w-3" />
                    Scheduled:{" "}
                    {format(new Date(selectedMessage.scheduledAt), "PPpp")}
                  </Badge>
                )}
              </div>

              {/* Message Content */}
              <div className="space-y-6">
                {/* Message Body */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <div className="bg-violet-100 p-1 rounded-full">
                      <TemplateIcon className="h-4 w-4 text-violet-600" />
                    </div>
                    Message Content
                  </div>
                  <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-800 whitespace-pre-line max-h-64 overflow-auto border border-gray-200">
                    {selectedMessage.body || (
                      <span className="italic text-gray-400">No content</span>
                    )}
                  </div>
                </div>

                {/* Recipients */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <div className="bg-blue-100 p-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                    </div>
                    Recipients
                  </div>
                  <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
                    {selectedMessage.recipients &&
                    Array.isArray(selectedMessage.recipients) &&
                    selectedMessage.recipients.length > 0 ? (
                      <>
                        <div className="flex flex-wrap gap-2">
                          {selectedMessage.recipients.map(
                            (recipient: string, index: number) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="px-2 py-1"
                              >
                                {/* Check if recipient is an email or UUID */}
                                {recipient.includes("@")
                                  ? recipient
                                  : recipient.length > 30
                                    ? `${recipient.substring(0, 8)}...${recipient.substring(recipient.length - 8)}`
                                    : recipient}
                              </Badge>
                            ),
                          )}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Total: {selectedMessage.recipients.length}{" "}
                          recipient(s)
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500">
                        No recipients found
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <div className="bg-green-100 p-1 rounded-full">
                      <ChartBarIcon className="h-4 w-4 text-green-600" />
                    </div>
                    Message Details
                  </div>
                  <div className="bg-gray-50 rounded-md p-4 grid grid-cols-1 md:grid-cols-2 gap-4 border border-gray-200">
                    <div>
                      <div className="text-xs text-gray-500">Message ID</div>
                      <div className="text-sm font-medium text-gray-700">
                        {selectedMessage.id || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Created By</div>
                      <div className="text-sm font-medium text-gray-700">
                        {selectedMessage.createdBy || "System"}
                      </div>
                    </div>
                    {selectedMessage.templateId && (
                      <div>
                        <div className="text-xs text-gray-500">Template</div>
                        <div className="text-sm font-medium text-gray-700">
                          {selectedMessage.templateId}
                        </div>
                      </div>
                    )}
                    {selectedMessage.metadata && (
                      <div>
                        <div className="text-xs text-gray-500">Metadata</div>
                        <div className="text-sm font-medium text-gray-700 break-words">
                          {typeof selectedMessage.metadata === "object"
                            ? JSON.stringify(selectedMessage.metadata)
                            : selectedMessage.metadata}
                        </div>
                      </div>
                    )}
                    {selectedMessage.openRate !== undefined && (
                      <div>
                        <div className="text-xs text-gray-500">Open Rate</div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-400 to-violet-500"
                              style={{ width: `${selectedMessage.openRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {selectedMessage.openRate}%
                          </span>
                        </div>
                      </div>
                    )}
                    {selectedMessage.clickRate !== undefined && (
                      <div>
                        <div className="text-xs text-gray-500">Click Rate</div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                              style={{ width: `${selectedMessage.clickRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            {selectedMessage.clickRate}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Debug Information (only visible during development) */}
                {process.env.NODE_ENV !== "production" && (
                  <div className="mt-6 p-4 border border-amber-300 bg-amber-50 rounded-md">
                    <div className="text-sm font-medium text-amber-800 mb-2">
                      Debug Information
                    </div>
                    <div className="text-xs text-amber-700 overflow-auto max-h-40">
                      <div>
                        <strong>Message Type:</strong> {selectedMessage.type}
                      </div>
                      <div>
                        <strong>Has Recipients Array:</strong>{" "}
                        {Array.isArray(selectedMessage.recipients)
                          ? "Yes"
                          : "No"}
                      </div>
                      <div>
                        <strong>Recipients Length:</strong>{" "}
                        {Array.isArray(selectedMessage.recipients)
                          ? selectedMessage.recipients.length
                          : "N/A"}
                      </div>
                      <div>
                        <strong>Recipients Data:</strong>{" "}
                        {JSON.stringify(selectedMessage.recipients)}
                      </div>
                      <div className="mt-2">
                        <strong>Full Message Data:</strong>
                      </div>
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(selectedMessage, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 mr-2"
                onClick={closeModal}
              >
                Close
              </Button>
              <Button
                className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                onClick={() => {
                  // Forward message functionality could be added here
                  closeModal();
                }}
              >
                Forward
              </Button>
            </div>
          </Card>
        )}
      </Modal>
    </div>
  );
}
