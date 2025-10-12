import { gql } from '@apollo/client';

export const CREATE_REPORT_TEMPLATE = gql`
  mutation CreateReportTemplate($input: CreateReportTemplateInput!) {
    createReportTemplate(input: $input) {
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

export const UPDATE_REPORT_TEMPLATE = gql`
  mutation UpdateReportTemplate($id: String!, $input: UpdateReportTemplateInput!) {
    updateReportTemplate(id: $id, input: $input) {
      id
      name
      description
      filters
      metrics
      columns
      isPublic
      updatedAt
    }
  }
`;

export const DELETE_REPORT_TEMPLATE = gql`
  mutation DeleteReportTemplate($id: String!) {
    deleteReportTemplate(id: $id) {
      id
      name
    }
  }
`;

export const EXECUTE_REPORT = gql`
  mutation ExecuteReport($input: ExecuteReportInput!) {
    executeReport(input: $input) {
      summary {
        totalRecords
        metrics
      }
      data
      execution {
        id
        category
        filters
        executedAt
      }
    }
  }
`;

export const CREATE_SCHEDULED_REPORT = gql`
  mutation CreateScheduledReport($input: CreateScheduledReportInput!) {
    createScheduledReport(input: $input) {
      id
      name
      description
      category
      frequency
      recipients
      nextRunDate
      isActive
      createdAt
    }
  }
`;
