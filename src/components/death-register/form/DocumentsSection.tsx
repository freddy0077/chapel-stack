"use client";

import React from "react";
import { Card, Title, Text, Grid, Button } from "@tremor/react";
import {
  DocumentTextIcon,
  CameraIcon,
  PaperClipIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface DocumentsSectionProps {
  deathCertificateUrl: string;
  obituaryUrl: string;
  photoUrls: string[];
  additionalDocuments: string[];
  onFieldChange: (field: string, value: string | string[]) => void;
  errors: Record<string, string>;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  deathCertificateUrl,
  obituaryUrl,
  photoUrls,
  additionalDocuments,
  onFieldChange,
  errors,
}) => {
  const handleAddPhoto = () => {
    const newUrl = prompt("Enter photo URL:");
    if (newUrl) {
      onFieldChange("photoUrls", [...photoUrls, newUrl]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photoUrls.filter((_, i) => i !== index);
    onFieldChange("photoUrls", newPhotos);
  };

  const handleAddDocument = () => {
    const newUrl = prompt("Enter document URL:");
    if (newUrl) {
      onFieldChange("additionalDocuments", [...additionalDocuments, newUrl]);
    }
  };

  const handleRemoveDocument = (index: number) => {
    const newDocs = additionalDocuments.filter((_, i) => i !== index);
    onFieldChange("additionalDocuments", newDocs);
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
      <Title className="text-amber-800 mb-4 flex items-center">
        <DocumentTextIcon className="h-5 w-5 mr-2" />
        Documents & Media
      </Title>

      <Grid numItems={1} numItemsSm={2} className="gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <DocumentTextIcon className="h-4 w-4 inline mr-1" />
            Death Certificate URL
          </label>
          <input
            type="url"
            value={deathCertificateUrl}
            onChange={(e) =>
              onFieldChange("deathCertificateUrl", e.target.value)
            }
            placeholder="https://..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            <DocumentTextIcon className="h-4 w-4 inline mr-1" />
            Obituary URL
          </label>
          <input
            type="url"
            value={obituaryUrl}
            onChange={(e) => onFieldChange("obituaryUrl", e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </Grid>

      {/* Photo URLs Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            <CameraIcon className="h-4 w-4 inline mr-1" />
            Photos
          </label>
          <Button
            size="sm"
            variant="secondary"
            icon={CameraIcon}
            onClick={handleAddPhoto}
            className="bg-amber-100 text-amber-800 hover:bg-amber-200"
          >
            Add Photo
          </Button>
        </div>

        {photoUrls.length > 0 ? (
          <div className="space-y-2">
            {photoUrls.map((url, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200"
              >
                <div className="flex items-center space-x-3">
                  <CameraIcon className="h-5 w-5 text-amber-600" />
                  <Text className="text-sm text-slate-700 truncate">{url}</Text>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={XMarkIcon}
                  onClick={() => handleRemovePhoto(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 border-2 border-dashed border-amber-200 rounded-lg">
            <CameraIcon className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <Text className="text-amber-600">No photos added yet</Text>
          </div>
        )}
      </div>

      {/* Additional Documents Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700">
            <PaperClipIcon className="h-4 w-4 inline mr-1" />
            Additional Documents
          </label>
          <Button
            size="sm"
            variant="secondary"
            icon={PaperClipIcon}
            onClick={handleAddDocument}
            className="bg-amber-100 text-amber-800 hover:bg-amber-200"
          >
            Add Document
          </Button>
        </div>

        {additionalDocuments.length > 0 ? (
          <div className="space-y-2">
            {additionalDocuments.map((url, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-200"
              >
                <div className="flex items-center space-x-3">
                  <PaperClipIcon className="h-5 w-5 text-amber-600" />
                  <Text className="text-sm text-slate-700 truncate">{url}</Text>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  icon={XMarkIcon}
                  onClick={() => handleRemoveDocument(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 border-2 border-dashed border-amber-200 rounded-lg">
            <PaperClipIcon className="h-8 w-8 text-amber-400 mx-auto mb-2" />
            <Text className="text-amber-600">
              No additional documents added yet
            </Text>
          </div>
        )}
      </div>
    </Card>
  );
};
