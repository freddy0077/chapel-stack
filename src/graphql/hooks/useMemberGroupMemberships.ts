import { useQuery } from "@apollo/client";
import { useMemo } from "react";
import {
  GET_MEMBER_GROUP_MEMBERSHIPS,
  GET_ALL_SACRAMENTAL_RECORDS,
} from "../queries/memberGroupMembershipsQueries";

export interface MinistryMember {
  id: string;
  memberId: string;
  role: string;
  status: string;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ministry {
  id: string;
  name: string;
  type: string;
  status: string;
  description?: string;
  members: MinistryMember[];
}

export interface SmallGroupMember {
  id: string;
  memberId: string;
  role: string;
  status: string;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SmallGroup {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  ministry?: {
    id: string;
    name: string;
  };
  members: SmallGroupMember[];
}

export interface SacramentalRecord {
  id: string;
  memberId: string;
  sacramentType: string;
  dateOfSacrament: string;
  officiantName?: string;
  locationOfSacrament?: string;
  certificateNumber?: string;
  certificateUrl?: string;
  notes?: string;
  godparent1Name?: string;
  godparent2Name?: string;
  sponsorName?: string;
  witness1Name?: string;
  witness2Name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberGroupMembership {
  id: string;
  memberId: string;
  ministryId?: string;
  ministryName?: string;
  smallGroupId?: string;
  smallGroupName?: string;
  role: string;
  joinDate: string;
  isActive: boolean;
  responsibilities: string[];
}

// Hook to get member's group memberships (ministries and small groups)
export const useMemberGroupMemberships = (
  memberId: string,
  branchId?: string,
  organisationId?: string,
) => {
  const { data, loading, error, refetch } = useQuery(
    GET_MEMBER_GROUP_MEMBERSHIPS,
    {
      variables: {
        ministryFilters: { branchId, organisationId },
        smallGroupFilters: { branchId, organisationId },
      },
      skip: !memberId,
      fetchPolicy: "cache-and-network",
    },
  );

  // Process the data to extract member-specific memberships
  const processGroupMemberships = (): MemberGroupMembership[] => {
    if (!data) return [];

    const memberships: MemberGroupMembership[] = [];

    // Process ministry memberships
    if (data.ministries) {
      data.ministries.forEach((ministry: Ministry) => {
        const memberInMinistry = ministry.members.find(
          (member: MinistryMember) => member.memberId === memberId,
        );

        if (memberInMinistry) {
          memberships.push({
            id: memberInMinistry.id,
            memberId: memberInMinistry.memberId,
            ministryId: ministry.id,
            ministryName: ministry.name,
            role: memberInMinistry.role,
            joinDate: memberInMinistry.joinDate,
            isActive: memberInMinistry.status === "ACTIVE",
            responsibilities: [], // This would need to come from a different field if available
          });
        }
      });
    }

    // Process small group memberships
    if (data.smallGroups) {
      data.smallGroups.forEach((smallGroup: SmallGroup) => {
        const memberInGroup = smallGroup.members.find(
          (member: SmallGroupMember) => member.memberId === memberId,
        );

        if (memberInGroup) {
          memberships.push({
            id: memberInGroup.id,
            memberId: memberInGroup.memberId,
            smallGroupId: smallGroup.id,
            smallGroupName: smallGroup.name,
            role: memberInGroup.role,
            joinDate: memberInGroup.joinDate,
            isActive: memberInGroup.status === "ACTIVE",
            responsibilities: [], // This would need to come from a different field if available
          });
        }
      });
    }

    return memberships;
  };

  return {
    groupMemberships: processGroupMemberships(),
    loading,
    error,
    refetch,
  };
};

// Hook to get member's sacramental records
export const useMemberSacramentalRecords = (
  memberId: string,
  branchId?: string,
  organisationId?: string,
) => {
  const { data, loading, error, refetch } = useQuery(
    GET_ALL_SACRAMENTAL_RECORDS,
    {
      variables: {
        baptismFilter: {
          sacramentType: "BAPTISM",
          memberId,
          branchId,
          organisationId,
        },
        confirmationFilter: {
          sacramentType: "CONFIRMATION",
          memberId,
          branchId,
          organisationId,
        },
        communionFilter: {
          sacramentType: "EUCHARIST_FIRST_COMMUNION",
          memberId,
          branchId,
          organisationId,
        },
        marriageFilter: {
          sacramentType: "MATRIMONY",
          memberId,
          branchId,
          organisationId,
        },
      },
      skip: !memberId,
      fetchPolicy: "cache-and-network",
    },
  );

  // Combine all sacramental records from different types
  const memberSacramentalRecords = useMemo(() => {
    console.log("🔍 Sacramental Records Debug:", {
      memberId,
      data,
      hasData: !!data,
      baptismRecords: data?.baptismRecords?.length || 0,
      confirmationRecords: data?.confirmationRecords?.length || 0,
      communionRecords: data?.communionRecords?.length || 0,
      marriageRecords: data?.marriageRecords?.length || 0,
    });

    if (!data) return [];

    const allRecords = [
      ...(data.baptismRecords || []),
      ...(data.confirmationRecords || []),
      ...(data.communionRecords || []),
      ...(data.marriageRecords || []),
    ];

    console.log(
      "🔍 All Records (should already be filtered by backend):",
      allRecords,
    );
    console.log("🔍 Expected memberId:", memberId);

    // Since we're now filtering at the GraphQL level, these records should already be filtered
    // But let's add a safety check to ensure data integrity
    const filteredRecords = allRecords.filter((record: SacramentalRecord) => {
      const matches = record.memberId === memberId;
      if (!matches) {
        console.warn(
          `🚨 Found record with wrong memberId: ${record.memberId}, expected: ${memberId}`,
        );
      }
      return matches;
    });

    console.log("🔍 Final Filtered Records:", filteredRecords);
    return filteredRecords;
  }, [data, memberId]);

  return {
    sacramentalRecords: memberSacramentalRecords,
    loading,
    error,
    refetch,
  };
};
