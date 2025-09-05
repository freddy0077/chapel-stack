import { gql } from "@apollo/client";

// Updated to use actual backend queries: members and searchMembers
export const ADVANCED_MEMBERS_QUERY = gql`
  query GetMembers(
    $branchId: String
    $organisationId: String
    $search: String
    $skip: Int = 0
    $take: Int = 10
  ) {
    members(
      branchId: $branchId
      organisationId: $organisationId
      search: $search
      skip: $skip
      take: $take
    ) {
      id
      firstName
      lastName
      email
      phoneNumber
      status
      gender
      dateOfBirth
      membershipDate
      profileImageUrl
      createdAt
      updatedAt
      memberId
      cardIssued
      cardType
      branch {
        id
        name
      }
    }
    membersCount(branchId: $branchId, organisationId: $organisationId)
  }
`;

export const SEARCH_MEMBERS_QUERY = gql`
  query SearchMembers(
    $query: String!
    $branchId: String
    $gender: String
    $membershipStatus: String
    $ageGroup: String
    $skip: Int = 0
    $take: Int = 20
  ) {
    searchMembers(
      query: $query
      branchId: $branchId
      gender: $gender
      membershipStatus: $membershipStatus
      ageGroup: $ageGroup
      skip: $skip
      take: $take
    ) {
      id
      firstName
      lastName
      email
      phoneNumber
      status
      gender
      dateOfBirth
      membershipDate
      profileImageUrl
      createdAt
      updatedAt
      memberId
      cardIssued
      cardType
      branch {
        id
        name
      }
    }
  }
`;

// TypeScript interfaces for the actual backend queries
export interface MemberQueryVariables {
  branchId?: string;
  organisationId?: string;
  search?: string;
  skip?: number;
  take?: number;
}

export interface SearchMemberQueryVariables {
  query: string;
  branchId?: string;
  gender?: string;
  membershipStatus?: string;
  ageGroup?: string;
  skip?: number;
  take?: number;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  status: string;
  gender?: string;
  dateOfBirth?: string;
  membershipDate?: string;
  profileImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  memberId: string;
  cardIssued: boolean;
  cardType: string;
  branch?: {
    id: string;
    name: string;
  };
}

export interface MemberQueryResult {
  members: Member[];
  membersCount: number;
}

export interface SearchMemberQueryResult {
  searchMembers: Member[];
}
