"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import AnnouncementForm from "../../components/AnnouncementForm";

export default function EditAnnouncementPage() {
  const router = useRouter();
  const params = useParams();
  const announcementId = params.id as string;

  const handleSuccess = () => {
    router.push(`/dashboard/communication/announcements/${announcementId}`);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-100 p-4">
      <div className="max-w-4xl mx-auto py-10">
        <AnnouncementForm
          announcementId={announcementId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
