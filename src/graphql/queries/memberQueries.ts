import { gql } from '@apollo/client';

// Query to get branches with statistics (using 'id' in filterInput as requested)
export const GET_BRANCHES_WITH_STATISTICS = gql`
  query GetBranchesWithStatistics($branchId: String) {
    branches(filterInput: { id: $branchId }) {
      items {
        id
        name
        statistics {
          totalMembers
          activeMembers
          inactiveMembers
          newMembersInPeriod
          lastMonth {
            totalMembers
            activeMembers
            inactiveMembers
            newMembersInPeriod
            __typename
          }
          __typename
        }
        __typename
      }
      totalCount
      __typename
    }
  }
`;

// Mutation to create a new member (updated to match new schema and fields)
export const CREATE_MEMBER = gql`
  mutation CreateMember($createMemberInput: CreateMemberInput!) {
    createMember(createMemberInput: $createMemberInput) {
      id
      firstName
      middleName
      lastName
      title
      email
      phoneNumber
      address
      city
      state
      postalCode
      country
      nationality
      placeOfBirth
      nlbNumber
      dateOfBirth
      gender
      maritalStatus
      occupation
      employerName
      fatherName
      fatherOccupation
      motherName
      motherOccupation
      emergencyContactName
      emergencyContactPhone
      affidavitUrl
      status
      membershipDate
      baptismDate
      confirmationDate
      statusChangeDate
      statusChangeReason
      profileImageUrl
      customFields
      privacySettings
      notes
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
      branch {
        id
        name
      }
      branchId
      spouse {
        id
        firstName
        lastName
      }
      spouseId
      parent {
        id
        firstName
        lastName
      }
      parentId
      createdAt
      updatedAt
    }
  }
`;

// Query to fetch all members - updated to match server schema
export const GET_MEMBERS = gql`
  query GetMembers(
    $skip: Int
    $take: Int
    # filter argument removed as it's not supported on Query.members
  ) {
    members(
      skip: $skip
      take: $take
    ) {
      id
      firstName
      middleName
      lastName
      email
      phoneNumber
      status
      profileImageUrl
      gender
      dateOfBirth
      membershipDate # Replaced membershipNumber
      # joinDate # Removed
      # firstVisitDate # Removed
      # isActive # Removed
      # isVisitor # Removed
      occupation
      maritalStatus
      createdAt
      # userBranches # Removed from list query
    }
  }
`;

// Query to fetch members with pagination info
export const GET_MEMBERS_LIST = gql`
  query GetMembersList(
    $organisationId: String
    $branchId: String
    $skip: Int
    $take: Int
    $hasMemberId: Boolean
    $search: String
    $gender: [String!]
    $maritalStatus: [String!]
    $membershipStatus: [String!]
    $memberStatus: [String!]
    $minAge: Int
    $maxAge: Int
    $joinedAfter: String
    $joinedBefore: String
    $hasProfileImage: Boolean
    $hasEmail: Boolean
    $hasPhone: Boolean
    $isRegularAttendee: Boolean
  ) {
    members(
      organisationId: $organisationId
      branchId: $branchId
      skip: $skip
      take: $take
      hasMemberId: $hasMemberId
      search: $search
      gender: $gender
      maritalStatus: $maritalStatus
      membershipStatus: $membershipStatus
      memberStatus: $memberStatus
      minAge: $minAge
      maxAge: $maxAge
      joinedAfter: $joinedAfter
      joinedBefore: $joinedBefore
      hasProfileImage: $hasProfileImage
      hasEmail: $hasEmail
      hasPhone: $hasPhone
      isRegularAttendee: $isRegularAttendee
    ) {
      id
      firstName
      middleName
      lastName
      preferredName
      title
      email
      phoneNumber
      alternativeEmail
      alternatePhone
      address
      addressLine2
      city
      state
      postalCode
      country
      district
      region
      digitalAddress
      landmark
      placeOfBirth
      nationality
      nlbNumber
      occupation
      emergencyContactName
      emergencyContactPhone
      emergencyContactRelation
      membershipStatus
      membershipType
      gender
      maritalStatus
      privacyLevel
      organisationId
      branchId
      dateOfBirth
      membershipDate
      baptismDate
      headOfHousehold
      isRegularAttendee
      rfidCardId
      nfcId
      consentDate
      consentVersion
      status
      profileImageUrl
      createdAt
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
      familyId
      communicationPrefs {
        emailEnabled
        emailNewsletter
        emailEvents
        emailReminders
        smsEnabled
        smsReminders
        smsEmergency
        phoneCallsEnabled
        physicalMail
        preferredCallTime
        doNotDisturbDays
      }
      branch {
        id
        name
      }
      spouse {
        id
        firstName
        lastName
      }
      parent {
        id
        firstName
        lastName
      }
      children {
        id
        firstName
        lastName
      }
    }
    membersCount(
      organisationId: $organisationId
      branchId: $branchId
    )
  }
`;

