import { gql } from '@apollo/client';

/**
 * Create a new permission
 */
export const GOD_MODE_CREATE_PERMISSION = gql`
  mutation GodModeCreatePermission($input: CreatePermissionInputType!) {
    godModeCreatePermission(input: $input) {
      id
      action
      subject
      description
      category
      roleCount
      createdAt
      updatedAt
    }
  }
`;

/**
 * Update an existing permission
 */
export const GOD_MODE_UPDATE_PERMISSION = gql`
  mutation GodModeUpdatePermission($id: ID!, $input: UpdatePermissionInputType!) {
    godModeUpdatePermission(id: $id, input: $input) {
      id
      action
      subject
      description
      category
      roleCount
      createdAt
      updatedAt
    }
  }
`;

/**
 * Delete a permission
 */
export const GOD_MODE_DELETE_PERMISSION = gql`
  mutation GodModeDeletePermission($id: ID!) {
    godModeDeletePermission(id: $id)
  }
`;

/**
 * Assign permission to role
 */
export const GOD_MODE_ASSIGN_PERMISSION_TO_ROLE = gql`
  mutation GodModeAssignPermissionToRole($roleId: ID!, $permissionId: ID!) {
    godModeAssignPermissionToRole(roleId: $roleId, permissionId: $permissionId)
  }
`;

/**
 * Remove permission from role
 */
export const GOD_MODE_REMOVE_PERMISSION_FROM_ROLE = gql`
  mutation GodModeRemovePermissionFromRole($roleId: ID!, $permissionId: ID!) {
    godModeRemovePermissionFromRole(roleId: $roleId, permissionId: $permissionId)
  }
`;
