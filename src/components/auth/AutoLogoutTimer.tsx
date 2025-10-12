"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClockIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContextEnhanced";

interface AutoLogoutTimerProps {
  /** Warning threshold in seconds (default: 60 seconds) */
  warningThreshold?: number;
  /** Show timer in compact mode (just icon + time) */
  compact?: boolean;
  /** Custom className for styling */
  className?: string;
}

/**
 * Auto-Logout Timer Component
 * Displays real-time countdown until automatic logout due to inactivity
 * Shows warning modal when time is running low
 */
export function AutoLogoutTimer({
  warningThreshold = 60,
  compact = false,
  className = "",
}: AutoLogoutTimerProps) {
  const { state, logout } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  /**
   * Calculate time remaining until auto-logout
   */
  const calculateTimeRemaining = useCallback((): number => {
    if (typeof window === "undefined" || !state.isAuthenticated) return 0;

    try {
      const lastActivityStr = localStorage.getItem("chapel_last_activity");
      if (!lastActivityStr) return 0;

      const lastActivity = parseInt(lastActivityStr, 10);
      const sessionTimeout = 5; // 5 minutes (from DEFAULT_AUTH_CONFIG)
      const sessionTimeoutMs = sessionTimeout * 60 * 1000;
      const expiresAt = lastActivity + sessionTimeoutMs;
      const remaining = Math.max(0, expiresAt - Date.now());

      return Math.floor(remaining / 1000); // Convert to seconds
    } catch (error) {
      console.error("Error calculating time remaining:", error);
      return 0;
    }
  }, [state.isAuthenticated]);

  /**
   * Format seconds into MM:SS
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  /**
   * Get color based on time remaining
   */
  const getColorClass = (seconds: number): string => {
    if (seconds <= warningThreshold / 2) return "text-red-600";
    if (seconds <= warningThreshold) return "text-yellow-600";
    return "text-green-600";
  };

  /**
   * Get background color for timer badge
   */
  const getBgColorClass = (seconds: number): string => {
    if (seconds <= warningThreshold / 2) return "bg-red-50 border-red-200";
    if (seconds <= warningThreshold) return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  };

  /**
   * Extend session by simulating user activity
   */
  const handleExtendSession = useCallback(() => {
    setIsExtending(true);
    
    // Update last activity timestamp
    if (typeof window !== "undefined") {
      localStorage.setItem("chapel_last_activity", Date.now().toString());
    }

    // Close warning modal
    setShowWarning(false);
    
    // Reset extending state after animation
    setTimeout(() => setIsExtending(false), 500);
  }, []);

  /**
   * Handle auto-logout when timer expires
   */
  const handleAutoLogout = useCallback(async () => {
    console.log("Auto-logout triggered due to inactivity");
    await logout({ redirect: "/auth/login" });
  }, [logout]);

  /**
   * Update timer every second
   */
  useEffect(() => {
    if (!state.isAuthenticated) {
      setTimeRemaining(0);
      setShowWarning(false);
      return;
    }

    // Initial calculation
    const remaining = calculateTimeRemaining();
    setTimeRemaining(remaining);

    // Update every second
    const interval = setInterval(() => {
      const newRemaining = calculateTimeRemaining();
      setTimeRemaining(newRemaining);

      // Show warning when threshold is reached
      if (newRemaining <= warningThreshold && newRemaining > 0 && !showWarning) {
        setShowWarning(true);
      }

      // Auto-logout when time expires
      if (newRemaining === 0) {
        handleAutoLogout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [
    state.isAuthenticated,
    calculateTimeRemaining,
    warningThreshold,
    showWarning,
    handleAutoLogout,
  ]);

  // Don't render if not authenticated
  if (!state.isAuthenticated) return null;

  return (
    <>
      {/* Timer Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-2 ${className}`}
      >
        {compact ? (
          // Compact mode: Icon + Time
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${getBgColorClass(timeRemaining)}`}
          >
            <ClockIcon className={`h-4 w-4 ${getColorClass(timeRemaining)}`} />
            <span
              className={`text-sm font-medium ${getColorClass(timeRemaining)}`}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        ) : (
          // Full mode: Label + Icon + Time
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getBgColorClass(timeRemaining)}`}
          >
            <ClockIcon className={`h-5 w-5 ${getColorClass(timeRemaining)}`} />
            <div className="flex flex-col">
              <span className="text-xs text-gray-600">Session expires in</span>
              <span
                className={`text-sm font-semibold ${getColorClass(timeRemaining)}`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Warning Modal */}
      <AnimatePresence>
        {showWarning && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowWarning(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                {/* Warning Icon */}
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-yellow-100 rounded-full p-3">
                    <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                  Session Expiring Soon
                </h3>

                {/* Message */}
                <p className="text-gray-600 text-center mb-6">
                  You will be automatically logged out in{" "}
                  <span className="font-bold text-yellow-600">
                    {formatTime(timeRemaining)}
                  </span>{" "}
                  due to inactivity.
                </p>

                {/* Countdown Progress Bar */}
                <div className="mb-6">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-yellow-500 to-red-500"
                      initial={{ width: "100%" }}
                      animate={{
                        width: `${(timeRemaining / warningThreshold) * 100}%`,
                      }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleExtendSession}
                    disabled={isExtending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExtending ? "Extending..." : "Stay Logged In"}
                  </button>
                  <button
                    onClick={() => logout({ redirect: "/auth/login" })}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
                  >
                    Logout Now
                  </button>
                </div>

                {/* Info Text */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  Click "Stay Logged In" to extend your session
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Hook to use auto-logout timer functionality
 */
export function useAutoLogoutTimer() {
  const { state } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (!state.isAuthenticated) {
      setTimeRemaining(0);
      return;
    }

    const calculateRemaining = (): number => {
      if (typeof window === "undefined") return 0;

      try {
        const lastActivityStr = localStorage.getItem("chapel_last_activity");
        if (!lastActivityStr) return 0;

        const lastActivity = parseInt(lastActivityStr, 10);
        const sessionTimeout = 5; // 5 minutes
        const sessionTimeoutMs = sessionTimeout * 60 * 1000;
        const expiresAt = lastActivity + sessionTimeoutMs;
        const remaining = Math.max(0, expiresAt - Date.now());

        return Math.floor(remaining / 1000);
      } catch {
        return 0;
      }
    };

    const interval = setInterval(() => {
      setTimeRemaining(calculateRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isAuthenticated]);

  return {
    timeRemaining,
    formattedTime: `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, "0")}`,
    isWarning: timeRemaining <= 60,
    isCritical: timeRemaining <= 30,
  };
}