// Query to fetch a single member by ID
export const GET_MEMBER = gql`
  query GetSingleMember($memberId: String!) {
    member(id: $memberId) {
      id
      firstName
      middleName
      lastName
      preferredName
      title
      email
      phoneNumber
      alternatePhone
      address
      city
      state
      postalCode
      country
      placeOfBirth
      nationality
      nlbNumber
      dateOfBirth
      gender
      maritalStatus
      occupation
      employerName
      education
      status
      membershipStatus
      membershipType
      membershipDate
      baptismDate
      baptismLocation
      confirmationDate
      salvationDate
      statusChangeReason
      profileImageUrl
      customFields
      privacyLevel
      preferredLanguage
      notes
      branchId
      organisationId
      spouseId
      parentId
      familyId
      headOfHousehold
      isRegularAttendee
      emergencyContactName
      emergencyContactPhone
      emergencyContactRelation
      consentDate
      consentVersion
      dataRetentionDate
      createdAt
      updatedAt
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
      branch {
        id
        name
      }
      spouse {
        id
        firstName
        lastName
      }
      parent {
        id
        firstName
        lastName
      }
    }
  }
`;

// Query to search for members by name, email, or phone number
export const SEARCH_MEMBERS = gql`
  query SearchMembers($query: String!, $branchId: String) {
    searchMembers(query: $query, branchId: $branchId) {
      id
      firstName
      lastName
      email
      phoneNumber
      memberId
      gender
      branch {
        id
        name
      }
    }
  }
`;

// Query to fetch all skills
export const GET_SKILLS = gql`
  query GetSkills {
    skills {
      id
      name
      description
    }
  }
`;

// Query to get members count
export const GET_MEMBERS_COUNT = gql`
  query GetMembersCount($branchId: String, $organisationId: String, $search: String) {
    membersCount(branchId: $branchId, organisationId: $organisationId)
  }
`;

// Query to fetch member statistics directly
export const GET_MEMBER_STATISTICS = gql`
  query GetMemberStatistics($branchId: String, $organisationId: String) {
    memberStatistics(branchId: $branchId, organisationId: $organisationId) {
      totalMembers
      activeMembers
      inactiveMembers
      newMembersInPeriod
      visitorsInPeriod
      lastMonth {
        totalMembers
        activeMembers
        inactiveMembers
        newMembersInPeriod
        visitorsInPeriod
      }
    }
  }
`;

// Query to fetch all interests
export const GET_INTERESTS = gql`
  query GetInterests {
    interests {
      id
      name
      description
    }
  }
`;

// Query to fetch members with RFID cards and all fields for Card Management List
export const GET_MEMBERS_WITH_CARDS_ALL_FIELDS = gql`
  query GetMembersWithCardsAllFields(
    $organisationId: String!
    $branchId: String
    $take: Int = 10
    $skip: Int = 0
  ) {
    members(
      hasRfidCard: true
      take: $take
      skip: $skip
      organisationId: $organisationId
      branchId: $branchId
    ) {
      id
      firstName
      middleName
      lastName
      email
      phoneNumber
      address
      city
      state
      postalCode
      country
      dateOfBirth
      gender
      maritalStatus
      occupation
      employerName
      status
      membershipDate
      baptismDate
      confirmationDate
      statusChangeDate
      statusChangeReason
      profileImageUrl
      customFields
      privacySettings
      notes
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
      branch {
        id
        name
      }
      branchId
      spouse {
        id
        firstName
        lastName
      }
      spouseId
      children {
        id
        firstName
        lastName
      }
      parent {
        id
        firstName
        lastName
      }
      parentId
      createdAt
      updatedAt
    }
  }
`;

export const GET_MEMBER_DASHBOARD = gql`
  query GetMemberDashboard($memberId: String!) {
    memberDashboard(memberId: $memberId) {
      id
      firstName
      lastName
      profileImageUrl
      membershipStatus
      membershipDate
      stats {
        groups
        attendance
        giving
      }
      upcomingEvents {
        id
        name
        date
        location
      }
      groups {
        id
        name
        role
      }
      milestones {
        baptismDate
        confirmationDate
      }
    }
  }
`;

