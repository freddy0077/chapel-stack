// Core Member Types
export interface Member {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  title?: string;
  email?: string;
  phoneNumber?: string;
  alternativeEmail?: string;
  alternativePhone?: string;
  alternatePhone?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  membershipStatus: MembershipStatus;
  membershipType?: MembershipType;
  status?: MemberStatus;
  profileImageUrl?: string;

  // Address Information
  address?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  district?: string;
  region?: string;
  digitalAddress?: string;
  landmark?: string;

  // Personal Information
  placeOfBirth?: string;
  nationality?: string;
  nlbNumber?: string;
  education?: string;
  occupation?: string;
  employerName?: string;

  // Family Information
  fatherName?: string;
  motherName?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;

  // Church Information
  organisationId: string;
  branchId?: string;
  membershipDate?: Date;
  joinDate?: Date;
  baptismDate?: Date;
  baptismLocation?: string;
  confirmationDate?: Date;
  salvationDate?: Date;
  lastAttendanceDate?: Date;

  // Family & Relationships
  spouseId?: string;
  parentId?: string;
  familyId?: string;
  headOfHousehold?: boolean;

  // Technology
  rfidCardId?: string;
  nfcId?: string;

  // Unified Member ID System (replaces RFID)
  memberId?: string;
  memberIdGeneratedAt?: string;

  // Physical Card Information
  cardIssued?: boolean;
  cardIssuedAt?: string;
  cardType?: string; // 'NFC', 'RFID', 'BARCODE', etc.

  // Status & Tracking
  isActive?: boolean;
  isRegularAttendee?: boolean;
  isDeactivated?: boolean;
  deactivatedAt?: Date;
  deactivatedBy?: string;
  deactivationReason?: string;
  statusChangeDate?: Date;
  statusChangeReason?: string;
  lastActivityDate?: Date;

  // Documents & Files
  affidavitUrl?: string;

  // GDPR & Communication
  consentDate?: Date;
  consentVersion?: string;
  dataRetentionDate?: Date;
  communicationPrefs?: CommunicationPreferences;
  privacyLevel?: PrivacyLevel;
  preferredLanguage?: string;

  // Additional Data
  notes?: string;
  specialGifts?: string;
  groupIds?: string[];
  customFields?: any;
  privacySettings?: any;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  lastModifiedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
  deletionReason?: string;
}

// Enums
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  UNKNOWN = "UNKNOWN",
  NOT_SPECIFIED = "NOT_SPECIFIED",
}

export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
  SEPARATED = "SEPARATED",
  UNKNOWN = "UNKNOWN",
}

export enum MembershipStatus {
  VISITOR = "VISITOR",
  REGULAR_ATTENDEE = "REGULAR_ATTENDEE",
  MEMBER = "MEMBER",
  ACTIVE_MEMBER = "ACTIVE_MEMBER",
  INACTIVE_MEMBER = "INACTIVE_MEMBER",
  TRANSFERRED = "TRANSFERRED",
  DECEASED = "DECEASED",
}

export enum MemberStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  TRANSFERRED = "TRANSFERRED",
  DECEASED = "DECEASED",
  REMOVED = "REMOVED",
}

export enum MembershipType {
  REGULAR = "REGULAR",
  ASSOCIATE = "ASSOCIATE",
  HONORARY = "HONORARY",
  YOUTH = "YOUTH",
  CHILD = "CHILD",
  SENIOR = "SENIOR",
  CLERGY = "CLERGY",
}

export enum PrivacyLevel {
  PUBLIC = "PUBLIC",
  STANDARD = "STANDARD",
  RESTRICTED = "RESTRICTED",
  PRIVATE = "PRIVATE",
}

// Enhanced filter interfaces
export interface MemberFilters {
  // All filters are now backend-powered for optimal performance
  branchId?: string;
  organisationId?: string;
  hasMemberId?: boolean; // Unified member ID system (replaces RFID)
  search?: string;

  // Demographic filters (server-side)
  gender?: Gender[];
  maritalStatus?: MaritalStatus[];
  membershipStatus?: MembershipStatus[];
  memberStatus?: MemberStatus[];
  ageRange?: {
    min?: number;
    max?: number;
  };
  dateRange?: {
    joinedAfter?: string;
    joinedBefore?: string;
  };

  // Profile completeness filters (server-side)
  hasProfileImage?: boolean;
  hasEmail?: boolean;
  hasPhone?: boolean;
  isRegularAttendee?: boolean;
  isDeactivated?: boolean;
}

// Filter options for UI
export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  title: string;
  key: keyof MemberFilters;
  type: "select" | "multiselect" | "range" | "daterange" | "boolean";
  options?: FilterOption[];
  placeholder?: string;
}

