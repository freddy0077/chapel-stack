import { gql } from "@apollo/client";

// ==================== QUERIES ====================

export const GET_BACKUP_SETTINGS = gql`
  query GetBackupSettings {
    backupSettings {
      id
      branchId
      autoBackup
      frequency
      time
      storageType
      storageConfig
      retentionDays
      maxBackups
      encryptBackups
      notifyOnSuccess
      notifyOnFailure
      notificationEmails
      lastBackupAt
      lastBackupStatus
      createdAt
      updatedAt
    }
  }
`;

export const GET_BACKUPS = gql`
  query GetBackups($limit: Int) {
    backups(limit: $limit) {
      backups {
        id
        branchId
        filename
        fileSize
        storageLocation
        storagePath
        backupType
        status
        error
        checksum
        recordCount
        tablesBackedUp
        completedAt
        createdById
        createdAt
        updatedAt
      }
      total
    }
  }
`;

// ==================== MUTATIONS ====================

export const UPDATE_BACKUP_SETTINGS = gql`
  mutation UpdateBackupSettings($input: UpdateBackupSettingsInput!) {
    updateBackupSettings(input: $input) {
      id
      branchId
      autoBackup
      frequency
      time
      storageType
      storageConfig
      retentionDays
      maxBackups
      encryptBackups
      notifyOnSuccess
      notifyOnFailure
      notificationEmails
      lastBackupAt
      lastBackupStatus
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_BACKUP = gql`
  mutation CreateBackup {
    createBackup {
      id
      branchId
      filename
      fileSize
      storageLocation
      backupType
      status
      createdAt
    }
  }
`;

export const DELETE_BACKUP = gql`
  mutation DeleteBackup($id: ID!) {
    deleteBackup(id: $id)
  }
`;

export const RESTORE_BACKUP = gql`
  mutation RestoreBackup($input: RestoreBackupInput!) {
    restoreBackup(input: $input)
  }
`;

// ==================== TYPES ====================

export interface BackupSettings {
  id: string;
  branchId: string;
  autoBackup: boolean;
  frequency?: string;
  time?: string;
  storageType?: string;
  storageConfig?: Record<string, any>;
  retentionDays: number;
  maxBackups: number;
  encryptBackups: boolean;
  notifyOnSuccess: boolean;
  notifyOnFailure: boolean;
  notificationEmails?: string[];
  lastBackupAt?: string;
  lastBackupStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Backup {
  id: string;
  branchId: string;
  filename: string;
  fileSize: string;
  storageLocation: string;
  storagePath?: string;
  backupType: string;
  status: string;
  error?: string;
  checksum?: string;
  recordCount?: Record<string, any>;
  tablesBackedUp?: string[];
  completedAt?: string;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackupList {
  backups: Backup[];
  total: number;
}

export interface UpdateBackupSettingsInput {
  autoBackup?: boolean;
  frequency?: string;
  time?: string;
  storageType?: string;
  storageConfig?: Record<string, any>;
  retentionDays?: number;
  maxBackups?: number;
  encryptBackups?: boolean;
  encryptionKey?: string;
  notifyOnSuccess?: boolean;
  notifyOnFailure?: boolean;
  notificationEmails?: string[];
}

export interface RestoreBackupInput {
  backupId: string;
}
