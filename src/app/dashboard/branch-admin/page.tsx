"use client";
import React from "react";
import {
  UsersIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftEllipsisIcon,
  SparklesIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import DashboardHeader from "@/components/DashboardHeader";

const pastelBg = [
  "bg-gradient-to-br from-indigo-100 via-white to-purple-100",
  "bg-gradient-to-br from-green-100 via-white to-emerald-100",
  "bg-gradient-to-br from-yellow-100 via-white to-orange-100",
  "bg-gradient-to-br from-pink-100 via-white to-rose-100",
  "bg-gradient-to-br from-purple-100 via-white to-indigo-100",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function BranchAdminDashboard() {
  // Placeholder stats and data
  const stats = [
    {
      label: "Members",
      value: 124,
      icon: <UsersIcon className="h-7 w-7 text-indigo-600" />,
      badge: "bg-indigo-100 text-indigo-700",
    },
    {
      label: "Attendance",
      value: "89%",
      icon: <CalendarIcon className="h-7 w-7 text-green-600" />,
      badge: "bg-green-100 text-green-700",
    },
    {
      label: "Giving",
      value: "GHS 12,450",
      icon: <CurrencyDollarIcon className="h-7 w-7 text-yellow-500" />,
      badge: "bg-yellow-100 text-yellow-700",
    },
    {
      label: "Prayer Requests",
      value: 17,
      icon: <ChatBubbleLeftEllipsisIcon className="h-7 w-7 text-pink-500" />,
      badge: "bg-pink-100 text-pink-700",
    },
    {
      label: "Events",
      value: 6,
      icon: <SparklesIcon className="h-7 w-7 text-purple-600" />,
      badge: "bg-purple-100 text-purple-700",
    },
  ];
  const recentMembers = [
    { name: "John Doe", joined: "2025-06-20" },
    { name: "Alice Brown", joined: "2025-06-18" },
    { name: "Kwame Mensah", joined: "2025-06-15" },
  ];
  const upcomingEvents = [
    { title: "Youth Service", date: "2025-07-01" },
    { title: "Bible Study", date: "2025-07-03" },
  ];
  const recentPrayerRequests = [
    { member: "John Doe", text: "Pray for healing." },
    { member: "Alice Brown", text: "Guidance for career decisions." },
  ];

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Branch Admin Dashboard"
        subtitle="Welcome back! Here’s an overview of your branch activity and stats."
        icon={<SparklesIcon className="h-10 w-10 text-yellow-300" />}
      />
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-14">
          {stats.map((stat, idx) => (
            <div
              key={stat.label}
              className={`rounded-2xl shadow-xl border border-indigo-100 p-6 flex flex-col items-center gap-2 text-center hover:scale-105 hover:shadow-2xl transition-all duration-200 bg-white/80 backdrop-blur-sm ${pastelBg[idx % pastelBg.length]}`}
            >
              <div className={`mb-2 rounded-full p-2 ${stat.badge} shadow`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-extrabold text-indigo-900 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
        {/* Quick Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Recent Members */}
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-indigo-100 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <UsersIcon className="h-6 w-6 text-indigo-600" />
              <span className="font-semibold text-indigo-800 text-lg">
                Recent Members
              </span>
            </div>
            <ul className="divide-y divide-indigo-50">
              {recentMembers.map((m, idx) => (
                <li key={idx} className="py-3 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg shadow">
                    <UserCircleIcon className="h-7 w-7 text-indigo-300 absolute opacity-30" />
                    <span className="relative z-10">{getInitials(m.name)}</span>
                  </span>
                  <span className="flex-1 font-medium text-indigo-900">
                    {m.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    Joined {new Date(m.joined).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Upcoming Events */}
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-green-100 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="h-6 w-6 text-green-600" />
              <span className="font-semibold text-green-700 text-lg">
                Upcoming Events
              </span>
            </div>
            <ul className="divide-y divide-green-50">
              {upcomingEvents.map((e, idx) => (
                <li key={idx} className="py-3 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-green-100 text-green-700 font-bold text-lg shadow">
                    <CalendarIcon className="h-5 w-5 text-green-400" />
                  </span>
                  <span className="flex-1 font-medium text-green-900">
                    {e.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(e.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {/* Recent Prayer Requests */}
          <div className="bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-pink-100 p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <ChatBubbleLeftEllipsisIcon className="h-6 w-6 text-pink-500" />
              <span className="font-semibold text-pink-700 text-lg">
                Recent Prayer Requests
              </span>
            </div>
            <ul className="divide-y divide-pink-50">
              {recentPrayerRequests.map((p, idx) => (
                <li key={idx} className="py-3 flex items-center gap-3">
                  <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-pink-100 text-pink-700 font-bold text-lg shadow">
                    <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-pink-400" />
                  </span>
                  <span className="flex-1 font-medium text-pink-900">
                    {p.member}
                  </span>
                  <span className="text-gray-700">{p.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
