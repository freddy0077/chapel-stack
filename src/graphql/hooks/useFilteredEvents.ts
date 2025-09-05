import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import { GET_EVENTS_FILTERED } from "../queries/eventQueries";
import { Event } from "../types/event";

export interface EventsFilter {
  organisationId?: string;
  branchId?: string;
  startDate?: Date;
  endDate?: Date;
  category?: string;
  [key: string]: unknown;
}

interface UseFilteredEventsResult {
  events: Event[];
  loading: boolean;
  error?: Error;
  refetch: () => void;
}

export function useFilteredEvents(
  filters?: EventsFilter,
): UseFilteredEventsResult {
  // Use new unified query that supports both organisationId and branchId
  const { branchId, organisationId, category, startDate, endDate } =
    filters || {};
  const { loading, error, data, refetch } = useQuery(GET_EVENTS_FILTERED, {
    variables: {
      branchId: branchId || null,
      organisationId: organisationId || null,
    },
    skip: !branchId && !organisationId,
    fetchPolicy: "cache-and-network",
  });

  // Client-side filtering for parameters not supported by the backend query
  const events = useMemo(() => {
    let filteredEvents = data?.events || [];

    // Filter by category if specified
    if (category && category !== "all") {
      filteredEvents = filteredEvents.filter(
        (event) => event.category === category,
      );
    }

    // Filter by date range if specified
    if (startDate || endDate) {
      filteredEvents = filteredEvents.filter((event) => {
        const eventStart = new Date(event.startDate);
        const eventEnd = new Date(event.endDate);

        if (startDate && eventEnd < startDate) return false;
        if (endDate && eventStart > endDate) return false;

        return true;
      });
    }

    return filteredEvents;
  }, [data?.events, category, startDate, endDate]);

  return { events, loading, error, refetch };
}
