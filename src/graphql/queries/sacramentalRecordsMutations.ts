import { gql } from "@apollo/client";

// Universal mutation for creating any sacramental record
export const CREATE_SACRAMENTAL_RECORD = gql`
  mutation CreateSacramentalRecord($input: CreateSacramentalRecordInput!) {
    createSacramentalRecord(input: $input) {
      id
      memberId
      sacramentType
      dateOfSacrament
      locationOfSacrament
      officiantName
      officiantId
      # NEW: Marriage-specific member relationship fields
      groomMemberId
      brideMemberId
      # NEW: Witness member relationship fields
      witness1MemberId
      witness2MemberId
      godparent1Name
      godparent2Name
      sponsorName
      witness1Name
      witness2Name
      groomName
      brideName
      certificateNumber
      certificateUrl
      notes
      branchId
      organisationId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_BAPTISM_RECORD = gql`
  mutation CreateBaptismRecord($input: CreateSacramentalRecordInput!) {
    createSacramentalRecord(input: $input) {
      id
      sacramentType
      dateOfSacrament
      locationOfSacrament
      officiantName
      godparent1Name
      godparent2Name
      certificateNumber
      certificateUrl
      notes
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_FIRST_COMMUNION_RECORD = gql`
  mutation CreateFirstCommunionRecord($input: CreateSacramentalRecordInput!) {
    createSacramentalRecord(input: $input) {
      id
      sacramentType
      dateOfSacrament
      locationOfSacrament
      officiantName
      sponsorName
      certificateNumber
      certificateUrl
      notes
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CONFIRMATION_RECORD = gql`
  mutation CreateConfirmationRecord($input: CreateSacramentalRecordInput!) {
    createSacramentalRecord(input: $input) {
      id
      sacramentType
      dateOfSacrament
      locationOfSacrament
      officiantName
      sponsorName
      certificateNumber
      certificateUrl
      notes
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_MATRIMONY_RECORD = gql`
  mutation CreateMatrimonyRecord($input: CreateSacramentalRecordInput!) {
    createSacramentalRecord(input: $input) {
      id
      sacramentType
      dateOfSacrament
      locationOfSacrament
      officiantName
      witness1Name
      witness2Name
      certificateNumber
      certificateUrl
      notes
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SACRAMENTAL_RECORD = gql`
  mutation UpdateSacramentalRecord($input: UpdateSacramentalRecordInput!) {
    updateSacramentalRecord(input: $input) {
      id
      sacramentType
      dateOfSacrament
      locationOfSacrament
      officiantName
      godparent1Name
      godparent2Name
      sponsorName
      certificateNumber
      certificateUrl
      notes
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_SACRAMENTAL_RECORD = gql`
  mutation DeleteSacramentalRecord($id: ID!) {
    deleteSacramentalRecord(id: $id) {
      id
    }
  }
`;
