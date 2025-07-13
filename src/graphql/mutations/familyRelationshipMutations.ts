import { gql } from '@apollo/client';

export const CREATE_FAMILY_RELATIONSHIP = gql`
  mutation CreateFamilyRelationship($createFamilyRelationshipInput: CreateFamilyRelationshipInput!) {
    createFamilyRelationship(createFamilyRelationshipInput: $createFamilyRelationshipInput) {
      id
      memberId
      relatedMemberId
      relationshipType
      familyId
      createdAt
      member {
        id
        firstName
        lastName
      }
      relatedMember {
        id
        firstName
        lastName
      }
    }
  }
`;

export const REMOVE_FAMILY_RELATIONSHIP = gql`
  mutation RemoveFamilyRelationship($id: String!) {
    removeFamilyRelationship(id: $id)
  }
`;
