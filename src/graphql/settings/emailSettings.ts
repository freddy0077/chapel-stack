import { gql } from "@apollo/client";

// ==================== QUERIES ====================

export const GET_EMAIL_SETTINGS = gql`
  query GetEmailSettings($branchId: String) {
    emailSettings(branchId: $branchId) {
      id
      branchId
      isActive
      smtpHost
      smtpPort
      smtpUsername
      smtpEncryption
      fromEmail
      fromName
      replyToEmail
      lastTested
      testResult
      createdAt
      updatedAt
    }
  }
`;

// ==================== MUTATIONS ====================

export const UPDATE_EMAIL_SETTINGS = gql`
  mutation UpdateEmailSettings($input: UpdateEmailSettingsInput!, $branchId: String) {
    updateEmailSettings(input: $input, branchId: $branchId) {
      id
      branchId
      isActive
      smtpHost
      smtpPort
      smtpUsername
      smtpEncryption
      fromEmail
      fromName
      replyToEmail
      lastTested
      testResult
      createdAt
      updatedAt
    }
  }
`;

export const TEST_EMAIL_CONNECTION = gql`
  mutation TestEmailConnection($branchId: String) {
    testEmailConnection(branchId: $branchId)
  }
`;

export const SEND_TEST_EMAIL = gql`
  mutation SendTestEmail($input: SendTestEmailInput!, $branchId: String) {
    sendTestEmail(input: $input, branchId: $branchId)
  }
`;

// ==================== TYPES ====================

export interface EmailSettings {
  id: string;
  branchId: string;
  isActive: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpEncryption?: 'NONE' | 'SSL' | 'TLS';
  fromEmail?: string;
  fromName?: string;
  replyToEmail?: string;
  lastTested?: string;
  testResult?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateEmailSettingsInput {
  isActive?: boolean;
  smtpHost?: string;
  smtpPort?: number;
  smtpUsername?: string;
  smtpPassword?: string;
  smtpEncryption?: 'NONE' | 'SSL' | 'TLS';
  fromEmail?: string;
  fromName?: string;
  replyToEmail?: string;
}

export interface SendTestEmailInput {
  toEmail: string;
}
