import { gql } from "@apollo/client";

// ==================== QUERIES ====================

export const GET_PAYMENT_SETTINGS = gql`
  query GetPaymentSettings {
    paymentSettings {
      id
      branchId
      country
      currency
      autoReceipt
      feeBearer
      gateways
      enabledMethods
      createdAt
      updatedAt
    }
  }
`;

// ==================== MUTATIONS ====================

export const UPDATE_PAYMENT_SETTINGS = gql`
  mutation UpdatePaymentSettings($input: UpdatePaymentSettingsInput!) {
    updatePaymentSettings(input: $input) {
      id
      branchId
      autoReceipt
      feeBearer
      gateways
      enabledMethods
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PAYMENT_GATEWAY = gql`
  mutation UpdatePaymentGateway($input: UpdateGatewayInput!) {
    updatePaymentGateway(input: $input) {
      id
      branchId
      autoReceipt
      feeBearer
      gateways
      enabledMethods
      createdAt
      updatedAt
    }
  }
`;

export const VALIDATE_PAYMENT_GATEWAY = gql`
  mutation ValidatePaymentGateway($input: ValidateGatewayInput!) {
    validatePaymentGateway(input: $input)
  }
`;

// ==================== TYPES ====================

export interface PaymentSettings {
  id: string;
  branchId: string;
  country: string;
  currency: string;
  autoReceipt: boolean;
  feeBearer?: string;
  gateways?: Record<string, any>;
  enabledMethods?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePaymentSettingsInput {
  autoReceipt?: boolean;
  feeBearer?: string;
  enabledMethods?: string[];
}

export interface UpdateGatewayInput {
  gateway: string;
  config: Record<string, any>;
}

export interface ValidateGatewayInput {
  gateway: string;
  credentials: Record<string, any>;
}
