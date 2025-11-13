import { gql } from '@apollo/client';

export const GET_AUDIT_LOGS = gql`
  query GetAuditLogs(
    $organisationId: String!
    $branchId: String!
    $limit: Float
    $offset: Float
    $filters: AuditLogFilterInput
  ) {
    auditLogs(
      organisationId: $organisationId
      branchId: $branchId
      limit: $limit
      offset: $offset
      filters: $filters
    ) {
      logs {
        id
        action
        entityType
        entityId
        description
        userId
        user {
          id
          firstName
          lastName
          email
          phoneNumber
          roles {
            id
            name
          }
        }
        branchId
        ipAddress
        userAgent
        metadata
        createdAt
      }
      total
      limit
      offset
    }
  }
`;
