import { gql } from '@apollo/client';

export const GET_PRAYER_REQUESTS = gql`
  query PrayerRequests($organisationId: String!, $branchId: String, $status: PrayerRequestStatusEnum) {
    prayerRequests(organisationId: $organisationId, branchId: $branchId, status: $status) {
      id
      requestText
      status
      createdAt
      updatedAt
      memberId
      branchId
      assignedPastorId
      organisationId
      member {
        id
        firstName
        lastName
        email
        phoneNumber
      }
    }
  }
`;

export const GET_PRAYER_REQUEST = gql`
  query PrayerRequest($id: ID!) {
    prayerRequest(id: $id) {
      id
      requestText
      status
      createdAt
      updatedAt
      memberId
      branchId
      assignedPastorId
      organisationId
      member {
        id
        firstName
        lastName
        email
        phoneNumber
      }
    }
  }
`;
