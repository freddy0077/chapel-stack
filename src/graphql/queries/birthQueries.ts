import { gql } from '@apollo/client';

// Birth Registry Types
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNKNOWN = 'UNKNOWN',
}

// Get birth registers for an organization/branch
export const GET_BIRTH_REGISTERS = gql`
  query GetBirthRegisters(
    $organisationId: ID!
    $branchId: ID
    $filters: BirthRegistryFiltersInput
  ) {
    birthRegistries(
      organisationId: $organisationId
      branchId: $branchId
      filters: $filters
    ) {
      id
      childFirstName
      childMiddleName
      childLastName
      childGender
      dateOfBirth
      timeOfBirth
      placeOfBirth
      hospitalName
      attendingPhysician
      birthWeight
      birthLength
      birthCircumstances
      complications
      motherFirstName
      motherLastName
      motherAge
      motherOccupation
      fatherFirstName
      fatherLastName
      fatherAge
      fatherOccupation
      parentAddress
      parentPhone
      parentEmail
      baptismPlanned
      baptismDate
      baptismLocation
      baptismOfficiant
      createChildMember
      childMemberId
      birthCertificateUrl
      hospitalRecordUrl
      photoUrls
      additionalDocuments {
        name
        url
        type
      }
      createdById
      createdAt
      updatedById
      updatedAt
      childMember {
        id
        firstName
        middleName
        lastName
        profileImageUrl
        email
        phoneNumber
        membershipStatus
        membershipDate
      }
      motherMember {
        id
        firstName
        lastName
        profileImageUrl
        email
        phoneNumber
      }
      fatherMember {
        id
        firstName
        lastName
        profileImageUrl
        email
        phoneNumber
      }
      branch {
        id
        name
      }
      organisation {
        id
        name
      }
      baptismEvent {
        id
        title
        startDate
        location
      }
    }
  }
`;

// Get single birth register by ID
export const GET_BIRTH_REGISTER = gql`
  query GetBirthRegister($id: ID!) {
    birthRegistry(id: $id) {
      id
      childFirstName
      childMiddleName
      childLastName
      childGender
      dateOfBirth
      timeOfBirth
      placeOfBirth
      hospitalName
      attendingPhysician
      birthWeight
      birthLength
      birthCircumstances
      complications
      motherFirstName
      motherLastName
      motherAge
      motherOccupation
      fatherFirstName
      fatherLastName
      fatherAge
      fatherOccupation
      parentAddress
      parentPhone
      parentEmail
      baptismPlanned
      baptismDate
      baptismLocation
      baptismOfficiant
      createChildMember
      childMemberId
      birthCertificateUrl
      hospitalRecordUrl
      photoUrls
      additionalDocuments {
        name
        url
        type
      }
      createdById
      createdAt
      updatedById
      updatedAt
      childMember {
        id
        firstName
        middleName
        lastName
        profileImageUrl
        email
        phoneNumber
        membershipStatus
        membershipDate
        dateOfBirth
      }
      motherMember {
        id
        firstName
        lastName
        middleName
        profileImageUrl
        email
        phoneNumber
        membershipStatus
      }
      fatherMember {
        id
        firstName
        lastName
        middleName
        profileImageUrl
        email
        phoneNumber
        membershipStatus
      }
      branch {
        id
        name
        address
        city
        state
        country
      }
      organisation {
        id
        name
        address
        city
        state
        country
      }
      baptismEvent {
        id
        title
        description
        startDate
        endDate
        location
        eventType
        status
      }
    }
  }
`;

// Create birth register
export const CREATE_BIRTH_REGISTER = gql`
  mutation CreateBirthRegistry($createBirthRegistryInput: CreateBirthRegistryInput!) {
    createBirthRegistry(createBirthRegistryInput: $createBirthRegistryInput) {
      id
      childFirstName
      childMiddleName
      childLastName
      childGender
      dateOfBirth
      timeOfBirth
      placeOfBirth
      hospitalName
      attendingPhysician
      birthWeight
      birthLength
      birthCircumstances
      complications
      motherFirstName
      motherLastName
      motherAge
      motherOccupation
      fatherFirstName
      fatherLastName
      fatherAge
      fatherOccupation
      parentAddress
      parentPhone
      parentEmail
      baptismPlanned
      baptismDate
      baptismLocation
      baptismOfficiant
      createChildMember
      childMemberId
      createdById
      createdAt
      childMember {
        id
        firstName
        middleName
        lastName
        profileImageUrl
        membershipStatus
        membershipDate
      }
      motherMember {
        id
        firstName
        lastName
        profileImageUrl
      }
      fatherMember {
        id
        firstName
        lastName
        profileImageUrl
      }
      branch {
        id
        name
      }
      organisation {
        id
        name
      }
    }
  }
`;

