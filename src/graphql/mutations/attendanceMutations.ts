import { gql } from "@apollo/client";

export const PROCESS_CARD_SCAN = gql`
  mutation ProcessCardScan($input: CardScanInput!) {
    processCardScan(input: $input) {
      id
      checkInTime
      checkOutTime
      member {
        id
        firstName
        lastName
      }
      session {
        id
        name
      }
      # Add other AttendanceRecord fields as needed
    }
  }
`;
