import { gql } from "@apollo/client";

export const CREATE_GROUP_EXECUTIVE = gql`
  mutation CreateGroupExecutive($input: CreateGroupExecutiveInput!) {
    createGroupExecutive(input: $input) {
      id
      role
      appointedAt
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

export const UPDATE_GROUP_EXECUTIVE = gql`
  mutation UpdateGroupExecutive($id: ID!, $input: UpdateGroupExecutiveInput!) {
    updateGroupExecutive(id: $id, input: $input) {
      id
      role
      appointedAt
      removedAt
      status
      memberId
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

export const REMOVE_GROUP_EXECUTIVE = gql`
  mutation RemoveGroupExecutive($id: ID!) {
    removeGroupExecutive(id: $id)
  }
`;