// Update birth register
export const UPDATE_BIRTH_REGISTER = gql`
  mutation UpdateBirthRegistry($id: ID!, $updateBirthRegistryInput: UpdateBirthRegistryInput!) {
    updateBirthRegistry(id: $id, updateBirthRegistryInput: $updateBirthRegistryInput) {
      id
      childFirstName
      childMiddleName
      childLastName
      childGender
      dateOfBirth
      timeOfBirth
      placeOfBirth
      hospitalName
      attendingPhysician
      birthWeight
      birthLength
      birthCircumstances
      complications
      motherFirstName
      motherLastName
      motherAge
      motherOccupation
      fatherFirstName
      fatherLastName
      fatherAge
      fatherOccupation
      parentAddress
      parentPhone
      parentEmail
      baptismPlanned
      baptismDate
      baptismLocation
      baptismOfficiant
      createChildMember
      childMemberId
      updatedById
      updatedAt
      childMember {
        id
        firstName
        middleName
        lastName
        profileImageUrl
        membershipStatus
        membershipDate
      }
      motherMember {
        id
        firstName
        lastName
        profileImageUrl
      }
      fatherMember {
        id
        firstName
        lastName
        profileImageUrl
      }
    }
  }
`;

// Delete birth register
export const DELETE_BIRTH_REGISTER = gql`
  mutation RemoveBirthRegistry($id: ID!) {
    removeBirthRegistry(id: $id)
  }
`;

// Upload birth document
export const UPLOAD_BIRTH_DOCUMENT = gql`
  mutation UploadBirthRegistryDocument($uploadDocumentInput: UploadDocumentInput!) {
    uploadBirthRegistryDocument(uploadDocumentInput: $uploadDocumentInput) {
      id
      birthCertificateUrl
      hospitalRecordUrl
      photoUrls
      additionalDocuments {
        name
        url
        type
      }
    }
  }
`;

// Schedule baptism from birth record
export const SCHEDULE_BAPTISM = gql`
  mutation ScheduleBaptism(
    $birthRegistryId: ID!
    $baptismDate: String!
    $baptismLocation: String
    $baptismOfficiant: String
    $baptismEventId: ID
  ) {
    scheduleBaptism(
      birthRegistryId: $birthRegistryId
      baptismDate: $baptismDate
      baptismLocation: $baptismLocation
      baptismOfficiant: $baptismOfficiant
      baptismEventId: $baptismEventId
    ) {
      id
      baptismPlanned
      baptismDate
      baptismLocation
      baptismOfficiant
      baptismEvent {
        id
        title
        startDate
        location
      }
    }
  }
`;

// Get birth register statistics
export const GET_BIRTH_REGISTER_STATS = gql`
  query GetBirthRegistryStatistics(
    $organisationId: ID!
    $branchId: ID
  ) {
    birthRegistryStatistics(
      organisationId: $organisationId
      branchId: $branchId
    ) {
      total
      thisYear
      thisMonth
      maleCount
      femaleCount
      baptismPlannedCount
      baptismCompletedCount
      averageBirthWeight
      hospitalBirthsCount
      homeBirthsCount
    }
  }
`;

// Get birth calendar for a year
export const GET_BIRTH_CALENDAR = gql`
  query GetBirthRegistryCalendar(
    $organisationId: ID!
    $branchId: ID
    $month: Int
    $year: Int
  ) {
    birthRegistryCalendar(
      organisationId: $organisationId
      branchId: $branchId
      month: $month
      year: $year
    ) {
      id
      childName
      dateOfBirth
      photoUrl
      daysOld
      baptismPlanned
      baptismDate
    }
  }
`;

// Search members for parent selection
export const SEARCH_MEMBERS_FOR_PARENTS = gql`
  query SearchMembersForParents(
    $organisationId: ID!
    $branchId: ID!
    $query: String!
    $skip: Int
    $take: Int
  ) {
    searchMembersForParents(
      organisationId: $organisationId
      branchId: $branchId
      query: $query
      skip: $skip
      take: $take
    ) {
      id
      firstName
      lastName
      email
      phoneNumber
      profileImageUrl
    }
  }
`;

