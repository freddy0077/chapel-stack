"use client";

import { useState, useEffect } from "react";
import {
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CheckCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useQuery, useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { toast } from "react-hot-toast";

const GET_BRANCH_COMMUNICATION = gql`
  query GetBranchCommunication($id: String!) {
    branch(id: $id) {
      id
      name
      emailDisplayName
      emailSignature
      smsDisplayName
    }
  }
`;

const UPDATE_BRANCH_COMMUNICATION = gql`
  mutation UpdateBranchCommunication($id: ID!, $input: UpdateBranchInput!) {
    updateBranch(id: $id, updateBranchInput: $input) {
      id
      emailDisplayName
      emailSignature
      smsDisplayName
    }
  }
`;

export default function CommunicationSettings() {
  const { state } = useAuth();
  
  // Extract branchId from userBranches array (first branch)
  const branchId = state.user?.branchId || state.user?.userBranches?.[0]?.branch?.id;

  const { data, loading, refetch, error } = useQuery(GET_BRANCH_COMMUNICATION, {
    variables: { id: branchId },
    skip: !branchId,
  });

  const [updateBranch, { loading: updating }] = useMutation(UPDATE_BRANCH_COMMUNICATION);

  const [formData, setFormData] = useState({
    emailDisplayName: "",
    emailSignature: "",
    smsDisplayName: "",
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (data?.branch) {
      setFormData({
        emailDisplayName: data.branch.emailDisplayName || data.branch.name || "",
        emailSignature: data.branch.emailSignature || "",
        smsDisplayName: data.branch.smsDisplayName || data.branch.name || "",
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateBranch({
        variables: {
          id: branchId,
          input: formData,
        },
      });

      setSaveSuccess(true);
      toast.success("Communication settings updated successfully!");
      refetch();

      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating communication settings:", error);
      toast.error("Failed to update communication settings");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!branchId) {
    return (
      <div className="text-center py-12">
        <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No branch assigned
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          You don't have a branch assigned to your account.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto h-12 w-12 text-red-400 mb-4">⚠️</div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Error loading communication settings
        </h3>
        <p className="mt-1 text-sm text-red-600">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center gap-2">
          <SparklesIcon className="h-6 w-6 text-indigo-600" />
          Communication Settings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Configure how your branch appears in automated emails and SMS messages
        </p>
      </div>

      {/* Email Settings */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <EnvelopeIcon className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-base font-semibold leading-6 text-gray-900">
              Email Configuration
            </h4>
            <p className="text-sm text-gray-500">
              Settings for automated email messages
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label
              htmlFor="emailDisplayName"
              className="block text-sm font-medium text-gray-700"
            >
              Email Display Name <span className="text-red-500">*</span>
            </label>
            <p className="mt-1 text-xs text-gray-500">
              This name appears in the "From" field of all automated emails (birthday messages, announcements, etc.)
            </p>
            <input
              type="text"
              name="emailDisplayName"
              id="emailDisplayName"
              value={formData.emailDisplayName}
              onChange={handleChange}
              required
              maxLength={255}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="St. Mary's Cathedral"
            />
            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Preview:</span> From: {formData.emailDisplayName || "Your Church Name"}
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="emailSignature"
              className="block text-sm font-medium text-gray-700"
            >
              Email Signature
            </label>
            <p className="mt-1 text-xs text-gray-500">
              This signature will be added to the end of all automated emails
            </p>
            <textarea
              name="emailSignature"
              id="emailSignature"
              rows={6}
              value={formData.emailSignature}
              onChange={handleChange}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm font-mono text-sm"
              placeholder="With love and prayers,&#10;Your Church Family&#10;&#10;St. Mary's Cathedral&#10;123 Main Street&#10;contact@church.org"
            />
          </div>
        </div>
      </div>

      {/* SMS Settings */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <DevicePhoneMobileIcon className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h4 className="text-base font-semibold leading-6 text-gray-900">
              SMS Configuration
            </h4>
            <p className="text-sm text-gray-500">
              Settings for automated text messages
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="smsDisplayName"
            className="block text-sm font-medium text-gray-700"
          >
            SMS Display Name
          </label>
          <p className="mt-1 text-xs text-gray-500">
            This name appears at the end of SMS messages (max 20 characters for SMS constraints)
          </p>
          <input
            type="text"
            name="smsDisplayName"
            id="smsDisplayName"
            value={formData.smsDisplayName}
            onChange={handleChange}
            maxLength={20}
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="St. Mary's"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="p-3 bg-gray-50 rounded-md border border-gray-200 flex-1">
              <p className="text-xs text-gray-600">
                <span className="font-medium">Preview:</span> - {formData.smsDisplayName || "Your Church"}
              </p>
            </div>
            <div className="ml-4 text-xs text-gray-500">
              {formData.smsDisplayName.length}/20
            </div>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 shadow-sm ring-1 ring-indigo-900/10 rounded-xl p-6">
        <h4 className="text-base font-semibold leading-6 text-gray-900 mb-4">
          📧 Email Preview Example
        </h4>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 pb-3 mb-4">
            <p className="text-sm text-gray-500">From</p>
            <p className="font-medium text-gray-900">
              {formData.emailDisplayName || "Your Church Name"}
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-lg font-semibold text-gray-900">
              Happy Birthday John! 🎉
            </p>
            <p className="text-sm text-gray-700">
              Wishing you a blessed birthday filled with joy and God's blessings...
            </p>
          </div>
          <div className="border-t border-gray-200 mt-6 pt-4">
            <pre className="text-sm text-gray-600 whitespace-pre-line font-sans">
              {formData.emailSignature || "With love and prayers,\nYour Church Family"}
            </pre>
          </div>
        </div>

        <h4 className="text-base font-semibold leading-6 text-gray-900 mb-4 mt-6">
          📱 SMS Preview Example
        </h4>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <p className="text-sm text-gray-700">
            Happy Birthday John! 🎉 Wishing you a blessed birthday...
          </p>
          <p className="text-sm text-gray-600 mt-2">
            - {formData.smsDisplayName || "Your Church"}
          </p>
        </div>
      </div>

      {/* Usage Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-blue-900 mb-3">
          ℹ️ Where These Settings Are Used
        </h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span><strong>Birthday Messages:</strong> Automated emails and SMS sent to members on their birthday</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span><strong>Anniversary Messages:</strong> Wedding and sacramental anniversary greetings</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span><strong>Announcements:</strong> Church-wide communications and updates</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span><strong>Event Reminders:</strong> Notifications about upcoming events</span>
          </li>
        </ul>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-x-6 pt-4 border-t border-gray-200">
        {saveSuccess && (
          <div className="flex items-center text-green-600">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Saved successfully!</span>
          </div>
        )}
        <button
          type="submit"
          disabled={updating}
          className="rounded-md bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {updating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Communication Settings"
          )}
        </button>
      </div>
    </form>
  );
}
