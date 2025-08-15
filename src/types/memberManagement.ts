// Enhanced Member Management Types

export interface EnhancedMember {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  title?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  nationality?: string;
  placeOfBirth?: string;
  nlbNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  employerName?: string;
  
  // Family Information
  fatherName?: string;
  motherName?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  
  // Affidavit Upload
  affidavitUrl?: string;
  
  // Status and Deactivation
  status: string;
  isDeactivated: boolean;
  deactivatedAt?: string;
  deactivatedBy?: string;
  deactivationReason?: string;
  
  // Standard fields
  membershipDate?: string;
  baptismDate?: string;
  confirmationDate?: string;
  statusChangeDate?: string;
  statusChangeReason?: string;
  profileImageUrl?: string;
  customFields?: any;
  privacySettings?: any;
  notes?: string;
  
  // Relations
  branch?: {
    id: string;
    name: string;
  };
  branchId: string;
  spouse?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  spouseId?: string;
  parent?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  parentId?: string;
  children?: Array<{
    id: string;
    firstName: string;
    lastName: string;
  }>;
  
  rfidCardId?: string;
  createdAt: string;
  updatedAt: string;
}

// Family Management Types
export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  relationshipType: string;
  dateOfBirth?: string;
  gender?: string;
  status: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
}

export interface FamilySummary {
  id: string;
  name: string;
  headOfFamily?: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phoneNumber?: string;
    profileImageUrl?: string;
  };
  members: FamilyMember[];
  memberCount: number;
  childrenCount: number;
  adultsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyQueryResult {
  families: FamilySummary[];
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FamilyStatistics {
  totalFamilies: number;
  totalMembers: number;
  averageFamilySize: number;
  familiesWithChildren: number;
  singleMemberFamilies: number;
}

// Member View Options Types
export enum MemberViewMode {
  LIST = 'LIST',
  CARD = 'CARD',
  TABLE = 'TABLE',
  GRID = 'GRID',
}

export enum MemberSortField {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
  PHONE_NUMBER = 'phoneNumber',
  STATUS = 'status',
  MEMBERSHIP_DATE = 'membershipDate',
  DATE_OF_BIRTH = 'dateOfBirth',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  BRANCH_NAME = 'branch.name',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export interface MemberViewOptionsInput {
  viewMode?: MemberViewMode;
  sortField?: MemberSortField;
  sortOrder?: SortOrder;
  search?: string;
  organisationId?: string;
  branchId?: string;
  status?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  skip?: number;
  take?: number;
  includeDeactivated?: boolean;
}

// Member View Result Types
export interface MemberListItem {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  status: string;
  profileImageUrl?: string;
}

export interface MemberCardItem extends MemberListItem {
  dateOfBirth?: string;
  gender?: string;
  membershipDate?: string;
  branchName?: string;
}

export interface MemberTableItem extends MemberCardItem {
  occupation?: string;
  maritalStatus?: string;
  createdAt: string;
}

export interface MemberGridItem {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  status: string;
}

export interface MemberViewPagination {
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface MemberViewResult {
  members: Array<MemberListItem | MemberCardItem | MemberTableItem | MemberGridItem>;
  pagination: MemberViewPagination;
}

// Input Types for Mutations
export interface DeactivateMemberInput {
  memberId: string;
  reason: string;
}

export interface ReactivateMemberInput {
  memberId: string;
}

export interface PermanentlyDeleteMemberInput {
  memberId: string;
}

export interface UploadAffidavitInput {
  memberId: string;
  file: File;
  reason: string;
}

export interface FamilyQueryInput {
  organisationId?: string;
  branchId?: string;
  search?: string;
  skip?: number;
  take?: number;
  includeDeactivatedMembers?: boolean;
}

// Enhanced Create Member Input
export interface EnhancedCreateMemberInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  title?: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  nationality?: string;
  placeOfBirth?: string;
  nlbNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  occupation?: string;
  employerName?: string;
  
  // Family Information
  fatherName?: string;
  motherName?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  
  // Required fields
  branchId: string;
  organisationId: string;
  
  // Optional fields
  spouseId?: string;
  parentId?: string;
  membershipDate?: string;
  baptismDate?: string;
  confirmationDate?: string;
  profileImageUrl?: string;
  notes?: string;
  customFields?: any;
  privacySettings?: any;
}

// Response Types
export interface MemberOperationResponse {
  success: boolean;
  message: string;
  member?: EnhancedMember;
}

export interface FamilyOperationResponse {
  success: boolean;
  message: string;
  family?: FamilySummary;
}

// Loading States
export interface MemberManagementLoading {
  deactivating: boolean;
  reactivating: boolean;
  deleting: boolean;
  uploading: boolean;
  loading: boolean;
}

// Error Types
export interface MemberManagementError {
  message: string;
  code?: string;
  field?: string;
}
