import { gql } from "@apollo/client";

// ==================== QUERIES ====================

export const GET_MOBILE_APP_SETTINGS = gql`
  query GetMobileAppSettings {
    mobileAppSettings {
      id
      branchId
      appName
      appIconUrl
      splashScreenUrl
      primaryColor
      secondaryColor
      firebaseConfig
      notificationPrefs
      enabledFeatures
      deepLinkDomain
      appStoreUrl
      playStoreUrl
      createdAt
      updatedAt
    }
  }
`;

// ==================== MUTATIONS ====================

export const UPDATE_MOBILE_APP_SETTINGS = gql`
  mutation UpdateMobileAppSettings($input: UpdateMobileAppSettingsInput!) {
    updateMobileAppSettings(input: $input) {
      id
      branchId
      appName
      appIconUrl
      splashScreenUrl
      primaryColor
      secondaryColor
      firebaseConfig
      notificationPrefs
      enabledFeatures
      deepLinkDomain
      appStoreUrl
      playStoreUrl
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_APP_BRANDING = gql`
  mutation UpdateAppBranding($input: UpdateAppBrandingInput!) {
    updateAppBranding(input: $input) {
      id
      branchId
      appName
      appIconUrl
      splashScreenUrl
      primaryColor
      secondaryColor
      createdAt
      updatedAt
    }
  }
`;

export const TOGGLE_APP_FEATURE = gql`
  mutation ToggleAppFeature($input: ToggleAppFeatureInput!) {
    toggleAppFeature(input: $input) {
      id
      branchId
      enabledFeatures
      createdAt
      updatedAt
    }
  }
`;

// ==================== TYPES ====================

export interface MobileAppSettings {
  id: string;
  branchId: string;
  appName?: string;
  appIconUrl?: string;
  splashScreenUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  firebaseConfig?: Record<string, any>;
  notificationPrefs?: Record<string, any>;
  enabledFeatures?: string[];
  deepLinkDomain?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateMobileAppSettingsInput {
  appName?: string;
  appIconUrl?: string;
  splashScreenUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  firebaseConfig?: Record<string, any>;
  notificationPrefs?: Record<string, any>;
  enabledFeatures?: string[];
  deepLinkDomain?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}

export interface UpdateAppBrandingInput {
  appName?: string;
  appIconUrl?: string;
  splashScreenUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface ToggleAppFeatureInput {
  featureName: string;
  enabled: boolean;
}
