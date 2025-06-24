"use client";
import React, { useState } from "react";
import { ChatBubbleLeftEllipsisIcon, CheckCircleIcon, ClockIcon } from "@heroicons/react/24/outline";
import NewPrayerRequestModal from "./NewPrayerRequestModal";
import DashboardHeader from "@/components/DashboardHeader";

// Placeholder for fetching all prayer requests (replace with real API call)
const dummyPrayerRequests = [
  {
    id: "1",
    memberName: "John Doe",
    requestText: "Pray for healing.",
    status: "OPEN",
    createdAt: "2025-06-17T10:00:00Z",
  },
  {
    id: "2",
    memberName: "Alice Brown",
    requestText: "Guidance for career decisions.",
    status: "ANSWERED",
    createdAt: "2025-06-18T08:00:00Z",
  },
];

function statusStyle(status: string) {
  if (status === "ANSWERED") return "bg-green-100 text-green-700 border-green-200";
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
}

function statusIcon(status: string) {
  if (status === "ANSWERED") return <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />;
  return <ClockIcon className="h-5 w-5 text-yellow-500 mr-1" />;
}

export default function PrayerRequestsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [requests, setRequests] = useState(dummyPrayerRequests);

  const handleAddPrayerRequest = (data: { memberName: string; requestText: string }) => {
    setRequests([
      {
        id: (Math.random() * 100000).toFixed(0),
        memberName: data.memberName,
        requestText: data.requestText,
        status: "OPEN",
        createdAt: new Date().toISOString(),
      },
      ...requests,
    ]);
  };

  return (
    <div>
      <DashboardHeader
        title="Prayer Requests"
        subtitle="View and manage all prayer requests from your community."
        icon={<ChatBubbleLeftEllipsisIcon className="h-10 w-10 text-white" />}
        action={
          <button
            className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-indigo-700 font-semibold px-6 py-2 rounded-lg shadow transition text-base border border-indigo-200"
            onClick={() => setModalOpen(true)}
          >
            + Add Prayer Request
          </button>
        }
      />
      <NewPrayerRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddPrayerRequest}
      />
      {/* Redesigned List Layout - full width and visually engaging */}
      <div className="px-2 sm:px-6 lg:px-16 py-8 max-w-6xl mx-auto">
        <div className="space-y-6">
          {requests.length > 0 ? (
            requests.map((prayer) => (
              <div
                key={prayer.id}
                className="bg-white rounded-2xl shadow border border-gray-100 hover:shadow-lg transition flex flex-col sm:flex-row sm:items-center gap-4 px-8 py-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-semibold text-indigo-700 text-lg truncate">{prayer.memberName}</span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-semibold ${statusStyle(prayer.status)}`}>
                      {statusIcon(prayer.status)}
                      {prayer.status === "ANSWERED" ? "Answered" : "Open"}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">{new Date(prayer.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-gray-700 text-base whitespace-pre-line break-words">
                    {prayer.requestText}
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 sm:gap-3 items-end sm:items-center">
                  <button className="text-indigo-600 hover:text-indigo-900 font-semibold text-sm">View</button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 py-12 text-center text-base">No prayer requests found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
