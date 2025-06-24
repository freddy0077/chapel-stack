"use client";

import React from "react";
import Link from "next/link";
import { EnvelopeIcon, BellIcon, DocumentTextIcon, ChatBubbleLeftRightIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import CommunicationStats from "./components/CommunicationStats";
import { useCommunicationStats } from "@/graphql/hooks/useCommunicationStats";
import CommunicationTools from "./components/CommunicationTools";

import { redirect } from "next/navigation";

export default function CommunicationPage() {
  redirect("/dashboard/communication/messages");
  const { stats, loading: statsLoading, error: statsError } = useCommunicationStats();
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Gradient header */}
      <div className="sticky top-0 z-10 -mx-6 mb-10 pb-4 bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 shadow-lg backdrop-blur-md rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow mb-2 tracking-tight flex items-center gap-3">
              <EnvelopeIcon className="h-9 w-9 text-indigo-100 drop-shadow" />
              Communication Hub
            </h1>
            <p className="text-indigo-100/90 text-lg font-medium">Manage all church communications across branches</p>
          </div>
          <Link
            href="/dashboard/communication/messages/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/90 text-indigo-700 font-semibold shadow hover:bg-indigo-50 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            <PlusCircleIcon className="h-6 w-6 text-indigo-500" />
            New Message
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        {statsLoading ? (
          <div className="flex justify-center items-center h-32">
            <span className="text-gray-500">Loading communication stats...</span>
          </div>
        ) : statsError ? (
          <div className="flex justify-center items-center h-32">
            <span className="text-red-500">Failed to load stats.</span>
          </div>
        ) : stats ? (
          <CommunicationStats
            totalEmailsSent={stats.totalEmailsSent}
            totalSmsSent={stats.totalSmsSent}
            totalNotifications={stats.totalNotifications}
            deliveryRate={stats.deliveryRate}
            emailStatusCounts={stats.emailStatusCounts}
            smsStatusCounts={stats.smsStatusCounts}
            messagesByDate={stats.messagesByDate}
            activeTemplates={stats.activeTemplates}
          />
        ) : null}
      </div>

      {/* Feature Navigation Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard/communication/messages" className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start hover:shadow-xl transition">
          <EnvelopeIcon className="h-8 w-8 text-indigo-500 mb-3" />
          <span className="text-lg font-semibold text-gray-900 mb-1">Messaging</span>
          <span className="text-gray-500 text-sm">Emails, SMS, and direct messages</span>
        </Link>
        <Link href="/dashboard/communication/reminders" className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start hover:shadow-xl transition">
          <BellIcon className="h-8 w-8 text-blue-500 mb-3" />
          <span className="text-lg font-semibold text-gray-900 mb-1">Reminders</span>
          <span className="text-gray-500 text-sm">Birthday and anniversary notifications</span>
        </Link>
        <Link href="/dashboard/communication/newsletters" className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start hover:shadow-xl transition">
          <DocumentTextIcon className="h-8 w-8 text-green-500 mb-3" />
          <span className="text-lg font-semibold text-gray-900 mb-1">Newsletters</span>
          <span className="text-gray-500 text-sm">Branch-specific templates and distribution</span>
        </Link>
        <Link href="/dashboard/communication/branch-collaboration" className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start hover:shadow-xl transition">
          <ChatBubbleLeftRightIcon className="h-8 w-8 text-purple-500 mb-3" />
          <span className="text-lg font-semibold text-gray-900 mb-1">Branch Collaboration</span>
          <span className="text-gray-500 text-sm">Staff communication across branches</span>
        </Link>
      </div>

      {/* Communication Tools Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Messaging Tools</h2>
          <CommunicationTools />
        </div>
      </div>
    </div>
  );
}

