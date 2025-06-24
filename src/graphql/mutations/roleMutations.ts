import { gql } from '@apollo/client';

export const CREATE_ROLE_WITH_PERMISSIONS = gql`
  mutation CreateRoleWithPermissions($input: CreateRoleWithPermissionsInput!) {
    createRoleWithPermissions(input: $input) {
      id
      name
      permissions {
        id
        action
        subject
      }
    }
  }
`;