// ===== NEW MEMBER MANAGEMENT ENHANCEMENTS =====

// Mutation to deactivate a member
export const DEACTIVATE_MEMBER = gql`
  mutation DeactivateMember($memberId: String!, $reason: String!) {
    deactivateMember(memberId: $memberId, reason: $reason) {
      id
      firstName
      lastName
      isDeactivated
      deactivatedAt
      deactivatedBy
      deactivationReason
      status
    }
  }
`;

// Mutation to reactivate a member
export const REACTIVATE_MEMBER = gql`
  mutation ReactivateMember($memberId: String!) {
    reactivateMember(memberId: $memberId) {
      id
      firstName
      lastName
      isDeactivated
      deactivatedAt
      deactivatedBy
      deactivationReason
      status
    }
  }
`;

// Mutation to permanently delete a member (super admin only)
export const PERMANENTLY_DELETE_MEMBER = gql`
  mutation PermanentlyDeleteMember($memberId: String!) {
    permanentlyDeleteMember(memberId: $memberId)
  }
`;

// Mutation to upload affidavit for name changes
export const UPLOAD_AFFIDAVIT = gql`
  mutation UploadAffidavit($memberId: String!, $file: Upload!, $reason: String!) {
    uploadAffidavit(memberId: $memberId, file: $file, reason: $reason) {
      id
      firstName
      lastName
      affidavitUrl
    }
  }
`;

// Query to get families with search and pagination
export const GET_FAMILIES = gql`
  query GetFamilies($input: FamilyQueryInput!) {
    families(input: $input) {
      families {
        id
        name
        headOfFamily {
          id
          firstName
          lastName
          email
          phoneNumber
        }
        members {
          id
          firstName
          lastName
          relationshipType
          dateOfBirth
          gender
          status
        }
        memberCount
        childrenCount
        adultsCount
        createdAt
        updatedAt
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
`;

// Query to get a single family by ID
export const GET_FAMILY = gql`
  query GetFamily($familyId: String!) {
    family(familyId: $familyId) {
      id
      name
      headOfFamily {
        id
        firstName
        lastName
        email
        phoneNumber
        profileImageUrl
      }
      members {
        id
        firstName
        lastName
        relationshipType
        dateOfBirth
        gender
        status
        email
        phoneNumber
        profileImageUrl
      }
      memberCount
      childrenCount
      adultsCount
      createdAt
      updatedAt
    }
  }
`;

// Query to get family statistics
export const GET_FAMILY_STATISTICS = gql`
  query GetFamilyStatistics($organisationId: String, $branchId: String) {
    familyStatistics(organisationId: $organisationId, branchId: $branchId) {
      totalFamilies
      totalMembers
      averageFamilySize
      familiesWithChildren
      singleMemberFamilies
    }
  }
`;

// Query to get members with different view options
export const GET_MEMBERS_WITH_VIEW_OPTIONS = gql`
  query GetMembersWithViewOptions($input: MemberViewOptionsInput!) {
    getMembersWithViewOptions(input: $input) {
      members {
        ... on MemberListItem {
          id
          firstName
          lastName
          email
          phoneNumber
          status
          profileImageUrl
        }
        ... on MemberCardItem {
          id
          firstName
          lastName
          email
          phoneNumber
          status
          profileImageUrl
          dateOfBirth
          gender
          membershipDate
          branchName
        }
        ... on MemberTableItem {
          id
          firstName
          lastName
          email
          phoneNumber
          status
          profileImageUrl
          dateOfBirth
          gender
          membershipDate
          occupation
          maritalStatus
          branchName
          createdAt
        }
        ... on MemberGridItem {
          id
          firstName
          lastName
          profileImageUrl
          status
        }
      }
      pagination {
        totalCount
        currentPage
        totalPages
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

// Query to get members with includeDeactivated parameter
export const GET_MEMBERS_WITH_DEACTIVATED = gql`
  query GetMembersWithDeactivated(
    $organisationId: String
    $branchId: String
    $skip: Int
    $take: Int
    $search: String
    $includeDeactivated: Boolean
  ) {
    members(
      organisationId: $organisationId
      branchId: $branchId
      skip: $skip
      take: $take
      search: $search
      includeDeactivated: $includeDeactivated
    ) {
      id
      firstName
      middleName
      lastName
      title
      email
      phoneNumber
      address
      nationality
      placeOfBirth
      nlbNumber
      dateOfBirth
      gender
      maritalStatus
      occupation
      fatherName
      fatherOccupation
      motherName
      motherOccupation
      emergencyContactName
      emergencyContactPhone
      affidavitUrl
      status
      isDeactivated
      deactivatedAt
      deactivatedBy
      deactivationReason
      membershipDate
      profileImageUrl
      branch {
        id
        name
      }
      spouse {
        id
        firstName
        lastName
      }
      createdAt
      updatedAt
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
    }
  }
