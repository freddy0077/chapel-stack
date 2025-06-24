import { useMemo, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_EVENTS,
  GET_EVENT,
  GET_EVENTS_BY_DATE_RANGE,
  GET_BRANCHES,
  GET_ROOMS,
  GET_VOLUNTEER_ROLES,
GET_EVENTS_BY_BRANCH
} from '../queries/eventQueries';
import {
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  CREATE_EVENT_REGISTRATION,
  CHECK_IN_ATTENDEE,
  CHECK_OUT_ATTENDEE,
  DELETE_EVENT_REGISTRATION
} from '../mutations/eventMutations';
import { 
  Event, 
  CreateEventInput,
  CreateEventRegistrationInput
} from '../types/event';

/**
 * Hook for fetching events by branchId
 */
export const useBranchEvents = (branchId?: string) => {
  const { loading, error, data, refetch } = useQuery(GET_EVENTS_BY_BRANCH, {
    variables: { branchId },
    skip: !branchId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    loading,
    error,
    events: data?.events || [],
    refetch,
  };
};

/**
 * Hook for fetching events
 */
export const useEvents = () => {
  const { loading, error, data, refetch } = useQuery(GET_EVENTS, {
    fetchPolicy: 'cache-and-network'
  });

  return {
    loading,
    error,
    events: data?.events || [],
    refetch
  };
};

/**
 * Hook for fetching events within a specific date range
 * Since the backend doesn't have a dedicated query for date range filtering,
 * we implement this filtering on the client side
 */
export const useEventsByDateRange = (startDate: Date, endDate: Date) => {
  const { loading, error, data, refetch } = useQuery(GET_EVENTS_BY_DATE_RANGE, {
    fetchPolicy: 'cache-and-network'
  });

  // Filter events by date range on the client side
  const filteredEvents = useMemo(() => {
    if (!data?.events) return [];
    
    return data.events.filter((event: Event) => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return (
        (eventStart >= startDate && eventStart <= endDate) ||
        (eventEnd >= startDate && eventEnd <= endDate) || 
        (eventStart <= startDate && eventEnd >= endDate)
      );
    });
  }, [data?.events, startDate, endDate]);

  // Custom refetch function that allows passing new date range
  const refetchWithDateRange = useCallback((newDateRange?: { startDate: Date, endDate: Date }) => {
    if (newDateRange) {
      // Just refetch all events - we'll filter client-side
      return refetch();
    }
    return refetch();
  }, [refetch]);

  return {
    loading,
    error,
    events: filteredEvents,
    refetch: refetchWithDateRange
  };
};

/**
 * Hook for fetching a single event by ID
 */
export const useEvent = (id: string) => {
  const { loading, error, data, refetch } = useQuery(GET_EVENT, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network'
  });

  return {
    loading,
    error,
    event: data?.event || null,
    refetch
  };
};

/**
 * Hook for event mutations (create, update, delete)
 */