// TypeScript interfaces
export interface BirthRegister {
  id: string;
  childFirstName: string;
  childMiddleName?: string;
  childLastName: string;
  childGender: Gender;
  dateOfBirth: string;
  timeOfBirth?: string;
  placeOfBirth: string;
  hospitalName?: string;
  attendingPhysician?: string;
  birthWeight?: number;
  birthLength?: number;
  birthCircumstances?: string;
  complications?: string;
  motherFirstName: string;
  motherLastName: string;
  motherAge?: number;
  motherOccupation?: string;
  fatherFirstName?: string;
  fatherLastName?: string;
  fatherAge?: number;
  fatherOccupation?: string;
  parentAddress: string;
  parentPhone?: string;
  parentEmail?: string;
  baptismPlanned: boolean;
  baptismDate?: string;
  baptismLocation?: string;
  baptismOfficiant?: string;
  createChildMember: boolean;
  childMemberId?: string;
  birthCertificateUrl?: string;
  hospitalRecordUrl?: string;
  photoUrls: string[];
  additionalDocuments: string[];
  recordedBy: string;
  recordedDate: string;
  lastUpdatedBy?: string;
  lastUpdatedDate?: string;
  childMember?: {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    profileImageUrl?: string;
    membershipStatus: string;
    membershipDate?: string;
    dateOfBirth?: string;
  };
  motherMember?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    email?: string;
    phoneNumber?: string;
  };
  fatherMember?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    email?: string;
    phoneNumber?: string;
  };
  branch?: {
    id: string;
    name: string;
  };
  organisation: {
    id: string;
    name: string;
  };
  baptismEvent?: {
    id: string;
    title: string;
    startDate: string;
    location: string;
  };
}

export interface CreateBirthRegistryInput {
  childFirstName: string;
  childMiddleName?: string;
  childLastName: string;
  childGender: Gender;
  dateOfBirth: string;
  timeOfBirth?: string;
  placeOfBirth: string;
  hospitalName?: string;
  attendingPhysician?: string;
  birthWeight?: number;
  birthLength?: number;
  birthCircumstances?: string;
  complications?: string;
  motherFirstName: string;
  motherLastName: string;
  motherMemberId?: string;
  motherAge?: number;
  motherOccupation?: string;
  fatherFirstName?: string;
  fatherLastName?: string;
  fatherMemberId?: string;
  fatherAge?: number;
  fatherOccupation?: string;
  parentAddress: string;
  parentPhone?: string;
  parentEmail?: string;
  baptismPlanned: boolean;
  baptismDate?: string;
  baptismLocation?: string;
  baptismOfficiant?: string;
  createChildMember: boolean;
  childMemberId?: string;
  branchId?: string;
  organisationId: string;
}

export interface UpdateBirthRegistryInput extends Partial<CreateBirthRegistryInput> {}

export interface UploadDocumentInput {
  birthRegistryId: string;
  documentType: string;
  documentUrl: string;
  documentName?: string;
}

export interface ScheduleBaptismInput {
  birthRegistryId: string;
  baptismDate: string;
  baptismLocation?: string;
  baptismOfficiant?: string;
  baptismEventId?: string;
}

export interface BirthRegisterStats {
  totalBirths: number;
  birthsThisYear: number;
  birthsThisMonth: number;
  baptismsScheduled: number;
  baptismsCompleted: number;
  averageBirthWeight?: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  monthlyBirths: {
    month: string;
    count: number;
  }[];
  upcomingBaptisms: {
    id: string;
    childFirstName: string;
    childLastName: string;
    baptismDate: string;
    baptismLocation: string;
  }[];
}

export interface BirthCalendarEntry {
  date: string;
  births: {
    id: string;
    childFirstName: string;
    childLastName: string;
    dateOfBirth: string;
    baptismPlanned: boolean;
    baptismDate?: string;
  }[];
  baptisms: {
    id: string;
    childFirstName: string;
    childLastName: string;
    baptismDate: string;
    baptismLocation: string;
  }[];
}

export interface BirthRegistryCalendarEntry {
  id: string;
  childName: string;
  dateOfBirth: string;
  photoUrl?: string;
  daysOld: number;
  baptismPlanned: boolean;
  baptismDate?: string;
}

export interface ParentMember {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  gender: string;
  dateOfBirth?: string;
  membershipStatus: string;
}