`;

// ===== MISSING QUERIES AND MUTATIONS =====

// Get single member by ID
export const GET_MEMBER_BY_ID = gql`
  query GetMemberById($id: String!) {
    member(id: $id) {
      id
      firstName
      middleName
      lastName
      preferredName
      email
      phoneNumber
      alternatePhone
      address
      city
      state
      postalCode
      country
      dateOfBirth
      placeOfBirth
      nationality
      gender
      maritalStatus
      occupation
      employerName
      education
      status
      membershipStatus
      membershipType
      membershipDate
      baptismDate
      baptismLocation
      confirmationDate
      salvationDate
      statusChangeReason
      profileImageUrl
      customFields
      privacyLevel
      preferredLanguage
      notes
      branchId
      organisationId
      spouseId
      parentId
      familyId
      headOfHousehold
      isRegularAttendee
      emergencyContactName
      emergencyContactPhone
      emergencyContactRelation
      consentDate
      consentVersion
      dataRetentionDate
      createdAt
      updatedAt
      branch {
        id
        name
      }
      spouse {
        id
        firstName
        lastName
      }
      parent {
        id
        firstName
        lastName
      }
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
    }
  }
`;

// Update member mutation
export const UPDATE_MEMBER = gql`
  mutation UpdateMember($id: String!, $updateMemberInput: UpdateMemberInput!) {
    updateMember(id: $id, updateMemberInput: $updateMemberInput) {
      id
      title
      firstName
      middleName
      lastName
      preferredName
      email
      alternativeEmail
      phoneNumber
      alternatePhone
      address
      addressLine2
      city
      state
      postalCode
      country
      district
      region
      digitalAddress
      landmark
      dateOfBirth
      placeOfBirth
      nationality
      gender
      maritalStatus
      occupation
      employerName
      education
      status
      membershipStatus
      membershipType
      membershipDate
      baptismDate
      baptismLocation
      confirmationDate
      salvationDate
      statusChangeReason
      profileImageUrl
      customFields
      privacyLevel
      preferredLanguage
      notes
      fatherName
      fatherOccupation
      motherName
      motherOccupation
      nlbNumber
      rfidCardId
      nfcId
      branchId
      organisationId
      spouseId
      parentId
      familyId
      headOfHousehold
      isRegularAttendee
      emergencyContactName
      emergencyContactPhone
      emergencyContactRelation
      consentDate
      consentVersion
      dataRetentionDate
      createdAt
      updatedAt
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
    }
  }
`;

// Upload member profile image
export const UPLOAD_MEMBER_IMAGE = gql`
  mutation UploadMemberImage($memberId: String!, $file: Upload!) {
    uploadMemberImage(memberId: $memberId, file: $file)
  }
`;

// Remove/delete member
export const REMOVE_MEMBER = gql`
  mutation RemoveMember($id: String!) {
    removeMember(id: $id)
  }
`;

// Transfer member between branches
export const TRANSFER_MEMBER = gql`
  mutation TransferMember(
    $id: String!
    $fromBranchId: String!
    $toBranchId: String!
    $reason: String
  ) {
    transferMember(
      id: $id
      fromBranchId: $fromBranchId
      toBranchId: $toBranchId
      reason: $reason
    ) {
      id
      firstName
      lastName
      branchId
      branch {
        id
        name
      }
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
    }
  }
`;

// Add member to branch
export const ADD_MEMBER_TO_BRANCH = gql`
  mutation AddMemberToBranch($memberId: String!, $branchId: String!) {
    addMemberToBranch(memberId: $memberId, branchId: $branchId) {
      id
      firstName
      lastName
      branchId
      branch {
        id
        name
      }
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
    }
  }
`;

// Remove member from branch
export const REMOVE_MEMBER_FROM_BRANCH = gql`
  mutation RemoveMemberFromBranch($memberId: String!, $branchId: String!) {
    removeMemberFromBranch(memberId: $memberId, branchId: $branchId) {
      id
      firstName
      lastName
      branchId
      branch {
        id
        name
      }
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
    }
  }
