import { gql } from '@apollo/client';

export const GET_ZONES = gql`
  query GetZones($organisationId: String!, $branchId: String) {
    zones(organisationId: $organisationId, branchId: $branchId) {
      id
      name
      description
      location
      leaderName
      leaderPhone
      leaderEmail
      status
      branchId
      organisationId
      createdAt
      updatedAt
      _count {
        members
      }
    }
  }
`;

export const GET_ZONE = gql`
  query GetZone($id: String!) {
    zone(id: $id) {
      id
      name
      description
      location
      leaderName
      leaderPhone
      leaderEmail
      status
      branchId
      organisationId
      createdAt
      updatedAt
      _count {
        members
      }
    }
  }
`;

export const GET_ZONE_STATS = gql`
  query GetZoneStats($organisationId: String!, $branchId: String) {
    zoneStats(organisationId: $organisationId, branchId: $branchId) {
      totalZones
      activeZones
      totalMembers
      zones {
        id
        name
        memberCount
        status
      }
    }
  }
`;
