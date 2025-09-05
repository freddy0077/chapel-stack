import { gql } from '@apollo/client';

export const GET_DONOR_STATEMENTS_DATA = gql`
  query GetDonorStatementsData(
    $organisationId: String!
    $branchId: String!
    $dateRange: DateRangeInput
    $search: String
    $skip: Int
    $take: Int
  ) {
    donorStatements(
      organisationId: $organisationId
      branchId: $branchId
      dateRange: $dateRange
      search: $search
      skip: $skip
      take: $take
    ) {
      donors {
        id
        name
        email
        phone
        address
        totalGiving
        transactionCount
        firstGift
        lastGift
        averageGift
        transactions {
          id
          date
          amount
          fund {
            id
            name
          }
          type
          description
          reference
        }
      }
      totalCount
      hasNextPage
    }
  }
`;

export const GENERATE_DONOR_STATEMENT = gql`
  mutation GenerateDonorStatement(
    $input: GenerateDonorStatementInput!
  ) {
    generateDonorStatement(input: $input) {
      success
      message
      downloadUrl
      statementId
    }
  }
`;

export const BULK_GENERATE_DONOR_STATEMENTS = gql`
  mutation BulkGenerateDonorStatements(
    $input: BulkGenerateDonorStatementsInput!
  ) {
    bulkGenerateDonorStatements(input: $input) {
      success
      message
      downloadUrl
      processedCount
      failedCount
      errors
    }
  }
`;

export const EMAIL_DONOR_STATEMENT = gql`
  mutation EmailDonorStatement(
    $input: EmailDonorStatementInput!
  ) {
    emailDonorStatement(input: $input) {
      success
      message
      emailsSent
      emailsFailed
    }
  }
`;
