import { gql } from '@apollo/client';

export const ADMIN_USERS_QUERY = gql`
  query AdminUsers($pagination: PaginationInput, $filter: UserFilterInput) {
    adminUsers(pagination: $pagination, filter: $filter) {
      items {
        id
        email
        firstName
        lastName
        isActive
        roles { id name }
      }
      totalCount
    }
  }
`;
