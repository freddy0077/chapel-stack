import { gql } from '@apollo/client';

export const GET_MEMBERS = gql`
  query Members($organisationId: String!) {
    members(organisationId: $organisationId, pagination: { take: 1000, skip: 0 }) {
      items {
        id
        firstName
        lastName
      }
    }
  }
`;
