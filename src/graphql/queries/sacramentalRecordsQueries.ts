import { gql } from "@apollo/client";

export const GET_BAPTISM_RECORDS = gql`
  query GetBaptismRecords($branchId: String) {
    sacramentalRecords(
      filter: { sacramentType: BAPTISM, branchId: $branchId }
    ) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateUrl
      godparent1Name
      godparent2Name
      certificateNumber
      notes
      member {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
        email
        phoneNumber
        profileImageUrl
        membershipDate
        status
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_COMMUNION_RECORDS = gql`
  query GetCommunionRecords($branchId: String) {
    sacramentalRecords(
      filter: { sacramentType: EUCHARIST_FIRST_COMMUNION, branchId: $branchId }
    ) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateUrl
      sponsorName
      certificateNumber
      notes
      member {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
        email
        phoneNumber
        profileImageUrl
        membershipDate
        status
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_CONFIRMATION_RECORDS = gql`
  query GetConfirmationRecords($branchId: String) {
    sacramentalRecords(
      filter: { sacramentType: CONFIRMATION, branchId: $branchId }
    ) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateUrl
      sponsorName
      certificateNumber
      notes
      member {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
        email
        phoneNumber
        profileImageUrl
        membershipDate
        status
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_MARRIAGE_RECORDS = gql`
  query GetMarriageRecords($branchId: String) {
    sacramentalRecords(
      filter: { sacramentType: MATRIMONY, branchId: $branchId }
    ) {
      id
      memberId
      sacramentType
      dateOfSacrament
      locationOfSacrament
      officiantName
      witness1Name
      witness2Name
      groomName
      brideName
      certificateNumber
      certificateUrl
      notes
      member {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
        email
        phoneNumber
        profileImageUrl
        membershipDate
        status
      }
      createdAt
      updatedAt
    }
  }
`;

// New queries with organization-based filtering

export const GET_FILTERED_BAPTISM_RECORDS = gql`
  query GetFilteredBaptismRecords($branchId: String, $organisationId: String) {
    sacramentalRecords(
      filter: {
        sacramentType: BAPTISM
        branchId: $branchId
        organisationId: $organisationId
      }
    ) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateUrl
      godparent1Name
      godparent2Name
      certificateNumber
      notes
      member {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
        email
        phoneNumber
        profileImageUrl
        membershipDate
        status
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_FILTERED_COMMUNION_RECORDS = gql`
  query GetFilteredCommunionRecords(
    $branchId: String
    $organisationId: String
  ) {
    sacramentalRecords(
      filter: {
        sacramentType: EUCHARIST_FIRST_COMMUNION
        branchId: $branchId
        organisationId: $organisationId
      }
    ) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateUrl
      sponsorName
      certificateNumber
      notes
      member {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
        email
        phoneNumber
        profileImageUrl
        membershipDate
        status
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_FILTERED_CONFIRMATION_RECORDS = gql`
  query GetFilteredConfirmationRecords(
    $branchId: String
    $organisationId: String
  ) {
    sacramentalRecords(
      filter: {
        sacramentType: CONFIRMATION
        branchId: $branchId
        organisationId: $organisationId
      }
    ) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateUrl
      sponsorName
      certificateNumber
      notes
      member {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
        email
        phoneNumber
        profileImageUrl
        membershipDate
        status
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_FILTERED_MARRIAGE_RECORDS = gql`
  query GetFilteredMarriageRecords($branchId: String, $organisationId: String) {
    sacramentalRecords(
      filter: {
        sacramentType: MATRIMONY
        branchId: $branchId
        organisationId: $organisationId
      }
    ) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateUrl
      witness1Name
      witness2Name
      groomName
      brideName
      certificateNumber
      notes
      member {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        gender
        email
        phoneNumber
        profileImageUrl
        membershipDate
        status
      }
      createdAt
      updatedAt
    }
  }
`;
