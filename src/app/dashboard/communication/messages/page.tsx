"use client";

import { useState } from "react";
import MessagesList, { Message } from "../components/MessagesList";
import { useMessages } from "../../../../graphql/hooks/useMessages";
import MessageModal from "../components/MessageModal";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import NewMessageModal from "../components/NewMessageModal";

export default function MessagesPage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const { messages, loading, error } = useMessages();

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Loading and error states */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <span className="text-gray-500">Loading messages...</span>
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center py-10">
          <span className="text-red-500">Failed to load messages.</span>
        </div>
      )}
      {/* Gradient header inspired by donations page */}
      <div className="sticky top-0 z-10 -mx-6 mb-8 pb-4 bg-gradient-to-br from-indigo-700 via-blue-600 to-purple-600 shadow-lg backdrop-blur-md rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex items-start gap-4 w-full md:w-auto">
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow">Messages</h1>
              <p className="text-white/90 max-w-2xl text-lg">View, search, and manage all your sent and received messages in one place. Use filters, search, and actions to stay organized and efficient.</p>
            </div>
          </div>
          <button
            className="inline-flex items-center rounded-xl bg-white px-5 py-3 text-indigo-700 font-bold shadow-lg hover:bg-indigo-50 transition text-lg"
            onClick={() => setNewMessageOpen(true)}
          >
            <PlusCircleIcon className="h-7 w-7 mr-2" />
            New Message
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl border border-indigo-100 overflow-hidden">
          <div className="px-8 pt-8 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-2xl font-bold text-indigo-900">All Messages</h2>
            {/* Search & Filter UI (styled like donations page) */}
            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full md:w-64 rounded-lg border border-indigo-200 bg-white px-4 py-2 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                disabled
              />
              <button
                className="rounded-lg bg-indigo-50 px-4 py-2 text-indigo-700 font-semibold shadow hover:bg-indigo-100 transition border border-indigo-100"
                disabled
              >
                Filter
              </button>
            </div>
          </div>
          <div className="px-8 pb-8">
            <MessagesList
              messages={messages}
              onViewMessage={setSelectedMessage}
            />
          </div>
        </div>
      </div>

      {/* Message Modal */}
      <MessageModal message={selectedMessage} onClose={() => setSelectedMessage(null)} />
      <NewMessageModal open={newMessageOpen} onClose={() => setNewMessageOpen(false)} />
    </div>
  );
}
