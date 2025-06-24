import { gql } from "@apollo/client";

export const GET_BAPTISM_RECORDS = gql`
  query GetBaptismRecords($branchId: String) {
    sacramentalRecords(filter: { sacramentType: BAPTISM, branchId: $branchId }) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateUrl
      createdAt
      updatedAt
    }
  }
`;

export const GET_COMMUNION_RECORDS = gql`
  query GetCommunionRecords($branchId: String) {
    sacramentalRecords(filter: { sacramentType: EUCHARIST_FIRST_COMMUNION, branchId: $branchId }) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateUrl
      createdAt
      updatedAt
    }
  }
`;

export const GET_CONFIRMATION_RECORDS = gql`
  query GetConfirmationRecords($branchId: String) {
    sacramentalRecords(filter: { sacramentType: CONFIRMATION, branchId: $branchId }) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateUrl
      createdAt
      updatedAt
    }
  }
`;

export const GET_MARRIAGE_RECORDS = gql`
  query GetMarriageRecords($branchId: String) {
    sacramentalRecords(filter: { sacramentType: MATRIMONY, branchId: $branchId }) {
      id
      memberId
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
