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

// Get all families with pagination and search
export const GET_FAMILIES_LIST = gql`
  query GetFamiliesList($skip: Int, $take: Int) {
    families(skip: $skip, take: $take) {
      id
      name
      address
      city
      state
      postalCode
      country
      phoneNumber
      customFields
      createdAt
      updatedAt
      members {
        id
        firstName
        lastName
        profileImageUrl
        email
        phoneNumber
      }
    }
  }
`;

// Get families count
export const GET_FAMILIES_COUNT = gql`
  query GetFamiliesCount {
    familiesCount
  }
`;

// Get single family by ID
export const GET_FAMILY_BY_ID = gql`
  query GetFamilyById($id: String!) {
    family(id: $id) {
      id
      name
      address
      city
      state
      postalCode
      country
      phoneNumber
      customFields
      createdAt
      updatedAt
      members {
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
        status
      }
    }
  }
`;

// Create family
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
      customFields
      createdAt
      updatedAt
      members {
        id
        firstName
        lastName
        profileImageUrl
      }
    }
  }
`;

// Update family
export const UPDATE_FAMILY = gql`
  mutation UpdateFamily($id: String!, $updateFamilyInput: UpdateFamilyInput!) {
    updateFamily(id: $id, updateFamilyInput: $updateFamilyInput) {
      id
      name
      address
      city
      state
      postalCode
      country
      phoneNumber
      customFields
      createdAt
      updatedAt
      members {
        id
        firstName
        lastName
        profileImageUrl
      }
    }
  }
`;

// Remove family
export const REMOVE_FAMILY = gql`
  mutation RemoveFamily($id: String!) {
    removeFamily(id: $id)
  }
`;

// Add member to family
export const ADD_MEMBER_TO_FAMILY = gql`
  mutation AddMemberToFamily($familyId: String!, $memberId: String!) {
    addMemberToFamily(familyId: $familyId, memberId: $memberId) {
      id
      name
      members {
        id
        firstName
        lastName
        profileImageUrl
      }
    }
  }
`;

// Remove member from family
export const REMOVE_MEMBER_FROM_FAMILY = gql`
  mutation RemoveMemberFromFamily($familyId: String!, $memberId: String!) {
    removeMemberFromFamily(familyId: $familyId, memberId: $memberId) {
      id
      name
      members {
        id
        firstName
        lastName
        profileImageUrl
      }
    }
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

// Family interfaces
export interface Family {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
  customFields?: any;
  createdAt: string;
  updatedAt: string;
  members?: FamilyMember[];
}

export interface CreateFamilyInput {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
  customFields?: any;
  memberIds?: string[];
}

export interface UpdateFamilyInput {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
  customFields?: any;
  memberIds?: string[];
}

export interface FamilySearchFilters {
  name?: string;
  address?: string;
  city?: string;
  phoneNumber?: string;
  memberName?: string;
  dateRange?: { from: Date; to: Date };
}
