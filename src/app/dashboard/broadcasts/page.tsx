"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_BROADCASTS } from "@/graphql/queries/broadcastQueries";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import Link from "next/link";
import { 
  Video, 
  Plus, 
  Calendar, 
  Users, 
  Radio,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function BroadcastsPage() {
  const { state } = useAuth();
  const user = state.user;
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data, loading, error, refetch } = useQuery(GET_BROADCASTS, {
    variables: {
      filter: {
        organisationId: user?.organisationId,
        ...(statusFilter !== "ALL" && { status: statusFilter }),
      },
    },
    skip: !user?.organisationId,
  });

  const broadcasts = data?.broadcasts || [];

  const getStatusBadge = (status: string) => {
    const styles = {
      SCHEDULED: "bg-blue-100 text-blue-800 border-blue-200",
      LIVE: "bg-green-100 text-green-800 border-green-200 animate-pulse",
      ENDED: "bg-gray-100 text-gray-800 border-gray-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
      ERROR: "bg-orange-100 text-orange-800 border-orange-200",
    };

    const icons = {
      SCHEDULED: <Clock className="w-3 h-3" />,
      LIVE: <Radio className="w-3 h-3" />,
      ENDED: <CheckCircle className="w-3 h-3" />,
      CANCELLED: <XCircle className="w-3 h-3" />,
      ERROR: <AlertCircle className="w-3 h-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${
          styles[status as keyof typeof styles] || styles.SCHEDULED
        }`}
      >
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      ZOOM: "🎥",
      FACEBOOK: "📘",
      INSTAGRAM: "📷",
      YOUTUBE: "▶️",
    };
    return icons[platform] || "📡";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading broadcasts: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Video className="w-8 h-8 text-blue-600" />
            Live Broadcasts
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your live streaming events across multiple platforms
          </p>
        </div>
        <Link
          href="/dashboard/broadcasts/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Create Broadcast
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["ALL", "SCHEDULED", "LIVE", "ENDED", "CANCELLED"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Broadcasts Grid */}
      {broadcasts.length === 0 ? (
        <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No broadcasts found
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first live broadcast
          </p>
          <Link
            href="/dashboard/broadcasts/create"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Broadcast
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {broadcasts.map((broadcast: any) => (
            <Link
              key={broadcast.id}
              href={`/dashboard/broadcasts/${broadcast.id}`}
              className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                {broadcast.thumbnailUrl ? (
                  <img
                    src={broadcast.thumbnailUrl}
                    alt={broadcast.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Video className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(broadcast.status)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {broadcast.title}
                </h3>

                {broadcast.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {broadcast.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  {new Date(broadcast.scheduledStartTime).toLocaleString()}
                </div>

                {broadcast.status === "LIVE" && (
                  <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                    <Users className="w-4 h-4" />
                    {broadcast.viewerCount} viewers
                  </div>
                )}

                {broadcast.status === "ENDED" && broadcast.peakViewerCount > 0 && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="w-4 h-4" />
                    Peak: {broadcast.peakViewerCount} viewers
                  </div>
                )}

                {/* Platforms */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Platforms:</span>
                  <div className="flex gap-1">
                    {broadcast.platforms.map((platform: any) => (
                      <span
                        key={platform.platform}
                        className="text-lg"
                        title={platform.platform}
                      >
                        {getPlatformIcon(platform.platform)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
