"use client";

import React, { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  CheckIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";
import AnnouncementFormEditor from "./AnnouncementFormEditor";
import SchedulingSection from "./SchedulingSection";
import TargetingSection from "./TargetingSection";
import MediaUploadSection from "./MediaUploadSection";
import PreviewSection from "./PreviewSection";

interface AnnouncementFormProps {
  announcementId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface FormData {
  title: string;
  content: string;
  category: string;
  priority: string;
  targetAudience: string;
  targetGroupIds: string[];
  imageUrl?: string;
  attachmentUrl?: string;
  sendEmail: boolean;
  sendPush: boolean;
  displayOnBoard: boolean;
  displayOnDashboard: boolean;
  scheduledFor?: Date;
  expiresAt?: Date;
}

const CATEGORIES = ["General", "Event", "Urgent", "Maintenance"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];
const TARGET_AUDIENCES = [
  { value: "ALL", label: "All Members" },
  { value: "STAFF_ONLY", label: "Staff Only" },
  { value: "SPECIFIC_GROUPS", label: "Specific Groups" },
];

const CREATE_ANNOUNCEMENT = `
  mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
    createAnnouncement(input: $input) {
      id
      title
      status
      createdAt
    }
  }
`;

const UPDATE_ANNOUNCEMENT = `
  mutation UpdateAnnouncement($id: ID!, $input: UpdateAnnouncementInput!) {
    updateAnnouncement(id: $id, input: $input) {
      id
      title
      status
      updatedAt
    }
  }
`;

const GET_ANNOUNCEMENT = `
  query GetAnnouncement($id: ID!) {
    announcement(id: $id) {
      id
      title
      content
      category
      priority
      status
      targetAudience
      targetGroupIds
      imageUrl
      attachmentUrl
      sendEmail
      sendPush
      displayOnBoard
      displayOnDashboard
      scheduledFor
      expiresAt
    }
  }
`;

export default function AnnouncementForm({
  announcementId,
  onSuccess,
  onCancel,
}: AnnouncementFormProps) {
  const { branchId } = useOrganisationBranch();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    category: "General",
    priority: "Medium",
    targetAudience: "ALL",
    targetGroupIds: [],
    sendEmail: true,
    sendPush: true,
    displayOnBoard: true,
    displayOnDashboard: true,
  });

  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<"content" | "settings" | "preview">("content");

  // Load existing announcement if editing
  const { data: existingData, loading: loadingExisting } = useQuery(
    GET_ANNOUNCEMENT,
    {
      variables: { id: announcementId },
      skip: !announcementId,
    }
  );

  useEffect(() => {
    if (existingData?.announcement) {
      const announcement = existingData.announcement;
      setFormData({
        title: announcement.title,
        content: announcement.content,
        category: announcement.category,
        priority: announcement.priority,
        targetAudience: announcement.targetAudience,
        targetGroupIds: announcement.targetGroupIds || [],
        imageUrl: announcement.imageUrl,
        attachmentUrl: announcement.attachmentUrl,
        sendEmail: announcement.sendEmail,
        sendPush: announcement.sendPush,
        displayOnBoard: announcement.displayOnBoard,
        displayOnDashboard: announcement.displayOnDashboard,
        scheduledFor: announcement.scheduledFor
          ? new Date(announcement.scheduledFor)
          : undefined,
        expiresAt: announcement.expiresAt
          ? new Date(announcement.expiresAt)
          : undefined,
      });
    }
  }, [existingData]);

  // Create mutation
  const [createAnnouncement, { loading: creatingAnnouncement }] = useMutation(
    CREATE_ANNOUNCEMENT,
    {
      onSuccess: () => {
        setFormData({
          title: "",
          content: "",
          category: "General",
          priority: "Medium",
          targetAudience: "ALL",
          targetGroupIds: [],
          sendEmail: true,
          sendPush: true,
          displayOnBoard: true,
          displayOnDashboard: true,
        });
        onSuccess?.();
      },
      onError: (error) => {
        setErrors({ submit: error.message });
      },
    }
  );

  // Update mutation
  const [updateAnnouncement, { loading: updatingAnnouncement }] = useMutation(
    UPDATE_ANNOUNCEMENT,
    {
      onSuccess: () => {
        onSuccess?.();
      },
      onError: (error) => {
        setErrors({ submit: error.message });
      },
    }
  );

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }
    if (formData.targetAudience === "SPECIFIC_GROUPS" && formData.targetGroupIds.length === 0) {
      newErrors.targetGroups = "Please select at least one group";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const input = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      priority: formData.priority,
      targetAudience: formData.targetAudience,
      targetGroupIds: formData.targetGroupIds,
      imageUrl: formData.imageUrl,
      attachmentUrl: formData.attachmentUrl,
      sendEmail: formData.sendEmail,
      sendPush: formData.sendPush,
      displayOnBoard: formData.displayOnBoard,
      displayOnDashboard: formData.displayOnDashboard,
      scheduledFor: formData.scheduledFor,
      expiresAt: formData.expiresAt,
    };

    if (announcementId) {
      await updateAnnouncement({
        variables: { id: announcementId, input },
      });
    } else {
      await createAnnouncement({
        variables: { input },
      });
    }
  };

  if (loadingExisting) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  const isLoading = creatingAnnouncement || updatingAnnouncement;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {announcementId ? "Edit Announcement" : "Create Announcement"}
          </h2>
          <p className="text-gray-600 mt-1">
            {announcementId
              ? "Update your announcement details"
              : "Create a new announcement for your branch"}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: "content", label: "Content" },
          { id: "settings", label: "Settings" },
          { id: "preview", label: "Preview" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as typeof tab)}
            className={`px-4 py-2 font-medium border-b-2 transition-all ${
              tab === t.id
                ? "border-violet-500 text-violet-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content Tab */}
        {tab === "content" && (
          <AnnouncementFormEditor
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />
        )}

        {/* Settings Tab */}
        {tab === "settings" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                >
                  {PRIORITIES.map((pri) => (
                    <option key={pri} value={pri}>
                      {pri}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Targeting */}
            <TargetingSection
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />

            {/* Scheduling */}
            <SchedulingSection formData={formData} setFormData={setFormData} />

            {/* Media */}
            <MediaUploadSection formData={formData} setFormData={setFormData} />

            {/* Distribution Options */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-gray-900">Distribution</h3>
              {[
                { key: "sendEmail", label: "Send Email" },
                { key: "sendPush", label: "Send Push Notification" },
                { key: "displayOnBoard", label: "Display on Notice Board" },
                { key: "displayOnDashboard", label: "Display on Dashboard" },
              ].map((option) => (
                <label
                  key={option.key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData[option.key as keyof FormData] as boolean}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [option.key]: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded border-gray-300 text-violet-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Preview Tab */}
        {tab === "preview" && (
          <PreviewSection formData={formData} />
        )}

        {/* Form Actions */}
        <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className="px-4 py-2 border border-violet-300 rounded-lg text-violet-700 font-medium hover:bg-violet-50 transition-all"
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="w-5 h-5" />
                {announcementId ? "Update" : "Create"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
