"use client";
import React, { useState } from "react";
import { ChatBubbleLeftEllipsisIcon, CheckCircleIcon, ClockIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import NewPrayerRequestModal from "./NewPrayerRequestModal";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/graphql/hooks/useAuth";
import { Card } from "@tremor/react";
import { usePrayerRequests } from "@/graphql/hooks/usePrayerRequests";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
}

interface PrayerRequest {
  id: string;
  requestText: string;
  status: 'NEW' | 'IN_PROGRESS' | 'ANSWERED';
  createdAt: string;
  member: Member;
}

function statusStyle(status: string) {
  if (status === "ANSWERED") return "bg-green-100 text-green-700 border-green-200";
  return "bg-yellow-100 text-yellow-700 border-yellow-200";
}

function statusIcon(status: string) {
  if (status === "ANSWERED") return <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />;
  return <ClockIcon className="h-5 w-5 text-yellow-500 mr-1" />;
}

function statusText(status: string) {
  switch (status) {
    case 'ANSWERED':
      return 'Answered';
    case 'IN_PROGRESS':
      return 'In Progress';
    case 'NEW':
    default:
      return 'New';
  }
}

export default function PrayerRequestsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { user } = useAuth();
  const organisationId = user?.organisationId;
  const branchId = user?.userBranches?.[0]?.branch?.id;
  const { prayerRequests: requests, loading, error, refetch } = usePrayerRequests(organisationId, branchId);

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
        onSuccess={() => refetch()}
      />
      <div className="px-2 sm:px-6 lg:px-16 py-8 max-w-6xl mx-auto">
        <div className="space-y-6">
          {loading && (
            <Card className="flex justify-center items-center p-6">
              <p>Loading...</p>
            </Card>
          )}
          {error && (
            <Card className="flex justify-center items-center p-6 bg-red-50 text-red-700">
              <ExclamationTriangleIcon className="h-6 w-6 mr-2" />
              <p>Error loading prayer requests: {error.message}</p>
            </Card>
          )}
          {!loading && !error && requests.length > 0 ? (
            requests.map((prayer) => (
              <div
                key={prayer.id}
                className="bg-white rounded-2xl shadow border border-gray-100 hover:shadow-lg transition flex flex-col sm:flex-row sm:items-center gap-4 px-8 py-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-semibold text-indigo-700 text-lg truncate">
                      {prayer.member?.firstName || "-"} {prayer.member?.lastName || ""}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-semibold ${statusStyle(prayer.status)}`}>
                      {statusIcon(prayer.status)}
                      {statusText(prayer.status)}
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
          ) : null}
          {!loading && !error && requests.length === 0 && (
            <div className="text-gray-400 py-12 text-center text-base">No prayer requests found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
