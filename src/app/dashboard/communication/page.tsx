"use client";

import React, { useState } from "react";
import CommunicationDashboard from "./Dashboard";
import ComposeMessage from "./ComposeMessage";
import Inbox from "./Inbox";
import Scheduler from "./Scheduler";
import AnalyticsDashboard from "./AnalyticsDashboard";
import ConversationView from "./ConversationView";

const TABS = [
  {
    key: "dashboard",
    label: "Overview",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <rect x="2" y="3" width="16" height="14" rx="4" fill="url(#a)" />
        <defs>
          <linearGradient
            id="a"
            x1="2"
            y1="3"
            x2="18"
            y2="17"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#a78bfa" />
            <stop offset="1" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    key: "compose",
    label: "Compose",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <path
          d="M4 15.5V16a1 1 0 001 1h.5l9.793-9.793a1 1 0 000-1.414l-1.086-1.086a1 1 0 00-1.414 0L4 15.5z"
          fill="url(#b)"
        />
        <defs>
          <linearGradient
            id="b"
            x1="4"
            y1="7"
            x2="16"
            y2="17"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#a78bfa" />
            <stop offset="1" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    key: "inbox",
    label: "Inbox",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <rect x="2" y="4" width="16" height="12" rx="4" fill="url(#c)" />
        <defs>
          <linearGradient
            id="c"
            x1="2"
            y1="4"
            x2="18"
            y2="16"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f472b6" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    key: "scheduler",
    label: "Scheduler",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <rect x="2" y="4" width="16" height="12" rx="4" fill="url(#d)" />
        <defs>
          <linearGradient
            id="d"
            x1="2"
            y1="4"
            x2="18"
            y2="16"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fbbf24" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    key: "analytics",
    label: "Analytics",
    icon: (
      <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
        <rect x="2" y="4" width="16" height="12" rx="4" fill="url(#e)" />
        <defs>
          <linearGradient
            id="e"
            x1="2"
            y1="4"
            x2="18"
            y2="16"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#38bdf8" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];

export default function CommunicationPage() {
  const [tab, setTab] = useState("dashboard");
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null,
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-100 p-0">
      <div className="max-w-7xl mx-auto py-10 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-400 bg-clip-text text-transparent tracking-tight mb-2">
              Messaging & Communication
            </h1>
            <p className="text-gray-500 max-w-2xl">
              Send email, SMS, push, and in-app messages to your church.
              Schedule campaigns, automate reminders, and track engagement—all
              from one modern dashboard.
            </p>
          </div>
          <div className="flex gap-2 bg-white/70 rounded-xl shadow p-2 backdrop-blur border border-violet-100">
            {TABS.map((t) => (
              <button
                key={t.key}
                className={`flex flex-col items-center px-4 py-2 rounded-lg font-medium transition-all text-sm focus:outline-none gap-1 min-w-[70px] ${
                  tab === t.key
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg scale-105"
                    : "text-violet-700 hover:bg-violet-50"
                }`}
                onClick={() => setTab(t.key)}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white/90 rounded-2xl shadow-2xl p-8 min-h-[500px] border border-violet-100">
          {tab === "dashboard" && (
            <CommunicationDashboard
              onCompose={() => setTab("compose")}
              onInbox={() => setTab("inbox")}
            />
          )}
          {tab === "compose" && (
            <ComposeMessage onBack={() => setTab("dashboard")} />
          )}
          {tab === "inbox" &&
            (activeConversation ? (
              <ConversationView
                conversationId={activeConversation}
                onBack={() => setActiveConversation(null)}
              />
            ) : (
              <Inbox onOpenConversation={setActiveConversation} />
            ))}
          {tab === "scheduler" && <Scheduler />}
          {tab === "analytics" && <AnalyticsDashboard />}
        </div>
      </div>
    </div>
  );
}
