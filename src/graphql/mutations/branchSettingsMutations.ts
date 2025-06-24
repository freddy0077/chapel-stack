import { gql } from '@apollo/client';

export const CREATE_BRANCH_SETTING = gql`
  mutation CreateBranchSetting($input: CreateSettingInput!) {
    createBranchSetting(input: $input) {
      id
      key
      value
      branchId
      createdAt
      updatedAt
    }
  }
`;
