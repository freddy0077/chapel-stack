import { gql } from '@apollo/client';

/**
 * Query to fetch all event templates
 */
export const GET_EVENT_TEMPLATES = gql`
  query GetEventTemplates($filter: EventTemplateFilterInput) {
    eventTemplates(filter: $filter) {
      id
      title
      description
      eventType
      duration
      isRecurring
      recurrenceType
      recurrenceRule
      resources
      volunteerRoles {
        role
        count
        description
      }
      applicableBranches
      requiredSetup
      isActive
      usageCount
      lastUsed
      createdAt
      updatedAt
      createdBy {
        id
        displayName
      }
    }
  }
`;

/**
 * Query to fetch a single event template by ID
 */
export const GET_EVENT_TEMPLATE = gql`
  query GetEventTemplate($id: ID!) {
    eventTemplate(id: $id) {
      id
      title
      description
      eventType
      duration
      isRecurring
      recurrenceType
      recurrenceRule
      resources
      volunteerRoles {
        role
        count
        description
      }
      applicableBranches
      requiredSetup
      customFields
      isActive
      usageCount
      lastUsed
      createdAt
      updatedAt
      createdBy {
        id
        username
      }
    }
  }
`;

/**
 * Mutation to create a new event template
 */
export const CREATE_EVENT_TEMPLATE = gql`
  mutation CreateEventTemplate($input: CreateEventTemplateInput!) {
    createEventTemplate(input: $input) {
      id
      title
      description
      eventType
      duration
      isRecurring
      recurrenceType
      recurrenceRule
      resources
      volunteerRoles {
        role
        count
        description
      }
      applicableBranches
      requiredSetup
      isActive
    }
  }
`;

/**
 * Mutation to update an event template
 */
export const UPDATE_EVENT_TEMPLATE = gql`
  mutation UpdateEventTemplate($id: ID!, $input: UpdateEventTemplateInput!) {
    updateEventTemplate(id: $id, input: $input) {
      id
      title
      description
      eventType
      duration
      isRecurring
      recurrenceType
      recurrenceRule
      resources
      volunteerRoles {
        role
        count
        description
      }
      applicableBranches
      requiredSetup
      isActive
    }
  }
`;

/**
 * Mutation to delete an event template
 */
export const DELETE_EVENT_TEMPLATE = gql`
  mutation DeleteEventTemplate($id: ID!) {
    deleteEventTemplate(id: $id)
  }
`;

/**
 * Mutation to create an event from a template
 */
export const CREATE_EVENT_FROM_TEMPLATE = gql`
  mutation CreateEventFromTemplate($templateId: ID!, $input: CreateEventFromTemplateInput!) {
    createEventFromTemplate(templateId: $templateId, input: $input) {
      id
      title
      description
      eventType
      startDate
      endDate
      startTime
      endTime
      allDay
      isRecurring
      recurrenceType
      recurrenceRule
      location
      branch {
        id
        name
      }
      visibility
      status
    }
  }
`;
