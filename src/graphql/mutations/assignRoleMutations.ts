import { gql } from "@apollo/client";

export const ASSIGN_ROLE_TO_USER = gql`
  mutation AssignRoleToUser($userId: ID!, $roleId: ID!) {
    assignRoleToUser(userId: $userId, roleId: $roleId) {
      id
      roles {
        id
        name
      }
      userBranches {
        id
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
  }
`;
