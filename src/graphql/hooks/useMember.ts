import { useQuery, useMutation } from "@apollo/client";
import { GET_MEMBERS_LIST, GET_MEMBER, GET_MEMBERS_WITH_CARDS_ALL_FIELDS } from "../queries/memberQueries";
import { GET_MEMBER_ENHANCED } from "../queries/enhancedMemberQueries";
import { ASSIGN_RFID_CARD_TO_MEMBER } from "../mutations/memberMutations";
import { OrganizationBranchFilterInput } from '../types/filters';

// Types for GraphQL responses
interface MembersListQueryResponse {
  members: Member[];
}

// Removed unused pagination interfaces

// Enum types for member operations
export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  VISITOR = 'VISITOR',
  FIRST_TIME_VISITOR = 'FIRST_TIME_VISITOR',
  RETURNING_VISITOR = 'RETURNING_VISITOR',
  TRANSFERRED_OUT = 'TRANSFERRED_OUT',
  DECEASED = 'DECEASED',
  EXCOMMUNICATED = 'EXCOMMUNICATED',
  PENDING = 'PENDING',
  PROSPECTIVE = 'PROSPECTIVE'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

export enum MaritalStatus {
  SINGLE = 'SINGLE',
  MARRIED = 'MARRIED',
  DIVORCED = 'DIVORCED',
  WIDOWED = 'WIDOWED',
  SEPARATED = 'SEPARATED',
  OTHER = 'OTHER'
}

