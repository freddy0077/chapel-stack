import { gql } from '@apollo/client';

/**
 * Mutation to create a new event
 */
export const CREATE_EVENT = gql`
  mutation CreateEvent($input: CreateEventInput!) {
    createEvent(createEventInput: $input) {
      id
      title
      description
      startDate
      endDate
      location
      category
      eventType
      status
      capacity
      registrationRequired
      registrationDeadline
      isPublic
      requiresApproval
      eventImageUrl
      tags
      organizerName
      organizerEmail
      organizerPhone
      isFree
      ticketPrice
      currency
      branchId
      organisationId
      createdAt
      updatedAt
    }
  }
`;

/**
 * Mutation to create a new recurring event
 */
export const CREATE_RECURRING_EVENT = gql`
  mutation CreateRecurringEvent($input: CreateEventInput!) {
    createRecurringEvent(createEventInput: $input) {
      id
      title
      description
      startDate
      endDate
      location
      category
      eventType
      status
      capacity
      registrationRequired
      registrationDeadline
      isPublic
      requiresApproval
      eventImageUrl
      tags
      organizerName
      organizerEmail
      organizerPhone
      isFree
      ticketPrice
      currency
      branchId
      organisationId
      createdAt
      updatedAt
    }
  }
`;

/**
 * Mutation to update an existing event
 */
export const UPDATE_EVENT = gql`
  mutation UpdateEvent($updateEventInput: UpdateEventInput!) {
    updateEvent(updateEventInput: $updateEventInput) {
      id
      title
      description
      startDate
      endDate
      location
      category
      eventType
      status
      capacity
      registrationRequired
      registrationDeadline
      isPublic
      requiresApproval
      eventImageUrl
      tags
      organizerName
      organizerEmail
      organizerPhone
      isFree
      ticketPrice
      currency
      branchId
      organisationId
      createdAt
      updatedAt
    }
  }
`;

/**
 * Mutation to delete an event
 */
export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    removeEvent(id: $id) {
      id
      title
    }
  }
`;

/**
 * Mutation to create a new event registration
 */
export const CREATE_EVENT_REGISTRATION = gql`
  mutation CreateEventRegistration($createEventRegistrationInput: CreateEventRegistrationInput!) {
    createEventRegistration(createEventRegistrationInput: $createEventRegistrationInput) {
      id
      eventId
      memberId
      member {
        id
        firstName
        lastName
        email
      }
      guestName
      guestEmail
      guestPhone
      status
      registrationDate
      numberOfGuests
      specialRequests
      registrationSource
      notes
      createdAt
      updatedAt
    }
  }
`;

/**
 * Mutation to update an event registration
 */
export const UPDATE_EVENT_REGISTRATION = gql`
  mutation UpdateEventRegistration($updateEventRegistrationInput: UpdateEventRegistrationInput!) {
    updateEventRegistration(updateEventRegistrationInput: $updateEventRegistrationInput) {
      id
      eventId
      memberId
      member {
        id
        firstName
        lastName
        email
      }
      guestName
      guestEmail
      guestPhone
      status
      registrationDate
      numberOfGuests
      specialRequests
      amountPaid
      paymentStatus
      paymentMethod
      approvalStatus
      approvedBy
      approvalDate
      rejectionReason
      registrationSource
      notes
      createdAt
      updatedAt
    }
  }
`;

/**
 * Mutation to delete an event registration
 */
export const DELETE_EVENT_REGISTRATION = gql`
  mutation DeleteEventRegistration($id: ID!) {
    removeEventRegistration(id: $id) {
      id
      eventId
      memberId
    }
  }
`;

/**
 * Mutation to create a new event RSVP
 */
export const CREATE_EVENT_RSVP = gql`
  mutation CreateEventRSVP($createEventRSVPInput: CreateEventRSVPInput!) {
    createEventRSVP(createEventRSVPInput: $createEventRSVPInput) {
      id
      eventId
      memberId
      member {
        id
        firstName
        lastName
        email
      }
      guestName
      guestEmail
      guestPhone
      status
      rsvpDate
      numberOfGuests
      message
      rsvpSource
      createdAt
      updatedAt
    }
  }
`;

/**
 * Mutation to update an event RSVP
 */
export const UPDATE_EVENT_RSVP = gql`
  mutation UpdateEventRSVP($updateEventRSVPInput: UpdateEventRSVPInput!) {
    updateEventRSVP(updateEventRSVPInput: $updateEventRSVPInput) {
      id
      eventId
      memberId
      member {
        id
        firstName
        lastName
        email
      }
      guestName
      guestEmail
      guestPhone
      status
      rsvpDate
      numberOfGuests
      message
      rsvpSource
      createdAt
      updatedAt
    }
  }
`;

/**
 * Mutation to delete an event RSVP
 */
export const DELETE_EVENT_RSVP = gql`
  mutation DeleteEventRSVP($id: ID!) {
    removeEventRSVP(id: $id) {
      id
      eventId
      memberId
    }
  }
`;

/**
 * Query to get event registrations
 */
export const GET_EVENT_REGISTRATIONS = gql`
  query GetEventRegistrations($filter: EventRegistrationFilterInput) {
    eventRegistrations(filter: $filter) {
      id
      eventId
      memberId
      guestName
      guestEmail
      guestPhone
      status
      registrationDate
      notes
      numberOfGuests
      specialRequests
      checkInTime
      checkOutTime
      event {
        id
        title
        startDate
        endDate
        location
      }
      member {
        id
        firstName
        lastName
        email
      }
      createdAt
      updatedAt
    }
  }
`;

/**
 * Mutation to check in an event registration
 */
export const CHECK_IN_EVENT_REGISTRATION = gql`
  mutation CheckInEventRegistration($input: CheckInEventRegistrationInput!) {
    checkInEventRegistration(input: $input) {
      id
      eventId
      memberId
      status
      checkInTime
      notes
      event {
        id
        title
        startDate
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
 * Mutation to check out an event registration
 */
export const CHECK_OUT_EVENT_REGISTRATION = gql`
  mutation CheckOutEventRegistration($input: CheckOutEventRegistrationInput!) {
    checkOutEventRegistration(input: $input) {
      id
      eventId
      memberId
      status
      checkInTime
      checkOutTime
      notes
      event {
        id
        title
        startDate
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
 * Mutation to remove an event registration
 */
export const REMOVE_EVENT_REGISTRATION = gql`
  mutation RemoveEventRegistration($id: ID!) {
    removeEventRegistration(id: $id) {
      id
      status
    }
  }
`;

/**
 * Query to get event registration stats
 */
export const GET_EVENT_REGISTRATION_STATS = gql`
  query GetEventRegistrationStats($eventId: ID!) {
    eventRegistrationStats(eventId: $eventId)
  }
`;

/**
 * Mutation to promote registrations from waitlist
 */
export const PROMOTE_FROM_WAITLIST = gql`
  mutation PromoteFromWaitlist($eventId: ID!) {
    promoteFromWaitlist(eventId: $eventId) {
      id
      status
      member {
        id
        firstName
        lastName
        email
      }
      guestName
      guestEmail
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
