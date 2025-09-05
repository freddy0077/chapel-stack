import { gql } from "@apollo/client";

// Mutation to create a new member
export const CREATE_MEMBER = gql`
  mutation CreateMember($input: CreateMemberInput!) {
    createMember(input: $input) {
      id
      firstName
      lastName
      email
      status
      membershipNumber
      primaryBranch {
        id
        name
      }
      customFields
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
      createdAt
    }
  }
`;

// Mutation to update an existing member
export const UPDATE_MEMBER = gql`
  mutation UpdateMember($id: String!, $updateMemberInput: UpdateMemberInput!) {
    updateMember(id: $id, updateMemberInput: $updateMemberInput) {
      id
      firstName
      middleName
      lastName
      email
      phoneNumber
      address
      status
      profileImageUrl
      customFields
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
      specialGifts
      groupMemberships {
        id
        role
        ministry {
          id
          name
        }
        smallGroup {
          id
          name
        }
      }
      updatedAt
    }
  }
`;

// Mutation to delete a member
export const DELETE_MEMBER = gql`
  mutation DeleteMember($id: ID!) {
    deleteMember(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

// Mutation to update a member's emergency contact
export const UPDATE_EMERGENCY_CONTACT = gql`
  mutation UpdateEmergencyContact(
    $memberId: ID!
    $input: EmergencyContactInput!
  ) {
    updateEmergencyContact(memberId: $memberId, input: $input) {
      id
      emergencyContact {
        name
        relationship
        phoneNumber
        alternatePhone
        email
      }
    }
  }
`;

// Mutation to add skills to a member
export const ADD_SKILLS_TO_MEMBER = gql`
  mutation AddSkillsToMember($memberId: ID!, $skillIds: [ID!]!) {
    addSkillsToMember(memberId: $memberId, skillIds: $skillIds) {
      id
      skills {
        id
        name
      }
    }
  }
`;

// Mutation to add interests to a member
export const ADD_INTERESTS_TO_MEMBER = gql`
  mutation AddInterestsToMember($memberId: ID!, $interestIds: [ID!]!) {
    addInterestsToMember(memberId: $memberId, interestIds: $interestIds) {
      id
      interests {
        id
        name
      }
    }
  }
`;

// Mutation to assign RFID card to a member
export const ASSIGN_RFID_CARD_TO_MEMBER = gql`
  mutation AssignRfidCardToMember($assignRfidCardInput: AssignRfidCardInput!) {
    assignRfidCardToMember(assignRfidCardInput: $assignRfidCardInput) {
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
      notes
      memberId
      customFields
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
      branch {
        id
        name
      }
      spouse {
        id
        firstName
      }
      createdAt
      updatedAt
    }
  }
`;

// Mutation to get a presigned URL for file uploads
export const GET_PRESIGNED_UPLOAD_URL = gql`
  mutation GetPresignedUploadUrl($input: FileUploadInput!) {
    getPresignedUploadUrl(input: $input) {
      uploadUrl
      fileUrl
      mediaItemId
    }
  }
`;
