import { gql } from '@apollo/client';

export const CREATE_USERS_WITH_ROLE = gql`
  mutation CreateUsersWithRole($input: CreateUsersWithRoleInput!) {
    createUsersWithRole(input: $input) {
      email
      firstName
      lastName
      roleName
      id
      error
    }
  }
`;
