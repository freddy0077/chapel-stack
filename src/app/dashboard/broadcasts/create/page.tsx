"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_BROADCAST } from "@/graphql/mutations/broadcastMutations";
import { GET_BROADCASTS } from "@/graphql/queries/broadcastQueries";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowLeft, Video, Calendar, Clock, Users, Image } from "lucide-react";
import Link from "next/link";

export default function CreateBroadcastPage() {
  const { state } = useAuth();
  const user = state.user;
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scheduledStartTime: "",
    scheduledEndTime: "",
    platforms: [] as string[],
    isRecorded: true,
    isPublic: true,
    maxAttendees: "",
    thumbnailUrl: "",
  });

  const [createBroadcast, { loading }] = useMutation(CREATE_BROADCAST, {
    onCompleted: (data) => {
      toast.success("Broadcast created successfully!");
      router.push(`/dashboard/broadcasts/${data.createBroadcast.id}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create broadcast");
    },
    refetchQueries: [
      {
        query: GET_BROADCASTS,
        variables: {
          filter: { organisationId: user?.organisationId },
        },
      },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.scheduledStartTime) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.platforms.length === 0) {
      toast.error("Please select at least one platform");
      return;
    }

    await createBroadcast({
      variables: {
        input: {
          title: formData.title,
          description: formData.description || null,
          scheduledStartTime: formData.scheduledStartTime,
          scheduledEndTime: formData.scheduledEndTime || null,
          platforms: formData.platforms,
          isRecorded: formData.isRecorded,
          isPublic: formData.isPublic,
          maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null,
          thumbnailUrl: formData.thumbnailUrl || null,
        },
      },
    });
  };

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const platforms = [
    { id: "ZOOM", name: "Zoom", icon: "🎥", color: "blue" },
    { id: "FACEBOOK", name: "Facebook Live", icon: "📘", color: "indigo" },
    { id: "INSTAGRAM", name: "Instagram Live", icon: "📷", color: "pink" },
    { id: "YOUTUBE", name: "YouTube Live", icon: "▶️", color: "red" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/broadcasts"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Broadcasts
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Video className="w-8 h-8 text-blue-600" />
          Create Live Broadcast
        </h1>
        <p className="text-gray-600 mt-1">
          Schedule a new live streaming event
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Sunday Service - Week 1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Add a description for your broadcast..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail URL
            </label>
            <div className="flex gap-2">
              <Image className="w-5 h-5 text-gray-400 mt-2" />
              <input
                type="url"
                value={formData.thumbnailUrl}
                onChange={(e) =>
                  setFormData({ ...formData, thumbnailUrl: e.target.value })
                }
                placeholder="https://example.com/thumbnail.jpg"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledStartTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scheduledStartTime: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledEndTime}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scheduledEndTime: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Platforms */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Streaming Platforms <span className="text-red-500">*</span>
          </h2>
          <p className="text-sm text-gray-600">
            Select which platforms you want to stream to
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => togglePlatform(platform.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.platforms.includes(platform.id)
                    ? `border-${platform.color}-500 bg-${platform.color}-50`
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{platform.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">
                      {platform.name}
                    </div>
                    {formData.platforms.includes(platform.id) && (
                      <div className="text-xs text-green-600 font-medium">
                        ✓ Selected
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Settings</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isRecorded}
                onChange={(e) =>
                  setFormData({ ...formData, isRecorded: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">
                  Record Broadcast
                </div>
                <div className="text-sm text-gray-600">
                  Save the broadcast for later viewing
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div>
                <div className="font-medium text-gray-900">Public Broadcast</div>
                <div className="text-sm text-gray-600">
                  Anyone can view this broadcast
                </div>
              </div>
            </label>
          </div>

          {formData.platforms.includes("ZOOM") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-1" />
                Max Attendees (Zoom)
              </label>
              <input
                type="number"
                value={formData.maxAttendees}
                onChange={(e) =>
                  setFormData({ ...formData, maxAttendees: e.target.value })
                }
                placeholder="100"
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Creating..." : "Create Broadcast"}
          </button>
          <Link
            href="/dashboard/broadcasts"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
