import { gql } from '@apollo/client';

/**
 * Mutation to create a new event
 */
export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      title
      description
      startDate
      endDate
      location
      branchId
    }
  }
`;

/**
 * Mutation to update an existing event
 */
export const UPDATE_EVENT = gql`
  mutation UpdateEvent($input: UpdateEventInput!) {
    updateEvent(input: $input) {
      id
      title
      description
      startDate
      endDate
      location
      category
      branchId
      createdBy
      updatedBy
    }
  }
`;

/**
 * Mutation to delete an event
 */
export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
      title
    }
  }
`;

/**
 * Mutation to create a new event registration
 */
export const CREATE_EVENT_REGISTRATION = gql`
  mutation CreateEventRegistration($input: CreateEventRegistrationInput!) {
    createEventRegistration(input: $input) {
      id
      status
      registrationDate
      notes
      event {
        id
        title
      }
      member {
        id
        firstName
        lastName
      }
    }
  }
`;

/**
 * Mutation to check in an attendee (event participant)
 */
export const CHECK_IN_ATTENDEE = gql`
  mutation CheckInAttendee($registrationId: ID!) {
    checkInAttendee(registrationId: $registrationId) {
      id
      status
      checkInTime
      event {
        id
        title
      }
      member {
        id
        firstName
        lastName
      }
    }
  }
`;

/**
 * Mutation to check out an attendee (event participant)
 */
export const CHECK_OUT_ATTENDEE = gql`
  mutation CheckOutAttendee($registrationId: ID!) {
    checkOutAttendee(registrationId: $registrationId) {
      id
      status
      checkInTime
      checkOutTime
      event {
        id
        title
      }
      member {
        id
        firstName
        lastName
      }
    }
  }
`;

/**
 * Mutation to delete an event registration
 */
export const DELETE_EVENT_REGISTRATION = gql`
  mutation DeleteEventRegistration($id: ID!) {
    deleteEventRegistration(id: $id) {
      id
    }
  }
`;
