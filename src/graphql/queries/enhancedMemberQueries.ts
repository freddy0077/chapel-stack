import { gql } from "@apollo/client";

// Enhanced GET_MEMBER query with basic fields
export const GET_MEMBER_ENHANCED = gql`
  query GetMemberEnhanced($memberId: String!) {
    member(id: $memberId) {
      id
      firstName
      middleName
      lastName
      title
      email
      phoneNumber
      address
      city
      state
      postalCode
      country
      nationality
      placeOfBirth
      nlbNumber
      status
      profileImageUrl
      gender
      dateOfBirth
      membershipDate
      baptismDate
      confirmationDate
      occupation
      employerName
      maritalStatus
      fatherName
      motherName
      fatherOccupation
      motherOccupation
      emergencyContactName
      emergencyContactPhone
      notes
      createdAt
      updatedAt
      branchId
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
    }
  }
`;

// Enhanced GET_MEMBERS query with basic fields for list views
export const GET_MEMBERS_ENHANCED = gql`
  query GetMembersEnhanced(
    $filter: UserFilterInput
    $pagination: PaginationInput
  ) {
    members(filter: $filter, pagination: $pagination) {
      items {
        id
        firstName
        middleName
        lastName
        title
        email
        phoneNumber
        address
        city
        state
        postalCode
        country
        nationality
        placeOfBirth
        nlbNumber
        status
        profileImageUrl
        gender
        dateOfBirth
        membershipDate
        baptismDate
        confirmationDate
        occupation
        employerName
        maritalStatus
        fatherName
        motherName
        fatherOccupation
        motherOccupation
        emergencyContactName
        emergencyContactPhone
        notes
        createdAt
        updatedAt
        branchId
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
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
`;

// Enhanced search query with basic fields
export const SEARCH_MEMBERS_ENHANCED = gql`
  query SearchMembersEnhanced(
    $search: String
    $organisationId: String
    $branchId: String
  ) {
    members(
      search: $search
      organisationId: $organisationId
      branchId: $branchId
    ) {
      id
      firstName
      middleName
      lastName
      title
      email
      phoneNumber
      nationality
      placeOfBirth
      nlbNumber
      profileImageUrl
      gender
      dateOfBirth
      maritalStatus
      occupation
      emergencyContactName
      emergencyContactPhone
      status
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
    }
  }
`;

// Query for member cards with basic fields
export const GET_MEMBERS_CARDS_ENHANCED = gql`
  query GetMembersCardsEnhanced(
    $organisationId: String
    $branchId: String
    $limit: Int
    $offset: Int
  ) {
    members(
      organisationId: $organisationId
      branchId: $branchId
      limit: $limit
      offset: $offset
    ) {
      id
      firstName
      middleName
      lastName
      title
      email
      phoneNumber
      profileImageUrl
      gender
      dateOfBirth
      maritalStatus
      occupation
      status
      membershipDate
      nationality
      emergencyContactName
      emergencyContactPhone
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
    }
  }
`;
