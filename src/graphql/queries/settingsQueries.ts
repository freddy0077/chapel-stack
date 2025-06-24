import { gql } from '@apollo/client';

export const GET_SETTINGS = gql`
  query settings($branchId: String) {
    settings(branchId: $branchId) {
      id
      key
      value
      branchId
    }
  }
`;

export const GET_SETTING_BY_ID = gql`
  query setting($id: String!) {
    setting(id: $id) {
      id
      key
      value
      branchId
    }
  }
`;

export const GET_SETTING_BY_KEY = gql`
  query settingByKey($key: String!, $branchId: String) {
    settingByKey(key: $key, branchId: $branchId) {
      id
      key
      value
      branchId
    }
  }
`;
