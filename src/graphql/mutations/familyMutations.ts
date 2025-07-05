import { gql } from '@apollo/client';

export const CREATE_FAMILY = gql`
  mutation CreateFamily($createFamilyInput: CreateFamilyInput!) {
    createFamily(createFamilyInput: $createFamilyInput) {
      id
      name
      address
      city
      state
      postalCode
      country
      phoneNumber
      members { id firstName lastName }
      createdAt
      updatedAt
    }
  }
`;
