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
