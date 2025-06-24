import { gql } from '@apollo/client';

export const GET_ADMIN_ROLES = gql`
  query GetAdminRoles {
    adminRoles {
      id
      name
      description
      permissions {
        id
        action
        subject
        description
      }
    }
  }
`;
