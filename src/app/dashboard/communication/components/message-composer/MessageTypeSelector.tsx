"use client";

import { EnvelopeIcon, ChatBubbleLeftRightIcon, BellIcon } from "@heroicons/react/24/outline";

export type MessageType = "email" | "sms" | "notification";

interface MessageTypeSelectorProps {
  messageType: MessageType;
  onChangeType: (type: MessageType) => void;
}

export default function MessageTypeSelector({ messageType, onChangeType }: MessageTypeSelectorProps) {
  return (
    <div className="mb-4 flex gap-2">
      <button
        type="button"
        className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
          messageType === "email" 
            ? "bg-indigo-50 border-indigo-500 text-indigo-700" 
            : "bg-gray-50 border-gray-300 text-gray-700"
        }`}
        onClick={() => onChangeType("email")}
      >
        <EnvelopeIcon className="inline-block h-4 w-4 mr-1" /> Email
      </button>
      <button
        type="button"
        className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
          messageType === "sms" 
            ? "bg-indigo-50 border-indigo-500 text-indigo-700" 
            : "bg-gray-50 border-gray-300 text-gray-700"
        }`}
        onClick={() => onChangeType("sms")}
      >
        <ChatBubbleLeftRightIcon className="inline-block h-4 w-4 mr-1" /> SMS
      </button>
      <button
        type="button"
        className={`flex-1 py-2 rounded-md text-sm font-medium border transition-colors ${
          messageType === "notification" 
            ? "bg-indigo-50 border-indigo-500 text-indigo-700" 
            : "bg-gray-50 border-gray-300 text-gray-700"
        }`}
        onClick={() => onChangeType("notification")}
      >
        <BellIcon className="inline-block h-4 w-4 mr-1" /> Notification
      </button>
    </div>
  );
}
