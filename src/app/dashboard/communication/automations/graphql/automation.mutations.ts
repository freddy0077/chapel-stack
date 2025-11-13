import { gql } from '@apollo/client';

export const GET_AUTOMATION_CONFIGS = gql`
  query GetAutomationConfigs($filters: AutomationConfigFiltersInput) {
    automationConfigs(filters: $filters) {
      id
      name
      description
      type
      status
      isEnabled
      triggerType
      schedule
      triggerConfig
      templateId
      channels
      lastRun
      nextRun
      totalRuns
      successCount
      failureCount
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
      template {
        id
        name
        type
      }
    }
  }
`;

export const GET_AUTOMATION_CONFIG = gql`
  query GetAutomationConfig($id: ID!) {
    automationConfig(id: $id) {
      id
      name
      description
      type
      status
      isEnabled
      triggerType
      schedule
      triggerConfig
      templateId
      channels
      lastRun
      nextRun
      totalRuns
      successCount
      failureCount
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
      template {
        id
        name
        type
        subject
        bodyText
      }
    }
  }
`;

export const GET_AUTOMATION_STATS = gql`
  query GetAutomationStats {
    automationStats
  }
`;

export const CREATE_AUTOMATION_CONFIG = gql`
  mutation CreateAutomationConfig($input: CreateAutomationConfigInput!) {
    createAutomationConfig(input: $input) {
      id
      name
      description
      type
      status
      isEnabled
      triggerType
      schedule
      triggerConfig
      templateId
      channels
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_AUTOMATION_CONFIG = gql`
  mutation UpdateAutomationConfig($input: UpdateAutomationConfigInput!) {
    updateAutomationConfig(input: $input) {
      id
      name
      description
      type
      status
      isEnabled
      triggerType
      schedule
      triggerConfig
      templateId
      channels
      updatedAt
    }
  }
`;

export const DELETE_AUTOMATION_CONFIG = gql`
  mutation DeleteAutomationConfig($id: ID!) {
    deleteAutomationConfig(id: $id) {
      success
      message
    }
  }
`;

export const TOGGLE_AUTOMATION_ENABLED = gql`
  mutation ToggleAutomationEnabled($id: ID!) {
    toggleAutomationEnabled(id: $id) {
      id
      isEnabled
      status
      updatedAt
    }
  }
`;

export const GET_AUTOMATION_LOGS = gql`
  query GetAutomationLogs($filters: AutomationLogsFiltersInput) {
    automationLogs(filters: $filters) {
      logs {
        id
        automationId
        automationName
        status
        executedAt
        completedAt
        recipientCount
        successCount
        failureCount
        errorMessage
        details
      }
      total
      limit
      offset
    }
  }
`;
