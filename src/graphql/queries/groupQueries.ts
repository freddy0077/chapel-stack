import { gql } from "@apollo/client";

// Query to get all small groups with details
export const GET_ALL_SMALL_GROUPS = gql`
  query GetAllSmallGroupsWithDetails {
    smallGroups {
      id
      name
      description
      type
      meetingSchedule
      location
      maximumCapacity
      status
      createdAt
      updatedAt
      ministry {
        id
        name
        description
        type
        status
        branchId
        createdAt
        updatedAt
      }
      members {
        id
        role
        joinDate
        status
        memberId
        createdAt
        updatedAt
      }
    }
  }
`;

// Query to get a single small group with details
export const GET_SINGLE_SMALL_GROUP = gql`
  query GetSingleSmallGroupWithDetails($id: ID!) {
    smallGroup(id: $id) {
      id
      name
      description
      type
      meetingSchedule
      location
      maximumCapacity
      status
      createdAt
      updatedAt
      ministry {
        id
        name
        description
        type
        status
        branchId
        createdAt
        updatedAt
      }
      members {
        id
        role
        joinDate
        status
        memberId
        createdAt
        updatedAt
      }
    }
  }
`;

// Query to get filtered small groups
export const GET_FILTERED_SMALL_GROUPS = gql`
  query GetFilteredSmallGroupsWithDetails($filters: SmallGroupFilterInput) {
    smallGroups(filters: $filters) {
      id
      name
      description
      type
      meetingSchedule
      location
      maximumCapacity
      status
      createdAt
      updatedAt
      branchId
      organisationId
      ministryId

      ministry {
        id
        name
        description
      }

      members {
        id
        role
        joinDate
        status
        memberId
        member {
          # This is the actual Member, included by the service
          id
          firstName
          lastName
          email
          profileImageUrl
          gender
          phoneNumber
          status
        }
      }
    }
  }
`;
