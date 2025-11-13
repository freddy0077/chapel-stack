"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardHeader from "@/components/DashboardHeader";
import {
  ChevronLeftIcon,
  CheckIcon,
  TrashIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Member Added",
      message: "John Doe has been successfully added to the system.",
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      actionUrl: "/dashboard/members",
      actionLabel: "View Members",
    },
    {
      id: "2",
      type: "info",
      title: "Report Generated",
      message: "Your financial report for November has been generated.",
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
      actionUrl: "/dashboard/report-builder",
      actionLabel: "View Report",
    },
    {
      id: "3",
      type: "warning",
      title: "Low Balance",
      message: "Branch account balance is below GHS 5,000.",
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      read: true,
      actionUrl: "/dashboard/finances",
      actionLabel: "View Finances",
    },
    {
      id: "4",
      type: "info",
      title: "Event Reminder",
      message: "Sunday Service starts in 2 hours.",
      timestamp: new Date(Date.now() - 4 * 60 * 60000),
      read: true,
    },
    {
      id: "5",
      type: "success",
      title: "Attendance Recorded",
      message: "Attendance for Sunday Service has been recorded.",
      timestamp: new Date(Date.now() - 24 * 60 * 60000),
      read: true,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />;
      case "warning":
        return <ExclamationTriangleIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
      case "error":
        return <ExclamationTriangleIcon className="h-5 w-5 text-rose-600 dark:text-rose-400" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700";
      case "warning":
        return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700";
      case "error":
        return "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700";
      default:
        return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <EnvelopeIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                  Notifications
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {unreadCount > 0
                    ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
                    : "All caught up!"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
              <EnvelopeIcon className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No notifications
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg border p-4 transition-all ${
                    notification.read
                      ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                      : `${getTypeColor(notification.type)} border`
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className={`font-semibold ${
                            notification.read
                              ? "text-gray-900 dark:text-gray-200"
                              : "text-gray-900 dark:text-white"
                          }`}>
                            {notification.title}
                          </h3>
                          <p className={`text-sm mt-1 ${
                            notification.read
                              ? "text-gray-600 dark:text-gray-400"
                              : "text-gray-700 dark:text-gray-300"
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>

                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className="flex-shrink-0 w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2" />
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-3">
                        {notification.actionUrl && (
                          <Link
                            href={notification.actionUrl}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                          >
                            {notification.actionLabel || "View"}
                          </Link>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors ml-auto"
                          title="Delete notification"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
