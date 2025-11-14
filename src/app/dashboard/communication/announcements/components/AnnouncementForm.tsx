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
import {
  CREATE_ANNOUNCEMENT,
  UPDATE_ANNOUNCEMENT,
  PUBLISH_ANNOUNCEMENT,
} from "@/graphql/mutations/announcementMutations";
import { GET_ANNOUNCEMENT, GET_ANNOUNCEMENTS, GET_ANNOUNCEMENT_TEMPLATES } from "@/graphql/queries/announcementQueries";
import { toast } from "react-hot-toast";

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

// GraphQL documents are now imported from centralized files above

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
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  // Load existing announcement if editing
  const { data: existingData, loading: loadingExisting } = useQuery(
    GET_ANNOUNCEMENT,
    {
      variables: { id: announcementId },
      skip: !announcementId,
    }
  );

  // Load templates for apply-template feature
  const { data: templatesData, loading: loadingTemplates } = useQuery(
    GET_ANNOUNCEMENT_TEMPLATES,
    {
      variables: { branchId },
      skip: !branchId,
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
      onCompleted: () => {
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
        toast.success("Announcement created");
        onSuccess?.();
      },
      onError: (error) => {
        setErrors({ submit: error.message });
        toast.error(error.message);
      },
    }
  );

  // Update mutation
  const [updateAnnouncement, { loading: updatingAnnouncement }] = useMutation(
    UPDATE_ANNOUNCEMENT,
    {
      onCompleted: () => {
        toast.success("Announcement updated");
        onSuccess?.();
      },
      onError: (error) => {
        setErrors({ submit: error.message });
        toast.error(error.message);
      },
    }
  );

  // Publish mutation
  const [publishAnnouncement, { loading: publishing }] = useMutation(
    PUBLISH_ANNOUNCEMENT,
    {
      onCompleted: () => {
        toast.success("Announcement published");
      },
      onError: (error) => {
        setErrors({ submit: error.message });
        toast.error(error.message);
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
        refetchQueries: [
          {
            query: GET_ANNOUNCEMENTS,
            variables: { branchId },
          },
        ],
      });
    } else {
      await createAnnouncement({
        variables: { input },
        refetchQueries: [
          {
            query: GET_ANNOUNCEMENTS,
            variables: { branchId },
          },
        ],
      });
    }
  };

  // Create & Publish flow
  const handleCreateAndPublish = async (e: React.MouseEvent) => {
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

    try {
      const result = await createAnnouncement({
        variables: { input },
      });

      const newId = result?.data?.createAnnouncement?.id;
      if (newId) {
        await publishAnnouncement({
          variables: { id: newId },
          refetchQueries: [
            {
              query: GET_ANNOUNCEMENTS,
              variables: { branchId },
            },
          ],
        });
      }

      onSuccess?.();
    } catch (err: any) {
      setErrors({ submit: err?.message || "Failed to create and publish" });
      toast.error(err?.message || "Failed to create and publish");
    }
  };

  // Apply selected template to form
  const handleApplyTemplate = () => {
    if (!selectedTemplateId) return;
    const tpl = templatesData?.announcementTemplates?.find((t: any) => t.id === selectedTemplateId);
    if (!tpl) return;
    setFormData((prev) => ({
      ...prev,
      title: tpl.name || prev.title,
      content: tpl.content || prev.content,
      category: tpl.category || prev.category,
    }));
    toast.success("Template applied");
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
          <div className="space-y-4">
            {/* Templates selector */}
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Template</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  disabled={loadingTemplates || !templatesData?.announcementTemplates?.length}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50"
                >
                  <option value="">Select a template</option>
                  {templatesData?.announcementTemplates?.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleApplyTemplate}
                disabled={!selectedTemplateId}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Apply
              </button>
            </div>

            <AnnouncementFormEditor
              formData={formData}
              setFormData={setFormData}
              errors={errors}
            />
          </div>
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
          {!announcementId && (
            <button
              type="button"
              onClick={handleCreateAndPublish}
              disabled={isLoading || publishing}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {publishing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating & Publishing...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5" />
                  Create & Publish
                </>
              )}
            </button>
          )}
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
