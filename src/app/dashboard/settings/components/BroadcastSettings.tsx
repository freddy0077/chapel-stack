"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CONNECTED_PLATFORMS } from "@/graphql/queries/platformQueries";
import {
  CONNECT_STREAMING_PLATFORM,
  DISCONNECT_STREAMING_PLATFORM,
} from "@/graphql/mutations/platformMutations";
import { toast } from "react-hot-toast";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  Plus,
  Trash2,
  Settings as SettingsIcon,
} from "lucide-react";

interface Platform {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  setupInstructions: string[];
  requiresApproval?: boolean;
}

const PLATFORMS: Platform[] = [
  {
    id: "ZOOM",
    name: "Zoom",
    icon: "🎥",
    color: "blue",
    description: "Host meetings and webinars with up to 1000 participants",
    setupInstructions: [
      "Go to Zoom App Marketplace",
      "Create a Server-to-Server OAuth app",
      "Copy Client ID, Client Secret, and Account ID",
      "Paste credentials below",
    ],
  },
  {
    id: "FACEBOOK",
    name: "Facebook Live",
    icon: "📘",
    color: "indigo",
    description: "Stream live to your Facebook Page",
    setupInstructions: [
      "Go to Facebook Developers",
      "Create an app with Live Video API permission",
      "Generate a Page Access Token",
      "Select your Facebook Page",
      "Paste access token below",
    ],
  },
  {
    id: "INSTAGRAM",
    name: "Instagram Live",
    icon: "📷",
    color: "pink",
    description: "Stream live to your Instagram account",
    requiresApproval: true,
    setupInstructions: [
      "Instagram Live API requires Meta approval",
      "Alternative: Use Instagram mobile app",
      "Alternative: Use Restream.io or StreamYard",
      "Apply for API access at developers.facebook.com",
    ],
  },
  {
    id: "YOUTUBE",
    name: "YouTube Live",
    icon: "▶️",
    color: "red",
    description: "Stream live to your YouTube channel",
    setupInstructions: [
      "Go to Google Cloud Console",
      "Enable YouTube Data API v3",
      "Create OAuth 2.0 credentials",
      "Authorize your YouTube channel",
      "Paste access token below",
    ],
  },
];

