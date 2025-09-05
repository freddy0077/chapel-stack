import { gql } from "@apollo/client";

export const CREATE_BRANCH_SETTING = gql`
  mutation createBranchSetting($input: CreateSettingInput!) {
    createBranchSetting(input: $input) {
      id
      key
      value
      branchId
    }
  }
`;

export const UPDATE_SETTING = gql`
  mutation updateSetting($id: ID!, $input: UpdateSettingInput!) {
    updateSetting(id: $id, input: $input) {
      id
      key
      value
      branchId
    }
  }
`;

export const REMOVE_SETTING = gql`
  mutation removeSetting($id: ID!) {
    removeSetting(id: $id) {
      id
      key
      value
      branchId
    }
  }
`;
