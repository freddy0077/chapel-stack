import { gql } from '@apollo/client';

export const CREATE_ZONE = gql`
  mutation CreateZone($input: CreateZoneInput!) {
    createZone(input: $input) {
      id
      name
      description
      location
      leaderName
      leaderPhone
      leaderEmail
      status
      branchId
      organisationId
      createdAt
      updatedAt
      _count {
        members
      }
    }
  }
`;

export const UPDATE_ZONE = gql`
  mutation UpdateZone($id: String!, $input: UpdateZoneInput!) {
    updateZone(id: $id, input: $input) {
      id
      name
      description
      location
      leaderName
      leaderPhone
      leaderEmail
      status
      branchId
      organisationId
      createdAt
      updatedAt
      _count {
        members
      }
    }
  }
`;

export const DELETE_ZONE = gql`
  mutation DeleteZone($id: String!) {
    deleteZone(id: $id) {
      id
      name
    }
  }
`;
