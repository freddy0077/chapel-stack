"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_BROADCAST } from "@/graphql/queries/broadcastQueries";
import {
  START_BROADCAST,
  END_BROADCAST,
  CANCEL_BROADCAST,
  DELETE_BROADCAST,
} from "@/graphql/mutations/broadcastMutations";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  Calendar,
  Users,
  Radio,
  Play,
  Square,
  XCircle,
  Trash2,
  ExternalLink,
  Copy,
  Clock,
} from "lucide-react";

export default function BroadcastDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(GET_BROADCAST, {
    variables: { id: params.id },
    pollInterval: 5000, // Poll every 5 seconds for live updates
  });

  const [startBroadcast, { loading: starting }] = useMutation(START_BROADCAST, {
    onCompleted: () => {
      toast.success("Broadcast started!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to start broadcast");
    },
  });

  const [endBroadcast, { loading: ending }] = useMutation(END_BROADCAST, {
    onCompleted: () => {
      toast.success("Broadcast ended!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to end broadcast");
    },
  });

  const [cancelBroadcast, { loading: cancelling }] = useMutation(
    CANCEL_BROADCAST,
    {
      onCompleted: () => {
        toast.success("Broadcast cancelled!");
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to cancel broadcast");
      },
    }
  );

  const [deleteBroadcast, { loading: deleting }] = useMutation(
    DELETE_BROADCAST,
    {
      onCompleted: () => {
        toast.success("Broadcast deleted!");
        router.push("/dashboard/broadcasts");
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete broadcast");
      },
    }
  );

  const handleStart = () => {
    if (confirm("Are you sure you want to start this broadcast?")) {
      startBroadcast({ variables: { id: params.id } });
    }
  };

  const handleEnd = () => {
    if (confirm("Are you sure you want to end this broadcast?")) {
      endBroadcast({ variables: { id: params.id } });
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel this broadcast?")) {
      cancelBroadcast({ variables: { id: params.id } });
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this broadcast? This action cannot be undone."
      )
    ) {
      deleteBroadcast({ variables: { id: params.id } });
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !data?.broadcast) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            Error loading broadcast: {error?.message || "Broadcast not found"}
          </p>
        </div>
      </div>
    );
  }

  const broadcast = data.broadcast;
  const isLive = broadcast.status === "LIVE";
  const isScheduled = broadcast.status === "SCHEDULED";
  const isEnded = broadcast.status === "ENDED";

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      ZOOM: "🎥",
      FACEBOOK: "📘",
      INSTAGRAM: "📷",
      YOUTUBE: "▶️",
    };
    return icons[platform] || "📡";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: "bg-gray-100 text-gray-800",
      CONNECTED: "bg-blue-100 text-blue-800",
      LIVE: "bg-green-100 text-green-800",
      ENDED: "bg-gray-100 text-gray-800",
      ERROR: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/broadcasts"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Broadcasts
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {broadcast.title}
              </h1>
              {isLive && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium animate-pulse">
                  <Radio className="w-4 h-4" />
                  LIVE
                </span>
              )}
            </div>
            {broadcast.description && (
              <p className="text-gray-600">{broadcast.description}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {isScheduled && (
              <>
                <button
                  onClick={handleStart}
                  disabled={starting}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Start
                </button>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}

            {isLive && (
              <button
                onClick={handleEnd}
                disabled={ending}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <Square className="w-4 h-4" />
                End Broadcast
              </button>
            )}

            {(isEnded || broadcast.status === "CANCELLED") && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live Stats */}
      {isLive && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Radio className="w-5 h-5 text-green-600" />
            Live Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Current Viewers</div>
              <div className="text-3xl font-bold text-gray-900">
                {broadcast.viewerCount}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Peak Viewers</div>
              <div className="text-3xl font-bold text-gray-900">
                {broadcast.peakViewerCount}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">Duration</div>
              <div className="text-3xl font-bold text-gray-900">
                {broadcast.actualStartTime
                  ? Math.floor(
                      (Date.now() -
                        new Date(broadcast.actualStartTime).getTime()) /
                        60000
                    )
                  : 0}{" "}
                min
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Details */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Details</h2>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600">Scheduled Start</div>
                <div className="font-medium text-gray-900">
                  {new Date(broadcast.scheduledStartTime).toLocaleString()}
                </div>
              </div>
            </div>

            {broadcast.actualStartTime && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-600">Actual Start</div>
                  <div className="font-medium text-gray-900">
                    {new Date(broadcast.actualStartTime).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {broadcast.actualEndTime && (
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <div className="text-sm text-gray-600">Ended At</div>
                  <div className="font-medium text-gray-900">
                    {new Date(broadcast.actualEndTime).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <div className="text-sm text-gray-600">Settings</div>
                <div className="font-medium text-gray-900">
                  {broadcast.isPublic ? "Public" : "Private"} •{" "}
                  {broadcast.isRecorded ? "Recording" : "Not Recording"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Platforms</h2>

          <div className="space-y-3">
            {broadcast.platforms.map((platform: any) => (
              <div
                key={platform.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {getPlatformIcon(platform.platform)}
                  </span>
                  <div>
                    <div className="font-medium text-gray-900">
                      {platform.platform}
                    </div>
                    <div className="text-sm text-gray-600">
                      {platform.viewerCount} viewers
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    platform.status
                  )}`}
                >
                  {platform.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Links */}
      {broadcast.zoomJoinUrl && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Join Links
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={broadcast.zoomJoinUrl}
                readOnly
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={() =>
                  copyToClipboard(broadcast.zoomJoinUrl, "Join URL")
                }
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
              <a
                href={broadcast.zoomJoinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Recording */}
      {broadcast.recordingUrl && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recording
          </h2>
          <a
            href={broadcast.recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Video className="w-4 h-4" />
            View Recording
          </a>
        </div>
      )}
    </div>
  );
}
