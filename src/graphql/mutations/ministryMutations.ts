import { gql } from '@apollo/client';

export const ADD_MEMBER_TO_MINISTRY = gql`
  mutation AddMemberToMinistry(
    $ministryId: ID!
    $memberId: ID!
    $role: String
    $joinDate: String
  ) {
    addMemberToMinistry(
      ministryId: $ministryId
      memberId: $memberId
      role: $role
      joinDate: $joinDate
    ) {
      ministry {
        id
        name
      }
      role
      joinDate
    }
  }
`;
