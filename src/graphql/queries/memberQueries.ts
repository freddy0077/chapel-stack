import { gql } from '@apollo/client';

// Query to get branches with statistics (using 'id' in filterInput as requested)
export const GET_BRANCHES_WITH_STATISTICS = gql`
  query GetBranchesWithStatistics($branchId: String) {
    branches(filterInput: { id: $branchId }) {
      items {
        id
        name
        statistics {
          totalMembers
          activeMembers
          inactiveMembers
          newMembersInPeriod
          lastMonth {
            totalMembers
            activeMembers
            inactiveMembers
            newMembersInPeriod
            __typename
          }
          __typename
        }
        __typename
      }
      totalCount
      __typename
    }
  }
`;

// Mutation to create a new member (updated to match new schema and fields)
export const CREATE_MEMBER = gql`
  mutation CreateMember($createMemberInput: CreateMemberInput!) {
    createMember(createMemberInput: $createMemberInput) {
      id
      firstName
      middleName
      lastName
      email
      phoneNumber
      address
      city
      state
      postalCode
      country
      dateOfBirth
      gender
      maritalStatus
      occupation
      employerName
      status
      membershipDate
      baptismDate
      confirmationDate
      statusChangeDate
      statusChangeReason
      profileImageUrl
      customFields
      privacySettings
      notes
      branch {
        id
        name
      }
      branchId
      spouse {
        id
        firstName
        lastName
      }
      spouseId
      parent {
        id
        firstName
        lastName
      }
      parentId
      rfidCardId
      createdAt
      updatedAt
    }
  }
`;

// Query to fetch all members - updated to match server schema
export const GET_MEMBERS = gql`
  query GetMembers(
    $skip: Int
    $take: Int
    # filter argument removed as it's not supported on Query.members
  ) {
    members(
      skip: $skip
      take: $take
    ) {
      id
      firstName
      middleName
      lastName
      email
      phoneNumber
      status
      profileImageUrl
      gender
      dateOfBirth
      membershipDate # Replaced membershipNumber
      # joinDate # Removed
      # firstVisitDate # Removed
      # isActive # Removed
      # isVisitor # Removed
      occupation
      maritalStatus
      createdAt
      # userBranches # Removed from list query
    }
  }
`;

// Query to fetch members with pagination info
export const GET_MEMBERS_LIST = gql`
  query GetMembersList(
    $organisationId: String
    $skip: Int
    $take: Int
    $branchId: String
    $search: String
  ) {
    members(
      organisationId: $organisationId
      skip: $skip
      take: $take
      branchId: $branchId
      search: $search
    ) {
      id
      firstName
      middleName
      lastName
      email
      phoneNumber
      status
      profileImageUrl
      gender
      dateOfBirth
      membershipDate
      occupation
      maritalStatus
      createdAt
      branchId
      rfidCardId
      branch {
        id
        name
      }
      spouse {
        id
        firstName
        lastName
      }
      parent {
        id
        firstName
        lastName
      }
      children {
        id
        firstName
        lastName
      }
      families { id name }
      familyRelationships {
        id
        familyId
        memberId
        relationshipType
        member {
          id
          firstName
          lastName
          createdAt
          updatedAt
        }
        relatedMember {
          id
          firstName
          lastName
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      prayerRequests
      contributions
      groupMemberships
      attendanceRecords
      sacramentalRecords
      guardianProfile
      notifications
    }
  }
`;

// Query to fetch a single member by ID
export const GET_MEMBER = gql`
  query GetSingleMember($memberId: String!) {
    member(id: $memberId) {
      id
      firstName
      middleName
      lastName
      email
      phoneNumber
      status
      profileImageUrl
      gender
      dateOfBirth
      membershipDate
      occupation
      maritalStatus
      createdAt
      branchId
      rfidCardId
      branch {
        id
        name
      }
      spouse {
        id
        firstName
        lastName
      }
      parent {
        id
        firstName
        lastName
      }
      children {
        id
        firstName
        lastName
      }
      families { id name }
      familyRelationships {
        id
        familyId
        memberId
        relationshipType
        member {
          id
          firstName
          lastName
          createdAt
          updatedAt
        }
        relatedMember {
          id
          firstName
          lastName
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      prayerRequests
      contributions
      groupMemberships
      attendanceRecords
      sacramentalRecords
      guardianProfile
      notifications
    }
  }
`;

// Query to search for members by name, email, or phone number
export const SEARCH_MEMBERS = gql`
  query SearchMembers($search: String, $organisationId: String, $branchId: String) {
    members(search: $search, organisationId: $organisationId, branchId: $branchId) {
      id
      firstName
      lastName
      email
      phoneNumber
      rfidCardId
      branch {
        id
        name
      }
    }
  }
`;

// Query to fetch all skills
export const GET_SKILLS = gql`
  query GetSkills {
    skills {
      id
      name
      description
    }
  }
`;

// Query to get members count
export const GET_MEMBERS_COUNT = gql`
  query GetMembersCount($branchId: String, $organisationId: String) {
    membersCount(branchId: $branchId, organisationId: $organisationId)
  }
`;

// Query to fetch member statistics directly
export const GET_MEMBER_STATISTICS = gql`
  query GetMemberStatistics($branchId: String, $organisationId: String) {
    memberStatistics(branchId: $branchId, organisationId: $organisationId) {
      totalMembers
      activeMembers
      inactiveMembers
      newMembersInPeriod
      visitorsInPeriod
      lastMonth {
        totalMembers
        activeMembers
        inactiveMembers
        newMembersInPeriod
        visitorsInPeriod
      }
    }
  }
`;

// Query to fetch all interests
export const GET_INTERESTS = gql`
  query GetInterests {
    interests {
      id
      name
      description
    }
  }
`;

// Query to fetch members with RFID cards and all fields for Card Management List
export const GET_MEMBERS_WITH_CARDS_ALL_FIELDS = gql`
  query GetMembersWithCardsAllFields(
    $organisationId: String!
    $branchId: String
    $take: Int = 10
    $skip: Int = 0
  ) {
    members(
      hasRfidCard: true
      take: $take
      skip: $skip
      organisationId: $organisationId
      branchId: $branchId
    ) {
      id
      firstName
      middleName
      lastName
      email
      phoneNumber
      address
      city
      state
      postalCode
      country
      dateOfBirth
      gender
      maritalStatus
      occupation
      employerName
      status
      membershipDate
      baptismDate
      confirmationDate
      statusChangeDate
      statusChangeReason
      profileImageUrl
      customFields
      privacySettings
      notes
      rfidCardId
      branch {
        id
        name
      }
      branchId
      spouse {
        id
        firstName
        lastName
      }
      spouseId
      children {
        id
        firstName
        lastName
      }
      parent {
        id
        firstName
        lastName
      }
      parentId
      createdAt
      updatedAt
    }
  }
`;

export const GET_MEMBER_DASHBOARD = gql`
  query GetMemberDashboard($memberId: String!) {
    memberDashboard(memberId: $memberId) {
      id
      firstName
      lastName
      profileImageUrl
      membershipStatus
      membershipDate
      stats {
        groups
        attendance
        giving
      }
      upcomingEvents {
        id
        name
        date
        location
      }
      groups {
        id
        name
        role
      }
      milestones {
        baptismDate
        confirmationDate
      }
    }
  }
`;
