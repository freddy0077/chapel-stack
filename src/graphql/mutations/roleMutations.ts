import { gql } from "@apollo/client";

/**
 * Create a new role
 */
export const GOD_MODE_CREATE_ROLE = gql`
  mutation GodModeCreateRole($input: CreateRoleInputType!) {
    godModeCreateRole(input: $input) {
      id
      name
      description
      level
      userCount
      permissionIds
      createdAt
      updatedAt
    }
  }
`;

/**
 * Update an existing role
 */
export const GOD_MODE_UPDATE_ROLE = gql`
  mutation GodModeUpdateRole($id: ID!, $input: UpdateRoleInputType!) {
    godModeUpdateRole(id: $id, input: $input) {
      id
      name
      description
      level
      userCount
      permissionIds
      createdAt
      updatedAt
    }
  }
`;

/**
 * Delete a role
 */
export const GOD_MODE_DELETE_ROLE = gql`
  mutation GodModeDeleteRole($id: ID!) {
    godModeDeleteRole(id: $id)
  }
`;

/**
 * Assign role to user
 */
export const GOD_MODE_ASSIGN_ROLE_TO_USER = gql`
  mutation GodModeAssignRoleToUser($userId: ID!, $roleId: ID!) {
    godModeAssignRoleToUser(userId: $userId, roleId: $roleId)
  }
`;

/**
 * Remove role from user
 */
export const GOD_MODE_REMOVE_ROLE_FROM_USER = gql`
  mutation GodModeRemoveRoleFromUser($userId: ID!, $roleId: ID!) {
    godModeRemoveRoleFromUser(userId: $userId, roleId: $roleId)
  }
`;
