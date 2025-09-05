import React, { useEffect, useState } from "react";
import { loadAllOnboardingStepData } from "../utils/onboardingStorage";

const TRACKED_STEPS = [
  "AdminSetup",
  "Branding",
  "ChurchProfile",
  "BranchCount",
  "BranchDetails",
  "UserInvitations",
  "RoleConfiguration",
  "MemberImport",
  "FinanceSetup",
];

interface OnboardingCompletionScreenProps {
  onFinish?: () => void;
}

const OnboardingCompletionScreen: React.FC<OnboardingCompletionScreenProps> = ({
  onFinish,
}) => {
  const [summary, setSummary] = useState<Record<string, unknown>>({});

  useEffect(() => {
    setSummary(loadAllOnboardingStepData(TRACKED_STEPS));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 p-10 flex flex-col items-center">
        <svg
          width="80"
          height="80"
          fill="none"
          viewBox="0 0 80 80"
          className="mb-4"
        >
          <circle cx="40" cy="40" r="40" fill="#4F46E5" opacity="0.1" />
          <path
            d="M24 42l12 12 20-24"
            stroke="#4F46E5"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h2 className="text-3xl font-bold text-indigo-700 mb-2 text-center">
          Onboarding Complete!
        </h2>
        <p className="text-gray-700 text-center mb-6">
          Congratulations! You’ve completed your church setup. You can now start
          managing your organization, invite more members, and explore all
          features.
        </p>
        {/* Onboarding Summary */}
        <div className="w-full mb-6">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">
            Your Setup Summary:
          </h3>
          <div className="bg-indigo-50 rounded-lg p-4 text-sm text-gray-800">
            {/* Admin Setup */}
            {summary.AdminSetup && (
              <div className="mb-4">
                <div className="font-bold text-indigo-600 mb-1">
                  Admin Account
                </div>
                <ul className="ml-5">
                  <li>
                    <span className="font-medium">Name:</span>{" "}
                    {summary.AdminSetup.firstName} {summary.AdminSetup.lastName}
                  </li>
                  <li>
                    <span className="font-medium">Email:</span>{" "}
                    {summary.AdminSetup.email}
                  </li>
                </ul>
              </div>
            )}
            {/* Branding */}
            {summary.Branding && (
              <div className="mb-4">
                <div className="font-bold text-indigo-600 mb-1">Branding</div>
                <ul className="ml-5">
                  <li>
                    <span className="font-medium">Logo:</span>{" "}
                    {summary.Branding.logo || "Not uploaded"}
                  </li>
                  <li>
                    <span className="font-medium">Favicon:</span>{" "}
                    {summary.Branding.favicon || "Not uploaded"}
                  </li>
                  <li>
                    <span className="font-medium">Primary Color:</span>{" "}
                    {summary.Branding.primaryColor}
                  </li>
                  <li>
                    <span className="font-medium">Secondary Color:</span>{" "}
                    {summary.Branding.secondaryColor}
                  </li>
                  <li>
                    <span className="font-medium">Accent Color:</span>{" "}
                    {summary.Branding.accentColor}
                  </li>
                  <li>
                    <span className="font-medium">Slogan:</span>{" "}
                    {summary.Branding.slogan}
                  </li>
                  <li>
                    <span className="font-medium">Font:</span>{" "}
                    {summary.Branding.brandFont}
                  </li>
                  <li>
                    <span className="font-medium">Social Handle:</span>{" "}
                    {summary.Branding.socialHandle}
                  </li>
                </ul>
              </div>
            )}
            {/* Church Profile */}
            {summary.ChurchProfile && (
              <div className="mb-4">
                <div className="font-bold text-indigo-600 mb-1">
                  Church Profile
                </div>
                <ul className="ml-5">
                  <li>
                    <span className="font-medium">Name:</span>{" "}
                    {summary.ChurchProfile.churchName}
                  </li>
                  <li>
                    <span className="font-medium">Denomination:</span>{" "}
                    {summary.ChurchProfile.denomination}
                  </li>
                  <li>
                    <span className="font-medium">Address:</span>{" "}
                    {summary.ChurchProfile.address}
                  </li>
                  <li>
                    <span className="font-medium">Phone:</span>{" "}
                    {summary.ChurchProfile.phone}
                  </li>
                  <li>
                    <span className="font-medium">Email:</span>{" "}
                    {summary.ChurchProfile.email}
                  </li>
                </ul>
              </div>
            )}
            {/* Branch Count */}
            {summary.BranchCount && (
              <div className="mb-4">
                <div className="font-bold text-indigo-600 mb-1">
                  Branch Count
                </div>
                <ul className="ml-5">
                  <li>
                    <span className="font-medium">Number of Branches:</span>{" "}
                    {summary.BranchCount.branchCount}
                  </li>
                </ul>
              </div>
            )}
            {/* Branch Details */}
            {summary.BranchDetails && summary.BranchDetails.branches && (
              <div className="mb-4">
                <div className="font-bold text-indigo-600 mb-1">
                  Branch Details
                </div>
                <ul className="ml-5">
                  {summary.BranchDetails.branches.map(
                    (b: unknown, i: number) => (
                      <li key={i}>
                        <span className="font-medium">{b.name}</span>
                        {b.location ? ` (${b.location})` : ""}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
            {/* User Invitations */}
            {summary.UserInvitations &&
              Array.isArray(summary.UserInvitations) &&
              summary.UserInvitations.length > 0 && (
                <div className="mb-4">
                  <div className="font-bold text-indigo-600 mb-1">
                    Invited Users
                  </div>
                  <ul className="ml-5">
                    {summary.UserInvitations.map((user: unknown, i: number) => (
                      <li key={i}>{user.email}</li>
                    ))}
                  </ul>
                </div>
              )}
            {/* Role Configuration */}
            {summary.RoleConfiguration && summary.RoleConfiguration.roles && (
              <div className="mb-4">
                <div className="font-bold text-indigo-600 mb-1">Roles</div>
                <ul className="ml-5">
                  {summary.RoleConfiguration.roles.map(
                    (role: unknown, i: number) => (
                      <li key={i}>
                        <span className="font-medium">{role.name}:</span>{" "}
                        {Array.isArray(role.permissions)
                          ? role.permissions.join(", ")
                          : ""}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
            {/* Member Import */}
            {summary.MemberImport && (
              <div className="mb-4">
                <div className="font-bold text-indigo-600 mb-1">
                  Member Import
                </div>
                <ul className="ml-5">
                  <li>
                    <span className="font-medium">File:</span>{" "}
                    {summary.MemberImport.fileName}
                  </li>
                  <li>
                    <span className="font-medium">Members Imported:</span>{" "}
                    {summary.MemberImport.memberCount}
                  </li>
                </ul>
              </div>
            )}
            {/* Finance Setup */}
            {summary.FinanceSetup &&
              summary.FinanceSetup.uploadedFiles &&
              summary.FinanceSetup.uploadedFiles.length > 0 && (
                <div className="mb-4">
                  <div className="font-bold text-indigo-600 mb-1">
                    Finance Data Imported
                  </div>
                  <ul className="ml-5">
                    {summary.FinanceSetup.uploadedFiles.map(
                      (f: string, i: number) => (
                        <li key={i}>{f}</li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            {/* Fallback */}
            {Object.values(summary).every((v) => !v) && (
              <div className="text-gray-500">
                No onboarding data was tracked.
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onFinish}
          className="px-8 py-3 rounded-lg bg-indigo-600 text-white text-lg font-semibold shadow hover:bg-indigo-700 transition"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default OnboardingCompletionScreen;
