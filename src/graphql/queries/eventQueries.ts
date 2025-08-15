import { gql } from '@apollo/client';

export const GET_EVENTS_BY_BRANCH = gql`
  query Events($branchId: ID, $organisationId: ID) {
    events(branchId: $branchId, organisationId: $organisationId) {
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
      createdBy
      updatedBy
      createdAt
      updatedAt
    }
  }
`;

/**
 * Query to fetch all events
 */
export const GET_EVENTS = gql`
  query GetEvents {
    events {
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
      createdBy
      updatedBy
      createdAt
      updatedAt
    }
  }
`;

/**
 * Query to fetch a single event by ID with registrations and RSVPs
 */
export const GET_EVENT_BY_ID = gql`
  query GetEventById($id: ID!) {
    event(id: $id) {
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
      createdBy
      updatedBy
      createdAt
      updatedAt
      eventRegistrations {
        id
        memberId
        member {
          id
          firstName
          lastName
          email
        }
        guestName
        guestEmail
        status
        numberOfGuests
        registrationDate
        createdAt
      }
      eventRSVPs {
        id
        memberId
        member {
          id
          firstName
          lastName
          email
        }
        guestName
        guestEmail
        status
        numberOfGuests
        rsvpDate
        createdAt
      }
    }
  }
`;

// Export alias for backward compatibility
export const GET_EVENT = GET_EVENT_BY_ID;

/**
 * Query to fetch event registrations for a specific event
 */
export const GET_EVENT_REGISTRATIONS = gql`
  query GetEventRegistrations($eventId: ID!) {
    eventRegistrations(filter: { eventId: $eventId }) {
      id
      eventId
      memberId
      member {
        id
        firstName
        lastName
        email
        phone
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
 * Query to fetch event RSVPs for a specific event
 */
export const GET_EVENT_RSVPS = gql`
  query GetEventRSVPs($eventId: ID!) {
    eventRSVPs(filter: { eventId: $eventId }) {
      id
      eventId
      memberId
      member {
        id
        firstName
        lastName
        email
        phone
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
 * Query to get event statistics
 */
export const GET_EVENT_STATISTICS = gql`
  query GetEventStatistics($eventId: ID!) {
    eventStatistics(eventId: $eventId) {
      totalRegistrations
      totalRSVPs
      attendingCount
      maybeCount
      notAttendingCount
      pendingCount
      capacityUtilization
      registrationsByStatus {
        status
        count
      }
      rsvpsByStatus {
        status
        count
      }
    }
  }
`;

/**
 * Query to fetch all event registrations
 */
export const GET_ALL_EVENT_REGISTRATIONS = gql`
  query GetAllEventRegistrations {
    eventRegistrations {
      id
      eventId
      memberId
      member {
        id
        firstName
        lastName
        email
        phone
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
 * Query to fetch a single event registration by ID
 */
export const GET_EVENT_REGISTRATION = gql`
  query GetEventRegistration($id: ID!) {
    eventRegistration(id: $id) {
      id
      eventId
      memberId
      member {
        id
        firstName
        lastName
        email
        phone
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
 * Query to fetch all branches
 */
export const GET_BRANCHES = gql`
  query GetBranches {
    branches {
      id
      name
    }
  }
`;

/**
 * Simplified query to get branch details - since the schema doesn't have a rooms entity
 * Instead, we'll create mock room data based on the branch
 */
export const GET_ROOMS = gql`
  query GetBranchDetails($branchId: ID!) {
    branch(id: $branchId) {
      id
      name
    }
  }
`;

/**
 * Query to fetch all volunteer teams
 */
export const GET_VOLUNTEER_ROLES = gql`
  query GetVolunteerTeams {
    volunteerTeams {
      id
      name
      description
    }
  }
`;

/**
 * Query to fetch events filtered by branchId and organisationId
 */
export const GET_EVENTS_FILTERED = gql`
  query EventsFiltered($branchId: ID, $organisationId: ID) {
    events(branchId: $branchId, organisationId: $organisationId) {
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
      createdBy
      updatedBy
      createdAt
      updatedAt
    }
  }
`;

/**
 * Query to fetch events within a specific date range
 */
export const GET_EVENTS_BY_DATE_RANGE = gql`
  query GetEventsByDateRange($startDate: DateTime!, $endDate: DateTime!, $branchId: ID, $organisationId: ID) {
    events(branchId: $branchId, organisationId: $organisationId, startDate: $startDate, endDate: $endDate) {
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
      createdBy
      updatedBy
      createdAt
      updatedAt
      eventRegistrations {
        id
        memberId
        status
        numberOfGuests
        registrationDate
      }
      eventRSVPs {
        id
        memberId
        status
        numberOfGuests
        rsvpDate
      }
    }
  }
`;
