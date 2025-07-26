import { gql } from "@apollo/client";

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