export const useEventMutations = () => {
  const [createEvent, { loading: createLoading, error: createError }] = useMutation(CREATE_EVENT, {
    refetchQueries: [{ query: GET_EVENTS }]
  });

  const [updateEvent, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_EVENT);

  const [deleteEvent, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_EVENT, {
    refetchQueries: [{ query: GET_EVENTS }]
  });

  const handleCreateEvent = async (input: CreateEventInput) => {
    try {
      const { data } = await createEvent({ variables: { input } });
      return data.createEvent;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  };

  const handleUpdateEvent = async (input: UpdateEventInput) => {
    try {
      const { data } = await updateEvent({ variables: { input } });
      return data.updateEvent;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const { data } = await deleteEvent({ variables: { id } });
      return data.deleteEvent;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  };

  return {
    createEvent: handleCreateEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
    loading: createLoading || updateLoading || deleteLoading,
    error: createError || updateError || deleteError
  };
};

/**
 * Hook for event registration mutations
 */
export const useEventRegistrationMutations = () => {
  const [createRegistration, { loading: createLoading, error: createError }] = useMutation(CREATE_EVENT_REGISTRATION);
  const [checkInAttendee, { loading: checkInLoading, error: checkInError }] = useMutation(CHECK_IN_ATTENDEE);
  const [checkOutAttendee, { loading: checkOutLoading, error: checkOutError }] = useMutation(CHECK_OUT_ATTENDEE);
  const [deleteRegistration, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_EVENT_REGISTRATION);

  const handleCreateRegistration = async (input: CreateEventRegistrationInput) => {
    try {
      const { data } = await createRegistration({ variables: { input } });
      return data.createEventRegistration;
    } catch (error) {
      console.error('Error creating registration:', error);
      throw error;
    }
  };

  const handleCheckInAttendee = async (registrationId: string) => {
    try {
      const { data } = await checkInAttendee({ variables: { registrationId } });
      return data.checkInAttendee;
    } catch (error) {
      console.error('Error checking in attendee:', error);
      throw error;
    }
  };

  const handleCheckOutAttendee = async (registrationId: string) => {
    try {
      const { data } = await checkOutAttendee({ variables: { registrationId } });
      return data.checkOutEventAttendee;
    } catch (error) {
      console.error('Error checking out attendee:', error);
      throw error;
    }
  };

  const handleDeleteRegistration = async (id: string) => {
    try {
      const { data } = await deleteRegistration({ variables: { id } });
      return data.deleteEventRegistration;
    } catch (error) {
      console.error('Error deleting registration:', error);
      throw error;
    }
  };

  return {
    createRegistration: handleCreateRegistration,
    checkInAttendee: handleCheckInAttendee,
    checkOutAttendee: handleCheckOutAttendee,
    deleteRegistration: handleDeleteRegistration,
    loading: createLoading || checkInLoading || checkOutLoading || deleteLoading,
    error: createError || checkInError || checkOutError || deleteError
  };
};

/**
 * Utility function to convert events to calendar-compatible format
 */
export const useEventsToCalendarEvents = (events: Event[] = []) => {
  // Map event categories to colors for better visual representation
  const getEventColor = useCallback((category?: string) => {
    const colors: Record<string, string> = {
      SERVICE: 'blue',
      MEETING: 'amber',
      CONFERENCE: 'purple',
      WORKSHOP: 'emerald',
      RETREAT: 'indigo',
      OUTREACH: 'rose',
      SOCIAL: 'pink',
      OTHER: 'gray'
    };
    return (category && colors[category.toUpperCase()]) || 'gray';
  }, []);

  const calendarEvents = events.map(event => ({
    ...event,
    color: getEventColor(event.category),
    allDay: new Date(event.endDate).getDate() !== new Date(event.startDate).getDate(),
    url: `/dashboard/calendar/${event.id}`
  }));

  return calendarEvents;
};

/**
 * Hook for fetching all branches
 */
export const useBranches = () => {
  const { loading, error, data, refetch } = useQuery(GET_BRANCHES, {
    fetchPolicy: 'cache-and-network'
  });

  return {
    loading,
    error,
    branches: data?.branches || [],
    refetch
  };
};

/**
 * Hook for simulating rooms data since the schema doesn't have a dedicated rooms collection
 * We'll generate mock room data based on the branch information
 */
export const useRooms = (branchId?: string) => {
  const { loading, error, data, refetch } = useQuery(GET_ROOMS, {
    variables: branchId ? { branchId } : { branchId: '' },
    fetchPolicy: 'cache-and-network',
    skip: !branchId // Skip query if no branchId is provided
  });

  // Generate mock rooms based on branch data
  const generateMockRooms = () => {
    if (!data?.branch) return [];
    
    // Create common room types for the selected branch
    const branch = data.branch;
    return [
      { id: `${branch.id}-main`, name: `Main Sanctuary (${branch.name})`, branchId: branch.id, capacity: 500 },
      { id: `${branch.id}-hall`, name: `Fellowship Hall (${branch.name})`, branchId: branch.id, capacity: 200 },
      { id: `${branch.id}-conf`, name: `Conference Room (${branch.name})`, branchId: branch.id, capacity: 50 },
      { id: `${branch.id}-youth`, name: `Youth Center (${branch.name})`, branchId: branch.id, capacity: 100 },
    ];
  };

  return {
    loading,
    error,
    rooms: branchId ? generateMockRooms() : [],
    refetch
  };
};

/**
 * Hook for fetching all volunteer teams
 */
export const useVolunteerRoles = () => {
  const { loading, error, data, refetch } = useQuery(GET_VOLUNTEER_ROLES, {
    fetchPolicy: 'cache-and-network'
  });

  return {
    loading,
    error,
    volunteerRoles: data?.volunteerTeams || [],
    refetch
  };
};
