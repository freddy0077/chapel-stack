import { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_BRANCH_SETTINGS,
  UPDATE_BRANCH_SETTINGS,
} from "../graphql/branchSettings";
import {
  VisibilityLevel,
  ReportingLevel,
  BranchSettings,
} from "../app/dashboard/branches/components/BranchSettings";

export interface UseBranchSettingsProps {
  branchId: string;
}

export function useBranchSettings({ branchId }: UseBranchSettingsProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Query for branch settings
  const {
    data,
    loading: loadingSettings,
    error: settingsError,
    refetch: refetchSettings,
  } = useQuery<{
    branch: { id: string; name: string; branchSettings: BranchSettings };
  }>(GET_BRANCH_SETTINGS, {
    variables: {
      id: branchId,
    },
    fetchPolicy: "cache-and-network",
  });

  // Update branch settings mutation
  const [updateBranchSettings, { loading: updatingSettings }] = useMutation(
    UPDATE_BRANCH_SETTINGS,
    {
      onCompleted: () => {
        refetchSettings();
      },
    },
  );

  const saveSettings = async (settings: BranchSettings) => {
    setIsSaving(true);
    try {
      await updateBranchSettings({
        variables: {
          branchId: branchId,
          input: {
            allowMemberTransfers: settings.allowMemberTransfers,
            allowResourceSharing: settings.allowResourceSharing,
            visibilityToOtherBranches: settings.visibilityToOtherBranches,
            financialReportingLevel: settings.financialReportingLevel,
            attendanceReportingLevel: settings.attendanceReportingLevel,
            memberDataVisibility: settings.memberDataVisibility,
            timezone: settings.timezone,
            currency: settings.currency,
            language: settings.language,
            brandingSettings: settings.brandingSettings,
            notificationSettings: settings.notificationSettings,
          },
        },
      });
      return true;
    } catch (error) {
      console.error("Error saving branch settings:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    settings: data?.branch?.branchSettings,
    branchName: data?.branch?.name,
    loading: loadingSettings,
    error: settingsError,
    saveSettings,
    isSaving,
    refetch: refetchSettings,
  };
}
