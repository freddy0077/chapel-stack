import { useState, useEffect, useCallback } from "react";
import { AnySacramentRecord } from "@/types/sacraments";

interface AnniversaryNotification {
  id: string;
  recordId: string;
  sacramentType: string;
  memberName: string;
  memberEmail?: string;
  anniversaryDate: string;
  yearsAgo: number;
  daysUntil: number;
  isToday: boolean;
  isUpcoming: boolean;
  isPast: boolean;
  notificationSent: boolean;
  record: AnySacramentRecord;
}

interface UseAnniversaryNotificationsOptions {
  records: AnySacramentRecord[];
  enableEmailNotifications?: boolean;
  lookAheadDays?: number;
  lookBackDays?: number;
}

interface UseAnniversaryNotificationsReturn {
  notifications: AnniversaryNotification[];
  todayNotifications: AnniversaryNotification[];
  upcomingNotifications: AnniversaryNotification[];
  recentNotifications: AnniversaryNotification[];
  totalCount: number;
  sendNotification: (notification: AnniversaryNotification) => Promise<void>;
  markAsSent: (notificationId: string) => Promise<void>;
  dismissNotification: (notificationId: string) => void;
  refreshNotifications: () => void;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for managing sacrament anniversary notifications
 */
export const useAnniversaryNotifications = ({
  records,
  enableEmailNotifications = false,
  lookAheadDays = 30,
  lookBackDays = 7,
}: UseAnniversaryNotificationsOptions): UseAnniversaryNotificationsReturn => {
  const [notifications, setNotifications] = useState<AnniversaryNotification[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate anniversary notifications
  const calculateAnniversaries = useCallback(() => {
    try {
      const today = new Date();
      const currentYear = today.getFullYear();
      const anniversaries: AnniversaryNotification[] = [];

      records.forEach((record) => {
        const sacramentDate = new Date(record.dateOfSacrament);
        const yearsAgo = currentYear - sacramentDate.getFullYear();

        // Only calculate for records that are at least 1 year old
        if (yearsAgo >= 1) {
          // Calculate this year's anniversary date
          const anniversaryThisYear = new Date(
            currentYear,
            sacramentDate.getMonth(),
            sacramentDate.getDate(),
          );

          // Calculate days until anniversary
          const timeDiff = anniversaryThisYear.getTime() - today.getTime();
          const daysUntil = Math.ceil(timeDiff / (1000 * 3600 * 24));

          // Include anniversaries within the specified range
          if (daysUntil <= lookAheadDays && daysUntil >= -lookBackDays) {
            const memberName =
              record.memberName ||
              (record.member
                ? `${record.member.firstName} ${record.member.lastName}`
                : "Unknown Member");

            anniversaries.push({
              id: `${record.id}-${currentYear}`,
              recordId: record.id,
              sacramentType: record.sacramentType,
              memberName,
              memberEmail: record.member?.email,
              anniversaryDate: anniversaryThisYear.toISOString().split("T")[0],
              yearsAgo,
              daysUntil,
              isToday: daysUntil === 0,
              isUpcoming: daysUntil > 0 && daysUntil <= 7,
              isPast: daysUntil < 0 && daysUntil >= -lookBackDays,
              notificationSent: false, // This would come from backend in real implementation
              record,
            });
          }
        }
      });

      // Sort by days until anniversary (today first, then upcoming, then past)
      anniversaries.sort((a, b) => {
        if (a.isToday && !b.isToday) return -1;
        if (!a.isToday && b.isToday) return 1;
        return a.daysUntil - b.daysUntil;
      });

      setNotifications(anniversaries);
      setError(null);
    } catch (err) {
      setError("Failed to calculate anniversary notifications");
      console.error("Anniversary calculation error:", err);
    }
  }, [records, lookAheadDays, lookBackDays]);

  // Recalculate when records change
  useEffect(() => {
    calculateAnniversaries();
  }, [calculateAnniversaries]);

  // Send notification (email, SMS, etc.)
  const sendNotification = async (
    notification: AnniversaryNotification,
  ): Promise<void> => {
    setLoading(true);
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (enableEmailNotifications && notification.memberEmail) {
        // Simulate sending email notification
        console.log(
          `Sending anniversary notification to ${notification.memberEmail}`,
        );
      }

      // Update local state to mark as sent
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, notificationSent: true } : n,
        ),
      );

      setError(null);
    } catch (err) {
      setError("Failed to send notification");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as sent
  const markAsSent = async (notificationId: string): Promise<void> => {
    try {
      // In a real implementation, this would update the backend
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, notificationSent: true } : n,
        ),
      );
    } catch (err) {
      setError("Failed to mark notification as sent");
      throw err;
    }
  };

  // Dismiss notification
  const dismissNotification = (notificationId: string): void => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  // Refresh notifications
  const refreshNotifications = (): void => {
    calculateAnniversaries();
  };

  // Filtered notification arrays
  const todayNotifications = notifications.filter((n) => n.isToday);
  const upcomingNotifications = notifications.filter((n) => n.isUpcoming);
  const recentNotifications = notifications.filter((n) => n.isPast);

  return {
    notifications,
    todayNotifications,
    upcomingNotifications,
    recentNotifications,
    totalCount: notifications.length,
    sendNotification,
    markAsSent,
    dismissNotification,
    refreshNotifications,
    loading,
    error,
  };
};

export default useAnniversaryNotifications;