export enum ContactPreference {
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  SMS = 'SMS',
  POSTAL_MAIL = 'POSTAL_MAIL',
  NO_CONTACT = 'NO_CONTACT'
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

// Address type
export interface Address {
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

// Emergency contact type
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
}

// Ministry member type
export interface MinistryMember {
  ministry: {
    id: string;
    name: string;
  };
  role?: string;
  joinDate?: string;
}

// User branch type
export interface UserBranch {
  branch: {
    id: string;
    name: string;
  };
}

// Ministry role type
export interface MinistryRole {
  ministry: {
    id: string;
    name: string;
  };
  role?: string;
  joinDate?: string;
}

export interface BranchSetting {
  id: string;
  branchId: string;
  key: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  establishedAt?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  settings?: BranchSetting[];
}

// Types for member operations
export interface Member {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  title?: string;
  displayName?: string;
  prefix?: string;
  suffix?: string;
  email?: string;
  phoneNumber?: string;
  alternatePhone?: string;
  profileImageUrl?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  dateOfBirth?: string;
  address?: Address | string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  nationality?: string;
  placeOfBirth?: string;
  nlbNumber?: string;
  occupation?: string;
  employer?: string;
  employerName?: string;
  fatherName?: string;
  motherName?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  anniversaryDate?: string;
  status: MemberStatus;
  membershipDate?: string;
  baptismDate?: string;
  confirmationDate?: string;
  statusChangeDate?: string;
  statusChangeReason?: string;
  visitorNotes?: string;
  notes?: string;
  privacySettings?: {
    showEmail?: boolean;
    showPhone?: boolean;
    showAddress?: boolean;
    showBirthday?: boolean;
    showFamily?: boolean;
    allowMessaging?: boolean;
    [key: string]: boolean | undefined;
  };
  showEmail?: boolean;
  showPhone?: boolean;
  showAddress?: boolean;
  showBirthday?: boolean;
  showFamily?: boolean;
  allowMessaging?: boolean;
  communicationPreference?: string;
  preferredLanguage?: string;
  emergencyContact?: EmergencyContact;
  userBranches?: UserBranch[];
  branchId?: string;
  branch?: Branch;
  spouseId?: string;
  parentId?: string;
  spouse?: Member;
  parent?: Member;
  children?: Member[];
  memberId?: string;
  memberIdGeneratedAt?: string;
  cardIssued?: boolean;
  cardIssuedAt?: string;
  cardType?: 'NFC' | 'RFID' | 'BARCODE';
  createdAt: string;
  updatedAt: string;
  customFields?: Record<string, string | number | boolean | null>;
  ministries?: MinistryRole[];
}

export interface AddressInput {
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export type EmergencyContactInput = {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
};

export type MemberInput = {
  firstName: string;
  middleName?: string;
  lastName: string;
  preferredName?: string;
  email?: string;
  phoneNumber?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  nationality?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  employerName?: string;
  education?: string;
  status?: MemberStatus;
  membershipStatus?: string;
  membershipType?: string;
  membershipDate?: string;
  baptismDate?: string;
  baptismLocation?: string;
  confirmationDate?: string;
  salvationDate?: string;
  statusChangeReason?: string;
  profileImageUrl?: string;
  customFields?: Record<string, string | number | boolean | null>;
  privacyLevel?: string;
  preferredLanguage?: string;
  notes?: string;
  branchId?: string;
  organisationId?: string;
  spouseId?: string;
  parentId?: string;
  familyId?: string;
  headOfHousehold?: boolean;
  isRegularAttendee?: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  consentDate?: string;
  consentVersion?: string;
  dataRetentionDate?: string;
};

export interface PaginationInput {
  skip?: number;
  take?: number;
};

export type AgeRangeInput = {
  min?: number;
  max?: number;
};

export type DateRangeInput = {
  startDate?: string;
  endDate?: string;
};

export interface UserFilterInput extends OrganizationBranchFilterInput {
  search?: string;
  status?: MemberStatus;
  gender?: Gender;
};

// Hook for fetching members with pagination and filtering
export const useMembers = (filters?: UserFilterInput, pagination?: PaginationInput) => {
  // Fetch paginated members
  const { data, loading, error, refetch } = useQuery<MembersListQueryResponse>(GET_MEMBERS_LIST, {
    variables: {
      skip: pagination?.skip ?? 0,
      take: pagination?.take ?? 10,
      branchId: filters?.branchId,
      organisationId: filters?.organisationId,
      search: filters?.search || undefined, // <-- ensure search is sent
    },
    notifyOnNetworkStatusChange: true,
  });

  const items = data?.members || [];
  // Use the length of fetched members as total count - simpler and always consistent
  const totalCount = items.length;

  return {
    members: items,
    totalCount,
    loading,
    error,
    refetch
  };
};

// Hook to fetch members with RFID cards and all fields for Card Management List
export const useMembersWithCardsAllFields = (filters: UserFilterInput, pagination?: { take?: number; skip?: number }) => {
  const { data, loading, error, refetch } = useQuery<{ members: Member[] }>(GET_MEMBERS_WITH_CARDS_ALL_FIELDS, {
    variables: {
      take: pagination?.take ?? 10,
      skip: pagination?.skip ?? 0,
      organisationId: filters.organisationId,
      branchId: filters.branchId,
    },
    skip: !filters.organisationId, // Skip if no organisationId is provided
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
  });

  const members = data?.members || [];
  // No totalCount field in this query; can be added if backend supports
  return {
    members,
    loading,
    error,
    refetch,
  };
};

// Hook for assigning a new RFID card to a member
export function useAssignRfidCardToMember() {
  const [assignRfidCardToMemberMutation, { data, loading, error }] = useMutation(
    ASSIGN_RFID_CARD_TO_MEMBER
  );

  // Usage: assignRfidCardToMember({ assignRfidCardInput: { memberId, memberId } })
  const assignRfidCardToMember = async (assignRfidCardInput: unknown) => {
    return assignRfidCardToMemberMutation({ variables: { assignRfidCardInput } });
  };

  return {
    assignRfidCardToMember,
    data: data?.assignRfidCardToMember,
    loading,
    error,
  };
}

// Hook for fetching a single member by ID
export const useMember = (id: string) => {
  const { data, loading, error, refetch } = useQuery<{ member: Member }>(GET_MEMBER_ENHANCED, {
    variables: { memberId: id },
    skip: !id,
    fetchPolicy: "cache-and-network"
  });
  return {
    member: data?.member ?? null,
    loading,
    error,
    refetch
  };
};
