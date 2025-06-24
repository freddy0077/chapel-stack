import { gql } from '@apollo/client';

export const CREATE_BRANCH = gql`
  mutation CreateNewBranch($input: CreateBranchInput!) {
    createBranch(createBranchInput: $input) {
      id
      name
      address
      city
      state
      postalCode
      country
      email
      phoneNumber
      website
      isActive
      establishedAt
      createdAt
      updatedAt
      settings {
        id
        branchId
        key
        value
        createdAt
        updatedAt
      }
      statistics {
        activeMembers
        inactiveMembers
        totalMembers
      }
    }
  }
`;

export const UPDATE_BRANCH = gql`
  mutation UpdateBranch($id: ID!, $input: UpdateBranchInput!) {
    updateBranch(id: $id, updateBranchInput: $input) {
      id
      name
      address
      city
      state
      postalCode
      country
      email
      phoneNumber
      website
      isActive
      establishedAt
      createdAt
      updatedAt
      settings {
        id
        branchId
        key
        value
        createdAt
        updatedAt
      }
      statistics {
        activeMembers
        inactiveMembers
        totalMembers
      }
    }
  }
`;
