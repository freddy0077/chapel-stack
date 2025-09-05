import { useSubscription } from "@apollo/client";
import { gql } from "@apollo/client";
import { useCallback, useEffect } from "react";
import { Member } from "@/types/auth.types";

// GraphQL Subscription Definitions
const MEMBER_UPDATED_SUBSCRIPTION = gql`
  subscription MemberUpdated($memberId: String!) {
    memberUpdated(memberId: $memberId) {
      id
      firstName
      middleName
      lastName
      email
      phoneNumber
      status
      membershipDate
      dateOfBirth
      gender
      maritalStatus
      occupation
      address
      city
      state
      country
      branchId
      organisationId
      updatedAt
      createdAt
    }
  }
`;

const MEMBER_STATS_CHANGED_SUBSCRIPTION = gql`
  subscription MemberStatsChanged($organisationId: String!) {
    memberStatsChanged(organisationId: $organisationId) {
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
        male
        female
        other
      }
      ageGroups {
        range
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

const BULK_OPERATION_PROGRESS_SUBSCRIPTION = gql`
  subscription BulkOperationProgress($operationId: String!) {
    bulkOperationProgress(operationId: $operationId) {
      operationId
      type
      totalItems
      processedItems
      successCount
      failureCount
      status
      message
      timestamp
    }
  }
`;

// Custom Hook Types
export interface BulkOperationProgress {
  operationId: string;
  type: string;
  totalItems: number;
  processedItems: number;
  successCount: number;
  failureCount: number;
  status: "IN_PROGRESS" | "COMPLETED" | "FAILED";
  message: string;
  timestamp: Date;
}

export interface MemberStatsChanged {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  newMembersInPeriod: number;
  visitorsInPeriod: number;
  growthRate: number;
  retentionRate: number;
  conversionRate: number;
  averageAge: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  ageGroups: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  lastMonth?: {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    newMembersInPeriod: number;
    visitorsInPeriod: number;
  };
}

// Custom Hooks
export const useMemberUpdatedSubscription = (
  memberId: string,
  onMemberUpdated?: (member: Member | null) => void,
) => {
  const { data, loading, error } = useSubscription(
    MEMBER_UPDATED_SUBSCRIPTION,
    {
      variables: { memberId },
      skip: !memberId,
    },
  );

  const handleMemberUpdate = useCallback(
    (member: Member | null) => {
      if (onMemberUpdated) {
        onMemberUpdated(member);
      }
    },
    [onMemberUpdated],
  );

  useEffect(() => {
    if (data?.memberUpdated !== undefined) {
      handleMemberUpdate(data.memberUpdated);
    }
  }, [data, handleMemberUpdate]);

  return {
    member: data?.memberUpdated,
    loading,
    error,
  };
};

export const useMemberStatsChangedSubscription = (
  organisationId: string,
  onStatsChanged?: (stats: MemberStatsChanged) => void,
) => {
  const { data, loading, error } = useSubscription(
    MEMBER_STATS_CHANGED_SUBSCRIPTION,
    {
      variables: { organisationId },
      skip: !organisationId,
    },
  );

  const handleStatsChange = useCallback(
    (stats: MemberStatsChanged) => {
      if (onStatsChanged) {
        onStatsChanged(stats);
      }
    },
    [onStatsChanged],
  );

  useEffect(() => {
    if (data?.memberStatsChanged) {
      handleStatsChange(data.memberStatsChanged);
    }
  }, [data, handleStatsChange]);

  return {
    statsChanged: data?.memberStatsChanged,
    loading,
    error,
  };
};

export const useBulkOperationProgressSubscription = (
  operationId: string,
  onProgressUpdate?: (progress: BulkOperationProgress) => void,
) => {
  const { data, loading, error } = useSubscription(
    BULK_OPERATION_PROGRESS_SUBSCRIPTION,
    {
      variables: { operationId },
      skip: !operationId,
    },
  );

  const handleProgressUpdate = useCallback(
    (progress: BulkOperationProgress) => {
      if (onProgressUpdate) {
        onProgressUpdate(progress);
      }
    },
    [onProgressUpdate],
  );

  useEffect(() => {
    if (data?.bulkOperationProgress) {
      handleProgressUpdate(data.bulkOperationProgress);
    }
  }, [data, handleProgressUpdate]);

  return {
    progress: data?.bulkOperationProgress,
    loading,
    error,
  };
};

// Utility hook for multiple member subscriptions
export const useMultipleMemberSubscriptions = (
  memberIds: string[],
  onMemberUpdated?: (memberId: string, member: Member | null) => void,
) => {
  const subscriptions = memberIds.map((memberId) =>
    useMemberUpdatedSubscription(memberId, (member) => {
      if (onMemberUpdated) {
        onMemberUpdated(memberId, member);
      }
    }),
  );

  return {
    subscriptions,
    loading: subscriptions.some((sub) => sub.loading),
    error: subscriptions.find((sub) => sub.error)?.error,
  };
};
