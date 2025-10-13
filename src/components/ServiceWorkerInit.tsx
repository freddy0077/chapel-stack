"use client";

import { useEffect } from "react";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { toast } from "react-hot-toast";

/**
 * Component to initialize service worker and handle updates
 * Place this in your root layout or main app component
 */
export function ServiceWorkerInit() {
  const { isSupported, isRegistered, isUpdateAvailable, updateServiceWorker } =
    useServiceWorker();

  useEffect(() => {
    if (isRegistered) {
      console.log("✅ Service Worker registered successfully");
    }
  }, [isRegistered]);

  useEffect(() => {
    if (isUpdateAvailable) {
      toast(
        (t) => (
          <div className="flex flex-col gap-2">
            <p className="font-semibold">Update Available!</p>
            <p className="text-sm text-gray-600">
              A new version of ChapelStack is available.
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  updateServiceWorker();
                  toast.dismiss(t.id);
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Update Now
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          position: "bottom-center",
        }
      );
    }
  }, [isUpdateAvailable, updateServiceWorker]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      toast.success("You're back online!", {
        icon: "🌐",
        duration: 3000,
      });
    };

    const handleOffline = () => {
      toast.error("You're offline. Some features may be limited.", {
        icon: "📡",
        duration: 5000,
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // This component doesn't render anything
  return null;
}