// Communication Preferences
export interface CommunicationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  phoneCallsAllowed: boolean;
  mailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  eventReminders: boolean;
  newsletterSubscription: boolean;
  emergencyContactOnly: boolean;
  doNotDisturb: boolean;
  preferredContactTime: string;
  communicationFrequency: string;
}

// View and Display Types
export type ViewMode = "list" | "card" | "table" | "grid";

export type BulkActionType =
  | "updateStatus"
  | "transfer"
  | "assignRfid"
  | "export"
  | "deactivate"
  | "addToGroup"
  | "removeFromGroup"
  | "addToMinistry"
  | "removeFromMinistry"
  | "recordSacrament";

export type SortField =
  | "firstName"
  | "lastName"
  | "email"
  | "joinDate"
  | "lastActivityDate"
  | "membershipStatus"
  | "dateOfBirth";

export type SortDirection = "asc" | "desc";

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// Pagination Types
export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

// Statistics Types
export interface MemberStatistics {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  visitors: number;
  newMembersThisMonth: number;
  newMembersThisYear: number;
  averageAge: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  maritalStatusDistribution: {
    single: number;
    married: number;
    divorced: number;
    widowed: number;
    other: number;
  };
  membershipStatusDistribution: {
    active: number;
    inactive: number;
    visitor: number;
    member: number;
    deactivated: number;
    transferred: number;
  };
  growthRate: number;
  retentionRate: number;
}

// Form Types
export interface CreateMemberInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  title?: string;
  email?: string;
  phoneNumber?: string;
  alternatePhone?: string;
  dateOfBirth?: Date;
  placeOfBirth?: string;
  nationality?: string;
  nlbNumber?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  membershipStatus: MembershipStatus;
  membershipType?: MembershipType;

  // Address
  address?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  district?: string;
  region?: string;
  digitalAddress?: string;
  landmark?: string;

  // Church Information
  organisationId: string;
  branchId?: string;
  membershipDate?: Date;
  baptismDate?: Date;
  confirmationDate?: Date;

  // Family Info
  fatherName?: string;
  motherName?: string;
  fatherOccupation?: string;
  motherOccupation?: string;

  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;

  // Family
  spouseId?: string;
  parentId?: string;
  familyId?: string;

  // Additional
  isRegularAttendee?: boolean;
  headOfHousehold?: boolean;
  specialGifts?: string;
  groupIds?: string[];

  // GDPR
  consentDate?: Date;
  consentVersion?: string;
  communicationPrefs?: CommunicationPreferences;
  privacyLevel?: PrivacyLevel;
}

export interface UpdateMemberInput extends Partial<Member> {
  id: string;
}

// Bulk Operations
export interface BulkActionData {
  type: BulkActionType;
  memberIds: string[];
  data?: any;
}

// Search and Query Types
export interface MemberSearchParams {
  search?: string;
  filters?: MemberFilters;
  sort?: SortConfig;
  pageSize?: number;
  cursor?: string;
}

export interface MemberQueryResult {
  members: Member[];
  pageInfo: PaginationInfo;
  totalCount: number;
  loading: boolean;
  error?: Error;
}

// UI State Types
export interface MemberUIState {
  viewMode: ViewMode;
  selectedMembers: string[];
  showFilters: boolean;
  showBulkActions: boolean;
  searchQuery: string;
  filters: MemberFilters;
  sort: SortConfig;
  currentPage: number;
  pageSize: number;
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface MemberModalProps extends ModalProps {
  member?: Member;
  onSuccess?: (member: Member) => void;
}

// Component Props Types
export interface MemberCardProps {
  member: Member;
  selected?: boolean;
  onSelect?: (memberId: string) => void;
  onEdit?: (member: Member) => void;
  onView?: (member: Member) => void;
  showActions?: boolean;
  compact?: boolean;
}

export interface MemberListProps {
  members: Member[];
  loading: boolean;
  viewMode: ViewMode;
  selectedMembers: string[];
  onSelectMember: (memberId: string) => void;
  onSelectAll: () => void;
  onViewMember?: (member: Member) => void;
  onEditMember?: (member: Member) => void;
  onManageFamily?: (member: Member) => void;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onLoadMore?: () => void;
}

// Export all types
export type {
  Member,
  MemberFilters,
  FilterOption,
  FilterGroup,
  CommunicationPreferences,
  ViewMode,
  BulkActionType,
  SortField,
  SortDirection,
  SortConfig,
  PaginationInfo,
  MemberStatistics,
  CreateMemberInput,
  UpdateMemberInput,
  BulkActionData,
  MemberSearchParams,
  MemberQueryResult,
  MemberUIState,
  ModalProps,
  MemberModalProps,
  MemberCardProps,
  MemberListProps,
};
