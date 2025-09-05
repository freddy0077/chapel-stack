import { gql } from "@apollo/client";

export const LIST_MINISTRIES = gql`
  query ListMinistries($filters: MinistryFilterInput) {
    ministries(filters: $filters) {
      id
      name
      type
      status
      branchId
      parentId
      createdAt
      updatedAt
      members {
        id
        memberId
        role
        status
      }
      subMinistries {
        id
        name
      }
      parent {
        id
        name
      }
    }
  }
`;

export const GET_MINISTRY = gql`
  query GetMinistry($id: ID!) {
    ministry(id: $id) {
      id
      name
      type
      status
      branchId
      parentId
      createdAt
      updatedAt
      members {
        id
        memberId
        role
        status
      }
      subMinistries {
        id
        name
      }
      parent {
        id
        name
      }
    }
  }
`;

export const CREATE_MINISTRY = gql`
  mutation CreateMinistry($input: CreateMinistryInput!) {
    createMinistry(input: $input) {
      id
      name
      type
      status
      branchId
      parentId
      createdAt
      updatedAt
    }
  }
`;
