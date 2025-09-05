import React from "react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <rect x="3" y="3" width="6" height="6" rx="2" fill="#2563eb" />
        <rect x="11" y="3" width="6" height="6" rx="2" fill="#eab308" />
        <rect x="3" y="11" width="6" height="6" rx="2" fill="#38bdf8" />
        <rect x="11" y="11" width="6" height="6" rx="2" fill="#a3a3a3" />
      </svg>
    ),
  },
  {
    label: "Members",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="7" r="3" fill="#2563eb" />
        <ellipse cx="10" cy="15" rx="6" ry="3" fill="#e0e7ef" />
      </svg>
    ),
  },
  {
    label: "Finances",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <rect x="3" y="5" width="14" height="10" rx="2" fill="#eab308" />
        <rect x="7" y="9" width="6" height="2" rx="1" fill="#2563eb" />
      </svg>
    ),
  },
  {
    label: "Events",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <rect x="3" y="5" width="14" height="12" rx="2" fill="#38bdf8" />
        <rect x="6" y="2" width="2" height="4" rx="1" fill="#2563eb" />
        <rect x="12" y="2" width="2" height="4" rx="1" fill="#2563eb" />
      </svg>
    ),
  },
  {
    label: "Settings",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" stroke="#a3a3a3" strokeWidth="2" />
        <circle cx="10" cy="10" r="3" fill="#eab308" />
      </svg>
    ),
  },
];

export function DashboardSidebar({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "bg-white border-r w-64 min-h-screen flex flex-col py-8 px-4 shadow-2xl rounded-tr-3xl rounded-br-3xl",
        className,
      )}
    >
      <div className="mb-10 flex items-center gap-2">
        <span className="font-extrabold text-2xl text-blue-700 tracking-tight">
          ChapelStack
        </span>
      </div>
      <nav className="flex-1 space-y-3">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={`/${item.label.toLowerCase()}`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-100 text-gray-800 font-semibold transition text-lg group"
          >
            <span className="group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}
