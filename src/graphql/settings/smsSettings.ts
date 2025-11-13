import { gql } from "@apollo/client";

// ==================== QUERIES ====================

export const GET_SMS_SETTINGS = gql`
  query GetSmsSettings {
    smsSettings {
      id
      branchId
      isActive
      provider
      senderId
      webhookUrl
      lastTested
      testResult
      createdAt
      updatedAt
    }
  }
`;

// ==================== MUTATIONS ====================

export const UPDATE_SMS_SETTINGS = gql`
  mutation UpdateSmsSettings($input: UpdateSmsSettingsInput!) {
    updateSmsSettings(input: $input) {
      id
      branchId
      isActive
      provider
      senderId
      webhookUrl
      lastTested
      testResult
      createdAt
      updatedAt
    }
  }
`;

export const TEST_SMS_CONNECTION = gql`
  mutation TestSmsConnection {
    testSmsConnection
  }
`;

export const SEND_TEST_SMS = gql`
  mutation SendTestSms($input: SendTestSmsInput!) {
    sendTestSms(input: $input)
  }
`;

// ==================== TYPES ====================

export interface SmsSettings {
  id: string;
  branchId: string;
  isActive: boolean;
  provider?: string;
  senderId?: string;
  webhookUrl?: string;
  lastTested?: string;
  testResult?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSmsSettingsInput {
  isActive?: boolean;
  provider?: string;
  apiKey?: string;
  apiSecret?: string;
  senderId?: string;
  webhookUrl?: string;
}

export interface SendTestSmsInput {
  phoneNumber: string;
}
