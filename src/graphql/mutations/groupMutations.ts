import { gql } from '@apollo/client';

// Mutation to create a new small group
export const CREATE_SMALL_GROUP = gql`
  mutation CreateSmallGroup(
    $name: String!,
    $description: String,
    $type: String!,
    $meetingSchedule: String,
    $location: String,
    $maximumCapacity: Int,
    $status: String!,
    $branchId: String,
    $ministryId: String,
    $organisationId: String
  ) {
    createSmallGroup(input: {
      name: $name
      description: $description
      type: $type
      meetingSchedule: $meetingSchedule
      location: $location
      maximumCapacity: $maximumCapacity
      status: $status
      branchId: $branchId
      ministryId: $ministryId
      organisationId: $organisationId
    }) {
      id
      name
      description
      type
      meetingSchedule
      location
      maximumCapacity
      status
      branchId
      ministryId
      organisationId
      createdAt
      updatedAt
      members {
        id
        role
        status
        member {
          id
          firstName
          lastName
          profileImageUrl
        }
      }
      ministry {
        id
        name
      }
    }
  }
`;

// Mutation to update an existing small group
export const UPDATE_SMALL_GROUP = gql`
  mutation UpdateSmallGroup($id: ID!, $input: UpdateSmallGroupInput!) {
    updateSmallGroup(id: $id, input: $input) {
      id
      name
      description
      type
      meetingSchedule
      location
      maximumCapacity
      status
      ministryId
      createdAt
      updatedAt
    }
  }
`;

// Mutation to delete a small group
export const DELETE_SMALL_GROUP = gql`
  mutation DeleteSmallGroup($id: ID!) {
    deleteSmallGroup(id: $id) {
      success
      message
    }
  }
`;

// Mutation to add a member to a small group
export const ADD_MEMBER_TO_GROUP = gql`
  mutation AddMemberToGroup(
    $groupId: ID!,
    $memberId: ID!,
    $roleInGroup: String!
  ) {
    addMemberToGroup(
      groupId: $groupId,
      memberId: $memberId,
      roleInGroup: $roleInGroup
    ) {
      id
      role
      joinDate
      status
      memberId
      smallGroupId
      createdAt
      updatedAt
    }
  }
`;

// Mutation to remove a member from a small group
export const REMOVE_MEMBER_FROM_GROUP = gql`
  mutation RemoveMemberFromGroup($id: ID!) {
    removeGroupMember(id: $id) {
      success
      message
    }
  }
`;

// Mutation to update a member's role in a small group
export const UPDATE_GROUP_MEMBER = gql`
  mutation UpdateGroupMember($id: ID!, $input: UpdateGroupMemberInput!) {
    updateGroupMember(id: $id, input: $input) {
      id
      role
      joinDate
      status
      memberId
      smallGroupId
      createdAt
      updatedAt
    }
  }
`;
