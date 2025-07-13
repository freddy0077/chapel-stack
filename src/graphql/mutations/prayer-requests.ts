import { gql } from '@apollo/client';

export const CREATE_PRAYER_REQUEST = gql`
  mutation CreatePrayerRequest($data: CreatePrayerRequestInput!) {
    createPrayerRequest(data: $data) {
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
      }
    }
  }
`;

export const UPDATE_PRAYER_REQUEST = gql`
  mutation UpdatePrayerRequest($id: ID!, $data: UpdatePrayerRequestInput!) {
    updatePrayerRequest(id: $id, data: $data) {
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
      }
    }
  }
`;

export const REMOVE_PRAYER_REQUEST = gql`
  mutation RemovePrayerRequest($id: ID!) {
    removePrayerRequest(id: $id) {
      id
    }
  }
`;
