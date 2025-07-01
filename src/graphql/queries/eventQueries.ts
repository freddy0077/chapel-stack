import { gql } from '@apollo/client';

export const GET_EVENTS_BY_BRANCH = gql`
  query Events($branchId: ID) {
    events(branchId: $branchId) {
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
      branchId
      createdBy
      updatedBy
    }
  }
`;

/**
 * Query to fetch a single event by ID
 */
export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
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
      branch {
        id
        name
      }
    }
  }
`;

/**
 * Query to fetch all event registrations
 */
export const GET_EVENT_REGISTRATIONS = gql`
  query GetEventRegistrations {
    eventRegistrations {
      id
      status
      registrationDate
      checkInTime
      checkOutTime
      notes
      event {
        id
        title
        startDate
        endDate
        location
        category
        branchId
      }
      member {
        id
        firstName
        lastName
        email
        phone
      }
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
      status
      registrationDate
      checkInTime
      checkOutTime
      notes
      event {
        id
        title
        startDate
        endDate
        location
        category
        branchId
      }
      member {
        id
        firstName
        lastName
        email
        phone
      }
    }
  }
`;

/**
 * Query to fetch upcoming events
 * We'll filter the events by date range on the client side
 */
export const GET_EVENTS_BY_DATE_RANGE = gql`
  query GetEvents {
    events {
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
 * Query to fetch events for a specific member
 * Note: This is a custom query that would need to be implemented in the backend
 */
export const GET_MEMBER_EVENTS = gql`
  query GetMemberEvents($memberId: ID!) {
    memberEvents(memberId: $memberId) {
      id
      status
      registrationDate
      event {
        id
        title
        description
        type
        status
        startDateTime
        endDateTime
        location
      }
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
  query GetBranchDetails($branchId: String!) {
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
  query EventsFiltered($branchId: String, $organisationId: String) {
    events(branchId: $branchId, organisationId: $organisationId) {
      id
      title
      description
      startDate
      endDate
      location
      category
      branchId
      organisationId
      createdBy
      updatedBy
    }
  }
`;
