import { gql } from '@apollo/client';

export const GET_REPORT_TEMPLATES = gql`
  query GetReportTemplates(
    $organisationId: String!
    $branchId: String
    $category: ReportCategory
  ) {
    reportTemplates(
      organisationId: $organisationId
      branchId: $branchId
      category: $category
    ) {
      id
      name
      description
      category
      filters
      metrics
      columns
      createdBy
      organisationId
      branchId
      isPublic
      createdAt
      updatedAt
    }
  }
`;

export const GET_REPORT_TEMPLATE = gql`
  query GetReportTemplate($id: String!) {
    reportTemplate(id: $id) {
      id
      name
      description
      category
      filters
      metrics
      columns
      createdBy
      organisationId
      branchId
      isPublic
      createdAt
      updatedAt
    }
  }
`;

export const GET_REPORT_HISTORY = gql`
  query GetReportHistory(
    $organisationId: String!
    $branchId: String
    $category: ReportCategory
  ) {
    reportHistory(
      organisationId: $organisationId
      branchId: $branchId
      category: $category
    ) {
      id
      templateId
      category
      filters
      results
      summary
      executedBy
      organisationId
      branchId
      executedAt
    }
  }
`;

export const GET_REPORT_EXECUTION = gql`
  query GetReportExecution($id: String!) {
    reportExecution(id: $id) {
      id
      templateId
      category
      filters
      results
      summary
      executedBy
      organisationId
      branchId
      executedAt
    }
  }
`;

export const GET_SCHEDULED_REPORTS = gql`
  query GetScheduledReports($organisationId: String!, $branchId: String) {
    scheduledReports(organisationId: $organisationId, branchId: $branchId) {
      id
      name
      description
      templateId
      category
      filters
      frequency
      recipients
      nextRunDate
      lastRunDate
      isActive
      organisationId
      branchId
      createdBy
      createdAt
      updatedAt
    }
  }
`;
