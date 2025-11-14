"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
  BellIcon,
} from "@heroicons/react/24/outline";

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  status: string;
  publishedAt?: string;
  scheduledFor?: string;
  expiresAt?: string;
  targetAudience: string;
  imageUrl?: string;
  sendEmail: boolean;
  sendPush: boolean;
  displayOnBoard: boolean;
  displayOnDashboard: boolean;
  creator: {
    firstName: string;
    lastName: string;
    email: string;
  };
  _count?: {
    reads: number;
    deliveries: number;
  };
}

const GET_ANNOUNCEMENT = `
  query GetAnnouncement($id: ID!) {
    announcement(id: $id) {
      id
      title
      content
      category
      priority
      status
      publishedAt
      scheduledFor
      expiresAt
      targetAudience
      imageUrl
      sendEmail
      sendPush
      displayOnBoard
      displayOnDashboard
      creator {
        firstName
        lastName
        email
      }
      _count {
        reads
        deliveries
      }
    }
  }
`;

const GET_DELIVERY_STATUS = `
  query GetDeliveryStatus($id: ID!) {
    announcementDeliveryStatus(id: $id) {
      stats {
        total
        emailSent
        emailOpened
        pushSent
        linkClicked
        emailErrors
        pushErrors
      }
    }
  }
`;

const GET_METRICS = `
  query GetMetrics($id: ID!) {
    announcementMetrics(id: $id) {
      totalReads
      totalDeliveries
      emailSent
      emailOpened
      emailOpenRate
      pushSent
      linkClicked
      clickRate
    }
  }
`;

const DELETE_ANNOUNCEMENT = `
  mutation DeleteAnnouncement($id: ID!) {
    deleteAnnouncement(id: $id)
  }
`;

const PUBLISH_ANNOUNCEMENT = `
  mutation PublishAnnouncement($id: ID!) {
    publishAnnouncement(id: $id) {
      id
      status
      publishedAt
    }
  }
`;

const ARCHIVE_ANNOUNCEMENT = `
  mutation ArchiveAnnouncement($id: ID!) {
    archiveAnnouncement(id: $id) {
      id
      status
    }
  }
`;

export default function AnnouncementDetailPage() {
  const router = useRouter();
  const params = useParams();
  const announcementId = params.id as string;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: announcementData, loading: loadingAnnouncement } = useQuery(
    GET_ANNOUNCEMENT,
    {
      variables: { id: announcementId },
    }
  );

  const { data: deliveryData } = useQuery(GET_DELIVERY_STATUS, {
    variables: { id: announcementId },
  });

  const { data: metricsData } = useQuery(GET_METRICS, {
    variables: { id: announcementId },
  });

  const [deleteAnnouncement, { loading: deleting }] = useMutation(
    DELETE_ANNOUNCEMENT,
    {
      onCompleted: () => {
        router.push("/dashboard/communication?tab=announcements");
      },
    }
  );

  const [publishAnnouncement, { loading: publishing }] = useMutation(
    PUBLISH_ANNOUNCEMENT
  );

  const [archiveAnnouncement, { loading: archiving }] = useMutation(
    ARCHIVE_ANNOUNCEMENT
  );

  if (loadingAnnouncement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  const announcement: Announcement = announcementData?.announcement;
  const stats = deliveryData?.announcementDeliveryStatus?.stats;
  const metrics = metricsData?.announcementMetrics;

  if (!announcement) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Announcement not found</p>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "CRITICAL":
        return "bg-red-100 text-red-700";
      case "HIGH":
        return "bg-orange-100 text-orange-700";
      case "MEDIUM":
        return "bg-blue-100 text-blue-700";
      case "LOW":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <CheckIcon className="w-5 h-5 text-green-500" />;
      case "SCHEDULED":
        return <ClockIcon className="w-5 h-5 text-blue-500" />;
      case "DRAFT":
        return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-100 p-4">
      <div className="max-w-4xl mx-auto py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back
          </button>
          <div className="flex gap-2">
            {announcement.status === "DRAFT" && (
              <>
                <button
                  onClick={() => router.push(`/dashboard/communication/announcements/${announcementId}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 border border-violet-300 rounded-lg text-violet-700 font-medium hover:bg-violet-50 transition-all"
                >
                  <PencilIcon className="w-5 h-5" />
                  Edit
                </button>
                <button
                  onClick={() => publishAnnouncement({ variables: { id: announcementId } })}
                  disabled={publishing}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  <CheckIcon className="w-5 h-5" />
                  {publishing ? "Publishing..." : "Publish"}
                </button>
              </>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2 border border-red-300 rounded-lg text-red-700 font-medium hover:bg-red-50 transition-all"
            >
              <TrashIcon className="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Announcement?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. The announcement will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteAnnouncement({ variables: { id: announcementId } })}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Title & Status */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {announcement.title}
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  {getStatusIcon(announcement.status)}
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(announcement.priority)}`}>
                    {announcement.priority}
                  </span>
                  <span className="text-sm text-gray-600">{announcement.category}</span>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-4">
              <div>
                <p className="font-semibold">Created by</p>
                <p>{announcement.creator.firstName} {announcement.creator.lastName}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <p className="capitalize">{announcement.status}</p>
              </div>
              {announcement.publishedAt && (
                <div>
                  <p className="font-semibold">Published</p>
                  <p>{new Date(announcement.publishedAt).toLocaleString()}</p>
                </div>
              )}
              {announcement.scheduledFor && (
                <div>
                  <p className="font-semibold">Scheduled for</p>
                  <p>{new Date(announcement.scheduledFor).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Content</h2>
            {announcement.imageUrl && (
              <img
                src={announcement.imageUrl}
                alt="Announcement"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: announcement.content }} />
            </div>
          </div>

          {/* Delivery Stats */}
          {stats && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <EnvelopeIcon className="w-5 h-5 text-blue-500" />
                    <p className="text-sm text-gray-600">Email Sent</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{stats.emailSent}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Email Opened</p>
                  <p className="text-2xl font-bold text-green-900">{stats.emailOpened}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BellIcon className="w-5 h-5 text-purple-500" />
                    <p className="text-sm text-gray-600">Push Sent</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{stats.pushSent}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Link Clicked</p>
                  <p className="text-2xl font-bold text-orange-900">{stats.linkClicked}</p>
                </div>
              </div>
            </div>
          )}

          {/* Engagement Metrics */}
          {metrics && (
            <div className="border-t pt-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Engagement Metrics</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Total Reads</p>
                  <p className="text-2xl font-bold text-violet-900">{metrics.totalReads}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Email Open Rate</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {metrics.emailOpenRate.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Click Rate</p>
                  <p className="text-2xl font-bold text-green-900">
                    {metrics.clickRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Distribution Settings */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Distribution</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Email", value: announcement.sendEmail },
                { label: "Push Notification", value: announcement.sendPush },
                { label: "Notice Board", value: announcement.displayOnBoard },
                { label: "Dashboard", value: announcement.displayOnDashboard },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.value ? "bg-green-500" : "bg-gray-300"
                    }`}
                  ></div>
                  <span className="text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
