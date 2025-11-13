"use client";

import { useState, Suspense } from "react";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import { usePrayerRequests } from "@/graphql/hooks/usePrayerRequests";
import { usePrayerRequestMutations } from "@/graphql/hooks/usePrayerRequestMutations";
import Loading from "@/components/ui/Loading";
import {
  HeartIcon,
  PlusIcon,
  CheckCircleIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface PrayerRequest {
  id: string;
  title: string;
  description: string;
  isPublic: boolean;
  isAnswered: boolean;
  createdAt: string;
  answeredAt?: string;
}

// Mock data - fallback if backend is unavailable
const MOCK_PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: "1",
    title: "Healing for my mother",
    description:
      "My mother is recovering from surgery. Please pray for her quick recovery and strength.",
    isPublic: false,
    isAnswered: false,
    createdAt: "2025-11-08T10:00:00",
  },
  {
    id: "2",
    title: "Job Interview",
    description:
      "I have an important job interview coming up. Please pray for wisdom and confidence.",
    isPublic: true,
    isAnswered: false,
    createdAt: "2025-11-06T14:00:00",
  },
  {
    id: "3",
    title: "Family reconciliation",
    description:
      "Pray for healing and reconciliation in my family relationships.",
    isPublic: false,
    isAnswered: true,
    createdAt: "2025-10-28T09:00:00",
    answeredAt: "2025-11-05T16:00:00",
  },
];

function MemberPrayerRequestsContent() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isPublic: false,
  });

  // Fetch prayer requests from backend
  const { prayerRequests: backendRequests = [], loading: requestsLoading } = usePrayerRequests(user?.id);
  const { createPrayerRequest, markPrayerAsAnswered, deletePrayerRequest } = usePrayerRequestMutations();

  // Use backend requests or fallback to mock data
  const prayerRequests = Array.isArray(backendRequests) && backendRequests.length > 0 ? backendRequests : MOCK_PRAYER_REQUESTS;

  if (!user) {
    return <Loading message="Loading prayer requests..." />;
  }

  if (requestsLoading) {
    return <Loading message="Loading prayer requests..." />;
  }

  const activeRequests = prayerRequests.filter((r) => !r.isAnswered);
  const answeredRequests = prayerRequests.filter((r) => r.isAnswered);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Call GraphQL mutation to create prayer request
      await createPrayerRequest({
        variables: {
          input: {
            title: formData.title,
            description: formData.description,
            isPublic: formData.isPublic,
          },
        },
      });

      setFormData({ title: "", description: "", isPublic: false });
      setShowForm(false);
      alert("Prayer request submitted successfully!");
    } catch (error) {
      console.error("Error creating prayer request:", error);
      alert("Failed to submit prayer request. Please try again.");
    }
  };

  const handleMarkAsAnswered = async (id: string) => {
    try {
      // Call GraphQL mutation to mark as answered
      await markPrayerAsAnswered({
        variables: { id },
      });
    } catch (error) {
      console.error("Error marking prayer as answered:", error);
      alert("Failed to update prayer request. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Call GraphQL mutation to delete prayer request
      await deletePrayerRequest({
        variables: { id },
      });
    } catch (error) {
      console.error("Error deleting prayer request:", error);
      alert("Failed to delete prayer request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              Prayer Requests
            </h1>
            <p className="text-gray-600">
              Share your prayer requests with the church community
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
          >
            <PlusIcon className="w-5 h-5" />
            New Request
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            icon={<HeartIcon className="w-6 h-6 text-blue-500" />}
            label="Active Requests"
            value={activeRequests.length.toString()}
          />
          <StatCard
            icon={<CheckCircleIcon className="w-6 h-6 text-green-500" />}
            label="Answered"
            value={answeredRequests.length.toString()}
          />
          <StatCard
            icon={<HeartIcon className="w-6 h-6 text-red-500" />}
            label="Total Requests"
            value={prayerRequests.length.toString()}
          />
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Submit a Prayer Request
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prayer Request Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Healing for my mother"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Share more details about your prayer request..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Privacy */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) =>
                      setFormData({ ...formData, isPublic: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="font-medium text-gray-900">
                    Share with the community
                  </span>
                  <span className="text-sm text-gray-600">
                    (Allow other members to see and pray for this request)
                  </span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition"
                >
                  Submit Request
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-bold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Active Requests */}
        {activeRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Active Requests
            </h2>
            <div className="space-y-4">
              {activeRequests.map((request) => (
                <PrayerRequestCard
                  key={request.id}
                  request={request}
                  onMarkAsAnswered={handleMarkAsAnswered}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Answered Requests */}
        {answeredRequests.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Answered Prayers
            </h2>
            <div className="space-y-4">
              {answeredRequests.map((request) => (
                <PrayerRequestCard
                  key={request.id}
                  request={request}
                  onMarkAsAnswered={handleMarkAsAnswered}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {prayerRequests.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-blue-100">
            <HeartIcon className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No prayer requests yet
            </h3>
            <p className="text-gray-600 mb-6">
              Share your prayer requests with the community
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
            >
              <PlusIcon className="w-5 h-5" />
              Create Your First Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MemberPrayerRequestsPage() {
  return (
    <Suspense fallback={<Loading message="Loading prayer requests..." />}>
      <MemberPrayerRequestsContent />
    </Suspense>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">{icon}</div>
        <div>
          <p className="text-sm text-gray-600 font-semibold">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function PrayerRequestCard({
  request,
  onMarkAsAnswered,
  onDelete,
}: {
  request: PrayerRequest;
  onMarkAsAnswered: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const createdDate = new Date(request.createdAt);
  const formattedDate = createdDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`rounded-2xl shadow-lg border p-6 transition ${
        request.isAnswered
          ? "bg-green-50 border-green-200"
          : "bg-white border-blue-100"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {request.isAnswered && (
              <span className="px-3 py-1 bg-green-500 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                <CheckCircleIcon className="w-3 h-3" />
                Answered
              </span>
            )}
            {request.isPublic && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                Community
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {request.title}
          </h3>
          <p className="text-gray-600 mb-3">{request.description}</p>
          <p className="text-sm text-gray-500">
            {formattedDate}
            {request.answeredAt && (
              <>
                {" "}
                • Answered on{" "}
                {new Date(request.answeredAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
        {!request.isAnswered && (
          <button
            onClick={() => onMarkAsAnswered(request.id)}
            className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg font-semibold transition text-sm flex items-center gap-2"
          >
            <CheckCircleIcon className="w-4 h-4" />
            Mark as Answered
          </button>
        )}
        <button
          onClick={() => onDelete(request.id)}
          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition text-sm flex items-center gap-2"
        >
          <TrashIcon className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
