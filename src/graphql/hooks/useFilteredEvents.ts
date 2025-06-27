import { useQuery } from '@apollo/client';
import { GET_EVENTS_FILTERED } from '../queries/eventQueries';
import { Event } from '../types/event';

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

export function useFilteredEvents(filters?: EventsFilter): UseFilteredEventsResult {
  // Use new unified query that supports both organisationId and branchId
  const { branchId, organisationId, category, startDate, endDate } = filters || {};
  const { loading, error, data, refetch } = useQuery(GET_EVENTS_FILTERED, {
    variables: {
      branchId: branchId || undefined,
      organisationId: organisationId || undefined,
      category: category || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    },
    fetchPolicy: 'cache-and-network',
  });

  const events = data?.events || [];

  return { events, loading, error, refetch };
}
