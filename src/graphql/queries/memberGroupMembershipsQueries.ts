import { gql } from "@apollo/client";

// Query to get a member's group memberships (ministries and small groups)
export const GET_MEMBER_GROUP_MEMBERSHIPS = gql`
  query GetMemberGroupMemberships(
    $ministryFilters: MinistryFilterInput
    $smallGroupFilters: SmallGroupFilterInput
  ) {
    # Get member's ministry memberships
    ministries(filters: $ministryFilters) {
      id
      name
      type
      status
      description
      members {
        id
        memberId
        role
        status
        joinDate
        createdAt
        updatedAt
      }
    }

    # Get member's small group memberships
    smallGroups(filters: $smallGroupFilters) {
      id
      name
      description
      type
      status
      ministry {
        id
        name
      }
      members {
        id
        memberId
        role
        status
        joinDate
        createdAt
        updatedAt
      }
    }
  }
`;

// Query to get all sacramental records for filtering (using existing working queries)
export const GET_ALL_SACRAMENTAL_RECORDS = gql`
  query GetAllSacramentalRecords(
    $baptismFilter: SacramentalRecordFilterInput
    $confirmationFilter: SacramentalRecordFilterInput
    $communionFilter: SacramentalRecordFilterInput
    $marriageFilter: SacramentalRecordFilterInput
  ) {
    # Get baptism records
    baptismRecords: sacramentalRecords(filter: $baptismFilter) {
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
      createdAt
      updatedAt
    }

    # Get confirmation records
    confirmationRecords: sacramentalRecords(filter: $confirmationFilter) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateNumber
      certificateUrl
      notes
      sponsorName
      createdAt
      updatedAt
    }

    # Get communion records
    communionRecords: sacramentalRecords(filter: $communionFilter) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateNumber
      certificateUrl
      notes
      createdAt
      updatedAt
    }

    # Get marriage records
    marriageRecords: sacramentalRecords(filter: $marriageFilter) {
      id
      memberId
      sacramentType
      dateOfSacrament
      officiantName
      locationOfSacrament
      certificateNumber
      certificateUrl
      notes
      witness1Name
      witness2Name
      groomName
      brideName
      createdAt
      updatedAt
    }
  }
`;
