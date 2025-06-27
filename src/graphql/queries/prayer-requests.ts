import { gql } from '@apollo/client';

export const GET_PRAYER_REQUESTS = gql`
  query PrayerRequests($organisationId: String!, $branchId: String) {
    prayerRequests(organisationId: $organisationId, branchId: $branchId) {
      id
      requestText
      status
      createdAt
      memberId
      member {
        firstName
        lastName
      }
    }
  }
`;
