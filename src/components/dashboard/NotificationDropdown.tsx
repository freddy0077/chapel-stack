import React, { useState } from "react";

const notifications = [
  { message: "New member joined: Sarah Mensah", time: "2m ago" },
  { message: "₵500 received from John Doe", time: "10m ago" },
  { message: "Pending staff approval: James Owusu", time: "5m ago" },
];

export const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" tabIndex={0} onBlur={() => setOpen(false)} aria-label="Notifications">
      <button
        className="relative p-2 rounded-full hover:bg-primary/10 transition focus:outline-none"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open notifications"
      >
        <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"/></svg>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-black/90 backdrop-blur-lg rounded-lg shadow-lg z-20 p-3">
          <div className="font-semibold mb-2 text-gray-700 dark:text-gray-200">Notifications</div>
          <ul className="space-y-2">
            {notifications.map((n, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                <span>{n.message}</span>
                <span className="text-xs text-gray-400 ml-auto">{n.time}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
