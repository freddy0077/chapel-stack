import { gql } from '@apollo/client';

// Use existing createMember mutation for bulk import
export const CREATE_MEMBER = gql`
  mutation CreateMember($createMemberInput: CreateMemberInput!) {
    createMember(createMemberInput: $createMemberInput) {
      id
      firstName
      lastName
      email
      phoneNumber
      membershipStatus
    }
  }
`;

// Future import mutation (when backend schema is regenerated)
export const IMPORT_MEMBERS = gql`
  mutation ImportMembers($importMembersInput: ImportMembersInput!) {
    importMembers(importMembersInput: $importMembersInput) {
      totalProcessed
      successCount
      errorCount
      skippedCount
      summary
      results {
        id
        firstName
        lastName
        email
        success
        error
        row
      }
      errors {
        row
        field
        message
        value
      }
    }
  }
`;

// Input type for createMember mutation
export interface CreateMemberInput {
  branchId: string;
  organisationId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  alternativeEmail?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'NOT_SPECIFIED';
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'SEPARATED' | 'ENGAGED' | 'UNKNOWN';
  occupation?: string;
  employerName?: string;
  education?: string;
  membershipStatus?: 'VISITOR' | 'REGULAR_ATTENDEE' | 'MEMBER' | 'ACTIVE_MEMBER' | 'INACTIVE_MEMBER';
  membershipType?: 'REGULAR' | 'ASSOCIATE' | 'HONORARY' | 'YOUTH' | 'CHILD' | 'SENIOR' | 'CLERGY';
  membershipDate?: string;
  baptismDate?: string;
  baptismLocation?: string;
  confirmationDate?: string;
  salvationDate?: string;
  notes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  fatherName?: string;
  motherName?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
}

export interface ImportMemberData {
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  alternativeEmail?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'NOT_SPECIFIED';
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | 'SEPARATED' | 'ENGAGED' | 'UNKNOWN';
  occupation?: string;
  employerName?: string;
  education?: string;
  membershipStatus?: 'VISITOR' | 'REGULAR_ATTENDEE' | 'MEMBER' | 'ACTIVE_MEMBER' | 'INACTIVE_MEMBER';
  membershipType?: 'REGULAR' | 'ASSOCIATE' | 'HONORARY' | 'YOUTH' | 'CHILD' | 'SENIOR' | 'CLERGY';
  membershipDate?: string;
  baptismDate?: string;
  baptismLocation?: string;
  confirmationDate?: string;
  salvationDate?: string;
  notes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  fatherName?: string;
  motherName?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
}

export interface ImportMembersInput {
  branchId: string;
  organisationId: string;
  members: ImportMemberData[];
  skipDuplicates?: boolean;
  updateExisting?: boolean;
}

// Options for bulk import
export interface ImportOptions {
  skipDuplicates: boolean;
  updateExisting: boolean;
}

export interface ImportMemberResult {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  success: boolean;
  error?: string;
  row: number;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

export interface ImportMembersResult {
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  skippedCount: number;
  results: ImportMemberResult[];
  errors: ImportError[];
  summary?: string;
}