export default function BroadcastSettings() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);

  const { data, loading, refetch } = useQuery(GET_CONNECTED_PLATFORMS);

  const [connectPlatform, { loading: connecting }] = useMutation(
    CONNECT_STREAMING_PLATFORM,
    {
      onCompleted: () => {
        toast.success(`${selectedPlatform?.name} connected successfully!`);
        setShowConnectModal(false);
        setSelectedPlatform(null);
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to connect platform");
      },
    }
  );

  const [disconnectPlatform, { loading: disconnecting }] = useMutation(
    DISCONNECT_STREAMING_PLATFORM,
    {
      onCompleted: () => {
        toast.success("Platform disconnected");
        refetch();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to disconnect platform");
      },
    }
  );

  const connectedPlatforms = data?.connectedPlatforms || [];

  const isPlatformConnected = (platformId: string) => {
    return connectedPlatforms.some(
      (p: any) => p.platform === platformId && p.isActive && !p.isExpired
    );
  };

  const getPlatformStatus = (platformId: string) => {
    const connected = connectedPlatforms.find((p: any) => p.platform === platformId);
    if (!connected) return { status: "NOT_CONNECTED", color: "gray" };
    if (!connected.isActive) return { status: "DISCONNECTED", color: "gray" };
    if (connected.isExpired) return { status: "EXPIRED", color: "orange" };
    return { status: "CONNECTED", color: "green" };
  };

  const handleConnect = (platform: Platform) => {
    if (platform.requiresApproval) {
      toast.error(
        `${platform.name} requires Meta approval. Please use alternative methods.`,
        { duration: 5000 }
      );
      return;
    }
    setSelectedPlatform(platform);
    setShowConnectModal(true);
  };

  const handleDisconnect = async (platformId: string) => {
    if (confirm("Are you sure you want to disconnect this platform?")) {
      await disconnectPlatform({
        variables: { platform: platformId },
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header (embedded) */}
      <div className="rounded-2xl border border-indigo-100 bg-white/80 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg bg-indigo-600/10 flex items-center justify-center">
            <SettingsIcon className="h-6 w-6 text-indigo-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Streaming Settings</h2>
            <p className="text-sm text-gray-600">Connect your streaming platforms to broadcast live</p>
          </div>
        </div>
      </div>

      {/* Connected Platforms Summary */}
      <div className="bg-white/80 rounded-2xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Connected Platforms</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLATFORMS.map((platform) => {
            const status = getPlatformStatus(platform.id);
            const isConnected = isPlatformConnected(platform.id);

            return (
              <div
                key={platform.id}
                className={`p-4 rounded-lg border-2 ${
                  isConnected ? "border-green-500 bg-green-50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{platform.icon}</span>
                  {isConnected ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : status.status === "EXPIRED" ? (
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="font-semibold text-gray-900">{platform.name}</div>
                <div className={`text-xs font-medium text-${status.color}-600 mt-1`}>
                  {status.status.replace("_", " ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLATFORMS.map((platform) => {
          const isConnected = isPlatformConnected(platform.id);
          const status = getPlatformStatus(platform.id);

          return (
            <div key={platform.id} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              {/* Platform Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{platform.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{platform.name}</h3>
                    <p className="text-sm text-gray-600">{platform.description}</p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Connected
                  </span>
                ) : status.status === "EXPIRED" ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    <AlertTriangle className="w-4 h-4" />
                    Token Expired
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    <XCircle className="w-4 h-4" />
                    Not Connected
                  </span>
                )}
              </div>

              {/* Setup Instructions */}
              {platform.requiresApproval && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-orange-900 mb-2">Requires Meta Approval</div>
                      <ul className="space-y-1 text-sm text-orange-800">
                        {platform.setupInstructions.map((step, index) => (
                          <li key={index}>• {step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {isConnected ? (
                  <>
                    <button
                      onClick={() => handleConnect(platform)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Reconnect
                    </button>
                    <button
                      onClick={() => handleDisconnect(platform.id)}
                      disabled={disconnecting}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(platform)}
                    disabled={platform.requiresApproval}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    Connect {platform.name}
                  </button>
                )}
              </div>

              {/* Documentation Link */}
              {!platform.requiresApproval && (
                <a
                  href={`https://docs.example.com/integrations/${platform.id.toLowerCase()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Setup Guide
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Connect Modal */}
      {showConnectModal && selectedPlatform && (
        <ConnectPlatformModal
          platform={selectedPlatform}
          onClose={() => {
            setShowConnectModal(false);
            setSelectedPlatform(null);
          }}
          onConnect={connectPlatform}
          connecting={connecting}
        />
      )}
    </div>
  );
}

function ConnectPlatformModal({
  platform,
  onClose,
  onConnect,
  connecting,
}: {
  platform: Platform;
  onClose: () => void;
  onConnect: any;
  connecting: boolean;
}) {
  const [formData, setFormData] = useState({
    accessToken: "",
    refreshToken: "",
    platformUserId: "",
    platformUserName: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accessToken) {
      toast.error("Access token is required");
      return;
    }

    onConnect({
      variables: {
        input: {
          platform: platform.id,
          accessToken: formData.accessToken,
          refreshToken: formData.refreshToken || null,
          platformUserId: formData.platformUserId || null,
          platformUserName: formData.platformUserName || null,
        },
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{platform.icon}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Connect {platform.name}</h2>
                <p className="text-sm text-gray-600">{platform.description}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          {/* Setup Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="font-medium text-blue-900 mb-2">Setup Instructions</div>
            <ol className="space-y-2 text-sm text-blue-800">
              {platform.setupInstructions.map((step, index) => (
                <li key={index} className="flex gap-2">
                  <span className="font-medium">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.accessToken}
                onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                placeholder="Paste your access token here"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refresh Token (Optional)
              </label>
              <input
                type="text"
                value={formData.refreshToken}
                onChange={(e) => setFormData({ ...formData, refreshToken: e.target.value })}
                placeholder="Paste refresh token if available"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User ID (Optional)</label>
                <input
                  type="text"
                  value={formData.platformUserId}
                  onChange={(e) => setFormData({ ...formData, platformUserId: e.target.value })}
                  placeholder="Platform user ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username (Optional)</label>
                <input
                  type="text"
                  value={formData.platformUserName}
                  onChange={(e) => setFormData({ ...formData, platformUserName: e.target.value })}
                  placeholder="Platform username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={connecting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {connecting ? "Connecting..." : `Connect ${platform.name}`}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
