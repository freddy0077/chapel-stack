"use client";

import { WifiIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Redirect to previous page or dashboard
      window.history.back();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-yellow-500/20 rounded-full p-6">
            <WifiIcon className="h-16 w-16 text-yellow-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          {isOnline ? "Back Online!" : "You're Offline"}
        </h1>

        {/* Message */}
        <p className="text-blue-200 mb-8">
          {isOnline
            ? "Your connection has been restored. Redirecting..."
            : "It looks like you've lost your internet connection. Some features may be limited until you're back online."}
        </p>

        {/* Status */}
        <div className="bg-white/5 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-200">Connection Status</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isOnline
                  ? "bg-green-500/20 text-green-300"
                  : "bg-yellow-500/20 text-yellow-300"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Actions */}
        {!isOnline && (
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg"
            >
              Try Again
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 text-sm text-blue-300">
          <p>
            💡 Tip: Some data may be available from cache while offline
          </p>
        </div>
      </div>
    </div>
  );
}
