import { gql } from "@apollo/client";

export const GET_BRANCHES = gql`
  query GetBranches($filter: BranchFilterInput, $pagination: PaginationInput) {
    branches(filterInput: $filter, paginationInput: $pagination) {
      items {
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
      totalCount
      hasNextPage
    }
  }
`;

export const GET_BRANCH = gql`
  query GetBranch($branchId: ID!) {
    branch(id: $branchId) {
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
