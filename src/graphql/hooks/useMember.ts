import { useQuery, useMutation } from "@apollo/client";
import { GET_MEMBERS_LIST, GET_MEMBER, GET_MEMBERS_WITH_CARDS_ALL_FIELDS } from "../queries/memberQueries";
import { ASSIGN_RFID_CARD_TO_MEMBER } from "../mutations/memberMutations";

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
  
  // Address fields (both nested and direct)
  address?: Address | string; // Can be either a string or an Address object
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  
  // Employment
  occupation?: string;
  employer?: string;
  employerName?: string; // Alternative to employer
  
  // Dates and status
  anniversaryDate?: string;
  status: MemberStatus;
  membershipDate?: string;
  baptismDate?: string;
  confirmationDate?: string;
  statusChangeDate?: string;
  statusChangeReason?: string;
  
  // Notes
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
  } // Specific type for privacy settings
  
  // Communication
  communicationPreference?: string;
  preferredLanguage?: string;
  emergencyContact?: EmergencyContact;
  
  // Branch information
  userBranches?: UserBranch[];
  branchId?: string;
  branch?: Branch;
  
  // Relationships
  spouseId?: string;
  parentId?: string;
  spouse?: Member;
  parent?: Member;
  children?: Member[];
  rfidCardId?: string;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  customFields?: Record<string, string | number | boolean | null>; // More specific type for custom fields
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
  prefix?: string;
  suffix?: string;
  email?: string;
  phoneNumber?: string; // Changed from phone
  alternatePhone?: string;
  profileImage?: File; // Input remains File for upload
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  dateOfBirth?: string;
  address?: AddressInput;
  mailingAddress?: AddressInput;
  occupation?: string;
  employer?: string;
  anniversaryDate?: string;
  status?: MemberStatus;
  primaryBranchId?: string;
  notes?: string;
  visitorNotes?: string;
  membershipDate?: string; // Changed from membershipNumber
  // joinDate?: string; // Removed
  baptismDate?: string;
  communicationPreference?: ContactPreference;
  preferredLanguage?: string;
  emergencyContact?: EmergencyContactInput;
  customFields?: Record<string, string | number | boolean | null>;
  createLogin?: boolean;
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

export interface UserFilterInput {
  search?: string;
  status?: MemberStatus;
  branchId?: string;
  gender?: Gender;
};

// Hook for fetching members with pagination and filtering
import { GET_MEMBERS_COUNT } from "../queries/memberQueries";

export const useMembers = (filters?: UserFilterInput, pagination?: PaginationInput) => {
  // Fetch paginated members
  const { data, loading, error, refetch } = useQuery<MembersListQueryResponse>(GET_MEMBERS_LIST, {
    variables: {
      skip: pagination?.skip ?? 0,
      take: pagination?.take ?? 10,
      branchId: filters?.branchId
    },
    notifyOnNetworkStatusChange: true,
  });

  // Fetch total count for accurate pagination
  const { data: countData, loading: countLoading } = useQuery<{ membersCount: number }>(GET_MEMBERS_COUNT, {
    variables: {},
    fetchPolicy: "cache-and-network"
  });

  const items = data?.members || [];
  const totalCount = countData?.membersCount ?? 0;

  return {
    members: items,
    totalCount,
    loading: loading || countLoading,
    error,
    refetch
  };
};

// Hook to fetch members with RFID cards and all fields for Card Management List
export const useMembersWithCardsAllFields = (pagination?: { take?: number; skip?: number }) => {
  const { data, loading, error, refetch } = useQuery<{ members: Member[] }>(GET_MEMBERS_WITH_CARDS_ALL_FIELDS, {
    variables: {
      take: pagination?.take ?? 10,
      skip: pagination?.skip ?? 0,
    },
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

  // Usage: assignRfidCardToMember({ assignRfidCardInput: { memberId, rfidCardId } })
  const assignRfidCardToMember = async (assignRfidCardInput: any) => {
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
  const { data, loading, error, refetch } = useQuery<{ member: Member }>(GET_MEMBER, {
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
