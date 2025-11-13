import { gql } from "@apollo/client";

// ==================== QUERIES ====================

export const GET_MODULE_SETTINGS = gql`
  query GetModuleSettings {
    moduleSettings {
      id
      branchId
      membersEnabled
      eventsEnabled
      donationsEnabled
      financeEnabled
      broadcastsEnabled
      groupsEnabled
      attendanceEnabled
      reportsEnabled
      mobileAppEnabled
      smsEnabled
      emailEnabled
      certificatesEnabled
      createdAt
      updatedAt
    }
  }
`;

export const GET_ENABLED_MODULES = gql`
  query GetEnabledModules {
    enabledModules {
      modules
    }
  }
`;

// ==================== MUTATIONS ====================

export const UPDATE_MODULE_SETTINGS = gql`
  mutation UpdateModuleSettings($input: UpdateModuleSettingsInput!) {
    updateModuleSettings(input: $input) {
      id
      branchId
      membersEnabled
      eventsEnabled
      donationsEnabled
      financeEnabled
      broadcastsEnabled
      groupsEnabled
      attendanceEnabled
      reportsEnabled
      mobileAppEnabled
      smsEnabled
      emailEnabled
      certificatesEnabled
      createdAt
      updatedAt
    }
  }
`;

export const TOGGLE_MODULE = gql`
  mutation ToggleModule($input: ToggleModuleInput!) {
    toggleModule(input: $input) {
      id
      branchId
      membersEnabled
      eventsEnabled
      donationsEnabled
      financeEnabled
      broadcastsEnabled
      groupsEnabled
      attendanceEnabled
      reportsEnabled
      mobileAppEnabled
      smsEnabled
      emailEnabled
      certificatesEnabled
      createdAt
      updatedAt
    }
  }
`;

// ==================== TYPES ====================

export interface ModuleSettings {
  id: string;
  branchId: string;
  membersEnabled: boolean;
  eventsEnabled: boolean;
  donationsEnabled: boolean;
  financeEnabled: boolean;
  broadcastsEnabled: boolean;
  groupsEnabled: boolean;
  attendanceEnabled: boolean;
  reportsEnabled: boolean;
  mobileAppEnabled: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  certificatesEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EnabledModules {
  modules: string[];
}

export interface UpdateModuleSettingsInput {
  membersEnabled?: boolean;
  eventsEnabled?: boolean;
  donationsEnabled?: boolean;
  financeEnabled?: boolean;
  broadcastsEnabled?: boolean;
  groupsEnabled?: boolean;
  attendanceEnabled?: boolean;
  reportsEnabled?: boolean;
  mobileAppEnabled?: boolean;
  smsEnabled?: boolean;
  emailEnabled?: boolean;
  certificatesEnabled?: boolean;
}

export interface ToggleModuleInput {
  moduleName: string;
  enabled: boolean;
}
