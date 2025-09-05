import { gql } from '@apollo/client';

// Family Relationship Types
export enum FamilyRelationshipType {
  SPOUSE = 'SPOUSE',
  PARENT = 'PARENT',
  CHILD = 'CHILD',
  SIBLING = 'SIBLING',
  GRANDPARENT = 'GRANDPARENT',
  GRANDCHILD = 'GRANDCHILD',
  OTHER = 'OTHER',
}

// Get family relationships for a member
export const GET_FAMILY_RELATIONSHIPS = gql`
  query GetFamilyRelationshipsByMember($memberId: String!) {
    familyRelationshipsByMember(memberId: $memberId) {
      id
      relationshipType
      member {
        id
        firstName
        lastName
        middleName
        email
        phoneNumber
        profileImageUrl
        gender
        dateOfBirth
      }
      relatedMember {
        id
        firstName
        lastName
        middleName
        email
        phoneNumber
        profileImageUrl
        gender
        dateOfBirth
      }
      family {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

// Create family relationship
export const CREATE_FAMILY_RELATIONSHIP = gql`
  mutation CreateFamilyRelationship($createFamilyRelationshipInput: CreateFamilyRelationshipInput!) {
    createFamilyRelationship(createFamilyRelationshipInput: $createFamilyRelationshipInput) {
      id
      relationshipType
      member {
        id
        firstName
        lastName
        middleName
        email
        phoneNumber
        profileImageUrl
      }
      relatedMember {
        id
        firstName
        lastName
        middleName
        email
        phoneNumber
        profileImageUrl
      }
      family {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

// Update family relationship
export const UPDATE_FAMILY_RELATIONSHIP = gql`
  mutation UpdateFamilyRelationship($id: String!, $updateFamilyRelationshipInput: UpdateFamilyRelationshipInput!) {
    updateFamilyRelationship(id: $id, updateFamilyRelationshipInput: $updateFamilyRelationshipInput) {
      id
      relationshipType
      member {
        id
        firstName
        lastName
        middleName
        email
        phoneNumber
        profileImageUrl
      }
      relatedMember {
        id
        firstName
        lastName
        middleName
        email
        phoneNumber
        profileImageUrl
      }
      family {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

// Remove family relationship
export const REMOVE_FAMILY_RELATIONSHIP = gql`
  mutation RemoveFamilyRelationship($id: String!) {
    removeFamilyRelationship(id: $id)
  }
`;

// Search members for family relationship creation
export const SEARCH_MEMBERS_FOR_FAMILY = gql`
  query SearchMembersForFamily($query: String!) {
    searchMembers(
      query: $query
      skip: 0
      take: 10
    ) {
      id
      firstName
      lastName
      middleName
      email
      phoneNumber
      profileImageUrl
      gender
      dateOfBirth
      membershipStatus
    }
  }
`;

// TypeScript interfaces
export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  gender?: string;
  dateOfBirth?: string;
  membershipStatus?: string;
}

export interface FamilyRelationship {
  id: string;
  relationshipType: FamilyRelationshipType;
  member: FamilyMember;
  relatedMember: FamilyMember;
  family?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateFamilyRelationshipInput {
  memberId: string;
  relatedMemberId: string;
  relationshipType: FamilyRelationshipType;
  familyId?: string;
}

export interface UpdateFamilyRelationshipInput {
  relationshipType?: FamilyRelationshipType;
  familyId?: string;
}
