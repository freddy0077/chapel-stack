"use client";

import React from "react";
import { useRouter } from "next/navigation";
import AnnouncementForm from "../components/AnnouncementForm";

export default function CreateAnnouncementPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/dashboard/communication?tab=announcements");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-100 p-4">
      <div className="max-w-4xl mx-auto py-10">
        <AnnouncementForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