`;

// Update member status
export const UPDATE_MEMBER_STATUS = gql`
  mutation UpdateMemberStatus($id: String!, $status: MemberStatus!, $reason: String) {
    updateMemberStatus(id: $id, status: $status, reason: $reason) {
      id
      firstName
      lastName
      status
      statusChangeReason
      statusChangeDate
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
    }
  }
`;

// Get members count
export const GET_TOTAL_MEMBERS_COUNT = gql`
  query GetTotalMembersCount($branchId: String, $organisationId: String) {
    membersCount(branchId: $branchId, organisationId: $organisationId)
  }
`;

// Get member statistics
export const GET_MEMBER_STATISTICS_DETAILED = gql`
  query GetMemberStatisticsDetailed($branchId: String, $organisationId: String) {
    memberStatistics(branchId: $branchId, organisationId: $organisationId) {
      totalMembers
      activeMembers
      inactiveMembers
      newMembersInPeriod
      visitorsInPeriod
      growthRate
      retentionRate
      conversionRate
      averageAge
      genderDistribution {
        maleCount
        femaleCount
        otherCount
        malePercentage
        femalePercentage
        otherPercentage
      }
      ageGroups {
        range
        count
        percentage
      }
      membersByStatus {
        status
        count
        percentage
      }
      membersByMembershipStatus {
        status
        count
        percentage
      }
      lastMonth {
        totalMembers
        activeMembers
        inactiveMembers
        newMembersInPeriod
        visitorsInPeriod
      }
    }
  }
`;

// Assign RFID card to member
export const ASSIGN_RFID_CARD = gql`
  mutation AssignRfidCardToMember($assignRfidCardInput: AssignRfidCardInput!) {
    assignRfidCardToMember(assignRfidCardInput: $assignRfidCardInput) {
      id
      firstName
      lastName
      memberId
      cardIssued
      cardIssuedAt
      cardType
    }
  }
`;

// Remove RFID card from member
export const REMOVE_RFID_CARD = gql`
  mutation RemoveRfidCardFromMember($memberId: String!) {
    removeRfidCardFromMember(memberId: $memberId) {
      id
      firstName
      lastName
      memberId
      cardIssued
      cardIssuedAt
      cardType
    }
  }
`;

// Get member by RFID card
export const GET_MEMBER_BY_RFID = gql`
  query GetMemberByRfidCard($rfidCardId: String!) {
    memberByRfidCard(rfidCardId: $rfidCardId) {
      id
      firstName
      lastName
      email
      phoneNumber
      memberId
      cardIssued
      cardIssuedAt
      cardType
      status
      membershipStatus
      branch {
        id
        name
      }
    }
  }
`;

// Get member dashboard
export const GET_MEMBER_DASHBOARD_DETAILED = gql`
  query GetMemberDashboardDetailed($memberId: String!) {
    memberDashboard(memberId: $memberId) {
      member {
        id
        firstName
        lastName
        email
        phoneNumber
        membershipStatus
        status
      }
      recentActivities {
        id
        type
        description
        date
      }
      upcomingEvents {
        id
        title
        date
        location
      }
      contributions {
        totalAmount
        thisMonth
        thisYear
      }
      attendance {
        totalServices
        thisMonth
        thisYear
        averageAttendance
      }
    }
  }
`;

// Generate member report
export const GENERATE_MEMBER_REPORT = gql`
  query GenerateMemberReport($input: MemberReportInput!) {
    generateMemberReport(input: $input) {
      id
      title
      description
      reportType
      filters
      data
      generatedAt
      generatedBy
    }
  }
`;

// Update communication preferences
export const UPDATE_COMMUNICATION_PREFS = gql`
  mutation UpdateCommunicationPrefs($memberId: String!, $prefsData: String!) {
    updateCommunicationPrefs(memberId: $memberId, prefsData: $prefsData)
  }
`;

// Create member relationship
export const CREATE_MEMBER_RELATIONSHIP = gql`
  mutation CreateMemberRelationship($createMemberRelationshipInput: CreateMemberRelationshipInput!) {
    createMemberRelationship(createMemberRelationshipInput: $createMemberRelationshipInput)
  }
`;

// Update member relationship
export const UPDATE_MEMBER_RELATIONSHIP = gql`
  mutation UpdateMemberRelationship($id: String!, $updateMemberRelationshipInput: UpdateMemberRelationshipInput!) {
    updateMemberRelationship(id: $id, updateMemberRelationshipInput: $updateMemberRelationshipInput)
  }
