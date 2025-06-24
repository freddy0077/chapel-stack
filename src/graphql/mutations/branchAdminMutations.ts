import { gql } from '@apollo/client';

export const CREATE_BRANCH_ADMIN = gql`
  mutation CreateBranchAdmin($input: CreateBranchAdminInput!) {
    createBranchAdmin(input: $input) {
      user {
        id
        email
        firstName
      }
      branch {
        id
        name
      }
      role {
        id
        name
      }
    }
  }
`;
