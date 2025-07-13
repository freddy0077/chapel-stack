import { gql } from '@apollo/client';

export const EXPORT_TRANSACTIONS = gql`
  query ExportTransactions(
    $organisationId: String!
    $branchId: String
    $fundId: String
    $eventId: String
    $type: TransactionType
    $dateRange: DateRangeInput
    $searchTerm: String
    $exportFormat: String!
  ) {
    exportTransactions(
      organisationId: $organisationId
      branchId: $branchId
      fundId: $fundId
      eventId: $eventId
      type: $type
      dateRange: $dateRange
      searchTerm: $searchTerm
      exportFormat: $exportFormat
    )
  }
`;
