import { gql, useMutation } from "@apollo/client";

const CREATE_ORGANISATION = gql`
  mutation CreateOrganisation($input: CreateOrganisationInput!) {
    createOrganisation(input: $input) {
      id
      name
      email
      phoneNumber
      website
      address
      city
      state
      country
      zipCode
      denomination
      foundingYear
      size
      vision
      missionStatement
      description
      timezone
      currency
      primaryColor
      secondaryColor
      createdAt
      updatedAt
    }
  }
`;

export function useCreateOrganisation() {
  const [createOrganisation, { data, loading, error }] =
    useMutation(CREATE_ORGANISATION);
  return { createOrganisation, data, loading, error };
}