`;

// Delete member relationship
export const DELETE_MEMBER_RELATIONSHIP = gql`
  mutation DeleteMemberRelationship($id: String!) {
    deleteMemberRelationship(id: $id)
  }
`;

// Create membership history entry
export const CREATE_MEMBERSHIP_HISTORY = gql`
  mutation CreateMembershipHistoryEntry($createMembershipHistoryInput: CreateMembershipHistoryInput!) {
    createMembershipHistoryEntry(createMembershipHistoryInput: $createMembershipHistoryInput)
  }
`;

// Enhanced search members with filters
export const SEARCH_MEMBERS_ENHANCED = gql`
  query SearchMembersEnhanced(
    $query: String!
    $branchId: String
    $membershipStatus: String
    $ageGroup: String
    $gender: String
    $skip: Int = 0
    $take: Int = 20
  ) {
    searchMembers(
      query: $query
      branchId: $branchId
      membershipStatus: $membershipStatus
      ageGroup: $ageGroup
      gender: $gender
      skip: $skip
      take: $take
    ) {
      id
      firstName
      middleName
      lastName
      email
      phoneNumber
      dateOfBirth
      gender
      maritalStatus
      occupation
      status
      membershipStatus
      membershipType
      profileImageUrl
      branch {
        id
        name
      }
      createdAt
      updatedAt
      memberId
      memberIdGeneratedAt
      cardIssued
      cardIssuedAt
      cardType
    }
  }
`;

// Bulk Actions

export const BULK_UPDATE_MEMBER_STATUS = gql`
  mutation BulkUpdateMemberStatus(
    $bulkUpdateStatusInput: BulkUpdateStatusInput!
  ) {
    bulkUpdateMemberStatus(bulkUpdateStatusInput: $bulkUpdateStatusInput)
  }
`;

export const BULK_TRANSFER_MEMBERS = gql`
  mutation BulkTransferMembers($bulkTransferInput: BulkTransferInput!) {
    bulkTransferMembers(bulkTransferInput: $bulkTransferInput)
  }
`;

export const BULK_DEACTIVATE_MEMBERS = gql`
  mutation BulkDeactivateMembers($bulkDeactivateInput: BulkDeactivateInput!) {
    bulkDeactivateMembers(bulkDeactivateInput: $bulkDeactivateInput)
  }
`;

export const BULK_ASSIGN_RFID_CARDS = gql`
  mutation BulkAssignRfidCards($bulkAssignRfidInput: BulkAssignRfidInput!) {
    bulkAssignRfidCards(bulkAssignRfidInput: $bulkAssignRfidInput)
  }
`;

export const BULK_EXPORT_MEMBERS = gql`
  mutation BulkExportMembers($bulkExportInput: BulkExportInput!) {
    bulkExportMembers(bulkExportInput: $bulkExportInput)
  }
`;

export const BULK_ADD_TO_GROUP = gql`
  mutation BulkAddToGroup($bulkAddToGroupInput: BulkAddToGroupInput!) {
    bulkAddToGroup(bulkAddToGroupInput: $bulkAddToGroupInput)
  }
`;

export const BULK_REMOVE_FROM_GROUP = gql`
  mutation BulkRemoveFromGroup($bulkRemoveFromGroupInput: BulkRemoveFromGroupInput!) {
    bulkRemoveFromGroup(bulkRemoveFromGroupInput: $bulkRemoveFromGroupInput)
  }
`;

export const BULK_ADD_TO_MINISTRY = gql`
  mutation BulkAddToMinistry($bulkAddToMinistryInput: BulkAddToMinistryInput!) {
    bulkAddToMinistry(bulkAddToMinistryInput: $bulkAddToMinistryInput)
  }
`;

export const BULK_REMOVE_FROM_MINISTRY = gql`
  mutation BulkRemoveFromMinistry(
    $bulkRemoveFromMinistryInput: BulkRemoveFromMinistryInput!
  ) {
    bulkRemoveFromMinistry(bulkRemoveFromMinistryInput: $bulkRemoveFromMinistryInput)
  }
`;

export const CREATE_SACRAMENTAL_RECORD = gql`
  mutation CreateSacramentalRecord($input: CreateSacramentalRecordInput!) {
    createSacramentalRecord(input: $input) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateNumber
      certificateUrl
      notes
      godparent1Name
      godparent2Name
      sponsorName
      witness1Name
      witness2Name
      groomName
      brideName
      createdAt
      updatedAt
    }
  }
`;
