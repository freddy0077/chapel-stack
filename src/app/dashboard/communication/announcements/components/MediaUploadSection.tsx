"use client";

import React, { useState } from "react";
import {
  PhotoIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

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

interface MediaUploadSectionProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export default function MediaUploadSection({
  formData,
  setFormData,
}: MediaUploadSectionProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [imageError, setImageError] = useState<string>();
  const [attachmentError, setAttachmentError] = useState<string>();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    setImageError(undefined);

    try {
      // In real app, upload to S3 or similar
      // For now, create a local URL
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl: url });
    } catch (error) {
      setImageError("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAttachmentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setAttachmentError("Attachment must be less than 10MB");
      return;
    }

    setUploadingAttachment(true);
    setAttachmentError(undefined);

    try {
      // In real app, upload to S3 or similar
      // For now, create a local URL
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, attachmentUrl: url });
    } catch (error) {
      setAttachmentError("Failed to upload attachment");
    } finally {
      setUploadingAttachment(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-gray-900">Media & Attachments</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <PhotoIcon className="w-4 h-4" />
              Featured Image (Optional)
            </div>
          </label>

          {formData.imageUrl ? (
            <div className="relative">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, imageUrl: undefined })}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <PhotoIcon className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-600">
                  {uploadingImage ? "Uploading..." : "Click to upload image"}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          )}

          {imageError && (
            <p className="text-red-500 text-xs mt-1">{imageError}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Max 5MB. Recommended: 1200x600px
          </p>
        </div>

        {/* Attachment Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center gap-2">
              <PaperClipIcon className="w-4 h-4" />
              Attachment (Optional)
            </div>
          </label>

          {formData.attachmentUrl ? (
            <div className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg">
              <div className="flex items-center gap-2">
                <PaperClipIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 truncate">
                  Attachment uploaded
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, attachmentUrl: undefined })
                }
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <PaperClipIcon className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-xs text-gray-600">
                  {uploadingAttachment ? "Uploading..." : "Click to upload file"}
                </p>
              </div>
              <input
                type="file"
                onChange={handleAttachmentUpload}
                disabled={uploadingAttachment}
                className="hidden"
              />
            </label>
          )}

          {attachmentError && (
            <p className="text-red-500 text-xs mt-1">{attachmentError}</p>
          )}
          <p className="text-gray-500 text-xs mt-1">
            Max 10MB. PDF, DOC, XLS, PPT, etc.
          </p>
        </div>
      </div>
    </div>
  );
}
