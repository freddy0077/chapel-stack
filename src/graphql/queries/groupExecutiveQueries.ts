import { gql } from "@apollo/client";

export const GET_GROUP_EXECUTIVES = gql`
  query GetGroupExecutives($filters: GroupExecutiveFilterInput) {
    groupExecutives(filters: $filters) {
      id
      role
      appointedAt
      removedAt
      status
      memberId
      ministryId
      smallGroupId
      member {
        id
        firstName
        lastName
        email
        phoneNumber
        profileImageUrl
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_GROUP_EXECUTIVE = gql`
  query GetGroupExecutive($id: ID!) {
    groupExecutive(id: $id) {
      id
      role
      appointedAt
      removedAt
      status
      memberId
      ministryId
      smallGroupId
      member {
        id
        firstName
        lastName
        email
        phoneNumber
        profileImageUrl
      }
      createdAt
      updatedAt
    }
  }
`;
