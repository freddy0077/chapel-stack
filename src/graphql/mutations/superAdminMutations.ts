import { gql } from "@apollo/client";

export const CREATE_ADMIN_USER = gql`
  mutation CreateSuperAdminUser(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $branchId: ID!
  ) {
    createSuperAdminUser(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
      branchId: $branchId
    )
  }
`;
