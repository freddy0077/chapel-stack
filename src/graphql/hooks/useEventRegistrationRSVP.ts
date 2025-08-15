import { useMutation, useQuery } from '@apollo/client';
import { useCallback } from 'react';
import {
  GET_EVENT_BY_ID,
  GET_EVENT_REGISTRATIONS,
  GET_EVENT_RSVPS,
  GET_EVENT_STATISTICS,
} from '../queries/eventQueries';
import {
  CREATE_EVENT_REGISTRATION,
  UPDATE_EVENT_REGISTRATION,
  DELETE_EVENT_REGISTRATION,
  CREATE_EVENT_RSVP,
  UPDATE_EVENT_RSVP,
  DELETE_EVENT_RSVP,
} from '../mutations/eventMutations';
import {
  Event,
  EventRegistration,
  EventRSVP,
  CreateEventRegistrationInput,
  UpdateEventRegistrationInput,
  CreateEventRSVPInput,
  UpdateEventRSVPInput,
} from '../types/event';

/**
 * Hook for fetching event details with registrations and RSVPs
 */
export const useEventDetails = (eventId: string) => {
  const { loading, error, data, refetch } = useQuery(GET_EVENT_BY_ID, {
    variables: { id: eventId },
    skip: !eventId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    loading,
    error,
    event: data?.event as Event,
    refetch,
  };
};

/**
 * Hook for fetching event registrations
 */
export const useEventRegistrations = (eventId: string) => {
  const { loading, error, data, refetch } = useQuery(GET_EVENT_REGISTRATIONS, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    loading,
    error,
    registrations: data?.eventRegistrations || [],
    refetch,
  };
};

/**
 * Hook for fetching event RSVPs
 */
export const useEventRSVPs = (eventId: string) => {
  const { loading, error, data, refetch } = useQuery(GET_EVENT_RSVPS, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    loading,
    error,
    rsvps: data?.eventRSVPs || [],
    refetch,
  };
};

/**
 * Hook for fetching event statistics
 */
export const useEventStatistics = (eventId: string) => {
  const { loading, error, data, refetch } = useQuery(GET_EVENT_STATISTICS, {
    variables: { eventId },
    skip: !eventId,
    fetchPolicy: 'cache-and-network',
  });

  return {
    loading,
    error,
    statistics: data?.eventStatistics,
    refetch,
  };
};

/**
 * Hook for event registration mutations
 */
export const useEventRegistrationMutations = () => {
  const [createRegistrationMutation, { loading: creating }] = useMutation(CREATE_EVENT_REGISTRATION);
  const [updateRegistrationMutation, { loading: updating }] = useMutation(UPDATE_EVENT_REGISTRATION);
  const [deleteRegistrationMutation, { loading: deleting }] = useMutation(DELETE_EVENT_REGISTRATION);

  const createRegistration = useCallback(
    async (input: CreateEventRegistrationInput) => {
      try {
        const result = await createRegistrationMutation({
          variables: { createEventRegistrationInput: input },
          refetchQueries: [
            { query: GET_EVENT_REGISTRATIONS, variables: { eventId: input.eventId } },
            { query: GET_EVENT_BY_ID, variables: { id: input.eventId } },
            { query: GET_EVENT_STATISTICS, variables: { eventId: input.eventId } },
          ],
        });
        return result.data?.createEventRegistration;
      } catch (error) {
        console.error('Error creating event registration:', error);
        throw error;
      }
    },
    [createRegistrationMutation]
  );

  const updateRegistration = useCallback(
    async (input: UpdateEventRegistrationInput) => {
      try {
        const result = await updateRegistrationMutation({
          variables: { updateEventRegistrationInput: input },
          refetchQueries: [
            { query: GET_EVENT_REGISTRATIONS, variables: { eventId: input.eventId } },
            { query: GET_EVENT_BY_ID, variables: { id: input.eventId } },
            { query: GET_EVENT_STATISTICS, variables: { eventId: input.eventId } },
          ],
        });
        return result.data?.updateEventRegistration;
      } catch (error) {
        console.error('Error updating event registration:', error);
        throw error;
      }
    },
    [updateRegistrationMutation]
  );

  const deleteRegistration = useCallback(
    async (id: string, eventId: string) => {
      try {
        const result = await deleteRegistrationMutation({
          variables: { id },
          refetchQueries: [
            { query: GET_EVENT_REGISTRATIONS, variables: { eventId } },
            { query: GET_EVENT_BY_ID, variables: { id: eventId } },
            { query: GET_EVENT_STATISTICS, variables: { eventId } },
          ],
        });
        return result.data?.removeEventRegistration;
      } catch (error) {
        console.error('Error deleting event registration:', error);
        throw error;
      }
    },
    [deleteRegistrationMutation]
  );

  return {
    createRegistration,
    updateRegistration,
    deleteRegistration,
    loading: creating || updating || deleting,
  };
};

/**
 * Hook for event RSVP mutations
 */
export const useEventRSVPMutations = () => {
  const [createRSVPMutation, { loading: creating }] = useMutation(CREATE_EVENT_RSVP);
  const [updateRSVPMutation, { loading: updating }] = useMutation(UPDATE_EVENT_RSVP);
  const [deleteRSVPMutation, { loading: deleting }] = useMutation(DELETE_EVENT_RSVP);

  const createRSVP = useCallback(
    async (input: CreateEventRSVPInput) => {
      try {
        const result = await createRSVPMutation({
          variables: { createEventRSVPInput: input },
          refetchQueries: [
            { query: GET_EVENT_RSVPS, variables: { eventId: input.eventId } },
            { query: GET_EVENT_BY_ID, variables: { id: input.eventId } },
            { query: GET_EVENT_STATISTICS, variables: { eventId: input.eventId } },
          ],
        });
        return result.data?.createEventRSVP;
      } catch (error) {
        console.error('Error creating event RSVP:', error);
        throw error;
      }
    },
    [createRSVPMutation]
  );

  const updateRSVP = useCallback(
    async (input: UpdateEventRSVPInput) => {
      try {
        const result = await updateRSVPMutation({
          variables: { updateEventRSVPInput: input },
          refetchQueries: [
            { query: GET_EVENT_RSVPS, variables: { eventId: input.eventId } },
            { query: GET_EVENT_BY_ID, variables: { id: input.eventId } },
            { query: GET_EVENT_STATISTICS, variables: { eventId: input.eventId } },
          ],
        });
        return result.data?.updateEventRSVP;
      } catch (error) {
        console.error('Error updating event RSVP:', error);
        throw error;
      }
    },
    [updateRSVPMutation]
  );

  const deleteRSVP = useCallback(
    async (id: string, eventId: string) => {
      try {
        const result = await deleteRSVPMutation({
          variables: { id },
          refetchQueries: [
            { query: GET_EVENT_RSVPS, variables: { eventId } },
            { query: GET_EVENT_BY_ID, variables: { id: eventId } },
            { query: GET_EVENT_STATISTICS, variables: { eventId } },
          ],
        });
        return result.data?.removeEventRSVP;
      } catch (error) {
        console.error('Error deleting event RSVP:', error);
        throw error;
      }
    },
    [deleteRSVPMutation]
  );

  return {
    createRSVP,
    updateRSVP,
    deleteRSVP,
    loading: creating || updating || deleting,
  };
};

/**
 * Combined hook for both registration and RSVP functionality
 */
export const useEventActions = (eventId: string) => {
  const eventDetails = useEventDetails(eventId);
  const registrations = useEventRegistrations(eventId);
  const rsvps = useEventRSVPs(eventId);
  const statistics = useEventStatistics(eventId);
  const registrationMutations = useEventRegistrationMutations();
  const rsvpMutations = useEventRSVPMutations();

  return {
    // Data
    event: eventDetails.event,
    registrations: registrations.registrations,
    rsvps: rsvps.rsvps,
    statistics: statistics.statistics,
    
    // Loading states
    loading: eventDetails.loading || registrations.loading || rsvps.loading || statistics.loading,
    mutationLoading: registrationMutations.loading || rsvpMutations.loading,
    
    // Error states
    error: eventDetails.error || registrations.error || rsvps.error || statistics.error,
    
    // Actions
    ...registrationMutations,
    ...rsvpMutations,
    
    // Refetch functions
    refetch: () => {
      eventDetails.refetch();
      registrations.refetch();
      rsvps.refetch();
      statistics.refetch();
    },
  };
};
