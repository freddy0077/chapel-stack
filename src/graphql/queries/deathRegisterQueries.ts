import { gql } from '@apollo/client';

// Death Register Queries
export const GET_DEATH_REGISTERS = gql`
  query GetDeathRegisters($filter: DeathRegisterFilterInput) {
    deathRegisters(filter: $filter) {
      id
      memberId
      dateOfDeath
      timeOfDeath
      placeOfDeath
      causeOfDeath
      circumstances
      funeralDate
      funeralLocation
      funeralOfficiant
      burialCremation
      cemeteryLocation
      nextOfKin
      nextOfKinPhone
      nextOfKinEmail
      familyNotified
      notificationDate
      deathCertificateUrl
      obituaryUrl
      photoUrls
      additionalDocuments
      recordedBy
      recordedDate
      lastUpdatedBy
      lastUpdatedDate
      branchId
      organisationId
      funeralEventId
      member {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        profileImageUrl
        gender
        membershipDate
      }
      branch {
        id
        name
      }
      organisation {
        id
        name
      }
      funeralEvent {
        id
        title
        startDate
        location
      }
    }
  }
`;

export const GET_DEATH_REGISTER = gql`
  query GetDeathRegister($id: ID!) {
    deathRegister(id: $id) {
      id
      memberId
      dateOfDeath
      timeOfDeath
      placeOfDeath
      causeOfDeath
      circumstances
      funeralDate
      funeralLocation
      funeralOfficiant
      burialCremation
      cemeteryLocation
      nextOfKin
      nextOfKinPhone
      nextOfKinEmail
      familyNotified
      notificationDate
      deathCertificateUrl
      obituaryUrl
      photoUrls
      additionalDocuments
      recordedBy
      recordedDate
      lastUpdatedBy
      lastUpdatedDate
      branchId
      organisationId
      funeralEventId
      member {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        profileImageUrl
        gender
        membershipDate
        phoneNumber
        email
        address
      }
      branch {
        id
        name
      }
      organisation {
        id
        name
      }
      funeralEvent {
        id
        title
        startDate
        endDate
        location
        description
      }
    }
  }
`;

export const GET_DEATH_REGISTER_BY_MEMBER = gql`
  query GetDeathRegisterByMember($memberId: ID!) {
    deathRegisterByMember(memberId: $memberId) {
      id
      memberId
      dateOfDeath
      timeOfDeath
      placeOfDeath
      causeOfDeath
      circumstances
      funeralDate
      funeralLocation
      funeralOfficiant
      burialCremation
      cemeteryLocation
      nextOfKin
      nextOfKinPhone
      nextOfKinEmail
      familyNotified
      notificationDate
      deathCertificateUrl
      obituaryUrl
      photoUrls
      additionalDocuments
      recordedBy
      recordedDate
      lastUpdatedBy
      lastUpdatedDate
      member {
        id
        firstName
        middleName
        lastName
        dateOfBirth
        profileImageUrl
        gender
      }
      funeralEvent {
        id
        title
        startDate
        location
      }
    }
  }
`;

export const GET_DEATH_REGISTER_STATS = gql`
  query GetDeathRegisterStats($organisationId: ID, $branchId: ID) {
    deathRegisterStats(organisationId: $organisationId, branchId: $branchId) {
      total
      thisYear
      thisMonth
      burialCount
      cremationCount
      averageAge
      familyNotifiedCount
      funeralServicesHeld
    }
  }
`;

export const GET_MEMORIAL_CALENDAR = gql`
  query GetMemorialCalendar($year: Int!, $organisationId: ID, $branchId: ID) {
    memorialCalendar(year: $year, organisationId: $organisationId, branchId: $branchId) {
      memberId
      memberName
      dateOfDeath
      yearsAgo
      photoUrl
    }
  }
`;

// Death Register Mutations
export const CREATE_DEATH_REGISTER = gql`
  mutation CreateDeathRegister($input: CreateDeathRegisterInput!) {
    createDeathRegister(input: $input) {
      id
      memberId
      dateOfDeath
      timeOfDeath
      placeOfDeath
      causeOfDeath
      circumstances
      funeralDate
      funeralLocation
      funeralOfficiant
      burialCremation
      cemeteryLocation
      nextOfKin
      nextOfKinPhone
      nextOfKinEmail
      familyNotified
      notificationDate
      deathCertificateUrl
      obituaryUrl
      photoUrls
      additionalDocuments
      recordedBy
      recordedDate
      member {
        id
        firstName
        middleName
        lastName
        profileImageUrl
      }
    }
  }
`;

export const UPDATE_DEATH_REGISTER = gql`
  mutation UpdateDeathRegister($input: UpdateDeathRegisterInput!) {
    updateDeathRegister(input: $input) {
      id
      memberId
      dateOfDeath
      timeOfDeath
      placeOfDeath
      causeOfDeath
      circumstances
      funeralDate
      funeralLocation
      funeralOfficiant
      burialCremation
      cemeteryLocation
      nextOfKin
      nextOfKinPhone
      nextOfKinEmail
      familyNotified
      notificationDate
      deathCertificateUrl
      obituaryUrl
      photoUrls
      additionalDocuments
      lastUpdatedBy
      lastUpdatedDate
      member {
        id
        firstName
        middleName
        lastName
        profileImageUrl
      }
    }
  }
`;

export const DELETE_DEATH_REGISTER = gql`
  mutation DeleteDeathRegister($id: ID!) {
    deleteDeathRegister(id: $id)
  }
`;

export const UPLOAD_DEATH_DOCUMENT = gql`
  mutation UploadDeathDocument($input: UploadDeathDocumentInput!) {
    uploadDeathDocument(input: $input) {
      id
      deathCertificateUrl
      obituaryUrl
      photoUrls
      additionalDocuments
      lastUpdatedBy
      lastUpdatedDate
    }
  }
`;

export const MARK_FAMILY_NOTIFIED = gql`
  mutation MarkFamilyNotified($id: ID!) {
    markFamilyNotified(id: $id) {
      id
      familyNotified
      notificationDate
      lastUpdatedBy
      lastUpdatedDate
    }
  }
`;
