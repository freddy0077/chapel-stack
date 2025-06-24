import { gql } from '@apollo/client';

export const GET_PERMISSIONS_GROUPED_BY_SUBJECT = gql`
  query PermissionsGroupedBySubject {
    permissionsGroupedBySubject {
      id
      action
      subject
      description
    }
  }
`;
