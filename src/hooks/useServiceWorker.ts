"use client";

import { useEffect, useState } from "react";

interface ServiceWorkerStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

/**
 * Hook to register and manage service worker
 * Provides offline support and caching capabilities
 */
export function useServiceWorker() {
  const [status, setStatus] = useState<ServiceWorkerStatus>({
    isSupported: false,
    isRegistered: false,
    isUpdateAvailable: false,
    registration: null,
  });

  useEffect(() => {
    // Check if service workers are supported
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    setStatus((prev) => ({ ...prev, isSupported: true }));

    // Register service worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        setStatus((prev) => ({
          ...prev,
          isRegistered: true,
          registration,
        }));

        // Check for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                // New service worker available
                setStatus((prev) => ({
                  ...prev,
                  isUpdateAvailable: true,
                }));
              }
            });
          }
        });

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60000); // Check every minute
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    };

    registerServiceWorker();

    // Listen for controller change (new SW activated)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  }, []);

  /**
   * Manually update the service worker
   */
  const updateServiceWorker = async () => {
    if (status.registration?.waiting) {
      status.registration.waiting.postMessage({ type: "SKIP_WAITING" });
    }
  };

  /**
   * Unregister the service worker
   */
  const unregisterServiceWorker = async () => {
    if (status.registration) {
      await status.registration.unregister();
      setStatus({
        isSupported: true,
        isRegistered: false,
        isUpdateAvailable: false,
        registration: null,
      });
    }
  };

  return {
    ...status,
    updateServiceWorker,
    unregisterServiceWorker,
  };
}
